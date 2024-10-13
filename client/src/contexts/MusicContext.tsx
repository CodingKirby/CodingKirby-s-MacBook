// src/contexts/MusicContext.tsx
import React, { createContext, useState, useRef, useContext, useCallback, ReactNode, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  currentTrackIndex: number;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  togglePlayPause: () => void;
  duration: number;
  currentTime: number;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const trackList = [
    '/path/to/track1.mp3',
    '/path/to/track2.mp3',
  ];

  // 오디오 파일 설정 및 업데이트
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = trackList[currentTrackIndex];
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
    }
  }, [currentTrackIndex, trackList]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % trackList.length);
    setIsPlaying(false);
  }, [trackList.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) =>
      (prevIndex - 1 + trackList.length) % trackList.length
    );
    setIsPlaying(false);
  }, [trackList.length]);

  return (
    <MusicContext.Provider
      value={{ isPlaying, currentTrackIndex, play, pause, nextTrack, prevTrack, togglePlayPause, duration, currentTime }}
    >
      {children}
      <audio ref={audioRef} />
    </MusicContext.Provider>
  );
};

// 커스텀 훅
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
