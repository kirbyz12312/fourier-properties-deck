import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-python';
import { Play, Copy, Check, Terminal, Cpu, Loader2 } from 'lucide-react';

/**
 * Componente CodeViewer con pestañas para MATLAB y Python,
 * resaltado de sintaxis con Prism.js, botón de copiado,
 * y botón interactivo "▶ Ejecutar Demo" con consola simulada en vivo.
 */
export default function CodeViewer({
  matlabCode,
  pythonCode,
  simulatedOutput,
  onRunDemo,
  isRunning = false,
}) {
  const [activeTab, setActiveTab] = useState('matlab'); // 'matlab' | 'python'
  const [copied, setCopied] = useState(false);
  const [showConsole, setShowConsole] = useState(true);

  // Re-ejecutar resaltado de Prism al cambiar de pestaña o de código
  useEffect(() => {
    Prism.highlightAll();
  }, [activeTab, matlabCode, pythonCode]);

  const currentCode = activeTab === 'matlab' ? matlabCode : pythonCode;
  const currentLanguage = activeTab === 'matlab' ? 'matlab' : 'python';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar código:', err);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
      {/* Barra de pestañas y acciones */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-slate-800 select-none">
        {/* Selector de lenguajes MATLAB / Python */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800/80">
          <button
            onClick={() => setActiveTab('matlab')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'matlab'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MATLAB
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'python'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python
          </button>
        </div>

        {/* Acciones: Copiar y Ejecutar */}
        <div className="flex items-center gap-2">
          {/* Botón Copiar */}
          <button
            onClick={handleCopy}
            title="Copiar código al portapapeles"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar</span>
              </>
            )}
          </button>

          {/* Botón "▶ Ejecutar Demo" */}
          <button
            onClick={onRunDemo}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all shadow-md ${
              isRunning
                ? 'bg-cyan-600/50 text-white cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 hover:shadow-glow-cyan'
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Ejecutando...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>▶ Ejecutar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bloque de Código con Prism.js */}
      <div className="relative flex-1 overflow-auto max-h-[300px] lg:max-h-[340px] bg-[#1d1f21] custom-scrollbar">
        <pre className="!bg-transparent !m-0 !p-4 !font-mono !text-xs !leading-relaxed">
          <code className={`language-${currentLanguage}`}>{currentCode}</code>
        </pre>
      </div>

      {/* Consola Simulada Inferior */}
      <div className="border-t border-slate-800 bg-slate-950/90">
        <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-800/60 bg-slate-900/40 select-none">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Terminal de Simulación DSP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Runtime Activo
            </span>
          </div>
        </div>

        <div className="p-3 font-mono text-[11px] leading-relaxed text-slate-300 max-h-36 overflow-y-auto custom-scrollbar select-text bg-black/40">
          {isRunning ? (
            <div className="flex items-center gap-2 text-cyan-300 py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Calculando transformada y actualizando vectores espectrales...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-slate-300 font-mono">
              {simulatedOutput}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

