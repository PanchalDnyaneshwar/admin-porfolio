import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => (
    <label className="flex w-full flex-col gap-2 text-sm">
      {label && <span className="text-slate-200">{label}</span>}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          error && 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20',
          className,
        )}
        {...props}
      />
      {helperText && !error && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </label>
  ),
);

Input.displayName = 'Input';

export default Input;
