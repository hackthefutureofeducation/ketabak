import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  $createParagraphNode,
  $getRoot,
  CLEAR_HISTORY_COMMAND,
  EditorState,
  SerializedEditorState,
} from 'lexical';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEpubManager } from '../../../providers/EpubManager';
import Toolbar from './Toolbar';
import IframePlugin from './plugins/IframePlugin';
import { initialConfig } from './theme';

const ContentUpdaterPlugin: React.FC<{ initialEditorState: EpubPage }> = ({
  initialEditorState,
}) => {
  const [editor] = useLexicalComposerContext();
  const lastSetPageId = useRef<string | null>(null);

  useEffect(() => {
    if (initialEditorState.id === lastSetPageId.current) return;

    try {
      if (!initialEditorState.content) {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          root.append(paragraph);
        });
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      } else {
        const newState = editor.parseEditorState(initialEditorState.content);
        editor.setEditorState(newState);
      }
      lastSetPageId.current = initialEditorState.id;
    } catch (err) {
      console.error('Failed to parse editor state:', err);
    }
  }, [editor, initialEditorState.id, initialEditorState.content]);

  return null;
};

const LexicalEditor: React.FC = () => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const autoSaveTimeoutRef = useRef<number | null>(null);
  const latestEditorStateRef = useRef<SerializedEditorState | null>(null);
  const { editPage, activePage } = useEpubManager();

  const onChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        setCharCount(text.length);
        setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);
      });

      // Store the latest serialized state in a ref
      latestEditorStateRef.current = editorState.toJSON();

      setIsAutoSaved(false);
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = window.setTimeout(async () => {
        setIsAutoSaved(true);
        // Call editPage (sync) only after debounce
        if (latestEditorStateRef.current) {
          await editPage(latestEditorStateRef.current);
        }
      }, 1000);
    },
    [editPage]
  );

  useEffect(() => {
    return () => clearTimeout(autoSaveTimeoutRef.current ?? undefined);
  }, []);

  const placeholder = useMemo(
    () => (
      <div className="text-gray-400 absolute top-6 left-6 select-none pointer-events-none">
        Start writing your content here...
      </div>
    ),
    []
  );

  return (
    <div className="w-full mx-auto bg-background border-primary border rounded-lg shadow-lg overflow-hidden rounded-b-none">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar wordCount={wordCount} charCount={charCount} isAutoSaved={isAutoSaved} />
        <div className="relative">
          {activePage && <ContentUpdaterPlugin initialEditorState={activePage} />}
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
          <IframePlugin />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;
