// src/pages/analysis/Analysis.tsx
import React, { useEffect } from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Text } from "../../ui/text";
import { CardInfo } from "../../components/cardInfo/cardInfo";
import { GraphSwitcher } from "../../components/graphSwitcher/graphSwitcher";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMetrics } from "../../store/metric/thunks";
import style from "./analysis.module.css";

export const Analysis: React.FC = () => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector((state) => state.metrics.metrics);
  const isLoading = useAppSelector((state) => state.metrics.isLoading);

  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);

  // Последние 7 дней
  const recent = [...metrics]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)
    .reverse();

  const sleepData = recent.map(m => ({
    name: new Date(m.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
    sleep: m.sleep || 0,
  }));

  const waterData = recent.map(m => ({
    name: new Date(m.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
    water: m.water || 0,
  }));

  const stepsData = recent.map(m => ({
    name: new Date(m.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
    steps: m.steps || 0,
  }));

  const avgSleep = recent.length 
    ? Number((recent.reduce((sum, m) => sum + (m.sleep || 0), 0) / recent.length).toFixed(1))
    : 0;

  const avgWater = recent.length 
    ? Number((recent.reduce((sum, m) => sum + (m.water || 0), 0) / recent.length).toFixed(1))
    : 0;

  const avgSteps = recent.length 
    ? Math.round(recent.reduce((sum, m) => sum + (m.steps || 0), 0) / recent.length)
    : 0;

  return (
    <>
      <Header />

      <div className={style.header}>
        <Text style="H2">Аналитика</Text>
        <Text style="H4">Ваш прогресс за последние дни</Text>
      </div>

      <main className={style.page}>
        <div className={style.summary}>
          <CardInfo icon="moon" title="Средний сон" value={avgSleep} percent={78} />
          <CardInfo icon="water" title="Средняя вода" value={avgWater} percent={75} />
          <CardInfo icon="pulse" title="Средние шаги" value={avgSteps} percent={82} />
        </div>

        <GraphSwitcher
          configs={[
            { label: "Сон", type: "line", data: sleepData, xKey: "name", yKey: "sleep" },
            { label: "Вода", type: "bar", data: waterData, xKey: "name", yKey: "water" },
            { label: "Шаги", type: "bar", data: stepsData, xKey: "name", yKey: "steps" },
          ]}
        />

        <div className={style.insights}>
          <Text style="H3">Инсайты</Text>
          <div className={style.insightCards}>
            <div className={style.insight}>
              <Text style="H4">💡 Рекомендация</Text>
              <Text style="Body">
                {avgSleep < 7 
                  ? "Вы мало спите. Старайтесь спать хотя бы 7.5–8 часов." 
                  : "Сон в норме. Продолжайте в том же духе!"}
              </Text>
            </div>
            <div className={style.insight}>
              <Text style="H4">💧 Вода</Text>
              <Text style="Body">
                Среднее потребление: {avgWater} л. Рекомендуется ~2.5–3 л.
              </Text>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};