import React, { createContext, useContext, useState, ReactNode } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { invoke } from '@tauri-apps/api/core';
import { isValidFileContent } from '../lib/utils';

interface FileContextProps {
  fileUrl: string | null;
  content: object | null;
  loading: boolean;
  error: string | null;
  selectFile: () => Promise<void>;
  createFile: (project: string) => Promise<void>;
  sync: (data: object) => Promise<boolean>;
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
  setContent: (content: object | null) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    const fileContent = await invoke('read_file', { path });
    if (isValidFileContent(fileContent)) {
      setContent(fileContent);
      setError(null);
    } else {
      setContent(null);
      setError('File content is invalid or corrupted.');
    }
    setLoading(false);
  } catch (err) {
    setContent(null);
    setError('Failed to read file.');
    setLoading(false);
    return;
  }
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [content, setContent] = useState<object | null>(null);
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

      const initialContent = { projectName: project };
      setFileUrl(filePath);
      setContent(initialContent);
      setError(null);
    } catch (err: unknown) {
      console.error('Error creating file:', err);
      setError('Failed to create file.');
    }
  };

  const sync = async (data: any) => {
    if (!fileUrl) {
      setError('No file selected.');
      return false;
    }
    try {
      // Merge data with current content
      let mergedData = data;
      if (content) {
        try {
          const currentContentObj = content;
          if (typeof currentContentObj === 'object' && currentContentObj !== null) {
            mergedData = { ...currentContentObj, ...data };
          }
        } catch (e) {
          // If content is not valid JSON, just use data
          mergedData = data;
        }
      }

      await invoke('sync', {
        json: mergedData,
        path: fileUrl,
      });

      setContent(mergedData);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to sync data.');
      console.error('Failed to sync:', err);
      return false;
    }
  };

  return (
    <FileContext.Provider
      value={{ fileUrl, selectFile, content, loading, error, createFile, sync }}
    >
      {children}
    </FileContext.Provider>
  );
};
