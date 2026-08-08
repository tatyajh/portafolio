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
// Cada cuánto se le avisa al título (DOM) por dónde va la herramienta.
// No hace falta cada frame: cortar una letra es un evento raro.
const TOOL_NOTIFY_MS = 35;

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

// Paleta del rastro. Las seis primeras salen del @theme del proyecto
// (globals.css); las tres últimas son los tonos analógicos que pedía
// el brief original — teal apagado, violeta empolvado y azul
// desaturado. Nada de neón: son versiones sucias, no saturadas.
const PALETTE = {
  burgundy: 0x8b0000,
  gold: 0xe8c9a0,
  goldMid: 0xd4a574,
  goldDeep: 0xc4874a,
  brown: 0xa0522d,
  ivory: 0xf5f0e6,
  teal: 0x4a8f8b,
  violeta: 0x8a6a9e,
  azul: 0x5c7fa3,
};

// "Personalidad" por categoría — datos, no nueve rutas de código.
// Cada categoría tiene un color DISTINTO: antes borgoña, oro-profundo
// y oro-medio se repetían en dos categorías cada uno, así que arrastrar
// dos objetos diferentes podía dejar el mismo rastro.
const PERSONALITY: Record<Category, Personality> = {
  tijeras: { stampIntervalMs: 70, splitStrength: 10, strokeWidth: 5, tint: PALETTE.burgundy },
  aguja: { stampIntervalMs: 110, splitStrength: 5, strokeWidth: 3, tint: PALETTE.ivory },
  hilo: { stampIntervalMs: 95, splitStrength: 6, strokeWidth: 6, tint: PALETTE.goldMid },
  carrete: { stampIntervalMs: 95, splitStrength: 6, strokeWidth: 7, tint: PALETTE.brown },
  patron: { stampIntervalMs: 120, splitStrength: 4, strokeWidth: 8, tint: PALETTE.violeta },
  codigo: { stampIntervalMs: 55, splitStrength: 15, strokeWidth: 4, tint: PALETTE.teal },
  saxofon: { stampIntervalMs: 85, splitStrength: 8, strokeWidth: 6, tint: PALETTE.gold },
  nota: { stampIntervalMs: 75, splitStrength: 9, strokeWidth: 5, tint: PALETTE.goldDeep },
  gamepad: { stampIntervalMs: 60, splitStrength: 16, strokeWidth: 5, tint: PALETTE.azul },
};

