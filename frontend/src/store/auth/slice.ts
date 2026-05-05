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
    /**
     * LOGIN
     */
    builder
      .addCase(authThunks.login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(authThunks.login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userData = action.payload.user;
      })
      .addCase(authThunks.login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ошибка входа";
      });

    /**
     * REGISTER (НОВЫЙ)
     */
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
      })
      // В extraReducers добавь:

      .addCase(authThunks.getUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.token = localStorage.getItem("token"); // на всякий
      })

      .addCase(authThunks.getUserData.rejected, (state) => {
        state.userData = null;
        state.token = null;
      });
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
