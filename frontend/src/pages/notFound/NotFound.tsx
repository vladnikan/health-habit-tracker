import { Link } from "react-router-dom";
import { Text } from "../../ui/text";
import styles from "./notFound.module.css";

export const NotFound = () => {
  return (
    <main>
      <div className={styles.main}>
        <div className={styles.numeral}>
          <Text style={"H1"}>404</Text>
        </div>
        <div className={styles.text}>
          <Text style={"H2"}>Страница не найдена</Text>
        </div>
        <div className={styles.link}>
          <Link to={"/"}>Вернуться на главную страницу</Link>
        </div>
      </div>
    </main>
  );
};
