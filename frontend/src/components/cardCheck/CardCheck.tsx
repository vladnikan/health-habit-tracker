import { useState, useEffect } from "react";
import { Icon } from "../../ui/icon";
import { Text } from "../../ui/text";
import style from "./cardCheck.module.css";
import { useAppDispatch } from "../../hooks/hooks";
import { createHabitCheck, deleteHabit, fetchAllChecks } from "../../store/habit/thunks";

export type CardCheckProps = {
  id: number;
  title: string;
  kind: string;
  doneToday: boolean;
  currentStreak: number;
  targetValue?: number;
  unit?: string;
  onEdit: () => void;
};

export const CardCheck: React.FC<CardCheckProps> = ({
  id,
  title,
  kind,
  doneToday,
  currentStreak = 0,
  targetValue = 0,
  unit = "",
  onEdit,
}) => {
  const dispatch = useAppDispatch();

  const [isDoneToday, setIsDoneToday] = useState(doneToday);
  const [localStreak, setLocalStreak] = useState(currentStreak);

  useEffect(() => {
    setIsDoneToday(doneToday);
    setLocalStreak(currentStreak);
  }, [doneToday, currentStreak]);

  const handleHabitDone = async () => {
    if (isDoneToday) return;

    const result = await dispatch(createHabitCheck({ habit_id: id }));

    if (createHabitCheck.fulfilled.match(result)) {
      setIsDoneToday(true);
      setLocalStreak(prev => prev + 1);
      dispatch(fetchAllChecks());
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить привычку "${title}"?`)) {
      dispatch(deleteHabit(id));
    }
  };

  const percent = targetValue > 0 ? (isDoneToday ? 100 : 0) : 0;

  return (
    <div className={style.card}>
      <div className={style.status}>
        <Icon
          kind={isDoneToday ? "done" : "inProgress"}
          onClick={handleHabitDone}
        />
      </div>

      <div className={style.trash}>
        <Icon kind="trashcan" onClick={handleDelete} />
      </div>

      <div className={style.edit}>
        <Icon kind="pencil" onClick={onEdit} />
      </div>

      <div className={style.title}>
        <Text style="H2">{title}</Text>
      </div>

      <div className={style.kind}>
        <Text style="H4">{kind}</Text>
      </div>

      <div className={style.series}>
        <Icon kind="fire" />
        <Text style="H4">{localStreak} дней подряд</Text>
      </div>

      {targetValue > 0 ? (
        <div className={style.target}>
          <Text style="H4">Цель: {targetValue} {unit || "в день"}</Text>
          <div className={style.progress}>
            <div className={style.progressFill} style={{ width: `${percent}%` }} />
          </div>
          <Text style="H4">
            {isDoneToday ? "100% — выполнено сегодня" : "0% — не выполнено"}
          </Text>
        </div>
      ) : (
        <div className={style.target}>
          <Text style="H4">Бессрочно</Text>
        </div>
      )}

      {isDoneToday && (
        <div className={style.todayDone}>
          <Text style="H4">✓ Сегодня выполнено</Text>
        </div>
      )}
    </div>
  );
};
