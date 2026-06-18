import { useEffect } from "react";
import { Text } from "../../ui/text";
import { Card } from "../../components/card";
import { Graph } from "../../components/graph";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchHabits } from "../../store/habit/thunks";
import { fetchMetrics } from "../../store/metric/thunks";
import style from "./Dashboard.module.css";

export const Dashboard = () => {
  const dispatch = useAppDispatch();

  const habits = useAppSelector((state) => state.habits.habits);
  const metrics = useAppSelector((state) => state.metrics.metrics);

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchMetrics());
  }, [dispatch]);
  
  const cards = habits.map((habit) => ({
    id: habit.id,
    title: habit.name,
    count: habit.current_streak || 0,
    total: (() => {
      const start = new Date(habit.created_at);
      const end = habit.end_date ? new Date(habit.end_date) : new Date();
      return Math.max(
        1,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
      );
    })(),
    done: false,
    kind: "fire" as const,
  }));

  const recentMetrics = [...metrics]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)
    .reverse();

  const progressData = recentMetrics.map((m) => ({
    name: new Date(m.date).toLocaleDateString("ru-RU", { weekday: "short" }),
    water: m.water || 0,
    steps: m.steps || 0,
  }));

  const sleepData = recentMetrics.map((m) => ({
    name: new Date(m.date).toLocaleDateString("ru-RU", { weekday: "short" }),
    sleep: m.sleep || 0,
  }));

  return (
    <div className={style.page}>
      <main className={style.main}>
        <div className={style.greet}>
          <Text style="H2">Добро пожаловать!</Text>
          <Text style="H4">
            Сегодня:{" "}
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </div>
        <div className={style.grid}>
          {cards.length > 0 ? (
            cards.map((card) => <Card key={card.id} {...card} />)
          ) : (
            <Text style="H4">У вас пока нет привычек. Добавьте первую!</Text>
          )}
        </div>
        <div className={style.graphic__name}>
        <Text style="H2">Графики метрик за неделю</Text>
        </div>
        {recentMetrics.length > 0 && (
          <div className={style.charts}>
            <div>
              <Text style="H3">Шаги</Text>
              <Graph type="line" data={progressData} xKey="name" yKey="steps" />
            </div>

            <div>
              <Text style="H3">Вода за неделю</Text>
              <Graph type="bar" data={progressData} xKey="name" yKey="water" />
            </div>

            <div>
              <Text style="H3">Сон</Text>
              <Graph type="area" data={sleepData} xKey="name" yKey="sleep" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
