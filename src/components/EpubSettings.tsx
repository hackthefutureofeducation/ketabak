import { useState } from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';

export function EpubSettings() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Epub Manager</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Epub Manager">
        <div></div>
      </Modal>
    </>
  );
}
