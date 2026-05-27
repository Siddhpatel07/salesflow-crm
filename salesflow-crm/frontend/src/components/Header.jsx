import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center text-slate-400 bg-slate-100 px-3 py-2 rounded-md w-96">
        <Search size={20} className="mr-2" />
        <input 
          type="text" 
          placeholder="Search leads, contacts, or deals..." 
          className="bg-transparent border-none outline-none w-full text-sm text-slate-700"
        />
      </div>

      <div className="flex items-center space-x-4 text-slate-500">
        <button className="hover:text-primary transition-colors">
          <Bell size={20} />
        </button>
        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}