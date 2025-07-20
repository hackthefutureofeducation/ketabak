import { File, FilePlus } from 'lucide-react';
import { useFile } from '../../providers/FileProvider';

export const Start = () => {
  const { selectFile } = useFile();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 w-full text-center">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
        Welcome to Ketabak
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400 text-base max-w-md">
        Your journey to better writing starts here.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={selectFile}
          className="mt-10 flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <File size={24} />
          <span className="text-lg font-medium">Open File</span>
        </button>
        <button className="mt-10 flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
          <FilePlus size={24} />
          <span className="text-lg font-medium">New Project</span>
        </button>
      </div>
    </main>
  );
};
