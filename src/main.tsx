import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DarkModeProvider } from './providers/DarkModeProvider';
import NavBar from './components/navBar';
import { FileProvider } from './providers/FileProvider';
import ExportPage from './pages/ExportPage';

function Root() {
  const [page, setPage] = useState<'home' | 'export'>('home');

  return (
    <DarkModeProvider>
      <FileProvider>
        <div className="bg-gray-50 dark:bg-gray-900 flex flex-col min-h-screen overflow-auto">
          <NavBar onNavigate={setPage} />
          {page === 'home' && (
            <main className="flex-1 overflow-auto h-full flex flex-col items-center justify-center px-6 w-full text-center">
              <App />
            </main>
          )}
          {page === 'export' && <ExportPage />}
        </div>
      </FileProvider>
    </DarkModeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
