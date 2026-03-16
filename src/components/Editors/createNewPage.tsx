import React, { useState } from 'react';
import { useEpubManager } from '../../providers/EpubManager';
import Button from '../ui/Button';

export const CreateNewPageWelcome: React.FC = () => {
  const { createPage } = useEpubManager();
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (title.trim().length === 0) {
      setError('Title cannot be empty');
      return;
    }
    createPage(title.trim());
    setTitle('');
    setError('');
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-primary">Welcome!</h1>
      <p className="mb-6 text-gray-400">
        Get started by creating your first page.
      </p>
      <input
        type="text"
        placeholder="Enter a page title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError('');
        }}
        className="px-3 py-2 mb-2 w-full max-w-sm rounded border border-gray-700 bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && <span className="text-red-400 mb-2">{error}</span>}
      <Button
        onClick={handleCreate}
        className='ml-auto mr-auto'
      >
        Create Page
      </Button>
    </>
  );
};