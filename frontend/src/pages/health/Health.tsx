import React, { useState, useEffect } from "react";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { CardInfo } from "../../components/cardInfo/cardInfo";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMetrics, saveMetrics, fetchNorms } from "../../store/metric/thunks";
import { DataTransfer } from "../../components/dataTransfer";
import { Disclaimer } from "../../components/disclaimer";
import style from "./health.module.css";

export const Health: React.FC = () => {
  const dispatch = useAppDispatch();

  const metrics = useAppSelector((state) => state.metrics.metrics);
  const norms = useAppSelector((state) => state.metrics.norms);
  const isLoading = useAppSelector((state) => state.metrics.isLoading);

  const [formData, setFormData] = useState({
    sleep: 0,
    water: 0,
    steps: 0,
    heart_rate: 0,
    stress: 0,
  });

  useEffect(() => {
    dispatch(fetchMetrics());
    dispatch(fetchNorms());
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayMetric = metrics.find((m) => m.date === today);

    if (todayMetric) {
      setFormData({
        sleep: todayMetric.sleep || 0,
        water: todayMetric.water || 0,
        steps: todayMetric.steps || 0,
        heart_rate: todayMetric.heart_rate || 0,
        stress: todayMetric.stress || 0,
      });
    }
  }, [metrics]);

  const handleChange = (key: string, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];

    const result = await dispatch(
      saveMetrics({
        date: today,
        sleep: formData.sleep,
        water: formData.water,
        steps: formData.steps,
        heart_rate: formData.heart_rate,
        stress: formData.stress,
      })
    );

    if (saveMetrics.fulfilled.match(result)) {
      alert("✅ Показатели успешно сохранены за сегодня!");
    } else {
      alert("❌ Ошибка сохранения");
    }
  };

  return (
    <div className={style.page}>
      <div className={style.mainText}>
        <Text style="H2">Показатели здоровья</Text>
        <Text style="H4">Вводите данные ежедневно</Text>
      </div>
      <main className={style.main}>
        <div className={style.metricsGrid}>
          <div>
            <CardInfo
              icon="moon"
              title="Сон"
              value={formData.sleep}
              percent={norms ? Math.round((formData.sleep / norms.sleep.recommended) * 100) : 0}
            />
            <div className={style.normText}>
              <Text style="H4">Норма для вас: {norms?.sleep?.label || "—"}</Text>
            </div>
          </div>
          <div>
            <CardInfo
              icon="water"
              title="Вода"
              value={formData.water}
              percent={norms ? Math.round((formData.water / norms.water.recommended) * 100) : 0}
            />
            <div className={style.normText}>
              Норма: {norms?.water?.label || "—"}
            </div>
          </div>
          <div>
            <CardInfo
              icon="pulse"
              title="Шаги"
              value={formData.steps}
              percent={norms ? Math.round((formData.steps / norms.steps.recommended) * 100) : 0}
            />
            <div className={style.normText}>
              Норма: {norms?.steps?.label || "—"}
            </div>
          </div>
          <div>
            <CardInfo
              icon="heart"
              title="Пульс"
              value={formData.heart_rate}
              percent={norms ? Math.round(100 - Math.abs(formData.heart_rate - norms.heart_rate.recommended) * 2) : 0}
            />
            <div className={style.normText}>
              Норма: {norms?.heart_rate?.label || "—"}
            </div>
          </div>
          <div>
            <CardInfo
              icon="stress"
              title="Стресс"
              value={formData.stress}
              percent={norms ? Math.round(100 - (formData.stress / norms.stress.max) * 100) : 0}
            />
            <div className={style.normText}>
              Норма: {norms?.stress?.label || "—"}
            </div>
          </div>
        </div>
        <Disclaimer/>
        <div className={style.formGrid}>
          <div>
            <Text style="H4">Сон (часы)</Text>
            <Input
              type="number"
              step="0.5"
              placeholder="7.5"
              value={formData.sleep}
              onChange={(e) => handleChange("sleep", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Text style="H4">Вода (литры)</Text>
            <Input
              type="number"
              step="0.1"
              placeholder="2.0"
              value={formData.water}
              onChange={(e) => handleChange("water", parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Text style="H4">Шаги</Text>
            <Input
              type="number"
              placeholder="8000"
              value={formData.steps}
              onChange={(e) => handleChange("steps", parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Text style="H4">Пульс (уд/мин)</Text>
            <Input
              type="number"
              placeholder="72"
              value={formData.heart_rate}
              onChange={(e) => handleChange("heart_rate", parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <Text style="H4">Стресс (0-100)</Text>
            <Input
              type="number"
              placeholder="40"
              value={formData.stress}
              onChange={(e) => handleChange("stress", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <Button
          kind="primary"
          text="Сохранить показатели за сегодня"
          onClick={handleSave}
          disabled={isLoading}
        />
      </main>

      <section style={{ padding: "0 20px 40px" }}>
        <DataTransfer />
      </section>
    </div>
  );
};