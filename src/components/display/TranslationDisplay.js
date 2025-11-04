"use client";
import styles from "./TranslationDisplay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsToEye } from "@fortawesome/free-solid-svg-icons";

export default function TranslationDisplay({ letter }) {
  return (
    <div className={styles.boxTranslation}>
      <div className={styles.boxIntro}>
        {letter ? (
          <div className={styles.showLetter}>{letter}</div>
        ) : (
          <>
            <FontAwesomeIcon icon={faArrowsToEye} size="1x" className={styles.icon} />
            <p>listo para escanear</p>
          </>
        )}
      </div>
    </div>
  );
}
