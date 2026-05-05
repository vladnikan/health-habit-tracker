import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './auth/slice';
import { habitReducer } from './habit/slice';
import { metricsReducer } from './metric/slice';
// Импортируй другие редьюсеры позже, например:
// import { habitsReducer } from './habits/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    habits: habitReducer,
    metrics: metricsReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(api.middleware), // пока закомментировано, если RTK Query не используешь
});

// Типы для удобства использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;