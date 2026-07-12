import { useState } from 'react';
import { Bell, ChevronDown, Menu, Search, User } from 'lucide-react';
import { currentUser, notifications } from '../data/mockData';

export default function Navbar({ onMenuClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search doctors, interactions..."
            className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 transition-all placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 lg:w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative rounded-xl p-2.5 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  Notifications
                </h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`border-b border-slate-50 px-4 py-3 last:border-0 ${
                      !notif.read ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {notif.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {notif.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-100 sm:gap-3 sm:px-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-slate-800">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500">{currentUser.role}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-500">{currentUser.territory}</p>
              </div>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                My Profile
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                Account Settings
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
