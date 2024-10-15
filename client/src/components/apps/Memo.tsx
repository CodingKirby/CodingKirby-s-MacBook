import React, { useState } from 'react';
import { useAppState } from '../../contexts/AppContext';

import '../../styles/Memo.css';
import Container from '../common/Container';
import { Trash2, Type, AlignLeft, Grid, Share, PenBox } from 'lucide-react';
import { ScrollArea } from '../common/ScrollArea';

// Define Folder and Note interfaces
interface Folder {
  id: string;
  name: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  folderId: string;
}

const Memo: React.FC = () => {
  const { apps } = useAppState();

  // Initialize state hooks at the top level
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: '모든 iCloud 메모' },
    { id: '2', name: '응원해요' },
    { id: '3', name: '피드백' }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non.Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris sit amet massa. Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Mi eget mauris pharetra et. Non tellus orci ac auctor augue. Elit at imperdiet dui accumsan sit. Ornare arcu dui vivamus arcu felis. Egestas integer eget aliquet nibh praesent. In hac habitasse platea dictumst quisque sagittis purus. Pulvinar elementum integer enim neque volutpat ac.', content: 'Senectus et netus et malesuada. Nunc pulvinar sapien et ligula ullamcorper malesuada proin. Neque convallis a cras semper auctor. Libero id faucibus nisl tincidunt eget. Leo a diam sollicitudin tempor id. A lacus vestibulum sed arcu non odio euismod lacinia. In tellus integer feugiat scelerisque. Feugiat in fermentum posuere urna nec tincidunt praesent. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nisi scelerisque eu ultrices vitae auctor eu augue ut lectus. Ipsum faucibus vitae aliquet nec ullamcorper sit amet risus. Et malesuada fames ac turpis egestas sed. Sit amet nisl suscipit adipiscing bibendum est ultricies. Arcu ac tortor dignissim convallis aenean et tortor at. Pretium viverra suspendisse potenti nullam ac tortor vitae purus. Eros donec ac odio tempor orci dapibus ultrices. Elementum nibh tellus molestie nunc. Et magnis dis parturient montes nascetur. Est placerat in egestas erat imperdiet. Consequat interdum varius sit amet mattis vulputate enim.', date: '24. 10. 14.', folderId: '1' },
    { id: '2', title: 'Lorem ipsum dolor sit amet,', content: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '24. 10. 14.', folderId: '1' },
    { id: '3', title: 'Lorem ipsum dolor sit amet,', content: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '24. 10. 14.', folderId: '1' },
    { id: '4', title: 'Lorem ipsum dolor sit amet,', content: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '24. 10. 14.', folderId: '1' },
    { id: '5', title: 'Lorem ipsum dolor sit amet,', content: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', date: '24. 10. 14.', folderId: '1' },
    { id: '6', title: '잘 보고 가요~', content: '멋져요^^', date: '24. 10. 13.', folderId: '2' },
    { id: '7', title: '피드백', content: '사진 앱이랑 메시지 앱은 안되나요?? 🤔', date: '24. 10. 12.', folderId: '3' },
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('1');
  const [isScrolled, setIsScrolled] = useState(false); // Scroll state

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 50);
  };

  // 앱 상태 가져오기
  const memoAppState = apps['memo'];
  const isRunning = memoAppState.isRunning;
  const isMinimized = memoAppState.isMinimized;

  // 앱이 실행 중이 아닌 경우나 최소화된 경우에는 렌더링하지 않음
  if (!isRunning || isMinimized) return null;

  // Memo filtering based on folder and search query
  const filteredNotes = notes.filter(note => 
    (selectedFolder === '1' || note.folderId === selectedFolder) && // Show all notes if "모든 iCloud 메모" is selected
    (note.title.includes(searchQuery) || note.content.includes(searchQuery)) // Filter by search query
  );

  return (
    <Container title="Memo" appName="memo">
      <div className="memo-container">
        {/* Left Column - Folders */}
        <div className="folder-list">
          <i className="fa-brands fa-apple"></i>
          <h2>iCloud 메모</h2>
          {folders.map(folder => (
            <div
              key={folder.id}
              className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
              onClick={() => setSelectedFolder(folder.id)}
            >
              {folder.name}
            </div>
          ))}
        </div>

        <div className="notes-list">
          <div className="search-input">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="모든 메모 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[calc(100vh-60px)]">
            {filteredNotes.length === 0 ? (
              <p className="no-notes">검색 결과가 없습니다.</p>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`note-item ${selectedNote?.id === note.id ? 'active' : ''}`}
                  onClick={() => setSelectedNote(note)}
                >
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-date">{note.date}</p>
                  <p className="note-content">{note.content}</p>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        <div className="note-content" onScroll={handleScroll}>
          {selectedNote && (
            <>
              <div className={`note-tools ${isScrolled ? 'scrolled' : ''}`}>
                <div>
                  <button><Trash2 className='icon'/></button>
                </div>
                <div>
                  <button><Type className='icon'/></button>
                  <button><AlignLeft className='icon'/></button>
                  <button><Grid className='icon'/></button>
                </div>
                <div>
                  <button><Share className='icon'/></button>
                  <button><PenBox className='icon'/></button>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">{selectedNote.title}</h2>
              <p className="whitespace-pre-wrap">{selectedNote.content}</p>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Memo;
