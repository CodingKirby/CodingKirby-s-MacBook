import React, { useEffect, useRef, useState } from 'react';

export const MusicPlayer: React.FC = () => {
  const imageUrl = `${process.env.REACT_APP_IMAGE_URL}`;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const musicIndicator = useRef<HTMLDivElement>(null);
  const backgroundMusic = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (backgroundMusic.current) {
      if (backgroundMusic.current.paused) {
        backgroundMusic.current.play();
        if (musicIndicator.current) musicIndicator.current.style.opacity = '1';
      } else {
        backgroundMusic.current.pause();
        if (musicIndicator.current) musicIndicator.current.style.opacity = '0';
      }
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const musicDockItem = document.querySelector('.dock-item img[src="./img/music.png"]')?.parentElement;

    const handleFirstClick = (e: MouseEvent) => {
      if (!musicDockItem?.contains(e.target as Node)) {
        toggleMusic();
      }
      document.body.removeEventListener('click', handleFirstClick);
    };

    document.body.addEventListener('click', handleFirstClick);

    if (musicDockItem) {
      musicDockItem.addEventListener('click', toggleMusic);
    }

    return () => {
      document.body.removeEventListener('click', handleFirstClick);
      musicDockItem?.removeEventListener('click', toggleMusic);
    };
  }, []);

  return (
    <>
      <div id="music-indicator" ref={musicIndicator} style={{ opacity: 0 }} />
      <audio ref={backgroundMusic} loop>
        <source src="./mp3/1.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
};
