import { PositionModel } from "../../models/position";
import styles from "./PositionButton.module.css";

type Props = {
  scale: number;
  position: PositionModel;
  origin: PositionModel;
  resetPosition: () => void;
};

const PositionButton: React.FC<Props> = ({
  scale,
  position,
  origin,
  resetPosition,
}) => {
  return (
    <button className={styles.container} onClick={resetPosition}>
      <p className={styles.text}>
        x:{((origin.x - position.x) / scale).toFixed(0)} y:
        {((position.y - origin.y) / scale).toFixed(0)}
      </p>
    </button>
  );
};

export default PositionButton;
