import React, { useRef, useState } from "react";
import {
  ImageInfo,
  ObjectModel,
  StickerInfo,
  TextInfo,
} from "../../models/object";
import styles from "./ObjectComponent.module.css";
import { PositionModel } from "../../models/position";
import FontSizeControl from "./FontSizeControl";

const fontColorList = [
  "#232323", // black
  "#FFFFFF", // white
  "#D32F2F", // red
  "#4EC33C", // green
  "#328BF8", // blue
  "#FFCE2B", // yellow
  "#FF2599", // pink
  "#FF7410", // orange
  "#BA25FF", // purple
  "#808080", // gray
  "#A52A2A", // brown
];

const fontFamilyList = [
  "NotoSansKR",
  "Bangers",
  "Gaegu",
  "NanumGothicCoding",
  "NanumPenScript",
  "NotoSerifKR",
  "Sunflower",
];

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [object, setObject] = useState<ObjectModel>(value);
  const [isSelected, setIsSelected] = useState(value.id === "");
  const [isChanged, setIsChanged] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState<
    "size" | "color" | null
  >(null);

  const handleMouseDown = async (e: React.MouseEvent | React.TouchEvent) => {
    if (object.disabled) {
      return;
    }

    e.stopPropagation();

    const isAdmin = sessionStorage.getItem("role") === "master";

    const isExpired =
      new Date().getTime() - new Date(object.createdAt).getTime() >
      10 * 60 * 1000;

    if (!isAdmin && isExpired && object.id !== "") {
      return;
    }

    let hasHistory = false;

    const historyObjectIds = sessionStorage.getItem("history");
    if (historyObjectIds) {
      const objectIds = JSON.parse(historyObjectIds);
      if (objectIds.includes(object.id)) {
        hasHistory = true;
      }
    }

    if (!isAdmin && !hasHistory && object.id !== "") {
      return;
    }

    if (!isSelected) {
      setIsSelected(true);
      setSelectedObjectId(object.id);
    }

    const initX = (
      e.type === "mousedown"
        ? (e as React.MouseEvent)
        : (e as React.TouchEvent).touches[0]
    ).pageX;
    const initY = (
      e.type === "mousedown"
        ? (e as React.MouseEvent)
        : (e as React.TouchEvent).touches[0]
    ).pageY;

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      if (!isChanged) {
        setIsChanged(true);
      }
      const dx =
        (e.type === "mousemove"
          ? (e as MouseEvent)
          : (e as TouchEvent).touches[0]
        ).pageX - initX;
      const dy =
        (e.type === "mousemove"
          ? (e as MouseEvent)
          : (e as TouchEvent).touches[0]
        ).pageY - initY;
      setObject((prev) => ({
        ...prev,
        x: object.x + dx / scale,
        y: object.y + dy / scale,
      }));
    };

    const mouseUpHandler = () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("touchmove", mouseMoveHandler);
      window.removeEventListener("touchend", mouseUpHandler);

      updateObject(object);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler, { once: true });
    window.addEventListener("touchmove", mouseMoveHandler);
    window.addEventListener("touchend", mouseUpHandler, { once: true });
  };

  const handleResizeMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const initX = (
      e.type === "mousedown"
        ? (e as React.MouseEvent)
        : (e as React.TouchEvent).touches[0]
    ).pageX;
    const initY = (
      e.type === "mousedown"
        ? (e as React.MouseEvent)
        : (e as React.TouchEvent).touches[0]
    ).pageY;

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      if (!isChanged) {
        setIsChanged(true);
      }
      const dx =
        (e.type === "mousemove"
          ? (e as MouseEvent)
          : (e as TouchEvent).touches[0]
        ).pageX - initX;
      const dy =
        (e.type === "mousemove"
          ? (e as MouseEvent)
          : (e as TouchEvent).touches[0]
        ).pageY - initY;

      const localDx =
        dx * Math.cos(object.rotation) + dy * Math.sin(object.rotation);
      const localDy =
        dy * Math.cos(object.rotation) - dx * Math.sin(object.rotation);

      setObject((prev) => ({
        ...prev,
        width: Math.max(32, object.width + (localDx * 2) / scale), // 최소 크기 제한
        height: Math.max(32, object.height + (localDy * 2) / scale), // 최소 크기 제한
      }));

      if (object.data.type === "text" && textareaRef.current) {
        // 높이를 초기화한 후 scrollHeight로 다시 설정
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const mouseUpHandler = () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("touchmove", mouseMoveHandler);
      window.removeEventListener("touchend", mouseUpHandler);

      updateObject(object);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler, { once: true });
    window.addEventListener("touchmove", mouseMoveHandler);
    window.addEventListener("touchend", mouseUpHandler, { once: true });
  };

  const handleRotateMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const defaultAngle = Math.atan2(object.height, object.width);

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      if (!isChanged) {
        setIsChanged(true);
      }
      const angle = Math.atan2(
        (e.type === "mousemove"
          ? (e as MouseEvent)
          : (e as TouchEvent).touches[0]
        ).pageY -
          object.y * scale -
          position.y,

        (e.type === "mousemove"
          ? (e as MouseEvent)
          : (e as TouchEvent).touches[0]
        ).pageX -
          object.x * scale -
          position.x
      );
      setObject((prev) => ({
        ...prev,
        rotation: angle + defaultAngle,
      }));
    };

    const mouseUpHandler = () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("touchmove", mouseMoveHandler);
      window.removeEventListener("touchend", mouseUpHandler);

      updateObject(object);
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler, { once: true });
    window.addEventListener("touchmove", mouseMoveHandler);
    window.addEventListener("touchend", mouseUpHandler, { once: true });
  };

  const handleDelete = () => {
    if (object.id !== "") {
      // TODO : DB에서 삭제하는 로직 추가
      sessionStorage.setItem(
        "objects",
        JSON.stringify(
          JSON.parse(sessionStorage.getItem("objects") || "[]").filter(
            (obj: any) => obj.id !== object.id
          )
        )
      );
    }
    deleteObject(object.id);
    setSelectedObjectId(null);
    setIsSelected(false);
  };

  const handleRestoreRatio = () => {
    if (object.data.type === "image") {
      setObject((prev) => ({
        ...prev,
        height:
          prev.width *
          ((prev.data as ImageInfo).height / (prev.data as ImageInfo).width),
      }));
      return;
    }

    if (object.data.type === "sticker") {
      setObject((prev) => ({
        ...prev,
        height:
          prev.width *
          ((prev.data as StickerInfo).height /
            (prev.data as StickerInfo).width),
      }));
      return;
    }
  };

  const handleCancel = () => {
    setIsSelected(false);
    setObject(value);
    updateObject(value);
    setSelectedObjectId(null);
  };

  const handleBackdropMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    let mouseMovedCount = 0;
    const onMouseMove = () => {
      mouseMovedCount++;
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);

      if (mouseMovedCount > 5) {
        return;
      }

      setIsSelected(false);
      setSelectedObjectId(null);

      if (
        object.id !== "" &&
        object.data.type === "text" &&
        object.data.text === ""
      ) {
        // TODO : DB에서 삭제하는 로직 추가
        sessionStorage.setItem(
          "objects",
          JSON.stringify(
            JSON.parse(sessionStorage.getItem("objects") || "[]").filter(
              (obj: any) => obj.id !== object.id
            )
          )
        );
        deleteObject(object.id);
        return;
      }

      if (!isChanged && object.id !== "") {
        return;
      }

      if (object.id === "") {
        // TODO : DB에 저장하는 로직 추가
        // TODO : DB에서 새로운 id를 받아오는 로직 추가
        const insertedId = new Date().getTime().toString();

        sessionStorage.setItem(
          "objects",
          JSON.stringify(
            JSON.parse(sessionStorage.getItem("objects") || "[]").concat({
              ...object,
              id: insertedId,
            })
          )
        );
        sessionStorage.setItem(
          "history",
          JSON.stringify(
            JSON.parse(sessionStorage.getItem("history") || "[]").concat(
              insertedId
            )
          )
        );
        updateObject({ ...object, id: insertedId });
        // setObject((prev) => ({ ...prev, id: insertedId }));
        return;
      }

      // TODO : DB에서 업데이트하는 로직 추가
      sessionStorage.setItem(
        "objects",
        JSON.stringify(
          JSON.parse(sessionStorage.getItem("objects") || "[]").map(
            (obj: any) => (obj.id === object.id ? object : obj)
          )
        )
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp, { once: true });
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchend", onMouseUp, { once: true });
  };

  const handleTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setObject((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        text,
      },
    }));
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTextBackdropClicked = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSubTask(null);
  };

  const handleTextFamilyClicked = () => {
    setObject((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        family:
          fontFamilyList[
            (fontFamilyList.indexOf((prev.data as TextInfo).family) + 1) %
              fontFamilyList.length
          ],
      } as TextInfo,
    }));
    setSelectedSubTask(null);
  };

  const handleTextColorClicked = () => {
    setSelectedSubTask("color");
  };

  const handleTextSizeClicked = () => {
    setSelectedSubTask("size");
  };

  const handleTextWeightClicked = () => {
    setSelectedSubTask(null);
    setObject((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        bold: !(prev.data as TextInfo).bold,
      } as TextInfo,
    }));
  };

  const handleTextColorSelected = (e: React.MouseEvent) => {
    const color = (e.target as HTMLButtonElement).value;
    setObject((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        color,
      },
    }));
  };

  const handleTextSizeChanged = (value: number) => {
    setObject((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        size: value,
      },
    }));
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <>
      {isSelected && (
        <div
          className={styles.backdrop}
          onMouseDown={handleBackdropMouseDown}
        />
      )}
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
          overflow: "visible",
        }}
      >
        {object.data.type === "image" && (
          <img
            className={styles.image}
            style={{
              cursor: isSelected ? "move" : "inherit",
            }}
            src={(object.data as ImageInfo).src}
            alt="object"
          />
        )}
        {object.data.type === "sticker" && (
          <img
            className={styles.image}
            style={{
              cursor: isSelected ? "move" : "inherit",
            }}
            src={`stickers/${(object.data as StickerInfo).category}/${
              (object.data as StickerInfo).src
            }.png`}
            alt="object"
          />
        )}
        {object.data.type === "text" && (
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="텍스트를 입력하세요"
            autoFocus={isSelected}
            disabled={object.disabled}
            style={{
              maxWidth: "100%",
              width: "100%",
              height: "auto",
              fontSize: (object.data as TextInfo).size * scale,
              lineHeight: (object.data as TextInfo).size < 48 ? "1.25" : "1",
              color: (object.data as TextInfo).color,
              fontFamily: (object.data as TextInfo).family,
              fontWeight: (object.data as TextInfo).bold ? "bold" : "normal",
              resize: "none",
              overflow: "hidden",
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              cursor: object.disabled || isSelected ? "text" : "move",
            }}
            value={(object.data as TextInfo).text}
            onChange={handleTextChanged}
            wrap="hard"
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
            {object.data.type === "image" ||
              (object.data.type === "sticker" && (
                <>
                  <div className={styles.taskDivider} />
                  <button
                    className={styles.taskButton}
                    onClick={handleRestoreRatio}
                  >
                    <img
                      className={styles.taskIcon}
                      src="icons/ratio.webp"
                      alt="ratio-restore"
                    />
                    <p className={styles.taskLabel}>원본 비율</p>
                  </button>
                </>
              ))}
            {object.data.type === "text" && object.data.text !== "" && (
              <>
                {selectedSubTask !== null && (
                  <div
                    className={styles.backdrop}
                    onMouseDown={handleTextBackdropClicked}
                  />
                )}

                <div className={styles.taskDivider} />
                <button
                  className={styles.taskButton}
                  onMouseDown={handleTextFamilyClicked}
                >
                  <img
                    className={styles.taskIcon}
                    src="icons/font-family.webp"
                    alt="font-family"
                  />
                </button>
                <button
                  className={styles.taskButton}
                  onMouseDown={handleTextColorClicked}
                >
                  <img
                    className={styles.taskIcon}
                    src="icons/font-color.webp"
                    alt="font-family"
                  />
                </button>
                <button
                  className={styles.taskButton}
                  onMouseDown={handleTextSizeClicked}
                >
                  <img
                    className={styles.taskIcon}
                    src="icons/font-size.webp"
                    alt="font-family"
                  />
                </button>
                <button
                  className={styles.taskButton}
                  onMouseDown={handleTextWeightClicked}
                  style={{
                    backgroundColor: (object.data as TextInfo).bold
                      ? "var(--black)"
                      : "transparent",
                  }}
                >
                  <img
                    className={styles.taskIcon}
                    src="icons/font-weight.webp"
                    alt="font-family"
                  />
                </button>
                {selectedSubTask === "color" && (
                  <div className={styles.subTaskIsland}>
                    {fontColorList.map((color) => (
                      <button
                        className={styles.colorCircle}
                        style={{
                          backgroundColor: color,
                          border:
                            color === (object.data as TextInfo).color
                              ? `3px solid var(--black)`
                              : "inherit",
                        }}
                        value={color}
                        onMouseDown={handleTextColorSelected}
                      />
                    ))}
                  </div>
                )}
                {selectedSubTask === "size" && (
                  <div className={styles.subTaskIsland}>
                    <FontSizeControl
                      value={object.data.size}
                      onChangeValue={handleTextSizeChanged}
                    />
                  </div>
                )}
              </>
            )}
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
