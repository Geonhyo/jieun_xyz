import { PositionModel } from "../../models/position";
import styles from "./PositionButton.module.css";

type Props = {
  position: PositionModel;
  origin: PositionModel;
  resetPosition: () => void;
};

const PositionButton: React.FC<Props> = ({
  position,
  origin,
  resetPosition,
}) => {
  return (
    <button className={styles.container} onClick={resetPosition}>
      <p className={styles.text}>
        x:{(origin.x - position.x).toFixed(0)} y:
        {(position.y - origin.y).toFixed(0)}
      </p>
    </button>
  );
};

export default PositionButton;
