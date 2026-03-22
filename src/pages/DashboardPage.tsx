import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/apis/dashboard.api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import { formatNumber } from '@/utils/formatNumbers';

const DashboardPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: getDashboardStats,
  });

  if (isLoading) return <LoadingState label="Loading dashboard..." />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description="Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = data.data;

  const cards = [
    { label: 'Projects', value: stats.totalProjects, hint: `${stats.totalPublishedProjects} published` },
    { label: 'Blogs', value: stats.totalBlogs, hint: `${stats.totalPublishedBlogs} published` },
    { label: 'Messages', value: stats.totalMessages, hint: `${stats.unreadMessages} unread` },
    { label: 'Subscribers', value: stats.totalSubscribers, hint: 'Newsletter list' },
    { label: 'Skills', value: stats.totalSkills, hint: 'Active skills' },
    { label: 'Experience', value: stats.totalExperience, hint: 'Work history' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="flex flex-col gap-2">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="text-3xl font-semibold text-slate-100">{formatNumber(card.value)}</p>
            <p className="text-xs text-slate-500">{card.hint}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-slate-100">Quick Actions</h3>
        <p className="mt-2 text-sm text-slate-400">
          Keep your portfolio fresh by publishing a new project, blog post, or updating your profile.
        </p>
      </Card>
    </div>
  );
};

export default DashboardPage;
