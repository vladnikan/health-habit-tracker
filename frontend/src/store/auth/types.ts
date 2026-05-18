export type TAuthState = {
  error: string | null;
  token: string | null;
  isLoading: boolean;
  isAuthChecked: boolean;
  userData: TUserData | null;
};

export type TUserData = {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
};

export type TAuthResponse = {
  success: boolean;
  token: string;
  user: TUserData;
};

export type TUserDataResponse = {
  success: boolean;
  user: TUserData;
};

export type TRegisterRequest = {
  email: string;
  password: string;
  username: string;
  dateBirth: string;
  gender: string;
  cityId: string;
};
