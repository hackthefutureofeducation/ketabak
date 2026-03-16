import { EpubManagerProvider } from '../../providers/EpubManager';
import { Editors } from './editors';
import { Sidebar } from './sidebar';

export function EditorLayout() {
  return (
    <EpubManagerProvider>
      <section className="w-full flex gap-5 py-5">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Editors />
        </div>
      </section>
      </section>
    </EpubManagerProvider>
  );
}
