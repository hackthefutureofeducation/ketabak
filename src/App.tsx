import './App.css';
import { EditorLayout } from './components/Editors/layout';
import { Start } from './components/start';
import { useFile } from './providers/FileProvider';

function App() {
  const { fileUrl } = useFile();
  return (
    <main className="flex flex-col items-center justify-center px-4 h-[calc(100%-60px)]">
      {fileUrl ? <EditorLayout /> : <Start />}
    </main>
  );
}

export default App;
