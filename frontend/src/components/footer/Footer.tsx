import React from "react";
import style from "./footer.module.css";
import { Logo } from "../../ui/logo";
import { Text } from "../../ui/text";

export const Footer: React.FC = () => {
  return (
    <footer className={style.footer__section}>
      <div className={style.left__side}>
        <div className={style.logo}>
          <Logo></Logo>
        </div>
        <div className={style.info}>
          <Text style={"H3"}>Заводи привычки вместе с HabitTracker!</Text>
          <Text style={"H4"}>© HabitTracker 2026, Все права защищены</Text>
        </div>
      </div>
    </footer>
  );
};
