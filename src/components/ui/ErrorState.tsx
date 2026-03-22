import { AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  title = 'Something went wrong',
  description = 'Please try again in a moment.',
  onRetry,
}: ErrorStateProps) => (
  <div className="flex flex-col items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-slate-100">
    <div className="flex items-center gap-2 text-rose-200">
      <AlertTriangle className="h-5 w-5" />
      <p className="font-semibold">{title}</p>
    </div>
    <p className="text-sm text-rose-100/80">{description}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);

export default ErrorState;
