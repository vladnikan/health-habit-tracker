// src/pages/register/Register.tsx
import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { authThunks } from "../../store/auth/thunks";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Text } from "../../ui/text";
import style from "./register.module.css";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
    gender: "" as "" | "male" | "female" | "other",
    height: "",
    weight: "",
    birth_date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      full_name: formData.full_name || undefined,
      gender: formData.gender || undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      birth_date: formData.birth_date || undefined,
    };

    const result = await dispatch(authThunks.register(payload));

    if (authThunks.register.fulfilled.match(result)) {
      alert("Регистрация прошла успешно! Теперь войдите в аккаунт.");
      navigate("/login");
    } else {
      alert(result.payload || "Ошибка регистрации");
    }

    setLoading(false);
  };

  return (
    <div className={style.container}>
      <div className={style.formWrapper}>
        <Text style="H2">Создать аккаунт</Text>
        <Text style="Body">Начните отслеживать свои привычки и здоровье</Text>

        <form onSubmit={handleRegister} className={style.form}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            type="text"
            name="full_name"
            placeholder="ФИО (необязательно)"
            value={formData.full_name}
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={style.select}
          >
            <option value="">Пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>

          <div className={style.row}>
            <Input
              type="number"
              name="height"
              placeholder="Рост (см)"
              value={formData.height}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="weight"
              placeholder="Вес (кг)"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <Input
            type="date"
            name="birth_date"
            placeholder="Дата рождения"   // ← Добавили placeholder
            value={formData.birth_date}
            onChange={handleChange}
          />

          <Button 
            kind="primary" 
            text={loading ? "Регистрация..." : "Зарегистрироваться"} 
            type="submit" 
            disabled={loading}
          />

          <Button 
            kind="secondary" 
            text="Уже есть аккаунт? Войти" 
            onClick={() => navigate("/login")} 
            type="button"
          />
        </form>
      </div>
    </div>
  );
};