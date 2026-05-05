import { createSlice } from "@reduxjs/toolkit";
import { fetchMetrics, saveMetrics } from "./thunks";
import type { TMetricsState } from "./types";

const initialState: TMetricsState = {
  metrics: [],
  isLoading: false,
  error: null,
};

const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchMetrics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload;
      })

      .addCase(saveMetrics.fulfilled, (state, action) => {
        // заменяем запись за сегодня
        const index = state.metrics.findIndex(
          (m) => m.date === action.payload.date
        );

        if (index !== -1) {
          state.metrics[index] = action.payload;
        } else {
          state.metrics.push(action.payload);
        }
      });
  },
});

export const metricsReducer = metricsSlice.reducer;