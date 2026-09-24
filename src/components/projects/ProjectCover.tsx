import Image from 'next/image';
import type { Project } from '@/data/projects';
import styles from './projects.module.css';

/** Compositions of existing assets, not fabricated product screenshots. */
export default function ProjectCover({ project }: { project: Project }) {
  const { preview, id, title } = project;

  if (!preview.image) {
    return (
      <div className={`${styles.cover} ${styles.typographic}`} data-project={id} role="img" aria-label={preview.alt}>
        <span className={styles.typewriterQuote} aria-hidden="true">“</span>
        <span className={styles.typewriterTitle} aria-hidden="true">{title}</span>
        <span className={styles.typewriterRule} aria-hidden="true" />
      </div>
    );
  }

  const gallery = preview.gallery ?? [{ image: preview.image, alt: preview.alt }];
  return (
    <div className={`${styles.cover} ${styles.cleanCover}`} data-project={id}>
      <div className={styles.screenCollage}>
        {gallery.map((screen, index) => (
          <div className={`${styles.collageScreen} ${styles[`collageScreen${Math.min(index + 1, 4)}`]}`} key={screen.image}>
            <Image src={screen.image} alt={screen.alt} fill sizes="(max-width: 639px) 75vw, 22vw" />
          </div>
        ))}
      </div>
      {gallery.length > 1 && (
        <details className={styles.screenGallery}>
          <summary>Ver todas las pantallas <span aria-hidden="true">＋</span></summary>
          <div className={styles.screenGalleryGrid}>
            {gallery.map(screen => (
              <Image key={`full-${screen.image}`} src={screen.image} alt={screen.alt} width={1200} height={700} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
