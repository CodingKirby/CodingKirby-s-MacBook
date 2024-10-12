import React, { useEffect, useState } from 'react';
import DockItem from './DockItem';
import '../../styles/Dock.css';
import { useAppState } from '../../contexts/AppContext';

const imgUrl = process.env.REACT_APP_IMAGE_URL;

const Dock: React.FC = () => {
  const { apps, openApp, maximizeApp } = useAppState();
  const [hiddenItems, setHiddenItems] = useState<string[]>([]); 
  const [dockWidth, setDockWidth] = useState(window.innerWidth);

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
    
    if (appState.isRunning) {
      maximizeApp(appName as keyof typeof apps);
    }
    else {
      openApp(appName as keyof typeof apps);
    }
  };

  return (
    <div className="dock">
      <div className="dock-left">
        {dockItems.map((item) => (
          !hiddenItems.includes(item.name) && (
            <DockItem
              key={item.name}
              icon={item.icon}
              isActive={apps[item.name as keyof typeof apps].isRunning}
              isHidden={hiddenItems.includes(item.name)}
              onClick={() => handleAppOpen(item.name)}
            />
          )
        ))}
      </div>
      <div className="dock-left-end">
        <DockItem
          icon={`${imgUrl}/launchpad.png`}
          isActive={false}
          isHidden={false}
          onClick={() => console.log('Launchpad clicked')}
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
  );
};

export default Dock;
