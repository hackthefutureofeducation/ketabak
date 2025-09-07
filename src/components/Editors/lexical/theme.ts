import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { IframeNode } from './plugins/Iframe';

export const theme = {
  paragraph: 'mb-2 leading-relaxed',
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6',
    h2: 'text-2xl font-semibold mb-3 mt-5',
    h3: 'text-xl font-medium mb-2 mt-4',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal list-inside mb-2 pl-4',
    ul: 'list-disc list-inside mb-2 pl-4',
    listitem: 'mb-1',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
};

export const initialConfig = {
  namespace: 'MyEditor',
  theme,
  onError: (error: Error) => {
    console.error(error);
  },
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, IframeNode],
};
