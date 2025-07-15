import React from 'react';
import { useDarkMode } from '../DarkModeProvider';
import { Sun, Moon } from 'lucide-react';

const NavBar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav
      className="
      w-full flex items-center justify-between px-6 py-4
      bg-background
      shadow
      transition-colors
    "
    >
      <div
        className="
        text-xl font-bold
        text-foreground 
        transition-colors
      "
      >
        Ketabak
      </div>
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        className="
          px-3 py-1 rounded
          bg-primary
          shadow
          hover:bg-primary-hover
          transition-colors flex items-center gap-2
        "
      >
        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </nav>
  );
};

export default NavBar;
