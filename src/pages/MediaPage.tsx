import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  Copy,
  Download,
  FileImage,
  FileText,
  Search,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { deleteMedia, getMedia, getMediaStatus, uploadMedia } from '@/apis/media.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Media } from '@/types/media.types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/common/FileUpload';
import { getErrorMessage } from '@/utils/errors';
import { formatDate } from '@/lib/formatters';

interface MediaUploadFormValues {
  alt: string;
  type: string;
}

const MediaPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.media,
    queryFn: getMedia,
  });
  const { data: statusData } = useQuery({
    queryKey: [...QUERY_KEYS.media, 'status'],
    queryFn: getMediaStatus,
  });

  const [open, setOpen] = useState(false);
  const [mediaPendingDelete, setMediaPendingDelete] = useState<Media | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [search, setSearch] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MediaUploadFormValues>({
    defaultValues: {
      alt: '',
      type: 'document',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        alt: '',
        type: 'document',
      });
      setSelectedFile(null);
      setFileError('');
    }
  }, [open, reset]);

  const createMutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: () => {
      toast.success('File uploaded successfully');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      toast.success('Media deleted');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: MediaUploadFormValues) => {
    if (!selectedFile) {
      setFileError('Choose a file before uploading.');
      return;
    }

    setFileError('');
    await createMutation.mutateAsync({
      file: selectedFile,
      alt: values.alt,
      type: values.type,
    });
  };

  if (isLoading) return <LoadingState label="Loading media..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load media"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const media = data.data;
  const status = statusData?.data;
  const filteredMedia = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return media;

    return media.filter((item) =>
      [item.alt, item.type, item.fileName, item.url]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
  }, [media, search]);
  const documentCount = media.filter((item) => item.resourceType === 'raw').length;
  const imageCount = media.filter((item) => item.resourceType !== 'raw').length;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">Asset management</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-50">Media Library</h3>
            <p className="mt-2 text-sm text-slate-400">
              Upload images and real documents to Cloudinary, keep metadata tidy, and manage
              reusable assets from one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
            <Button onClick={() => setOpen(true)}>
              <UploadCloud className="h-4 w-4" />
              Upload file
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatusCard label="Total assets" value={String(media.length)} helper="Files ready to reuse" />
          <StatusCard label="Images" value={String(imageCount)} helper="Portfolio visuals and graphics" />
          <StatusCard label="Documents" value={String(documentCount)} helper="PDFs and supporting docs" />
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <div>
              <h4 className="font-semibold text-slate-100">Cloudinary status</h4>
              <p className="text-sm text-slate-400">
                {status?.configured
                  ? `Connected. Uploads will be stored in the "${status.folder}" folder.`
                  : 'Cloudinary is not fully configured, so uploads will fail until the backend env is fixed.'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-300" />
            <div>
              <h4 className="font-semibold text-slate-100">Upload support</h4>
              <p className="text-sm text-slate-400">
                Images and documents are supported with validation up to 10 MB per file.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-slate-100">Browse assets</h4>
            <p className="text-sm text-slate-400">
              Search by filename, type, alt text, or URL and quickly copy or open files.
            </p>
          </div>
          <div className="relative w-full max-w-md">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search media library"
              className="pl-10"
            />
            <Search className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-slate-500" />
          </div>
        </div>
      </Card>

      {filteredMedia.length === 0 ? (
        <EmptyState
          title={media.length === 0 ? 'No media files yet' : 'No matching files'}
          description={
            media.length === 0
              ? 'Upload assets for your portfolio and admin workflows.'
              : 'Try a different filename, type, or keyword.'
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredMedia.map((item) => (
            <Card key={item._id} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-slate-950/80 p-3 text-slate-200">
                    {item.resourceType === 'raw' ? (
                      <FileText className="h-5 w-5" />
                    ) : (
                      <FileImage className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h5 className="line-clamp-1 text-sm font-semibold text-slate-100">
                      {item.fileName || item.alt || 'Untitled asset'}
                    </h5>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {item.type || 'asset'}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
                  {item.format || 'file'}
                </span>
              </div>

              {item.resourceType !== 'raw' && (
                <div className="aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
                  <img
                    src={item.url}
                    alt={item.alt ?? item.fileName ?? 'media'}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <dl className="space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Alt text</dt>
                  <dd className="text-right text-slate-200">{item.alt || 'Not provided'}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Uploaded</dt>
                  <dd className="text-right text-slate-200">
                    {item.createdAt ? formatDate(item.createdAt) : 'Unknown'}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-slate-500">Size</dt>
                  <dd className="text-right text-slate-200">
                    {item.bytes ? formatBytes(item.bytes) : 'Unknown'}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(item.url);
                    toast.success('File URL copied');
                  }}
                >
                  <Copy className="h-4 w-4" />
                  Copy URL
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
                >
                  <Download className="h-4 w-4" />
                  Open file
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => setMediaPendingDelete(item)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Upload file">
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FileUpload
            file={selectedFile}
            error={fileError}
            disabled={createMutation.isPending}
            accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
            onFileChange={(file) => {
              setSelectedFile(file);
              setFileError('');
            }}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Alt text"
              placeholder="Accessible description for images"
              error={errors.alt?.message}
              {...register('alt', {
                maxLength: {
                  value: 150,
                  message: 'Alt text should be 150 characters or fewer',
                },
              })}
            />
            <Input
              label="Type"
              placeholder="image, pdf, resume, brochure"
              error={errors.type?.message}
              {...register('type', {
                maxLength: {
                  value: 80,
                  message: 'Type should be 80 characters or fewer',
                },
              })}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              {createMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(mediaPendingDelete)}
        title="Delete media item"
        description="This will remove the selected media record from your library and Cloudinary."
        confirmLabel="Delete media"
        isLoading={deleteMutation.isPending}
        onClose={() => setMediaPendingDelete(null)}
        onConfirm={() => {
          if (!mediaPendingDelete) return;
          deleteMutation.mutate(mediaPendingDelete._id, {
            onSuccess: () => setMediaPendingDelete(null),
          });
        }}
      />
    </div>
  );
};

const StatusCard = ({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) => (
  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/50 p-4">
    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
    <p className="mt-1 text-sm text-slate-400">{helper}</p>
  </div>
);

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default MediaPage;
