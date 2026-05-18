// src/pages/profile/Profile.tsx
import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Text } from "../../ui/text";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useAppSelector } from "../../hooks/hooks";
import style from "./profile.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

type Goal = {
  id: number;
  metric: string;
  target_value: number;
};

const METRIC_CONFIG: Record<string, { label: string; unit: string; placeholder: string; default: number }> = {
  sleep:      { label: "Сон",    unit: "часов",  placeholder: "8",     default: 8 },
  water:      { label: "Вода",   unit: "литров", placeholder: "2",     default: 2 },
  steps:      { label: "Шаги",   unit: "шагов",  placeholder: "8000",  default: 8000 },
  heart_rate: { label: "Пульс",  unit: "уд/мин", placeholder: "70",    default: 70 },
  stress:     { label: "Стресс", unit: "/ 100",  placeholder: "30",    default: 30 },
};

export const Profile = () => {
  const token = useAppSelector(s => s.auth.token) || localStorage.getItem("token");
  const userData = useAppSelector(s => s.auth.userData);

  const [goals, setGoals] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Загружаем текущие цели
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: Goal[] = await res.json();

      const map: Record<string, number> = {};
      data.forEach(g => { map[g.metric] = g.target_value; });
      setGoals(map);
    };
    load();
  }, [token]);

  const handleChange = (metric: string, value: string) => {
    setGoals(prev => ({ ...prev, [metric]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    // Сохраняем все цели параллельно
    await Promise.all(
      Object.entries(goals).map(([metric, target_value]) =>
        fetch(`${API_URL}/goals`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ metric, target_value }),
        })
      )
    );

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <Header />
      <main className={style.page}>

        {/* Информация о пользователе */}
        <section className={style.section}>
          <Text style="H2">Профиль</Text>
          {userData && (
            <div className={style.userInfo}>
              <div className={style.avatar}>
                {userData.username?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <Text style="H3">{userData.full_name || userData.username}</Text>
                <Text style="H4">{userData.email}</Text>
              </div>
            </div>
          )}
        </section>

        {/* Персональные цели */}
        <section className={style.section}>
          <Text style="H2">Мои цели</Text>
          <Text style="H4">
            Задайте личные целевые значения — система будет использовать их
            для расчёта рекомендаций и оценки прогресса
          </Text>

          <div className={style.goalsGrid}>
            {Object.entries(METRIC_CONFIG).map(([metric, config]) => (
              <div key={metric} className={style.goalCard}>
                <div className={style.goalLabel}>
                  <Text style="H4">{config.label}</Text>
                  <span className={style.unit}>{config.unit}</span>
                </div>
                <Input
                  type="number"
                  placeholder={config.placeholder}
                  value={goals[metric] ?? config.default}
                  onChange={e => handleChange(metric, e.target.value)}
                />
                {/* Подсказка — норма ВОЗ */}
                <div className={style.hint}>
                  {metric === "sleep"      && "Норма ВОЗ: 7–9 часов"}
                  {metric === "water"      && "Норма: 30 мл на кг веса"}
                  {metric === "steps"      && "Норма ВОЗ: 7500–10 000"}
                  {metric === "heart_rate" && "Норма покоя: 60–100 уд/мин"}
                  {metric === "stress"     && "Комфортный уровень: до 40"}
                </div>
              </div>
            ))}
          </div>

          <div className={style.saveRow}>
            <Button
              kind="primary"
              text={loading ? "Сохраняем..." : "Сохранить цели"}
              onClick={handleSave}
              disabled={loading}
            />
            {saved && <span className={style.savedMsg}>✅ Цели сохранены</span>}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
};