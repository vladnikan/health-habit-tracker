import { useEffect, type FC } from 'react';
import ReactDOM from 'react-dom';
import style from './modal.module.css';
import { Text } from '../../ui/text/index';

type TModal = {
  title?: string;
  caption?: string;
  onClose: () => void;
  children: React.ReactElement;
};

const modalRoot = document.getElementById('modal') as Element;

export const Modal: FC<TModal> = ({ title, onClose, caption, children }) => {
  useEffect(() => {
    const closeModal = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', closeModal);

    return () => {
      document.removeEventListener('keydown', closeModal);
    };
  }, [onClose]);

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div className={style.modal_background} onClick={onClose}>
      <div className={style.modal_body} onClick={stopPropagation}>
        {title || caption ? (
          <div className={style.modal_captions}>
            {title && <Text style='H2'>{title}</Text>}
            {caption && <Text style='Caption'>{caption}</Text>}
          </div>
        ) : null}
        <div className={style.modal_content}>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};
