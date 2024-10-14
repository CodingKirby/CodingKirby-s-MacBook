import React from 'react';
import StatusBar from './components/common/StatusBar';
import Safari from './components/apps/Safari';
import MusicPlayer from './components/apps/MusicPlayer';

import Memo from './components/apps/Memo';
import Blog from './components/apps/Blog';
import Mail from './components/apps/Mail';

import Dock from './components/common/Dock';
import './App.css';

import { AppStateProvider } from './contexts/AppContext';
import { MusicProvider } from './contexts/MusicContext';

const App: React.FC = () => {
  return (
    <AppStateProvider>
      <MusicProvider>
        <div className="App">
          <StatusBar />
          <MusicPlayer />
          <Safari />
          <Memo />
          <Blog />
          <Mail />
          <Dock />
        </div>
      </MusicProvider>
      
    </AppStateProvider>
    
  );
};

export default App;
