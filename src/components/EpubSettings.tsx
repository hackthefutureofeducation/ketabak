import { useEffect, useState } from 'react';
import { useFile } from '../providers/FileProvider';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import DropDown from './ui/DropDown';

export function EpubSettings() {
  const { meta, sync } = useFile();
  const [open, setOpen] = useState(false);
  const [localMeta, setLocalMeta] = useState(meta);

  useEffect(() => {
    setLocalMeta(meta);
  }, [meta]);

  if (!localMeta) return null;

  const inputs: { name: string; key: keyof EpubMetadata; type?: 'textarea' | 'input' }[] = [
    { name: 'Title', key: 'title' },
    { name: 'Publisher', key: 'publisher' },
    { name: 'Author', key: 'creator' },
    { name: 'Description', key: 'description', type: 'textarea' },
    { name: 'Language', key: 'language' },
  ];
  const languages = [
    { language: 'English', abbr: 'en' },
    { language: '中文 (Zhōngwén / Chinese)', abbr: 'zh' },
    { language: 'हिन्दी (Hindi)', abbr: 'hi' },
    { language: 'Español', abbr: 'es' },
    { language: 'Français', abbr: 'fr' },
    { language: 'العربية', abbr: 'ar' },
    { language: 'বাংলা (Bangla)', abbr: 'bn' },
    { language: 'Русский (Russkiy)', abbr: 'ru' },
    { language: 'Português', abbr: 'pt' },
    { language: 'اردو (Urdu)', abbr: 'ur' },
  ];

  const handleSave = async () => {
    await sync({ meta: localMeta });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Epub Manager</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Epub Manager">
        <div className="space-y-5 h-full">
          {inputs.map((input) =>
            input.key == 'language' ? (
              <DropDown
                options={languages}
                selectedOption={localMeta.language}
                onSelectOption={(s) => setLocalMeta({ ...localMeta, language: s })}
              />
            ) : (
              <Input
                key={input.key}
                label={input.name}
                value={localMeta[input.key] as string}
                onChange={(e) =>
                  setLocalMeta({
                    ...localMeta,
                    [input.key]: input.key == 'creator' ? { name: e.target.value } : e.target.value,
                  })
                }
                type={input.type}
              />
            )
          )}
          <Button onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </>
  );
}
