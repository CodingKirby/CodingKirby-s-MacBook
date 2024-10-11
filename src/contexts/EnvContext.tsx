import React, { createContext, useContext } from 'react';

// 환경 변수 타입 정의
interface EnvContextType {
  imageUrl: string;
}

// 기본값 설정 (환경 변수들이 존재하지 않을 때를 대비)
const EnvContext = createContext<EnvContextType>({
  imageUrl: '', 
});

// EnvContext 사용을 쉽게 하기 위한 커스텀 훅
export const useEnv = () => useContext(EnvContext);

interface EnvProviderProps {
  children: React.ReactNode;
}

// Provider로 환경 변수를 전달
export const EnvProvider: React.FC<EnvProviderProps> = ({ children }) => {
  const imageUrl = process.env.REACT_APP_IMAGE_URL || '';

  return (
    <EnvContext.Provider value={{ imageUrl }}>
      {children}
    </EnvContext.Provider>
  );
};
