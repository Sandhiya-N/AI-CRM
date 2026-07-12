import { Bell, Globe, Moon, Shield, User } from 'lucide-react';
import { currentUser } from '../data/mockData';

const settingsSections = [
  {
    title: 'Profile',
    icon: User,
    items: [
      { label: 'Full Name', value: currentUser.name },
      { label: 'Role', value: currentUser.role },
      { label: 'Territory', value: currentUser.territory },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    toggles: [
      { label: 'Follow-up reminders', enabled: true },
      { label: 'New interaction alerts', enabled: true },
      { label: 'Weekly summary email', enabled: false },
    ],
  },
  {
    title: 'Preferences',
    icon: Globe,
    toggles: [
      { label: 'Dark mode', enabled: false, icon: Moon },
      { label: 'Auto-save drafts', enabled: true },
    ],
  },
  {
    title: 'Security',
    icon: Shield,
    items: [
      { label: 'Two-factor authentication', value: 'Disabled' },
      { label: 'Last login', value: 'Today, 9:15 AM' },
    ],
  },
];

function Toggle({ enabled }) {
  return (
    <button
      type="button"
      className={`relative h-6 w-11 rounded-full transition-colors ${
        enabled ? 'bg-primary-600' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <section.icon className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-slate-800">{section.title}</h3>
            </div>

            {section.items && (
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-b border-slate-50 py-2 last:border-0"
                  >
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-medium text-slate-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {section.toggles && (
              <div className="space-y-4">
                {section.toggles.map((toggle) => (
                  <div
                    key={toggle.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-slate-700">
                      {toggle.label}
                    </span>
                    <Toggle enabled={toggle.enabled} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
