import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  UserCheck, 
  Bell, 
  LogOut, 
  CreditCard, 
  MessageSquare, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Menu,
  Globe
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
  children?: { path: string; label: string }[];
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['management', 'content', 'finance', 'system']);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => 
      prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      id: 'overview',
      title: 'Overview',
      items: [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      ]
    },
    {
      id: 'management',
      title: 'Management',
      items: [
        { path: '/admin/members', icon: Users, label: 'Members' },
        { path: '/admin/leadership', icon: UserCheck, label: 'Leadership' },
      ]
    },
    {
      id: 'content',
      title: 'Content',
      items: [
        { path: '/admin/publications', icon: FileText, label: 'Publications' },
        { path: '/admin/events', icon: Calendar, label: 'Events' },
      ]
    },
    {
      id: 'finance',
      title: 'Finance',
      items: [
        { path: '/admin/finance', icon: CreditCard, label: 'Dues & Payments' },
      ]
    },
    {
      id: 'system',
      title: 'System',
      items: [
        { path: '/admin/communication', icon: MessageSquare, label: 'Communication' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white fixed h-full z-20 transition-all duration-300 flex flex-col shadow-xl`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between h-16">
          {sidebarOpen ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-slate-900 font-bold">L</div>
              <div>
                <h1 className="font-bold text-white leading-none">LAG Admin</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">System v2.0</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
               <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-slate-900 font-bold">L</div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-6 px-3">
            {navGroups.map((group) => (
              <div key={group.id}>
                {sidebarOpen && group.title !== 'Overview' && (
                  <div 
                    className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3 cursor-pointer hover:text-slate-300"
                    onClick={() => toggleMenu(group.id)}
                  >
                    <span>{group.title}</span>
                    {expandedMenus.includes(group.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </div>
                )}
                
                {(group.title === 'Overview' || expandedMenus.includes(group.id) || !sidebarOpen) && (
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={!sidebarOpen ? item.label : ''}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive(item.path) 
                            ? 'bg-yellow-500 text-slate-900 font-medium shadow-md' 
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-5 h-5 ${!sidebarOpen ? 'mx-auto' : 'mr-3'} ${isActive(item.path) ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'}`} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <button 
            onClick={handleSignOut}
            className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 w-full rounded-lg transition-colors`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {navGroups.flatMap(g => g.items).find(i => isActive(i.path))?.label || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hidden md:flex items-center text-sm text-gray-500 hover:text-yellow-600 mr-2">
              <Globe className="w-4 h-4 mr-1" />
              View Website
            </Link>
            
            <button className="p-2 text-gray-500 hover:text-yellow-600 relative hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-9 h-9 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
