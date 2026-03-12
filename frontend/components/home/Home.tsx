import { HeroSection } from '@/components/ui/HeroSection';
import EventCategories from '@/components/ui/EventCategories';
import UpcomingEvents from '@/components/ui/UpcomingEvents';
import AddEventSection from '@/components/ui/AddEventSection';
import ReviewsSection from '@/components/ui/ReviewsSection';

export default function EventHome({
  initialUpcomingEvents,
}: {
  initialUpcomingEvents?: any[];
}) {
  return (
    <main className='bg-white text-gray-800'>
      <HeroSection />
      <EventCategories />
      <UpcomingEvents initialEvents={initialUpcomingEvents as any} />
      <AddEventSection />
      {/* <PastEvents /> */}
      <ReviewsSection />
    </main>
  );
}
