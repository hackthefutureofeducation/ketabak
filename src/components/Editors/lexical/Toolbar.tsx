import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  CLEAR_HISTORY_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  type ElementFormatType,
  type TextFormatType,
} from 'lexical';
import {
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Redo,
  RotateCcw,
  Save,
  Strikethrough,
  Type,
  Underline,
  Undo,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import ToolbarButton from './ToolbarButton';
import IframeOptionsModal from '../../IframeOptions';

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
  const [showIframeModal, setShowIframeModal] = useState(false);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [align, setAlign] = useState<ElementFormatType>('left');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      const nodes = selection.getNodes();
      for (const node of nodes) {
        const element = node.getParentOrThrow();
        if (element) {
          setDir(element.getDirection() || 'ltr');
          setAlign(element.getFormatType());
          break; // Only need to check the first node's parent for direction
        }
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

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
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      root.append(paragraph);
    });
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
  };

  const setDirection = (dir: 'ltr' | 'rtl') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        for (const node of nodes) {
          const element = node.getParentOrThrow();
          if (element) {
            element.setDirection(dir);
          }
        }
      }
    });
  };

  // Define toolbar button groups as arrays for refactoring
  const textFormatButtons = [
    {
      key: 'bold',
      onClick: () => formatText('bold'),
      active: isBold,
      title: 'Bold (Ctrl+B)',
      icon: <Bold size={16} />,
    },
    {
      key: 'italic',
      onClick: () => formatText('italic'),
      active: isItalic,
      title: 'Italic (Ctrl+I)',
      icon: <Italic size={16} />,
    },
    {
      key: 'underline',
      onClick: () => formatText('underline'),
      active: isUnderline,
      title: 'Underline (Ctrl+U)',
      icon: <Underline size={16} />,
    },
    {
      key: 'strikethrough',
      onClick: () => formatText('strikethrough'),
      active: isStrikethrough,
      title: 'Strikethrough',
      icon: <Strikethrough size={16} />,
    },
  ];

  const listButtons = [
    {
      key: 'bullet',
      onClick: () => insertList('bullet'),
      title: 'Bullet List',
      icon: <List size={16} />,
    },
    {
      key: 'number',
      onClick: () => insertList('number'),
      title: 'Numbered List',
      icon: <ListOrdered size={16} />,
    },
  ];

  const alignButtons = [
    {
      key: 'left',
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left'),
      title: 'Align Left',
      active: align === 'left',
      icon: <AlignLeft size={16} />,
    },
    {
      key: 'center',
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center'),
      title: 'Align Center',
      active: align === 'center',
      icon: <AlignCenter size={16} />,
    },
    {
      key: 'right',
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right'),
      title: 'Align Right',
      active: align === 'right',
      icon: <AlignRight size={16} />,
    },
    {
      key: 'justify',
      onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify'),
      title: 'Justify',
      active: align === 'justify',
      icon: <AlignJustify size={16} />,
    },
  ];

  const directionButtons = [
    {
      key: 'ltr',
      onClick: () => setDirection('ltr'),
      title: 'Left-to-Right',
      active: dir === 'ltr',
      icon: <span className="font-bold text-xs">LTR</span>,
    },
    {
      key: 'rtl',
      onClick: () => setDirection('rtl'),
      title: 'Right-to-Left',
      active: dir === 'rtl',
      icon: <span className="font-bold text-xs">RTL</span>,
    },
  ];

  const undoRedoButtons = [
    {
      key: 'undo',
      onClick: () => editor.dispatchCommand(UNDO_COMMAND, undefined),
      title: 'Undo (Ctrl+Z)',
      icon: <Undo size={16} />,
    },
    {
      key: 'redo',
      onClick: () => editor.dispatchCommand(REDO_COMMAND, undefined),
      title: 'Redo (Ctrl+Y)',
      icon: <Redo size={16} />,
    },
  ];

  // Heading options for the select dropdown
  const headingOptions = [
    { value: '', label: 'Normal' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
  ];

  return (
    <div className="border-b border-primary bg-background/50">
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-1 mb-3">
          {/* Text format buttons */}
          <div className="flex items-center gap-1 mr-4">
            {textFormatButtons.map(btn => (
              <ToolbarButton
                key={btn.key}
                onClick={btn.onClick}
                active={btn.active}
                title={btn.title}
              >
                {btn.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Heading select */}
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
              {headingOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* List buttons */}
          <div className="flex items-center gap-1 mr-4">
            {listButtons.map(btn => (
              <ToolbarButton
                key={btn.key}
                onClick={btn.onClick}
                title={btn.title}
              >
                {btn.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Align buttons */}
          <div className="flex items-center gap-1 mr-4">
            {alignButtons.map(btn => (
              <ToolbarButton
                key={btn.key}
                onClick={btn.onClick}
                title={btn.title}
                active={btn.active}
              >
                {btn.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Direction buttons */}
          <div className="flex items-center gap-1 mr-4">
            {directionButtons.map(btn => (
              <ToolbarButton
                key={btn.key}
                onClick={btn.onClick}
                title={btn.title}
                active={btn.active}
              >
                {btn.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Undo/Redo buttons */}
          <div className="flex items-center gap-1 mr-4">
            {undoRedoButtons.map(btn => (
              <ToolbarButton
                key={btn.key}
                onClick={btn.onClick}
                title={btn.title}
              >
                {btn.icon}
              </ToolbarButton>
            ))}
          </div>

          {/* Clear and Iframe buttons */}
          <ToolbarButton onClick={clearContent} title="Clear Document">
            <RotateCcw size={16} />
          </ToolbarButton>
          <ToolbarButton onClick={() => setShowIframeModal(true)} title="Insert Iframe">
            <Code size={16} />
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
      <IframeOptionsModal isOpen={showIframeModal} onClose={() => setShowIframeModal(false)} />
    </div>
  );
};

export default Toolbar;
