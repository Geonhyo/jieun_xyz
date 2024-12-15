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
        x:{origin.x - position.x} y:{position.y - origin.y}
      </p>
    </button>
  );
};

export default PositionButton;
