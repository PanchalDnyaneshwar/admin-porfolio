import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createProfile, getAdminProfile, updateProfile } from '@/apis/profile.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Profile } from '@/types/profile.types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import MediaPickerField from '@/components/common/MediaPickerField';
import { getErrorMessage } from '@/utils/errors';

const ProfilePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: getAdminProfile,
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Profile>({
    defaultValues: {
      fullName: '',
      title: '',
      email: '',
      socialLinks: {},
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (values: Profile) => (data?.data ? updateProfile(values) : createProfile(values)),
    onSuccess: () => toast.success('Profile saved'),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: Profile) => {
    await mutation.mutateAsync(values);
  };

  if (isLoading) return <LoadingState label="Loading profile..." />;

  const isNotFound = (error as { response?: { status?: number } } | undefined)?.response?.status === 404;

  if (isError && !isNotFound) {
    return (
      <ErrorState
        title="Unable to load profile"
        description="Please refresh or try again."
      />
    );
  }

  return (
    <Card className="max-w-4xl">
      <h3 className="text-lg font-semibold text-slate-100">Profile Details</h3>
      <p className="mt-1 text-sm text-slate-400">
        Update your public identity, social links, and bio content.
      </p>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full name"
          error={errors.fullName?.message}
          {...register('fullName', { required: 'Full name is required' })}
        />
        <Input
          label="Title"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        <Input label="Phone" {...register('phone')} />
        <Input label="Location" {...register('location')} />
        <div className="md:col-span-2">
          <MediaPickerField
            label="Profile image"
            value={watch('profileImage')}
            helperText="Upload or choose an image from the media library."
            resourceType="image"
            onChange={(value) => setValue('profileImage', String(value), { shouldDirty: true })}
          />
        </div>
        <div className="md:col-span-2">
          <MediaPickerField
            label="Resume document"
            value={watch('resumeUrl')}
            helperText="Upload or choose a PDF/document from the media library."
            resourceType="raw"
            onChange={(value) => setValue('resumeUrl', String(value), { shouldDirty: true })}
          />
        </div>
        <Textarea label="Short bio" {...register('shortBio')} className="md:col-span-2" />
        <Textarea label="Long bio" {...register('longBio')} className="md:col-span-2" />

        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-slate-200">Social Links</h4>
        </div>
        <Input
          label="GitHub"
          error={errors.socialLinks?.github?.message}
          {...register('socialLinks.github', {
            validate: (value) => !value || isValidUrl(value) || 'GitHub URL must be valid',
          })}
        />
        <Input
          label="LinkedIn"
          error={errors.socialLinks?.linkedin?.message}
          {...register('socialLinks.linkedin', {
            validate: (value) => !value || isValidUrl(value) || 'LinkedIn URL must be valid',
          })}
        />
        <Input
          label="Twitter"
          error={errors.socialLinks?.twitter?.message}
          {...register('socialLinks.twitter', {
            validate: (value) => !value || isValidUrl(value) || 'Twitter URL must be valid',
          })}
        />
        <Input
          label="Portfolio"
          error={errors.socialLinks?.portfolio?.message}
          {...register('socialLinks.portfolio', {
            validate: (value) => !value || isValidUrl(value) || 'Portfolio URL must be valid',
          })}
        />

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save profile'}
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

export default ProfilePage;
