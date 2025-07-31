import type { SerializedEditorState } from "lexical";

declare global {
  interface EpubPage {
    readonly id: string;
    title: string;
    content?: SerializedEditorState;
  }
  interface Epub{
    projectName: string;
    pages: EpubPage[];
  }
}