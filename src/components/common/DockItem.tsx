import React from 'react';

interface DockItemProps {
  src: string;
  alt: string;
  isActive?: boolean;
  onClick?: () => void;
}

const DockItem: React.FC<DockItemProps> = ({ src, alt, isActive = false, onClick }) => {
  return (
    <div className="dock-item" onClick={onClick}>
      <img src={src} alt={alt} />
      <div
        className="active-indicator"
        style={{
          opacity: isActive ? 1 : 0, // 활성화 상태에 따라 indicator 표시
          backgroundColor: isActive ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
        }}
      ></div>
    </div>
  );
};

export default DockItem;
