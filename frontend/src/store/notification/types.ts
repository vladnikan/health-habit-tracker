export type TNotification = {
  id: number;
  user_id: number;
  habit_id: number | null;
  title: string;
  message: string;
  type: "reminder" | "achievement" | "system" | "motivation";
  sent_at: string;
  is_read: boolean;
  read_at: string | null;
};

export type TNotificationState = {
  notifications: TNotification[];
  unreadCount: number;
  isLoading: boolean;
};