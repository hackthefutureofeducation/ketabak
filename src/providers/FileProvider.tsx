import React, { createContext, useContext, useState, ReactNode } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

interface FileContextProps {
  fileUrl: string | null;
  content: string | null;
  selectFile: () => Promise<void>;
}

const FileContext = createContext<FileContextProps | undefined>(undefined);

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const selectFile = async () => {
    const selectedPath = await open({
      multiple: false,
      filters: [
        { extensions: ['ketabi'], name: '' }, // customize as needed
      ],
    });
    setFileUrl(selectedPath);
    const fileContent = await invoke('read_file', { path: selectedPath });
    setContent(fileContent as string);
  };
  return (
    <FileContext.Provider value={{ fileUrl, selectFile, content }}>{children}</FileContext.Provider>
  );
};
