import React, { useState } from 'react';
import { useEpubManager } from '../../providers/EpubManager';
import Button from '../ui/Button';

interface EpubSidebarProps {
  className?: string;
}

export const Sidebar: React.FC<EpubSidebarProps> = ({ className = '' }) => {
  const { pages, activePageId, setActivePage, createPage, editPageTitle } = useEpubManager();

  const [isCreating, setIsCreating] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      createPage(newPageTitle.trim());
      setNewPageTitle('');
      setIsCreating(false);
    }
  };

  const handleEditTitle = (pageId: string) => {
    const page = pages.find((p) => p.id === pageId);
    if (page) {
      setEditingPageId(pageId);
      setEditTitle(page.title);
    }
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editingPageId) {
      // Temporarily set active page to the one being edited
      const currentActiveId = activePageId;
      setActivePage(editingPageId);
      editPageTitle(editTitle.trim());

      // Restore previous active page if it was different
      if (currentActiveId && currentActiveId !== editingPageId) {
        setActivePage(currentActiveId);
      }

      setEditingPageId(null);
      setEditTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditTitle('');
  };

  return (
    <div className={`w-64   flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Pages</h2>
        <Button onClick={() => setIsCreating(true)} className="w-full">
          + Add Page
        </Button>
      </div>

      {/* Create new page form */}
      {isCreating && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <input
            type="text"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="Page title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCreatePage();
              } else if (e.key === 'Escape') {
                setIsCreating(false);
                setNewPageTitle('');
              }
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleCreatePage}
              disabled={!newPageTitle.trim()}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewPageTitle('');
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pages list */}
      <div className="flex-1 overflow-y-auto">
        {pages.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm text-center">
            No pages yet. Create your first page!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pages.map((page) => (
              <li key={page.id} className="group">
                {editingPageId === page.id ? (
                  <div className="p-3 bg-yellow-50">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveTitle();
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={handleSaveTitle}
                        disabled={!editTitle.trim()}
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-400"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                      activePageId === page.id ? 'bg-blue-100 border-r-2 border-blue-600' : ''
                    }`}
                    onClick={() => setActivePage(page.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 truncate flex-1">
                        {page.title || 'Untitled'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(page.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-500 hover:text-gray-700 transition-opacity"
                        title="Edit title"
                      >
                        ✏️
                      </button>
                    </div>
                    {activePageId === page.id && (
                      <div className="mt-1 text-xs text-blue-600">Currently active</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500">
          {pages.length} {pages.length === 1 ? 'page' : 'pages'}
        </div>
      </div>
    </div>
  );
};
