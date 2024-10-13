import React, { useRef, useEffect, useState } from 'react';
import '../../styles/Container.css';
import { useAppState } from '../../contexts/AppContext';

interface ContainerProps {
  title: string;
  appName: string; 
  children: React.ReactNode;
  appStyle?: React.CSSProperties; 
  titleBarStyle?: React.CSSProperties;
}

const Container: React.FC<ContainerProps> = ({ title, appName, children, appStyle, titleBarStyle }) => {
  const { closeApp, minimizeApp, maximizeApp } = useAppState();

  const containerRef = useRef<HTMLDivElement | null>(null); 
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [isMinimizing, setIsMinimizing] = useState(false);  // minimize 애니메이션을 위한 상태 추가

  const MIN_WIDTH = 200;
  const MIN_HEIGHT = 150;

  const handleClose = () => {
    closeApp(appName as keyof typeof useAppState);
  };

  const handleMinimize = () => {
    setIsMinimizing(true); // 애니메이션을 트리거
    setTimeout(() => {
      minimizeApp(appName as keyof typeof useAppState); // 애니메이션이 끝난 후 최소화 상태로 변경
      setIsMinimizing(false); // 애니메이션 초기화
    }, 500); // 애니메이션 시간과 맞춰서 0.5초 뒤에 최소화
  };

  const handleMaximize = () => {
    maximizeApp(appName as keyof typeof useAppState);
  };

  // 크기 조정 시작 처리
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
  };

  // 마우스 이동에 따른 크기 조정
  const handleResizeMove = (e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const { width, height, left, top } = containerRef.current.getBoundingClientRect();

      if (resizeDirection.includes('right')) {
        const newWidth = Math.max(MIN_WIDTH, e.clientX - left);
        setContainerSize((prev) => ({ ...prev, width: newWidth }));
      }

      if (resizeDirection.includes('bottom')) {
        const newHeight = Math.max(MIN_HEIGHT, e.clientY - top);
        setContainerSize((prev) => ({ ...prev, height: newHeight }));
      }

      if (resizeDirection.includes('left')) {
        const newWidth = Math.max(MIN_WIDTH, width - (e.clientX - left));
        setContainerSize((prev) => ({ ...prev, width: newWidth }));
        setPosition((prev) => ({ ...prev, x: prev.x + (width - newWidth) }));
      }

      if (resizeDirection.includes('top')) {
        const newHeight = Math.max(MIN_HEIGHT, height - (e.clientY - top));
        const deltaY = height - newHeight;
        setContainerSize((prev) => ({ ...prev, height: newHeight }));
        setPosition((prev) => ({ ...prev, y: prev.y + deltaY }));
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    setResizeDirection('');
  };

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

    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    } else {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isDragging, isResizing]);

  return (
    <div
      className={`container ${isMinimizing ? 'minimizing' : ''}`} // 애니메이션을 위한 클래스 추가
      style={{
        ...appStyle,
        width: `${containerSize.width}px`,
        height: `${containerSize.height}px`,
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
      <div className="content" ref={containerRef}>
        {children}
      </div>

      {/* 각 모서리와 변에 크기 조절 핸들 추가 */}
      <div className="resize-handle top" onMouseDown={(e) => handleResizeStart(e, 'top')}></div>
      <div className="resize-handle right" onMouseDown={(e) => handleResizeStart(e, 'right')}></div>
      <div className="resize-handle bottom" onMouseDown={(e) => handleResizeStart(e, 'bottom')}></div>
      <div className="resize-handle left" onMouseDown={(e) => handleResizeStart(e, 'left')}></div>
      <div className="resize-handle top-left" onMouseDown={(e) => handleResizeStart(e, 'top-left')}></div>
      <div className="resize-handle top-right" onMouseDown={(e) => handleResizeStart(e, 'top-right')}></div>
      <div className="resize-handle bottom-left" onMouseDown={(e) => handleResizeStart(e, 'bottom-left')}></div>
      <div className="resize-handle bottom-right" onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}></div>
    </div>
  );
};

export default Container;
