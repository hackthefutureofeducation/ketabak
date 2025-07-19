import React, { createContext, useContext, useState, ReactNode } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

interface FileContextProps {
  fileUrl: string | null;
  content: string | null;
  loading: boolean;
  error: string | null;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedPath = await open({
        multiple: false,
        filters: [
          { extensions: ['ketabi'], name: '' }, // customize as needed
        ],
      });

      if (!selectedPath || typeof selectedPath !== 'string') {
        setLoading(false);
        setError(null);
        return; // User cancelled or invalid path
      }

      setFileUrl(selectedPath);

      let fileContent;
      try {
        fileContent = await invoke('read_file', { path: selectedPath });
      } catch (err) {
        setContent(null);
        setError('Failed to read file.');
        setLoading(false);
        return;
      }

      if (typeof fileContent === 'string') {
        setContent(fileContent);
        setError(null);
      } else {
        setContent(null);
        setError('Invalid file content.');
      }
    } catch (error) {
      setFileUrl(null);
      setContent(null);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FileContext.Provider value={{ fileUrl, selectFile, content, loading, error }}>
      {children}
    </FileContext.Provider>
  );
};
