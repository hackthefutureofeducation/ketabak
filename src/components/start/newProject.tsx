import { useState, FormEvent, ChangeEvent } from 'react';
import { useFile } from '../../providers/FileProvider';
import { ArrowLeft } from 'lucide-react';

interface NewProjectProps {
  onBack: () => void;
}

export const NewProject = ({ onBack }: NewProjectProps) => {
  const [projectName, setProjectName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { createFile } = useFile();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await createFile(projectName);
      console.log('Creating project:', projectName);
      // Reset form on success
      setProjectName('');
      // You would typically redirect or show success message here
    } catch (err) {
      setError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 px-2 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Project
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Give your project a memorable name to get started
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            name="projectName"
            value={projectName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                 placeholder-gray-500 dark:placeholder-gray-400
                                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
                                 transition-colors duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter project name..."
            required
            disabled={isSubmitting}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'error-message' : undefined}
            autoComplete="off"
            maxLength={100}
          />
          {error && (
            <p
              id="error-message"
              className="mt-2 text-sm text-red-600 dark:text-red-400"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !projectName.trim()}
          className="w-full flex items-center justify-center px-6 py-3 
                             bg-primary hover:bg-primary-hover disabled:bg-gray-400 dark:disabled:bg-gray-600
                             text-white font-medium rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800
                             transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                             disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 cursor-pointer"
          aria-describedby="submit-help"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Project...
            </>
          ) : (
            'Create Project'
          )}
        </button>

        <p id="submit-help" className="text-xs text-gray-500 dark:text-gray-400 text-center">
          You can change the project name later in settings
        </p>
      </form>
    </div>
  );
};
