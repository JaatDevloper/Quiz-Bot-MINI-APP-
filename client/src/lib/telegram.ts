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
  // Optional WebApp UI helpers (not in all environments)
  showAlert?: (message: string) => void;
  showConfirm?: (message: string) => boolean | Promise<boolean>;
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

// Auto-init when inside Telegram
if (telegram.isReady) {
  telegram.ready();
  telegram.expand();
}

// Helper: get Telegram user
export const getTelegramUser = () => telegram?.user;

// Helper: haptic feedback wrapper (safe)
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
  try {
    if (tg?.HapticFeedback?.impactOccurred) {
      tg.HapticFeedback.impactOccurred(type);
    }
  } catch (e) {
    // silent fallback
    // console.warn('HapticFeedback not available', e);
  }
};

// Helper: show alert (Telegram or browser fallback)
export const showAlert = (message: string) => {
  try {
    if (tg?.showAlert) {
      // If Telegram WebApp supports showAlert
      tg.showAlert(message);
    } else {
      // Browser fallback
      alert(message);
    }
  } catch (e) {
    // Fallback to alert if something unexpected happens
    alert(message);
  }
};

/**
 * Helper: showConfirm
 * - Returns Promise<boolean> for consistent async usage across codebase.
 * - Uses tg.showConfirm if available (supports boolean or Promise<boolean>),
 *   otherwise falls back to window.confirm().
 */
export const showConfirm = async (message: string): Promise<boolean> => {
  try {
    if (tg?.showConfirm) {
      // tg.showConfirm may return boolean or Promise<boolean>
      const res = tg.showConfirm(message);
      if (res instanceof Promise) return await res;
      return !!res;
    }
    // Browser fallback
    return Promise.resolve(confirm(message));
  } catch (e) {
    // On error, fallback to false to avoid unintended destructive actions
    return Promise.resolve(false);
  }
};
