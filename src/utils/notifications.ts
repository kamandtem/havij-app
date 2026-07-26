import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { NotificationSettings } from '../types';

// Fixed notification IDs so re-scheduling always overwrites the same ones
// instead of piling up duplicates.
const NOTIF_ID_GOALS = 1001;
const NOTIF_ID_SLEEP = 1002;
const NOTIF_ID_WAKE = 1003;

// Android requires notifications to belong to a channel that has sound and
// vibration explicitly turned on — without this, reminders were arriving
// silently with no vibration even though the "sound" setting was on.
export const REMINDER_CHANNEL_ID = 'havij_reminders';

export async function ensureReminderChannel(): Promise<void> {
  if (Capacitor.getPlatform() !== 'android') return;
  try {
    await LocalNotifications.createChannel({
      id: REMINDER_CHANNEL_ID,
      name: 'یادآوری‌های هویج',
      description: 'یادآوری اهداف روزانه، خواب و بیداری',
      importance: 5,
      visibility: 1,
      sound: 'default',
      vibration: true,
      lights: true
    });
  } catch {
    // ignore — channel may already exist
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') return true;
    const requested = await LocalNotifications.requestPermissions();
    return requested.display === 'granted';
  } catch {
    return false;
  }
}

function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map((v) => parseInt(v, 10));
  return { hour: isNaN(h) ? 9 : h, minute: isNaN(m) ? 0 : m };
}

// Cancels and re-schedules every daily reminder based on current settings.
// Safe to call any time settings change, or on every app start.
export async function syncScheduledNotifications(settings: NotificationSettings): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await ensureReminderChannel();

  // Always clear the three known reminder IDs first so toggling a
  // reminder off (or changing its time) doesn't leave stale schedules.
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: NOTIF_ID_GOALS }, { id: NOTIF_ID_SLEEP }, { id: NOTIF_ID_WAKE }]
    });
  } catch {
    // ignore cancel errors (e.g. nothing was scheduled yet)
  }

  if (!settings.enabled) return;

  const toSchedule: Parameters<typeof LocalNotifications.schedule>[0]['notifications'] = [];

  if (settings.goalsReminderEnabled && settings.goalsReminderTime) {
    const { hour, minute } = parseTime(settings.goalsReminderTime);
    toSchedule.push({
      id: NOTIF_ID_GOALS,
      title: 'هویج 🥕',
      body: 'صبح بخیر! امروز سه کار مهمت چیه؟ همین الان ثبتشون کن.',
      schedule: { on: { hour, minute }, allowWhileIdle: true },
      channelId: REMINDER_CHANNEL_ID,
      sound: settings.sound ? 'default' : undefined
    });
  }

  if (settings.sleepReminderEnabled && settings.sleepReminderTime) {
    const { hour, minute } = parseTime(settings.sleepReminderTime);
    toSchedule.push({
      id: NOTIF_ID_SLEEP,
      title: 'هویج 🥕',
      body: 'وقت خوابه! برای داشتن یک ذهن آروم‌تر فردا، الان بخواب.',
      schedule: { on: { hour, minute }, allowWhileIdle: true },
      channelId: REMINDER_CHANNEL_ID,
      sound: settings.sound ? 'default' : undefined
    });
  }

  if (settings.wakeReminderEnabled && settings.wakeReminderTime) {
    const { hour, minute } = parseTime(settings.wakeReminderTime);
    toSchedule.push({
      id: NOTIF_ID_WAKE,
      title: 'هویج 🥕',
      body: 'صبح بخیر! زمان بیداریته — یک لیوان آب بنوش و روز رو شروع کن.',
      schedule: { on: { hour, minute }, allowWhileIdle: true },
      channelId: REMINDER_CHANNEL_ID,
      sound: settings.sound ? 'default' : undefined
    });
  }

  if (toSchedule.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications: toSchedule });
    } catch {
      // ignore scheduling errors on unsupported devices
    }
  }
}
