import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Layers,
  Award,
  Users,
  CheckCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import MathFormula from './MathFormula';
import { SUMMARY_TABLE, CONCLUSIONS, TEAM_MEMBERS } from '../data/slidesContent';

export default function SummarySlide({ onRestart }) {
  const [selectedRow, setSelectedRow] = useState(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header del resumen */}
      <div className="text-center space-y-2 border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Síntesis y Marco de Referencia</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tabla Resumen de Propiedades y Conclusiones
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Compendio de operaciones fundamentales entre el dominio temporal y frecuencial, y su aplicación en la arquitectura de telecomunicaciones.
        </p>
      </div>

      {/* 1. Tabla Resumen Interactiva con KaTeX */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono text-slate-200">
              Matriz de Propiedades de Fourier
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Haz clic en una fila para destacarla
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Propiedad</th>
                <th className="py-3 px-4">Dominio Temporal x(t)</th>
                <th className="py-3 px-4">Dominio Frecuencial X(f)</th>
                <th className="py-3 px-4">Impacto en Telecomunicaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SUMMARY_TABLE.map((row, idx) => {
                const isSelected = selectedRow === idx;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedRow(isSelected ? null : idx)}
                    className={`cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-l-4 border-cyan-400'
                        : 'hover:bg-slate-800/50 bg-slate-900/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected ? 'bg-cyan-400' : 'bg-slate-600'
                          }`}
                        />
                        <span>{row.property}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300">
                      <MathFormula tex={row.timeDomain} />
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-300">
                      <MathFormula tex={row.freqDomain} />
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-xs leading-relaxed max-w-md">
                      {row.telecomImpact}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Bloque de 3 Conclusiones Clave */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Conclusiones Principales del Análisis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONCLUSIONS.map((concl, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
                    {concl.tag}
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-400">
                    {concl.highlight}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{concl.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {concl.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Créditos Finales del Equipo */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          <Users className="w-4 h-4" />
          <span>Créditos del Proyecto &middot; Grupo de Trabajo</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {TEAM_MEMBERS.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
            >
              <span className="font-mono text-[10px] text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {m.id}
              </span>
              <span className="truncate">{m.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Botón de Reinicio de Presentación */}
      <div className="pt-2 text-center print:hidden">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-sm font-semibold text-cyan-300 hover:text-white transition-all shadow-md active:scale-95 font-mono"
        >
          <RotateCcw className="w-4 h-4" />
          <span>↺ Reiniciar Presentación</span>
        </button>
      </div>
    </div>
  );
}

