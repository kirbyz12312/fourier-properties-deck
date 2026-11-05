import React, { useState, useEffect, useCallback, useRef } from 'react';
import HeaderProgress from './components/HeaderProgress';
import SidebarIndex from './components/SidebarIndex';
import FooterDeck from './components/FooterDeck';
import CoverSlide from './components/CoverSlide';
import PropertySlide from './components/PropertySlide';
import SummarySlide from './components/SummarySlide';
import { SLIDES_DATA } from './data/slidesContent';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const totalSlides = SLIDES_DATA.length;
  const currentSlideData = SLIDES_DATA[currentSlide - 1];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides));
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSelectSlide = useCallback((num) => {
    if (num >= 1 && num <= totalSlides) {
      setCurrentSlide(num);
    }
  }, [totalSlides]);

  // Manejo de eventos de teclado globales
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorar si el usuario está en un input o textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlide(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlide(totalSlides);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, totalSlides]);

  // Soporte para gestos táctiles Swipe en dispositivos móviles
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches[0].screenX;
    touchStartYRef.current = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Solo si el deslizamiento horizontal es mayor al vertical y supera umbral
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext(); // Swipe izquierda -> siguiente
      } else {
        handlePrev(); // Swipe derecha -> anterior
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Contenedor Interactivo en Pantalla */}
      <div className="screen-only-container flex flex-col min-h-screen">
        {/* Barra superior de navegación */}
        <HeaderProgress
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          slideTitle={currentSlideData?.title || 'Propiedades de Fourier'}
        />

        {/* Menú lateral desplegable de índice */}
        <SidebarIndex
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentSlide={currentSlide}
          onSelectSlide={handleSelectSlide}
        />

        {/* Área central de diapositiva con padding compensatorio */}
        <main className="flex-1 pt-14 pb-14 overflow-y-auto custom-scrollbar flex flex-col justify-center animate-fade-in">
          {currentSlide === 1 && (
            <CoverSlide onStart={() => setCurrentSlide(2)} />
          )}

          {currentSlide >= 2 && currentSlide <= 8 && (
            <PropertySlide
              key={currentSlideData.id}
              slide={currentSlideData}
            />
          )}

          {currentSlide === 9 && (
            <SummarySlide onRestart={() => setCurrentSlide(1)} />
          )}
        </main>

        {/* Footer con controles */}
        <FooterDeck
          currentSlide={currentSlide}
          totalSlides={totalSlides}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectSlide={handleSelectSlide}
        />
      </div>

      {/* Contenedor especial para Modo Impresión / Exportación a PDF limpio (@media print) */}
      <div className="print-only-container">
        {SLIDES_DATA.map((slide, index) => {
          const slideNum = index + 1;
          return (
            <div key={slide.id} className="print-page-break">
              {slideNum === 1 && <CoverSlide onStart={() => {}} />}
              {slideNum >= 2 && slideNum <= 8 && (
                <PropertySlide slide={slide} />
              )}
              {slideNum === 9 && <SummarySlide onRestart={() => {}} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

