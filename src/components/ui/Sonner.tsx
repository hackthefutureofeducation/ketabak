'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          // Start of Selection
          '--normal-bg': 'white',
          '--normal-text': 'black',
          '--normal-border': 'var(--primary)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
