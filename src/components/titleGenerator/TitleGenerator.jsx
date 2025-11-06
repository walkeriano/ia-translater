import styles from "./TitleGenerator.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faHexagonNodes } from "@fortawesome/free-solid-svg-icons";

export default function TitleGenerator() {
  return (
    <section className={styles.titleGenerator}>
      <h2>traductor de lenguaje señas</h2>
      <div className={styles.containerFlex}>
        <p>Inteligencia Artificial</p>
        <FontAwesomeIcon
          icon={faHexagonNodes}
          size="1x"
          className={styles.icon}
        />
      </div>
    </section>
  );
}
