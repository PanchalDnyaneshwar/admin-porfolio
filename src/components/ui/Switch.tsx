import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
}

const Switch = ({
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) => (
  <button
    type="button"
    className={cn(
      'relative inline-flex h-6 w-11 items-center rounded-full border border-slate-700 transition-colors',
      checked ? 'bg-primary/90' : 'bg-slate-800',
      className,
    )}
    onClick={() => onCheckedChange(!checked)}
    aria-pressed={checked}
    {...props}
  >
    <span
      className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-slate-100 transition-transform',
        checked ? 'translate-x-5' : 'translate-x-1',
      )}
    />
  </button>
);

export default Switch;
