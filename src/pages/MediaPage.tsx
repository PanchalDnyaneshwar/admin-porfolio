import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createMedia, deleteMedia, getMedia } from '@/apis/media.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Media } from '@/types/media.types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { getErrorMessage } from '@/utils/errors';
import { formatDate } from '@/lib/formatters';

const MediaPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.media,
    queryFn: getMedia,
  });

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<Media>>({
    defaultValues: {
      url: '',
      alt: '',
      type: '',
      publicId: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        url: '',
        alt: '',
        type: '',
        publicId: '',
      });
    }
  }, [open, reset]);

  const createMutation = useMutation({
    mutationFn: createMedia,
    onSuccess: () => {
      toast.success('Media uploaded');
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

  const onSubmit = async (values: Partial<Media>) => {
    await createMutation.mutateAsync(values);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Preview',
        render: (row: Media) => (
          <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-800">
            <img src={row.url} alt={row.alt ?? 'media'} className="h-full w-full object-cover" />
          </div>
        ),
      },
      { header: 'Alt text', accessor: 'alt' as const },
      { header: 'Type', accessor: 'type' as const },
      {
        header: 'Uploaded',
        render: (row: Media) => formatDate(row.createdAt),
      },
      {
        header: 'Actions',
        render: (row: Media) => (
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Delete this media item?')) {
                deleteMutation.mutate(row._id);
              }
            }}
          >
            Delete
          </Button>
        ),
      },
    ],
    [deleteMutation],
  );

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

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Media Library</h3>
          <p className="text-sm text-slate-400">Store images and assets used across the site.</p>
        </div>
        <Button onClick={() => setOpen(true)}>Upload media</Button>
      </Card>

      {media.length === 0 ? (
        <EmptyState title="No media files" description="Upload assets for your portfolio." />
      ) : (
        <DataTable data={media} columns={columns} rowKey={(row) => row._id} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Upload media">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Media URL"
            error={errors.url?.message}
            {...register('url', { required: 'URL is required' })}
            className="md:col-span-2"
          />
          <Input label="Alt text" {...register('alt')} />
          <Input label="Type" placeholder="image, video" {...register('type')} />
          <Input label="Public ID" {...register('publicId')} />

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MediaPage;
