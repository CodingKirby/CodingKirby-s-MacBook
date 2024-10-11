import React, { forwardRef } from 'react';

interface DockItemProps {
  src: string;
  alt: string;
  isActive?: boolean;
  isHidden?: boolean;
  onClick?: () => void;
  id?: string;
}

const DockItem = forwardRef<HTMLDivElement, DockItemProps>(
  ({ src, alt, isActive = false, isHidden = false, onClick }, ref) => {
    // isHidden이 true일 경우 아이템을 렌더링하지 않음
    if (isHidden) return null;

    return (
      <div className="dock-item" onClick={onClick} ref={ref}>
        <img src={src} alt={alt} />
          <div
            className="active-indicator"
            style={{
              opacity: isActive ? 1 : 0, // isActive 상태에 따라 인디케이터를 표시
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
            }}
          ></div>
      </div>
    );
  }
);

export default DockItem;
