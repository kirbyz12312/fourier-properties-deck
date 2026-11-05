import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Registro global de componentes requeridos por Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Genera opciones estilizadas con tema oscuro y ejes etiquetados para Chart.js
 * @param {string} title - Título del gráfico
 * @param {string} xTitle - Etiqueta del eje X
 * @param {string} yTitle - Etiqueta del eje Y
 * @param {boolean} [animate=false] - Forzar animación
 */
export function getDarkChartOptions(title, xTitle, yTitle, animate = false) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: animate
      ? {
          duration: 650,
          easing: 'easeOutQuart',
        }
      : false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#cbd5e1', // slate-300
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '500',
          },
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 10,
        },
      },
      title: {
        display: true,
        text: title,
        color: '#f8fafc', // slate-50
        font: {
          family: "'Inter', sans-serif",
          size: 12,
          weight: '600',
        },
        padding: {
          bottom: 8,
        },
        align: 'start',
      },
      tooltip: {
        backgroundColor: 'rgba(11, 15, 25, 0.95)',
        titleColor: '#38bdf8',
        bodyColor: '#f1f5f9',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 8,
        cornerRadius: 8,
        titleFont: {
          family: "'Fira Code', monospace",
          size: 11,
        },
        bodyFont: {
          family: "'Fira Code', monospace",
          size: 11,
        },
        displayColors: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xTitle,
          color: '#94a3b8',
          font: {
            family: "'Inter', sans-serif",
            size: 10.5,
            weight: '500',
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.08)',
          tickColor: 'transparent',
        },
        ticks: {
          color: '#64748b',
          maxTicksLimit: 9,
          font: {
            family: "'Fira Code', monospace",
            size: 9.5,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: yTitle,
          color: '#94a3b8',
          font: {
            family: "'Inter', sans-serif",
            size: 10.5,
            weight: '500',
          },
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.08)',
          tickColor: 'transparent',
        },
        ticks: {
          color: '#64748b',
          maxTicksLimit: 6,
          font: {
            family: "'Fira Code', monospace",
            size: 9.5,
          },
        },
      },
    },
  };
}

