import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Contact, Building2, Briefcase, Activity, BookOpen } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Leads', path: '/', icon: Users },
    { name: 'Contacts', path: '/contacts', icon: Contact },
    { name: 'Accounts', path: '/accounts', icon: Building2 },
    { name: 'Ledgers', path: '/ledgers', icon: BookOpen },
    { name: 'Deals', path: '/deals', icon: Briefcase },
    { name: 'Activities', path: '/activities', icon: Activity },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4 md:flex flex-col hidden">
      <div className="text-2xl font-bold mb-8 text-md text-slate-300 px-2 mt-2">SalesFlow CRM</div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 hover:translate-x-2 transition-all duration-300"
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}