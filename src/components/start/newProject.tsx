import { useState, FormEvent, ChangeEvent } from 'react';
import { z } from 'zod';
import { useFile } from '../../providers/FileProvider';
import { ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

interface NewProjectProps {
  onBack: () => void;
}
// Zod schema for project name
const INVALID_FILENAME_CHARS = /[\\/:*?"<>|]/;
const projectNameSchema = z
  .string()
  .min(3, 'Project name must be at least 3 characters')
  .max(100, 'Project name must be at most 100 characters')
  .transform((s) => s.trim())
  .refine((name) => !INVALID_FILENAME_CHARS.test(name), {
    message: 'Project name contains invalid characters: \\ / : * ? " < > |',
  });

export const NewProject = ({ onBack }: NewProjectProps) => {
  const [projectName, setProjectName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { createFile } = useFile();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Zod validation
    const result = projectNameSchema.safeParse(projectName);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await createFile(projectName);
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
      <Button type="button" onClick={onBack}>
        <ArrowLeft size={16} /> Back
      </Button>

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

        <Button
          type="submit"
          disabled={isSubmitting || !projectName.trim()}
          aria-describedby="submit-help"
          variant="secondary"
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
        </Button>

        <p id="submit-help" className="text-xs text-gray-500 dark:text-gray-400 text-center">
          You can change the project name later in settings
        </p>
      </form>
    </div>
  );
};
