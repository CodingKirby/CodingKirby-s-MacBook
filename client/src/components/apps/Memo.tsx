import React, { useState } from 'react';
import { useAppState } from '../../contexts/AppContext';

import '../../styles/Memo.css';
import Container from '../common/Container';
import { Search, Trash2, Type, AlignLeft, Grid, Share } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
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
    { id: '2', name: '메모' },
    { id: '3', name: '공부' },
    { id: '4', name: '아이디어' },
    { id: '5', name: '스케치' },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: '파스타 레시피', content: '1. 마늘, 올리브유 볶기\n2. 파스타 넣기\n...', date: '24. 10. 14.', folderId: '1' },
    { id: '2', title: '책 읽기', content: '읽을 책 목록 정리', date: '24. 10. 13.', folderId: '2' },
    { id: '3', title: '프로그래밍 공부', content: 'React, TypeScript 공부 기록', date: '24. 10. 12.', folderId: '3' },
  ]);

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('1');

  // 앱 상태 가져오기
  const memoAppState = apps['memo'];
  const isRunning = memoAppState.isRunning;
  const isMinimized = memoAppState.isMinimized;

  // 앱이 실행 중이 아닌 경우나 최소화된 경우에는 렌더링하지 않음
  if (!isRunning || isMinimized) return null;

  // Memo filtering based on folder and search query
  const filteredNotes = notes.filter(note =>
    note.folderId === selectedFolder &&
    (note.title.includes(searchQuery) || note.content.includes(searchQuery))
  );

  return (
    <Container title="Memo" appName="memo">
      <div className="memo-container">
        {/* Left Column - Folders */}
        <div className="folder-list">
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

        {/* Middle Column - Notes List */}
        <div className="notes-list">
          <div className="search-input">
            <Input
              type="text"
              placeholder="모든 메모 검색"
              className="w-full"
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

        {/* Right Column - Note Content */}
        <div className="note-content">
          {selectedNote && (
            <>
              <div className="note-tools">
                <div>
                  <Button variant="ghost" size="icon"><Type className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><AlignLeft className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Grid className="h-4 w-4" /></Button>
                </div>
                <div>
                  <Button variant="ghost" size="icon"><Share className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
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
