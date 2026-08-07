"use client";

import { useEffect, useRef } from 'react';
import { Application, Assets, Container, Sprite, Texture } from 'pixi.js';
import { RGBSplitFilter, MotionBlurFilter } from 'pixi-filters';
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
const DRAG_THRESHOLD_PX = 5;
const MAX_SPEED_PX_MS = 1.4;
const PARALLAX_DEPTH = 24;
const RECOVERY_RATE = 0.18;
const IDLE_ALPHA = 0.6;

type Category = BackgroundAssetGroup['category'];

interface Personality {
  trailLifetimeMs: number;
  spawnIntervalMs: number;
  splitStrength: number;
  tint: number;
  motionBlur: boolean;
}

// Paleta ya existente del proyecto (@theme en globals.css), reutilizada
// como tinte de los ecos — analógico/cálido, no neón.
const PALETTE = {
  burgundy: 0x8b0000,
  gold: 0xe8c9a0,
  goldMid: 0xd4a574,
  goldDeep: 0xc4874a,
  brown: 0xa0522d,
  ivory: 0xf5f0e6,
};

// "Personalidad" por categoría: cuánto dura cada eco, con qué
// frecuencia se generan y qué tan fuerte es la aberración cromática —
// datos, no ocho rutas de código distintas.
const PERSONALITY: Record<Category, Personality> = {
  tijeras: { trailLifetimeMs: 180, spawnIntervalMs: 55, splitStrength: 9, tint: PALETTE.burgundy, motionBlur: false },
  aguja: { trailLifetimeMs: 480, spawnIntervalMs: 90, splitStrength: 5, tint: PALETTE.goldDeep, motionBlur: true },
  hilo: { trailLifetimeMs: 460, spawnIntervalMs: 85, splitStrength: 6, tint: PALETTE.goldMid, motionBlur: true },
  carrete: { trailLifetimeMs: 440, spawnIntervalMs: 85, splitStrength: 6, tint: PALETTE.brown, motionBlur: true },
  patron: { trailLifetimeMs: 500, spawnIntervalMs: 100, splitStrength: 4, tint: PALETTE.ivory, motionBlur: false },
  codigo: { trailLifetimeMs: 200, spawnIntervalMs: 40, splitStrength: 14, tint: PALETTE.gold, motionBlur: false },
  saxofon: { trailLifetimeMs: 420, spawnIntervalMs: 70, splitStrength: 7, tint: PALETTE.goldDeep, motionBlur: true },
  nota: { trailLifetimeMs: 400, spawnIntervalMs: 60, splitStrength: 8, tint: PALETTE.goldMid, motionBlur: false },
  gamepad: { trailLifetimeMs: 160, spawnIntervalMs: 45, splitStrength: 15, tint: PALETTE.burgundy, motionBlur: false },
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

// Posición en grilla con jitter determinista, dimensionada al total
// real de instancias (varía entre desktop/mobile).
function gridPosition(i: number, cols: number, rows: number) {
  const col = i % cols;
  const row = Math.floor(i / cols) % rows;
  const jitterX = ((i * 37) % 14) - 7;
  const jitterY = ((i * 53) % 14) - 7;
  return {
    leftPct: (col + 0.5) * (100 / cols) + jitterX,
    topPct: (row + 0.5) * (100 / rows) + jitterY,
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
  dragOffsetX: number;
  dragOffsetY: number;
  lastMoveT: number;
  vx: number;
  vy: number;
  lastGhostSpawnAt: number;
}

interface GhostState {
  sprite: Sprite;
  splitFilter: RGBSplitFilter;
  motionBlurFilter: MotionBlurFilter;
  active: boolean;
  bornAt: number;
  lifetimeMs: number;
  baseScale: number;
}

// Playground decorativo exclusivo del splash ("inicio"): muchos
// íconos reales de fondo (mismas categorías que CollageDecor, layer
// aparte — no toca CollageDecor, que sigue siendo el sistema DOM para
// el resto de las secciones), estáticos en reposo, arrastrables, con
// rastro de ecos cromáticos por velocidad. La simulación por-frame
// (pool de ghosts, filtros mutados cada tick) vive fuera de React a
// propósito: mutar N sprites 60 veces por segundo vía setState
// pelearía contra el reconciliador.
export default function SplashPlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parallax = useCursorParallax();

  useEffect(() => {
    if (!containerRef.current) return;
    const containerEl: HTMLDivElement = containerRef.current;

    let cancelled = false;
    let appInstance: Application | null = null;
    const listeners: Array<{ type: string; handler: EventListener; opts?: boolean | AddEventListenerOptions }> = [];

    const isMobile = window.innerWidth < 768;
    const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE_DESKTOP;
    const ghostPoolSize = isMobile ? 12 : 24;
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
        app.canvas.style.pointerEvents = 'none';
        containerEl.appendChild(app.canvas);

        const groups = getBackgroundAssetGroups('inicio');
        if (groups.length === 0) return;

        const placed = pickInstances(groups, instancesPerCategory);
        const gridRows = Math.max(1, Math.ceil(placed.length / gridCols));

        const urls = Array.from(new Set(placed.map((p) => p.url)));
        const textureMap = (await Assets.load(urls)) as Record<string, Texture>;
        if (cancelled) return;

        const iconLayer = new Container();
        app.stage.addChild(iconLayer);

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
            dragOffsetX: 0,
            dragOffsetY: 0,
            lastMoveT: 0,
            vx: 0,
            vy: 0,
            lastGhostSpawnAt: 0,
          };
        });

        const ghostLayer = new Container();
        app.stage.addChild(ghostLayer);
        const ghostPool: GhostState[] = Array.from({ length: ghostPoolSize }, () => {
          const sprite = new Sprite();
          sprite.anchor.set(0.5);
          sprite.visible = false;
          const splitFilter = new RGBSplitFilter();
          const motionBlurFilter = new MotionBlurFilter();
          ghostLayer.addChild(sprite);
          return { sprite, splitFilter, motionBlurFilter, active: false, bornAt: 0, lifetimeMs: 300, baseScale: 1 };
        });
        let nextGhostIndex = 0;

        function spawnGhost(icon: IconState, now: number) {
          const personality = PERSONALITY[icon.category];
          const ghost = ghostPool[nextGhostIndex];
          nextGhostIndex = (nextGhostIndex + 1) % ghostPool.length;
          const speed = Math.hypot(icon.vx, icon.vy);
          const speedNorm = Math.min(speed / MAX_SPEED_PX_MS, 1);

          ghost.sprite.texture = icon.sprite.texture;
          ghost.sprite.x = icon.sprite.x;
          ghost.sprite.y = icon.sprite.y;
          ghost.sprite.rotation = icon.sprite.rotation;
          ghost.sprite.scale.copyFrom(icon.sprite.scale);
          ghost.sprite.tint = personality.tint;
          ghost.sprite.alpha = 0.55;
          ghost.sprite.visible = true;
          ghost.baseScale = icon.sprite.scale.x;
          ghost.bornAt = now;
          ghost.lifetimeMs = lerp(150, personality.trailLifetimeMs, speedNorm);

          ghost.splitFilter.red = { x: -personality.splitStrength * speedNorm, y: 0 };
          ghost.splitFilter.blue = { x: personality.splitStrength * speedNorm, y: 0 };
          ghost.splitFilter.green = { x: 0, y: personality.splitStrength * 0.4 * speedNorm };

          if (personality.motionBlur && !isMobile) {
            ghost.motionBlurFilter.velocity = { x: icon.vx * 6, y: icon.vy * 6 };
            ghost.sprite.filters = [ghost.splitFilter, ghost.motionBlurFilter];
          } else {
            ghost.sprite.filters = [ghost.splitFilter];
          }
          ghost.active = true;
        }

        // Estado del gesto activo — un único puntero a la vez, con
        // supresión de "click" cuando hubo arrastre real (ver B3 del plan).
        let activeGesture: { pointerId: number; icon: IconState | null; startX: number; startY: number; suppressClick: boolean } | null = null;
        let pendingSuppressClick = false;

        function toLocal(e: PointerEvent) {
          const rect = containerEl.getBoundingClientRect();
          return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }

        function findHit(x: number, y: number): IconState | null {
          for (let i = icons.length - 1; i >= 0; i--) {
            const icon = icons[i];
            if (icon.grabbed) continue;
            const halfW = icon.sprite.width / 2;
            const halfH = icon.sprite.height / 2;
            if (Math.abs(x - icon.sprite.x) <= halfW && Math.abs(y - icon.sprite.y) <= halfH) return icon;
          }
          return null;
        }

        // Cada handler va envuelto en try/catch: corren fuera del
        // try/catch de montaje (se ejecutan después, en respuesta a
        // eventos reales), así que un fallo aquí necesita su propia red
        // — nunca debe interrumpir el resto de la interacción de la página.
        const onPointerDown = (evt: Event) => {
          try {
            const e = evt as PointerEvent;
            const { x, y } = toLocal(e);
            const icon = findHit(x, y);
            activeGesture = { pointerId: e.pointerId, icon, startX: x, startY: y, suppressClick: !!icon };
            if (icon) {
              // preventDefault en touch evita que el navegador sintetice
              // un "click" de compatibilidad después del gesto — refuerzo
              // extra (además de onClickCapture) para que arrastrar un
              // ícono nunca cierre el splash en móvil.
              e.preventDefault();
              icon.grabbed = true;
              icon.dragOffsetX = icon.sprite.x - x;
              icon.dragOffsetY = icon.sprite.y - y;
              icon.lastMoveT = performance.now();
              icon.vx = 0;
              icon.vy = 0;
              iconLayer.addChild(icon.sprite); // trae al frente mientras se arrastra
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
            if (icon) {
              const now = performance.now();
              const dt = Math.max(now - icon.lastMoveT, 1);
              const nx = x + icon.dragOffsetX;
              const ny = y + icon.dragOffsetY;
              icon.vx = (nx - icon.sprite.x) / dt;
              icon.vy = (ny - icon.sprite.y) / dt;
              icon.sprite.x = nx;
              icon.sprite.y = ny;
              icon.lastMoveT = now;
              const personality = PERSONALITY[icon.category];
              if (now - icon.lastGhostSpawnAt >= personality.spawnIntervalMs) {
                icon.lastGhostSpawnAt = now;
                spawnGhost(icon, now);
              }
            }
          } catch (err) {
            console.error('[SplashPlayground] error en pointermove', err);
          }
        };

        const endGesture = () => {
          if (!activeGesture) return;
          if (activeGesture.icon) activeGesture.icon.grabbed = false;
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

        // Fase de captura: corre ANTES que el onClick delegado de React,
        // así puede frenar la propagación y evitar que arrastrar un ícono
        // cierre el splash (ver B3 del plan — validado explícitamente).
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

        app.ticker.add(() => {
          try {
            const now = performance.now();
            const screenW = app.screen.width;
            const screenH = app.screen.height;
            const px = parallax.x.get() * PARALLAX_DEPTH;
            const py = parallax.y.get() * PARALLAX_DEPTH;

            for (const icon of icons) {
              if (!icon.grabbed) {
                icon.sprite.x = (icon.leftPct / 100) * screenW + px;
                icon.sprite.y = (icon.topPct / 100) * screenH + py;
                icon.sprite.alpha = IDLE_ALPHA;

                icon.skewX = lerp(icon.skewX, 0, RECOVERY_RATE);
                icon.skewY = lerp(icon.skewY, 0, RECOVERY_RATE);
                icon.sprite.skew.set(icon.skewX, icon.skewY);

                icon.sprite.scale.x = lerp(icon.sprite.scale.x, icon.baseSpriteScale, RECOVERY_RATE);
                icon.sprite.scale.y = lerp(icon.sprite.scale.y, icon.baseSpriteScale, RECOVERY_RATE);
              } else {
                icon.sprite.alpha = 1;

                const speed = Math.hypot(icon.vx, icon.vy);
                const stretchT = Math.min(speed * 0.6, 1);
                const dirX = speed > 0.001 ? icon.vx / speed : 0;
                const dirY = speed > 0.001 ? icon.vy / speed : 0;
                icon.skewX = dirX * stretchT * 0.22;
                icon.skewY = dirY * stretchT * 0.22;
                icon.sprite.skew.set(icon.skewX, icon.skewY);

                icon.sprite.scale.x = icon.baseSpriteScale * 1.15 * (1 + stretchT * 0.18);
                icon.sprite.scale.y = icon.baseSpriteScale * 1.15 * (1 - stretchT * 0.08);
              }
            }

            for (const ghost of ghostPool) {
              if (!ghost.active) continue;
              const age = now - ghost.bornAt;
              if (age >= ghost.lifetimeMs) {
                ghost.active = false;
                ghost.sprite.visible = false;
                continue;
              }
              const t = age / ghost.lifetimeMs;
              ghost.sprite.alpha = (1 - t) * 0.55;
              ghost.sprite.scale.set(ghost.baseScale * (1 + t * 0.7));
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
      for (const { type, handler, opts } of listeners) {
        try {
          window.removeEventListener(type, handler, opts);
        } catch {
          // defensivo — un listener mal removido no debe tumbar el resto de la página
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
  // la pantalla del splash y, sin esto, tapaba (invisible) los botones
  // reales por debajo — el arrastre no depende del DOM, usa listeners
  // de window + hit-test manual (ver arriba), así que esto no rompe
  // la interacción.
  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" />;
}
