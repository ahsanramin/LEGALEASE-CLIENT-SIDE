"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Hero() {
  const router = useRouter();

  const slides = [
    {
      id: 1,
      image: 'https://ishr.ch/wp-content/uploads/2021/06/law_flickr_5.jpg',
      title: 'Find & Hire Expert Legal Counsel',
      subtitle: 'Connecting you with trusted legal professionals globally. Simple, secure, and fast.'
    },
    {
      id: 2,
      image: 'https://right-suit.com/wp-content/uploads/2024/03/Laws.jpg',
      title: 'Secure & Transparent Justice',
      subtitle: 'Experience seamless legal hiring with our cutting-edge online platform.'
    },
    {
      id: 3,
      image: 'https://publications.lawschool.cornell.edu/jlpp/wp-content/uploads/sites/3/2021/04/Justice_GettyImages-1140705087.jpeg',
      title: 'Trusted by Top Law Firms',
      subtitle: 'Join thousands of satisfied clients who found their perfect legal match.'
    },
    {
      id: 4,
      image: 'https://static.wixstatic.com/media/1cd646_ae7f0376474742e4ac9a0dee2f3f5a5d~mv2_d_2508_1672_s_2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/1cd646_ae7f0376474742e4ac9a0dee2f3f5a5d~mv2_d_2508_1672_s_2.jpg',
      title: 'Expertise at Your Fingertips',
      subtitle: 'Browse hundreds of specialized lawyers and get the best legal advice.'
    },
    {
      id: 5,
      image: 'https://www.worldbank.org/content/dam/photos/780x439/2025/oct-5/LEGVP-blog-780x439.jpg',
      title: 'Find & Hire Expert Legal Counsel',
      subtitle: 'Your journey to justice begins with a single click. Get started today.'
    }
  ];

  return (
    <div className="relative w-full h-[80vh] lg:h-[90vh]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={slide.image}
                alt="Legal Banner"
                className="absolute inset-0 w-full h-full object-cover transform scale-105 animate-zoomIn duration-[10s]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/85 via-purple-900/70 to-black/60 z-10" />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 lg:px-20">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-xl mb-4 tracking-tight"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-md mb-10 font-light"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  onClick={() => router.push('/browse-lawyers')}
                  className="px-10 py-4 bg-white text-indigo-700 font-bold rounded-full text-lg shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 hover:bg-gray-100 transition-all duration-300 backdrop-blur-sm"
                >
                  Browse Lawyers
                </motion.button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}