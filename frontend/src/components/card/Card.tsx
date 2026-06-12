import { Icon } from "../../ui/icon";
import { Text } from "../../ui/text";
import style from "./card.module.css";
import { useMemo } from "react";

export type CardProps = {
  title: string;
  count: number;
  total: number;
  done: boolean;
  kind: "done" | "pulse" | "arrow-top" | "fire";
  endDate?: string | null;
};

export const Card = ({ title, count, total, done, kind }: CardProps) => {
  const percent =
    total === 0 ? 100 : Math.min(100, Math.round((count / total) * 100));
  const gradients = [
    "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(135deg, #84fab0, #8fd3f4)",
    "linear-gradient(135deg, #fccb90, #d57eeb)",

    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #89f7fe, #66a6ff)",
    "linear-gradient(135deg, #fddb92, #d1fdff)",
    "linear-gradient(135deg, #ffecd2, #fcb69f)",
    "linear-gradient(135deg, #ff8177, #ff867a)",
    "linear-gradient(135deg, #c471f5, #fa71cd)",
    "linear-gradient(135deg, #43e97b, #38f9d7)",
    "linear-gradient(135deg, #30cfd0, #330867)",
    "linear-gradient(135deg, #5ee7df, #b490ca)",
    "linear-gradient(135deg, #d299c2, #fef9d7)",

    "linear-gradient(135deg, #f6d365, #fda085)",
    "linear-gradient(135deg, #96fbc4, #f9f586)",
    "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
    "linear-gradient(135deg, #fa709a, #fee140)",
    "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    "linear-gradient(135deg, #9795f0, #fbc8d4)",
    "linear-gradient(135deg, #ff758c, #ff7eb3)",
    "linear-gradient(135deg, #74ebd5, #acb6e5)",

    "linear-gradient(135deg, #ff9966, #ff5e62)",
    "linear-gradient(135deg, #56ab2f, #a8e063)",
    "linear-gradient(135deg, #614385, #516395)",
    "linear-gradient(135deg, #e65c00, #f9d423)",
    "linear-gradient(135deg, #2193b0, #6dd5ed)",
    "linear-gradient(135deg, #cc2b5e, #753a88)",
    "linear-gradient(135deg, #ee9ca7, #ffdde1)",
    "linear-gradient(135deg, #42275a, #734b6d)",
    "linear-gradient(135deg, #bdc3c7, #2c3e50)",
    "linear-gradient(135deg, #de6262, #ffb88c)",
  ];
  const bg = useMemo(() => {
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []);
  return (
    <div className={style.card} style={{ background: bg }}>
      <div className={style.title__section}>
        <div className={style.title}>
          <Text style={"H3"}>{title}</Text>
        </div>
        <div className={style.icon}>
          <Icon kind={done ? "done" : kind} />
        </div>
      </div>
      <div className={style.content}>
        <div className={style.count}>
          <Text style={"H2"}>
            {total ? `${count}/${total} дней` : "Сегодня выполнено!"}
          </Text>
        </div>
        <div className={style.progress__bar}>
          <div style={{ width: `${percent}%` }} />
        </div>
        <div className={style.target}>
          <Text style={"H3"}>{percent}% выполнено</Text>
        </div>
      </div>
    </div>
  );
};
