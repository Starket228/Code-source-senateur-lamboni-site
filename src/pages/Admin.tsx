import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSite } from '@/context/SiteContext';
import { toast } from '@/components/ui/use-toast';
import { FileText, MessageSquare, Edit2, Plus, ArrowUpRight, User, Users, CalendarClock, Mail, RefreshCw, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { useSystemActions } from '@/hooks/use-system-actions';
import DashboardChart from '@/components/admin/DashboardChart';
import RecentActivity from '@/components/admin/RecentActivity';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    newsCards,
    programs,
    activities,
    documents,
    hero,
    settings,
    resetToDefault
  } = useSite();

  // Check if user is logged in on component mount
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setShowLoginDialog(true);
    }
  }, []);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would check credentials with a backend
    if (username === 'admin' && password === 'Mindi/S3n@teur!') {
      setIsLoggedIn(true);
      localStorage.setItem('isAdmin', 'true');
      setShowLoginDialog(false);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans le panneau d'administration moderne."
      });
    } else {
      setLoginError('Identifiant ou mot de passe incorrect');
    }
  };

  // Handle reset site data
  const handleResetData = () => {
    resetToDefault();
    toast({
      title: "Données réinitialisées",
      description: "Toutes les données du site ont été remises à leur état par défaut."
    });
  };

  // If this is the admin route (not a sub-route) and the user is logged in, show the dashboard
  const isAdminDashboard = location.pathname === '/admin' && isLoggedIn;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {isLoggedIn && <AdminSidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden w-full md:ml-0">
        {isLoggedIn && (
          <header className="bg-white/70 backdrop-blur-lg shadow-lg border-b border-white/20 z-10 p-4 md:p-6">
            <div className="px-0 md:px-6 py-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {isAdminDashboard ? 'Tableau de bord' : 'Administration'}
                  </h1>
                  <p className="text-sm text-gray-500">Administration site web du senateur</p>
                </div>
              </div>
            </div>
          </header>
        )}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {isLoggedIn ? (
            isAdminDashboard ? (
              <AdminDashboard 
                newsCount={newsCards.length} 
                programsCount={programs.length} 
                activitiesCount={activities.length} 
                documentsCount={documents.length} 
                onResetData={handleResetData} 
              />
            ) : (
              <Outlet />
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border-0">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Accès Administrateur
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Connectez-vous pour accéder au panneau d'administration moderne
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" 
                    onClick={() => setShowLoginDialog(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>
      
      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Connexion Administrateur
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Connectez-vous pour accéder au panneau d'administration.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-6 py-4">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {loginError}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700">
                Nom d'utilisateur
              </label>
              <Input 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                autoComplete="username" 
                className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Entrez votre nom d'utilisateur" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Mot de passe
              </label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                autoComplete="current-password" 
                className="h-12 bg-white/70 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Entrez votre mot de passe" 
              />
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface AdminDashboardProps {
  newsCount: number;
  programsCount: number;
  activitiesCount: number;
  documentsCount: number;
  onResetData: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  newsCount,
  programsCount,
  activitiesCount,
  documentsCount,
  onResetData
}) => {
  const navigate = useNavigate();
  const {
    exportContacts,
    generateReport,
    isExporting,
    isGenerating
  } = useSystemActions();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/800/400')] opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            <h2 className="text-2xl md:text-3xl font-bold">Bienvenue dans votre tableau de bord</h2>
          </div>
          <p className="text-blue-100 text-lg mb-6">Gérez votre site web avec des données en temps réel</p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="secondary" 
              className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30" 
              onClick={() => navigate('/admin/hero')}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Modifier l'accueil
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10" 
              onClick={() => navigate('/admin/news')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle actualité
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Actualités" 
          value={newsCount} 
          icon={<FileText className="h-6 w-6" />} 
          description="Articles publiés" 
          trend={newsCount > 0 ? `${newsCount} au total` : "Aucun article"} 
          trendUp={newsCount > 0} 
          color="blue" 
        />
        
        <StatCard 
          title="Programmes" 
          value={programsCount} 
          icon={<ArrowUpRight className="h-6 w-6" />} 
          description="Programmes actifs" 
          trend={programsCount > 0 ? `${programsCount} disponibles` : "Aucun programme"} 
          trendUp={programsCount > 0} 
          color="emerald" 
        />
        
        <StatCard 
          title="Activités" 
          value={activitiesCount} 
          icon={<CalendarClock className="h-6 w-6" />} 
          description="Événements planifiés" 
          trend={activitiesCount > 0 ? `${activitiesCount} programmées` : "Aucune activité"} 
          trendUp={activitiesCount > 0} 
          color="amber" 
        />
        
        <StatCard 
          title="Documents" 
          value={documentsCount} 
          icon={<FileText className="h-6 w-6" />} 
          description="Fichiers disponibles" 
          trend={documentsCount > 0 ? `${documentsCount} téléchargeables` : "Aucun document"} 
          trendUp={documentsCount > 0} 
          color="purple" 
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardChart 
            newsCount={newsCount}
            programsCount={programsCount}
            activitiesCount={activitiesCount}
            documentsCount={documentsCount}
          />
        </div>
        
        <RecentActivity />
      </div>
      
      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Espace réservé pour de futurs graphiques */}
        </div>
        
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Actions système</CardTitle>
                <CardDescription className="text-gray-600">Gestion avancée</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:from-red-100 hover:to-pink-100 text-red-700 hover:text-red-800" 
              onClick={onResetData}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser les données
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 hover:from-blue-100 hover:to-cyan-100 text-blue-700 hover:text-blue-800" 
              onClick={exportContacts} 
              disabled={isExporting}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isExporting ? 'Exportation...' : 'Exporter les contacts'}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 hover:from-purple-100 hover:to-indigo-100 text-purple-700 hover:text-purple-800" 
              onClick={generateReport} 
              disabled={isGenerating}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isGenerating ? 'Génération...' : 'Générer un rapport'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  trend: string;
  trendUp: boolean | null;
  color: 'blue' | 'emerald' | 'amber' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  trendUp,
  color
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500'
  };

  let trendColor = 'text-gray-500';
  if (trendUp === true) trendColor = 'text-green-600';
  if (trendUp === false) trendColor = 'text-red-500';

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
        <div className={`w-10 h-10 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-1">
          {value}
        </div>
        <p className="text-xs text-gray-500 mb-2">{description}</p>
        <div className="flex items-center gap-1">
          {trendUp !== null && (
            <TrendingUp className={`w-3 h-3 ${trendUp ? 'text-green-500 rotate-0' : 'text-red-500 rotate-180'}`} />
          )}
          <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;
