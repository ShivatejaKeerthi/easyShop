import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CarouselProps {
  images: {
    url: string;
    title: string;
    description: string;
    link?: string;
  }[];
}

export function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setCurrentIndex((current) => (current + 1) % images.length);
  };

  const handleClick = (index: number) => {
    const image = images[index];
    if (image.link) {
      navigate(image.link);
    }
  };

  return (
    <div className="relative w-full max-w-[2000px] mx-auto px-4">
      <div className="aspect-[21/9] relative overflow-hidden rounded-2xl shadow-xl border border-gray-200/10">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            } ${image.link ? 'cursor-pointer' : ''}`}
            onClick={() => handleClick(index)}
          >
            <img
              src={image.url}
              alt={image.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-3 transform translate-y-0 transition-transform duration-500 ease-out">
                  {image.title}
                </h2>
                <p className="text-xl transform translate-y-0 transition-transform duration-500 delay-100 ease-out">
                  {image.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-100 shadow-lg' 
                : 'bg-white/50 scale-90 hover:scale-95 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}