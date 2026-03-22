import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Badge = ({ variant = 'default', className, ...props }: BadgeProps) => {
  const variants = {
    default: 'bg-slate-800 text-slate-200',
    success: 'bg-emerald-500/20 text-emerald-200',
    warning: 'bg-amber-500/20 text-amber-200',
    danger: 'bg-rose-500/20 text-rose-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};

export default Badge;
