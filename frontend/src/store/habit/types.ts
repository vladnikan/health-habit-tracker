export type THabitCheck = {
  id: number;
  habit_id: number;
  value: number;
  date: string; 
  created_at: string;
};

export type THabitData = {
  current_streak: number;
  longest_streak: number;
  unit: string;
  target_value: number;
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  frequency: "daily" | "weekly";
  duration_type?: string;
  end_date?: string | null;
  reminder_time?: string | null;
  is_active: boolean;
  created_at: string;
};

export type THabitState = {
  habits: THabitData[];
  checks: THabitCheck[];

  isLoading: boolean;
  error: string | null;

  selectedHabitId: number | null;
};

export type CreateHabitDto = {
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  target_value?: number;
  unit?: string;
  duration_type?: "indefinite" | "end_date";
  end_date?: string;
  reminder_time?: string;
};

export type UpdateHabitDto = {
  id: number;
  name?: string;
  description?: string;
  frequency?: "daily" | "weekly";
  target_value?: number;
  unit?: string;
  reminder_time?: string;
};


