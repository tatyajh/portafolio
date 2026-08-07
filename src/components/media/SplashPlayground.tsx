"use client";

import { useEffect, useRef } from 'react';
import { Application, Assets, Container, Graphics, RenderTexture, Sprite, Texture } from 'pixi.js';
import { RGBSplitFilter } from 'pixi-filters';
import { useCursorParallax } from '@/hooks/useCursorParallax';
import { getBackgroundAssetGroups, type BackgroundAssetGroup } from '@/lib/backgroundAssets';

// Sin flipbook/GIF a propósito (feedback directo: "no quiero ese
// efecto gif en el splash") — cada ícono muestra una pose fija, no
// cicla frames. La densidad viene de mostrar VARIAS poses estáticas
// por categoría como instancias separadas, no de animar una sola.
const INSTANCES_PER_CATEGORY_DESKTOP = 3;
const INSTANCES_PER_CATEGORY_MOBILE = 2;

const ICON_SIZE_DESKTOP = 60;
const ICON_SIZE_MOBILE = 44;
// Piezas alargadas (aguja, hilo) se escalan manteniendo su proporción
// real — el eje corto puede terminar en unos pocos px de ancho,
// imposible de acertar con el dedo. El hit-test usa como mínimo esta
// mitad-de-lado en cada eje, sin importar qué tan delgado se vea.
const MIN_HIT_HALF = 30;
const DRAG_THRESHOLD_PX = 5;
const MAX_SPEED_PX_MS = 1.4;
const PARALLAX_DEPTH = 24;
const RECOVERY_RATE = 0.18;
const IDLE_ALPHA = 0.6;

type Category = BackgroundAssetGroup['category'];

interface Personality {
  /** Cada cuánto se estampa un eco deformado del ícono en el lienzo. */
  stampIntervalMs: number;
  /** Fuerza de la aberración cromática del eco (px de separación RGB). */
  splitStrength: number;
  /** Grosor base del trazo de luz. */
  strokeWidth: number;
  /** Color del trazo/eco. */
  tint: number;
}

// Paleta ya existente del proyecto (@theme en globals.css), reutilizada
// como color del rastro — analógico/cálido, no neón.
const PALETTE = {
  burgundy: 0x8b0000,
  gold: 0xe8c9a0,
  goldMid: 0xd4a574,
  goldDeep: 0xc4874a,
  brown: 0xa0522d,
  ivory: 0xf5f0e6,
};

// "Personalidad" por categoría — datos, no nueve rutas de código.
const PERSONALITY: Record<Category, Personality> = {
  tijeras: { stampIntervalMs: 70, splitStrength: 10, strokeWidth: 5, tint: PALETTE.burgundy },
  aguja: { stampIntervalMs: 110, splitStrength: 5, strokeWidth: 3, tint: PALETTE.goldDeep },
  hilo: { stampIntervalMs: 95, splitStrength: 6, strokeWidth: 6, tint: PALETTE.goldMid },
  carrete: { stampIntervalMs: 95, splitStrength: 6, strokeWidth: 7, tint: PALETTE.brown },
  patron: { stampIntervalMs: 120, splitStrength: 4, strokeWidth: 8, tint: PALETTE.ivory },
  codigo: { stampIntervalMs: 55, splitStrength: 15, strokeWidth: 4, tint: PALETTE.gold },
  saxofon: { stampIntervalMs: 85, splitStrength: 8, strokeWidth: 6, tint: PALETTE.goldDeep },
  nota: { stampIntervalMs: 75, splitStrength: 9, strokeWidth: 5, tint: PALETTE.goldMid },
  gamepad: { stampIntervalMs: 60, splitStrength: 16, strokeWidth: 5, tint: PALETTE.burgundy },
};

interface PlacedInstance {
  category: Category;
  url: string;
}

