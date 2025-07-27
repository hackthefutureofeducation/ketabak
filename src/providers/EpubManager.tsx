import { invoke } from '@tauri-apps/api/core';
import { SerializedEditorState } from 'lexical';
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
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

  const setActivePage = useCallback((id: string) => {
    setActivePageId(id);
  }, []);

  const createPage = useCallback((title: string) => {
    const newPage: EpubPage = {
      id: generateId(),
      title,
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
  }, []);

  const editPage = useCallback(
    async (content: SerializedEditorState): Promise<boolean> => {
      if (!activePageId) throw new Error('No active page to edit');
      setPages((prev) =>
        prev.map((page) => (page.id === activePageId ? { ...page, content } : page))
      );
      return true;
    },
    [activePageId]
  );

  const editPageTitle = useCallback(
    (title: string): boolean => {
      if (!activePageId) return false;
      setPages((prev) =>
        prev.map((page) => (page.id === activePageId ? { ...page, title } : page))
      );
      return true;
    },
    [activePageId]
  );

  const uploadDump = useCallback((dump: EpubPage[]) => {
    const hasDuplicates = new Set(dump.map((p) => p.id)).size !== dump.length;

    if (hasDuplicates) {
      console.warn('uploadDump: duplicate page IDs detected');
    }

    setPages(dump);
    setActivePageId(dump[0]?.id ?? null);
  }, []);

  useEffect(() => {
    if (!fileUrl) return;

    invoke('sync', {
      json: pages,
      path: fileUrl,
    }).catch((err) => {
      console.error('Failed to sync pages:', err);
    });
  }, [pages, fileUrl]);

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
    [
      pages,
      activePageId,
      activePage,
      setActivePage,
      createPage,
      editPage,
      editPageTitle,
      uploadDump,
    ]
  );

  return <EpubManagerContext.Provider value={value}>{children}</EpubManagerContext.Provider>;
};
