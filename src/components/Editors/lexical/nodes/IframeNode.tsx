/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';
import type { JSX } from 'react';

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';

type IframeComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  link: string;
}>;

function IframeComponent({ className, format, nodeKey, link }: IframeComponentProps) {
  return (
    <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
      <iframe
        width="560"
        height="315"
        src={link}
        frameBorder="0"
        title="Iframe"
      />
    </BlockWithAlignableContents>
  );
}

export type SerializedIframeNode = Spread<
  {
    videoID: string;
  },
  SerializedDecoratorBlockNode
>;

function $convertIframeElement(domNode: HTMLElement): null | DOMConversionOutput {
  const videoID = domNode.getAttribute('data-lexical-Iframe');
  if (videoID) {
    const node = $createIframeNode(videoID);
    return { node };
  }
  return null;
}

export class IframeNode extends DecoratorBlockNode {
  __link: string;

  static getType(): string {
    return 'Iframe';
  }

  static clone(node: IframeNode): IframeNode {
    return new IframeNode(node.__link, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedIframeNode): IframeNode {
    return $createIframeNode(serializedNode.videoID).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedIframeNode {
    return {
      ...super.exportJSON(),
      videoID: this.__link,
    };
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__link = id;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('width', '560');
    element.setAttribute('height', '315');
    element.setAttribute('src', this.__link);
    element.setAttribute('title', 'Iframe');
    element.setAttribute('frameborder', '0');
    element.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    element.setAttribute('allowfullscreen', 'true');
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-Iframe')) {
          return null;
        }
        return {
          conversion: $convertIframeElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__link;
  }



  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <IframeComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        link={this.__link}
      />
    );
  }
}

export function $createIframeNode(link: string): IframeNode {
  return new IframeNode(link);
}

export function $isIframeNode(
  node: IframeNode | LexicalNode | null | undefined
): node is IframeNode {
  return node instanceof IframeNode;
}
