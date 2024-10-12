import React, { useRef, useEffect, useState } from 'react';
import '../../styles/Container.css';
import { useAppState } from '../../contexts/AppContext';

interface ContainerProps {
  title: string;
  appName: string; 
  children: React.ReactNode;
  appStyle?: React.CSSProperties; // 앱별 스타일을 받는 프로퍼티 추가
  titleBarStyle?: React.CSSProperties; // 타이틀바 스타일을 받는 프로퍼티 추가
}

const Container: React.FC<ContainerProps> = ({ title, appName, children, appStyle, titleBarStyle }) => {
  const { closeApp, minimizeApp, maximizeApp } = useAppState();

  const contentRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); 
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const handleClose = () => {
    closeApp(appName as keyof typeof useAppState);
  };

  const handleMinimize = () => {
    minimizeApp(appName as keyof typeof useAppState);
  };

  const handleMaximize = () => {
    maximizeApp(appName as keyof typeof useAppState);
  };

  // content의 크기에 맞게 container 크기를 조정
  useEffect(() => {
    const updateContainerSize = () => {
      if (contentRef.current) {
        const contentWidth = contentRef.current.offsetWidth;
        const contentHeight = contentRef.current.offsetHeight;
        setContainerSize({ width: contentWidth, height: contentHeight });
      }
    };

    updateContainerSize(); // 처음에 크기 설정
    window.addEventListener('resize', updateContainerSize); // 창 크기가 변경될 때 크기 업데이트

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [children]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setInitialMousePos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - initialMousePos.x;
      const newY = e.clientY - initialMousePos.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="container"
      style={{
        ...appStyle,
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: 'absolute',
      }}
      ref={containerRef}
    >
      <div 
        className="macos-titlebar" 
        onMouseDown={handleMouseDown}
        style={{
          ...titleBarStyle,
          cursor: 'grab'
        }}
      >
        <div className="traffic-lights">
          <span className="close" onClick={handleClose}></span> 
          <span className="minimize" onClick={handleMinimize}></span> 
          <span className="fullscreen" onClick={handleMaximize}></span>
        </div>
        <span className="title">{title}</span>
      </div>
      <div className="content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default Container;
