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
    // TODO : DB에서 불러오기
    const savedObjects = sessionStorage.getItem("objects");
    if (savedObjects) {
      setObjects((prev) => prev.concat(JSON.parse(savedObjects)));
    }
  }, []);

  const handleResetScale = () => {
    setScale(1);
  };

  const handleResetPosition = () => {
    setPosition({ x: originX, y: originY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const initX = e.clientX;
    const initY = e.clientY;

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }

    const onMouseMove = (event: MouseEvent) => {
      const dx = event.clientX - initX;
      const dy = event.clientY - initY;
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      });
    };

    const onMouseUp = () => {
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab";
      }
      window.removeEventListener("mousemove", onMouseMove);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp, { once: true });
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
    if (code === process.env.ADMIN_CODE) {
      sessionStorage.setItem("role", "master");
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
      onMouseDown={handleMouseDown}
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
