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

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    document.body.style.pointerEvents = "none";
    document.body.style.userSelect = "none";

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
    const onMove = (e: MouseEvent | React.MouseEvent) => {
      e.stopPropagation();
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left; //x-position relative to the slider
      const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1); // Regularize between 0 and 1
      const newValue = Math.round(MIN + percentage * (MAX - MIN)); // Calculate value
      onChangeValue(newValue);
    };

    const onEnd = () => {
      document.body.style.pointerEvents = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
    };

    onMove(e);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd, { once: true });
  };

  const onTouchTap = (e: React.TouchEvent) => {
    const onMove = (e: TouchEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const offsetX = e["touches"][0].clientX - rect.left; //x-position relative to the slider
      const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1); // Regularize between 0 and 1
      const newValue = Math.round(MIN + percentage * (MAX - MIN)); // Calculate value
      onChangeValue(newValue);
    };

    const onEnd = () => {
      document.body.style.pointerEvents = "";
      document.body.style.userSelect = "";
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };

    onMove(e);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd, { once: true });
  };

  return (
    <div className={styles.slider} ref={sliderRef} onMouseDown={handleTap}>
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
