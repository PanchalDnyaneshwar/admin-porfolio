import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAdminProfile, createProfile } from '@/apis/profile.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Profile } from '@/types/profile.types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
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
    mutationFn: createProfile,
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
          {...register('email', { required: 'Email is required' })}
        />
        <Input label="Phone" {...register('phone')} />
        <Input label="Location" {...register('location')} />
        <Input label="Profile image URL" {...register('profileImage')} />
        <Input label="Resume URL" {...register('resumeUrl')} />
        <Textarea label="Short bio" {...register('shortBio')} className="md:col-span-2" />
        <Textarea label="Long bio" {...register('longBio')} className="md:col-span-2" />

        <div className="md:col-span-2">
          <h4 className="text-sm font-semibold text-slate-200">Social Links</h4>
        </div>
        <Input label="GitHub" {...register('socialLinks.github')} />
        <Input label="LinkedIn" {...register('socialLinks.linkedin')} />
        <Input label="Twitter" {...register('socialLinks.twitter')} />
        <Input label="Portfolio" {...register('socialLinks.portfolio')} />

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save profile'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfilePage;
