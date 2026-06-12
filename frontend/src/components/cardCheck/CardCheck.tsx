import { useState, useEffect, useMemo } from "react";
import { Icon } from "../../ui/icon";
import { Text } from "../../ui/text";
import style from "./cardCheck.module.css";
import { useAppDispatch } from "../../hooks/hooks";
import {
  createHabitCheck,
  deleteHabit,
  fetchAllChecks,
} from "../../store/habit/thunks";

export type CardCheckProps = {
  id: number;
  title: string;
  kind: string;
  doneToday: boolean;
  currentStreak: number;
  targetValue?: number;
  unit?: string;
  onEdit: () => void;
  createdAt: string;
  endDate?: string | null;
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
  createdAt,
  endDate,
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
      setLocalStreak((prev) => prev + 1);
      dispatch(fetchAllChecks());
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить привычку "${title}"?`)) {
      dispatch(deleteHabit(id));
    }
  };

  const percent = targetValue > 0 ? (isDoneToday ? 100 : 0) : 0;

  const totalDays = useMemo(() => {
    const start = new Date(createdAt);
    const end = endDate ? new Date(endDate) : new Date();
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(diff, 1);
  }, [createdAt, endDate]);

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

      <div className={style.target}>
        <Text style="H4">
          {endDate
            ? `До ${new Date(endDate).toLocaleDateString("ru-RU")}`
            : "Бессрочно"}
          {targetValue > 0 && unit && ` · Цель: ${targetValue} ${unit}`}
        </Text>
        <div className={style.progress}>
          <div
            className={style.progressFill}
            style={{
              width: `${Math.min(100, Math.round((localStreak / totalDays) * 100))}%`,
            }}
          />
        </div>
        <Text style="H4">
          {localStreak} / {totalDays} дней
        </Text>
      </div>

      {isDoneToday && (
        <div className={style.todayDone}>
          <Text style="H4">✓ Сегодня выполнено</Text>
        </div>
      )}
    </div>
  );
};
