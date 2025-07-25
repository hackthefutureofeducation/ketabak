import React, { useCallback, useState, useRef, useEffect } from 'react';
import { EditorState, $getRoot } from 'lexical';
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
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const autoSaveTimeoutRef = useRef<number | null>(null);

  const onChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root ? root.getTextContent() : '';
      setCharCount(text.length);
      setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
    });
    setIsAutoSaved(false);
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(() => setIsAutoSaved(true), 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const placeholder = (
    <div className="text-gray-400 pointer-events-none absolute top-0 left-0 select-none">
      Start writing your content here...
    </div>
  );

  return (
    <div className="w-full mx-auto bg-background border-primary border rounded-lg shadow-lg overflow-hidden rounded-b-none">
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
