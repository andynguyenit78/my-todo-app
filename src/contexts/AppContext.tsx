import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type BackgroundTheme = 'default' | 'nature' | 'abstract' | 'geometric';

interface AppContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  backgroundMusic: string | null;
  setBackgroundMusic: (url: string | null) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (isPlaying: boolean) => void;
  customColumns: string[];
  addCustomColumn: (columnName: string) => void;
  removeCustomColumn: (columnName: string) => void;
  reorderColumns: (startIndex: number, endIndex: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_SETTINGS = 'todo-app-settings';

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('default');
  const [backgroundMusic, setBackgroundMusic] = useState<string | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [customColumns, setCustomColumns] = useState<string[]>([]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setThemeMode(settings.themeMode);
      setBackgroundTheme(settings.backgroundTheme);
      setBackgroundMusic(settings.backgroundMusic);
      setCustomColumns(settings.customColumns || []);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify({
      themeMode,
      backgroundTheme,
      backgroundMusic,
      customColumns,
    }));
  }, [themeMode, backgroundTheme, backgroundMusic, customColumns]);

  // Apply theme mode
  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      document.documentElement.classList.toggle('dark', isDark);
    };

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(themeMode === 'dark');
    }
  }, [themeMode]);

  const addCustomColumn = (columnName: string) => {
    setCustomColumns(prev => [...prev, columnName]);
  };

  const removeCustomColumn = (columnName: string) => {
    setCustomColumns(prev => prev.filter(col => col !== columnName));
  };

  const reorderColumns = (startIndex: number, endIndex: number) => {
    setCustomColumns(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return (
    <AppContext.Provider value={{
      themeMode,
      setThemeMode,
      backgroundTheme,
      setBackgroundTheme,
      backgroundMusic,
      setBackgroundMusic,
      isMusicPlaying,
      setIsMusicPlaying,
      customColumns,
      addCustomColumn,
      removeCustomColumn,
      reorderColumns,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 