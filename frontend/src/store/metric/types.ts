export type TMetric = {
  id: number;
  date: string;
  sleep: number;
  water: number;
  steps: number;
  heart_rate: number;
  stress: number;
};

export type TMetricsState = {
  metrics: TMetric[];
  isLoading: boolean;
  error: string | null;
};