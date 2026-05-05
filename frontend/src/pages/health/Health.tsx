// src/pages/health/Health.tsx
import React, { useState, useEffect } from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { CardInfo } from "../../components/cardInfo/cardInfo";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMetrics, saveMetrics } from "../../store/metric/thunks";
import style from "./health.module.css";

export const Health: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const metrics = useAppSelector((state) => state.metrics.metrics);
  const isLoading = useAppSelector((state) => state.metrics.isLoading);

  const [formData, setFormData] = useState({
    sleep: 7.5,
    water: 2.0,
    steps: 8000,
    heart_rate: 72,
    stress: 40,
  });

  // Загружаем данные и заполняем форму последними значениями
  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);

  // Заполняем форму последними данными за сегодня
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayMetric = metrics.find(m => m.date === today);

    if (todayMetric) {
      setFormData({
        sleep: todayMetric.sleep || 7.5,
        water: todayMetric.water || 2.0,
        steps: todayMetric.steps || 8000,
        heart_rate: todayMetric.heart_rate || 72,
        stress: todayMetric.stress || 40,
      });
    }
  }, [metrics]);

  const handleChange = (key: string, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];

    const result = await dispatch(saveMetrics({
      date: today,
      sleep: formData.sleep,
      water: formData.water,
      steps: formData.steps,
      heart_rate: formData.heart_rate,
      stress: formData.stress,
    }));

    if (saveMetrics.fulfilled.match(result)) {
      alert("✅ Показатели успешно сохранены за сегодня!");
    } else {
      alert("❌ Ошибка сохранения");
    }
  };

  return (
    <>
      <Header />

      <div className={style.mainText}>
        <Text style="H2">Показатели здоровья</Text>
        <Text style="H4">Вводите данные ежедневно</Text>
      </div>

      <main className={style.page}>
        <div className={style.metricsGrid}>
          <CardInfo icon="moon" title="Сон" value={formData.sleep} percent={80} />
          <CardInfo icon="water" title="Вода" value={formData.water} percent={75} />
          <CardInfo icon="pulse" title="Шаги" value={formData.steps} percent={85} />
          <CardInfo icon="heart" title="Пульс" value={formData.heart_rate} percent={70} />
          <CardInfo icon="water" title="Стресс" value={formData.stress} percent={65} />
        </div>

        <div className={style.formGrid}>
          <div>
            <Text style="H4">Сон (часы)</Text>
            <Input type="number" step="0.5" placeholder="7.5" value={formData.sleep} onChange={(e) => handleChange("sleep", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <Text style="H4">Вода (литры)</Text>
            <Input type="number" step="0.1" placeholder="2.0" value={formData.water} onChange={(e) => handleChange("water", parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <Text style="H4">Шаги</Text>
            <Input type="number" placeholder="8000" value={formData.steps} onChange={(e) => handleChange("steps", parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <Text style="H4">Пульс (уд/мин)</Text>
            <Input type="number" placeholder="72" value={formData.heart_rate} onChange={(e) => handleChange("heart_rate", parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <Text style="H4">Стресс (0-100)</Text>
            <Input type="number" placeholder="40" value={formData.stress} onChange={(e) => handleChange("stress", parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <Button 
          kind="primary" 
          text="Сохранить показатели за сегодня" 
          onClick={handleSave}
          disabled={isLoading}
        />
      </main>

      <Footer />
    </>
  );
};