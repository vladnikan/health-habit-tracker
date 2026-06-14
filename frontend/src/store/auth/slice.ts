import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TAuthState } from "./types";
import { authThunks } from "./thunks";

const initialState: TAuthState = {
  userData: null,
  token: null,
  error: null,
  isLoading: false,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(authThunks.login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authThunks.login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token ?? action.payload.token ?? null;
        state.userData = action.payload.user ?? state.userData;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(authThunks.login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка входа";
      });

    builder
      .addCase(authThunks.register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authThunks.register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(authThunks.register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка регистрации";
      });

    builder
      .addCase(authThunks.getUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(authThunks.getUserData.rejected, (state) => {
        state.userData = null;
        state.token = null;
        state.isAuthChecked = true;
      });

    builder.addCase(authThunks.logout.fulfilled, (state) => {
      state.token = null;
      state.userData = null;
      state.error = null;
      state.isAuthChecked = true;
    });
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;