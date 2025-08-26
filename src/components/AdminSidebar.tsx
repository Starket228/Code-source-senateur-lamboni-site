import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Target, Calendar, FileText, Image, MessageSquare, Home, LogOut, ChevronLeft, ChevronRight, HeartHandshake, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  useEffect(() => {
    // Collapse sidebar by default on mobile
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);
  useEffect(() => {
    // Close mobile sidebar when changing routes
    setMobileSidebarOpen(false);
  }, [location]);
  const navItems = [{
    icon: LayoutDashboard,
    label: 'Tableau de bord',
    path: '/admin'
  }, {
    icon: Newspaper,
    label: 'Actualités',
    path: '/admin/news'
  }, {
    icon: Target,
    label: 'Programmes',
    path: '/admin/programs'
  }, {
    icon: Calendar,
    label: 'Activités',
    path: '/admin/activities'
  }, {
    icon: FileText,
    label: 'Documents',
    path: '/admin/documents'
  }, {
    icon: HeartHandshake,
    label: 'Hero Section',
    path: '/admin/hero'
  }, {
    icon: User,
    label: 'À propos',
    path: '/admin/about'
  }, {
    icon: Image,
    label: 'Médias',
    path: '/admin/media'
  }, {
    icon: MessageSquare,
    label: 'Messages',
    path: '/admin/messages'
  }];
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
  };

  // For mobile: show a button to open the sidebar when closed
  if (isMobile && !mobileSidebarOpen) {
    return <Button variant="outline" size="icon" onClick={toggleMobileSidebar} className="fixed top-4 left-4 z-50 md:hidden">
        <Menu size={20} />
      </Button>;
  }
  return <div className={cn("h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col", "fixed md:static top-0 left-0 z-40", isMobile ? mobileSidebarOpen ? "w-64" : "w-0 -translate-x-full" : collapsed ? "w-20" : "w-64")}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {(!collapsed || isMobile && mobileSidebarOpen) && <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>}
        <Button variant="ghost" size="icon" onClick={isMobile ? toggleMobileSidebar : toggleSidebar} className={cn("rounded-full", collapsed && !isMobile ? "mx-auto" : "")}>
          {isMobile ? <ChevronLeft size={20} /> : collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => <li key={index}>
              <Link to={item.path} className={cn("flex items-center py-2 px-3 rounded-md transition-colors", isActive(item.path) ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100", collapsed && !isMobile ? "justify-center" : "justify-start")}>
                <item.icon size={20} className={cn((!collapsed || isMobile) && "mr-3")} />
                {(!collapsed || isMobile && mobileSidebarOpen) && <span>{item.label}</span>}
              </Link>
            </li>)}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        
        
        <div className="flex space-x-2">
          <Link to="/" className={cn("flex items-center justify-center rounded-md transition-colors py-2", collapsed && !isMobile ? "w-full" : "px-3", "bg-gray-100 text-gray-700 hover:bg-gray-200")}>
            <Home size={18} className={cn((!collapsed || isMobile) && "mr-2")} />
            {(!collapsed || isMobile && mobileSidebarOpen) && <span>Site</span>}
          </Link>
          
          <Button variant="destructive" size={collapsed && !isMobile ? "icon" : "default"} onClick={handleLogout} className={cn("py-2", collapsed && !isMobile ? "w-full" : "px-3")}>
            <LogOut size={18} className={cn((!collapsed || isMobile) && "mr-2")} />
            {(!collapsed || isMobile && mobileSidebarOpen) && <span>Déconnexion</span>}
          </Button>
        </div>
      </div>
    </div>;
};
export default AdminSidebar;
