/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Modified by Adam Naji on 2025-09-08 to suit project requirements.
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
  width: string;
  height: string;
}>;

function isSafeIframeUrl(url: string): { valid: boolean; origin?: string } {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return { valid: true, origin: parsed.origin };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

function IframeComponent({
  className,
  format,
  nodeKey,
  link,
  width,
  height,
}: IframeComponentProps) {
  const { valid, origin } = isSafeIframeUrl(link);
  if (!valid) {
    return (
      <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
        <div
          style={{
            width: width || '560px',
            height: height || '315px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            fontSize: '1rem',
          }}
        >
          Invalid or unsupported iframe source.
        </div>
      </BlockWithAlignableContents>
    );
  }
  return (
    <BlockWithAlignableContents className={className} format={format} nodeKey={nodeKey}>
      <iframe
        width={width}
        height={height}
        src={link}
        frameBorder="0"
        title={`Embedded content — ${origin || 'external source'}`}
        sandbox="allow-scripts allow-same-origin"
        allow="fullscreen"
        referrerPolicy="no-referrer"
      />
    </BlockWithAlignableContents>
  );
}

export type SerializedIframeNode = Spread<
  {
    videoID: string;
    width: string;
    height: string;
  },
  SerializedDecoratorBlockNode
>;

function $convertIframeElement(domNode: HTMLElement): null | DOMConversionOutput {
  const videoID = domNode.getAttribute('data-lexical-Iframe');
  const width = domNode.getAttribute('width');
  const height = domNode.getAttribute('height');
  if (videoID) {
    // Validate the src before creating the node
    const { valid } = isSafeIframeUrl(videoID);
    if (!valid) {
      return null;
    }
    const node = $createIframeNode(videoID, width || '', height || '');
    return { node };
  }
  return null;
}

export class IframeNode extends DecoratorBlockNode {
  __link: string;
  __width: string;
  __height: string;

  static getType(): string {
    return 'Iframe';
  }

  static clone(node: IframeNode): IframeNode {
    return new IframeNode(node.__link, node.__format, node.__key, node.__width, node.__height);
  }

  static importJSON(serializedNode: SerializedIframeNode): IframeNode {
    return $createIframeNode(
      serializedNode.videoID,
      serializedNode.width,
      serializedNode.height
    ).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedIframeNode {
    return {
      ...super.exportJSON(),
      videoID: this.__link,
      width: this.__width,
      height: this.__height,
    };
  }

  constructor(
    id: string,
    format?: ElementFormatType,
    key?: NodeKey,
    width?: string,
    height?: string
  ) {
    super(format, key);
    this.__link = id;
    this.__width = width || '560';
    this.__height = height || '315';
  }

  exportDOM(): DOMExportOutput {
    // Validate the src before exporting
    const { valid, origin } = isSafeIframeUrl(this.__link);
    if (!valid) {
      // Export a placeholder div if invalid
      const element = document.createElement('div');
      element.textContent = 'Invalid or unsupported iframe source.';
      element.style.width = this.__width;
      element.style.height = this.__height;
      element.style.display = 'flex';
      element.style.alignItems = 'center';
      element.style.justifyContent = 'center';
      element.style.background = '#f8d7da';
      element.style.color = '#721c24';
      element.style.border = '1px solid #f5c6cb';
      element.style.borderRadius = '6px';
      element.style.fontSize = '1rem';
      return { element };
    }
    const element = document.createElement('iframe');
    element.setAttribute('width', this.__width);
    element.setAttribute('height', this.__height);
    element.setAttribute('src', this.__link);
    element.setAttribute('title', `Embedded content — ${origin || 'external source'}`);
    element.setAttribute('frameborder', '0');
    element.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    element.setAttribute('allow', 'fullscreen');
    element.setAttribute('referrerpolicy', 'no-referrer');
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-Iframe')) {
          return null;
        }
        // Validate the src attribute
        const src = domNode.getAttribute('src');
        if (!src || !isSafeIframeUrl(src).valid) {
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
        width={this.__width}
        height={this.__height}
      />
    );
  }
}

export function $createIframeNode(link: string, width: string, height: string): IframeNode {
  return new IframeNode(link, undefined, undefined, width, height);
}

export function $isIframeNode(
  node: IframeNode | LexicalNode | null | undefined
): node is IframeNode {
  return node instanceof IframeNode;
}
