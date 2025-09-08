import { createEditor, type SerializedEditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { initialConfig } from '../components/Editors/lexical/theme';

export async function lexicalTransformer(serializedState?: SerializedEditorState): Promise<string> {
  if (!serializedState) return '';

  const editor = createEditor(initialConfig);
  const editorState = editor.parseEditorState(serializedState);

  editor.setEditorState(editorState);

  return new Promise((resolve) => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor);
      resolve(html);
    });
  });
}
