import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DarkModeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div
        className="min-h-screen overflow-clip transition-all duration-300 dark:bg-slate-900 bg-[#f2f4f8] selection:bg-gray-200 print:bg-white print:pb-1"
      >
        {/* Colly (colorful wavy) gradient full-background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              'linear-gradient(120deg, #a78bfa 0%, #f472b6 33%, #38bdf8 66%, #34d399 100%)',
            opacity: 0.22,
            zIndex: 0,
            width: '100vw',
            height: '100vh',
            /* Add a smooth "wavy" effect with SVG overlay if desired, else just soft multi-color */
            /* filter: "blur(4px)", */
          }}
        ></div>
        {children}
      </div>
    </DarkModeContext.Provider>
  );
};
