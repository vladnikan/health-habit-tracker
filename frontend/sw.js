self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Слушаем сообщение от приложения с расписанием
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATIONS') {
    const habits = event.data.habits;
    scheduleAll(habits);
  }
});

function scheduleAll(habits) {
  habits.forEach(habit => {
    if (!habit.reminder_time) return;

    const [hours, minutes] = habit.reminder_time.split(':').map(Number);
    const now = new Date();
    const target = new Date();

    target.setHours(hours, minutes, 0, 0);

    // Если время уже прошло сегодня — ставим на завтра
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    const delay = target.getTime() - now.getTime();

    setTimeout(() => {
      self.registration.showNotification(`⏰ ${habit.name}`, {
        body: 'Не забудьте отметить привычку сегодня!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `habit-${habit.id}`, // не дублирует уведомления
      });

      // Ставим на следующий день
      setInterval(() => {
        self.registration.showNotification(`⏰ ${habit.name}`, {
          body: 'Не забудьте отметить привычку сегодня!',
          icon: '/favicon.ico',
          tag: `habit-${habit.id}`,
        });
      }, 24 * 60 * 60 * 1000);

    }, delay);
  });
}