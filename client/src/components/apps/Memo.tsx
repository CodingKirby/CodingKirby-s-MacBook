import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../contexts/AppContext';
import { useMemoContext } from '../../contexts/MemoContext';
import '../../styles/Memo.css';

import Container from '../common/Container';
import Modal from '../common/Modal';
import { ScrollArea } from '../common/ScrollArea';
import { Trash2, Type, AlignLeft, Grid, Share, PenBox } from 'lucide-react';

import SearchInput from './memo/SearchInput';
import FolderList from './memo/FolderList';
import MemoItem from './memo/MemoItem';


const Memo: React.FC = () => {
  const { apps } = useAppState();
  const {
    memos, folders, selectedFolder, selectedMemo, searchQuery,
    isCreating, newMemo, showPasswordModal, showErrorModal,
    setSearchQuery, setSelectedFolder, setMemos, setSelectedMemo, 
    setIsCreating, setNewMemo, setShowPasswordModal, setShowErrorModal,
    createMemo, resetMemoState, resetMemoCreateState,

    filteredMemos, fetchFoldersAndSetFirstMemo, fetchFoldersAndSetSelectedMemo

  } = useMemoContext();

  const memoAppState = apps['memo'];
  const isRunning = memoAppState.isRunning;
  const isMinimized = memoAppState.isMinimized;
  const [isScrolled, setIsScrolled] = useState(false);

  // 앱 상태 변경 시 처리
  useEffect(() => {
    handleAppStateChange();
  }, [isRunning, isMinimized]);

  useEffect(() => {
    if (isCreating) {
      // 폴더 변경 시 새로운 폴더 ID를 반영하여 임시 메모를 생성
      setNewMemo((prev) => ({ ...prev, folder_id: selectedFolder }));
    }
  }, [selectedFolder, isCreating]);  

  const handleAppStateChange = () => {
    if (!isRunning) resetMemoState();
    if (isRunning && !isMinimized) {
      fetchFoldersAndSetFirstMemo();
      fetchFoldersAndSetSelectedMemo();
    }
  };

  const handleResetMemo = () => {
    resetMemoCreateState();
    setSelectedMemo(
      memos.find(memo => memo.id !== 0 && memo.folder_id === selectedFolder) || null
    );
  };
  
  const handleCreateMemo = async () => {
    await createMemo();
  };
  
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => setIsScrolled(event.currentTarget.scrollTop > 50);

  // 앱이 실행 중이지 않거나 최소화된 경우에는 렌더링하지 않음
  if (!isRunning || isMinimized) return null;

  return (
    <Container title="Memo" appName="memo">
      <div className="memo-container">
        <FolderList folders={folders} selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}/>

        <div className="notes-list">
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <ScrollArea className="h-[calc(100vh-60px)]">
            {filteredMemos.length === 0 ? (
              <p className="no-notes">검색 결과가 없습니다.</p>
            ) : (
              filteredMemos.map(memo => (
                <MemoItem 
                  key={memo.id}
                  memo={{
                    ...memo,
                    title: memo.title || '새로운 메모',
                    content: memo.content || '작성 중...'
                  }} 
                  isActive={selectedMemo?.id === memo.id} 
                  setSelectedMemo={setSelectedMemo} 
                  folders={folders} 
                />
              ))
            )}
          </ScrollArea>
        </div>

        <div className="memo-content" onScroll={handleScroll}>
        <div className={`memo-tools ${isScrolled ? 'scrolled' : ''}`}
        style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
            {isCreating ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <button onClick={handleResetMemo}>
                  <i className="fa-solid fa-delete-left" style={{ fontSize: '1.2rem', color: '#edbb4d' }}></i>
                </button>
                <button onClick={() => {
                  if (!newMemo.title || !newMemo.content) {
                    setShowErrorModal(true);
                  } else {
                    setShowPasswordModal(true);
                  }
                }} style={{ marginLeft: 'auto' }}>
                  <i className="fa-solid fa-check" style={{ fontSize: '1.2rem', color: newMemo.title && newMemo.content ? '#edbb4d' : 'gray' }}></i>
                </button>
              </div>
            ) : (
              <>
                <div><button><Trash2 className='icon' /></button></div>
                <div className='center-tools'>
                  <button><Type className='icon' /></button>
                  <button><AlignLeft className='icon' /></button>
                  <button><Grid className='icon' /></button>
                </div>
                <div>
                  <button><Share className='icon' /></button>
                  <button onClick={() => {
                    setIsCreating(true);
                    const tempMemo = { id: 0, title: '새로운 메모', content: '작성 중...', date: new Date().toLocaleString(), folder_id: selectedFolder };
                    setMemos([tempMemo, ...memos]);
                    setSelectedMemo(tempMemo);
                  }}>
                    <PenBox className='icon' />
                  </button>
                </div>
              </>
            )}
          </div>

          {isCreating ? (
            <div>
              <input type="text" placeholder="닉네임이나 제목을 입력해주세요" value={newMemo.title}
              onChange={(e) => setNewMemo({ ...newMemo, title: e.target.value })}
              className='create-memo-title' />
              <textarea placeholder="메모 내용을 입력하세요." value={newMemo.content}
              onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
              className='create-memo-content' />
              
              {showPasswordModal && (
                <Modal title="비밀번호 입력" onClose={() => setShowPasswordModal(false)}>
                  <input type="password" placeholder="삭제 시 이용할 비밀번호를 입력해주세요" value={newMemo.password} onChange={(e) => setNewMemo({ ...newMemo, password: e.target.value })} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleCreateMemo}>확인</button>
                    <button onClick={() => setShowPasswordModal(false)}>취소</button>
                  </div>
                </Modal>
              )}

              {showErrorModal && (
                <Modal title="에러" onClose={() => setShowErrorModal(false)}>
                  <p>제목과 내용을 입력해 주세요</p>
                  <button onClick={() => setShowErrorModal(false)}>확인</button>
                </Modal>
              )}
            </div>
          ) : (
            selectedMemo && (
              <>
                <h2 className="text-2xl font-bold mb-4">{selectedMemo.title}</h2>
                <p className="whitespace-pre-wrap">{selectedMemo.content}</p>
              </>
            )
          )}
        </div>
      </div>
    </Container>
  );
};

export default Memo;
