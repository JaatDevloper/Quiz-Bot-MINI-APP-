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
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
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

// Export function to get Telegram user (used by Header.tsx and WelcomeCard.tsx)
export const getTelegramUser = () => {
  return telegram.user;
};

// Export haptic feedback function (used by BottomNav.tsx, QuizCard.tsx, QuickActions.tsx)
export const hapticFeedback = (
  type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'success' | 'warning' | 'error' = 'light'
) => {
  if (!telegram.HapticFeedback) return;

  // Map feedback types to appropriate Telegram API calls
  if (type === 'success' || type === 'warning' || type === 'error') {
    telegram.HapticFeedback.notificationOccurred(type);
  } else {
    telegram.HapticFeedback.impactOccurred(type);
  }
};

if (telegram.isReady) {
  telegram.ready();
  telegram.expand();
}
