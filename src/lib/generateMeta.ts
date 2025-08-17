export function generateEpubMetadata(
  title: string,
  language: string,
  options?: {
    creator?: { name: string; role?: string };
    publisher?: string;
    date?: string;
    subject?: string;
    description?: string;
    cover?: string;
  }
): EpubMetadata {
  const uuid = crypto.randomUUID();
  const identifier = `urn:uuid:${uuid}`;
  const modified = new Date().toISOString().replace(/\.\d+Z$/, 'Z'); // EPUB requires precise UTC

  return {
    identifier,
    title,
    language,
    modified,
    creator: options?.creator,
    publisher: options?.publisher,
    date: options?.date,
    subject: options?.subject,
    description: options?.description,
    cover: options?.cover,
  };
}
