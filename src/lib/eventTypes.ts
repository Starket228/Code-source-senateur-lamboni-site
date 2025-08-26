
export interface UpcomingEventType {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  category: string;
}

export interface EventPhotoType {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  event_id?: string;
  date: string;
  photographer?: string;
}
