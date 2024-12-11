import React from "react";
import styles from "./Home.module.css";
import MainSection from "./MainSection";
import FloatingButton from "./Button";

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <MainSection />
      <FloatingButton />
    </div>
  );
};

export default Home;
