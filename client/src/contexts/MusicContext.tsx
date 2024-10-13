import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

// 음원 정보
const trackUrls = [
  `${process.env.REACT_APP_MUSIC_URL}/1.mp3`,
  `${process.env.REACT_APP_MUSIC_URL}/2.mp3`,
];
export const albums = ["Spirited Away", "Spirited Away"];
export const trackNames = ["Inochi No Namae", "Itsumo Nando Demo"];
export const albumArtworks = [`${process.env.REACT_APP_IMAGE_URL}/Album_1.png`, `${process.env.REACT_APP_IMAGE_URL}/Album_2.png`];

// 음악 상태와 제어 함수 타입 정의
interface MusicContextType {
  isPlaying: boolean;
  currentTrack: number;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  togglePlayPause: () => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  seekTo: (time: number) => void;
  updatePlayerVisualState: (isActive: boolean, playerTrack: HTMLElement, albumArt: HTMLElement, titleBar: HTMLElement) => void;
  stopAndReset: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  // 상태 업데이트
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const playNextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % trackUrls.length);
    setCurrentTime(0);
    // 트랙 변경 후 자동 재생
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
      setIsPlaying(true);
    }, 0); // 트랙 변경 후 바로 재생
  }, []);

  const playPreviousTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + trackUrls.length) % trackUrls.length);
    setCurrentTime(0);
    // 트랙 변경 후 자동 재생
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
      setIsPlaying(true);
    }, 0); // 트랙 변경 후 바로 재생
  }, []);

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 시간 업데이트
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = trackUrls[currentTrack];
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('canplay', () => setIsBuffering(false));
      audio.addEventListener('waiting', () => setIsBuffering(true));
      audio.addEventListener('ended', playNextTrack);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('canplay', () => setIsBuffering(false));
        audio.removeEventListener('waiting', () => setIsBuffering(true));
        audio.removeEventListener('ended', playNextTrack);
      };
    }
  }, [currentTrack, playNextTrack]);

  // 시각 상태 업데이트 함수
  const updatePlayerVisualState = useCallback((isActive: boolean, playerTrack: HTMLElement, albumArt: HTMLElement, titleBar: HTMLElement) => {
    if (isActive) {
      playerTrack.classList.add("active");
      albumArt.classList.add("active");
      titleBar.style.top = "-35px";
    } else {
      playerTrack.classList.remove("active");
      albumArt.classList.remove("active");
      titleBar.style.top = "0px";
    }
  }, []);  

  // 음악을 종료하고 상태 초기화
  const stopAndReset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentTrack(0);
  }, []);

  return (
    <MusicContext.Provider value={{
        isPlaying, currentTrack, currentTime, duration, isBuffering,
        togglePlayPause, playNextTrack, playPreviousTrack,
        seekTo, updatePlayerVisualState, stopAndReset }}>
      {children}
      <audio ref={audioRef} />
    </MusicContext.Provider>
  );
};
