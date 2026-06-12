import { Header } from "../header";
import { Footer } from "../footer";
import style from "./layout.module.css";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <Header />
      </div>
      <main className={style.outlet}>
        <Outlet />
      </main>
      <div className={style.footer}>
        <Footer />
      </div>
    </div>
  );
};
