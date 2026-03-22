import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, title, children, className }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur">
      <div
        className={cn(
          'relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-soft',
          className,
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
