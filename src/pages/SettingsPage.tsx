import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createSettings, getAdminSettings, updateSettings } from '@/apis/settings.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Settings } from '@/types/settings.types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import MediaPickerField from '@/components/common/MediaPickerField';
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
    setValue,
    watch,
    formState: { isSubmitting, errors },
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
    mutationFn: (values: Settings) => (data?.data ? updateSettings(values) : createSettings(values)),
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
        <div className="md:col-span-2">
          <MediaPickerField
            label="Logo"
            value={watch('logo')}
            helperText="Upload or choose the brand logo from media."
            resourceType="image"
            onChange={(value) => setValue('logo', String(value), { shouldDirty: true })}
          />
        </div>
        <div className="md:col-span-2">
          <MediaPickerField
            label="Favicon"
            value={watch('favicon')}
            helperText="Upload or choose the favicon image from media."
            resourceType="image"
            onChange={(value) => setValue('favicon', String(value), { shouldDirty: true })}
          />
        </div>
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
        <Input
          label="Contact email"
          error={errors.contactInfo?.email?.message}
          {...register('contactInfo.email', {
            validate: (value) =>
              !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Contact email must be valid',
          })}
        />
        <Input label="Contact phone" {...register('contactInfo.phone')} />
        <Input label="Location" {...register('contactInfo.location')} />
        <Input
          label="Map embed URL"
          helperText="Paste the map embed URL used on the public contact page"
          error={errors.contactInfo?.mapUrl?.message}
          {...register('contactInfo.mapUrl', {
            validate: (value) => !value || isValidUrl(value) || 'Map URL must be valid',
          })}
          className="md:col-span-2"
        />

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save settings'}
          </Button>
        </div>
      </form>
    </Card>
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

export default SettingsPage;
