import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import style from "./header.module.css";
import { Icon } from "../../ui/icon";
import { Logo } from "../../ui/logo";
import { Text } from "../../ui/text";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchNotifications, markAllAsRead, markAsRead } from "../../store/notification/thunks";
import { useTheme } from "../../hooks/useTheme";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector(s => s.notification.unreadCount);
  const notifications = useAppSelector(s => s.notification.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const TYPE_ICONS: Record<string, string> = {
    achievement: "🏆",
    reminder:    "⏰",
    system:      "🔔",
    motivation:  "💪",
  };

  return (
    <header className={style.header__section}>
      <nav className={style.menu}>
        <div className={style.logo}>
          <Logo />
          <div className={style.logo__text}>
            <Text style={"H3"}>Health Tracker</Text>
          </div>
        </div>

        <div className={style.links}>
          <Link to="/" className={style.redirect}>
            <Icon kind={"home"} />
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

        <div className={style.actions}>

          <div className={style.notifWrapper} ref={notifRef}>
            <div className={style.bell} onClick={() => setIsNotifOpen(prev => !prev)}>
              <Icon kind="notification" />
              {unreadCount > 0 && (
                <span className={style.badge}>{unreadCount}</span>
              )}
            </div>

            {isNotifOpen && (
              <div className={style.notifPanel}>
                <div className={style.notifHeader}>
                  <span className={style.notifTitle}>Уведомления</span>
                  {unreadCount > 0 && (
                    <button
                      className={style.markAll}
                      onClick={() => dispatch(markAllAsRead())}
                    >
                      Прочитать все
                    </button>
                  )}
                </div>

                <div className={style.notifList}>
                  {notifications.length === 0 ? (
                    <div className={style.notifEmpty}>
                      Уведомлений пока нет
                    </div>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <div
                        key={n.id}
                        className={`${style.notifItem} ${!n.is_read ? style.notifUnread : ""}`}
                        onClick={() => !n.is_read && dispatch(markAsRead(n.id))}
                      >
                        <span className={style.notifIcon}>
                          {TYPE_ICONS[n.type] ?? "🔔"}
                        </span>
                        <div className={style.notifContent}>
                          <div className={style.notifItemTitle}>{n.title}</div>
                          <div className={style.notifMessage}>{n.message}</div>
                          <div className={style.notifTime}>
                            {new Date(n.sent_at).toLocaleDateString("ru-RU", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        {!n.is_read && <div className={style.notifDot} />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/profile" className={style.profile}>
            <Icon kind="user-circle" />
          </Link>

          <div className={style.theme}>
            <Icon
              kind={theme === "light" ? "moon" : "sun"}
              onClick={toggleTheme}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};
