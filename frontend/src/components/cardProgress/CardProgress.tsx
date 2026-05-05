import style from "./cardProgress.module.css";
import { Text } from "../../ui/text";

type CardProgressProps = {
  total: number;
  completed: number;
};

export const CardProgress = ({ total, completed }: CardProgressProps) => {
  const percent =
    total > 0
      ? Math.min(100, Math.round((completed / total) * 100))
      : 0;

  return (
    <div className={style.card}>
      <div className={style.title}>
        <Text style="H3">Прогресс сегодня</Text>
      </div>
      <div className={style.total}>
        <Text style="H2">
          {completed}/{total}
        </Text>
        <Text style="H4">Привычек выполнено</Text>
        <Text style="H2">{percent}%</Text>
        <div className={style.progress}>
          <div
            className={style.progressFill}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
