
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Edit2, Plus, Trash2, FileText, Calendar, ArrowUpRight } from 'lucide-react';
import { useSite } from '@/context/SiteContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  bgColor: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  description,
  time,
  bgColor
}) => {
  return (
    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
      <div className={`${bgColor} p-1.5 sm:p-2 rounded-lg mt-0.5 flex-shrink-0`}>{icon}</div>
      <div className="flex-1 space-y-0.5 sm:space-y-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold leading-none text-gray-900 truncate">{title}</p>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{description}</p>
        <p className="text-xs text-gray-500 font-medium">{time}</p>
      </div>
    </div>
  );
};

const RecentActivity: React.FC = () => {
  const { newsCards, programs, activities, documents } = useSite();

  // Create a comprehensive list of recent activities based on real data with proper timestamps
  const recentItems = [
    // Add news items - use 'date' property from CardType
    ...newsCards.slice(0, 3).map(item => ({
      type: 'news',
      title: 'Actualité publiée',
      description: item.title,
      date: new Date(item.date || new Date()),
      icon: <Edit2 className="h-4 w-4 text-blue-500" />,
      bgColor: 'bg-blue-50'
    })),
    // Add programs - use 'date' property from CardType  
    ...programs.slice(0, 2).map(item => ({
      type: 'program', 
      title: 'Programme ajouté',
      description: item.title,
      date: new Date(item.date || new Date()),
      icon: <Plus className="h-4 w-4 text-green-500" />,
      bgColor: 'bg-green-50'
    })),
    // Add activities - use current date since ActivityType doesn't have timestamps
    ...activities.slice(0, 2).map(item => ({
      type: 'activity',
      title: 'Activité planifiée',
      description: item.title,
      date: new Date(), // Activities don't have precise dates in current structure
      icon: <Calendar className="h-4 w-4 text-amber-500" />,
      bgColor: 'bg-amber-50'
    })),
    // Add documents - use current date as fallback since DocumentType interface doesn't have timestamps
    ...documents.slice(0, 2).map(item => ({
      type: 'document',
      title: 'Document ajouté',
      description: item.title,
      date: new Date(), // DocumentType doesn't have date fields
      icon: <FileText className="h-4 w-4 text-purple-500" />,
      bgColor: 'bg-purple-50'
    }))
  ]
  // Sort by date (most recent first) and limit to 5 items
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 truncate">Activité récente</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600 hidden sm:block">Dernières actions sur le site</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="space-y-2 sm:space-y-4">
          {recentItems.length > 0 ? (
            recentItems.map((item, index) => (
              <ActivityItem
                key={`${item.type}-${index}`}
                icon={item.icon}
                title={item.title}
                description={item.description}
                time={formatDistanceToNow(item.date, { addSuffix: true, locale: fr })}
                bgColor={item.bgColor}
              />
            ))
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="font-medium text-sm sm:text-base">Aucune activité récente</p>
              <p className="text-xs sm:text-sm">Les dernières actions apparaîtront ici</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
