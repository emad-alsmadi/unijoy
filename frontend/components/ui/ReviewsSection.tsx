// components/ReviewsSection.tsx 
const reviews = [{ name: "Sara Ahmed", university: "NSU", review: "One of the best organized tech events I’ve attended! Loved the speakers and the energy." }, { name: "Tariq Hasan", university: "IUB", review: "Great chance to meet fellow developers and showcase our hackathon project." }, { name: "Rima Chowdhury", university: "BRAC", review: "A colorful event full of talent and culture. Waiting for the next one!" }];

export default function ReviewsSection() {
    return (
<<<<<<< HEAD
        <section className="relative bg-white py-16">
            <div className="absolute inset-x-0 -top-[1px]">
                <svg viewBox="0 0 1440 80" className="w-full h-20">
                    <path d="M0,32 C240,64 480,0 720,16 C960,32 1200,96 1440,64 L1440,0 L0,0 Z" fill="#f8fafc" />
                </svg>
            </div>
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-10">What Students Say</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {reviews.map((r, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-purple-100/50">
                            <p className="text-gray-700 italic mb-4">“{r.review}”</p>
                            <h4 className="text-purple-700 font-bold">{r.name}</h4>
                            <span className="text-sm text-gray-500">{r.university}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
=======
        <section className="bg-white py-12">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-10">What Students Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((r, idx) => (<div key={idx} className="bg-gray-100 p-6 rounded-lg shadow">
                        <p className="text-gray-700 italic mb-4">“{r.review}”</p>
                        <h4 className="text-purple-700 font-bold">{r.name}</h4>
                        <span className="text-sm text-gray-500">{r.university}</span>
                    </div>
                    ))}
                </div>
            </div>
        </section>);
>>>>>>> cade5efb6b5d303ace7c120f0dc181e942f52e40
}