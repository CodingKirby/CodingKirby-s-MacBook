import React, { useState, useRef, useEffect, useCallback } from "react";
import "../../styles/MusicPlayer.css";

const imageUrl = `${process.env.REACT_APP_IMAGE_URL}`;
const mp3Url = `${process.env.REACT_APP_MUSIC_URL}`;

const albums = ["Spirited Away", "Spirited Away"];
const trackNames = ["Inochi No Namae", "Itsumo Nando Demo"];
const albumArtworks = [`${imageUrl}/Album_1.png`, `${imageUrl}/Album_2.png`];
const trackUrls = [`${mp3Url}/1.mp3`, `${mp3Url}/2.mp3`];

const MusicPlayer: React.FC = () => {
  const titleBarRef = useRef<HTMLDivElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerTrackRef = useRef<HTMLDivElement | null>(null);
  const albumArtRef = useRef<HTMLImageElement | null>(null); // 앨범 커버에 ref 추가
  const playerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 80 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true); // 플레이어 표시 상태 추가

  // 오디오 재생 시도 함수
  const playAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        if (playerTrackRef.current) playerTrackRef.current.classList.add("active");
        if (albumArtRef.current) albumArtRef.current.classList.add("active");

        if (titleBarRef.current) {
          titleBarRef.current.style.top = "-35px"; // macos-titlebar 위치 조정
        }
      }).catch((error) => {
        console.error("Autoplay failed:", error.message);
        document.addEventListener("click", handleUserInteraction);
      });
    }
  }, []);

  // 사용자가 클릭하면 오디오 재생
  const handleUserInteraction = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        if (playerTrackRef.current) playerTrackRef.current.classList.add("active");

        if (titleBarRef.current) {
          titleBarRef.current.style.top = "-35px"; // macos-titlebar 위치 조정
        }

        document.removeEventListener("click", handleUserInteraction);
      }).catch((error) => {
        console.error("Playback failed after user interaction:", error.message);
      });
    }
  }, [isPlaying]);

  const updateCurrentTime = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (playerTrackRef.current) playerTrackRef.current.classList.remove("active");
        if (albumArtRef.current) {
          albumArtRef.current.classList.remove("active");
          albumArtRef.current.classList.add("inactive"); // 회전 멈추기
        }

        if (titleBarRef.current) {
          titleBarRef.current.style.top = "0px"; // macos-titlebar 위치 조정
        }
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          if (playerTrackRef.current) playerTrackRef.current.classList.add("active");
          if (albumArtRef.current) {
            albumArtRef.current.classList.add("active");
            albumArtRef.current.classList.remove("inactive"); // 다시 회전 시작
          }
          if (titleBarRef.current) {
            titleBarRef.current.style.top = "-35px"; // macos-titlebar 위치 원상복구
          }
        }).catch((error) => console.error("Playback failed:", error.message));
      }
    }
  }, [isPlaying]);
  


  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const seekBar = e.currentTarget;
    const seekTime = (e.nativeEvent.offsetX / seekBar.offsetWidth) * duration;
    if (audioRef.current) audioRef.current.currentTime = seekTime;
  }, [duration]);

  const handleTrackChange = useCallback((index: number) => {
    const newIndex = (index < 0) ? albums.length - 1 : index % albums.length;
    setTrackIndex(newIndex);
    setIsPlaying(false);
  
    if (audioRef.current) {
      audioRef.current.src = trackUrls[newIndex];
      audioRef.current.oncanplay = () => {
        audioRef.current?.play().then(() => {
          setIsPlaying(true);
          if (playerTrackRef.current) playerTrackRef.current.classList.add("active");
          if (albumArtRef.current) albumArtRef.current.classList.add("active");
          if (titleBarRef.current) titleBarRef.current.style.top = "0px"; // macos-titlebar 위치 원상복구
        }).catch((error) => console.error("Failed to play track:", error.message));
      };
      audioRef.current.onerror = (e) => console.error("Error loading audio:", e);
      if (playerTrackRef.current) playerTrackRef.current.classList.remove("active");
      if (albumArtRef.current) albumArtRef.current.classList.remove("active");
      if (titleBarRef.current) titleBarRef.current.style.top = "-80px"; // macos-titlebar 위치 조정
    }
  }, []);
  

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("canplay", () => setIsBuffering(false));
      audio.addEventListener("waiting", () => setIsBuffering(true));
      audio.addEventListener("ended", () => handleTrackChange(trackIndex + 1));

      audio.src = trackUrls[trackIndex];
      playAudio();

      return () => {
        audio.removeEventListener("timeupdate", updateCurrentTime);
        audio.removeEventListener("canplay", () => setIsBuffering(false));
        audio.removeEventListener("waiting", () => setIsBuffering(true));
        audio.removeEventListener("ended", () => handleTrackChange(trackIndex + 1));
      };
    }
  }, [updateCurrentTime, trackIndex, playAudio, handleTrackChange]);

  // 마우스 드래그 이벤트 처리
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setInitialMousePos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) setPosition({ x: e.clientX - initialMousePos.x, y: e.clientY - initialMousePos.y });
  }, [isDragging, initialMousePos]);

  const handleMouseUp = () => setIsDragging(false);

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

  // 플레이어 종료 버튼 기능
  const handleClosePlayer = () => {
    setIsVisible(false); // 종료 버튼 클릭 시 MusicPlayer 숨기기
  };

  // 플레이어가 보이는 상태일 때만 렌더링
  if (!isVisible) return null;

  return (
    <div
      className="music-player"
      style={{ left: `${position.x}px`, top: `${position.y}px`, position: "absolute" }}
      ref={playerRef}
      onMouseDown={handleMouseDown}
    >
      <div className="macos-titlebar" ref={titleBarRef} style={{
        position: "absolute", right: "10px", top: "-10px", width: "90%", height: "6em", padding:"0 0 3.5rem 0.5rem",
        borderRadius: "1rem 1rem 0 0"
        }}>
        <div className="traffic-lights">
          <span className="close"></span>
          <span className="minimize"></span>
          <span className="fullscreen"></span>
        </div>
        <span className="title">MusicPlayer</span>
      </div>

      <div id="app-cover">
        <div id="player">
          <div id="player-track" ref={playerTrackRef}>
            <div id="album-name">{albums[trackIndex]}</div>
            <div id="track-name">{trackNames[trackIndex]}</div>
            <div id="track-time">
              <div id="current-time">
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, "0")}
              </div>
              <div id="track-length">
                {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}
              </div>
            </div>
            <div id="s-area" onClick={handleSeek}>
              <div id="s-hover"></div>
              <div id="seek-bar" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
            </div>
          </div>
          <div id="player-content">
            <div id="album-art" className={isPlaying ? "active" : ""}>
              <img
                src={albumArtworks[trackIndex]}
                className="active"
                ref={albumArtRef}
                alt={`album-art-${trackIndex}`}
              />
              {isBuffering && <div id="buffer-box">Buffering ...</div>}
            </div>
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
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default MusicPlayer;
