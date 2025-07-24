import React, { createContext, useContext, useState, ReactNode } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';

interface FileContextProps {
  fileUrl: string | null;
  content: string | null;
  loading: boolean;
  error: string | null;
  selectFile: () => Promise<void>;
  createFile: (project: string) => Promise<void>;
}

const FileContext = createContext<FileContextProps | undefined>(undefined);

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};

const readFileContent = async (
  path: string,
  setContent: (content: string | null) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) => {
  let fileContent;
  try {
    fileContent = await invoke('read_file', { path });
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

      await readFileContent(selectedPath, setContent, setError, setLoading);
    } catch (error) {
      setFileUrl(null);
      setContent(null);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const createFile = async (project: string) => {
    try {
      const filePath = await save({
        filters: [{ name: 'Ketabi Project', extensions: ['ketabi'] }],
        defaultPath: `${project}.ketabi`,
      });
  
      if (!filePath) return; // User cancelled the dialog
  
      const initialContent = JSON.stringify({ projectName: project });
  
      await writeTextFile(filePath, initialContent);
  
      setFileUrl(filePath);
      setContent(initialContent);
      setError(null);
    } catch (err: unknown) {
      console.error('Error creating file:', err);
      setError('Failed to create file.');
    }
  };  

  return (
    <FileContext.Provider value={{ fileUrl, selectFile, content, loading, error, createFile }}>
      {children}
    </FileContext.Provider>
  );
};
