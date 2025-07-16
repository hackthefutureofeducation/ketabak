import React from 'react';

export interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  onClick, 
  active = false, 
  disabled = false, 
  children, 
  title 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`
      p-2 rounded-md transition-all duration-200 ease-in-out
      ${active 
        ? 'bg-blue-100 text-blue-700 shadow-sm' 
        : 'text-primary hover:bg-gray-100 hover:text-gray-900'
      }
      ${disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:shadow-sm active:scale-95'
      }
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `}
  >
    {children}
  </button>
);

export default ToolbarButton; 