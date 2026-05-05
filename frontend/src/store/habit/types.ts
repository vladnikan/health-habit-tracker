export type THabitCheck = {
  id: number;
  habit_id: number;
  value: number;
  date: string; 
  created_at: string;
};

export type THabitData = {
  current_streak: number;
  unit: string;
  target_value: number;
  id: number;
  user_id: number;
  name: string;
  description?: string | null;
  frequency: "daily" | "weekly" | "monthly";
  is_active: boolean;
  created_at: string;
  value: number;
};

export type THabitState = {
  habits: THabitData[];
  checks: THabitCheck[];

  isLoading: boolean;
  error: string | null;

  selectedHabitId: number | null;
};


