// src/components/addHabitModal/AddHabitModal.tsx
import { type FC, useState } from "react";
import { Modal } from "../modal/Modal";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useAppDispatch } from "../../hooks/hooks";
import { createHabit } from "../../store/habit/thunks";
import style from "./AddHabitModal.module.css";

type HabitTemplate = {
  id: string;
  title: string;
  category: string;
  suggestedTarget?: number;
  unit?: string;
};

const habitTemplates: Record<string, HabitTemplate[]> = {
  popular: [
    { id: "1", title: "Пить воду", category: "popular", suggestedTarget: 2000, unit: "мл" },
    { id: "2", title: "Ходить 10 000 шагов", category: "popular", suggestedTarget: 10000, unit: "шагов" },
    { id: "3", title: "Читать книгу", category: "popular", suggestedTarget: 20, unit: "минут" },
  ],
  sport: [
    { id: "4", title: "Бег", category: "sport", suggestedTarget: 30, unit: "минут" },
    { id: "5", title: "Тренировка", category: "sport", suggestedTarget: 45, unit: "минут" },
  ],
  health: [
    { id: "7", title: "Медитация", category: "health", suggestedTarget: 10, unit: "минут" },
    { id: "8", title: "Сон", category: "health", suggestedTarget: 8, unit: "часов" },
  ],
};

type Props = {
  onClose: () => void;
};

export const AddHabitModal: FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    frequency: "daily" as "daily" | "weekly",
    target_value: 0,
    unit: "",
    duration_type: "indefinite" as "indefinite" | "end_date",
    end_date: "",
    reminder_time: "09:00",
  });

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  const handleSelectTemplate = (template: HabitTemplate) => {
    setForm({
      name: template.title,
      description: "",
      frequency: "daily",
      target_value: template.suggestedTarget || 0,
      unit: template.unit || "",
      duration_type: "indefinite",
      end_date: "",
      reminder_time: "09:00",
    });
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;

    await dispatch(createHabit({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      frequency: form.frequency,
      target_value: form.target_value > 0 ? form.target_value : undefined,
      unit: form.unit.trim() || undefined,
      duration_type: form.duration_type,
      end_date: form.duration_type === "end_date" ? form.end_date : undefined,
      reminder_time: form.reminder_time || undefined,
    }));

    onClose();
  };

  return (
    <Modal 
      title={step === 1 ? "Выберите категорию" : "Настройка привычки"} 
      onClose={onClose}
    >
      <div className={style.container}>

        {step === 1 && (
          <div>
            <Text style="H4">Выберите категорию привычки</Text>
            <div className={style.categories}>
              {Object.keys(habitTemplates).map((cat) => (
                <Button
                  key={cat}
                  kind="secondary"
                  text={
                    cat === "popular" ? "Популярные" :
                    cat === "sport" ? "Спорт и активность" : "Здоровье и благополучие"
                  }
                  onClick={() => handleCategorySelect(cat)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={style.formContainer}>
            <Button 
              kind="tertiary" 
              text="← Назад" 
              onClick={() => setStep(1)} 
            />

            <Text style="H4">Настройте привычку</Text>

            <Input
              placeholder="Название привычки"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div className={style.row}>
              <div className={style.half}>
                <Text style="H4">Частота</Text>
                <select 
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value as "daily" | "weekly" })}
                >
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                </select>
              </div>

              <div className={style.half}>
                <Text style="H4">Срок действия</Text>
                <select 
                  value={form.duration_type}
                  onChange={(e) => setForm({ ...form, duration_type: e.target.value as "indefinite" | "end_date" })}
                >
                  <option value="indefinite">Бессрочно</option>
                  <option value="end_date">До даты</option>
                </select>
              </div>
            </div>

            {form.duration_type === "end_date" && (
              <Input
                placeholder=""
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            )}

            <div className={style.row}>
              <div className={style.half}>
                <Input
                  type="number"
                  placeholder="Цель в день"
                  value={form.target_value || ""}
                  onChange={(e) => setForm({ ...form, target_value: Number(e.target.value) })}
                />
              </div>
              <div className={style.half}>
                <Input
                  placeholder="Единица измерения"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                />
              </div>
            </div>

            <Input
              type="time"
              placeholder="Время напоминания"
              value={form.reminder_time}
              onChange={(e) => setForm({ ...form, reminder_time: e.target.value })}
            />

            <div className={style.actions}>
              <Button kind="tertiary" text="Отмена" onClick={onClose} />
              <Button kind="primary" text="Создать привычку" onClick={handleCreate} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};