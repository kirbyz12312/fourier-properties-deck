import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import escudoUnsa from '../../img/Escudo_UNSA.png';
import logoEpit from '../../img/LOGO_EPIT.png';

export default function FooterDeck({
  currentSlide,
  totalSlides,
  onPrev,
  onNext,
  onSelectSlide,
}) {
  const isFirst = currentSlide === 1;
  const isLast = currentSlide === totalSlides;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-md border-t border-slate-800/80 transition-all select-none print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Lado izquierdo: Metadatos del Curso y Logos Institucionales */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          {/* Contenedor de los dos logos institucionales */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <img
              src={escudoUnsa}
              alt="Escudo UNSA"
              className="h-5 w-auto max-h-5 object-contain hover:scale-110 transition-transform duration-200"
              title="Universidad Nacional de San Agustín de Arequipa (UNSA)"
            />
            <img
              src={logoEpit}
              alt="Logo EPIT"
              className="h-5 w-auto max-h-5 object-contain hover:scale-110 transition-transform duration-200"
              title="Escuela Profesional de Ingeniería de Telecomunicaciones (EPIT)"
            />
          </div>

          <span className="hidden sm:inline font-medium text-slate-300">
            Ingeniería de Telecomunicaciones
          </span>
          <span className="hidden sm:inline text-slate-600">&bull;</span>
          <span className="text-[11px] font-mono text-slate-400">
            Propiedades de Fourier
          </span>
        </div>

        {/* Centro: Indicadores circulares de diapositivas */}
        <div className="hidden md:flex items-center gap-1.5">
          {Array.from({ length: totalSlides }, (_, i) => i + 1).map((num) => {
            const isActive = num === currentSlide;
            return (
              <button
                key={num}
                onClick={() => onSelectSlide(num)}
                title={`Ir a diapositiva ${num}`}
                className={`transition-all duration-200 rounded-full focus:outline-none ${isActive
                  ? 'w-7 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-glow-cyan'
                  : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                  }`}
              />
            );
          })}
        </div>

        {/* Lado derecho: Controles de navegación */}
        <div className="flex items-center gap-2">
          {/* Botón Anterior */}
          <button
            onClick={onPrev}
            disabled={isFirst}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${isFirst
              ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600 bg-slate-900/30'
              : 'border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
              }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Contador central numérico */}
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200">
            <span className="text-cyan-400 font-bold">{currentSlide}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span>{totalSlides}</span>
          </div>

          {/* Botón Siguiente */}
          <button
            onClick={onNext}
            disabled={isLast}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${isLast
              ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-600 bg-slate-900/30'
              : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-glow-cyan/20'
              }`}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

