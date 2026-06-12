import React, { useEffect, useState } from "react";
import { Text } from "../../ui/text";
import { useAppSelector } from "../../hooks/hooks";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { API_URL } from "../../utils/api";
import style from "./analysis.module.css";

// ─── Типы ────────────────────────────────────────────────────────────────────

type Recommendation = {
  type: "danger" | "warning" | "info" | "success";
  metric: string;
  text: string;
};

type AnalysisData = {
  period_days: number;
  metrics_recorded: number;
  averages: Record<string, number | null>;
  trends: Record<string, string>;
  correlations: Record<string, number | null>;
  best_day: [string, number] | null;
  worst_day: [string, number] | null;
  habit_completion: Array<{
    name: string;
    completed_days: number;
    completion_rate: number;
    current_streak: number;
  }>;
  recommendations: Recommendation[];
};

// ─── Утилиты ─────────────────────────────────────────────────────────────────

const REC_COLORS: Record<string, string> = {
  danger: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",
  success: "#27ae60",
};

const REC_ICONS: Record<string, string> = {
  danger: "⚠️",
  warning: "💛",
  info: "💡",
  success: "✅",
};

const METRIC_LABELS: Record<string, string> = {
  sleep: "Сон",
  water: "Вода",
  steps: "Шаги",
  heart_rate: "Пульс",
  stress: "Стресс",
};

const TREND_ICONS: Record<string, string> = {
  растёт: "↑",
  снижается: "↓",
  стабильно: "→",
  "недостаточно данных": "—",
};

// Нормы для радар-чарта (0-100)
function normalizeForRadar(averages: Record<string, number | null>) {
  return [
    {
      metric: "Сон",
      value: averages.sleep ? Math.min((averages.sleep / 9) * 100, 100) : 0,
    },
    {
      metric: "Вода",
      value: averages.water ? Math.min((averages.water / 2.5) * 100, 100) : 0,
    },
    {
      metric: "Шаги",
      value: averages.steps ? Math.min((averages.steps / 10000) * 100, 100) : 0,
    },
    {
      metric: "Пульс",
      value: averages.heart_rate
        ? Math.min(100 - Math.abs(averages.heart_rate - 65) * 2, 100)
        : 0,
    },
    {
      metric: "Покой",
      value: averages.stress ? Math.max(100 - averages.stress, 0) : 0,
    },
  ];
}

// ─── Компонент AI-анализа ─────────────────────────────────────────────────────

