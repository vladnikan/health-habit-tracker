import { type FC, useState } from "react";
import { Modal } from "../modal/Modal";
import { Text } from "../../ui/text";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useAppDispatch } from "../../hooks/hooks";
import { createHabit } from "../../store/habit/thunks";
import style from "./AddHabitModal.module.css";

type Props = {
  onClose: () => void;
};

const categories = [
  { value: "physical", label: "Физическая активность" },
  { value: "health", label: "Здоровье" },
  { value: "mental", label: "Ментальное здоровье" },
  { value: "self_development", label: "Саморазвитие" },
  { value: "nutrition", label: "Питание" },
  { value: "other", label: "Другое" },
];

export const AddHabitModal: FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    frequency: "daily" as "daily" | "weekly",
    target_value: 0,
    unit: "",
    duration_type: "indefinite" as "indefinite" | "end_date",
    end_date: "",
    reminder_time: "09:00",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    if (!form.category) return;

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
    <Modal title="Создать новую привычку" onClose={onClose}>
      <div className={style.container}>

        <Input
          placeholder="Название привычки"
          value={form.name}
          onChange={handleChange}
          name="name"
        />

        <div>
          <Text style="H4">Категория</Text>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={style.select}
          >
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          placeholder="Описание (необязательно)"
          value={form.description}
          onChange={handleChange}
          name="description"
        />

        <div className={style.row}>
          <div className={style.half}>
            <Text style="H4">Частота</Text>
            <select
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
            >
              <option value="daily">Ежедневно</option>
              <option value="weekly">Еженедельно</option>
            </select>
          </div>

          <div className={style.half}>
            <Text style="H4">Срок действия</Text>
            <select
              name="duration_type"
              value={form.duration_type}
              onChange={handleChange}
            >
              <option value="indefinite">Бессрочно</option>
              <option value="end_date">До даты</option>
            </select>
          </div>
        </div>

        {form.duration_type === "end_date" && (
          <Input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange} placeholder={""}          />
        )}

        <div className={style.row}>
          <div className={style.half}>
            <Input
              type="number"
              name="target_value"
              placeholder="Цель в день"
              value={form.target_value || ""}
              onChange={handleChange}
            />
          </div>
          <div className={style.half}>
            <Input
              name="unit"
              placeholder="Единица измерения (мл, шагов, мин...)"
              value={form.unit}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Text style="H4">Время напоминания</Text>
          <Input
            type="time"
            name="reminder_time"
            value={form.reminder_time}
            onChange={handleChange} placeholder={""}          />
        </div>

        <div className={style.actions}>
          <Button kind="tertiary" text="Отмена" onClick={onClose} />
          <Button 
            kind="primary" 
            text="Создать привычку" 
            onClick={handleCreate}
            disabled={!form.name.trim() || !form.category}
          />
        </div>
      </div>
    </Modal>
  );
};