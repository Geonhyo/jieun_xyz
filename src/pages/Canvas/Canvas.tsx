import React, { useRef, useState } from "react";
import styles from "./Canvas.module.css";
import BackButton from "./BackButton";
import CreateButton from "./CreateButton";
import { ImageInfo, ObjectModel, TextInfo } from "../../models/object";
import { PositionModel } from "../../models/position";
import ScaleButton from "./ScaleButton";
import ObjectComponent from "./ObjectComponent";
import PositionButton from "./PositionButton";

const originX = window.innerWidth / 2;
const originY = window.innerHeight / 2;

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

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
    },
  ]);

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
        x: position.x - originX,
        y: position.y - originY,
        z: maxZ + 1,
        rotation: 0,
        data: image,
        disabled: false,
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
        if (obj.id === object.id) {
          return object;
        }
        return obj;
      })
    );
  };

  return (
    <main
      ref={canvasRef}
      className={styles.wrapper}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{
        backgroundPosition: `${position.x}px ${position.y}px`, // 배경 위치 조정
        backgroundSize: `${100 * scale}%`, // 배경 크기 조정
      }}
    >
      {objects.map((object) => {
        return (
          <ObjectComponent
            key={object.id}
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
          <CreateButton addImage={handleAddImage} />
        </>
      )}
    </main>
  );
};

export default Canvas;
