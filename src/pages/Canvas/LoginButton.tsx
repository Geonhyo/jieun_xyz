import { useState } from "react";
import styles from "./LoginButton.module.css";
import CommonModal from "../../components/common/Modal";

type Props = {
  openLoginModal: () => void;
};

const LoginButton: React.FC<Props> = ({ openLoginModal }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openLoginModal();
  };

  return (
    <button className={styles.container} onClick={handleClick}>
      <img className={styles.image} src="icons/login.webp" alt="back" />
    </button>
  );
};

export default LoginButton;
