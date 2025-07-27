import { invoke } from '@tauri-apps/api/core';
import { SerializedEditorState } from 'lexical';
import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useFile } from './FileProvider';

export interface EpubPage {
  readonly id: string;
  title: string;
  content?: SerializedEditorState;
}

interface EpubManagerContextProps {
  pages: EpubPage[];
  activePageId: string | null;
  activePage: EpubPage | null;
  setActivePage: (id: string) => void;
  createPage: (title: string) => void;
  editPage: (content: SerializedEditorState) => Promise<boolean>;
  editPageTitle: (title: string) => boolean;
  uploadDump: (dump: EpubPage[]) => void;
}

const EpubManagerContext = createContext<EpubManagerContextProps | undefined>(undefined);

export const useEpubManager = (): EpubManagerContextProps => {
  const context = useContext(EpubManagerContext);
  if (!context) {
    throw new Error('useEpubManager must be used within an EpubManagerProvider');
  }
  return context;
};

const generateId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).substr(2, 9);

export const EpubManagerProvider = ({ children }: { children: ReactNode }) => {
  const [pages, setPages] = useState<EpubPage[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const { fileUrl } = useFile();

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) || null,
    [pages, activePageId]
  );

  const setActivePage = (id: string) => {
    setActivePageId(id);
  };

  const createPage = (title: string) => {
    const newPage: EpubPage = {
      id: generateId(),
      title,
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  };

  const editPage = async (content: SerializedEditorState): Promise<boolean> => {
    if (!activePageId) throw new Error('No active page to edit');
    setPages((prev) =>
      prev.map((page) => (page.id === activePageId ? { ...page, content } : page))
    );
    await invoke('sync', {
      json: pages,
      path: fileUrl,
    });
    return true;
  };

  const editPageTitle = (title: string): boolean => {
    if (!activePageId) return false;
    setPages((prev) => prev.map((page) => (page.id === activePageId ? { ...page, title } : page)));
    return true;
  };

  const uploadDump = (dump: EpubPage[]) => {
    const hasDuplicates = new Set(dump.map((p) => p.id)).size !== dump.length;

    if (hasDuplicates) {
      console.warn('uploadDump: duplicate page IDs detected');
    }

    setPages(dump);
    setActivePageId(dump[0]?.id ?? null);
  };

  const value = useMemo(
    () => ({
      pages,
      activePageId,
      activePage,
      setActivePage,
      createPage,
      editPage,
      editPageTitle,
      uploadDump,
    }),
    [pages, activePageId, activePage]
  );

  return <EpubManagerContext.Provider value={value}>{children}</EpubManagerContext.Provider>;
};
