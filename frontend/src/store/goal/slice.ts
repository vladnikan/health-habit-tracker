import { createSlice } from "@reduxjs/toolkit";
import type { TGoalState } from "./types";
import { fetchGoals, saveGoal } from "./thunks";

const initialState: TGoalState = {
  goals: [],
  isLoading: false,
  error: null,
};

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка";
      })
      .addCase(saveGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(
          g => g.metric_type === action.payload.metric_type
        );
        if (index !== -1) {
          state.goals[index] = action.payload;
        } else {
          state.goals.push(action.payload);
        }
      });
  },
});

export const goalReducer = goalSlice.reducer;