import { useState } from 'react';
import { File, FilePlus } from 'lucide-react';
import { useFile } from '../../providers/FileProvider';
import { NewProject } from './newProject';
import Button from '../ui/Button';

export const Start = () => {
  const { selectFile } = useFile();
  const [showNewProject, setShowNewProject] = useState(false);

  if (showNewProject) {
    const handleBackToStart = () => setShowNewProject(false);
    return (
      <>
        <NewProject onBack={handleBackToStart} />
      </>
    );
  }

  return (
    <main className=" flex flex-col items-center justify-center px-6 w-full text-center">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
        Welcome to Ketabak
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400 text-base max-w-md">
        Your journey to better writing starts here.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={selectFile} variant="secondary">
          <File size={24} />
          <span className="text-lg font-medium">Open File</span>
        </Button>
        <Button onClick={() => setShowNewProject(true)} variant="secondary">
          <FilePlus size={24} />
          <span className="text-lg font-medium">New Project</span>
        </Button>
      </div>
    </main>
  );
};
