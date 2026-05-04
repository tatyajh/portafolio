# Portfolio Cinematográfico

Una experiencia narrativa inmersiva para diseñadora de moda que conecta infancia, cuerpo, música y diseño como un hilo continuo.

## Concepto

"Antes de saberlo, ya era esto."

Un portafolio web que funciona como una pieza audiovisual interactiva, donde cada capítulo conecta explícitamente vida → diseño a través de una experiencia de scroll cinematográfico.

## Características

- **Navegación por timeline continuo**: Scroll vertical como reproducción narrativa
- **Experiencia audiovisual**: Música ambiental y efectos de sonido sincronizados
- **Diseño responsivo**: Optimizado para móvil y desktop
- **Accesibilidad**: Soporte para reduced motion y navegación por teclado
- **Performance**: Optimizado con Next.js, imágenes AVIF/WebP, y lazy loading

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Animaciones**: Framer Motion
- **Estilos**: Tailwind CSS con variables personalizadas
- **Estado**: Zustand
- **Media**: Web Audio API + Video optimizado

## Capítulos

1. **Intro** - Video hero autoplay
2. **Origen** - Conexión con las raíces y enseñanzas
3. **Cuerpo** - El pole dance como narrativa corporal
4. **Expresión** - El saxofón y el silencio
5. **Quiebre** - Momentos de fragmentación
6. **Decisión** - La rendición al diseño
7. **Construcción** - El proceso del corset
8. **Identidad** - Integración de todas las vidas anteriores
9. **Perfil** - CV reinterpretado
10. **Behind the Seams** - El proceso invisible

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── chapters/          # Componentes de capítulos
│   ├── layout/            # Layout components
│   ├── media/             # Audio y Video
│   ├── timeline/          # ProgressBar y navegación
│   └── ui/                # UI components
├── lib/                   # Utilidades
├── store/                 # Zustand store
└── styles/                # CSS y temas
```

## Contenido de Media

### Videos
- `/public/video/intro-hero.mp4` - Video principal de intro
- Formatos recomendados: MP4 (H.264) + WebM fallback
- Resolución: 1920x1080, bitrate ≤ 6 Mbps

### Imágenes
- `/public/images/` - Todas las imágenes estáticas
- Formatos: AVIF/WebP con fallback JPEG
- Lazy loading con blur-up

### Audio
- `/public/audio/ambient.mp3` - Música ambiental loop
- `/public/audio/scissors.mp3` - Efecto de tijeras
- `/public/audio/sewing.mp3` - Efecto de máquina de coser

## Accesibilidad

- Respeta `prefers-reduced-motion`
- Navegación por teclado completa
- Contraste AA/AAA
- Controles de audio siempre visibles
- Subtítulos opcionales para videos

## Performance

- LCP < 2.5s
- CLS < 0.1
- Code splitting por capítulos
- Preload de fuentes críticas
- CDN con Vercel

## Deploy

```bash
npm run build
npm start
```

Recomendado deploy en Vercel para optimización automática de imágenes y CDN.

---

*Diseñado con ❤️ como experiencia narrativa inmersiva*
