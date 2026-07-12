import { NavLink } from 'react-router-dom';
import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  MessageSquarePlus,
  Settings,
  Stethoscope,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/log-interaction', label: 'Log Interaction', icon: MessageSquarePlus },
  { to: '/history', label: 'Interaction History', icon: ClipboardList },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/analytics', label: 'Analytics', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">MediCRM</h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-primary-600">
                HCP Platform
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map(({ to, label, icon, end }) => {
            const IconComponent = icon;

            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <IconComponent className="h-5 w-5 shrink-0" />
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-4 text-white">
            <p className="text-xs font-medium text-primary-100">AI Assistant</p>
            <p className="mt-1 text-sm font-semibold">Log faster with chat</p>
            <p className="mt-2 text-xs text-primary-200">
              Use natural language to record HCP interactions instantly.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
