import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "/banners/banner1.png",
  "/banners/banner2.png",
  "/banners/banner3.png",
  "/banners/banner4.png", 
  "/banners/banner5.png"
];

const HomeBanner = () => {
  return (
    <div className="w-full h-[600px] relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Imagine clară */}
              <img
                src={src}
                alt={`banner-${index}`}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Overlay întunecat */}
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

              {/* Text central */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center text-white z-30 px-4">
                <h1 className="text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg">
                  Eventfy – Biletul tău către momente de neuitat
                </h1>
                <Link
                  to="/events"
                  className="inline-block bg-[#C89459] hover:bg-[#a87c45] transition px-6 py-3 rounded-full text-white font-medium shadow-lg"
                >
                  Descoperă evenimentele
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
