import type { SerializedEditorState } from 'lexical';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { safeRandomUUID } from '../lib/utils';
import { useFile } from './FileProvider';

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

export const EpubManagerProvider = ({ children }: { children: ReactNode }) => {
  const [pages, setPages] = useState<EpubPage[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false); // Track if user made changes
  const { fileUrl, sync, content } = useFile();

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) || null,
    [pages, activePageId]
  );

  const setActivePage = useCallback((id: string) => {
    setActivePageId(id);
  }, []);

  const createPage = useCallback((title: string) => {
    const newPage: EpubPage = {
      id: safeRandomUUID(),
      title,
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    setDirty(true);
  }, []);

  const editPage = useCallback(
    async (content: SerializedEditorState): Promise<boolean> => {
      if (!activePageId) throw new Error('No active page to edit');
      setPages((prev) =>
        prev.map((page) => (page.id === activePageId ? { ...page, content } : page))
      );
      setDirty(true);
      return true;
    },
    [activePageId]
  );

  const editPageTitle = useCallback(
    (title: string): boolean => {
      if (!activePageId) throw new Error('No active page to edit title');
      setPages((prev) =>
        prev.map((page) => (page.id === activePageId ? { ...page, title } : page))
      );
      setDirty(true);
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
    setDirty(false); // not dirty since it's a fresh load
  }, []);

  // Load pages from file content when fileUrl changes
  useEffect(() => {
    if (fileUrl && content) {
      setPages(content.pages);
      setActivePageId(content.pages[0]?.id ?? null);
      setDirty(false); // not dirty since it's a fresh load
    }
  }, [fileUrl, content]);

  // Sync only when user has changed something
  useEffect(() => {
    if (!dirty) return;
    sync({ pages }).catch((err) => {
      console.error('Failed to sync pages:', err);
    });
  }, [pages, dirty, sync]);

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
