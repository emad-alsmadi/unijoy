export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  hostStatus?: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  registeredEvents: any[]; // ممكن تعمل لها type خاص لاحقاً
  createdEvents: any[];
  profileInfo?: string;
  hostCategory?: string;
}
export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}