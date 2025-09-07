import { createCommand, DecoratorNode, NodeKey } from 'lexical';
export class IframeNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __width: string;
  __height: string;

  static getType(): string {
    return 'iframe';
  }

  static clone(node: IframeNode): IframeNode {
    return new IframeNode(node.__src, node.__width, node.__height, node.__key);
  }

  constructor(src: string, width: string, height: string, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
  }

  // 👇 JSON serialization
  static importJSON(serializedNode: any): IframeNode {
    return new IframeNode(serializedNode.src, serializedNode.width, serializedNode.height);
  }

  exportJSON(): any {
    return {
      type: 'iframe',
      version: 1,
      src: this.__src,
      width: this.__width,
      height: this.__height,
    };
  }

  // 👇 required DOM methods
  createDOM(): HTMLElement {
    return document.createElement('div');
  }
  updateDOM(): false {
    return false;
  }

  // 👇 this is what actually renders your iframe
  decorate(): JSX.Element {
    return (
      <iframe
        src={this.__src}
        width={this.__width}
        height={this.__height}
        style={{ border: 'none' }}
      />
    );
  }
}

// helper factory
export function $createIframeNode(src: string, width = '560', height = '315') {
  return new IframeNode(src, width, height);
}

export const INSERT_IFRAME_COMMAND = createCommand<{
  src: string;
  width: string;
  height: string;
}>();
