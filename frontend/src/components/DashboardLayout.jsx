// The shared shell for every "logged in" page: a sidebar on the left,
// a top navbar, and the page's own content on the right.
// Each page just renders its content inside <DashboardLayout>...</DashboardLayout>
// instead of re-building this frame every time.

import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Plus, History, User, LogOut, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const SIDEBAR_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/new-analysis", label: "New Analysis", icon: Plus },
  { to: "/dashboard/history", label: "History", icon: History },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar - hidden on mobile, per the design doc's responsive rules */}
      <aside className="hidden md:flex md:w-60 flex-col border-r border-slate-800 bg-bg-secondary px-4 py-6">
        <div className="text-text-primary font-semibold text-lg px-2 mb-8">CodeFootPrint</div>
        <nav className="flex flex-col gap-1">
          {SIDEBAR_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="hidden sm:flex items-center gap-2 text-text-muted">
            <Search size={16} />
            <span className="text-sm">Search</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-text-secondary hidden sm:inline">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-error transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        {/* Mobile bottom navigation, per the design doc's mobile layout spec */}
        <nav className="md:hidden flex justify-around border-t border-slate-800 bg-bg-secondary py-2">
          {SIDEBAR_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs ${
                  isActive ? "text-primary" : "text-text-muted"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
