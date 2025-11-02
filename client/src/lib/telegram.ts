import WebApp from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export const telegram = WebApp;

export function getTelegramUser(): TelegramUser | null {
  if (telegram.initDataUnsafe?.user) {
    return telegram.initDataUnsafe.user as TelegramUser;
  }
  return null;
}

export function initTelegramApp() {
  telegram.ready();
  telegram.expand();
  telegram.enableClosingConfirmation();
  
  if (telegram.BackButton) {
    telegram.BackButton.hide();
  }
}

export function setBackButton(onClick: () => void) {
  if (telegram.BackButton) {
    telegram.BackButton.show();
    telegram.BackButton.onClick(onClick);
  }
}

export function hideBackButton() {
  if (telegram.BackButton) {
    telegram.BackButton.hide();
  }
}

export function showAlert(message: string) {
  telegram.showAlert(message);
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    telegram.showConfirm(message, resolve);
  });
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
  if (telegram.HapticFeedback) {
    if (type === 'success' || type === 'warning' || type === 'error') {
      telegram.HapticFeedback.notificationOccurred(type);
    } else {
      telegram.HapticFeedback.impactOccurred(type === 'heavy' ? 'heavy' : type === 'medium' ? 'medium' : 'light');
    }
  }
}
