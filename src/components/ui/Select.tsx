import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, children, ...props }, ref) => (
    <label className="flex w-full flex-col gap-2 text-sm">
      {label && <span className="text-slate-200">{label}</span>}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-sm text-slate-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          error && 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {helperText && !error && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </label>
  ),
);

Select.displayName = 'Select';

export default Select;
