import React from 'react';
import StatusBar from './components/common/StatusBar';
import Safari from './components/apps/Safari';
import MusicPlayer from './components/apps/MusicPlayer';
import Dock from './components/common/Dock';
import './App.css';

import { AppStateProvider } from './contexts/AppContext';


const App: React.FC = () => {
  return (
    <AppStateProvider>
      <div className="App">
        <StatusBar />
        <MusicPlayer />
        <Safari />
        <Dock />
      </div>
    </AppStateProvider>
    
  );
};

export default App;
