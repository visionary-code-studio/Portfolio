'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './Modal.module.css';

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

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className={styles.modal}>
        {/* Preview */}
        <div className={styles.preview}>
          {item.preview ? (
            <Image
              src={item.preview}
              alt={item.title}
              fill
              className={styles.previewImg}
              sizes="680px"
            />
          ) : (
            <div className={styles.previewPlaceholder}>
              <span className={styles.previewNum}>
                {type === 'ppt' ? '📄' : '🏆'}
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
