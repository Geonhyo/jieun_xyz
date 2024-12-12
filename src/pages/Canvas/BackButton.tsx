import styles from "./BackButton.module.css";

const BackButton = () => {
  const handleClick = () => {
    window.history.back();
  };

  return (
    <button className={styles.container} onClick={handleClick}>
      <img className={styles.image} src="icons/back.webp" alt="back" />
    </button>
  );
};

export default BackButton;
