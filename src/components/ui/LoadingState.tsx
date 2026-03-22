import { LoaderCircle } from 'lucide-react';

const LoadingState = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-10 text-slate-300">
    <LoaderCircle className="h-5 w-5 animate-spin" />
    <span>{label}</span>
  </div>
);

export default LoadingState;
