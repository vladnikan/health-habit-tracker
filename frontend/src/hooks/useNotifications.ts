import { useEffect } from 'react';
import type { THabitData } from '../store/habit/types';

export const useNotifications = (habits: THabitData[]) => {
  useEffect(() => {
    const habitsWithReminder = habits.filter(h => h.reminder_time);
    if (habitsWithReminder.length === 0) return;

    const init = async () => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('Уведомления не поддерживаются');
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      registration.active?.postMessage({
        type: 'SCHEDULE_NOTIFICATIONS',
        habits: habitsWithReminder.map(h => ({
          id: h.id,
          name: h.name,
          reminder_time: h.reminder_time,
        })),
      });
    };

    init();
  }, [habits]);
};