import React, { useEffect, useRef } from 'react';
import { ArrowRight, Radio, Waves, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/slidesContent';

export default function CoverSlide({ onStart }) {
  const canvasRef = useRef(null);

  // Animación continua de ondas sinusoidales e histograma espectral en HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let step = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.015;

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height * 0.45;

      // 1. Dibujar barras espectrales suaves en el fondo inferior
      const numBars = 36;
      const barWidth = width / (numBars * 1.5);
      const gap = barWidth * 0.5;
      const startX = (width - (numBars * (barWidth + gap))) / 2;

      for (let i = 0; i < numBars; i++) {
        // Altura espectral calculada con combinación armónica
        const barHeight =
          Math.sin(step * 1.2 + i * 0.28) * 35 +
          Math.cos(step * 0.8 + i * 0.15) * 25 +
          45;

        const bx = startX + i * (barWidth + gap);
        const by = height - barHeight - 20;

        const gradient = ctx.createLinearGradient(0, by, 0, height);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(bx, by, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }

      // 2. Ondas sinusoidales superpuestas (Fasores en el dominio del tiempo)
      const waves = [
        { freq: 0.008, amp: 45, speed: 0.02, color: 'rgba(6, 182, 212, 0.35)', width: 2 },
        { freq: 0.014, amp: 30, speed: -0.015, color: 'rgba(59, 130, 246, 0.3)', width: 2 },
        { freq: 0.022, amp: 18, speed: 0.028, color: 'rgba(16, 185, 129, 0.25)', width: 1.5 },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.lineWidth = w.width;
        ctx.strokeStyle = w.color;

        for (let x = 0; x < width; x += 3) {
          const y = centerY + Math.sin(x * w.freq + step * (w.speed * 100)) * w.amp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-7rem)] flex flex-col justify-center items-center px-4 sm:px-6 py-8 overflow-hidden select-none">
      {/* Fondo dinámico Canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-80">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Contenido principal de la portada */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider uppercase shadow-glow-cyan/20 animate-fade-in">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Procesamiento Digital de Señales &middot; Deck Académico</span>
        </div>

        {/* Título y subtítulo */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Propiedades de la{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 drop-shadow-sm">
              Transformada de Fourier
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Análisis en el dominio temporal y frecuencial — Aplicaciones fundamentales en
            Ingeniería de Telecomunicaciones, modulación RF y sistemas lineales e invariantes en el tiempo (LTI).
          </p>
        </div>

        {/* Grid de los 6 Integrantes */}
        <div className="pt-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold mb-3 flex items-center justify-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Equipo de Investigación y Desarrollo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto text-left">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="group p-3 rounded-xl bg-slate-900/70 hover:bg-slate-900/95 backdrop-blur-md border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-md flex items-center gap-3 hover:-translate-y-0.5"
              >
                {/* Badge circular cian */}
                <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300 shadow-glow-cyan/20">
                  {member.id}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    {member.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate font-mono">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón CTA Brillante */}
        <div className="pt-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-glow-cyan hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] font-mono tracking-wide"
          >
            <span>Comenzar Presentación</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="text-[11px] text-slate-500 font-mono mt-3">
            O presiona la tecla <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">→</kbd> en tu teclado
          </div>
        </div>
      </div>
    </div>
  );
}

