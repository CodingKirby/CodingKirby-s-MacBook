import React, { useState, useEffect } from 'react';
import '../../styles/Statusbar.css';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');

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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 0.8fr)',
        }}>
          <span className="menu-item"><i className="fas fa-fast-backward"></i></span>
          <span className="menu-item"><i className="fas fa-pause"></i></span>
          <span className="menu-item"><i className="fas fa-fast-forward"></i></span>
          <span className="menu-item"><i className="fas fa-volume-up"></i></span>
        </div>
        
        <span className="menu-item"><i className="fas fa-wifi"></i></span>
        <span className="menu-item"><i className="fas fa-battery-three-quarters"></i></span>
        <span className="menu-item">{time}</span>
      </div>
    </div>
  );
};

export default StatusBar;
