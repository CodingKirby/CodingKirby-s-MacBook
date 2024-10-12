import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAppState } from '../../contexts/AppContext';

import "../../styles/MusicPlayer.css";
import '../../styles/Container.css';

// 이미지와 mp3 파일의 URL을 환경 변수에서 가져옴
const imageUrl = process.env.REACT_APP_IMAGE_URL;
const mp3Url = process.env.REACT_APP_MUSIC_URL;

// 앨범, 트랙 이름, 앨범 아트, 트랙 URL 샘플 데이터
const albums = ["Spirited Away", "Spirited Away"];
const trackNames = ["Inochi No Namae", "Itsumo Nando Demo"];
const albumArtworks = [`${imageUrl}/Album_1.png`, `${imageUrl}/Album_2.png`];
const trackUrls = [`${mp3Url}/1.mp3`, `${mp3Url}/2.mp3`];

const MusicPlayer: React.FC = () => {
  const { apps, closeApp, minimizeApp } = useAppState();
  
  const playerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerTrackRef = useRef<HTMLDivElement | null>(null);
  const albumArtRef = useRef<HTMLImageElement | null>(null);
  const titleBarRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 80 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  const isRunning = apps.music.isRunning;
  const isMinimized = apps.music.isMinimized;

  // 오디오 상태를 동기화하지 않고 오디오 재생 상태 유지
  const syncAudioState = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isPlaying) {
      audio.src = trackUrls[trackIndex]; // 오디오 URL 설정
      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("canplay", () => setIsBuffering(false));
      audio.addEventListener("waiting", () => setIsBuffering(true));
      audio.addEventListener("ended", () => handleTrackChange(trackIndex + 1));

      return () => {
        audio.removeEventListener("timeupdate", updateCurrentTime);
        audio.removeEventListener("canplay", () => setIsBuffering(false));
        audio.removeEventListener("waiting", () => setIsBuffering(true));
        audio.removeEventListener("ended", () => handleTrackChange(trackIndex + 1));
      };
    }
  }, [trackIndex, isPlaying]);

  // 플레이어의 비주얼 상태를 업데이트
  const updatePlayerVisualState = useCallback((isActive: boolean) => {
    const activeClass = isActive ? "active" : "inactive";
    playerTrackRef.current?.classList.toggle("active", isActive);
    albumArtRef.current?.classList.toggle(activeClass, isActive);
    titleBarRef.current && (titleBarRef.current.style.top = isActive ? "-35px" : "0px");
  }, []);

  // 오디오 재생 함수
  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().then(() => {
        setIsPlaying(true);
        updatePlayerVisualState(true);
      }).catch((error) => {
        console.error("Autoplay failed:", error.message);
        document.addEventListener("click", handleUserInteraction);
      });
    }
  }, [updatePlayerVisualState]);

  // 자동 재생 실패 시 유저가 클릭하면 재생
  const handleUserInteraction = useCallback(() => {
    if (!isPlaying) {
      playAudio();
      document.removeEventListener("click", handleUserInteraction);
    }
  }, [isPlaying, playAudio]);

  // 재생/일시정지 토글 함수
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      isPlaying ? audio.pause() : playAudio();
      setIsPlaying((prev) => !prev);
      updatePlayerVisualState(!isPlaying);
    }
  }, [isPlaying, playAudio, updatePlayerVisualState]);

  // 트랙 변경 함수 (다음/이전 트랙)
  const handleTrackChange = useCallback((index: number) => {
    const newIndex = (index + albums.length) % albums.length;
    setTrackIndex(newIndex);
    setIsPlaying(false);
    updatePlayerVisualState(false);

    if (audioRef.current) {
      audioRef.current.src = trackUrls[newIndex];
      audioRef.current.oncanplay = playAudio;
    }
  }, [playAudio, updatePlayerVisualState]);

  // 시크바를 통해 트랙 탐색
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (duration && !isNaN(duration)) {
      const seekTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
      if (audioRef.current) audioRef.current.currentTime = seekTime;
    }
  }, [duration]);

  // 현재 재생 시간과 트랙 길이를 업데이트
  const updateCurrentTime = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration)) {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    }
  }, []);

  // 앱이 실행 중이고 최소화되지 않았을 때 오디오 상태 동기화
  useEffect(() => {
    if (isRunning && !isMinimized) {
      if (!isPlaying) {
        syncAudioState();
      }
    }
  }, [isRunning, isMinimized, syncAudioState]);

  // 마우스를 눌렀을 때 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setInitialMousePos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // 드래그 중일 때 플레이어 창 위치 업데이트
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.min(Math.max(0, e.clientX - initialMousePos.x), window.innerWidth - playerRef.current!.offsetWidth);
      const newY = Math.min(Math.max(60, e.clientY - initialMousePos.y), window.innerHeight - playerRef.current!.offsetHeight);
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, initialMousePos]);

  // 마우스를 떼면 드래그 중지
  const handleMouseUp = () => setIsDragging(false);

  // 드래그를 위한 이벤트 리스너 추가/제거
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  // 앱을 닫는 함수
  const handleCloseApp = () => {
    closeApp("music");
    if (isPlaying) audioRef.current?.pause();
    setIsPlaying(false);
  };

  // 앱 최소화 함수
  const handleMinimizeApp = () => minimizeApp("music");

  if (!isRunning) return null;

  return (
    <div
      className="music-player"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`, 
        position: "absolute", 
        display: isMinimized ? "none" : "block"  // 최소화 시 플레이어 UI를 숨김
      }}
      ref={playerRef}
    >
      {/* 음악 플레이어의 타이틀바 */}
      <div
        className="macos-titlebar"
        style={{
          position: "absolute", right: "10px", top: "-10px", width: "90%", height: "6em", padding:"0 0 3.5rem 0.5rem",
          borderRadius: "1rem 1rem 0 0"
        }}
        ref={titleBarRef}
        onMouseDown={handleMouseDown}
      >
        {/* 닫기 및 최소화 버튼 */}
        <div className="traffic-lights">
          <span className="close" onClick={handleCloseApp}></span>
          <span className="minimize" onClick={handleMinimizeApp}></span>
        </div>
        <span className="title">MusicPlayer</span>
      </div>

      {/* 메인 플레이어 UI */}
      <div id="app-cover">
        <div id="player">
          <div id="player-track" ref={playerTrackRef}>
            <div id="album-name">{albums[trackIndex]}</div>
            <div id="track-name">{trackNames[trackIndex]}</div>
            <div id="track-time">
              {/* 현재 재생 시간 및 트랙 길이 표시 */}
              <div id="current-time">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, "0")}
              </div>
              <div id="track-length">
                {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}
              </div>
            </div>
            {/* 시크바 클릭 시 트랙 탐색 */}
            <div id="s-area" onClick={handleSeek}>
              <div id="seek-bar" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            </div>
          </div>

          {/* 플레이어 컨텐츠 (앨범 아트 및 제어 버튼들) */}
          <div id="player-content">
            <div id="album-art" className={isPlaying ? "active" : ""}>
              <img
                src={albumArtworks[trackIndex]}
                ref={albumArtRef}
                alt={`album-art-${trackIndex}`}
              />
              {/* 오디오 로딩 중일 때 버퍼링 표시 */}
              {isBuffering && <div id="buffer-box">Buffering ...</div>}
            </div>

            {/* 오디오 제어 버튼들 (이전, 재생/일시정지, 다음) */}
            <div id="player-controls">
              <div className="control" onClick={() => handleTrackChange(trackIndex - 1)}>
                <div className="button" id="play-previous">
                  <i className="fas fa-backward"></i>
                </div>
              </div>
              <div className="control" onClick={togglePlayPause}>
                <div className="button" id="play-pause-button">
                  <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
                </div>
              </div>
              <div className="control" onClick={() => handleTrackChange(trackIndex + 1)}>
                <div className="button" id="play-next">
                  <i className="fas fa-forward"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 재생을 위한 숨겨진 오디오 엘리먼트 */}
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default MusicPlayer;
