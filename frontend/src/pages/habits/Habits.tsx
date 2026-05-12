import { useEffect, useState } from "react";
import style from "./habits.module.css";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Button } from "../../ui/button";
import { CardCheck } from "../../components/cardCheck/CardCheck";
import { AddHabitModal } from "../../components/addHabitModal/AddHabitModal";
import { EditHabitModal } from "../../components/editHabitModal/EditHabitModal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchHabits, fetchAllChecks } from "../../store/habit/thunks";
import { Text } from "../../ui/text";
import { useModal } from "../../hooks/useModal";
import type { THabitData } from "../../store/habit/types";
import { useNotifications } from "../../hooks/useNotifications";

export const Habits = () => {
  const dispatch = useAppDispatch();

  const habits = useAppSelector((state) => state.habits.habits);
  const checks = useAppSelector((state) => state.habits.checks || []);
  const isLoading = useAppSelector((state) => state.habits.isLoading);

  useNotifications(habits);

  const { isModalOpen, openModal, closeModal } = useModal();
  const [editingHabit, setEditingHabit] = useState<THabitData | null>(null);

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchAllChecks());
  }, [dispatch]);

  const isHabitDoneToday = (habitId: number): boolean => {
    const today = new Date().toISOString().split("T")[0];
    return checks.some(
      (check) => check.habit_id === habitId && check.date === today
    );
  };

  return (
    <div className={style.page}>
      <Header />

      <main className={style.main}>
        <div className={style.header}>
          <div>
            <Text style="H2">Мои привычки</Text>
            <Text style="H4">
              Отслеживайте свой прогресс и создавайте новые привычки
            </Text>
          </div>

          <Button kind="primary" text="Добавить привычку" onClick={openModal} />
        </div>

        <div className={style.habit__container}>
          {isLoading ? (
            <Text style="H4">Загрузка привычек...</Text>
          ) : habits.length === 0 ? (
            <div className={style.empty}>
              <Text style="H4">У вас пока нет привычек</Text>
              <Button kind="primary" text="Создать первую привычку" onClick={openModal} />
            </div>
          ) : (
            <div className={style.habit__list}>
              {habits.map((habit) => (
                <CardCheck
                  key={habit.id}
                  id={habit.id}
                  title={habit.name}
                  kind={habit.description || "Привычка"}
                  doneToday={isHabitDoneToday(habit.id)}
                  currentStreak={habit.current_streak || 0}
                  targetValue={habit.target_value || 0}
                  unit={habit.unit || ""}
                  onEdit={() => setEditingHabit(habit)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && <AddHabitModal onClose={closeModal} />}

      {editingHabit && (
        <EditHabitModal
          habit={{
            id: editingHabit.id,
            name: editingHabit.name,
            description: editingHabit.description ?? undefined,
            frequency: editingHabit.frequency,
            target_value: editingHabit.target_value,
            unit: editingHabit.unit,
            reminder_time: editingHabit.reminder_time ?? undefined,
          }}
          onClose={() => setEditingHabit(null)}
        />
      )}

      <Footer />
    </div>
  );
};