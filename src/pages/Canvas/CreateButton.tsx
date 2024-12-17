import React, { useRef, useState } from "react";
import styles from "./CreateButton.module.css";
import modalStyles from "./CreateButtonModal.module.css";
import stickersModalStyles from "./StickersModal.module.css";
import { ImageInfo, StickerInfo } from "../../models/object";
import CommonModal from "../../components/common/Modal";
import stickersData from "../../stickers.json";

type Props = {
  addImage: (image: ImageInfo) => void;
  addText: () => void;
  addSticker: (sticker: StickerInfo) => void;
};

const stickers = stickersData as StickerInfo[];

const stickerCategories = [
  {
    title: "파티",
    value: "party",
  },
  {
    title: "생일",
    value: "birthday",
  },
  {
    title: "배경 없음",
    value: "lined",
  },
  {
    title: "메모지",
    value: "paper",
  },
  {
    title: "테이프",
    value: "masking-tape",
  },
  {
    title: "꽃",
    value: "flower",
  },
];

const CreateButton: React.FC<Props> = ({ addImage, addText, addSticker }) => {
  const [onClicked, setOnClicked] = useState<boolean>(false);
  const [isStickersModalOpened, setIsStickersModalOpened] =
    useState<boolean>(false);
  const [stickerCategory, setStickerCategory] = useState<
    "party" | "birthday" | "lined" | "paper" | "masking-tape" | "flower" | null
  >(null);

  const handleClick = () => {
    setOnClicked(!onClicked);
  };

  const handleClose = () => {
    setOnClicked(false);
  };

  const handleStickerClick = () => {
    handleClose();
    setIsStickersModalOpened(true);
  };

  const handleStickerModalClose = () => {
    setIsStickersModalOpened(false);
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

  const handleStickerSelected = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value;
    const sticker = stickers
      .filter((sticker) => sticker.category === value.split("/")[0])
      .find((sticker) => sticker.category + "/" + sticker.src === value);

    if (!sticker) {
      return;
    }

    addSticker(sticker);
    setIsStickersModalOpened(false);
  };

  const handleStickerCategorySelected = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    const category = e.currentTarget.value as
      | "party"
      | "birthday"
      | "lined"
      | "paper"
      | "masking-tape"
      | "flower";
    setStickerCategory(category);
  };

  return (
    <>
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
          className={
            onClicked ? styles.containerActive : styles.containerDefault
          }
          onClick={handleClick}
        >
          <img
            className={styles.image}
            src={onClicked ? "icons/close.webp" : "icons/add.webp"}
            alt={onClicked ? "close" : "add"}
          />
        </button>
      </div>
      {isStickersModalOpened && (
        <CommonModal title="스티커 선택" onClose={handleStickerModalClose}>
          <div className={stickersModalStyles.tabBar}>
            {stickerCategories.map((category) => {
              return (
                <button
                  key={category.value}
                  className={stickersModalStyles.tabItem}
                  style={
                    stickerCategory === category.value
                      ? {
                          backgroundColor: "var(--black)",
                          color: "var(--white)",
                        }
                      : {}
                  }
                  value={category.value}
                  onClick={handleStickerCategorySelected}
                >
                  {category.title}
                </button>
              );
            })}
          </div>
          <div className={stickersModalStyles.grid}>
            {stickers
              .filter(
                (sticker) =>
                  stickerCategory === null ||
                  sticker.category === stickerCategory
              )
              .map((sticker) => {
                return (
                  <button
                    key={`${sticker.category}/${sticker.src}`}
                    className={stickersModalStyles.item}
                    onClick={handleStickerSelected}
                    value={`${sticker.category}/${sticker.src}`}
                  >
                    <img
                      className={stickersModalStyles.image}
                      src={`stickers/${sticker.category}/${sticker.src}.png`}
                      alt={sticker.title}
                    />
                  </button>
                );
              })}
          </div>
        </CommonModal>
      )}
    </>
  );
};

export default CreateButton;
