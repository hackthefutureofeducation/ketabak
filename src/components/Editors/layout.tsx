import { EpubManagerProvider } from '../../providers/EpubManager';
import { Editors } from './editors';
import { Sidebar } from './sidebar';
import { CreateNewPageWelcome } from './createNewPage';
import { useEpubManager } from '../../providers/EpubManager';

// LayoutInner is an internal layout for displaying pages/sidebar or create new page prompt
function LayoutInner() {
  const { pages } = useEpubManager();
  const isNoPages = pages.length === 0;
  if (isNoPages) return <CreateNewPageWelcome />;

  return (
    <section className="w-full grid grid-cols-[250px_1fr]">
      <Sidebar />
      <Editors />
    </section>
  );
}

export function EditorLayout() {
  return (
    <EpubManagerProvider>
      <LayoutInner />
    </EpubManagerProvider>
  );
}
