// auth/token.ts

export const getToken = (state: any) => {
  return state.auth.token || localStorage.getItem("token");
};