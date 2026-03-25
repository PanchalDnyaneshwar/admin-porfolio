import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Inbox, MailCheck, MailOpen, Trash2 } from 'lucide-react';
import { deleteMessage, getMessages, updateMessage } from '@/apis/message.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { ContactMessage } from '@/types/message.types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getErrorMessage } from '@/utils/errors';
import { formatDateTime } from '@/lib/formatters';

const MessagesPage = () => {
  const [messagePendingDelete, setMessagePendingDelete] = useState<ContactMessage | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.messages,
    queryFn: getMessages,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ContactMessage> }) =>
      updateMessage(id, payload),
    onSuccess: () => {
      toast.success('Message updated');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      toast.success('Message deleted');
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const columns = useMemo(
    () => [
      { header: 'Name', accessor: 'name' as const },
      { header: 'Email', accessor: 'email' as const },
      { header: 'Subject', accessor: 'subject' as const },
      {
        header: 'Status',
        render: (row: ContactMessage) => (
          <Badge variant={row.isRead ? 'success' : 'warning'}>
            {row.isRead ? 'Read' : 'Unread'}
          </Badge>
        ),
      },
      {
        header: 'Received',
        render: (row: ContactMessage) => formatDateTime(row.createdAt),
      },
      {
        header: 'Message',
        render: (row: ContactMessage) => (
          <p className="max-w-xs text-xs leading-6 text-slate-400">{row.message}</p>
        ),
      },
      {
        header: 'Actions',
        render: (row: ContactMessage) => (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                updateMutation.mutate({ id: row._id, payload: { isRead: !row.isRead } })
              }
            >
              {row.isRead ? <MailOpen className="h-4 w-4" /> : <MailCheck className="h-4 w-4" />}
              {row.isRead ? 'Mark unread' : 'Mark read'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setMessagePendingDelete(row)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [updateMutation],
  );

  if (isLoading) return <LoadingState label="Loading messages..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load messages"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const messages = data.data;
  const unreadCount = messages.filter((message) => !message.isRead).length;

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Inbox</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-50">Messages</h3>
          <p className="mt-2 text-sm text-slate-400">Review contact form submissions and keep the inbox organized.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard icon={Inbox} label="Total messages" value={String(messages.length)} />
          <MetricCard icon={MailCheck} label="Unread" value={String(unreadCount)} />
        </div>
      </Card>

      {messages.length === 0 ? (
        <EmptyState title="No messages" description="Messages from the contact form will appear here." />
      ) : (
        <DataTable data={messages} columns={columns} rowKey={(row) => row._id} />
      )}

      <ConfirmDialog
        open={Boolean(messagePendingDelete)}
        title="Delete message"
        description="This will permanently remove the selected contact message."
        confirmLabel="Delete message"
        isLoading={deleteMutation.isPending}
        onClose={() => setMessagePendingDelete(null)}
        onConfirm={() => {
          if (!messagePendingDelete) return;
          deleteMutation.mutate(messagePendingDelete._id, {
            onSuccess: () => setMessagePendingDelete(null),
          });
        }}
      />
    </div>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Inbox;
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-slate-900 p-2 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-50">{value}</p>
      </div>
    </div>
  </div>
);

export default MessagesPage;
