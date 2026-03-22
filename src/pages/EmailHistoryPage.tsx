import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEmailLogs } from '@/apis/mail.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { EmailLog } from '@/types/mail.types';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import Badge from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/formatters';

const EmailHistoryPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.emailLogs,
    queryFn: getEmailLogs,
  });

  const columns = useMemo(
    () => [
      { header: 'To', accessor: 'to' as const },
      { header: 'Subject', accessor: 'subject' as const },
      {
        header: 'Status',
        render: (row: EmailLog) => (
          <Badge variant={row.status === 'SENT' ? 'success' : 'danger'}>
            {row.status}
          </Badge>
        ),
      },
      {
        header: 'Sent at',
        render: (row: EmailLog) => formatDateTime(row.createdAt),
      },
      {
        header: 'Error',
        render: (row: EmailLog) => (
          <span className="text-xs text-slate-400">{row.error || '—'}</span>
        ),
      },
    ],
    [],
  );

  if (isLoading) return <LoadingState label="Loading email history..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load email history"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const logs = data.data;

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-slate-100">Email History</h3>
        <p className="text-sm text-slate-400">Review previously sent emails and failures.</p>
      </Card>

      {logs.length === 0 ? (
        <EmptyState title="No email history" description="Send an email to see it logged here." />
      ) : (
        <DataTable data={logs} columns={columns} rowKey={(row) => row._id} />
      )}
    </div>
  );
};

export default EmailHistoryPage;
