import React, { useState, useRef } from "react";
import styles from "./FontSizeControl.module.css";

type Props = {
  value: number;
  onChangeValue: (value: number) => void;
};

const MIN = 12;
const MAX = 100;

const FontSizeControl: React.FC<Props> = ({ value, onChangeValue }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX =
      (e.type === "mousedown"
        ? (e as React.MouseEvent)
        : (e as React.TouchEvent).touches[0]
      ).clientX - rect.left; // 슬라이더 기준의 X 위치
    const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1); // 0~1 사이로 정규화
    const newValue = Math.round(MIN + percentage * (MAX - MIN)); // 값 계산
    onChangeValue(newValue);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    document.body.style.pointerEvents = "none"; // hover 방지
    document.body.style.userSelect = "none"; // 텍스트 선택 방지
    handleDrag(e);

    const handleMouseMove = (e: MouseEvent | TouchEvent) =>
      handleDrag(e as unknown as React.MouseEvent | React.TouchEvent);

    const handleMouseUp = () => {
      document.body.style.pointerEvents = ""; // hover 다시 활성화
      document.body.style.userSelect = ""; // 텍스트 선택 다시 활성화
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp, { once: true });
  };

  return (
    <div
      className={styles.slider}
      ref={sliderRef}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.scaleBar} />
      <div
        className={styles.handle}
        style={{
          left: `${((value - MIN) / (MAX - MIN)) * 100}%`,
        }}
      />
    </div>
  );
};

export default FontSizeControl;
