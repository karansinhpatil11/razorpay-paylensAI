import{
    LayoutDashboard,
    CreditCard,
    Search,
    AlertTriangle,
    BarChart3,
    Bot,
    Activity,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
    {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
    },
    {
    name: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    name: "Investigations",
    path: "/investigations",
    icon: Search,
  },
  {
    name: "Incidents",
    path: "/incidents",
    icon: AlertTriangle,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    name: "AI Investigator",
    path: "/ai-chat",
    icon: Bot,
  },
    
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 lg:block">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-22 items-center gap-3 border-b border-slate-800 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25">
            <Activity size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              PayLens
            </h1>

            <p className="text-xs text-slate-400">
              AI Payment Investigator
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />

                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold text-slate-200">
              System Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>

              <span className="text-xs text-slate-400">
                All systems operational
              </span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}

export default Sidebar;
