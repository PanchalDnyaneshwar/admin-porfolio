import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createExperience,
  deleteExperience,
  getExperience,
  updateExperience,
} from '@/apis/experience.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Experience } from '@/types/experience.types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';
import Badge from '@/components/ui/Badge';
import { getErrorMessage } from '@/utils/errors';
import { listToString, toList } from '@/utils/arrays';
import { formatDate } from '@/lib/formatters';

interface ExperienceForm extends Omit<Experience, 'technologies'> {
  technologiesInput?: string;
}

const ExperiencePage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.experience,
    queryFn: getExperience,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Experience | null>(null);
  const [experiencePendingDelete, setExperiencePendingDelete] =
    useState<Experience | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceForm>({
    defaultValues: {
      companyName: '',
      role: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      technologiesInput: '',
      sortOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (selected) {
        reset({
          ...selected,
          technologiesInput: listToString(selected.technologies),
          endDate: selected.endDate ? selected.endDate.split('T')[0] : '',
          startDate: selected.startDate ? selected.startDate.split('T')[0] : '',
        });
      } else {
        reset({
          companyName: '',
          role: '',
          startDate: '',
          endDate: '',
          currentlyWorking: false,
          description: '',
          technologiesInput: '',
          sortOrder: 0,
          isActive: true,
        });
      }
    }
  }, [open, selected, reset]);

  const createMutation = useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      toast.success('Experience saved');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Experience> }) =>
      updateExperience(id, payload),
    onSuccess: () => {
      toast.success('Experience updated');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      toast.success('Experience deleted');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const currentlyWorking = Boolean(watch('currentlyWorking'));

  const onSubmit = async (values: ExperienceForm) => {
    const payload: Partial<Experience> = {
      companyName: values.companyName,
      role: values.role,
      startDate: values.startDate,
      endDate: values.currentlyWorking ? undefined : values.endDate || undefined,
      currentlyWorking: Boolean(values.currentlyWorking),
      description: values.description,
      technologies: toList(values.technologiesInput),
      sortOrder: Number(values.sortOrder ?? 0),
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
      { header: 'Company', accessor: 'companyName' as const },
      { header: 'Role', accessor: 'role' as const },
      {
        header: 'Duration',
        render: (row: Experience) =>
          row.currentlyWorking
            ? `${formatDate(row.startDate)} - Present`
            : `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`,
      },
      {
        header: 'Status',
        render: (row: Experience) => (
          <Badge variant={row.isActive ? 'success' : 'warning'}>
            {row.isActive ? 'Active' : 'Hidden'}
          </Badge>
        ),
      },
      {
        header: 'Actions',
        render: (row: Experience) => (
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
              onClick={() => setExperiencePendingDelete(row)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation],
  );

  if (isLoading) return <LoadingState label="Loading experience..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load experience"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const experiences = data.data;

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Experience</h3>
          <p className="text-sm text-slate-400">Track your work history and roles.</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add experience
        </Button>
      </Card>

      {experiences.length === 0 ? (
        <EmptyState title="No experience entries" description="Add your first role to showcase." />
      ) : (
        <DataTable data={experiences} columns={columns} rowKey={(row) => row._id} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={selected ? 'Edit experience' : 'New experience'}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('currentlyWorking')} />
          <input type="hidden" {...register('isActive')} />
          <Input
            label="Company"
            error={errors.companyName?.message}
            {...register('companyName', {
              required: 'Company is required',
              maxLength: {
                value: 120,
                message: 'Company should be 120 characters or fewer',
              },
            })}
          />
          <Input
            label="Role"
            error={errors.role?.message}
            {...register('role', {
              required: 'Role is required',
              maxLength: {
                value: 120,
                message: 'Role should be 120 characters or fewer',
              },
            })}
          />
          <Input
            label="Start date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate', { required: 'Start date is required' })}
          />
          <Input
            label="End date"
            type="date"
            disabled={currentlyWorking}
            error={errors.endDate?.message}
            {...register('endDate', {
              validate: (value) =>
                currentlyWorking || value ? true : 'End date is required unless currently working',
            })}
          />
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-slate-200">Currently working</span>
            <Switch
              checked={currentlyWorking}
              onCheckedChange={(value) => setValue('currentlyWorking', value)}
            />
          </div>
          <Input
            label="Sort order"
            type="number"
            error={errors.sortOrder?.message}
            {...register('sortOrder', {
              valueAsNumber: true,
              min: {
                value: 0,
                message: 'Sort order must be 0 or greater',
              },
            })}
          />
          <Textarea label="Description" {...register('description')} className="md:col-span-2" />
          <Input
            label="Technologies"
            helperText="Comma separated"
            {...register('technologiesInput')}
            className="md:col-span-2"
          />
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-slate-200">Active</span>
            <Switch
              checked={Boolean(watch('isActive'))}
              onCheckedChange={(value) => setValue('isActive', value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}>
              {selected ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(experiencePendingDelete)}
        title="Delete experience"
        description="This will permanently remove the selected experience entry from your profile."
        confirmLabel="Delete entry"
        isLoading={deleteMutation.isPending}
        onClose={() => setExperiencePendingDelete(null)}
        onConfirm={() => {
          if (!experiencePendingDelete) return;
          deleteMutation.mutate(experiencePendingDelete._id, {
            onSuccess: () => setExperiencePendingDelete(null),
          });
        }}
      />
    </div>
  );
};

export default ExperiencePage;
