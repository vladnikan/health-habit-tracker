import { createSlice } from "@reduxjs/toolkit";
import { fetchMetrics, saveMetrics, fetchNorms } from "./thunks";
import type { TMetricsState } from "./types";

const initialState: TMetricsState = {
  metrics: [],
  norms: null,
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
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка загрузки метрик";
      })

      .addCase(fetchNorms.fulfilled, (state, action) => {
        state.norms = action.payload;
      })
      .addCase(fetchNorms.rejected, (state) => {
        state.norms = null;
      })

      .addCase(saveMetrics.fulfilled, (state, action) => {
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