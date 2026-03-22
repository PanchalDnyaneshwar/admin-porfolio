import { Inbox } from 'lucide-react';

const EmptyState = ({
  title = 'No data yet',
  description = 'Create a new item to get started.',
}: {
  title?: string;
  description?: string;
}) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-10 text-center text-slate-300">
    <div className="rounded-full bg-slate-800/70 p-3">
      <Inbox className="h-6 w-6" />
    </div>
    <div>
      <p className="font-semibold text-slate-100">{title}</p>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </div>
);

export default EmptyState;
