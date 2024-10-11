import React, { useState, useEffect } from 'react';
import DockItem from './DockItem';
import '../../styles/Dock.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Toast.css';
import { copyToClipboard } from '../../utils/clipboardHelpers';

const imageUrl = `${process.env.REACT_APP_IMAGE_URL}`;

const Dock: React.FC = () => {
  const [activeItems, setActiveItems] = useState({
    finder: true,
    music: true,
    safari: true,
    photos: false,
    messages: false,
    memo: false,
    settings: false,
    share: false,
    bin: false,
  });

  const [dockWidth, setDockWidth] = useState('85%'); // 초기 크기 설정

  useEffect(() => {
    // 브라우저 크기를 감지해서 dock 크기 변경
    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 768) {
        setDockWidth('95%'); // 작은 화면에서는 더 넓게
      } else if (screenWidth >= 1440) {
        setDockWidth('70%'); // 큰 화면에서는 더 좁게
      } else {
        setDockWidth('85%'); // 기본 크기
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 실행

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleItem = (item: keyof typeof activeItems) => {
    if (item === 'finder') return; // finder는 토글되지 않도록
    setActiveItems((prevState) => ({
      ...prevState,
      [item]: !prevState[item], // 클릭된 아이템의 상태를 토글
    }));
  };

  const handleCopy = async () => {
    const isSuccess = await copyToClipboard(window.location.href);

    if (isSuccess) {
      toast.success('링크가 클립보드에 복사되었습니다!', {
        className: 'custom-toast',
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => toggleItem('share'),
      });

      if (!activeItems.share) {
        toggleItem('share');
      }
    } else {
      toast.error('링크 복사에 실패했습니다.', {
        className: 'custom-toast',
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="dock" style={{ width: dockWidth }}>
        <div className="dock-items-left">
          <DockItem
            src={`${imageUrl}/finder.png`}
            alt="Finder"
            isActive={activeItems.finder}
          />
          <DockItem
            src={`${imageUrl}/music.png`}
            alt="Music"
            isActive={activeItems.music}
            onClick={() => toggleItem('music')}
          />
          <DockItem
            src={`${imageUrl}/safari.png`}
            alt="Safari"
            isActive={activeItems.safari}
            onClick={() => toggleItem('safari')}
          />
          <DockItem
            src={`${imageUrl}/photos.png`}
            alt="Photos"
            isActive={activeItems.photos}
            onClick={() => toggleItem('photos')}
          />
          <DockItem
            src={`${imageUrl}/messages.png`}
            alt="Messages"
            isActive={activeItems.messages}
            onClick={() => toggleItem('messages')}
          />
          <DockItem
            src={`${imageUrl}/memo.png`}
            alt="Memo"
            isActive={activeItems.memo}
            onClick={() => toggleItem('memo')}
          />
          <a href="https://github.com/CodingKirby" target="_blank" rel="noopener noreferrer">
            <DockItem src={`${imageUrl}/github.png`} alt="GitHub" />
          </a>
          <a href="https://codingkirby.github.io/" target="_blank" rel="noopener noreferrer">
            <DockItem src={`${imageUrl}/blog.png`} alt="Blog" />
          </a>
          <a href="https://www.notion.so/fa53b7759bd94f0a8005cbd6f9a1ff85" target="_blank" rel="noopener noreferrer">
            <DockItem src={`${imageUrl}/notion.png`} alt="Notion" />
          </a>
          <a href="mailto:codingkirby0@example.com">
            <DockItem src={`${imageUrl}/mail.png`} alt="Email" />
          </a>
          <DockItem
            src={`${imageUrl}/share.png`}
            alt="Share"
            isActive={activeItems.share}
            onClick={handleCopy}
          />
          <DockItem
            src={`${imageUrl}/settings.png`}
            alt="Settings"
            isActive={activeItems.settings}
            onClick={() => toggleItem('settings')}
          />
        </div>

        <div className="dock-items-right">
          <DockItem
            src={`${imageUrl}/bin.png`}
            alt="Bin"
            isActive={activeItems.bin}
            onClick={() => toggleItem('bin')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dock;
