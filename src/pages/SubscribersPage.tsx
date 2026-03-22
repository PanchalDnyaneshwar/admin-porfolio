import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSubscribers } from '@/apis/subscriber.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import type { Subscriber } from '@/types/subscriber.types';
import Card from '@/components/ui/Card';
import DataTable from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { formatDate } from '@/lib/formatters';

const SubscribersPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.subscribers,
    queryFn: getSubscribers,
  });

  const columns = useMemo(
    () => [
      { header: 'Email', accessor: 'email' as const },
      {
        header: 'Subscribed',
        render: (row: Subscriber) => formatDate(row.createdAt),
      },
    ],
    [],
  );

  if (isLoading) return <LoadingState label="Loading subscribers..." />;
  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load subscribers"
        description="Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const subscribers = data.data;

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-slate-100">Newsletter Subscribers</h3>
        <p className="text-sm text-slate-400">Track people who subscribed to your updates.</p>
      </Card>

      {subscribers.length === 0 ? (
        <EmptyState title="No subscribers" description="New signups will appear here." />
      ) : (
        <DataTable data={subscribers} columns={columns} rowKey={(row) => row._id} />
      )}
    </div>
  );
};

export default SubscribersPage;
