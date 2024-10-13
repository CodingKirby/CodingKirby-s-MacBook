// Path: client/src/components/common/StatusBar.tsx

import React, { useState, useEffect } from 'react';
import { useMusic } from '../../contexts/MusicContext'; // MusicContext 사용
import '../../styles/Statusbar.css';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const {
    isPlaying,
    togglePlayPause,
    playNextTrack,
    playPreviousTrack,
  } = useMusic(); // MusicContext에서 필요한 상태 및 함수 가져오기

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
      setTime(formattedTime);
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="macos-statusbar">
      <div className="left-section">
        <span className="apple-logo"></span>
        <span className="menu-item">Finder</span>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Go</span>
        <span className="menu-item">Window</span>
        <span className="menu-item">Help</span>
      </div>

      

      <div className="right-section">
        <div className="menu-item-player">
          <span onClick={playPreviousTrack}><i className="fas fa-fast-backward"></i></span>
          <span onClick={togglePlayPause}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </span>
          <span onClick={playNextTrack}><i className="fas fa-fast-forward"></i></span>
          <span><i className="fas fa-volume-up"></i></span>
        </div>

        <span className="menu-item"><i className="fas fa-wifi"></i></span>
        <span className="menu-item"><i className="fas fa-battery-three-quarters"></i></span>
        <span className="menu-item"
        style={{

        }}
        >{time}</span>
      </div>
    </div>
  );
};

export default StatusBar;
