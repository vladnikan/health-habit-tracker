// src/store/auth/thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ========================
// Типы
// ========================
type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  gender?: "male" | "female" | "other" | "";
  height?: number;
  weight?: number;
  birth_date?: string;        // YYYY-MM-DD
};

type LoginPayload = {
  email: string;
  password: string;
};

// ========================
// Thunks
// ========================
export const authThunks = {
  // ========================
  // LOGIN
  // ========================
  login: createAsyncThunk<
    any,
    LoginPayload,
    { rejectValue: string }
  >("auth/login", async (credentials, { rejectWithValue }) => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.email);
      formData.append("password", credentials.password);
      formData.append("grant_type", "password");

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.detail || "Ошибка авторизации");
      }

      localStorage.setItem("token", data.access_token);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }),

  // ========================
  // REGISTER (обновлённый)
  // ========================
  register: createAsyncThunk<
    { success: boolean },
    RegisterPayload,
    { rejectValue: string }
  >("auth/register", async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.detail || "Ошибка регистрации");
      }

      return { success: true };
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }),

  // ========================
  // GET CURRENT USER
  // ========================
  // src/store/auth/thunks.ts
getUserData: createAsyncThunk<
  any,
  void,
  { rejectValue: string; state: any }
>("auth/getUserData", async (_, { rejectWithValue, getState }) => {
  const token = getState().auth.token || localStorage.getItem("token");

  if (!token) return rejectWithValue("Нет токена");

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // Если 401 — токен невалидный
      if (res.status === 401) {
        localStorage.removeItem("token");
      }
      return rejectWithValue("Токен невалиден");
    }

    const userData = await res.json();
    return userData;           // ← важно возвращать данные
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
}),

  // ========================
  // LOGOUT
  // ========================
  logout: createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("token");
    return null;
  }),
};