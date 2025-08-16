import { useEffect, useState } from 'react';
import { useDarkMode } from '../providers/DarkModeProvider';
import { Sun, Moon } from 'lucide-react';
import Button from './ui/Button';
import { getVersion } from '@tauri-apps/api/app';

const NavBar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    getVersion().then(setVersion).catch(console.error);
  }, []);

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
        Ketabak {version && <span className="text-sm opacity-60 ml-2">v{version}</span>}
      </div>
      <Button onClick={toggleDarkMode} aria-label="Toggle dark mode">
        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
      </Button>
    </nav>
  );
};

export default NavBar;
