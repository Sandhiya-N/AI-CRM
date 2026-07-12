import { useSelector } from 'react-redux';
import { Calendar, CheckCircle2, Clock, Users } from 'lucide-react';
import HistoryTable from '../components/HistoryTable';

function StatCard({ icon, label, value, trend, color }) {
  const IconComponent = icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <IconComponent className="h-5 w-5" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-emerald-600">{trend}</span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const interactions = useSelector((state) => state.history.interactions);
  const doctors = useSelector((state) => state.doctor.list);

  const completedCount = interactions.filter(
    (i) => i.status === 'Completed',
  ).length;
  const followUpCount = interactions.filter(
    (i) => i.status === 'Follow-up',
  ).length;
  const scheduledCount = interactions.filter(
    (i) => i.status === 'Scheduled',
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back! Manage your HCP interactions efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Doctors"
          value={doctors.length}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Visits"
          value={completedCount}
          trend="+12% this month"
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={Clock}
          label="Pending Follow-ups"
          value={followUpCount}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={Calendar}
          label="Scheduled Meetings"
          value={scheduledCount}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <section>
        <HistoryTable />
      </section>
    </div>
  );
}
