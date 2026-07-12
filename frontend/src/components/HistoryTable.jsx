import { useDispatch, useSelector } from 'react-redux';
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Pencil,
  Trash2,
} from 'lucide-react';
import SearchBar from './SearchBar';
import {
  deleteInteraction,
  setSearchQuery,
  setStatusFilter,
  setPriorityFilter,
  setCurrentPage,
  selectPaginatedInteractions,
  selectTotalPages,
  selectFilteredCount,
} from '../redux/historySlice';
import { setEditingInteraction } from '../redux/interactionSlice';
import { statuses, priorities } from '../data/mockData';

const statusColors = {
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'Follow-up': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Scheduled: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  Cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
};

const priorityColors = {
  Low: 'text-slate-500',
  Medium: 'text-blue-600',
  High: 'text-amber-600',
  Urgent: 'text-red-600',
};

export default function HistoryTable() {
  const dispatch = useDispatch();
  const { searchQuery, statusFilter, priorityFilter, currentPage } =
    useSelector((state) => state.history);
  const interactions = useSelector(selectPaginatedInteractions);
  const totalPages = useSelector(selectTotalPages);
  const filteredCount = useSelector(selectFilteredCount);

  const handleEdit = (interaction) => {
    dispatch(setEditingInteraction(interaction));
    document.getElementById('interaction-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this interaction?')) {
      dispatch(deleteInteraction(id));
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Interaction History
            </h3>
            <p className="text-xs text-slate-500">
              {filteredCount} record{filteredCount !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar
            value={searchQuery}
            onChange={(value) => dispatch(setSearchQuery(value))}
            placeholder="Search doctors, hospitals, products..."
            className="w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="All">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-6 py-3 font-medium text-slate-600">Doctor</th>
              <th className="px-4 py-3 font-medium text-slate-600">Hospital</th>
              <th className="px-4 py-3 font-medium text-slate-600">
                Meeting Date
              </th>
              <th className="px-4 py-3 font-medium text-slate-600">
                Products
              </th>
              <th className="px-4 py-3 font-medium text-slate-600">Summary</th>
              <th className="px-4 py-3 font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {interactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  No interactions found. Try adjusting your search or filters.
                </td>
              </tr>
            ) : (
              interactions.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">
                        {item.doctorName}
                      </p>
                      <p
                        className={`text-xs ${priorityColors[item.priority] || 'text-slate-500'}`}
                      >
                        {item.priority} priority
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{item.hospital}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {formatDate(item.meetingDate)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.productsDiscussed.map((product) => (
                        <span
                          key={product}
                          className="rounded-md bg-primary-50 px-2 py-0.5 text-xs text-primary-700"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-4 text-slate-600">
                    {item.summary}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        statusColors[item.status] ||
                        'bg-slate-50 text-slate-600 ring-slate-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredCount > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                dispatch(setCurrentPage(Math.max(1, currentPage - 1)))
              }
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() =>
                dispatch(
                  setCurrentPage(Math.min(totalPages, currentPage + 1)),
                )
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
