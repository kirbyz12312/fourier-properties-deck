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

