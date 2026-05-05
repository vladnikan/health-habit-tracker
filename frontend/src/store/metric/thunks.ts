import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../auth/token";
import type { TMetric } from "./types";

const BASE_URL = "http://localhost:8000";

export const fetchMetrics = createAsyncThunk<
  TMetric[],
  void,
  { state: any; rejectValue: string }
>("metrics/fetchMetrics", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const res = await fetch(`${BASE_URL}/metrics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Ошибка загрузки метрик");
    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const saveMetrics = createAsyncThunk<
  TMetric,
  Partial<TMetric>,
  { state: any; rejectValue: string }
>("metrics/saveMetrics", async (body, { getState, rejectWithValue }) => {
  try {
    const token = getToken(getState());
    const res = await fetch(`${BASE_URL}/metrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Ошибка сохранения");
    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});