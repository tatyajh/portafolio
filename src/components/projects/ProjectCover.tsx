import Image from 'next/image';
import type { Project } from '@/data/projects';
import styles from './projects.module.css';

/** Compositions of existing assets, not fabricated product screenshots. */
export default function ProjectCover({ project }: { project: Project }) {
  const { preview, id, title } = project;

  if (!preview.image) {
    return (
      <div className={`${styles.cover} ${styles.typographic}`} data-project={id} role="img" aria-label={preview.alt}>
        <span className={styles.coverIndex} aria-hidden="true">FRONTEND</span>
        <span className={styles.typewriterQuote} aria-hidden="true">“</span>
        <span className={styles.typewriterTitle} aria-hidden="true">{title}</span>
        <span className={styles.typewriterRule} aria-hidden="true" />
      </div>
    );
  }

  // Las imágenes ya son composiciones terminadas. No las volvemos a montar
  // con tres copias superpuestas: eso hacía que las tarjetas parecieran
  // capturas repetidas y recortadas.
  return (
    <div className={`${styles.cover} ${styles.cleanCover}`} data-project={id}>
      <Image
        src={preview.image}
        alt={preview.alt}
        fill
        sizes="(max-width: 639px) 92vw, (max-width: 1099px) 45vw, 30vw"
        className={styles.cleanImage}
      />
      <span className={styles.coverIndex} aria-hidden="true">{id === 'gyg' ? 'WEBMASTER' : 'SELECTED WORK'}</span>
    </div>
  );
}
