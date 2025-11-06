import styles from "./TitleGenerator.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function TitleGenerator() {
  return (
    <section className={styles.titleGenerator}>
      <h2>traductor de señas con I.A</h2>
      <div className={styles.containerFlex}>
        <p>inicia ahora</p>
        <FontAwesomeIcon
          icon={faChevronDown}
          size="1x"
          className={styles.icon}
        />
      </div>
    </section>
  );
}
