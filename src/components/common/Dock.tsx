import React, { useEffect, useState } from 'react';
import DockItem from './DockItem';
import '../../styles/Dock.css';
import { useAppState } from '../../contexts/AppContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Toast.css';

const imgUrl = process.env.REACT_APP_IMAGE_URL;

const Dock: React.FC = () => {
  const { apps, openApp, maximizeApp } = useAppState();
  const [hiddenItems, setHiddenItems] = useState<string[]>([]); 
  const [dockWidth, setDockWidth] = useState(window.innerWidth);
  const [isLaunchpadOpen, setIsLaunchpadOpen] = useState(false); // 모달 상태 관리
  const [isSharing, setIsSharing] = useState(false); // share 앱의 인디케이터 상태 관리

  const dockItems = [
    { name: 'finder', icon: `${imgUrl}/finder.png` },
    { name: 'music', icon: `${imgUrl}/music.png` },
    { name: 'safari', icon: `${imgUrl}/safari.png` },
    { name: 'photos', icon: `${imgUrl}/photos.png` },
    { name: 'messages', icon: `${imgUrl}/messages.png` },
    { name: 'memo', icon: `${imgUrl}/memo.png` },
    { name: 'github', icon: `${imgUrl}/github.png` },
    { name: 'blog', icon: `${imgUrl}/blog.png` },
    { name: 'notion', icon: `${imgUrl}/notion.png` },
    { name: 'mail', icon: `${imgUrl}/mail.png` },
    { name: 'share', icon: `${imgUrl}/share.png` },
    { name: 'settings', icon: `${imgUrl}/settings.png` },
  ];

  useEffect(() => {
    const handleResize = () => {
      setDockWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const availableWidth = dockWidth - 300;
    const maxItems = Math.floor(availableWidth / 100);

    if (dockItems.length > maxItems) {
      const hidden = dockItems.slice(maxItems).map(item => item.name);
      setHiddenItems(hidden);
    } else {
      setHiddenItems([]);
    }
  }, [dockWidth]);

  const handleAppOpen = (appName: string) => {
    const appState = apps[appName as keyof typeof apps];

    if (appName === 'share') {
      // share 앱 클릭 시 Toast 메시지 표시
      navigator.clipboard.writeText(window.location.href);
      setIsSharing(true); // Toast 표시 시 인디케이터 활성화

      const toastId = toast.info('링크가 복사되었습니다!', {
        className: 'custom-toast', // 커스텀 클래스 적용
        progressClassName: 'custom-toast-progress', // 커스텀 클래스 적용
        onClose: () => setIsSharing(false), // Toast가 닫힐 때 인디케이터 비활성화
      });
    } else if (appState.isRunning) {
      maximizeApp(appName as keyof typeof apps);
    } else {
      openApp(appName as keyof typeof apps);
    }
  };

  const handleLaunchpadClick = () => {
    setIsLaunchpadOpen(!isLaunchpadOpen); // Launchpad 버튼 클릭 시 모달 열고 닫기
  };

  const closeLaunchpad = () => {
    setIsLaunchpadOpen(false); // 모달 닫기
  };

  // 모달 외부 클릭 시 모달을 닫음
  const handleOutsideClick = (e: React.MouseEvent) => {
    const target = e.target as Element;
    if (target.classList.contains('launchpad-modal')) {
      closeLaunchpad();
    }
  };

  // Launchpad 내에서의 share 앱 상태를 따로 관리
  const getLaunchpadAppState = (appName: string) => {
    if (appName === 'share') {
      return isSharing; // share 앱의 경우 인디케이터는 isSharing 상태에 따름
    }
    return apps[appName as keyof typeof apps].isRunning;
  };

  return (
    <div>
      <ToastContainer 
        position="top-right" 
        autoClose={1200} 
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="dock">
        <div className="dock-left">
          {dockItems.map((item) => (
            !hiddenItems.includes(item.name) && (
              <DockItem
                key={item.name}
                icon={item.icon}
                // share 앱에만 isSharing 적용
                isActive={item.name === 'share' ? isSharing : apps[item.name as keyof typeof apps].isRunning}
                isHidden={hiddenItems.includes(item.name)}
                onClick={() => handleAppOpen(item.name)}
              />
            )
          ))}
        </div>
        <div className="dock-left-end">
          <DockItem
            icon={`${imgUrl}/launchpad.png`}
            isActive={isLaunchpadOpen} // Launchpad 열렸을 때만 인디케이터 활성화
            isHidden={false}
            onClick={handleLaunchpadClick} // Launchpad 클릭 시 모달 열기
          />
        </div>
        <div className="dock-right">
          <DockItem
            icon={`${imgUrl}/bin.png`}
            isActive={false}
            isHidden={false}
            onClick={() => console.log('Bin clicked')}
          />
        </div>
      </div>

      {/* Launchpad 모달 */}
      {isLaunchpadOpen && (
        <div className="launchpad-modal" onClick={handleOutsideClick}>
          <div className="launchpad-content">
            <div className="hidden-apps">
              {hiddenItems.map((hiddenItem) => (
                <DockItem
                  key={hiddenItem}
                  icon={dockItems.find(item => item.name === hiddenItem)?.icon || ''}
                  isActive={getLaunchpadAppState(hiddenItem)} // Launchpad 내 숨겨진 앱의 인디케이터만 표시
                  isHidden={false}
                  onClick={() => handleAppOpen(hiddenItem)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dock;
