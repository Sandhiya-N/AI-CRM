import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import HistoryTable from '../components/HistoryTable';
import { loadHistory } from '../redux/historySlice';

export default function InteractionHistory() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Interaction History
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View, search, and manage all your HCP interaction records.
        </p>
      </div>
      <HistoryTable />
    </div>
  );
}