// Toma N poses estáticas repartidas (no consecutivas) de cada
// categoría, como instancias distintas — más variedad visual sin
// animar nada.
function pickInstances(groups: BackgroundAssetGroup[], perCategory: number): PlacedInstance[] {
  const out: PlacedInstance[] = [];
  for (const group of groups) {
    const frames = group.frames;
    for (let n = 0; n < perCategory; n++) {
      const idx = Math.floor((n * frames.length) / perCategory) % frames.length;
      out.push({ category: group.category, url: frames[idx] });
    }
  }
  return out;
}

// Posición en grilla con jitter determinista. El rango vertical se
// mantiene dentro de una banda segura (8%-80%): en móvil, contenido
// "fixed" de pantalla completa puede calcularse más alto que lo que el
// navegador realmente muestra (barra de direcciones/tabs) y, al no
// haber scroll aquí, esa parte quedaría inalcanzable.
function gridPosition(i: number, cols: number, rows: number) {
  const col = i % cols;
  const row = Math.floor(i / cols) % rows;
  const jitterX = ((i * 37) % 14) - 7;
  const jitterY = ((i * 53) % 10) - 5;
  const topBand = rows <= 1 ? 44 : 8 + (row / (rows - 1)) * 72;
  return {
    leftPct: (col + 0.5) * (100 / cols) + jitterX,
    topPct: topBand + jitterY,
  };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface IconState {
  sprite: Sprite;
  category: Category;
  leftPct: number;
  topPct: number;
  baseSpriteScale: number;
  skewX: number;
  skewY: number;
  grabbed: boolean;
  // Una vez soltado tras un arrastre, deja de volver a su posición de
  // grilla — se queda exactamente donde se soltó.
  pinned: boolean;
  dragOffsetX: number;
  dragOffsetY: number;
  lastMoveT: number;
  vx: number;
  vy: number;
  lastStampAt: number;
  // Último punto pintado en el lienzo, para trazar el segmento nuevo.
  strokeX: number;
  strokeY: number;
  hasStroke: boolean;
}

// Playground decorativo exclusivo del splash ("inicio"): íconos reales
// de fondo (mismas categorías que CollageDecor, layer aparte — no toca
// CollageDecor, que sigue siendo el sistema DOM del resto del sitio),
// estáticos en reposo, arrastrables, y que van PINTANDO un rastro que
// se queda dibujado, tipo light-painting.
export default function SplashPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallax = useCursorParallax();

  useEffect(() => {
    if (!containerRef.current) return;
    const containerEl: HTMLDivElement = containerRef.current;

    let cancelled = false;
    let appInstance: Application | null = null;
    const listeners: Array<{ type: string; handler: EventListener; opts?: boolean | AddEventListenerOptions }> = [];
    const observers: ResizeObserver[] = [];

    const isMobile = window.innerWidth < 768;
    const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP;
    const instancesPerCategory = isMobile ? INSTANCES_PER_CATEGORY_MOBILE : INSTANCES_PER_CATEGORY_DESKTOP;
    const gridCols = isMobile ? 4 : 6;

    // Todo el montaje/simulación va en try/catch: es una capa decorativa
    // opcional — si algo de Pixi falla, no debe tumbar el resto de la
    // página (causa real de una pantalla en negro reportada en vivo).
    (async () => {
      try {
        const app = new Application();
        await app.init({
          backgroundAlpha: 0,
          resizeTo: containerEl,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          antialias: true,
        });

        if (cancelled) {
          app.destroy(true, { children: true });
          return;
        }
        appInstance = app;

        app.canvas.style.position = 'absolute';
        app.canvas.style.inset = '0';
        // 100% explícito: `resizeTo` mide el contenedor en el momento
        // del init y en resize de window, pero en móvil el alto real
        // cambia sin disparar resize (barra de direcciones que se
        // oculta, teclado, etc.) — eso dejaba una franja negra abajo
        // sin cubrir. Con 100% el canvas siempre llena el contenedor,
        // y el ResizeObserver de abajo mantiene el buffer interno al
        // día para que no se vea estirado.
        app.canvas.style.width = '100%';
        app.canvas.style.height = '100%';
        app.canvas.style.pointerEvents = 'none';
        containerEl.appendChild(app.canvas);

        const resizeObserver = new ResizeObserver(() => {
          try {
            app.resize();
          } catch (err) {
            console.error('[SplashPlayground] error al redimensionar', err);
          }
        });
        resizeObserver.observe(containerEl);
        observers.push(resizeObserver);

        const groups = getBackgroundAssetGroups('inicio');
        if (groups.length === 0) return;

        const placed = pickInstances(groups, instancesPerCategory);
        const gridRows = Math.max(1, Math.ceil(placed.length / gridCols));

        const urls = Array.from(new Set(placed.map((p) => p.url)));
        const textureMap = (await Assets.load(urls)) as Record<string, Texture>;
        if (cancelled) return;

        // ── Lienzo acumulativo ──────────────────────────────────────
        // Aquí está la diferencia con la versión anterior: en vez de
        // sprites "fantasma" que se desvanecen, cada trazo se dibuja
        // UNA vez sobre esta textura y nunca se borra (render con
        // clear:false). El rastro queda pintado, como light-painting.
        let trailTexture = RenderTexture.create({
          width: app.screen.width,
          height: app.screen.height,
          resolution: app.renderer.resolution,
        });
        const trailSprite = new Sprite(trailTexture);
        trailSprite.blendMode = 'add'; // luz que se suma al fondo, no lo tapa
        app.stage.addChild(trailSprite);

        const iconLayer = new Container();
        app.stage.addChild(iconLayer);

        // Objetos reutilizados para pintar (nunca se crean por frame).
        const strokeGfx = new Graphics();
        const stampSprite = new Sprite();
        stampSprite.anchor.set(0.5);
        const stampFilter = new RGBSplitFilter();
        stampSprite.filters = [stampFilter];

        const icons: IconState[] = placed.map((instance, i) => {
          const texture = textureMap[instance.url];
          const sprite = new Sprite(texture);
          sprite.anchor.set(0.5);
          const maxDim = Math.max(texture.width, texture.height) || 1;
          const baseSpriteScale = iconSize / maxDim;
          sprite.scale.set(baseSpriteScale);
          sprite.alpha = IDLE_ALPHA;
          const { leftPct, topPct } = gridPosition(i, gridCols, gridRows);
          iconLayer.addChild(sprite);
          return {
            sprite,
            category: instance.category,
            leftPct,
            topPct,
            baseSpriteScale,
            skewX: 0,
            skewY: 0,
            grabbed: false,
            pinned: false,
            dragOffsetX: 0,
            dragOffsetY: 0,
            lastMoveT: 0,
            vx: 0,
            vy: 0,
            lastStampAt: 0,
            strokeX: 0,
            strokeY: 0,
            hasStroke: false,
          };
        });

        // Pinta en el lienzo permanente el segmento recorrido: tres
        // trazos concéntricos (ancho y tenue → fino y brillante) para
        // el halo de luz, sumados con blend aditivo.
        function paintStroke(icon: IconState, x: number, y: number, speedNorm: number) {
          const p = PERSONALITY[icon.category];
          const w = p.strokeWidth * (0.6 + speedNorm * 1.1);
          strokeGfx.clear();
          strokeGfx
            .moveTo(icon.strokeX, icon.strokeY)
            .lineTo(x, y)
            .stroke({ width: w * 3.2, color: p.tint, alpha: 0.05, cap: 'round', join: 'round' });
          strokeGfx
            .moveTo(icon.strokeX, icon.strokeY)
            .lineTo(x, y)
            .stroke({ width: w * 1.6, color: p.tint, alpha: 0.1, cap: 'round', join: 'round' });
          strokeGfx
            .moveTo(icon.strokeX, icon.strokeY)
            .lineTo(x, y)
            .stroke({ width: Math.max(w * 0.45, 1), color: PALETTE.ivory, alpha: 0.14, cap: 'round', join: 'round' });
          strokeGfx.blendMode = 'add';
          app.renderer.render({ container: strokeGfx, target: trailTexture, clear: false });
        }

        // Estampa un eco deformado del ícono (aberración cromática +
        // estiramiento según velocidad) que también se queda fijo.
        function stampEcho(icon: IconState, speedNorm: number) {
          const p = PERSONALITY[icon.category];
          stampSprite.texture = icon.sprite.texture;
          stampSprite.x = icon.sprite.x;
          stampSprite.y = icon.sprite.y;
          stampSprite.rotation = icon.sprite.rotation;
          stampSprite.scale.set(icon.sprite.scale.x, icon.sprite.scale.y);
          stampSprite.skew.set(icon.skewX, icon.skewY);
          stampSprite.tint = p.tint;
          stampSprite.alpha = 0.16 + speedNorm * 0.22;
          stampSprite.blendMode = 'add';
          stampFilter.red = { x: -p.splitStrength * speedNorm, y: 0 };
          stampFilter.blue = { x: p.splitStrength * speedNorm, y: 0 };
          stampFilter.green = { x: 0, y: p.splitStrength * 0.4 * speedNorm };
          app.renderer.render({ container: stampSprite, target: trailTexture, clear: false });
        }

        // Estado del gesto activo — un único puntero a la vez, con
        // supresión de "click" cuando hubo arrastre real.
        let activeGesture: { pointerId: number; icon: IconState | null; startX: number; startY: number; suppressClick: boolean } | null = null;
        let pendingSuppressClick = false;

        function toLocal(e: PointerEvent) {
          // Conversión oficial de Pixi (la misma que usa su propio
          // sistema de eventos): además del offset, corrige la relación
          // entre el buffer interno del canvas y su tamaño en CSS y la
          // resolución. Restar a mano contra getBoundingClientRect
          // asumía esa relación 1:1 y era la causa real del "el objeto
          // está a 5 metros de distancia".
          const point = { x: 0, y: 0 };
          app.renderer.events.mapPositionToPoint(point, e.clientX, e.clientY);
          return point;
        }

        function findHit(x: number, y: number): IconState | null {
          let best: IconState | null = null;
          let bestDist = Infinity;
          for (const icon of icons) {
            if (icon.grabbed) continue;
            const halfW = Math.max(icon.sprite.width / 2, MIN_HIT_HALF);
            const halfH = Math.max(icon.sprite.height / 2, MIN_HIT_HALF);
            if (Math.abs(x - icon.sprite.x) <= halfW && Math.abs(y - icon.sprite.y) <= halfH) {
              // Con áreas de toque ampliadas, dos íconos vecinos pueden
              // cubrir el mismo punto — gana el más cercano al dedo, no
              // el primero de la lista.
              const d = Math.hypot(x - icon.sprite.x, y - icon.sprite.y);
              if (d < bestDist) {
                bestDist = d;
                best = icon;
              }
            }
          }
          return best;
        }

        // Cada handler va envuelto en try/catch: corren fuera del
        // try/catch de montaje (se ejecutan después, en respuesta a
        // eventos reales), así que un fallo aquí necesita su propia red.
        const onPointerDown = (evt: Event) => {
          try {
            const e = evt as PointerEvent;
            const { x, y } = toLocal(e);
            const icon = findHit(x, y);
            activeGesture = { pointerId: e.pointerId, icon, startX: x, startY: y, suppressClick: !!icon };
            if (icon) {
              e.preventDefault();
              icon.grabbed = true;
              icon.dragOffsetX = icon.sprite.x - x;
              icon.dragOffsetY = icon.sprite.y - y;
              icon.lastMoveT = performance.now();
              icon.vx = 0;
              icon.vy = 0;
              icon.strokeX = icon.sprite.x;
              icon.strokeY = icon.sprite.y;
              icon.hasStroke = true;
              iconLayer.addChild(icon.sprite); // al frente mientras se arrastra
            }
          } catch (err) {
            console.error('[SplashPlayground] error en pointerdown', err);
          }
        };

        const onPointerMove = (evt: Event) => {
          try {
            const e = evt as PointerEvent;
            if (!activeGesture || e.pointerId !== activeGesture.pointerId) return;
            const { x, y } = toLocal(e);
            if (!activeGesture.suppressClick) {
              const dist = Math.hypot(x - activeGesture.startX, y - activeGesture.startY);
              if (dist > DRAG_THRESHOLD_PX) activeGesture.suppressClick = true;
            }
            const icon = activeGesture.icon;
            if (!icon) return;

            const now = performance.now();
            const dt = Math.max(now - icon.lastMoveT, 1);
            const nx = x + icon.dragOffsetX;
            const ny = y + icon.dragOffsetY;
            icon.vx = (nx - icon.sprite.x) / dt;
            icon.vy = (ny - icon.sprite.y) / dt;
            icon.sprite.x = nx;
            icon.sprite.y = ny;
            icon.lastMoveT = now;

            const speedNorm = Math.min(Math.hypot(icon.vx, icon.vy) / MAX_SPEED_PX_MS, 1);
            if (icon.hasStroke) paintStroke(icon, nx, ny, speedNorm);
            icon.strokeX = nx;
            icon.strokeY = ny;

            const p = PERSONALITY[icon.category];
            if (now - icon.lastStampAt >= p.stampIntervalMs) {
              icon.lastStampAt = now;
              stampEcho(icon, speedNorm);
            }
          } catch (err) {
            console.error('[SplashPlayground] error en pointermove', err);
          }
        };

        const endGesture = () => {
          if (!activeGesture) return;
          if (activeGesture.icon) {
            activeGesture.icon.grabbed = false;
            activeGesture.icon.pinned = true;
            activeGesture.icon.hasStroke = false;
          }
          pendingSuppressClick = activeGesture.suppressClick;
          activeGesture = null;
        };

        const onPointerUp = (evt: Event) => {
          try {
            const e = evt as PointerEvent;
            if (!activeGesture || e.pointerId !== activeGesture.pointerId) return;
            endGesture();
          } catch (err) {
            console.error('[SplashPlayground] error en pointerup', err);
          }
        };

        const onPointerCancel = (evt: Event) => {
          try {
            const e = evt as PointerEvent;
            if (!activeGesture || e.pointerId !== activeGesture.pointerId) return;
            endGesture();
          } catch (err) {
            console.error('[SplashPlayground] error en pointercancel', err);
          }
        };

        // Fase de captura: corre ANTES que cualquier onClick delegado
        // de React, así arrastrar un ícono nunca dispara acciones de la
        // UI que hay debajo.
        const onClickCapture = (evt: Event) => {
          try {
            if (pendingSuppressClick) {
              evt.stopPropagation();
              pendingSuppressClick = false;
            }
          } catch (err) {
            console.error('[SplashPlayground] error en onClickCapture', err);
          }
        };

        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
        window.addEventListener('click', onClickCapture, { capture: true });
        listeners.push(
          { type: 'pointerdown', handler: onPointerDown },
          { type: 'pointermove', handler: onPointerMove },
          { type: 'pointerup', handler: onPointerUp },
          { type: 'pointercancel', handler: onPointerCancel },
          { type: 'click', handler: onClickCapture, opts: { capture: true } },
        );

        // Si cambia el tamaño (rotar el teléfono, redimensionar), el
        // lienzo debe seguir cubriendo la pantalla. Se recrea — el
        // rastro acumulado se pierde, que es lo esperable al cambiar
        // por completo el área de dibujo.
        let lastW = app.screen.width;
        let lastH = app.screen.height;

        app.ticker.add(() => {
          try {
            const screenW = app.screen.width;
            const screenH = app.screen.height;

            if (screenW !== lastW || screenH !== lastH) {
              lastW = screenW;
              lastH = screenH;
              const old = trailTexture;
              trailTexture = RenderTexture.create({
                width: screenW,
                height: screenH,
                resolution: app.renderer.resolution,
              });
              trailSprite.texture = trailTexture;
              old.destroy(true);
            }

            const px = parallax.x.get() * PARALLAX_DEPTH;
            const py = parallax.y.get() * PARALLAX_DEPTH;

            for (const icon of icons) {
              if (!icon.grabbed) {
                if (!icon.pinned) {
                  icon.sprite.x = (icon.leftPct / 100) * screenW + px;
                  icon.sprite.y = (icon.topPct / 100) * screenH + py;
                }
                icon.sprite.alpha = IDLE_ALPHA;

                icon.skewX = lerp(icon.skewX, 0, RECOVERY_RATE);
                icon.skewY = lerp(icon.skewY, 0, RECOVERY_RATE);
                icon.sprite.skew.set(icon.skewX, icon.skewY);

                icon.sprite.scale.x = lerp(icon.sprite.scale.x, icon.baseSpriteScale, RECOVERY_RATE);
                icon.sprite.scale.y = lerp(icon.sprite.scale.y, icon.baseSpriteScale, RECOVERY_RATE);
              } else {
                icon.sprite.alpha = 1;

                // Deformación elástica: se estira en la dirección del
                // movimiento y se aplasta en la perpendicular, con la
                // intensidad atada a la velocidad.
                const speed = Math.hypot(icon.vx, icon.vy);
                const stretchT = Math.min(speed * 0.8, 1);
                const dirX = speed > 0.001 ? icon.vx / speed : 0;
                const dirY = speed > 0.001 ? icon.vy / speed : 0;
                icon.skewX = dirX * stretchT * 0.38;
                icon.skewY = dirY * stretchT * 0.38;
                icon.sprite.skew.set(icon.skewX, icon.skewY);

                icon.sprite.scale.x = icon.baseSpriteScale * 1.15 * (1 + stretchT * 0.34);
                icon.sprite.scale.y = icon.baseSpriteScale * 1.15 * (1 - stretchT * 0.16);

                // El roce sigue pintando aunque el dedo se detenga un
                // instante: la velocidad decae sola si no llegan más
                // eventos de movimiento.
                icon.vx *= 0.9;
                icon.vy *= 0.9;
              }
            }
          } catch (err) {
            console.error('[SplashPlayground] error en el ticker', err);
          }
        });
      } catch (err) {
        console.error('[SplashPlayground] fallo al inicializar Pixi, se omite la capa decorativa', err);
        if (appInstance) {
          try {
            appInstance.destroy(true, { children: true });
          } catch {
            // ya en fallo — no dejar que la limpieza también reviente
          }
          appInstance = null;
        }
      }
    })();

    return () => {
      cancelled = true;
      for (const observer of observers) {
        try {
          observer.disconnect();
        } catch {
          // defensivo — igual que con los listeners
        }
      }
      for (const { type, handler, opts } of listeners) {
        try {
          window.removeEventListener(type, handler, opts);
        } catch {
          // defensivo — un listener mal removido no debe tumbar la página
        }
      }
      if (appInstance) {
        try {
          appInstance.destroy(true, { children: true });
        } catch (err) {
          console.error('[SplashPlayground] fallo al destruir la app de Pixi', err);
        }
        appInstance = null;
      }
    };
  }, [parallax.x, parallax.y]);

  // pointer-events-none es obligatorio aquí: este wrapper cubre toda
  // la pantalla del splash y, sin esto, tapa (invisible) los botones
  // reales por debajo — el arrastre no depende del DOM, usa listeners
  // de window + hit-test manual (ver arriba), así que esto no rompe
  // la interacción.
  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" />;
}
