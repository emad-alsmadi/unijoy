import { HallType } from "./hall";
import { HostCategory } from "./host";

export interface EventCategory {
  _id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  startDate: string;
  endDate: string;
  location: string;
  price?: number;
  capacity: number;
  status: 'pending' | 'approved' | 'rejected' | 'upcoming' | 'past';
  image: string;

  hall?: HallType | null;
  category?: HostCategory | null;
  host: string | { _id: string; name?: string };
  registeredUsers: string[];
  createdAt: string;
  updatedAt: string;
  isRegistered?: boolean;
}

export interface EventItem {
  id: number;
  name: string;
  date: string;
  organizer: string;
  status: string;
}
