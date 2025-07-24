import React from 'react';
import { useDarkMode } from '../providers/DarkModeProvider';
import { Sun, Moon } from 'lucide-react';
import Button from './ui/Button';

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
      <Button onClick={toggleDarkMode} aria-label="Toggle dark mode">
        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
      </Button>
    </nav>
  );
};

export default NavBar;
