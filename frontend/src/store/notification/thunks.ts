import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken } from "../auth/token";
import { API_URL } from "../../utils/api";
import type { TNotification } from "./types";

export const fetchNotifications = createAsyncThunk<
  TNotification[],
  void,
  { rejectValue: string; state: any }
>("notifications/fetch", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    const res = await fetch(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Ошибка загрузки уведомлений");
    return await res.json();
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const markAsRead = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: any }
>("notifications/markAsRead", async (id, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const markAllAsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string; state: any }
>("notifications/markAllAsRead", async (_, { rejectWithValue, getState }) => {
  try {
    const token = getToken(getState());
    await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});