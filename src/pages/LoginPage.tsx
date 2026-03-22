import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/appRoutes';
import { useAuth } from '@/hooks/useAuth';
import type { LoginPayload } from '@/types/auth.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.dashboard, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginPayload) => {
    const success = await login(data);
    if (success) {
      navigate(APP_ROUTES.dashboard, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-glow bg-grid px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-950/80 p-8 shadow-soft">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Portfolio</p>
          <h1 className="text-2xl font-semibold text-slate-100">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage your portfolio content.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="admin@portfolio.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
