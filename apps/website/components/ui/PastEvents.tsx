'use client';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import EventCard from './EventCard';
import { EventCategory } from '@/types';
 

const PastEvents = () => {

    const [events, setEvents] = useState<EventCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();


    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events?type=past`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                const data = await res.json();            
                setEvents(data.events || []);
            } catch (error: any) {
                // Handle connection errors or unexpected errors.
                toast({
                    title: "Error",
                    description: error?.message || "An unexpected error occurred.",
                    className: "bg-red-600 text-white border-0",
                });
                return;
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* The title and filter buttons  */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Past Events</h2>
                </div>

                {/* Loading or error states */}
                {/* {loading && <p className="text-center text-gray-500">Loading events...</p>}
                {error && <p className="text-center text-red-500">{error}</p>} */}

                {/* Card Network */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* {!loading &&
                        !error && */}
                    <AnimatePresence>
                        {events.slice(0, 6).map((event) => (
                            <motion.div
                                key={event._id as string}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                whileHover={{
                                    y: -5,
                                    transition: { type: 'spring', stiffness: 300 }
                                }}
                                className="relative group"
                            >
                                <EventCard event={event} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* زر عرض الكل */}
                <div className="text-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium"
                    >
                        <Link href="/events">See All Events</Link>
                    </motion.button>
                </div>
            </div>
        </section >
    );
};

export default PastEvents;