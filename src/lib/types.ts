export interface CardType {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  tag: string;
  date: string;
  link: string;
}

export interface ProgramType {
  id: string;
  image: string;
  tag: string;
  title: string;
  description: string;
  link: string;
}

export interface ActivityType {
  id: string;
  title: string;
  description: string;
  date: {
    day: string;
    month: string;
  };
}

export interface HeroType {
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
}

export interface HeroDataType {
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
}

export interface HerosectionType {
  title: string;
  description: string;
  buttonText: string;
  backgroundImage: string;
}

export interface SettingsType {
  hero: HeroType;
  news: CardType[];
  programs: ProgramType[];
  activities: ActivityType[];
  documents: DocumentType[];
}

export interface SiteSettingsType {
  // General site settings
  siteName: string;
  logoText: string;
  subTitle: string;
  
  // Section titles and subtitles
  newsTitle: string;
  newsSubtitle: string;
  programsTitle: string;
  programsSubtitle: string;
  activitiesTitle: string;
  activitiesSubtitle: string;
  documentsTitle: string;
  documentsSubtitle: string;
  
  // Admin settings structure
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    logo: string;
    favicon: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
  };
  security: {
    maintenanceMode: boolean;
    forceHttps: boolean;
    loginAttempts: number;
    sessionTimeout: number;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    darkMode: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    lastBackup: string;
  };
}

export interface DocumentType {
  id: string;
  title: string;
  description: string;
  link: string;
  category?: string;
  created_at?: string;
}

export interface MediaItemType {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnail: string;
  link?: string;
}

export interface MediaType {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnail: string;
  media_type?: 'photo' | 'video' | 'audio';
  src?: string;
  duration?: string;
  link?: string;
}

export interface MessageType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: 'nouveau' | 'lu' | 'repondu' | 'archive';
  priority: 'normale' | 'haute' | 'urgente';
  starred: boolean;
  category: string;
  location?: string;
}

export interface SiteSettings {
  // General site settings
  siteName: string;
  logoText: string;
  subTitle: string;
  
  // Section titles and subtitles
  newsTitle: string;
  newsSubtitle: string;
  programsTitle: string;
  programsSubtitle: string;
  activitiesTitle: string;
  activitiesSubtitle: string;
  documentsTitle: string;
  documentsSubtitle: string;
  
  // Admin settings structure
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    logo: string;
    favicon: string;
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
  };
  security: {
    maintenanceMode: boolean;
    forceHttps: boolean;
    loginAttempts: number;
    sessionTimeout: number;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    darkMode: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    lastBackup: string;
  };
}
