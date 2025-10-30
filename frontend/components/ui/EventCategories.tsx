// components/EventCategories.tsx
"use client";
import { Music, Code, Microscope, Theater, Mic2, PartyPopper, CalendarDays, Gamepad } from 'lucide-react';
const categories = [
    { icon: <Music size={28} />, label: "Music Events" },
    { icon: <Code size={28} />, label: "Coding" },
    { icon: <Microscope size={28} />, label: "Science" },
    { icon: <Theater size={28} />, label: "Cultural" }
];

export default function EventCategories() {
    return (
<<<<<<< HEAD
        <section className="relative py-12 bg-gradient-to-br from-purple-50 to-blue-50">
            {/* Top Curve Divider */}
            <div className="absolute -top-[1px] left-0 right-0 text-white">
                <svg viewBox="0 0 1440 80" className="w-full h-20">
                    <path d="M0,32 C240,64 480,0 720,16 C960,32 1200,96 1440,64 L1440,0 L0,0 Z" fill="#ffffff" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {categories.map((cat, index) => (
                    <div key={index} className="flex flex-col items-center text-purple-700 hover:text-purple-900 cursor-pointer transition-colors">
                        <div className="mb-2">{cat.icon}</div>
                        <p className="font-semibold">{cat.label}</p>
                    </div>
                ))}
            </div>

            <div className="container my-8 mx-auto">
                <div className={`w-full max-w-7xl mx-auto flex flex-wrap justify-center gap-2 sm:gap-4`}>
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-violet-100 shadow-sm">
                        <Music className="w-5 h-5 text-purple-600 mr-2" />
                        <span>Music Events</span>
                    </div>
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                        <Mic2 className="w-5 h-5 text-indigo-600 mr-2" />
                        <span>Conferences</span>
                    </div>
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-100 shadow-sm">
                        <CalendarDays className="w-5 h-5 text-pink-600 mr-2" />
                        <span>Workshops</span>
                    </div>
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-100 shadow-sm">
                        <PartyPopper className="w-5 h-5 text-purple-600 mr-2" />
                        <span>Annual Celebration</span>
                    </div>
                    <div className="flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 shadow-sm">
                        <Gamepad className="w-5 h-5 text-blue-600 mr-2" />
                        <span>Games</span>
                    </div>
                </div>
            </div>

            {/* Bottom Curve Divider */}
            <div className="absolute -bottom-[1px] left-0 right-0 text-white">
                <svg viewBox="0 0 1440 80" className="w-full h-20 rotate-180">
                    <path d="M0,32 C240,64 480,0 720,16 C960,32 1200,96 1440,64 L1440,0 L0,0 Z" fill="#ffffff" />
                </svg>
            </div>
        </section>
=======
        <section className="py-8 bg-gradient-to-br from-purple-50 to-blue-50"
            style={{ backgroundImage: 'linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%)' }}
        >
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"> {categories.map((cat, index) => (<div key={index} className="flex flex-col items-center text-purple-700 hover:text-purple-900 cursor-pointer">
                <div className="mb-2">{cat.icon}</div>
                <p className="font-semibold">{cat.label}</p> </div>
            ))}
            </div>
            <div className="container my-6 mx-auto">
                <div className={`w-full max-w-7xl mx-auto flex flex-wrap justify-center gap-2 sm:gap-4`}>
                    <div className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                        <Music className="w-5 h-5 text-purple-600 mr-2" />
                        <span>Music Events</span>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                        <Mic2 className="w-5 h-5 text-blue-600 mr-2" />
                        <span>Conferences</span>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                        <CalendarDays className="w-5 h-5 text-pink-600 mr-2" />
                        <span>Workshops</span>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                        <PartyPopper className="w-5 h-5 text-pink-600 mr-2" />
                        <span>Annual Celebration</span>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200">
                        <Gamepad className="w-5 h-5 text-pink-600 mr-2" />
                        <span>Games</span>
                    </div>
                </div >
            </div>
        </section >
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
    );
}