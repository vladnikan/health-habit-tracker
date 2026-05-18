import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../auth/token";
import { API_URL } from "../../utils/api";
import type { TGoal } from "./types";

export const fetchGoals = createAsyncThunk<
  TGoal[],
  void,
  { rejectValue: string; state: any }
>("goals/fetchGoals", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    const res = await fetch(`${API_URL}/goals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Ошибка загрузки целей");
    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const saveGoal = createAsyncThunk<
  TGoal,
  { metric: string; target_value: number },
  { rejectValue: string; state: any }
>("goals/saveGoal", async (body, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    const res = await fetch(`${API_URL}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Ошибка сохранения цели");
    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});