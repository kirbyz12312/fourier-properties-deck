import React, { useEffect } from 'react';
import { X, ChevronRight, BookOpen, Layers, Users, Sparkles, User } from 'lucide-react';
import { SLIDES_DATA, TEAM_MEMBERS } from '../data/slidesContent';

export default function SidebarIndex({
  isOpen,
  onClose,
  currentSlide,
  onSelectSlide,
}) {
  // Manejo de tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex print:hidden animate-fade-in">
      {/* Fondo oscuro con desenfoque */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel lateral */}
      <div className="relative w-full max-w-md bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col h-full z-10">
        {/* Cabecera del sidebar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider font-mono">
                Índice del Deck
              </h2>
              <p className="text-xs text-slate-400">9 Diapositivas Académicas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de diapositivas scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-500 font-semibold px-2 pt-1 pb-2">
            Estructura del Contenido &middot; Expositores
          </div>

          {SLIDES_DATA.map((slide, index) => {
            const slideNum = index + 1;
            const isActive = currentSlide === slideNum;

            return (
              <button
                key={slide.id}
                onClick={() => {
                  onSelectSlide(slideNum);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                  isActive
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-100 shadow-glow-cyan/20'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-100'
                }`}
              >
                {/* Badge numérico */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {slideNum.toString().padStart(2, '0')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold tracking-wide ${
                        isActive ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {slide.shortTitle || slide.title}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {slide.isCover
                        ? 'Portada y equipo'
                        : slide.isSummary
                        ? 'Tabla y conclusiones'
                        : slide.title}
                    </p>
                    {slide.speaker && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 shrink-0">
                        <User className="w-2.5 h-2.5" />
                        <span>{slide.speaker.split(' ')[0]}</span>
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}

          {/* Sección de Integrantes al pie del menú */}
          <div className="pt-4 mt-4 border-t border-slate-800/80 px-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Integrantes y Secciones Asignadas</span>
            </div>
            <div className="space-y-1.5">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-2 text-xs text-slate-300 py-1.5 px-2.5 rounded-lg bg-slate-900/30 border border-slate-800/40"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-cyan-400 font-bold">
                      {member.id}
                    </span>
                    <span className="truncate">{member.name.split(',')[0]}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer del sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-[11px] text-slate-400 text-center font-mono">
          Navega usando <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">←</kbd> y <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">→</kbd> del teclado
        </div>
      </div>
    </div>
  );
}
