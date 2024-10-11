import React from 'react';
import { EnvProvider } from './contexts/EnvContext';
import StatusBar from './components/common/StatusBar';
import Safari from './components/apps/Safari';
import { MusicPlayer } from './components/apps/MusicPlayer';
import Dock from './components/common/Dock';
import './App.css';

const imageUrl = `${process.env.REACT_APP_IMAGE_URL}`;
const mp3Url = `${process.env.REACT_APP_MUSIC_URL}`;

const App: React.FC = () => {
  return (
    <EnvProvider>
      <div className="App">
        <audio id="background-music" autoPlay loop>
          <source src={`${mp3Url}/1.mp3`} type="audio/mp3" />
        </audio>
        <StatusBar />
        <Safari />
        <MusicPlayer />
        <Dock />
      </div>
    </EnvProvider>
  );
};

export default App;
