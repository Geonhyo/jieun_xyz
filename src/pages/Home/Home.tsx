import styles from "./Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <img className={styles.image} src="images/main.png" />
      <div className={styles.footer}>
        <p className={styles.credit}>Designed By 정서, Made by 건효</p>
        <a href="/2024-12-21" className={styles.button}>
          <span className={styles.label}>롤링페이퍼 작성하기</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13.172 12l-4.95-4.95 1.414-1.414L17 12l-7.364 7.364-1.414-1.414z" />
          </svg>
        </a>
        <p className={styles.date}>2024.12.21</p>
      </div>
    </div>
  );
};

export default Home;
