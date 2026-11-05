import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Componente KaTeX para renderizar fórmulas matemáticas en modo bloque o en línea.
 * @param {{ tex: string, block?: boolean, className?: string }} props
 */
export default function MathFormula({ tex, block = false, className = '' }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="text-rose-400 font-mono text-xs">${tex}</span>`;
    }
  }, [tex, block]);

  if (block) {
    return (
      <div
        className={`math-formula-block my-2 overflow-x-auto text-cyan-200 py-1 px-2 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`math-formula-inline text-cyan-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Renderizador de párrafos de texto que contienen fórmulas LaTeX inline ($...$) o display ($$...$$).
 * Parsea el texto y reemplaza automáticamente las expresiones matemáticas con KaTeX renderizado.
 * @param {{ text: string, className?: string }} props
 */
export function LatexRenderer({ text, className = '' }) {
  const elements = useMemo(() => {
    if (!text || typeof text !== 'string') return null;

    // Regex para detectar $$...$$ (display) y $...$ (inline)
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        return <MathFormula key={index} tex={math} block />;
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1).trim();
        return (
          <MathFormula
            key={index}
            tex={math}
            className="font-medium text-cyan-300"
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [text]);

  return <span className={className}>{elements}</span>;
}
