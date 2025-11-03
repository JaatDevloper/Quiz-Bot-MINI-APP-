interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
  };
  MainButton: any;
  BackButton: any;
  HapticFeedback: any;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

const tg = window.Telegram?.WebApp;

export const telegram = {
  ready: () => tg?.ready(),
  expand: () => tg?.expand(),
  close: () => tg?.close(),
  colorScheme: tg?.colorScheme || 'light',
  themeParams: tg?.themeParams || {},
  user: tg?.initDataUnsafe?.user,
  MainButton: tg?.MainButton,
  BackButton: tg?.BackButton,
  HapticFeedback: tg?.HapticFeedback,
  isReady: !!tg,
};

// ✅ Get Telegram user
export const getTelegramUser = () => telegram.user;

// ✅ Haptic Feedback
export const hapticFeedback = (
  type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error' = 'light'
) => {
  if (!telegram.HapticFeedback) return;
  if (['success', 'warning', 'error'].includes(type)) {
    telegram.HapticFeedback.notificationOccurred(type);
  } else {
    telegram.HapticFeedback.impactOccurred(type);
  }
};

// ✅ Custom Telegram-style Alert
export const showAlert = (message: string) => {
  const existing = document.getElementById('telegram-alert');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'telegram-alert';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.4)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.backdropFilter = 'blur(2px)';

  const isDark = telegram.colorScheme === 'dark';
  const theme = telegram.themeParams;

  const box = document.createElement('div');
  box.style.backgroundColor = theme.bg_color || (isDark ? '#1f1f1f' : '#fff');
  box.style.color = theme.text_color || (isDark ? '#fff' : '#000');
  box.style.padding = '20px 25px';
  box.style.borderRadius = '16px';
  box.style.maxWidth = '80%';
  box.style.textAlign = 'center';
  box.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
  box.style.fontSize = '16px';
  box.style.lineHeight = '1.5';
  box.style.animation = 'fadeIn 0.2s ease-out';

  const text = document.createElement('div');
  text.innerText = message;

  const btn = document.createElement('button');
  btn.innerText = 'OK';
  btn.style.marginTop = '16px';
  btn.style.padding = '8px 18px';
  btn.style.border = 'none';
  btn.style.borderRadius = '10px';
  btn.style.backgroundColor = theme.button_color || (isDark ? '#2481cc' : '#007aff');
  btn.style.color = theme.button_text_color || '#fff';
  btn.style.fontWeight = '500';
  btn.style.cursor = 'pointer';
  btn.style.transition = '0.2s';
  btn.onclick = () => {
    overlay.remove();
    hapticFeedback('success');
  };

  box.appendChild(text);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
};

// ✅ Confirmation Popup
export const showConfirm = (message: string, onConfirm?: () => void) => {
  const confirmBox = confirm(message);
  if (confirmBox && onConfirm) onConfirm();
};

// ✅ Initialize Telegram WebApp
if (telegram.isReady) {
  telegram.ready();
  telegram.expand();
}
