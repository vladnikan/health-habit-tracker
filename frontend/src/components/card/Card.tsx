import { Icon } from "../../ui/icon";
import { Text } from "../../ui/text";
import style from "./card.module.css";

export type CardProps = {
  id: number;
  title: string;
  count: number;
  total: number;
  done: boolean;
  kind: "done" | "pulse" | "arrow-top" | "fire";
  endDate?: string | null;
};

const GRADIENTS = [
  "linear-gradient(135deg, #257a74, #4daa6e)",
  "linear-gradient(135deg, #2a9d8f, #7dc97a)",
  "linear-gradient(135deg, #1a6b65, #3d9e6a)",
  "linear-gradient(135deg, #2a9d8f, #4daa6e)",
  "linear-gradient(135deg, #257a74, #2a9d8f)",
  "linear-gradient(135deg, #3aafa9, #7dc97a)",
  "linear-gradient(135deg, #1d7a6e, #56b870)",
  "linear-gradient(135deg, #2e8b84, #6ac47a)",
];

function getGradient(id: number) {
  return GRADIENTS[Math.abs(id) % GRADIENTS.length];
}

export const Card = ({ id, title, count, total, done, kind }: CardProps) => {
  const percent =
    total === 0 ? 100 : Math.min(100, Math.round((count / total) * 100));

  return (
    <div className={style.card} style={{ background: getGradient(id) }}>
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
