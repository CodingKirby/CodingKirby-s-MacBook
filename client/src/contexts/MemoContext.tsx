import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { Folder, Memo, MemoContextProps } from '../types/MemoTypes';

const MemoContext = createContext<MemoContextProps | undefined>(undefined);

export const MemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number>(1);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [newMemo, setNewMemo] = useState<Memo>({
    title: '새로운 메모',
    content: '작성 중...',
    password: '0000',
    folder_id: selectedFolder,
    date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    id: 0,
  });

  const fetchFoldersAndMemos = async () => {
    try {
      const [foldersResponse, memosResponse] = await Promise.all([
        axios.get('/folders'),
        axios.get('/memos'),
      ]);

      setFolders(foldersResponse.data.folders);

      const formattedMemos = memosResponse.data.memos
        .sort((a: Memo, b: Memo) => b.id - a.id)
        .map((memo: any) => ({
          ...memo,
          date: new Date(memo.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        }));

      setMemos(formattedMemos);
    } catch (error) {
      console.error('Error fetching folders and memos:', error);
    }
  };

  const resetMemoState = () => {
    setSelectedMemo(null);
    setSelectedFolder(1);
    setIsCreating(false);
    setShowPasswordModal(false);
    setShowErrorModal(false);
    setNewMemo({
      title: '',
      content: '',
      password: '',
      folder_id: 1,
      date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      id: 0,
    });
    setMemos(prevMemos => prevMemos.filter(memo => memo.id !== 0));
  };

  const resetMemoCreateState = () => {
    setIsCreating(false);
    setShowPasswordModal(false);
    setShowErrorModal(false);
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== 0));
    setSelectedMemo(null);
    setNewMemo({
      title: '',
      content: '',
      password: '',
      folder_id: selectedFolder,
      date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      id: 0,
    });
  };

  const createMemo = async () => {
    if (!newMemo.title || !newMemo.content || !newMemo.password) {
      setShowErrorModal(true);
      return;
    }
  
    try {
      // newMemo에 현재 선택된 폴더 ID 설정
      const response = await axios.post('/memos', { ...newMemo, folder_id: selectedFolder });
      const createdMemo = {
        ...newMemo,
        id: response.data.memo.id,
        date: new Date(response.data.memo.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      };
      
      resetMemoCreateState();
      // 0번 메모를 새로 생성한 메모로 교체
      setMemos((prevMemos) => [createdMemo, ...prevMemos.filter((memo) => memo.id !== 0)]);
      setSelectedMemo(createdMemo);
      console.log('Memo created:', createdMemo);
    } catch (error) {
      console.error('Error saving memo:', error);
    }
  };
  
  const deleteMemo = async (id: string, password: string) => {
    try {
      await axios.delete(`/memos/${id}`, { data: { password } });
      fetchFoldersAndMemos();
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  };

  return (
    <MemoContext.Provider
      value={{
        folders, memos, selectedMemo, searchQuery, selectedFolder, isCreating, showPasswordModal, showErrorModal, newMemo,
        setFolders, setMemos, setSelectedMemo, setSearchQuery, setSelectedFolder, setIsCreating,
        setShowPasswordModal, setShowErrorModal, setNewMemo,
        fetchFoldersAndMemos, createMemo, deleteMemo, resetMemoState, resetMemoCreateState 
      }}
    >
      {children}
    </MemoContext.Provider>
  );
};

export const useMemoContext = () => {
  const context = useContext(MemoContext);
  if (!context) {
    throw new Error('useMemoContext must be used within a MemoProvider');
  }
  return context;
};
