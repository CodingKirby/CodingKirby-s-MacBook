import React from 'react';
import StatusBar from './components/common/StatusBar';
import Safari from './components/apps/Safari';
import MusicPlayer from './components/apps/MusicPlayer';
import Dock from './components/common/Dock';
import './App.css';


const App: React.FC = () => {
  return (
    <div className="App">
      <StatusBar />
      <MusicPlayer />
      <Dock />
    </div>
  );
};

export default App;
