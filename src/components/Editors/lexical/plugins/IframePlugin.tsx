/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { $createIframeNode, IframeNode } from '../nodes/IframeNode';

// Change the command type to accept a tuple of [string, string, string]
export const INSERT_IFRAME_COMMAND: LexicalCommand<[string, string, string]> =
  createCommand('INSERT_IFRAME_COMMAND');

export default function IframePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([IframeNode])) {
      throw new Error('IframePlugin: IframeNode not registered on editor');
    }

    return editor.registerCommand<[string, string, string]>(
      INSERT_IFRAME_COMMAND,
      (payload) => {
        const [link, width, height] = payload;
        const iframeNode = $createIframeNode(link, width, height);
        $insertNodeToNearestRoot(iframeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
