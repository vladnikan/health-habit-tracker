// src/pages/habits/Habits.tsx
import { useEffect, useState } from "react";
import style from './habits.module.css'
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Button } from "../../ui/button";
import { CardCheck } from "../../components/cardCheck/CardCheck";
import { AddHabitModal } from "../../components/addHabitModal/AddHabitModal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchHabits, fetchAllChecks } from "../../store/habit/thunks";
import { Text } from "../../ui/text";

export const Habits = () => {
  const dispatch = useAppDispatch();

  const habits = useAppSelector((state) => state.habits.habits);
  const checks = useAppSelector((state) => state.habits.checks || []);
  const isLoading = useAppSelector((state) => state.habits.isLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

          <Button
            kind="primary"
            text="Добавить привычку"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {isLoading ? (
          <Text style="H4">Загрузка привычек...</Text>
        ) : habits.length === 0 ? (
          <div className={style.empty}>
            <Text style="H4">У вас пока нет привычек</Text>
            <Button
              kind="primary"
              text="Создать первую привычку"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        ) : (
          <div className={style.habitList}>
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
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && <AddHabitModal onClose={() => setIsModalOpen(false)} />}

      <Footer />
    </div>
  );
};