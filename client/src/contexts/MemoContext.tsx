import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

  // 폴더 및 메모 불러오기
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

  // 메모 상태 초기화
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
    setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== 0));
  };

  // 새 메모 생성 상태 초기화
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

  // 새 메모 생성
  const createMemo = async () => {
    if (!newMemo.title || !newMemo.content || !newMemo.password) {
      setShowErrorModal(true);
      return;
    }
    try {
      const response = await axios.post('/memos', { ...newMemo, folder_id: selectedFolder });
      const createdMemo = {
        ...newMemo,
        id: response.data.memo.id,
        date: new Date(response.data.memo.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      };
      resetMemoCreateState();
      setMemos((prevMemos) => [createdMemo, ...prevMemos.filter((memo) => memo.id !== 0)]);
      setSelectedMemo(createdMemo);
      console.log('Memo created:', createdMemo);
    } catch (error) {
      console.error('Error saving memo:', error);
    }
  };

  // 메모 삭제
  const deleteMemo = async (id: string, password: string) => {
    try {
      await axios.delete(`/memos/${id}`, { data: { password } });
      fetchFoldersAndMemos();
    } catch (error) {
      console.error('Error deleting memo:', error);
    }
  };

  // 폴더 변경 시 처리
  useEffect(() => {
    if (isCreating) {
      setNewMemo({ ...newMemo, folder_id: selectedFolder });
    }
    fetchFoldersAndSetMemoOnFolderChange();
  }, [selectedFolder]);

  // 메모 편집 중 리스트 동기화
  useEffect(() => {
    if (selectedMemo && selectedMemo.id === newMemo.id) {
      setMemos((prevMemos) =>
        prevMemos.map((memo) => (memo.id === newMemo.id ? { ...memo, ...newMemo } : memo))
      );
    }
  }, [newMemo, selectedMemo, setMemos]);

  // 폴더와 메모 변경 처리
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
    const selectedMemoId = memos.find((memo) => memo.id === selectedMemo?.id);
    if (selectedMemoId) setSelectedMemo(selectedMemoId);
  };

  const fetchFoldersAndSetMemoOnFolderChange = async () => {
    await fetchFoldersAndMemos();
    
    // 폴더 변경 후 새 메모 생성 시 임시 메모가 제대로 추가되도록 로직 수정
    if (isCreating) {
      const tempMemo = { ...newMemo, folder_id: selectedFolder };
      
      // 현재 선택된 폴더에 맞는 임시 메모를 추가
      updateMemosWithNewMemo(tempMemo);
    } else {
      // 폴더 변경 후 선택된 폴더에 맞는 첫 번째 메모를 선택
      const folderMemos = filterMemosByFolder(selectedFolder);
      setSelectedMemo(folderMemos.length ? folderMemos[0] : null);
    }
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
    folderId === 1 ? memos : memos.filter((memo) => memo.folder_id === folderId);

  const setNewMemoAndSelect = () => {
    const tempMemo = { ...newMemo, folder_id: selectedFolder };
    updateMemosWithNewMemo(tempMemo);
  };

  const updateMemosWithNewMemo = (tempMemo: any) => {
    setMemos([tempMemo, ...memos.filter((memo) => memo.id !== newMemo.id)]);
    setSelectedMemo(tempMemo);
  };

  // 검색어와 폴더에 맞는 메모 필터링
  const matchesSearchQuery = (memo: any) =>
    (memo.title?.includes(searchQuery) || '') || (memo.content?.includes(searchQuery) || '');

  const filteredMemos = memos
  .filter((memo) => {
    const isInSelectedFolder = selectedFolder === 1 || memo.folder_id === selectedFolder;
    return isInSelectedFolder && matchesSearchQuery(memo);
  })
  .sort((a, b) => {
    // 1번 폴더에서 id가 1인 메모를 상단 고정
    if (selectedFolder === 1) {
      if (a.id === 1) return -1; // a가 id가 1인 메모인 경우 상단
      if (b.id === 1) return 1;  // b가 id가 1인 메모인 경우 하단
    }
    return b.id - a.id; // 그 외 메모는 id 기준으로 내림차순 정렬
  });

  return (
    <MemoContext.Provider
      value={{
        folders,
        memos,
        selectedMemo,
        searchQuery,
        selectedFolder,
        isCreating,
        showPasswordModal,
        showErrorModal,
        newMemo,
        setFolders,
        setMemos,
        setSelectedMemo,
        setSearchQuery,
        setSelectedFolder,
        setIsCreating,
        setShowPasswordModal,
        setShowErrorModal,
        setNewMemo,
        fetchFoldersAndMemos,
        createMemo,
        deleteMemo,
        resetMemoState,
        resetMemoCreateState,
        filteredMemos,
        fetchFoldersAndSetFirstMemo,
        setFirstMemoForSelectedFolder,
        fetchFoldersAndSetSelectedMemo,
        selectMemoIfExists,
        fetchFoldersAndSetMemoOnFolderChange,
        updateMemoOnFolderChange,
        filterMemosByFolder,
        setNewMemoAndSelect,
        updateMemosWithNewMemo,
        matchesSearchQuery,
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
