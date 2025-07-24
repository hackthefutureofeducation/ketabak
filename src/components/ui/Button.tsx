import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: keyof typeof variantClasses;
}

const variantClasses = {
  default:
    'px-3 py-1 rounded bg-primary shadow hover:bg-primary-hover transition-colors flex items-center gap-2 cursor-pointer',
  secondary:
    'mt-10 flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors cursor-pointer text-black w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary',
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', variant = 'default', ...props }, ref) => {
    const classes = cn(variantClasses[variant] || '', className);
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
