import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-soft',
      className,
    )}
    {...props}
  />
);

export default Card;