// Corre el color un poco según el índice de la instancia: con tres
// tijeras en pantalla, cada una deja un rojo ligeramente distinto en
// vez de exactamente el mismo trazo.
function varyTint(tint: number, i: number): number {
  const shift = [0, 22, -20, 34, -30][i % 5];
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  const r = clamp(((tint >> 16) & 0xff) + shift);
  const g = clamp(((tint >> 8) & 0xff) + Math.round(shift * 0.55));
  const b = clamp((tint & 0xff) + Math.round(shift * 0.3));
  return (r << 16) | (g << 8) | b;
}

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
    // Las notas musicales NO se colocan en reposo: aparecen solo
    // cuando se arrastra el saxofón, que las va soltando por el camino.
    if (group.category === 'nota') continue;
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
  /** Color propio de ESTA instancia: el de su categoría, corrido un poco. */
  tint: number;
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

        // Las notas no se colocan en reposo, pero sus texturas sí se
        // cargan: son lo que el saxofón va soltando al arrastrarlo.
        const noteUrls = groups.find(g => g.category === 'nota')?.frames ?? [];
        const urls = Array.from(new Set([...placed.map((p) => p.url), ...noteUrls]));
        const textureMap = (await Assets.load(urls)) as Record<string, Texture>;
        if (cancelled) return;

        const noteTextures = noteUrls.map(u => textureMap[u]).filter(Boolean);

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
            tint: varyTint(PERSONALITY[instance.category].tint, i),
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
            .stroke({ width: w * 3.2, color: icon.tint, alpha: 0.05, cap: 'round', join: 'round' });
          strokeGfx
            .moveTo(icon.strokeX, icon.strokeY)
            .lineTo(x, y)
            .stroke({ width: w * 1.6, color: icon.tint, alpha: 0.1, cap: 'round', join: 'round' });
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
          stampSprite.tint = icon.tint;
          stampSprite.alpha = 0.16 + speedNorm * 0.22;
          stampSprite.blendMode = 'add';
          stampFilter.red = { x: -p.splitStrength * speedNorm, y: 0 };
          stampFilter.blue = { x: p.splitStrength * speedNorm, y: 0 };
          stampFilter.green = { x: 0, y: p.splitStrength * 0.4 * speedNorm };
          app.renderer.render({ container: stampSprite, target: trailTexture, clear: false });
        }

        // El saxofón no deja un eco de sí mismo: va soltando notas
        // musicales por donde pasa. Cada nota sale con tamaño, giro y
        // desvío distintos para que la línea no se vea mecánica.
        function stampNote(icon: IconState, speedNorm: number) {
          if (noteTextures.length === 0) return;
          const texture = noteTextures[Math.floor(Math.random() * noteTextures.length)];
          const maxDim = Math.max(texture.width, texture.height) || 1;
          const size = iconSize * (0.34 + Math.random() * 0.3);

          stampSprite.texture = texture;
          // Se desvía un poco del trazo, como notas que se escapan.
          stampSprite.x = icon.sprite.x + (Math.random() - 0.5) * 46;
          stampSprite.y = icon.sprite.y + (Math.random() - 0.5) * 46 - 10;
          stampSprite.rotation = (Math.random() - 0.5) * 0.9;
          stampSprite.scale.set(size / maxDim);
          stampSprite.skew.set(0, 0);
          stampSprite.tint = Math.random() < 0.5 ? PALETTE.gold : PALETTE.goldMid;
          stampSprite.alpha = 0.4 + speedNorm * 0.35;
          stampSprite.blendMode = 'add';
          // Sin aberración cromática: las notas se leen como notas,
          // no como el rastro distorsionado de los demás objetos.
          stampFilter.red = { x: 0, y: 0 };
          stampFilter.blue = { x: 0, y: 0 };
          stampFilter.green = { x: 0, y: 0 };
          app.renderer.render({ container: stampSprite, target: trailTexture, clear: false });
        }

        // Estado del gesto activo — un único puntero a la vez, con
        // supresión de "click" cuando hubo arrastre real.
        let activeGesture: { pointerId: number; icon: IconState | null; startX: number; startY: number; suppressClick: boolean } | null = null;
        let pendingSuppressClick = false;
        let lastToolNotifyAt = 0;
        let hasDraggedOnce = false;

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

        // Inversa exacta de mapPositionToPoint: pasa una posición del
        // stage a coordenadas de pantalla, para avisarle al título DOM
        // por dónde va el filo de las tijeras o la punta de la aguja.
        function toClient(px: number, py: number) {
          const rect = app.canvas.getBoundingClientRect();
          const res = app.renderer.resolution;
          return {
            x: px * res * (rect.width / app.canvas.width) + rect.left,
            y: py * res * (rect.height / app.canvas.height) + rect.top,
          };
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
              // La primera vez que alguien agarra algo, la pista de
              // "arrastra los objetos" ya cumplió y se retira sola.
              if (!hasDraggedOnce) {
                hasDraggedOnce = true;
                window.dispatchEvent(new CustomEvent('splash-first-drag'));
              }
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
            // El saxofón no pinta trazo de luz: solo suelta notas.
            if (icon.hasStroke && icon.category !== 'saxofon') {
              paintStroke(icon, nx, ny, speedNorm);
            }
            icon.strokeX = nx;
            icon.strokeY = ny;

            const p = PERSONALITY[icon.category];
            if (now - icon.lastStampAt >= p.stampIntervalMs) {
              icon.lastStampAt = now;
              if (icon.category === 'saxofon') stampNote(icon, speedNorm);
              else stampEcho(icon, speedNorm);
            }

            // Las tijeras y la aguja además avisan al título: cortan y
            // cosen las letras. Va con throttle propio porque el título
            // vive en el DOM (React) y no debe enterarse cada frame.
            if ((icon.category === 'tijeras' || icon.category === 'aguja') && now - lastToolNotifyAt >= TOOL_NOTIFY_MS) {
              lastToolNotifyAt = now;
              const screenPos = toClient(icon.sprite.x, icon.sprite.y);
              window.dispatchEvent(
                new CustomEvent('splash-tool-move', {
                  detail: { x: screenPos.x, y: screenPos.y, category: icon.category },
                }),
              );
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

        // Cursor de "agarrable" al pasar por encima de un ícono. El
        // canvas es pointer-events:none, así que el cursor tiene que
        // ponerse en el contenedor del splash, que es quien realmente
        // está bajo el puntero.
        const splashRoot = containerEl.parentElement;
        const onHoverCursor = (evt: Event) => {
          try {
            if (!splashRoot || activeGesture) return;
            const e = evt as PointerEvent;
            if (e.pointerType !== 'mouse') return;
            const { x, y } = toLocal(e);
            splashRoot.style.cursor = findHit(x, y) ? 'grab' : '';
          } catch {
            // el cursor es cosmético — nunca vale la pena romper por esto
          }
        };

        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointermove', onHoverCursor);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
        window.addEventListener('click', onClickCapture, { capture: true });
        listeners.push(
          { type: 'pointerdown', handler: onPointerDown },
          { type: 'pointermove', handler: onPointerMove },
          { type: 'pointermove', handler: onHoverCursor },
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
