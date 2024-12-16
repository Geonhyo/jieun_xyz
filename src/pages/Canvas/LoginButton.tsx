import styles from "./LoginButton.module.css";

type Props = {
  openLoginModal: () => void;
};

const adminCode = process.env.REACT_APP_ADMIN_CODE;

const LoginButton: React.FC<Props> = ({ openLoginModal }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (sessionStorage.getItem("role") === adminCode) {
      sessionStorage.removeItem("role");
      window.location.reload();
      alert("진니 퇴근! 😎");
    } else {
      openLoginModal();
    }
  };

  const isLogined = sessionStorage.getItem("role") === adminCode;

  return (
    <button className={styles.container} onClick={handleClick}>
      <img
        className={styles.image}
        src={`icons/${isLogined ? "logout" : "login"}.webp`}
        alt={isLogined ? "logout" : "login"}
      />
    </button>
  );
};

export default LoginButton;
