import { useFile } from '../providers/FileProvider';
import { EpubSettings } from './EpubSettings';
import Button from './ui/Button';

export function ProjectOptions({onNavigate}: { onNavigate: React.Dispatch<React.SetStateAction<"home" | "export">> }) {
  const { fileUrl } = useFile();
  return (
    fileUrl && (
      <>
        <EpubSettings />
        <Button onClick={()=>onNavigate("export")}>Export</Button>
      </>
    )
  );
}
