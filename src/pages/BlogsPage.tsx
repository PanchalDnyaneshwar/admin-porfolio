import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createBlog, deleteBlog, getBlogs, updateBlog } from '@/apis/blog.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Blog } from '@/types/blog.types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';
import Badge from '@/components/ui/Badge';
import RichTextEditor from '@/components/common/RichTextEditor';
import { getErrorMessage } from '@/utils/errors';
import { listToString, toList } from '@/utils/arrays';
import { formatDate } from '@/lib/formatters';

interface BlogForm extends Omit<Blog, 'tags'> {
  tagsInput?: string;
}

const BlogsPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.blogs,
    queryFn: getBlogs,
  });

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Blog | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BlogForm>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      tagsInput: '',
      category: '',
      isPublished: false,
      publishedAt: '',
      readTime: 1,
    },
  });

  useEffect(() => {
    if (open) {
      if (selected) {
        reset({
          ...selected,
          tagsInput: listToString(selected.tags),
          publishedAt: selected.publishedAt ? selected.publishedAt.split('T')[0] : '',
        });
      } else {
        reset({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featuredImage: '',
          tagsInput: '',
          category: '',
          isPublished: false,
          publishedAt: '',
          readTime: 1,
        });
      }
    }
  }, [open, selected, reset]);

  const createMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success('Blog saved');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Blog> }) => updateBlog(id, payload),
    onSuccess: () => {
      toast.success('Blog updated');
      setOpen(false);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      toast.success('Blog deleted');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: BlogForm) => {
    const payload: Partial<Blog> = {
      title: values.title,
      slug: values.slug || undefined,
      excerpt: values.excerpt,
      content: values.content,
      featuredImage: values.featuredImage || undefined,
      tags: toList(values.tagsInput),
      category: values.category || undefined,
      isPublished: Boolean(values.isPublished),
      publishedAt: values.publishedAt || undefined,
      readTime: Number(values.readTime ?? 1),
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
        header: 'Published',
        render: (row: Blog) => (
          <Badge variant={row.isPublished ? 'success' : 'warning'}>
            {row.isPublished ? 'Live' : 'Draft'}
          </Badge>
        ),
      },
      {
        header: 'Date',
        render: (row: Blog) => formatDate(row.publishedAt || row.createdAt),
      },
      {
        header: 'Actions',
        render: (row: Blog) => (
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
                if (window.confirm('Delete this blog?')) {
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

  if (isLoading) return <LoadingState label="Loading blogs..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load blogs"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const blogs = data.data;

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Blogs</h3>
          <p className="text-sm text-slate-400">Write and manage your blog content.</p>
        </div>
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add blog
        </Button>
      </Card>

      {blogs.length === 0 ? (
        <EmptyState title="No blog posts" description="Publish your first article." />
      ) : (
        <DataTable data={blogs} columns={columns} rowKey={(row) => row._id} />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={selected ? 'Edit blog' : 'New blog'}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('isPublished')} />
          <Input
            label="Title"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <Input label="Slug" helperText="Leave blank to auto-generate" {...register('slug')} />
          <Input label="Category" {...register('category')} />
          <Input label="Featured image URL" {...register('featuredImage')} />
          <Input label="Read time (minutes)" type="number" {...register('readTime')} />
          <Input label="Publish date" type="date" {...register('publishedAt')} />
          <Input
            label="Tags"
            helperText="Comma separated"
            {...register('tagsInput')}
            className="md:col-span-2"
          />
          <Textarea
            label="Excerpt"
            error={errors.excerpt?.message}
            {...register('excerpt', { required: 'Excerpt is required' })}
            className="md:col-span-2"
          />
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-200">Content</label>
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.content?.message}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <span className="text-slate-200">Published</span>
            <Switch checked={Boolean(watch('isPublished'))} onChange={(value) => setValue('isPublished', value)} />
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

export default BlogsPage;
