import { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { updateHabit } from "../../store/habit/thunks";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Text } from "../../ui/text";
import style from "./cardHabitModal.module.css";

type Props = {
  habit: {
    id: number;
    name: string;
    description?: string;
    frequency: "daily" | "weekly";
    target_value?: number;
    unit?: string;
    reminder_time?: string;
  };
  onClose: () => void;
};

export const EditHabitModal = ({ habit, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: habit.name,
    description: habit.description || "",
    frequency: habit.frequency,
    target_value: habit.target_value?.toString() || "",
    unit: habit.unit || "",
    reminder_time: habit.reminder_time || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const result = await dispatch(updateHabit({
      id: habit.id,
      name: form.name,
      description: form.description || undefined,
      frequency: form.frequency as "daily" | "weekly",
      target_value: form.target_value ? parseFloat(form.target_value) : undefined,
      unit: form.unit || undefined,
      reminder_time: form.reminder_time || undefined,
    }));

    if (updateHabit.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={e => e.stopPropagation()}>
        <Text style="H3">Редактировать привычку</Text>

        <div className={style.field}>
          <Text style="H4">Название</Text>
          <Input name="name" value={form.name} onChange={handleChange} placeholder={""} />
        </div>

        <div className={style.field}>
          <Text style="H4">Описание</Text>
          <Input name="description" value={form.description} onChange={handleChange} placeholder="Необязательно" />
        </div>

        <div className={style.field}>
          <Text style="H4">Частота</Text>
          <select name="frequency" value={form.frequency} onChange={handleChange} className={style.select}>
            <option value="daily">Ежедневно</option>
            <option value="weekly">Еженедельно</option>
          </select>
        </div>

        <div className={style.row}>
          <div className={style.field}>
            <Text style="H4">Цель</Text>
            <Input name="target_value" type="number" value={form.target_value} onChange={handleChange} placeholder="Необязательно" />
          </div>
          <div className={style.field}>
            <Text style="H4">Единица</Text>
            <Input name="unit" value={form.unit} onChange={handleChange} placeholder="км, мин..." />
          </div>
        </div>

        <div className={style.field}>
          <Text style="H4">Напоминание</Text>
          <Input name="reminder_time" type="time" value={form.reminder_time} onChange={handleChange} placeholder={""} />
        </div>

        <div className={style.buttons}>
          <Button kind="secondary" text="Отмена" onClick={onClose} />
          <Button kind="primary" text="Сохранить" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};