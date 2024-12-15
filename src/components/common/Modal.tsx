import React, { useEffect } from "react";
import styles from "./Modal.module.css";

type Props = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const CommonModal: React.FC<Props> = ({ title, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleBackdropMouseOver = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleBackdropWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const handleBackdropMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={styles.backdrop}
      onMouseOver={handleBackdropMouseOver}
      onMouseDown={handleBackdropMouseDown}
      onWheel={handleBackdropWheel}
    >
      <div className={styles.container} onMouseDown={handleContainerMouseDown}>
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <button className={styles.closeButton} onClick={onClose}>
            <img
              className={styles.closeIcon}
              src="icons/close.webp"
              alt="Close"
            />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
};

export default CommonModal;
