import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define app names and states
type AppName = 
  | 'finder'
  | 'music'
  | 'safari'
  | 'photos'
  | 'messages'
  | 'memo'
  | 'github'
  | 'blog'
  | 'notion'
  | 'mail'
  | 'share'
  | 'settings'
  | 'bin';

type AppState = {
  isRunning: boolean;
  isMinimized: boolean;
};

// Define the structure of the context
interface AppContextType {
  apps: Record<AppName, AppState>;
  toggleAppState: (appName: AppName) => void;
  toggleAppSize: (appName: AppName) => void;

  closeApp: (appName: AppName) => void;
  openApp: (appName: AppName) => void;

  minimizeApp: (appName: AppName) => void;
  maximizeApp: (appName: AppName) => void;
}

// Default initial states for all apps
const initialAppStates: Record<AppName, AppState> = {
  finder: { isRunning: true, isMinimized: false },
  music: { isRunning: true, isMinimized: false },
  safari: { isRunning: true, isMinimized: false },
  photos: { isRunning: false, isMinimized: false },
  messages: { isRunning: false, isMinimized: false },
  memo: { isRunning: false, isMinimized: false },
  github: { isRunning: false, isMinimized: false },
  blog: { isRunning: false, isMinimized: false },
  notion: { isRunning: false, isMinimized: false },
  mail: { isRunning: false, isMinimized: false },
  share: { isRunning: false, isMinimized: false },
  settings: { isRunning: false, isMinimized: false },
  bin: { isRunning: false, isMinimized: false },
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Custom hook to use the context
export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

// Context provider component
export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<Record<AppName, AppState>>(initialAppStates);

  const toggleAppState = useCallback((appName: AppName) => {
    setApps((prevState) => ({
      ...prevState,
      [appName]: {
        ...prevState[appName],
        isRunning: !prevState[appName].isRunning,
        isMinimized: false, // 항상 실행되면 최대화 상태로 변경
      },
    }));
  }, []);

  const toggleAppSize = useCallback((appName: AppName) => {
    setApps((prevState) => ({
      ...prevState,
      [appName]: {
        ...prevState[appName],
        isMinimized: !prevState[appName].isMinimized,
      },
    }));
  }, []);

  const closeApp = useCallback((appName: AppName) => {
    setApps((prevState) => ({
      ...prevState,
      [appName]: {
        ...prevState[appName],
        isRunning: false,
      },
    }));
  }, []);

  const openApp = useCallback((appName: AppName) => {
    setApps((prevState) => ({
      ...prevState,
      [appName]: {
        ...prevState[appName],
        isRunning: true,
        isMinimized: false,
      },
    }));
  }, []);

  const maximizeApp = useCallback((appName: AppName) => {
    setApps((prevState) => ({
      ...prevState,
      [appName]: {
        ...prevState[appName],
        isMinimized: false,
      },
    }));
  }
  , []);

  const minimizeApp = useCallback((appName: AppName) => {
    setApps((prevState) => ({
      ...prevState,
      [appName]: {
        ...prevState[appName],
        isMinimized: true,
      },
    }));
  }, []);

  return (
    <AppContext.Provider value={{ apps,
    toggleAppState, toggleAppSize,
    closeApp, openApp, minimizeApp, maximizeApp }}>
      {children}
    </AppContext.Provider>
  );
};
