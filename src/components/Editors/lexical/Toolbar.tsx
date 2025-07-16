import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CLEAR_HISTORY_COMMAND,
  $createParagraphNode,
  $createTextNode,
  TextFormatType,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  RotateCcw,
  Type,
  Save,
} from 'lucide-react';
import ToolbarButton from './ToolbarButton';

export interface ToolbarProps {
  wordCount: number;
  charCount: number;
  isAutoSaved: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ wordCount, charCount, isAutoSaved }) => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      UNDO_COMMAND,
      () => {
        setCanUndo(true);
        return false;
      },
      1
    );
  }, [editor]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const insertList = (listType: 'bullet' | 'number') => {
    if (listType === 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const clearContent = () => {
    editor.update(() => {
      const root = editor.getRootElement();
      if (root) {
        root.innerHTML = '';
      }
    });
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
  };

  return (
    <div className="border-b border-primary bg-background/50">
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1 mb-3">
          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton onClick={() => formatText('bold')} active={isBold} title="Bold (Ctrl+B)">
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText('italic')}
              active={isItalic}
              title="Italic (Ctrl+I)"
            >
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText('underline')}
              active={isUnderline}
              title="Underline (Ctrl+U)"
            >
              <Underline size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText('strikethrough')}
              active={isStrikethrough}
              title="Strikethrough"
            >
              <Strikethrough size={16} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1 mr-4">
            <select
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'h1' || value === 'h2' || value === 'h3') {
                  formatHeading(value as HeadingTagType);
                }
              }}
              className="px-3 py-1 border border-primary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-primary bg-transparent"
              defaultValue=""
            >
              <option value="">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>
          </div>

          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton onClick={() => insertList('bullet')} title="Bullet List">
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => insertList('number')} title="Numbered List">
              <ListOrdered size={16} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1 mr-4">
            <ToolbarButton
              onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
              title="Undo (Ctrl+Z)"
            >
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
              title="Redo (Ctrl+Y)"
            >
              <Redo size={16} />
            </ToolbarButton>
          </div>

          <ToolbarButton onClick={clearContent} title="Clear Document">
            <RotateCcw size={16} />
          </ToolbarButton>
        </div>

        <div className="flex items-center justify-between text-sm text-primary">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Type size={14} />
              {wordCount} words, {charCount} characters
            </span>
            {isAutoSaved && (
              <span className="flex items-center gap-1 text-green-600">
                <Save size={14} />
                Auto-saved
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
