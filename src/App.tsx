import './App.css';
import { EditorLayout } from './components/Editors/layout';
import { Start } from './components/start';
import { useFile } from './providers/FileProvider';

function App() {
  const { fileUrl } = useFile();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {fileUrl ? <EditorLayout /> : <Start />}
    </main>
  );
}

export default App;
