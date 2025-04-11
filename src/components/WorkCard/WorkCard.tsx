import { MouseEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdOpen } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import useClickOutside from "@/hooks/useClickOutside";

import styles from "./WorkCard.module.css";

const WorkCard = ({
  id,
  name,
  image,
  date,
  onDelete,
}: {
  id: string;
  name: string;
  image: string;
  date: string;
  onDelete: () => void;
}) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useClickOutside<HTMLDivElement>(() => setIsMenuOpen(false));
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/" + id);
  };

  const openInNewTab: MouseEventHandler = (e) => {
    e.stopPropagation();
    window.open(window.location.origin + "/" + id, "_blank");
  };

  const deleteCanvas: MouseEventHandler = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const onMenuClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    setIsMenuOpen((isMenuOpen) => !isMenuOpen);
  };

  return (
    <div className={styles.workCard} onClick={onClick}>
      <img src={image} style={{ width: "100%", height: "200px" }} />
      <div className={styles.workCardInfo}>
        <div>
          <p className={styles.workCardTitle}>{name}</p>
          <p className={styles.workCardDate}>{date}</p>
        </div>
        <div ref={menuRef}>
          <div className={styles.cebabMenu} onClick={onMenuClick}>
            <div className={styles.cebabMenuPoint} />
            <div className={styles.cebabMenuPoint} />
            <div className={styles.cebabMenuPoint} />
          </div>
          {isMenuOpen && (
            <div className={styles.cardMenu}>
              <button onClick={openInNewTab} className={styles.cardMenuOption}>
                <IoMdOpen />
                {t("openInNewTab")}
              </button>
              <button onClick={deleteCanvas} className={styles.cardMenuOption}>
                <MdDeleteOutline />
                {t("delete")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
