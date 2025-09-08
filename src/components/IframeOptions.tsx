import React, { useState } from 'react';
import Modal from './ui/Modal';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_IFRAME_COMMAND } from './Editors/lexical/plugins/IframePlugin';
import Button from './ui/Button';
import Input from './ui/Input';

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
    onClose();
    if (!url) return;
    editor.dispatchCommand(INSERT_IFRAME_COMMAND, url, width, height);
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
