import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createSkill, deleteSkill, getSkills, updateSkill } from '@/apis/skill.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Skill, SkillCategory } from '@/types/skill.types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Badge from '@/components/ui/Badge';
import { getErrorMessage } from '@/utils/errors';

const SKILL_CATEGORIES: SkillCategory[] = [
  'LANGUAGES',
  'FRONTEND',
  'BACKEND',
  'DATABASES',
  'TOOLS',
  'DEVOPS',
  'OTHER',
];

const SkillsPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.skills,
    queryFn: getSkills,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Skill | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Partial<Skill>>({
    defaultValues: {
      name: '',
      category: 'FRONTEND',
      sortOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (selected) {
        reset({
          ...selected,
        });
      } else {
        reset({
          name: '',
          category: 'FRONTEND',
          level: '',
          icon: '',
          sortOrder: 0,
          isActive: true,
        });
      }
    }
  }, [open, selected, reset]);

  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      toast.success('Skill saved');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Skill> }) => updateSkill(id, payload),
    onSuccess: () => {
      toast.success('Skill updated');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      toast.success('Skill deleted');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: Partial<Skill>) => {
    const payload = {
      ...values,
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
      { header: 'Name', accessor: 'name' as const },
      { header: 'Category', accessor: 'category' as const },
      { header: 'Level', accessor: 'level' as const },
      {
        header: 'Status',
        render: (row: Skill) => (
          <Badge variant={row.isActive ? 'success' : 'warning'}>
            {row.isActive ? 'Active' : 'Hidden'}
          </Badge>
        ),
      },
      { header: 'Order', accessor: 'sortOrder' as const },
      {
        header: 'Actions',
        render: (row: Skill) => (
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
                if (window.confirm('Delete this skill?')) {
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

  if (isLoading) return <LoadingState label="Loading skills..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load skills"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const skills = data.data;

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Skills</h3>
          <p className="text-sm text-slate-400">Manage the skills displayed on your portfolio.</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add skill
        </Button>
      </Card>

      {skills.length === 0 ? (
        <EmptyState title="No skills yet" description="Add your first skill to get started." />
      ) : (
        <DataTable data={skills} columns={columns} rowKey={(row) => row._id} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={selected ? 'Edit skill' : 'New skill'}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('isActive')} />
          <Input
            label="Skill name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Select label="Category" {...register('category')}>
            {SKILL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Input label="Level" {...register('level')} />
          <Input label="Icon" {...register('icon')} />
          <Input label="Sort order" type="number" {...register('sortOrder')} />
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-slate-200">Active</span>
            <Switch checked={Boolean(watch('isActive'))} onChange={(value) => setValue('isActive', value)} />
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
    </div>
  );
};

export default SkillsPage;
