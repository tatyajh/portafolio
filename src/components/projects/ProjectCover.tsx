import Image from 'next/image';
import type { Project } from '@/data/projects';
import styles from './projects.module.css';

/** Compositions of existing assets, not fabricated product screenshots. */
export default function ProjectCover({ project }: { project: Project }) {
  const { preview, id, title } = project;
  const layout = preview.layout ?? 'screens';

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

  return (
    <div className={`${styles.cover} ${styles[layout]}`} data-project={id}>
      <span className={styles.coverIndex} aria-hidden="true">{id === 'gyg' ? 'WEBMASTER' : 'SELECTED WORK'}</span>
      <span className={styles.orbit} aria-hidden="true" />
      {layout === 'screens' && (
        <>
          <div className={styles.backScreen} aria-hidden="true">
            <Image src={preview.image} alt="" fill sizes="(max-width: 639px) 75vw, 360px" />
          </div>
          <div className={styles.mainScreen}>
            <div className={styles.browserDots} aria-hidden="true"><i /><i /><i /></div>
            <div className={styles.screenImage}>
              <Image src={preview.image} alt={preview.alt} fill sizes="(max-width: 639px) 85vw, 440px" />
            </div>
          </div>
          <div className={styles.detailScreen} aria-hidden="true">
            <Image src={preview.image} alt="" fill sizes="(max-width: 639px) 40vw, 230px" />
          </div>
          <span className={`font-serif ${styles.coverWord}`} aria-hidden="true">{title}</span>
        </>
      )}
      {layout === 'editorial' && (
        <>
          <span className={`font-serif ${styles.editorialWord}`} aria-hidden="true">Hilos<br /><em>Invisibles</em></span>
          {preview.detailImage && <div className={styles.paperFragment}>
            <Image src={preview.detailImage} alt={preview.detailAlt ?? ''} fill sizes="200px" />
          </div>}
          <div className={styles.portrait}>
            <Image src={preview.image} alt={preview.alt} fill sizes="(max-width: 639px) 75vw, 390px" />
          </div>
          <span className={styles.thread} aria-hidden="true" />
        </>
      )}
      {layout === 'catalogue' && (
        <>
          <span className={`font-serif ${styles.catalogueWord}`} aria-hidden="true">GYG<br /><small>Empaquetaduras</small></span>
          <div className={styles.productPhoto}>
            <Image src={preview.image} alt={preview.alt} fill sizes="(max-width: 639px) 70vw, 360px" />
          </div>
          <span className={styles.productCode} aria-hidden="true">KC036</span>
        </>
      )}
      {layout === 'identity' && (
        <div className={styles.identityCrop}>
          <Image src={preview.image} alt={preview.alt} fill sizes="(max-width: 639px) 90vw, 480px" />
        </div>
      )}
    </div>
  );
}
