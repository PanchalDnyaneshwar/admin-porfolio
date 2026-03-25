import { FileText, FileUp, Image as ImageIcon, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface FileUploadProps {
  file: File | null;
  error?: string;
  hint?: string;
  accept?: string;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

const FileUpload = ({
  file,
  error,
  hint = 'Upload images, PDFs, docs, spreadsheets, presentations, text files, or ZIPs up to 10 MB.',
  accept,
  disabled,
  onFileChange,
}: FileUploadProps) => {
  const isImage = Boolean(file?.type.startsWith('image/'));

  return (
    <div className="space-y-3">
      <label
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-6 py-8 text-center transition hover:border-primary/60 hover:bg-slate-900/70',
          disabled && 'cursor-not-allowed opacity-60',
          error && 'border-rose-500/70',
        )}
      >
        <input
          type="file"
          className="hidden"
          accept={accept}
          disabled={disabled}
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
        <div className="rounded-2xl bg-slate-900/90 p-3 text-primary">
          <FileUp className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-100">Choose a file to upload</p>
          <p className="mt-1 text-xs text-slate-400">{hint}</p>
        </div>
      </label>

      {file && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-slate-900 p-2 text-slate-200">
              {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">{file.name}</p>
              <p className="text-xs text-slate-400">
                {file.type || 'Unknown type'} - {formatBytes(file.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled}
            onClick={() => onFileChange(null)}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        </div>
      )}

      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default FileUpload;
