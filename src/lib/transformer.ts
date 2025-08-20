import { createEditor, type SerializedEditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

export function lexicalTransformer(serializedState?: SerializedEditorState): string {
  if (!serializedState) return '';
  // Create a temporary editor instance (doesn’t render, just used for parsing)
  const editor = createEditor();
  // Parse the serialized state back into an editor state
  editor.parseEditorState(serializedState);
  // Convert to HTML
  let html = '';
  editor.update(() => {
    html = $generateHtmlFromNodes(editor);
  });

  return html;
}
