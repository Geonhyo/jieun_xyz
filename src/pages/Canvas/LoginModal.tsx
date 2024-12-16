import { useState } from "react";
import styles from "./LoginModal.module.css";
import CommonModal from "../../components/common/Modal";

type Props = {
  onClose: () => void;
  onSubmit: (code: string) => void;
};

const LoginModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [code, setCode] = useState("");

  const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setCode(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onSubmit(code);
  };

  return (
    <CommonModal title="로그인" onClose={onClose}>
      <form className={styles.form}>
        <p className={styles.description}>비밀코드를 입력해주세요.</p>
        <input
          className={styles.textInput}
          type="text"
          placeholder="비밀코드 입력"
          value={code}
          onChange={handleChanged}
          autoFocus
        />
        <button
          type="button"
          className={styles.submitButton}
          onMouseDown={handleSubmit}
        >
          로그인
        </button>
      </form>
    </CommonModal>
  );
};

export default LoginModal;
