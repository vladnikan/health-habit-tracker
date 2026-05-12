import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import style from "./header.module.css";
import { Icon } from "../../ui/icon";
import { Logo } from "../../ui/logo";
import { Text } from "../../ui/text";

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const userData = useAppSelector((store) => store.auth.userData);
  const location = useLocation();
  const navigate = useNavigate();

  const handleToogleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };


  return (
    <header className={style.header__section}>
      <nav className={style.menu}>
        <div className={style.logo}>
          <Logo></Logo>
          <div className={style.logo__text}>
            <Text style={"H3"}>Health Tracker</Text>
          </div>
        </div>
        <div className={style.links}>
          <Link to="/" className={style.redirect}>
            <Icon kind={"home"}/>
            <Text style={"H4"}>Панель</Text>
          </Link>
          <Link to="/habits" className={style.redirect}>
            <Icon kind={"pulse"} />
            <Text style={"H4"}>Привычки</Text>
          </Link>
          <Link to="/health" className={style.redirect}>
            <Icon kind={"heart"} />
            <Text style={"H4"}>Здоровье</Text>
          </Link>
          <Link to="/analysis" className={style.redirect}>
            <Icon kind={"arrow-top"} />
            <Text style={"H4"}>Аналитика</Text>
          </Link>
        </div>
        <div className={style.theme}>
          <Icon
            kind={theme === "light" ? "moon" : "sun"}
            onClick={handleToogleTheme}
          />
        </div>
      </nav>
    </header>
  );
};
