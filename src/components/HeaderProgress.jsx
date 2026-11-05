import React, { useState, useEffect } from 'react';
import { Menu, Maximize2, Minimize2, Radio, Printer, Sliders } from 'lucide-react';

export default function HeaderProgress({
  currentSlide,
  totalSlides,
  onToggleSidebar,
  slideTitle,
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Error al alternar pantalla completa:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const progressPercentage = ((currentSlide) / totalSlides) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all select-none print:hidden">
      {/* Barra de progreso de lectura ultra-fina */}
      <div className="w-full h-1 bg-slate-900 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300 ease-out shadow-glow-cyan"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Lado izquierdo: Botón Menú + Título Institucional */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            title="Abrir índice de diapositivas (M)"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <div className="hidden sm:block">
              <div className="text-[11px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                DSP &middot; Telecomunicaciones
              </div>
              <div className="text-xs font-medium text-slate-200 truncate max-w-xs md:max-w-md">
                {slideTitle}
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho: Contador + Botones de Acción */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Badge del slide actual */}
          <div className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span className="text-cyan-400 font-semibold">{currentSlide}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-slate-400">{totalSlides}</span>
          </div>

          {/* Botón Imprimir / Exportar PDF */}
          <button
            onClick={handlePrint}
            title="Imprimir / Exportar a PDF limpio"
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/60 transition-all focus:outline-none"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Botón Pantalla Completa */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa (F)" : "Pantalla completa (F)"}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all focus:outline-none"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

