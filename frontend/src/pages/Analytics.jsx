import { useSelector } from 'react-redux';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { statuses, priorities } from '../data/mockData';

export default function Analytics() {
  const interactions = useSelector((state) => state.history.interactions);

  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = interactions.filter((i) => i.status === status).length;
    return acc;
  }, {});

  const priorityCounts = priorities.reduce((acc, priority) => {
    acc[priority] = interactions.filter((i) => i.priority === priority).length;
    return acc;
  }, {});

  const maxStatus = Math.max(...Object.values(statusCounts), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your HCP engagement metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">
              Interactions by Status
            </h3>
          </div>
          <div className="space-y-4">
            {statuses.map((status) => (
              <div key={status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{status}</span>
                  <span className="font-medium text-slate-800">
                    {statusCounts[status]}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{
                      width: `${(statusCounts[status] / maxStatus) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">
              Interactions by Priority
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {priorities.map((priority) => (
              <div
                key={priority}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center"
              >
                <p className="text-2xl font-bold text-slate-800">
                  {priorityCounts[priority]}
                </p>
                <p className="mt-1 text-sm text-slate-500">{priority}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-slate-800">Engagement Summary</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-primary-50 p-4 text-center">
              <p className="text-3xl font-bold text-primary-700">
                {interactions.length}
              </p>
              <p className="mt-1 text-sm text-primary-600">
                Total Interactions
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700">
                {(
                  (statusCounts.Completed / interactions.length) *
                  100
                ).toFixed(0)}
                %
              </p>
              <p className="mt-1 text-sm text-emerald-600">Completion Rate</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <p className="text-3xl font-bold text-amber-700">
                {priorityCounts.High + priorityCounts.Urgent}
              </p>
              <p className="mt-1 text-sm text-amber-600">
                High Priority Items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
