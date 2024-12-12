import styles from "./ScaleButton.module.css";

type Props = {
  scale: number;
  resetScale: () => void;
};

const ScaleButton: React.FC<Props> = ({ scale, resetScale }) => {
  return (
    <button className={styles.container} onClick={resetScale}>
      <p className={styles.text}>{(100 * scale).toFixed(0)}%</p>
    </button>
  );
};

export default ScaleButton;
