import React from 'react';
import StatusBar from './components/common/StatusBar';
import Safari from './components/apps/Safari';
import MusicPlayer from './components/apps/MusicPlayer';

import Blog from './components/apps/Blog';
import Mail from './components/apps/Mail';

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
        <Blog />
        <Mail />
        <Dock />
      </div>
    </AppStateProvider>
    
  );
};

export default App;
