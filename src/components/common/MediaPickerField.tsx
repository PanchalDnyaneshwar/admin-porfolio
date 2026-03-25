import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FileImage, FileText, Link2, Search, UploadCloud, X } from 'lucide-react';
import { getMedia, uploadMedia } from '@/apis/media.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Media } from '@/types/media.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import FileUpload from '@/components/common/FileUpload';
import { getErrorMessage } from '@/utils/errors';

interface MediaPickerFieldProps {
  label: string;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  resourceType?: 'image' | 'raw' | 'any';
  helperText?: string;
}

const MediaPickerField = ({
  label,
  value,
  onChange,
  multiple = false,
  resourceType = 'any',
  helperText,
}: MediaPickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  const { data, refetch } = useQuery({
    queryKey: QUERY_KEYS.media,
    queryFn: getMedia,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: async (response) => {
      toast.success('Asset uploaded');
      setSelectedFile(null);
      setFileError('');
      await refetch();
      handleSelect(response.data.url);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const mediaItems = data?.data ?? [];
  const currentValues = Array.isArray(value) ? value : value ? [value] : [];

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mediaItems.filter((item) => {
      const typeMatches =
        resourceType === 'any' ||
        (resourceType === 'image' ? item.resourceType !== 'raw' : item.resourceType === 'raw');

      if (!typeMatches) return false;
      if (!query) return true;

      return [item.fileName, item.alt, item.type, item.url]
        .filter(Boolean)
        .some((entry) => entry!.toLowerCase().includes(query));
    });
  }, [mediaItems, resourceType, search]);

  const selectedItems = currentValues
    .map((url) => mediaItems.find((item) => item.url === url) || buildFallbackItem(url))
    .filter(Boolean) as Media[];

  const handleSelect = (url: string) => {
    if (multiple) {
      const nextValues = Array.from(new Set([...currentValues, url]));
      onChange(nextValues);
      return;
    }

    onChange(url);
    setOpen(false);
  };

  const handleRemove = (url: string) => {
    if (multiple) {
      onChange(currentValues.filter((item) => item !== url));
      return;
    }

    onChange('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError('Choose a file before uploading.');
      return;
    }

    setFileError('');
    await uploadMutation.mutateAsync({
      file: selectedFile,
      type: resourceType === 'raw' ? 'document' : 'image',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Link2 className="h-4 w-4" />
          {multiple ? 'Manage assets' : 'Choose asset'}
        </Button>
      </div>

      {selectedItems.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {selectedItems.map((item) => (
            <div
              key={`${item.url}-${item._id ?? 'manual'}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-900 p-2 text-slate-200">
                  {item.resourceType === 'raw' ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <FileImage className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-100">
                    {item.fileName || item.alt || 'Selected asset'}
                  </p>
                  <p className="truncate text-xs text-slate-500">{item.url}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(item.url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-5 text-sm text-slate-500">
          No asset selected yet.
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={`Select ${label}`}>
        <div className="space-y-4">
          <div className="grid gap-4">
            <FileUpload
              file={selectedFile}
              error={fileError}
              disabled={uploadMutation.isPending}
              accept={resourceType === 'raw' ? '.pdf,.doc,.docx,.txt,.zip' : '.jpg,.jpeg,.png,.webp,.svg'}
              onFileChange={(file) => {
                setSelectedFile(file);
                setFileError('');
              }}
            />
            <div className="flex justify-end">
              <Button type="button" onClick={handleUpload} disabled={uploadMutation.isPending}>
                <UploadCloud className="h-4 w-4" />
                {uploadMutation.isPending ? 'Uploading...' : 'Upload and use'}
              </Button>
            </div>
          </div>

          <div className="relative">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search uploaded assets"
              className="pl-10"
            />
            <Search className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-slate-500" />
          </div>

          <div className="grid max-h-[360px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
            {filteredItems.map((item) => {
              const isSelected = currentValues.includes(item.url);

              return (
                <button
                  key={item._id}
                  type="button"
                  className={`rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-primary bg-slate-900/90'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                  onClick={() => handleSelect(item.url)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-slate-900 p-2 text-slate-200">
                      {item.resourceType === 'raw' ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <FileImage className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {item.fileName || item.alt || 'Uploaded asset'}
                      </p>
                      <p className="truncate text-xs text-slate-500">{item.type || item.format || 'asset'}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

const buildFallbackItem = (url: string): Media => ({
  _id: url,
  url,
});

export default MediaPickerField;
