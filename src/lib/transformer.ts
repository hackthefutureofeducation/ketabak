import { createEditor, type SerializedEditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

export async function lexicalTransformer(serializedState?: SerializedEditorState): Promise<string> {
  if (!serializedState) return '';

  const editor = createEditor();
  const editorState = editor.parseEditorState(serializedState);

  editor.setEditorState(editorState);

  return new Promise((resolve) => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor);
      resolve(html);
    });
  });
}
