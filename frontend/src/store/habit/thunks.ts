// src/store/habit/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { THabitData, THabitCheck } from "./types";
import { getToken } from "../auth/token";

const BASE_URL = "http://localhost:8000";

// ========================
// HABITS
// ========================

// Тип для создания привычки (обновлённый)
type CreateHabitDto = {
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  target_value?: number;
  unit?: string;
  duration_type?: "indefinite" | "end_date";
  end_date?: string;
  reminder_time?: string;
};

export const createHabit = createAsyncThunk<
  THabitData,
  CreateHabitDto,
  { rejectValue: string; state: any }
>("habits/createHabit", async (body, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());

    const payload = {
      name: body.name,
      description: body.description || null,
      frequency: body.frequency,
      target_value: body.target_value || null,
      unit: body.unit || null,
      duration_type: body.duration_type || "indefinite", // бессрочно по умолчанию
      end_date: body.end_date || null,
      reminder_time: body.reminder_time || null,
    };

    console.log("🚀 Создаём привычку:", payload);

    const res = await fetch(`${BASE_URL}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Ошибка создания привычки");
    }

    const data = await res.json();
    console.log("✅ Привычка успешно создана:", data);
    return data;
  } catch (e: any) {
    console.error("🔥 Ошибка создания привычки:", e);
    return rejectWithValue(e.message);
  }
});

export const fetchHabits = createAsyncThunk<
  THabitData[],
  void,
  { rejectValue: string; state: any }
>("habits/fetchHabits", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());

    const res = await fetch(`${BASE_URL}/habits`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка загрузки привычек");

    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const deleteHabit = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: any }
>("habits/deleteHabit", async (id, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());

    const res = await fetch(`${BASE_URL}/habits/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка удаления привычки");

    return id;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

// ========================
// CHECKS
// ========================

export const fetchChecks = createAsyncThunk<
  THabitCheck[],
  number,
  { rejectValue: string; state: any }
>("habits/fetchChecks", async (habitId, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    const res = await fetch(`${BASE_URL}/habits/${habitId}/checks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Ошибка загрузки чеков");
    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const createHabitCheck = createAsyncThunk<
  THabitCheck,
  { habit_id: number; date?: string; value?: number },
  { rejectValue: string; state: any }
>(
  "habits/createHabitCheck",
  async ({ habit_id, date, value }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState());

      const payload: any = { date, value };

      const res = await fetch(`${BASE_URL}/habits/${habit_id}/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Ошибка отметки привычки");
      }

      return await res.json();
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  },
);

export const fetchAllChecks = createAsyncThunk<
  THabitCheck[],
  void,
  { rejectValue: string; state: any }
>("habits/fetchAllChecks", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());

    const res = await fetch(`${BASE_URL}/habits/checks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Ошибка загрузки всех чеков");

    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});
