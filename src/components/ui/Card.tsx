import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'rounded-[1.35rem] border border-slate-800/80 bg-slate-900/60 p-6 shadow-soft backdrop-blur-sm',
      className,
    )}
    {...props}
  />
);

export default Card;
