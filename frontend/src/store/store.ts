import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice';
import { habitReducer } from './habit/slice';
import { metricsReducer } from './metric/slice';
import { goalReducer } from './goal/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    metrics: metricsReducer,
    goals: goalReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(api.middleware), // пока закомментировано, если RTK Query не используешь
});

// Типы для удобства использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;