import React from "react";
import styles from "./MainSection.module.css";
import CountDown from "./CountDown";

const MainSection: React.FC = () => {
  return (
    <>
      <div className={styles.spacer} />
      <div className={styles.imageContainer}>
        <picture className={styles.image}>
          <source
            type="image/png"
            media="(max-width: 375px)"
            srcSet="images/main/s.png"
          />
          <source
            type="image/png"
            media="(max-width: 440px)"
            srcSet="images/main/m.png"
          />
          <source type="image/png" srcSet="images/main/l.png" />
          <img src="images/main/l.png" alt="Main Image" />
        </picture>
        <CountDown />
      </div>
      <div className={styles.spacer} />
    </>
  );
};

export default MainSection;
