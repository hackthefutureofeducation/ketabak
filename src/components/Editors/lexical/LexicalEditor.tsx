import React, { useCallback, useState } from 'react';
import { EditorState } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import Toolbar from './Toolbar';
import { initialConfig } from './theme';
import { FileText } from 'lucide-react';

const LexicalEditor: React.FC = () => {
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isAutoSaved, setIsAutoSaved] = useState(false);

  const onChange = useCallback((editorState: EditorState) => {
    setEditorState(editorState);
    editorState.read(() => {
      const root = editorState._nodeMap.get('root');
      const text = root ? root.getTextContent() : '';
      setCharCount(text.length);
      setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    });
    setIsAutoSaved(false);
    setTimeout(() => setIsAutoSaved(true), 1000);
  }, []);

  const placeholder = (
    <div className="text-gray-400 pointer-events-none absolute top-0 left-0 select-none">
      Start writing your content here...
    </div>
  );

  return (
    <div className="w-full mx-auto bg-background border-primary border rounded-lg shadow-lg overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar wordCount={wordCount} charCount={charCount} isAutoSaved={isAutoSaved} />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[500px] p-6 text-foreground leading-relaxed focus:outline-none resize-none"
                style={{ caretColor: '#3B82F6' }}
              />
            }
            placeholder={placeholder}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <ListPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;
