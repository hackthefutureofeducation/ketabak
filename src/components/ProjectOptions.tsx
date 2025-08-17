import { useFile } from '../providers/FileProvider';
import { EpubSettings } from './EpubSettings';

export function ProjectOptions() {
  const { fileUrl } = useFile();
  return (
    fileUrl && (
      <div>
        <EpubSettings />
      </div>
    )
  );
}
