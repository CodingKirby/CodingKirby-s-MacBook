import React, { useState, useEffect, useCallback, useRef } from 'react';
import DockItem from './DockItem';
import '../../styles/Dock.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/Toast.css';
import { copyToClipboard } from '../../utils/clipboardHelpers';

const imageUrl = `${process.env.REACT_APP_IMAGE_URL}`;

const Dock: React.FC = () => {
  const dockRef = useRef<HTMLDivElement>(null);
  const dockItemsLeftRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // State to manage which items are active (not hidden)
  const [activeItems, setActiveItems] = useState({
    finder: true,
    music: true,
    safari: true,
    photos: false,
    messages: false,
    memo: false,
    github: false,
    blog: false,
    notion: false,
    mail: false,
    share: false,
    settings: false,
    bin: false
  });

  const [dockWidth, setDockWidth] = useState('85%');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dockItems = [
    { name: 'finder', src: `${imageUrl}/finder.png`, alwaysActive: true },
    { name: 'music', src: `${imageUrl}/music.png` },
    { name: 'safari', src: `${imageUrl}/safari.png` },
    { name: 'photos', src: `${imageUrl}/photos.png` },
    { name: 'messages', src: `${imageUrl}/messages.png` },
    { name: 'memo', src: `${imageUrl}/memo.png` },
    { name: 'github', src: `${imageUrl}/github.png`, link: 'https://github.com/CodingKirby' },
    { name: 'blog', src: `${imageUrl}/blog.png`, link: 'https://codingkirby.github.io/' },
    { name: 'notion', src: `${imageUrl}/notion.png`, link: 'https://www.notion.so/fa53b7759bd94f0a8005cbd6f9a1ff85' },
    { name: 'mail', src: `${imageUrl}/mail.png`, link: 'mailto:codingkirby0@example.com' },
    { name: 'share', src: `${imageUrl}/share.png`, action: 'copy' },
    { name: 'settings', src: `${imageUrl}/settings.png` },
  ];

  const handleResize = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      setDockWidth('95%');
    } else if (screenWidth >= 1440) {
      setDockWidth('70%');
    } else {
      setDockWidth('85%');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const toggleItem = (item: keyof typeof activeItems) => {
    if (item === 'finder') return; // Prevent toggling finder
    setActiveItems((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
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
        onClose: () => toggleItem('share'),
      });
      toggleItem('share');
    } else {
      toast.error('링크 복사에 실패했습니다.', {
        className: 'custom-toast',
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
      });
    }
  };

  const toggleModal = () => {
    setIsModalOpen((prevState) => !prevState);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Update visibility of items based on scroll and resize
  const updateVisibleItems = () => {
    if (dockItemsLeftRef.current) {
      const dockLeftRect = dockItemsLeftRef.current.getBoundingClientRect();
  
      dockItems.forEach((item) => {
        const itemRef = itemRefs.current[item.name];
        if (itemRef && item.name !== 'finder') {
          const itemRect = itemRef.getBoundingClientRect();
          const isVisible = (itemRect.right - 1) < dockLeftRect.right;
  
          if (isVisible && itemRef.style.visibility !== 'visible') {
            itemRef.style.visibility = 'visible';
          } else if (!isVisible && itemRef.style.visibility !== 'hidden') {
            itemRef.style.visibility = 'hidden';
          }
        }
      });
    }
  };
  

  useEffect(() => {
    updateVisibleItems();
    window.addEventListener('scroll', updateVisibleItems);
    window.addEventListener('resize', updateVisibleItems);
    return () => {
      window.removeEventListener('scroll', updateVisibleItems);
      window.removeEventListener('resize', updateVisibleItems);
    };
  }, [activeItems]);

  return (
    <div>
      <ToastContainer />
      <div ref={dockRef} className="dock" style={{ width: dockWidth }}>
        <div ref={dockItemsLeftRef} className="dock-items-left">
          {dockItems.map((item) => (
            <DockItem
              key={item.name}
              id={item.name}
              src={item.src}
              alt={item.name}
              isActive={activeItems[item.name as keyof typeof activeItems] ?? false}
              isHidden={false}
              onClick={item.action === 'copy' ? handleCopy : () => toggleItem(item.name as keyof typeof activeItems)}
              ref={(el) => (itemRefs.current[item.name] = el)}
            />
            
          ))}
        </div>
        <div className="dock-items-left-end">
          <DockItem
            src={`${imageUrl}/launchpad.png`}
            alt="Launchpad"
            onClick={toggleModal}
          />
        </div>
        <div className="dock-items-right">
          <DockItem
            src={`${imageUrl}/bin.png`}
            alt="Bin"
            isActive={activeItems.bin}
            onClick={() => toggleItem('bin')}
            ref={(el) => (itemRefs.current['bin'] = el)}
          />
        </div>
      </div>

      {/* Modal for hidden items */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="hidden-items">
              {dockItems
                .filter((item) => itemRefs.current[item.name]?.style.visibility === 'hidden' && item.name !== 'finder')
                .map((item) => (
                  <DockItem
                    key={item.name}
                    id={item.name}
                    src={item.src}
                    alt={item.name}
                    isActive={activeItems[item.name as keyof typeof activeItems] ?? false}
                    onClick={() => toggleItem(item.name as keyof typeof activeItems)}
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
