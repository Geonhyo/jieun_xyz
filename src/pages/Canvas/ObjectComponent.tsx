import React, { useEffect, useRef, useState } from "react";
import {
  ImageInfo,
  ObjectModel,
  StickerInfo,
  TextInfo,
} from "../../models/object";
import styles from "./ObjectComponent.module.css";
import { PositionModel } from "../../models/position";
import FontSizeControl from "./FontSizeControl";
import { db, storage } from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "@firebase/firestore";

const adminCode = process.env.REACT_APP_ADMIN_CODE;

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
  getMaxZ: () => number;
  deleteObject: (id: string) => void;
  updateObject: (object: ObjectModel) => void;
};

const ObjectComponent: React.FC<Props> = ({
  object: value,
  scale,
  position,
  setSelectedObjectId,
  getMaxZ,
  deleteObject,
  updateObject,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [object, setObject] = useState<ObjectModel>(value);
  const [isSelected, setIsSelected] = useState(value.id === "");
  const [isChanged, setIsChanged] = useState(false);
  const [selectedSubTask, setSelectedSubTask] = useState<
    "family" | "size" | "color" | null
  >(null);

  useEffect(() => {
    if (object.data.type !== "text") {
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    return () => {};
  }, [scale, object.data, object.width, object.height]);

  const handleTap = async (e: React.MouseEvent | React.TouchEvent) => {
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      e.stopPropagation();
      textareaRef.current.blur();
      return;
    }

    if (object.disabled) {
      return;
    }

    e.stopPropagation();

    const isAdmin = sessionStorage.getItem("role") === adminCode;

    const isExpired =
      new Date().getTime() - new Date(object.createdAt).getTime() >
      30 * 60 * 1000;

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

    if (e.type === "mousedown") {
      onMouseTap(e as React.MouseEvent);
      return;
    }

    if (e.type === "touchstart") {
      onTouchTap(e as React.TouchEvent);
      return;
    }
  };

  const onMouseTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const initX = e.pageX;
    const initY = e.pageY;
    let data = object;

    const onMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (!isChanged) {
        setIsChanged(true);
      }
      const dx = e.pageX - initX;
      const dy = e.pageY - initY;
      setObject((prev) => {
        data = {
          ...prev,
          x: object.x + dx / scale,
          y: object.y + dy / scale,
        };

        return data;
      });
    };

    const onEnd = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);

      updateObject(data);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd, { once: true });
  };

  const onTouchTap = (e: React.TouchEvent) => {
    e.stopPropagation();
    const isMultiTouch = e.touches.length > 1;

    const firstX = e.touches[0].pageX;
    const firstY = e.touches[0].pageY;
    const secondX = isMultiTouch ? e.touches[1].pageX : firstX;
    const secondY = isMultiTouch ? e.touches[1].pageY : firstY;
    let data = object;

    const onMove = (e: TouchEvent) => {
      e.stopPropagation();
      if (!isChanged) {
        setIsChanged(true);
      }

      const firstDx = e.touches[0].pageX - firstX;
      const firstDy = e.touches[0].pageY - firstY;
      const secondDx = isMultiTouch ? e.touches[1].pageX - secondX : firstDx;
      const secondDy = isMultiTouch ? e.touches[1].pageY - secondY : firstDy;

      setObject((prev) => {
        data = {
          ...prev,
          x: object.x + (firstDx + secondDx) / (2 * scale),
          y: object.y + (firstDy + secondDy) / (2 * scale),
        };

        return data;
      });
    };

    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);

      updateObject(data);
    };

    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd, { once: true });
  };

  const handleTapResize = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (
      textareaRef.current &&
      document.activeElement === textareaRef.current &&
      e.type === "touchstart"
    ) {
      textareaRef.current.blur();
      return;
    }

    if (e.type === "mousedown") {
      onMouseTapResize(e as React.MouseEvent);
      return;
    }

    if (e.type === "touchstart") {
      onTouchTapResize(e as React.TouchEvent);
      return;
    }
  };

  const onMouseTapResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const initX = e.pageX;
    const initY = e.pageY;
    let data = object;

    const onMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (!isChanged) {
        setIsChanged(true);
      }
      const dx = e.pageX - initX;
      const dy = e.pageY - initY;

      const localDx =
        dx * Math.cos(object.rotation) + dy * Math.sin(object.rotation);
      const localDy =
        dy * Math.cos(object.rotation) - dx * Math.sin(object.rotation);

      const ratio =
        object.data.type !== "text"
          ? (object.data as ImageInfo | StickerInfo).height /
            (object.data as ImageInfo | StickerInfo).width
          : 1;
      const newWidth = object.width + (localDx * 2) / scale;
      const newHeight =
        object.data.type !== "text"
          ? newWidth * ratio
          : object.height + (localDy * 2) / scale;
      const minWidth = 32;
      const minHeight = 32;

      setObject((prev) => {
        data = {
          ...prev,
          width: Math.max(minWidth, newWidth),
          height: Math.max(minHeight, newHeight),
        };

        return data;
      });
    };

    const onEnd = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);

      updateObject(data);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd, { once: true });
  };

  const onTouchTapResize = (e: React.TouchEvent) => {
    e.stopPropagation();
    const initX = e.touches[0].pageX;
    const initY = e.touches[0].pageY;
    let data = object;

    const onMove = (e: TouchEvent) => {
      e.stopPropagation();
      if (!isChanged) {
        setIsChanged(true);
      }
      const dx = e.touches[0].pageX - initX;
      const dy = e.touches[0].pageY - initY;

      const localDx =
        dx * Math.cos(object.rotation) + dy * Math.sin(object.rotation);
      const localDy =
        dy * Math.cos(object.rotation) - dx * Math.sin(object.rotation);

      const ratio =
        object.data.type !== "text"
          ? (object.data as ImageInfo | StickerInfo).height /
            (object.data as ImageInfo | StickerInfo).width
          : 1;
      const newWidth = object.width + (localDx * 2) / scale;
      const newHeight =
        object.data.type !== "text"
          ? newWidth * ratio
          : object.height + (localDy * 2) / scale;
      const minWidth = 32;
      const minHeight = 32;

      setObject((prev) => {
        data = {
          ...prev,
          width: Math.max(minWidth, newWidth),
          height: Math.max(minHeight, newHeight),
        };

        return data;
      });
    };

    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);

      updateObject(data);
    };

    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd, { once: true });
  };

  const handleTapRotation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (
      textareaRef.current &&
      document.activeElement === textareaRef.current &&
      e.type === "touchstart"
    ) {
      textareaRef.current.blur();
      return;
    }

    if (e.type === "mousedown") {
      onMouseTapRotation(e as React.MouseEvent);
      return;
    }

    if (e.type === "touchstart") {
      onTouchTapRotation(e as React.TouchEvent);
      return;
    }
  };

  const onMouseTapRotation = (e: React.MouseEvent) => {
    const defaultAngle = Math.atan2(object.height, object.width);
    let data = object;

    const onMove = (e: MouseEvent) => {
      e.stopPropagation();
      if (!isChanged) {
        setIsChanged(true);
      }
      const angle = Math.atan2(
        e.pageY - object.y * scale - position.y,

        e.pageX - object.x * scale - position.x
      );
      setObject((prev) => {
        data = {
          ...prev,
          rotation: angle + defaultAngle,
        };

        return data;
      });
    };

    const onEnd = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);

      updateObject(data);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd, { once: true });
  };

  const onTouchTapRotation = (e: React.TouchEvent) => {
    const defaultAngle = Math.atan2(object.height, object.width);
    let data = object;

    const onMove = (e: TouchEvent) => {
      e.stopPropagation();
      if (!isChanged) {
        setIsChanged(true);
      }
      const angle = Math.atan2(
        e.touches[0].pageY - object.y * scale - position.y,
        e.touches[0].pageX - object.x * scale - position.x
      );
      setObject((prev) => {
        data = {
          ...prev,
          rotation: angle + defaultAngle,
        };

        return data;
      });
    };

    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);

      updateObject(data);
    };

    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd, { once: true });
  };

  const handleDelete = async () => {
    if (object.id !== "") {
      try {
        await deleteDoc(doc(db, "canvas", object.id));
        deleteObject(object.id);
        setSelectedObjectId(null);
        setIsSelected(false);
      } catch (e) {
        console.error(e);
        alert("오류가 발생하여 삭제에 실패했습니다.");
      }
      return;
    }
    deleteObject(object.id);
    setSelectedObjectId(null);
    setIsSelected(false);
  };

  const handleCancel = () => {
    setIsSelected(false);
    setObject(value);
    updateObject(value);
    setSelectedObjectId(null);
  };

  const handleMaxZ = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    const maxZ = getMaxZ();
    if (maxZ + 1 > object.z && !isChanged) {
      setIsChanged(true);
    }
    const newObject = {
      ...object,
      z: maxZ + 1,
    };
    setObject(newObject);
    updateObject(newObject);
  };

  const handleTapBackdrop = (e: React.MouseEvent | React.TouchEvent) => {
    if (textareaRef.current && document.activeElement === textareaRef.current) {
      e.stopPropagation();
      textareaRef.current.blur();
      return;
    }

    let movedCount = 0;
    const onMove = (e: MouseEvent | TouchEvent) => {
      movedCount++;
    };

    const onEnd = async () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);

      if (movedCount > 5) {
        return;
      }

      setIsSelected(false);
      setSelectedObjectId(null);

      if (
        object.id !== "" &&
        object.data.type === "text" &&
        object.data.text === ""
      ) {
        try {
          await deleteDoc(doc(db, "canvas", object.id));
          deleteObject(object.id);
        } catch (e) {
          console.error(e);
          alert("오류가 발생하여 삭제에 실패했습니다.");
        } finally {
          return;
        }
      }

      if (!isChanged && object.id !== "") {
        return;
      }

      let data = object.data;

      if (object.id === "") {
        if (object.data.type === "image") {
          const response = await fetch((object.data as ImageInfo).src);
          const blob = await response.blob();
          const imageName = Date.now().toString();
          const storageRef = ref(storage, imageName);
          const snapshot = await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(snapshot.ref);
          data = {
            ...object.data,
            src: downloadURL,
          };
        }

        if (object.data.type === "text" && object.data.text === "") {
          deleteObject(object.id);
          return;
        }

        const docRef = await addDoc(collection(db, "canvas"), {
          x: object.x,
          y: object.y,
          z: object.z,
          rotation: object.rotation,
          width: object.width,
          height: object.height,
          data,
          disabled: false,
          createdAt: new Date().toISOString(),
        });

        const addedObject: ObjectModel = {
          ...object,
          data,
          id: docRef.id,
        };

        sessionStorage.setItem(
          "history",
          JSON.stringify(
            JSON.parse(sessionStorage.getItem("history") || "[]").concat(
              docRef.id
            )
          )
        );
        updateObject(addedObject);
        return;
      }

      // TODO : DB에서 업데이트하는 로직 추가
      const docRef = doc(db, "canvas", object.id); // 문서 참조 생성
      await updateDoc(docRef, {
        x: object.x,
        y: object.y,
        z: object.z,
        rotation: object.rotation,
        width: object.width,
        height: object.height,
        data: object.data,
      });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd, { once: true });
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd, { once: true });
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
  };

  const handleTextBackdropClicked = (
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    setSelectedSubTask(null);
  };

  const handleTextFamilyClicked = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setSelectedSubTask("family");
  };

  const handleTextColorClicked = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setSelectedSubTask("color");
  };

  const handleTextSizeClicked = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setSelectedSubTask("size");
  };

  const handleTextWeightClicked = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    setSelectedSubTask(null);
    setObject((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        bold: !(prev.data as TextInfo).bold,
      } as TextInfo,
    }));
  };

  const handleTextFamilySelected = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const family = (e.currentTarget as HTMLButtonElement).value;
    setObject((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        family,
      },
    }));
  };

  const handleTextColorSelected = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
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
  };

  return (
    <>
      {isSelected && (
        <div
          className={styles.backdrop}
          onMouseDown={handleTapBackdrop}
          onTouchStart={handleTapBackdrop}
        />
      )}
      <div
        key={object.id}
        onMouseDown={handleTap}
        onTouchStart={handleTap}
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
            disabled={
              object.disabled ||
              (sessionStorage.getItem("role") !== adminCode &&
                (new Date().getTime() - new Date(object.createdAt).getTime() >
                  30 * 60 * 1000 ||
                  (object.id !== "" &&
                    !JSON.parse(
                      sessionStorage.getItem("history") || "[]"
                    ).includes(object.id))))
            }
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              maxWidth: "100%",
              width: "100%",
              height: "auto",
              fontSize: `${(object.data as TextInfo).size * scale}px`,
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
              onMouseDown={handleTapResize}
              onTouchStart={handleTapResize}
            >
              <img
                className={styles.handleIcon}
                src="icons/resize.webp"
                alt="resize"
              />
            </div>
            <div
              className={styles.rotateHandle}
              onMouseDown={handleTapRotation}
              onTouchStart={handleTapRotation}
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
            <button className={styles.taskButton} onClick={handleMaxZ}>
              <p className={styles.taskLabel}>맨 앞으로</p>
            </button>
          </div>
          <button className={styles.cancelButton} onClick={handleCancel}>
            <p className={styles.taskLabel}>취소</p>
          </button>
          {object.data.type === "text" && object.data.text !== "" && (
            <>
              <div className={styles.secondTaskIsland}>
                <button
                  className={styles.taskButton}
                  style={{
                    backgroundColor:
                      selectedSubTask === "family"
                        ? "var(--black)"
                        : "transparent",
                  }}
                  onClick={handleTextFamilyClicked}
                >
                  <img
                    className={styles.taskIcon}
                    src="icons/font-family.webp"
                    alt="font-family"
                  />
                </button>
                <button
                  className={styles.taskButton}
                  style={{
                    backgroundColor:
                      selectedSubTask === "color"
                        ? "var(--black)"
                        : "transparent",
                  }}
                  onClick={handleTextColorClicked}
                >
                  <img
                    className={styles.taskIcon}
                    src="icons/font-color.webp"
                    alt="font-family"
                  />
                </button>
                <button
                  className={styles.taskButton}
                  style={{
                    backgroundColor:
                      selectedSubTask === "size"
                        ? "var(--black)"
                        : "transparent",
                  }}
                  onClick={handleTextSizeClicked}
                >
                  <img
                    className={styles.taskIcon}
                    src="icons/font-size.webp"
                    alt="font-family"
                  />
                </button>
                <button
                  className={styles.taskButton}
                  onClick={handleTextWeightClicked}
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
              </div>
              {selectedSubTask !== null && (
                <div
                  className={styles.backdrop}
                  onMouseDown={handleTextBackdropClicked}
                  onTouchStart={handleTextBackdropClicked}
                />
              )}
              {selectedSubTask === "family" && (
                <div className={styles.subTaskIsland}>
                  {fontFamilyList.map((family) => (
                    <button
                      key={family}
                      className={styles.fontFamilyButton}
                      style={{
                        fontFamily: family,
                        backgroundColor:
                          family === (object.data as TextInfo).family
                            ? "var(--black)"
                            : "var(--gray)",
                      }}
                      value={family}
                      onClick={handleTextFamilySelected}
                    >
                      <p>{family}</p>
                    </button>
                  ))}
                </div>
              )}
              {selectedSubTask === "color" && (
                <div className={styles.subTaskIsland}>
                  {fontColorList.map((color) => (
                    <button
                      key={color}
                      className={styles.colorCircle}
                      style={{
                        backgroundColor: color,
                        border:
                          color === (object.data as TextInfo).color
                            ? `3px solid var(--black)`
                            : "inherit",
                      }}
                      value={color}
                      onClick={handleTextColorSelected}
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
        </>
      )}
    </>
  );
};

export default ObjectComponent;
