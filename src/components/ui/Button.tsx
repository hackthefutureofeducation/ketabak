'use client';
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2, Plus } from 'lucide-react';

export interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
  isAddNewInSelect?: boolean;
}

const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      isLoading = false,
      icon,
      children,
      disabled,
      isAddNewInSelect,
      type,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variants = {
      primary:
        'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]',
      secondary:
        'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-600 shadow-sm hover:translate-y-[-1px]',
      outline:
        'bg-transparent text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-slate-700 hover:border-gray-800 dark:hover:border-slate-500 hover:text-gray-900 dark:hover:text-white',
      danger:
        'border border-red-200 dark:border-red-900/30 hover:scale-[1.02] shadow-sm bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-transparent hover:shadow-lg hover:shadow-red-500/30',
      ghost:
        'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white',
    };

    const displayIcon = isAddNewInSelect && !icon ? <Plus size={16} /> : icon;
    const additionalClasses = isAddNewInSelect ? 'w-full h-10 text-sm bg-opacity-80' : '';

    return (
      <button
        ref={ref}
        type={isAddNewInSelect ? 'button' : type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${additionalClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : displayIcon ? (
          <span className="w-5 h-5 flex items-center justify-center">{displayIcon}</span>
        ) : null}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

ModernButton.displayName = 'ModernButton';

export default ModernButton;
