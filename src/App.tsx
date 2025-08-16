import './App.css';
import { EditorLayout } from './components/Editors/layout';
import { Start } from './components/start';
import { useFile } from './providers/FileProvider';

function App() {
  const { fileUrl } = useFile();
  return fileUrl ? <EditorLayout /> : <Start />;
}

export default App;
