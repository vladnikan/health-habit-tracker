import type { AppDispatch, RootState } from "../store";
import { authActions } from "./slice";
import { authThunks } from "./thunks";

export const initAuth = () => async (dispatch: AppDispatch) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(authActions.setIsAuthChecked(true));
      return;
    }

    const result = await dispatch(authThunks.getUserData());

    if (authThunks.getUserData.fulfilled.match(result)) {
      dispatch(authActions.setIsAuthChecked(true));
    } else {
      localStorage.removeItem("token");
      dispatch(authActions.setIsAuthChecked(true));
    }
  } catch (e) {
    localStorage.removeItem("token");
    dispatch(authActions.setIsAuthChecked(true));
  }
};