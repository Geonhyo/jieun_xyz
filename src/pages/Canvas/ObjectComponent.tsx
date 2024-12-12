import React, { useState } from "react";
import { ImageInfo, ObjectModel } from "../../models/object";
import styles from "./ObjectComponent.module.css";
import { PositionModel } from "../../models/position";

type Props = {
  object: ObjectModel;
  scale: number;
  position: PositionModel;
  setSelectedObjectId: React.Dispatch<React.SetStateAction<string | null>>;
  deleteObject: (id: string) => void;
  updateObject: (object: ObjectModel) => void;
};

const ObjectComponent: React.FC<Props> = ({
  object: value,
  scale,
  position,
  setSelectedObjectId,
  deleteObject,
  updateObject,
}) => {
  const [object, setObject] = useState<ObjectModel>(value);
  const [isSelected, setIsSelected] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const handleMouseDown = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (object.disabled) {
      return;
    }
    // 소유주는 언제나 선택 가능 - localStorage에 저장된 토큰 사용하여 검증
    // 소유주가 확인 전 혹은 5분 이내에는 선택 가능 - 작성자 비밀번호 필요

    if (!isSelected) {
      setIsSelected(true);
      setSelectedObjectId(object.id);
    }

    const initX = e.pageX;
    const initY = e.pageY;

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isChanged) {
        setIsChanged(true);
      }
      const dx = e.pageX - initX;
      const dy = e.pageY - initY;
      setObject((prev) => ({
        ...prev,
        x: object.x + dx / scale,
        y: object.y + dy / scale,
      }));
    };

    const mouseUpHandler = () => {
      window.removeEventListener("mousemove", mouseMoveHandler);

      updateObject(object);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler, { once: true });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const initX = e.pageX;
    const initY = e.pageY;

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isChanged) {
        setIsChanged(true);
      }
      const dx = e.pageX - initX;
      const dy = e.pageY - initY;

      const localDx =
        dx * Math.cos(object.rotation) + dy * Math.sin(object.rotation);
      const localDy =
        dy * Math.cos(object.rotation) - dx * Math.sin(object.rotation);

      setObject((prev) => ({
        ...prev,
        width: Math.max(32, object.width + (localDx * 2) / scale), // 최소 크기 제한
        height: Math.max(32, object.height + (localDy * 2) / scale), // 최소 크기 제한
      }));
    };

    const mouseUpHandler = () => {
      window.removeEventListener("mousemove", mouseMoveHandler);

      updateObject(object);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler, { once: true });
  };

  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultAngle = Math.atan2(object.height, object.width);

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isChanged) {
        setIsChanged(true);
      }
      const angle = Math.atan2(
        e.pageY - object.y * scale - position.y,
        e.pageX - object.x * scale - position.x
      );
      setObject((prev) => ({
        ...prev,
        rotation: angle + defaultAngle,
      }));
    };

    const mouseUpHandler = () => {
      window.removeEventListener("mousemove", mouseMoveHandler);

      updateObject(object);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler, { once: true });
  };

  const handleDelete = () => {
    // 소유주는 언제나 삭제 가능 - localStorage에 저장된 토큰 사용하여 검증
    // 소유주가 확인 전 혹은 5분 이내에는 삭제 가능 - 작성자 비밀번호 필요

    // TODO : 삭제 확인 모달 추가
    // TODO : DB에서 삭제하는 로직 추가
    deleteObject(object.id);
    setSelectedObjectId(null);
    setIsSelected(false);
  };

  const handleRestoreRatio = () => {
    setObject((prev) => ({
      ...prev,
      height:
        prev.width *
        ((prev.data as ImageInfo).height / (prev.data as ImageInfo).width),
    }));
  };

  const handleCancel = () => {
    setIsSelected(false);
    setObject(value);
    updateObject(value);
    setSelectedObjectId(null);
  };

  const handleSave = () => {
    setIsSelected(false);
    setSelectedObjectId(null);
    if (!isChanged) {
      return;
    }
    // TODO : DB에 저장하는 로직 추가
  };

  return (
    <>
      {isSelected && <div className={styles.backdrop} onClick={handleSave} />}
      <div
        key={object.id}
        onMouseDown={handleMouseDown}
        className={isSelected ? styles.selectedFrame : styles.frame}
        style={{
          cursor: object.disabled ? "default" : "pointer",
          zIndex: isSelected ? 100 : 0,
          left: position.x + (object.x - object.width / 2) * scale,
          top: position.y + (object.y - object.height / 2) * scale,
          width: object.width * scale,
          height: object.height * scale,
          transform: `rotate(${object.rotation}rad)`,
        }}
      >
        {object.data.type === "image" && (
          <img
            className={styles.image}
            src={(object.data as ImageInfo).src}
            alt="object"
          />
        )}
        {isSelected && (
          <>
            <div
              className={styles.scaleHandle}
              onMouseDown={handleResizeMouseDown}
            >
              <img
                className={styles.handleIcon}
                src="icons/resize.webp"
                alt="resize"
              />
            </div>
            <div
              className={styles.rotateHandle}
              onMouseDown={handleRotateMouseDown}
            >
              <img
                className={styles.handleIcon}
                src="icons/rotate.webp"
                alt="rotate"
              />
            </div>
          </>
        )}
      </div>
      {isSelected && (
        <>
          <div className={styles.taskIsland}>
            <button className={styles.taskButton} onClick={handleDelete}>
              <img
                className={styles.taskIcon}
                src="icons/delete.webp"
                alt="delete"
              />
              <p className={styles.taskLabel}>삭제</p>
            </button>
            <div className={styles.taskDivider} />
            <button className={styles.taskButton} onClick={handleRestoreRatio}>
              <img
                className={styles.taskIcon}
                src="icons/ratio.webp"
                alt="ratio-restore"
              />
              <p className={styles.taskLabel}>원본 비율</p>
            </button>
          </div>
          <button className={styles.cancelButton} onClick={handleCancel}>
            <p className={styles.taskLabel}>취소</p>
          </button>
        </>
      )}
    </>
  );
};

export default ObjectComponent;
