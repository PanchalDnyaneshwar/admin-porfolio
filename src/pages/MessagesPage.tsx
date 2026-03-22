import { useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
import { getErrorMessage } from '@/utils/errors';
import { formatDateTime } from '@/lib/formatters';

const MessagesPage = () => {
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
        header: 'Actions',
        render: (row: ContactMessage) => (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateMutation.mutate({ id: row._id, payload: { isRead: !row.isRead } })}
            >
              {row.isRead ? 'Mark unread' : 'Mark read'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm('Delete this message?')) {
                  deleteMutation.mutate(row._id);
                }
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
      {
        header: 'Message',
        render: (row: ContactMessage) => (
          <p className="max-w-xs text-xs text-slate-400">{row.message}</p>
        ),
      },
    ],
    [deleteMutation, updateMutation],
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

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Messages</h3>
          <p className="text-sm text-slate-400">Review contact form submissions.</p>
        </div>
      </Card>

      {messages.length === 0 ? (
        <EmptyState title="No messages" description="Messages from the contact form will appear here." />
      ) : (
        <DataTable data={messages} columns={columns} rowKey={(row) => row._id} />
      )}
    </div>
  );
};

export default MessagesPage;
