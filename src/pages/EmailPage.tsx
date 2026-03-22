import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getEmailTemplates, sendMail } from '@/apis/mail.api';
import type { EmailTemplate, SendMailPayload } from '@/types/mail.types';
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

  const templates = templatesData?.data ?? [];

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

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="To"
          type="email"
          placeholder="recipient@example.com"
          error={errors.to?.message}
          {...register('to', { required: 'Recipient email is required' })}
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
          {...register('replyTo')}
        />
        <Input
          label="Subject"
          error={errors.subject?.message}
          {...register('subject', { required: 'Subject is required' })}
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
