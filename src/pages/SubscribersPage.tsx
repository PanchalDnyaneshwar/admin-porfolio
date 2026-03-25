import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, Users } from 'lucide-react';
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
      <Card className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Audience</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-50">Newsletter Subscribers</h3>
          <p className="mt-2 text-sm text-slate-400">Track who wants to hear from you and monitor growth over time.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard icon={Users} label="Subscribers" value={String(subscribers.length)} />
          <MetricCard icon={Mail} label="Latest signup" value={subscribers[0]?.createdAt ? formatDate(subscribers[0].createdAt) : 'N/A'} />
        </div>
      </Card>

      {subscribers.length === 0 ? (
        <EmptyState title="No subscribers" description="New signups will appear here." />
      ) : (
        <DataTable data={subscribers} columns={columns} rowKey={(row) => row._id} />
      )}
    </div>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
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

export default SubscribersPage;
