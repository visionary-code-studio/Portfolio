'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './Modal.module.css';

import { detectFileFormat, resolveAutoPreview } from '@/lib/previewEngine';

interface ModalItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  year?: number | string;
  issuer?: string;
  preview?: string;
  file?: string;
  credentialId?: string;
}

interface Props {
  item: ModalItem | null;
  type: 'ppt' | 'cert';
  onClose: () => void;
}

export default function ModalViewer({ item, type, onClose }: Props) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const targetFile = item.file || item.preview || '';
  const format = detectFileFormat(targetFile);
  const isPdf = format.ext === 'pdf' || targetFile.startsWith('data:application/pdf');
  const isPpt = format.iconType === 'presentation';

  const autoResolved = resolveAutoPreview(
    item.preview || item.file || '',
    item.title,
    item.issuer,
    item.category
  );
  const displayImageSrc = autoResolved.previewUrl;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className={`${styles.modal} ${isPdf || isPpt ? styles.modalWide : ''}`}>
        {/* Preview / Interactive Document Stage */}
        <div className={`${styles.preview} ${isPdf ? styles.previewPdf : ''}`}>
          {isPdf && item.file ? (
            <div className={styles.iframeWrapper}>
              <iframe
                src={`${item.file}#toolbar=1&navpanes=0&scrollbar=1`}
                title={item.title}
                className={styles.docIframe}
              />
              <div className={styles.iframeOverlayBar}>
                <span className={styles.pdfBadge}>✦ Interactive PDF Document</span>
                <a
                  href={item.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openExternalBtn}
                >
                  Open in Tab ↗
                </a>
              </div>
            </div>
          ) : isPpt && item.file?.startsWith('http') ? (
            <div className={styles.iframeWrapper}>
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(item.file)}`}
                title={item.title}
                className={styles.docIframe}
              />
            </div>
          ) : displayImageSrc ? (
            <Image
              src={displayImageSrc}
              alt={item.title}
              fill
              unoptimized={true}
              className={styles.previewImg}
              sizes="(max-width: 900px) 95vw, 860px"
            />
          ) : (
            <div className={styles.previewPlaceholder}>
              <span className={styles.previewNum}>
                {type === 'ppt' ? '📊' : '🏆'}
              </span>
            </div>
          )}
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {(item.category || item.issuer) && (
            <span className={styles.category}>
              {item.category || item.issuer}
            </span>
          )}
          <h2 className={styles.title}>{item.title}</h2>
          {item.description && (
            <p className={styles.description}>{item.description}</p>
          )}

          <div className={styles.meta}>
            {item.year && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Year</span>
                <span className={styles.metaValue}>{item.year}</span>
              </div>
            )}
            {item.issuer && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Issuer</span>
                <span className={styles.metaValue}>{item.issuer}</span>
              </div>
            )}
            {item.credentialId && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Credential ID</span>
                <span className={styles.metaValue}>{item.credentialId}</span>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {item.file && (
              <a
                href={item.file}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.actionBtn} ${styles.primary}`}
              >
                {type === 'ppt' ? 'Open Presentation →' : 'View Certificate →'}
              </a>
            )}
            {item.file && (
              <a
                href={item.file}
                download
                className={styles.actionBtn}
              >
                Download
              </a>
            )}
            <button className={styles.actionBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
