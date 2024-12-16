import React, { useEffect, useRef, useState } from "react";
import styles from "./Canvas.module.css";
import BackButton from "./BackButton";
import CreateButton from "./CreateButton";
import {
  ImageInfo,
  ObjectModel,
  StickerInfo,
  TextInfo,
} from "../../models/object";
import { PositionModel } from "../../models/position";
import ScaleButton from "./ScaleButton";
import ObjectComponent from "./ObjectComponent";
import PositionButton from "./PositionButton";
import LoginButton from "./LoginButton";
import LoginModal from "./LoginModal";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebaseConfig";

const originX = window.innerWidth / 2;
const originY = window.innerHeight / 2;

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoginModalOpened, setIsLoginModalOpened] = useState<boolean>(false);
  const [scale, setScale] = React.useState<number>(1);
  const [position, setPosition] = useState<PositionModel>({
    x: originX,
    y: originY,
  });
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [objects, setObjects] = useState<ObjectModel[]>([
    {
      id: "####",
      x: 0,
      y: 0,
      z: 0,
      rotation: 0,
      width: 212,
      height: 212,
      disabled: true,
      data: {
        type: "image",
        src: "/images/center.png",
        width: 200,
        height: 212,
      },
      createdAt: new Date("2024-12-15").toISOString(),
    },
  ]);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "canvas"));

        // map()을 사용해 데이터를 변환
        const fetchedObjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ObjectModel[];

        setObjects((prev) => prev.concat(fetchedObjects));
      } catch (error) {
        console.error("Error fetching canvas objects:", error);
      }
    };

    fetchObjects();
  }, []);

  const handleResetScale = () => {
    setScale(1);
  };

  const handleResetPosition = () => {
    setPosition({ x: originX, y: originY });
  };

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
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
    const initX = e.clientX;
    const initY = e.clientY;

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }

    const onMove = (event: MouseEvent) => {
      const dx = event.clientX - initX;
      const dy = event.clientY - initY;
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });
    };

    const onEnd = () => {
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab";
      }
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd, { once: true });
  };

  const onTouchTap = (e: React.TouchEvent) => {
    const isMultiTouch = e.touches.length > 1;

    const firstX = e.touches[0].clientX;
    const firstY = e.touches[0].clientY;
    const secondX = isMultiTouch ? e.touches[1].clientX : firstX;
    const secondY = isMultiTouch ? e.touches[1].clientY : firstY;
    let initDist = isMultiTouch
      ? Math.sqrt(Math.pow(secondX - firstX, 2) + Math.pow(secondY - firstY, 2))
      : 0;

    const onMove = (event: TouchEvent) => {
      const firstDx = event.touches[0].clientX - firstX;
      const firstDy = event.touches[0].clientY - firstY;
      const secondDx = isMultiTouch
        ? event.touches[1].clientX - secondX
        : firstDx;
      const secondDy = isMultiTouch
        ? event.touches[1].clientY - secondY
        : firstDy;

      // Move
      setPosition({
        x: position.x + (firstDx + secondDx) / 2,
        y: position.y + (firstDy + secondDy) / 2,
      });

      // Scale
      if (isMultiTouch) {
        const newDist = Math.sqrt(
          Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) +
            Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2)
        );

        const scaleDelta = newDist / initDist;
        initDist = newDist;

        setScale((prev) =>
          Math.max(0.1, Math.min(prev + (scaleDelta - 1) * scale, 5))
        );
      }
    };

    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };

    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd, { once: true });
  };

  // 확대/축소
  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? -0.05 : 0.05; // 휠 방향에 따른 확대/축소
    setScale((prev) => Math.max(0.1, Math.min(prev + delta, 5)));
  };

  const handleAddImage = async (image: ImageInfo) => {
    const width = 244;
    const height = 244 * (image.height / image.width);
    const maxZ =
      objects.length > 0 ? Math.max(...objects.map((obj) => obj.z)) : 0;

    setObjects((prev) =>
      prev.concat({
        id: "",
        width,
        height,
        x: originX - position.x,
        y: originY - position.y,
        z: maxZ + 1,
        rotation: 0,
        data: image,
        disabled: false,
        createdAt: new Date().toISOString(),
      })
    );
  };

  const handleAddText = async () => {
    const width = 244;
    const height = 36;
    const maxZ =
      objects.length > 0 ? Math.max(...objects.map((obj) => obj.z)) : 0;

    setObjects((prev) =>
      prev.concat({
        id: "",
        width,
        height,
        x: originX - position.x,
        y: originY - position.y,
        z: maxZ + 1,
        rotation: 0,
        data: {
          type: "text",
          text: "",
          size: 24,
          color: "#232323",
          family: "Pretendard",
          bold: false,
        } as TextInfo,
        disabled: false,
        createdAt: new Date().toISOString(),
      })
    );
  };

  const handleAddSticker = async (sticker: StickerInfo) => {
    const width = Math.min(sticker.width, 224);
    const height = width * (sticker.height / sticker.width);
    const maxZ =
      objects.length > 0 ? Math.max(...objects.map((obj) => obj.z)) : 0;

    setObjects((prev) =>
      prev.concat({
        id: "",
        width,
        height,
        x: originX - position.x,
        y: originY - position.y,
        z: maxZ + 1,
        rotation: 0,
        data: sticker,
        disabled: false,
        createdAt: new Date().toISOString(),
      })
    );
  };

  const handleObjectDeleted = (id: string) => {
    setObjects((prev) => prev.filter((obj) => obj.id !== id));
  };

  const handleObjectUpdated = (object: ObjectModel) => {
    // 객체를 배열에 반영
    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id === object.id || obj.id === "") {
          return object;
        }
        return obj;
      })
    );
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpened(false);
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpened(true);
  };

  const handleLoginSubmitted = (code: string) => {
    const adminCode = process.env.REACT_APP_ADMIN_CODE;
    if (code === adminCode) {
      sessionStorage.setItem("role", adminCode);
      setIsLoginModalOpened(false);
    } else {
      alert("비밀 코드가 올바르지 않습니다.");
    }
  };

  return (
    <main
      id="canvas"
      ref={canvasRef}
      className={styles.wrapper}
      onMouseDown={handleTap}
      onTouchStart={handleTap}
      onWheel={handleWheel}
      style={{
        backgroundPosition: `${position.x}px ${position.y}px`, // 배경 위치 조정
        backgroundSize: `${100 * scale}%`, // 배경 크기 조정
      }}
    >
      {objects.map((object, index) => {
        return (
          <ObjectComponent
            key={`${object.id}-${index}`}
            scale={scale}
            position={position}
            object={object}
            deleteObject={handleObjectDeleted}
            setSelectedObjectId={setSelectedObjectId}
            updateObject={handleObjectUpdated}
          />
        );
      })}
      {!selectedObjectId && (
        <>
          <ScaleButton scale={scale} resetScale={handleResetScale} />
          <PositionButton
            position={position}
            origin={{ x: originX, y: originY }}
            resetPosition={handleResetPosition}
          />
          <BackButton />
          <LoginButton openLoginModal={handleLoginModalOpen} />
          <CreateButton
            addImage={handleAddImage}
            addText={handleAddText}
            addSticker={handleAddSticker}
          />
        </>
      )}
      {isLoginModalOpened && (
        <LoginModal
          onClose={handleLoginModalClose}
          onSubmit={handleLoginSubmitted}
        />
      )}
    </main>
  );
};

export default Canvas;
