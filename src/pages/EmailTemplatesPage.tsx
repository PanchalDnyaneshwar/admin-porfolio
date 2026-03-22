import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplates,
  updateEmailTemplate,
} from '@/apis/mail.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { EmailTemplate } from '@/types/mail.types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Switch from '@/components/ui/Switch';
import Badge from '@/components/ui/Badge';
import RichTextEditor from '@/components/common/RichTextEditor';
import { getErrorMessage } from '@/utils/errors';

const EmailTemplatesPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.emailTemplates,
    queryFn: getEmailTemplates,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<EmailTemplate | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Partial<EmailTemplate>>({
    defaultValues: {
      name: '',
      subject: '',
      html: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (selected) {
        reset({ ...selected });
      } else {
        reset({ name: '', subject: '', html: '', isActive: true });
      }
    }
  }, [open, selected, reset]);

  const createMutation = useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      toast.success('Template saved');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<EmailTemplate> }) =>
      updateEmailTemplate(id, payload),
    onSuccess: () => {
      toast.success('Template updated');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      toast.success('Template deleted');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: Partial<EmailTemplate>) => {
    const payload = {
      ...values,
      isActive: Boolean(values.isActive),
    };

    if (selected) {
      await updateMutation.mutateAsync({ id: selected._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = useMemo(
    () => [
      { header: 'Name', accessor: 'name' as const },
      { header: 'Subject', accessor: 'subject' as const },
      {
        header: 'Status',
        render: (row: EmailTemplate) => (
          <Badge variant={row.isActive ? 'success' : 'warning'}>
            {row.isActive ? 'Active' : 'Hidden'}
          </Badge>
        ),
      },
      {
        header: 'Actions',
        render: (row: EmailTemplate) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelected(row);
                setOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Delete this template?')) {
                  deleteMutation.mutate(row._id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation],
  );

  if (isLoading) return <LoadingState label="Loading templates..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load templates"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const templates = data.data;

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Email Templates</h3>
          <p className="text-sm text-slate-400">
            Create reusable HTML templates for email campaigns.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add template
        </Button>
      </Card>

      {templates.length === 0 ? (
        <EmptyState title="No templates yet" description="Create your first email template." />
      ) : (
        <DataTable data={templates} columns={columns} rowKey={(row) => row._id} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={selected ? 'Edit template' : 'New template'}>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('isActive')} />
          <Input
            label="Template name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            label="Subject"
            error={errors.subject?.message}
            {...register('subject', { required: 'Subject is required' })}
          />
          <div>
            <label className="mb-2 block text-sm text-slate-200">HTML content</label>
            <Controller
              name="html"
              control={control}
              rules={{ required: 'HTML is required' }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.html?.message}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-slate-200">Active</span>
            <Switch checked={Boolean(watch('isActive'))} onChange={(value) => setValue('isActive', value)} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
              {selected ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmailTemplatesPage;
