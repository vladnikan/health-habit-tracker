import React, { useState } from 'react';
import styles from './photo.module.css';

const DefaultAvatarSVG: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='77'
    height='77'
    fill='none'
    viewBox='0 0 77 77'
    {...props}
  >
    <path
      stroke='#253017'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1.5'
      d='M63.173 66.27a31.207 31.207 0 0 0-24.925-12.396A31.207 31.207 0 0 0 13.323 66.27m49.85 0a37.5 37.5 0 1 0-61.347-19.1 37.493 37.493 0 0 0 11.497 19.1m49.85 0a37.385 37.385 0 0 1-24.925 9.479 37.376 37.376 0 0 1-24.925-9.48m37.425-37.395a12.5 12.5 0 1 1-25 0 12.5 12.5 0 0 1 25 0Z'
    />
  </svg>
);

export interface PhotoProps {
  url?: string;
  altName?: string;
  className?: string;
  size?: 'medium' | 'large';
}

export const Photo: React.FC<PhotoProps> = ({
  url,
  altName = 'Фото пользователя',
  className = '',
  size = 'medium'
}) => {
  const [hasError, setHasError] = useState(false);
  const shouldShowSVG = !url || hasError;

  const sizeClass = styles[`photo--${size}`] || styles['photo--medium'];
  const containerClasses = `${styles.photo} ${sizeClass} ${className}`.trim();

  return (
    <div className={containerClasses} aria-label={altName}>
      {shouldShowSVG ? (
        <DefaultAvatarSVG className={styles.photo__svg} />
      ) : (
        <img
          src={url}
          alt={altName}
          className={styles.photo__image}
          onError={() => setHasError(true)}
          loading='lazy'
        />
      )}
    </div>
  );
};
