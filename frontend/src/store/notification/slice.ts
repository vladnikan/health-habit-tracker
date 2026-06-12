import { createSlice } from "@reduxjs/toolkit";
import type { TNotificationState } from "./types";
import { fetchNotifications, markAsRead, markAllAsRead } from "./thunks";

const initialState: TNotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.is_read).length;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.notifications.find(n => n.id === action.payload);
        if (n) {
          n.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => { n.is_read = true; });
        state.unreadCount = 0;
      });
  },
});

export const notificationReducer = notificationSlice.reducer;