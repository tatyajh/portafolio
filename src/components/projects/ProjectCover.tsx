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
      <span className={styles.coverIndex} aria-hidden="true">{id === 'gyg' ? 'WEBMASTER' : 'SELECTED WORK'}</span>
      <div className={styles.projectOverlay} aria-hidden="true">
        <span>Proyecto</span>
        <strong>{title}</strong>
      </div>
    </div>
  );
}
