import { EpubManagerProvider } from '../../providers/EpubManager';
import { Editors } from './editors';
import { Sidebar } from './sidebar';

export function EditorLayout() {
  return (
    <EpubManagerProvider>
      <section className="w-full grid grid-cols-[250px_1fr]">
        <Sidebar />
        <Editors />
      </section>
    </EpubManagerProvider>
  );
}
