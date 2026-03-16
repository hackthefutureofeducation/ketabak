import { EpubManagerProvider } from '../../providers/EpubManager';
import { Editors } from './editors';
import { Sidebar } from './sidebar';

export function EditorLayout() {
  return (
    <EpubManagerProvider>
      <section className="w-full flex gap-5 py-5">
        <Sidebar />
        <Editors />
      </section>
    </EpubManagerProvider>
  );
}
