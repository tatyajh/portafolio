export interface Node {
  id: string;
  title: string;
  category: 'raiz' | 'herencia' | 'expresion' | 'transformacion' | 'mixto' | 'esencia';
  subtitle?: string;
  text: string;
  content?: string;
  media?: { type: 'video' | 'images'; src: string | string[] };
  videos?: readonly string[];
  gallery?: readonly string[];
  /** Ilustración como marca de agua detrás del texto del capítulo. */
  backdrop?: string;
  tools?: { digital: string[]; diseno: string[] };
  connections: string[];
  theme?: 'dark' | 'light' | 'accent' | 'paper';
}
