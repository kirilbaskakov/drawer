import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import HeroVideo from "@/assets/hero-video.webm";
import generateId from "@/utils/generateId";

import styles from "./Hero.module.css";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/" + generateId());
  };

  return (
    <div className={styles.hero}>
      <div className={styles.heroText}>
        <h1 className={styles.heroTitle}>{t("heroTitle")}</h1>
        <button className={styles.heroButton} onClick={onClick}>
          {t("create")}
        </button>
      </div>
      <div className={styles.videoContainer}>
        <video
          className={styles.heroVideo}
          src={HeroVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};

export default Hero;
