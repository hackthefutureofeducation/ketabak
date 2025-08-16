import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeProvider } from './providers/DarkModeProvider';
import NavBar from './components/navBar';
import { FileProvider } from './providers/FileProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DarkModeProvider>
      <FileProvider>
        <div className="bg-gray-50 dark:bg-gray-900 h-screen overflow-auto">
          <NavBar />
          <App />
        </div>
      </FileProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
