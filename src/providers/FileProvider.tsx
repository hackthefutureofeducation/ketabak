import { createContext, useContext, useState, ReactNode } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { isValidFileContent } from '../lib/utils';
import { generateEpubMetadata } from '../lib/generateMeta';

interface FileContextProps {
  fileUrl: string | null;
  content: Epub | null;
  loading: boolean;
  error: string | null;
  selectFile: () => Promise<void>;
  createFile: (project: string) => Promise<void>;
  sync: (data: Partial<Epub>) => Promise<boolean>;
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
  setContent: (content: Epub | null) => void,
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
    console.log(err);
    return;
  }
};

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [content, setContent] = useState<Epub | null>(null);
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
      console.log(error);
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
      const meta = generateEpubMetadata(project, 'en');
      const initialContent = { pages: [], meta };
      setFileUrl(filePath);
      setContent(initialContent);
      setError(null);
    } catch (err: unknown) {
      console.error('Error creating file:', err);
      setError('Failed to create file.');
    }
  };

  const sync = async (data: Partial<Epub>) => {
    if (!fileUrl) {
      setError('No file selected.');
      return false;
    }
    try {
      // Merge data with current content
      const mergedData = { ...content, ...data } as Epub;

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
