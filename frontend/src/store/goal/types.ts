export type TGoal = {
  id: number;
  user_id: number;
  metric_type: string;  // ← было metric
  target_value: number;
  created_at: string;
};

export type TGoalState = {
  goals: TGoal[];
  isLoading: boolean;
  error: string | null;
};