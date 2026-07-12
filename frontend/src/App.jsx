import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LogInteraction from './pages/LogInteraction';
import InteractionHistory from './pages/InteractionHistory';
import Doctors from './pages/Doctors';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppLayout>
            <Dashboard />
          </AppLayout>
        }
      />
      <Route
        path="/log-interaction"
        element={
          <AppLayout>
            <LogInteraction />
          </AppLayout>
        }
      />
      <Route
        path="/history"
        element={
          <AppLayout>
            <InteractionHistory />
          </AppLayout>
        }
      />
      <Route
        path="/doctors"
        element={
          <AppLayout>
            <Doctors />
          </AppLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <AppLayout>
            <Analytics />
          </AppLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <AppLayout>
            <Settings />
          </AppLayout>
        }
      />
    </Routes>
  );
}
