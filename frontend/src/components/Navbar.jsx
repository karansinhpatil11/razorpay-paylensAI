import { Bell, Search, User, Sparkles } from "lucide-react";

function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-18 border-b border-slate-200/80 bg-white/90 backdrop-blur lg:left-72">
      <div className="flex h-full items-center justify-between px-5 lg:px-8">

        {/* Search */}
        <div className="relative hidden w-96 md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search payments, incidents..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 lg:gap-5">

          <div className="hidden items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:flex"><Sparkles size={14} />AI monitoring live</div>

          <button className="relative text-slate-500 hover:text-slate-900">
            <Bell size={21} />

            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-3 lg:pl-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white">
              <User size={18} />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Payment Operations
              </p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
