import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useState } from 'react';
import { INSERT_IFRAME_COMMAND } from './Editors/lexical/plugins/IframePlugin';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { toast } from 'sonner';

interface IframeOptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const IframeOptionsModal: React.FC<IframeOptionsProps> = ({ isOpen, onClose }) => {
  const [editor] = useLexicalComposerContext();
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState('560');
  const [height, setHeight] = useState('315');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trim whitespace from URL and validate
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      onClose();
      return;
    }

    // Ensure width and height have sensible defaults if empty
    const safeWidth = width.trim() || '560';
    const safeHeight = height.trim() || '315';

    // Normalize URL: add protocol if missing
    let normalizedUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      normalizedUrl = 'https://' + trimmedUrl;
    }

    // Validate the domain name
    let domain;
    try {
      const parsed = new URL(normalizedUrl);
      domain = parsed.hostname;
    } catch (err) {
      throw new Error('Invalid URL');
    }

    // Simple domain name validation (RFC 1035/1123)
    // Domain must be at least two labels separated by a dot, each label 1-63 chars, only a-z, 0-9, and hyphens, not starting/ending with hyphen
    const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))+$/;
    if (!domainRegex.test(domain)) {
      toast.error('Invalid domain name');
      return;
    }

    editor.dispatchCommand(INSERT_IFRAME_COMMAND, [normalizedUrl, safeWidth, safeHeight]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Insert Iframe"
      maxWidth="max-w-md"
      height="auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} type="input" />
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              label="Width"
              value={width}
              onChange={(e) => {
                // Only allow numbers
                const val = e.target.value.replace(/[^0-9]/g, '');
                setWidth(val);
              }}
              type="input"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Height"
              value={height}
              onChange={(e) => {
                // Only allow numbers
                const val = e.target.value.replace(/[^0-9]/g, '');
                setHeight(val);
              }}
              inputType="number"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <Button type="submit">Insert</Button>
        </div>
      </form>
    </Modal>
  );
};

export default IframeOptionsModal;
