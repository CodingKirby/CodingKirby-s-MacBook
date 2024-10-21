import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from '../../contexts/AppContext';
import { FolderListProps, SearchInputProps, MemoItemProps } from '../../types/MemoTypes';
import { useMemoContext } from '../../contexts/MemoContext';
import '../../styles/Memo.css';

import Container from '../common/Container';
import Modal from '../common/Modal';
import { ScrollArea } from '../common/ScrollArea';
import { Trash2, Type, AlignLeft, Grid, Share, PenBox } from 'lucide-react';

import SearchInput from './memo/SearchInput';


const Memo: React.FC = () => {
  const { apps, closeApp } = useAppState();
  const {
    memos, folders, selectedFolder, selectedMemo, searchQuery,
    isCreating, newMemo, showPasswordModal, showErrorModal,
    setSearchQuery, setSelectedFolder, setMemos, setSelectedMemo, 
    setIsCreating, setNewMemo, setShowPasswordModal, setShowErrorModal,
    fetchFoldersAndMemos, createMemo, resetMemoState, resetMemoCreateState
  } = useMemoContext();

  const memoAppState = apps['memo'];
  const isRunning = memoAppState.isRunning;
  const isMinimized = memoAppState.isMinimized;
  const [isScrolled, setIsScrolled] = useState(false);

  // 앱 상태 변경 시 처리
  useEffect(() => {
    handleAppStateChange();
  }, [isRunning, isMinimized]);

  // 폴더 변경 시 처리
  useEffect(() => {
    if (isCreating) {
      // 폴더 변경 시 새로운 메모의 folder_id 업데이트
      setNewMemo({ ...newMemo, folder_id: selectedFolder });
    }
    fetchFoldersAndSetMemoOnFolderChange();
  }, [selectedFolder]);

  const handleAppStateChange = () => {
    if (!isRunning) resetMemoState();
    if (isRunning && !isMinimized) {
      fetchFoldersAndSetFirstMemo();
      fetchFoldersAndSetSelectedMemo();
    }
  };

  const handleClose = () => {
    closeApp('memo'); // 앱을 닫는 로직 실행
  };

  const fetchFoldersAndSetFirstMemo = async () => {
    await fetchFoldersAndMemos();
    setFirstMemoForSelectedFolder();
  };

  const setFirstMemoForSelectedFolder = () => {
    const folderMemos = filterMemosByFolder(selectedFolder);
    setSelectedMemo(folderMemos.length ? folderMemos[0] : null);
  };

  const fetchFoldersAndSetSelectedMemo = async () => {
    await fetchFoldersAndMemos();
    selectMemoIfExists();
  };

  const selectMemoIfExists = () => {
    const selectedMemoId = memos.find(memo => memo.id === selectedMemo?.id);
    if (selectedMemoId) setSelectedMemo(selectedMemoId);
  };

  const fetchFoldersAndSetMemoOnFolderChange = async () => {
    await fetchFoldersAndMemos();
    updateMemoOnFolderChange();
  };

  const updateMemoOnFolderChange = () => {
    const folderMemos = filterMemosByFolder(selectedFolder);
    if (!isCreating) {
      setSelectedMemo(folderMemos.length ? folderMemos[0] : null);
    } else {
      setNewMemoAndSelect();
    }
  };

  const filterMemosByFolder = (folderId: number) =>
    folderId === 1 ? memos : memos.filter(memo => memo.folder_id === folderId);

  const setNewMemoAndSelect = () => {
    const tempMemo = { ...newMemo, folder_id: selectedFolder };
    updateMemosWithNewMemo(tempMemo);
  };

  const updateMemosWithNewMemo = (tempMemo: any) => {
    setMemos([tempMemo, ...memos.filter(memo => memo.id !== newMemo.id)]);
    setSelectedMemo(tempMemo);
  };

  const handleResetMemo = () => {
    resetMemoCreateState();
    setSelectedMemo(
      memos.find(memo => memo.id !== 0 && memo.folder_id === selectedFolder) || null
    );
  };

  useEffect(() => {
    console.log('Memos updated:', memos);
  }, [memos]); // This runs when `memos` is updated

  const handleCreateMemo = async () => {
    await createMemo();
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => setIsScrolled(event.currentTarget.scrollTop > 50);

  const matchesSearchQuery = (memo: any) =>
    (memo.title?.includes(searchQuery) || '') || (memo.content?.includes(searchQuery) || '');

  const filteredMemos = memos.filter((memo) => {
    // 1. 폴더가 1번일 때는 모든 메모를 보여줌
    const isInSelectedFolder = selectedFolder === 1 || memo.folder_id === selectedFolder;
  
    // 2. 검색어가 있으면 검색어에 맞는 메모만 필터링
    const matchesSearchQuery = (memo.title?.includes(searchQuery) || '') || (memo.content?.includes(searchQuery) || '');
  
    // 3. 폴더와 검색 조건 모두 만족하는 메모만 반환
    return isInSelectedFolder && matchesSearchQuery;
  });  

  const FolderList: React.FC<FolderListProps> = ({ folders, selectedFolder, setSelectedFolder }) => (
    <div className="folder-list">
      <i className="fa-brands fa-apple"></i>
      <h2>iCloud 메모</h2>
      {folders.length === 0 ? (
        <p>폴더가 없습니다</p>
      ) : (
        folders.map(folder => (
          <div
            key={folder.id}
            className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
            onClick={() => setSelectedFolder(folder.id)}
          >
            {folder.title}
          </div>
        ))
      )}
    </div>
  );
  
  const MemoItem: React.FC<MemoItemProps> = ({ memo, isActive, setSelectedMemo, folders }) => {
    const folderName = folders.find(folder => folder.id === memo.folder_id)?.title || 'Unknown Folder';
    return (
      <div className={`memo-item ${isActive ? 'active' : ''}`} onClick={() => setSelectedMemo(memo)}>
        <h3 className="memo-title">{memo.title}</h3>
        <p className="memo-date">{memo.date}</p>
        <p className="memo-content">{memo.content}</p>
        <p className="memo-content">
          <i className="fa-solid fa-folder"></i>
          {folderName}
        </p>
      </div>
    );
  };

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
                  memo={memo} 
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
