import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Mail, MapPin, Phone, Search } from 'lucide-react';

export default function Doctors() {
  const doctors = useSelector((state) => state.doctor.list);
  const [search, setSearch] = useState('');

  const filtered = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doctors</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your healthcare professional contacts directory.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                {doc.name.split(' ').slice(1).map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-800">{doc.name}</h3>
                <p className="text-sm text-primary-600">{doc.specialization}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{doc.hospital}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                {doc.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                {doc.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
