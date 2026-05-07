// auth/token.ts

import type { RootState } from '../store';

export const getToken = (state: RootState) => {
  return state.auth.token || localStorage.getItem("token");
};