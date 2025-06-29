import { useRef } from "react";
import EventCard from "./EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

function EventSection({ title, events }) {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      container.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <section className="my-8 px-6 relative">
      <h2 className="text-xl font-semibold text-[#c97d10] mb-4">{title}</h2>

      <div className="relative w-full">
        {/* Continut scrollabil */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar py-2"
        >
          {(events || []).map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {/* Sageata stanga */}
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-2 -translate-y-1/2 
                     bg-white hover:bg-gray-100 
                     shadow-md rounded-full w-10 h-10 
                     flex items-center justify-center z-[110]"
        >
          <ChevronLeft className="w-6 h-6 text-black" strokeWidth={2.5} />
        </button>

        {/* Sageata dreapta */}
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-2 -translate-y-1/2 
                     bg-white hover:bg-gray-100 
                     shadow-md rounded-full w-10 h-10 
                     flex items-center justify-center z-[110]"
        >
          <ChevronRight className="w-6 h-6 text-black" strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}

export default EventSection;
