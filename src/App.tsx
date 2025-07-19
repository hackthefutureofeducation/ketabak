import './App.css';
import { Editors } from './components/Editors';
import { Start } from './components/start';
import { useFile } from './providers/FileProvider';

function App() {
  const { fileUrl } = useFile();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      {fileUrl ? <Editors /> : <Start />}
    </main>
  );
}

export default App;
