import type { SerializedEditorState } from 'lexical';

declare global {
  interface Creator {
    name: string;
  }
  interface EpubMetadata {
    identifier: string;
    title: string;
    language: string;
    modified: string;
    creator?: Creator;
    publisher?: string;
    date?: string;
    subject?: string;
    description?: string;
    cover?: string;
  }
  interface EpubPage {
    readonly id: string;
    title: string;
    content?: SerializedEditorState;
  }
  interface Epub {
    meta: EpubMetadata;
    pages: EpubPage[];
  }
}
