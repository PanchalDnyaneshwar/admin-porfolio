import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => (
  <Modal open={open} onClose={onClose} title={title} className="max-w-md">
    <div className="space-y-6">
      <p className="text-sm leading-7 text-slate-400">{description}</p>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant="danger" type="button" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Deleting...' : confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
