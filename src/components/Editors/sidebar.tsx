import React, { useState } from 'react';
import { useEpubManager } from '../../providers/EpubManager';
import Button from '../ui/Button';
import { Pen } from 'lucide-react';
import { cn } from '../../lib/utils';

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
      editPageTitle(editTitle.trim());
      setEditingPageId(null);
      setEditTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditTitle('');
  };

  return (
    <div
      className={`w-64 text-gray-200 flex flex-col h-full border-r border-gray-800 ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-primary">Pages</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="w-full mt-2 bg-primary hover:bg-primary/50 text-white"
        >
          + Add Page
        </Button>
      </div>

      {/* Create new page form */}
      {isCreating && (
        <div className="p-4 border-b border-gray-800 bg-gray-800">
          <input
            type="text"
            value={newPageTitle}
            onChange={(e) => setNewPageTitle(e.target.value)}
            placeholder="Page title..."
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
              className="px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/50 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewPageTitle('');
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
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
          <ul className="divide-y divide-gray-800">
            {pages.map((page) => (
              <li key={page.id} className="group">
                {editingPageId === page.id ? (
                  <div className="p-3 bg-gray-800">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-3 cursor-pointer transition-colors ${
                      activePageId === page.id ? 'bg-primary border-r-2' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => setActivePage(page.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium truncate flex-1 text-white`}>
                        {page.title || 'Untitled'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(page.id);
                        }}
                        className={cn(
                          'opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-white transition-opacity',
                          activePageId === page.id && 'opacity-100 text-white'
                        )}
                        title="Edit title"
                      >
                        <Pen />
                      </button>
                    </div>
                    {activePageId === page.id && (
                      <div className="mt-1 text-xs text-white">Currently active</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          {pages.length} {pages.length === 1 ? 'page' : 'pages'}
        </div>
      </div>
    </div>
  );
};
