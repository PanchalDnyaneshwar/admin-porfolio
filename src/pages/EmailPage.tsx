import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { AlertCircle, MailCheck } from 'lucide-react';
import { getEmailTemplates, getMailStatus, sendMail } from '@/apis/mail.api';
import type { SendMailPayload } from '@/types/mail.types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { getErrorMessage } from '@/utils/errors';
import { QUERY_KEYS } from '@/constants/queryKeys';
import Select from '@/components/ui/Select';
import RichTextEditor from '@/components/common/RichTextEditor';

const EmailPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SendMailPayload>({
    defaultValues: {
      to: '',
      subject: '',
      message: '',
      replyTo: '',
      html: '',
    },
  });

  const { data: templatesData } = useQuery({
    queryKey: QUERY_KEYS.emailTemplates,
    queryFn: getEmailTemplates,
  });
  const { data: mailStatusData } = useQuery({
    queryKey: [...QUERY_KEYS.emailTemplates, 'status'],
    queryFn: getMailStatus,
  });

  const templates = templatesData?.data ?? [];
  const mailStatus = mailStatusData?.data;

  const mutation = useMutation({
    mutationFn: sendMail,
    onSuccess: () => {
      toast.success('Email sent');
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const onSubmit = async (values: SendMailPayload) => {
    const html = values.html || '';
    const text = stripHtml(html);
    await mutation.mutateAsync({
      ...values,
      message: values.message || text,
      html: html || undefined,
    });
  };

  return (
    <Card className="max-w-3xl">
      <h3 className="text-lg font-semibold text-slate-100">Send Email</h3>
      <p className="mt-1 text-sm text-slate-400">
        Use SMTP to send a direct email to any recipient.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
        <div className="flex items-start gap-3">
          {mailStatus?.configured ? (
            <MailCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-300" />
          )}
          <div>
            <p className="font-medium text-slate-100">
              {mailStatus?.configured ? 'SMTP is configured' : 'SMTP needs attention'}
            </p>
            <p className="text-sm text-slate-400">
              {mailStatus?.configured
                ? `Using ${mailStatus.host}:${mailStatus.port} with sender ${mailStatus.from ?? 'not set'}.`
                : 'The backend needs valid SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM values before mail can be sent reliably.'}
            </p>
          </div>
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="To"
          type="email"
          placeholder="recipient@example.com"
          error={errors.to?.message}
          {...register('to', {
            required: 'Recipient email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid recipient email',
            },
          })}
        />
        <Select
          label="Template (optional)"
          onChange={(event) => {
            const templateId = event.target.value;
            const template = templates.find((item) => item._id === templateId);
            if (template) {
              setValue('subject', template.subject);
              setValue('html', template.html);
              setValue('message', stripHtml(template.html));
            }
          }}
        >
          <option value="">Select template</option>
          {templates.map((template) => (
            <option key={template._id} value={template._id}>
              {template.name}
            </option>
          ))}
        </Select>
        <Input
          label="Reply-To (optional)"
          type="email"
          placeholder="reply@example.com"
          error={errors.replyTo?.message}
          {...register('replyTo', {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid reply-to email',
            },
          })}
        />
        <Input
          label="Subject"
          error={errors.subject?.message}
          {...register('subject', {
            required: 'Subject is required',
            minLength: {
              value: 3,
              message: 'Subject should be at least 3 characters',
            },
          })}
        />
        <Textarea
          label="Plain text message (optional)"
          helperText="If left empty, we will generate from HTML content."
          {...register('message')}
        />
        <div>
          <label className="mb-2 block text-sm text-slate-200">HTML content</label>
          <Controller
            name="html"
            control={control}
            rules={{ required: 'HTML content is required' }}
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
                error={errors.html?.message}
              />
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? 'Sending...' : 'Send email'}
        </Button>
      </form>
    </Card>
  );
};

export default EmailPage;

const stripHtml = (value: string) => {
  if (!value) return '';
  const div = document.createElement('div');
  div.innerHTML = value;
  return div.textContent?.trim() || '';
};
