import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createSettings, getAdminSettings } from '@/apis/settings.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Settings } from '@/types/settings.types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { getErrorMessage } from '@/utils/errors';

const SettingsPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: getAdminSettings,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Settings>({
    defaultValues: {
      seo: {},
      contactInfo: {},
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: createSettings,
    onSuccess: () => toast.success('Settings updated'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: Settings) => {
    await mutation.mutateAsync(values);
  };

  if (isLoading) return <LoadingState label="Loading settings..." />;

  const isNotFound = (error as { response?: { status?: number } } | undefined)?.response?.status === 404;

  if (isError && !isNotFound) {
    return (
      <ErrorState
        title="Unable to load settings"
        description="Please refresh or try again."
      />
    );
  }

  return (
    <Card className="max-w-4xl">
      <h3 className="text-lg font-semibold text-slate-100">Site Settings</h3>
      <p className="mt-1 text-sm text-slate-400">Manage your brand visuals and SEO defaults.</p>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Site title" {...register('siteTitle')} />
        <Input label="Primary color" {...register('primaryColor')} helperText="Hex or CSS color" />
        <Input label="Logo URL" {...register('logo')} />
        <Input label="Favicon URL" {...register('favicon')} />
        <Textarea label="Site description" {...register('siteDescription')} className="md:col-span-2" />

        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-slate-200">SEO</h4>
        </div>
        <Input label="Meta title" {...register('seo.metaTitle')} />
        <Input label="Meta keywords" {...register('seo.metaKeywords')} />
        <Textarea label="Meta description" {...register('seo.metaDescription')} className="md:col-span-2" />

        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-slate-200">Contact Info</h4>
        </div>
        <Input label="Contact email" {...register('contactInfo.email')} />
        <Input label="Contact phone" {...register('contactInfo.phone')} />
        <Input label="Location" {...register('contactInfo.location')} />

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save settings'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SettingsPage;
