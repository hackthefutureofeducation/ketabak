import { safeRandomUUID } from './utils';

export function generateEpubMetadata(
  title: string,
  language: string,
  options?: {
    creator?: Creator;
    publisher?: string;
    date?: string;
    subject?: string;
    description?: string;
    cover?: string;
  }
): EpubMetadata {
  const uuid = safeRandomUUID();
  const identifier = `urn:uuid:${uuid}`;
  const modified = new Date().toISOString().replace(/\.\d+Z$/, 'Z'); // EPUB requires precise UTC

  return {
    identifier,
    title,
    language,
    modified,
    creator: options?.creator || { name: 'Ketabak' },
    publisher: options?.publisher || 'Ketabak',
    date: options?.date || modified,
    subject: options?.subject,
    description: options?.description,
    cover: options?.cover,
  };
}
