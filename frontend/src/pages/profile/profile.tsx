import { useEffect, useState } from "react";
import { Text } from "../../ui/text";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchGoals, saveGoal } from "../../store/goal/thunks";
import { useNavigate } from "react-router-dom";
import { authThunks } from "../../store/auth/thunks";
import style from "./profile.module.css";

const METRIC_CONFIG: Record<
  string,
  { label: string; unit: string; hint: string; default: number }
> = {
  sleep: {
    label: "Сон",
    unit: "часов",
    hint: "Норма ВОЗ: 7–9 часов",
    default: 8,
  },
  water: {
    label: "Вода",
    unit: "литров",
    hint: "Норма: 30 мл на кг веса",
    default: 2,
  },
  steps: {
    label: "Шаги",
    unit: "шагов",
    hint: "Норма ВОЗ: 7500–10 000",
    default: 8000,
  },
  heart_rate: {
    label: "Пульс",
    unit: "уд/мин",
    hint: "Норма покоя: 60–100 уд/мин",
    default: 70,
  },
  stress: {
    label: "Стресс",
    unit: "/ 100",
    hint: "Комфортный уровень: до 40",
    default: 30,
  },
};

export const Profile = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((s) => s.auth.userData);
  const goalsFromStore = useAppSelector((s) => s.goals.goals);
  const isLoading = useAppSelector((s) => s.goals.isLoading);

  const [localGoals, setLocalGoals] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  useEffect(() => {
    const map: Record<string, number> = {};
    goalsFromStore.forEach((g) => {
      map[g.metric_type] = g.target_value;
    });
    setLocalGoals(map);
  }, [goalsFromStore]);

  const handleChange = (metric: string, value: string) => {
    setLocalGoals((prev) => ({ ...prev, [metric]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    await Promise.all(
      Object.entries(localGoals).map(([metric, target_value]) =>
        dispatch(saveGoal({ metric, target_value })),
      ),
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authThunks.logout());
    navigate("/login");
  };

  return (
    <>
      <main className={style.page}>
        <section className={style.section}>
          <Text style="H2">Профиль</Text>
          {userData && (
            <div className={style.userInfo}>
              <div className={style.avatar}>
                {userData.username?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <Text style="H3">
                  {userData.full_name || userData.username}
                </Text>
                <Text style="H4">{userData.email}</Text>
              </div>
            </div>
          )}
          <Button kind="secondary" text="Выйти из аккаунта" onClick={handleLogout} />
        </section>
        <section className={style.section}>
          <Text style="H2">Мои цели</Text>
          <Text style="H4">
            Задайте личные целевые значения — система будет использовать их для
            расчёта рекомендаций и оценки прогресса
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
                  placeholder={config.default.toString()}
                  value={localGoals[metric] ?? config.default}
                  onChange={(e) => handleChange(metric, e.target.value)}
                />
                <div className={style.hint}>{config.hint}</div>
              </div>
            ))}
          </div>
          <div className={style.saveRow}>
            <Button
              kind="primary"
              text={isLoading ? "Загрузка..." : "Сохранить цели"}
              onClick={handleSave}
              disabled={isLoading}
            />
            {saved && <span className={style.savedMsg}>✅ Цели сохранены</span>}
          </div>
        </section>
      </main>
    </>
  );
};
