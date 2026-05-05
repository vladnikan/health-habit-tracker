// src/store/habit/slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { THabitState, THabitData, THabitCheck } from "./types";
import {
  fetchHabits,
  createHabit,
  createHabitCheck,
  deleteHabit,
  fetchAllChecks,
} from "./thunks";

const initialState: THabitState = {
  habits: [],
  checks: [],
  isLoading: false,
  error: null,
  selectedHabitId: null,
};

const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    setSelectedHabit(state, action: PayloadAction<number | null>) {
      state.selectedHabitId = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================
      // FETCH HABITS
      // =====================
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action: PayloadAction<THabitData[]>) => {
        state.isLoading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка загрузки привычек";
      })

      // =====================
      // FETCH ALL CHECKS (главный)
      // =====================
      .addCase(fetchAllChecks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllChecks.fulfilled, (state, action: PayloadAction<THabitCheck[]>) => {
        state.isLoading = false;
        state.checks = action.payload;        // ← Важно!
      })
      .addCase(fetchAllChecks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка загрузки отметок";
      })

      // =====================
      // CREATE HABIT
      // =====================
      .addCase(createHabit.fulfilled, (state, action: PayloadAction<THabitData>) => {
        state.habits.push(action.payload);
      })

      // =====================
      // CREATE CHECK
      // =====================
      .addCase(createHabitCheck.fulfilled, (state, action: PayloadAction<THabitCheck>) => {
        state.checks.push(action.payload);   // Добавляем новую отметку
      })

      // =====================
      // DELETE HABIT
      // =====================
      .addCase(deleteHabit.fulfilled, (state, action: PayloadAction<number>) => {
        state.habits = state.habits.filter(h => h.id !== action.payload);
        // Можно также почистить чеки этой привычки, но не обязательно
      });
  },
});

export const { setSelectedHabit, clearError } = habitSlice.actions;
export const habitReducer = habitSlice.reducer;