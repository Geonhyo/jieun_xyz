import React from "react";
import styles from "./Button.module.css";

const Button: React.FC = () => {
  return (
    <a href="/paper" className={styles.floatingButton}>
      <span className={styles.label}>롤링페이퍼</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M13.172 12l-4.95-4.95 1.414-1.414L17 12l-7.364 7.364-1.414-1.414z" />
      </svg>
    </a>
  );
};

export default Button;
