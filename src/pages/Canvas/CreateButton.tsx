import React, { useRef } from "react";
import styles from "./CreateButton.module.css";
import modalStyles from "./CreateButtonModal.module.css";
import { ImageInfo } from "../../models/object";

type Props = {
  addImage: (image: ImageInfo) => void;
  addText: () => void;
};

const CreateButton: React.FC<Props> = ({ addImage, addText }) => {
  const [onClicked, setOnClicked] = React.useState(false);
  const handleClick = () => {
    setOnClicked(!onClicked);
  };

  const handleClose = () => {
    setOnClicked(false);
  };

  const handleStickerClick = () => {
    console.log("Sticker clicked");
    handleClose();
  };

  const handleTextClick = () => {
    addText();
    handleClose();
  };

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;

        image.onload = () => {
          const newImage: ImageInfo = {
            type: "image",
            src: URL.createObjectURL(file),
            width: image.naturalWidth,
            height: image.naturalHeight,
          };

          addImage(newImage);
        };
      };
      reader.readAsDataURL(file);
    }

    event.target.value = "";
    handleClose();
  };

  return (
    <div className={styles.layout}>
      {onClicked && (
        <>
          <input
            id="image-input"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleAddImage}
          />
          <button
            className={modalStyles.container}
            onClick={handleStickerClick}
          >
            <img
              className={modalStyles.icon}
              src={"icons/sticker.webp"}
              alt="sticker"
            />
            <p className={modalStyles.label}>스티커 붙이기</p>
          </button>
          <label className={modalStyles.container} htmlFor="image-input">
            <img
              className={modalStyles.icon}
              src={"icons/image.webp"}
              alt="image"
            />
            <p className={modalStyles.label}>사진 올리기</p>
          </label>
          <button className={modalStyles.container} onClick={handleTextClick}>
            <img
              className={modalStyles.icon}
              src={"icons/text.webp"}
              alt="text"
            />
            <p className={modalStyles.label}>글 쓰기</p>
          </button>
        </>
      )}
      <button
        className={onClicked ? styles.containerActive : styles.containerDefault}
        onClick={handleClick}
      >
        <img
          className={styles.image}
          src={onClicked ? "icons/close.webp" : "icons/add.webp"}
          alt={onClicked ? "close" : "add"}
        />
      </button>
    </div>
  );
};

export default CreateButton;