function AiInsight({ data }: { data: AnalysisData }) {
  const token =
    useAppSelector((s) => s.auth.token) || localStorage.getItem("token");
  const [aiText, setAiText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    setLoading(true);
    setAiText("");

    try {
      const response = await fetch(`${API_URL}/analysis/ai-insight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setAiText(result.insight || "Не удалось получить ответ");
    } catch {
      setAiText("Ошибка при обращении к AI. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.aiBlock}>
      <div className={style.aiHeader}>
        <Text style="H3">🤖 AI-анализ ваших данных</Text>
        <button className={style.aiButton} onClick={ask} disabled={loading}>
          {loading ? "Анализирую..." : "Получить персональный совет"}
        </button>
      </div>

      {loading && (
        <div className={style.aiLoading}>
          <div className={style.spinner} />
          <Text style="H4">Groq анализирует ваши показатели...</Text>
        </div>
      )}

      {aiText && !loading && (
        <div className={style.aiResult}>
          {aiText
            .split("\n")
            .filter(Boolean)
            .map((line, i) => (
              <p key={i}>{line}</p>
            ))}
        </div>
      )}
    </div>
  );
}

export const Analysis: React.FC = () => {
  const token =
    useAppSelector((s) => s.auth.token) || localStorage.getItem("token");
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/analysis`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Ошибка загрузки анализа");
        setData(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading)
    return (
      <>
        <main className={style.page}>
          <Text style="H4">Загружаем анализ...</Text>
        </main>
      </>
    );
  if (error)
    return (
      <>
        <main className={style.page}>
          <Text style="H4">Ошибка: {error}</Text>
        </main>
      </>
    );
  if (!data) return null;

  const radarData = normalizeForRadar(data.averages);

  // Данные для графика корреляций
  const corrData = [
    {
      name: "Сон ↔ Стресс",
      value: data.correlations.sleep_stress ?? 0,
      fill: (data.correlations.sleep_stress ?? 0) < 0 ? "#e74c3c" : "#27ae60",
    },
    {
      name: "Шаги ↔ Пульс",
      value: data.correlations.steps_heart_rate ?? 0,
      fill:
        (data.correlations.steps_heart_rate ?? 0) > 0 ? "#3498db" : "#e74c3c",
    },
  ];

  return (
    <>
      <main className={style.page}>
        {/* Заголовок */}
        <div className={style.hero}>
          <Text style="H2">Глубокий анализ</Text>
          <Text style="H4">
            Данные за последние {data.period_days} дней · Записей:{" "}
            {data.metrics_recorded}
          </Text>
        </div>

        {/* Средние показатели */}
        <section className={style.section}>
          <Text style="H3">Средние показатели</Text>
          <div className={style.statsGrid}>
            {Object.entries(data.averages).map(([key, val]) => (
              <div key={key} className={style.statCard}>
                <div className={style.statLabel}>
                  {METRIC_LABELS[key] ?? key}
                </div>
                <div className={style.statValue}>
                  {val !== null ? val : "—"}
                </div>
                <div className={style.statTrend}>
                  {data.trends[key]
                    ? `${TREND_ICONS[data.trends[key]] ?? ""} ${data.trends[key]}`
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Радар + лучший/худший день */}
        <section className={style.section}>
          <div className={style.twoCol}>
            <div>
              <Text style="H3">Профиль здоровья</Text>
              <Text style="H4">% от рекомендуемой нормы</Text>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <Radar
                    name="Показатели"
                    dataKey="value"
                    stroke="#6c63ff"
                    fill="#6c63ff"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className={style.daysBlock}>
              <Text style="H3">Лучший/худший день</Text>
              {data.best_day && (
                <div className={`${style.dayCard} ${style.best}`}>
                  <div className={style.dayEmoji}>🏆</div>
                  <div>
                    <div className={style.dayTitle}>Лучший день</div>
                    <div className={style.dayDate}>{data.best_day[0]}</div>
                    <div className={style.dayScore}>
                      Score: {data.best_day[1]}/100
                    </div>
                  </div>
                </div>
              )}
              {data.worst_day && (
                <div className={`${style.dayCard} ${style.worst}`}>
                  <div className={style.dayEmoji}>📉</div>
                  <div>
                    <div className={style.dayTitle}>Сложный день</div>
                    <div className={style.dayDate}>{data.worst_day[0]}</div>
                    <div className={style.dayScore}>
                      Score: {data.worst_day[1]}/100
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Корреляции */}
        <section className={style.section}>
          <Text style="H3">Корреляции между метриками</Text>
          <Text style="H4">От −1 (обратная) до +1 (прямая связь)</Text>
          <div className={style.corrGrid}>
            {corrData.map((c) => (
              <div key={c.name} className={style.corrCard}>
                <div className={style.corrName}>{c.name}</div>
                <div className={style.corrBar}>
                  <div
                    className={style.corrFill}
                    style={{
                      width: `${Math.abs(c.value) * 100}%`,
                      backgroundColor: c.fill,
                      marginLeft: c.value < 0 ? "auto" : 0,
                    }}
                  />
                </div>
                <div className={style.corrValue}>{c.value.toFixed(2)}</div>
                <div className={style.corrHint}>
                  {Math.abs(c.value) > 0.5
                    ? "Сильная связь"
                    : Math.abs(c.value) > 0.3
                      ? "Умеренная связь"
                      : "Слабая связь"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Привычки */}
        {data.habit_completion.length > 0 && (
          <section className={style.section}>
            <Text style="H3">Выполнение привычек за 30 дней</Text>
            <div className={style.habitList}>
              {data.habit_completion.map((h) => (
                <div key={h.name} className={style.habitRow}>
                  <div className={style.habitName}>{h.name}</div>
                  <div className={style.habitBar}>
                    <div
                      className={style.habitFill}
                      style={{
                        width: `${h.completion_rate}%`,
                        backgroundColor:
                          h.completion_rate >= 80
                            ? "#27ae60"
                            : h.completion_rate >= 50
                              ? "#f39c12"
                              : "#e74c3c",
                      }}
                    />
                  </div>
                  <div className={style.habitMeta}>
                    {h.completion_rate}% · streak {h.current_streak} дн
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Рекомендации */}
        <section className={style.section}>
          <Text style="H3">Рекомендации системы</Text>
          <div className={style.recList}>
            {data.recommendations.map((r, i) => (
              <div
                key={i}
                className={style.recCard}
                style={{ borderLeftColor: REC_COLORS[r.type] }}
              >
                <span className={style.recIcon}>{REC_ICONS[r.type]}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* AI анализ */}
        <section className={style.section}>
          <AiInsight data={data} />
        </section>
      </main>
    </>
  );
};
