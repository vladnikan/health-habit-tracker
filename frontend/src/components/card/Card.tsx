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
};

export const Card = ({ title, count, total, done, kind }: CardProps) => {
  const percent =
    total === 0 ? 0 : Math.min(100, Math.round((count / total) * 100));
  const gradients = [
    "linear-gradient(135deg, #ff9a9e, #fad0c4)",
    "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(135deg, #84fab0, #8fd3f4)",
    "linear-gradient(135deg, #fccb90, #d57eeb)",
  ];
  const bg = useMemo(() => {
    return gradients[Math.floor(Math.random() * gradients.length)];
  }, []);
  return (
    <div className={style.card} style={{ background: bg }}>
      <div className={style.title}>
        <Text style={"H3"}>{title}</Text>
      </div>
      <div className={style.icon}>
        <Icon kind={done ? "done" : kind} />
      </div>
      <div className={style.count}>
        <Text style={"H2"}>
          {count}/{total}
        </Text>
      </div>
      <div className={style.progress__bar}>
        <div style={{ width: `${percent}%` }} />
      </div>
      <div className={style.target}>
        <Text style={"H3"}>{percent}% выполнено</Text>
      </div>
    </div>
  );
};
