import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "/banners/banner1.jpg",
  "/banners/banner2.jpg",
];

const HomeBanner = () => {
  return (
    <div className="w-full h-[600px] relative overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={src}
                alt={`banner-${index}`}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 z-10" />

              {/* Text și Link – jos */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center text-white z-20 px-4">
                <h1 className="text-xl md:text-2xl font-serif mb-2">
                  Eventfy – Biletul tău către momente de neuitat
                </h1>
                <Link
                  to="/events"
                  className="text-[#c89459] hover:underline text-base font-medium inline-flex items-center gap-1"
                >
                  Descoperă <span className="text-xl">→</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeBanner;
