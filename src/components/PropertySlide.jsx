import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Lightbulb,
  Activity,
  User,
  LineChart,
  Binary,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';
import MathFormula, { LatexRenderer } from './MathFormula';
import CodeViewer from './CodeViewer';
import { getDarkChartOptions } from '../utils/chartConfig';
import {
  generateIntroData,
  generateLinearityData,
  generateTimeShiftData,
  generateScalingData,
  generateModulationData,
  generateConvolutionData,
  generateDifferentiationData,
} from '../utils/dspMath';

export default function PropertySlide({ slide }) {
  const [isRunning, setIsRunning] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  // Selector de generador matemático en runtime
  const dspData = useMemo(() => {
    switch (slide.dataGeneratorKey) {
      case 'intro':
        return generateIntroData();
      case 'linearity':
        return generateLinearityData();
      case 'timeShift':
        return generateTimeShiftData();
      case 'scaling':
        return generateScalingData();
      case 'modulation':
        return generateModulationData();
      case 'convolution':
        return generateConvolutionData();
      case 'differentiation':
        return generateDifferentiationData();
      default:
        return generateIntroData();
    }
  }, [slide.dataGeneratorKey]);

  // Manejo del botón ▶ Ejecutar Demo: 300ms de estado de cálculo y re-renderizado de gráficos
  const handleRunDemo = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setRenderKey((prev) => prev + 1);
    }, 320);
  };

  // Preparar opciones de Chart.js según el tipo de diapositiva
  const isMagPhase = slide.chartType === 'mag-phase';

  const chart1Options = useMemo(() => {
    return getDarkChartOptions(
      slide.chartLabels.chart1Title,
      slide.chartLabels.chart1XAxis,
      slide.chartLabels.chart1YAxis,
      true
    );
  }, [slide.chartLabels, renderKey]);

  const chart2Options = useMemo(() => {
    return getDarkChartOptions(
      slide.chartLabels.chart2Title,
      slide.chartLabels.chart2XAxis,
      slide.chartLabels.chart2YAxis,
      true
    );
  }, [slide.chartLabels, renderKey]);

  // Selección de datos para los 2 paneles
  const chart1Data = isMagPhase ? dspData.magVsPhase.magnitude : dspData.time;
  const chart2Data = isMagPhase ? dspData.magVsPhase.phase : dspData.freq;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* 1. Header de Diapositiva + Badge + Expositor + Interpretación Física */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          {/* Fila superior: Diapositiva XXX + Expositor Asignado + Categoría */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold tracking-wider uppercase">
              {slide.number ? `Diapositiva ${slide.number}` : 'Propiedad'}
            </span>

            {/* Nombre del Expositor asignado */}
            {slide.speaker && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold shadow-sm">
                <User className="w-3 h-3 text-emerald-400" />
                <span>Expositor: {slide.speaker}</span>
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-medium">
              {slide.badge || 'Telecomunicaciones'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            {slide.title}
          </h1>
        </div>

        {/* Interpretación Física con renderizado KaTeX */}
        <div className="max-w-xl p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed shadow-sm">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Interpretación Física</span>
          </div>
          <p className="text-slate-300">
            <LatexRenderer text={slide.physicalInterpretation} />
          </p>
        </div>
      </div>

      {/* 2. Banner Matemático Destacado */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
              Expresión Analítica Fundamental
            </span>
            <div className="mt-1 text-base sm:text-lg text-cyan-100 overflow-x-auto">
              <MathFormula tex={slide.formulaTex} block />
            </div>
          </div>
          {slide.formulaSecondaryTex && (
            <div className="md:border-l md:border-slate-800 md:pl-5 flex-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                Relación Complementaria / Dual
              </span>
              <div className="mt-1 text-sm sm:text-base text-slate-200 overflow-x-auto">
                <MathFormula tex={slide.formulaSecondaryTex} block />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Layout en Grid (5 cols Izquierda / 7 cols Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Columna Izquierda (5 cols): Selector MATLAB/Python + Código + Terminal */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <CodeViewer
            matlabCode={slide.matlabCode}
            pythonCode={slide.pythonCode}
            simulatedOutput={slide.simulatedOutput}
            onRunDemo={handleRunDemo}
            isRunning={isRunning}
          />
        </div>

        {/* Columna Derecha (7 cols): Panel de visualización con 2 gráficas de Chart.js */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Gráfico 1: Tiempo o Magnitud */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative flex flex-col h-56 sm:h-64">
            <div className="flex-1 min-h-0 relative">
              <Line key={`c1-${renderKey}`} data={chart1Data} options={chart1Options} />
            </div>
          </div>

          {/* Gráfico 2: Espectro Frecuencia o Fase */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative flex flex-col h-56 sm:h-64">
            <div className="flex-1 min-h-0 relative">
              <Line key={`c2-${renderKey}`} data={chart2Data} options={chart2Options} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Nuevo Recuadro: Análisis Concreto y Directo de la Gráfica y Código */}
      {slide.graphAnalysis && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/30 border border-indigo-500/30 shadow-lg flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0 mt-0.5 shadow-sm">
            <LineChart className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-300 font-mono">
                Análisis Concreto de Gráfica y Código Simulado
              </h3>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <LatexRenderer text={slide.graphAnalysis} />
            </p>
          </div>
        </div>
      )}

      {/* 5. Footer de Propiedad: Aplicación práctica en Telecomunicaciones */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 shadow-lg flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5 shadow-sm">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Aplicación Práctica en Ingeniería de Telecomunicaciones
            </h3>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <LatexRenderer text={slide.telecomApplication} />
          </p>
        </div>
      </div>
    </div>
  );
}
