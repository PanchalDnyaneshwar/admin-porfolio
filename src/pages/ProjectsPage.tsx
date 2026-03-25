import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createProject, deleteProject, getProjects, updateProject } from '@/apis/project.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Project } from '@/types/project.types';
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
import MediaPickerField from '@/components/common/MediaPickerField';
import { getErrorMessage } from '@/utils/errors';
import { listToString, toList } from '@/utils/arrays';

interface ProjectForm extends Omit<Project, 'images' | 'techStack'> {
  imagesInput?: string;
  techStackInput?: string;
}

const ProjectsPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: getProjects,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [projectPendingDelete, setProjectPendingDelete] = useState<Project | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
      thumbnail: '',
      imagesInput: '',
      techStackInput: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      sortOrder: 0,
      isPublished: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (selected) {
        reset({
          ...selected,
          imagesInput: listToString(selected.images),
          techStackInput: listToString(selected.techStack),
        });
      } else {
        reset({
          title: '',
          slug: '',
          shortDescription: '',
          fullDescription: '',
          category: '',
          thumbnail: '',
          imagesInput: '',
          techStackInput: '',
          liveUrl: '',
          githubUrl: '',
          featured: false,
          sortOrder: 0,
          isPublished: true,
        });
      }
    }
  }, [open, selected, reset]);

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success('Project saved');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Project> }) =>
      updateProject(id, payload),
    onSuccess: () => {
      toast.success('Project updated');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success('Project deleted');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: ProjectForm) => {
    const payload: Partial<Project> = {
      title: values.title,
      slug: values.slug || undefined,
      shortDescription: values.shortDescription,
      fullDescription: values.fullDescription || undefined,
      category: values.category || undefined,
      thumbnail: values.thumbnail || undefined,
      images: toList(values.imagesInput),
      techStack: toList(values.techStackInput),
      liveUrl: values.liveUrl || undefined,
      githubUrl: values.githubUrl || undefined,
      featured: Boolean(values.featured),
      sortOrder: Number(values.sortOrder ?? 0),
      isPublished: Boolean(values.isPublished),
    };

    if (selected) {
      await updateMutation.mutateAsync({ id: selected._id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  const columns = useMemo(
    () => [
      { header: 'Title', accessor: 'title' as const },
      { header: 'Category', accessor: 'category' as const },
      {
        header: 'Featured',
        render: (row: Project) => (
          <Badge variant={row.featured ? 'success' : 'warning'}>
            {row.featured ? 'Yes' : 'No'}
          </Badge>
        ),
      },
      {
        header: 'Published',
        render: (row: Project) => (
          <Badge variant={row.isPublished ? 'success' : 'warning'}>
            {row.isPublished ? 'Live' : 'Draft'}
          </Badge>
        ),
      },
      {
        header: 'Actions',
        render: (row: Project) => (
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
              onClick={() => setProjectPendingDelete(row)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation],
  );

  if (isLoading) return <LoadingState label="Loading projects..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load projects"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const projects = data.data;

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Projects</h3>
          <p className="text-sm text-slate-400">Manage featured and published work.</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add project
        </Button>
      </Card>

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Create your first project." />
      ) : (
        <DataTable data={projects} columns={columns} rowKey={(row) => row._id} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={selected ? 'Edit project' : 'New project'}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('featured')} />
          <input type="hidden" {...register('isPublished')} />
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 150,
                message: 'Title should be 150 characters or fewer',
              },
            })}
          />
          <Input label="Slug" helperText="Leave blank to auto-generate" {...register('slug')} />
          <Input label="Category" {...register('category')} />
          <div className="md:col-span-2">
            <MediaPickerField
              label="Thumbnail"
              value={watch('thumbnail')}
              helperText="Upload or choose the project cover image."
              resourceType="image"
              onChange={(value) => setValue('thumbnail', String(value), { shouldDirty: true })}
            />
          </div>
          <Input
            label="Live URL"
            error={errors.liveUrl?.message}
            {...register('liveUrl', {
              validate: (value) => !value || isValidUrl(value) || 'Live URL must be valid',
            })}
          />
          <Input
            label="GitHub URL"
            error={errors.githubUrl?.message}
            {...register('githubUrl', {
              validate: (value) => !value || isValidUrl(value) || 'GitHub URL must be valid',
            })}
          />
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
          <Textarea
            label="Short description"
            error={errors.shortDescription?.message}
            {...register('shortDescription', {
              required: 'Short description is required',
              maxLength: {
                value: 300,
                message: 'Short description should be 300 characters or fewer',
              },
            })}
            className="md:col-span-2"
          />
          <Textarea label="Full description" {...register('fullDescription')} className="md:col-span-2" />
          <div className="md:col-span-2">
            <MediaPickerField
              label="Project images"
              value={watch('imagesInput') ? toList(watch('imagesInput')) : []}
              helperText="Upload or choose one or more gallery images."
              resourceType="image"
              multiple
              onChange={(value) =>
                setValue('imagesInput', Array.isArray(value) ? value.join(', ') : String(value), {
                  shouldDirty: true,
                })
              }
            />
          </div>
          <Input
            label="Tech stack"
            helperText="Comma separated"
            {...register('techStackInput')}
            className="md:col-span-2"
          />
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-slate-200">Featured</span>
            <Switch
              checked={Boolean(watch('featured'))}
              onCheckedChange={(value) => setValue('featured', value)}
            />
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-slate-200">Published</span>
            <Switch
              checked={Boolean(watch('isPublished'))}
              onCheckedChange={(value) => setValue('isPublished', value)}
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
        open={Boolean(projectPendingDelete)}
        title="Delete project"
        description="This will permanently remove the selected project and its public listing."
        confirmLabel="Delete project"
        isLoading={deleteMutation.isPending}
        onClose={() => setProjectPendingDelete(null)}
        onConfirm={() => {
          if (!projectPendingDelete) return;
          deleteMutation.mutate(projectPendingDelete._id, {
            onSuccess: () => setProjectPendingDelete(null),
          });
        }}
      />
    </div>
  );
};

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export default ProjectsPage;
