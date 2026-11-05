/**
 * dspMath.js
 * Módulo matemático para generación en tiempo de ejecución (Runtime) de señales
 * temporales, transformada discreta de Fourier (DFT/FFT) y respuestas analíticas.
 * Especializado para telecomunicaciones y procesamiento de señales.
 */

/**
 * Calcula la DFT de una señal discreta x[n] de longitud N.
 * Retorna { real, imag, magnitude, phase, frequencies }
 * @param {number[]} signal - Vector de muestras temporales
 * @param {number} fs - Frecuencia de muestreo en Hz
 * @returns {{ real: number[], imag: number[], magnitude: number[], phase: number[], frequencies: number[] }}
 */
export function computeDFT(signal, fs) {
  const N = signal.length;
  const real = new Float64Array(N);
  const imag = new Float64Array(N);
  const magnitude = new Float64Array(N);
  const phase = new Float64Array(N);
  const frequencies = new Float64Array(N);

  const df = fs / N;

  for (let k = 0; k < N; k++) {
    let sumRe = 0;
    let sumIm = 0;
    const angleBase = (2 * Math.PI * k) / N;

    for (let n = 0; n < N; n++) {
      const angle = angleBase * n;
      sumRe += signal[n] * Math.cos(angle);
      sumIm -= signal[n] * Math.sin(angle);
    }

    real[k] = sumRe;
    imag[k] = sumIm;

    // Magnitud normalizada (escalada por 2/N para espectro unilateral en componentes AC)
    const mag = Math.sqrt(sumRe * sumRe + sumIm * sumIm);
    magnitude[k] = (2 * mag) / N;

    // Fase en radianes (con umbral de ruido para evitar ruido numérico cerca de cero)
    if (mag > 0.05) {
      phase[k] = Math.atan2(sumIm, sumRe);
    } else {
      phase[k] = 0;
    }

    frequencies[k] = k * df;
  }

  // Componente DC no se duplica
  if (N > 0) magnitude[0] /= 2;

  return {
    real: Array.from(real),
    imag: Array.from(imag),
    magnitude: Array.from(magnitude),
    phase: Array.from(phase),
    frequencies: Array.from(frequencies),
  };
}

/**
 * Slide 2: Introducción y Transformada Directa/Inversa
 * Señal: Tono puro x(t) = cos(2π * 50 t), fs = 1000 Hz, t de 0 a 0.1 s.
 * Espectro: Pico limpio de magnitud 1.0 en 50 Hz.
 */
export function generateIntroData() {
  const fs = 1000;
  const duration = 0.1; // 100 ms
  const N = Math.round(fs * duration);
  const f0 = 50;

  const timeLabels = [];
  const xData = [];

  for (let n = 0; n < N; n++) {
    const t = n / fs;
    timeLabels.push((t * 1000).toFixed(1)); // ms
    xData.push(Number(Math.cos(2 * Math.PI * f0 * t).toFixed(4)));
  }

  // Calculamos espectro usando DFT con ventana suficiente para resolución precisa
  const Nfft = 512;
  const fftSignal = new Float64Array(Nfft);
  for (let n = 0; n < Nfft; n++) {
    const t = n / fs;
    fftSignal[n] = Math.cos(2 * Math.PI * f0 * t);
  }
  const dft = computeDFT(Array.from(fftSignal), fs);

  // Recortamos a frecuencias útiles (0 a 200 Hz)
  const maxFreq = 200;
  const freqLabels = [];
  const magData = [];

  for (let k = 0; k < dft.frequencies.length / 2; k++) {
    const f = dft.frequencies[k];
    if (f > maxFreq) break;
    freqLabels.push(f.toFixed(1));
    magData.push(Number(dft.magnitude[k].toFixed(4)));
  }

  return {
    time: {
      labels: timeLabels,
      unit: 'ms',
      datasets: [
        {
          label: 'x(t) = cos(2π · 50t)',
          data: xData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
        },
      ],
    },
    freq: {
      labels: freqLabels,
      unit: 'Hz',
      datasets: [
        {
          label: '|X(f)| (Pico en 50 Hz)',
          data: magData,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.25)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
          fill: true,
        },
      ],
    },
  };
}

/**
 * Slide 3: Propiedad de Linealidad
 * F{a x1(t) + b x2(t)} = a X1(f) + b X2(f)
 * x1(t) = a * cos(2π * 50 t), a = 1.0
 * x2(t) = b * cos(2π * 120 t), b = 0.7
 * x_sum(t) = x1(t) + x2(t)
 */
export function generateLinearityData() {
  const fs = 1000;
  const N = 120; // 120 ms para tiempo
  const f1 = 50;
  const f2 = 120;
  const a = 1.0;
  const b = 0.7;

  const timeLabels = [];
  const x1Data = [];
  const x2Data = [];
  const xSumData = [];

  for (let n = 0; n < N; n++) {
    const t = n / fs;
    timeLabels.push((t * 1000).toFixed(1));
    const val1 = a * Math.cos(2 * Math.PI * f1 * t);
    const val2 = b * Math.cos(2 * Math.PI * f2 * t);
    x1Data.push(Number(val1.toFixed(3)));
    x2Data.push(Number(val2.toFixed(3)));
    xSumData.push(Number((val1 + val2).toFixed(3)));
  }

  // DFT de 512 puntos
  const Nfft = 512;
  const s1 = new Float64Array(Nfft);
  const s2 = new Float64Array(Nfft);
  const sSum = new Float64Array(Nfft);

  for (let n = 0; n < Nfft; n++) {
    const t = n / fs;
    s1[n] = a * Math.cos(2 * Math.PI * f1 * t);
    s2[n] = b * Math.cos(2 * Math.PI * f2 * t);
    sSum[n] = s1[n] + s2[n];
  }

  const dft1 = computeDFT(Array.from(s1), fs);
  const dft2 = computeDFT(Array.from(s2), fs);
  const dftSum = computeDFT(Array.from(sSum), fs);

  const maxFreq = 220;
  const freqLabels = [];
  const mag1 = [];
  const mag2 = [];
  const magSum = [];

  for (let k = 0; k < dft1.frequencies.length / 2; k++) {
    const f = dft1.frequencies[k];
    if (f > maxFreq) break;
    freqLabels.push(f.toFixed(1));
    mag1.push(Number(dft1.magnitude[k].toFixed(3)));
    mag2.push(Number(dft2.magnitude[k].toFixed(3)));
    magSum.push(Number(dftSum.magnitude[k].toFixed(3)));
  }

  return {
    time: {
      labels: timeLabels,
      unit: 'ms',
      datasets: [
        {
          label: 'x₁(t) = 1.0·cos(2π·50t)',
          data: x1Data,
          borderColor: '#3b82f6',
          borderWidth: 1.8,
          pointRadius: 0,
          tension: 0.3,
        },
        {
          label: 'x₂(t) = 0.7·cos(2π·120t)',
          data: x2Data,
          borderColor: '#f97316',
          borderWidth: 1.8,
          pointRadius: 0,
          tension: 0.3,
        },
        {
          label: 'x_suma(t) = x₁ + x₂',
          data: xSumData,
          borderColor: '#10b981',
          borderWidth: 2.2,
          pointRadius: 0,
          tension: 0.3,
        },
      ],
    },
    freq: {
      labels: freqLabels,
      unit: 'Hz',
      datasets: [
        {
          label: '|X₁(f)| (50 Hz, amp 1.0)',
          data: mag1,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 1.8,
          pointRadius: 0,
        },
        {
          label: '|X₂(f)| (120 Hz, amp 0.7)',
          data: mag2,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          borderWidth: 1.8,
          pointRadius: 0,
        },
        {
          label: '|X_suma(f)| = |X₁| + |X₂|',
          data: magSum,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderWidth: 2.2,
          pointRadius: 0,
          fill: true,
        },
      ],
    },
  };
}

/**
 * Slide 4: Desplazamiento Temporal
 * F{x(t - t0)} = X(f) * e^(-j 2π f t0)
 * Pulso gaussiano original vs desplazado t0 = 0.015 s.
 * Panel 1: Magnitud |X(f)| (idéntica en ambas señales).
 * Panel 2: Fase ∠X(f) (original plana vs retardada con pendiente negativa -2π f t0).
 */
export function generateTimeShiftData() {
  const fs = 1000;
  const duration = 0.1; // 100 ms
  const N = Math.round(fs * duration);
  const tc = 0.035; // Centro pulso original (35 ms)
  const t0 = 0.018; // Retardo (18 ms)
  const sigma = 0.007; // Ancho gaussiano

  const timeLabels = [];
  const xOrigTime = [];
  const xDelayedTime = [];

  for (let n = 0; n < N; n++) {
    const t = n / fs;
    timeLabels.push((t * 1000).toFixed(1));
    const gOrig = Math.exp(-Math.pow(t - tc, 2) / (2 * sigma * sigma));
    const gDelay = Math.exp(-Math.pow(t - (tc + t0), 2) / (2 * sigma * sigma));
    xOrigTime.push(Number(gOrig.toFixed(4)));
    xDelayedTime.push(Number(gDelay.toFixed(4)));
  }

  // Espectro analítico continuo discretizado para precisión perfecta
  // Pulso gaussiano centrado en tc tiene transformada analítica:
  // F{ e^(- (t-tc)^2 / (2s^2)) } = s*sqrt(2pi) * e^(-2 pi^2 s^2 f^2) * e^(-j 2pi f tc)
  const maxFreq = 120;
  const numFreqPoints = 60;
  const freqLabels = [];
  const magOriginal = [];
  const magDelayed = [];
  const phaseOriginal = [];
  const phaseDelayed = [];

  for (let i = 0; i <= numFreqPoints; i++) {
    const f = (i * maxFreq) / numFreqPoints;
    freqLabels.push(f.toFixed(0));

    // Magnitud invariante al retardo
    const mag = Math.exp(-2 * Math.PI * Math.PI * sigma * sigma * f * f);
    magOriginal.push(Number(mag.toFixed(4)));
    magDelayed.push(Number(mag.toFixed(4)));

    // Fase relativa referenciada al centro del pulso original tc:
    // Original (en marco centrado): 0 rad
    // Retardada: desfasaje neto = -2 * pi * f * t0 (en radianes)
    // Se mantiene sin discontinuidades (unwrapped) para comprensión clara
    const pOrig = 0;
    const pDelay = -2 * Math.PI * f * t0;

    phaseOriginal.push(Number(pOrig.toFixed(2)));
    phaseDelayed.push(Number(pDelay.toFixed(2)));
  }

  return {
    time: {
      labels: timeLabels,
      unit: 'ms',
      datasets: [
        {
          label: 'x(t) Original (centrado en 35 ms)',
          data: xOrigTime,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        },
        {
          label: 'x(t - t₀) Retardado (t₀ = 18 ms)',
          data: xDelayedTime,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.15)',
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [5, 4],
          fill: true,
        },
      ],
    },
    // En este slide se evalúa la dualidad Magnitud vs Fase
    magVsPhase: {
      magnitude: {
        labels: freqLabels,
        unit: 'Hz',
        datasets: [
          {
            label: '|X(f)| Original',
            data: magOriginal,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.25)',
            borderWidth: 2.5,
            pointRadius: 0,
            fill: true,
          },
          {
            label: '|X_retardado(f)| (Superpuesta: |X(f)| invariante)',
            data: magDelayed,
            borderColor: '#f97316',
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 0,
          },
        ],
      },
      phase: {
        labels: freqLabels,
        unit: 'Hz',
        datasets: [
          {
            label: '∠X(f) Original (Fase de referencia = 0 rad)',
            data: phaseOriginal,
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: '∠X_retardado(f) = -2π f t₀ (Pendiente lineal)',
            data: phaseDelayed,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.15)',
            borderWidth: 2.5,
            pointRadius: 0,
            fill: true,
          },
        ],
      },
    },
  };
}

/**
 * Slide 5: Escalamiento e Inversión Temporal
 * F{x(at)} = (1/|a|) X(f/a)  ;  F{x(-t)} = X(-f)
 * Pulso asimétrico x(t): rampa de subida y decaimiento exponencial.
 * Compara x(t), compresión x(2t) [a=2: mitad de duración, doble de ancho de banda],
 * e inversión x(-t) [a=-1].
 */
export function generateScalingData() {
  const fs = 500;
  const tMin = -0.08;
  const tMax = 0.08;
  const N = Math.round((tMax - tMin) * fs);

  // Pulso asimétrico continuo centrado: para t >= 0: t * exp(-t / tau)
  const tau = 0.015;
  const asymmetricPulse = (t) => {
    if (t < 0) return 0;
    return (t / tau) * Math.exp(1 - t / tau); // Normalizado con pico = 1.0 en t = tau
  };

  const timeLabels = [];
  const xOrig = [];
  const xCompressed = []; // x(2t)
  const xInverted = []; // x(-t)

  for (let n = 0; n <= N; n++) {
    const t = tMin + n / fs;
    timeLabels.push((t * 1000).toFixed(1));
    xOrig.push(Number(asymmetricPulse(t).toFixed(3)));
    xCompressed.push(Number(asymmetricPulse(2 * t).toFixed(3)));
    xInverted.push(Number(asymmetricPulse(-t).toFixed(3)));
  }

  // Espectro analítico de x(t) = (e / tau) * t * e^(-t/tau) * u(t):
  // X(f) = (e / tau) / (1/tau + j 2pi f)^2
  // |X(f)| = (e / tau) / [ (1/tau)^2 + (2pi f)^2 ]
  // Para x(at): |X_a(f)| = (1/|a|) * |X(f/a)|
  const maxFreq = 100;
  const numFreq = 60;
  const freqLabels = [];
  const magOrig = [];
  const magCompressed = [];
  const magInverted = [];

  const K = Math.E / tau;
  const w0 = 1 / tau;

  for (let i = 0; i <= numFreq; i++) {
    const f = (i * maxFreq) / numFreq;
    freqLabels.push(f.toFixed(0));

    const w = 2 * Math.PI * f;
    const magBase = K / (w0 * w0 + w * w);
    const norm = 1.0 / (K / (w0 * w0)); // Normalizamos pico original a 1.0

    // x(t) original
    const m1 = magBase * norm;

    // x(2t): |X(f/2)| / 2
    const wScaled = (2 * Math.PI * (f / 2));
    const m2 = (0.5 * (K / (w0 * w0 + wScaled * wScaled))) * norm;

    // x(-t): |X(-f)| = |X(f)| (magnitud es par)
    const m3 = m1;

    magOrig.push(Number(m1.toFixed(3)));
    magCompressed.push(Number(m2.toFixed(3)));
    magInverted.push(Number(m3.toFixed(3)));
  }

  return {
    time: {
      labels: timeLabels,
      unit: 'ms',
      datasets: [
        {
          label: 'x(t) Original (Ancho = 1x)',
          data: xOrig,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'x(2t) Comprimido (a=2: Duración / 2)',
          data: xCompressed,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'x(-t) Invertido (a=-1: Espejado en t)',
          data: xInverted,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [4, 4],
        },
      ],
    },
    freq: {
      labels: freqLabels,
      unit: 'Hz',
      datasets: [
        {
          label: '|X(f)| Original (BW = 1x, Amp = 1.0)',
          data: magOrig,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        },
        {
          label: '|X_comp(f)| = 0.5·|X(f/2)| (BW = 2x, Amp = 0.5)',
          data: magCompressed,
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.15)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        },
        {
          label: '|X_inv(f)| = |X(-f)| = |X(f)|',
          data: magInverted,
          borderColor: '#10b981',
          borderWidth: 2,
          pointRadius: 0,
          borderDash: [5, 4],
        },
      ],
    },
  };
}

/**
 * Slide 6: Desplazamiento en Frecuencia (Modulación AM DSB-SC)
 * F{x(t) cos(2π fc t)} = 0.5 [X(f - fc) + X(f + fc)]
 * Mensaje fm = 20 Hz, Portadora fc = 200 Hz.
 * Salida: Bandas laterales en 180 Hz y 220 Hz.
 */
export function generateModulationData() {
  const fs = 2000;
  const duration = 0.08; // 80 ms
  const N = Math.round(fs * duration);
  const fm = 20;
  const fc = 200;

  const timeLabels = [];
  const sMod = [];
  const envUpper = [];
  const envLower = [];

  for (let n = 0; n < N; n++) {
    const t = n / fs;
    timeLabels.push((t * 1000).toFixed(1));
    const m = Math.cos(2 * Math.PI * fm * t);
    const c = Math.cos(2 * Math.PI * fc * t);
    const modulated = m * c;

    sMod.push(Number(modulated.toFixed(3)));
    envUpper.push(Number(Math.abs(m).toFixed(3)));
    envLower.push(Number((-Math.abs(m)).toFixed(3)));
  }

  // DFT espectro
  const Nfft = 1024;
  const sig = new Float64Array(Nfft);
  for (let n = 0; n < Nfft; n++) {
    const t = n / fs;
    sig[n] = Math.cos(2 * Math.PI * fm * t) * Math.cos(2 * Math.PI * fc * t);
  }
  const dft = computeDFT(Array.from(sig), fs);

  const minFreq = 100;
  const maxFreq = 300;
  const freqLabels = [];
  const magMod = [];

  for (let k = 0; k < dft.frequencies.length / 2; k++) {
    const f = dft.frequencies[k];
    if (f < minFreq) continue;
    if (f > maxFreq) break;
    freqLabels.push(f.toFixed(1));
    magMod.push(Number(dft.magnitude[k].toFixed(3)));
  }

  return {
    time: {
      labels: timeLabels,
      unit: 'ms',
      datasets: [
        {
          label: 's(t) Modulada = m(t)·cos(2π·200t)',
          data: sMod,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 1.8,
          pointRadius: 0,
        },
        {
          label: '±|m(t)| Envolvente (20 Hz)',
          data: envUpper,
          borderColor: '#f97316',
          borderWidth: 1.8,
          borderDash: [4, 4],
          pointRadius: 0,
        },
        {
          label: '-|m(t)| Envolvente inferior',
          data: envLower,
          borderColor: '#f97316',
          borderWidth: 1.8,
          borderDash: [4, 4],
          pointRadius: 0,
        },
      ],
    },
    freq: {
      labels: freqLabels,
      unit: 'Hz',
      datasets: [
        {
          label: '|S(f)| = 0.5·[δ(f - 180) + δ(f - 220)]',
          data: magMod,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
        },
      ],
    },
  };
}

/**
 * Slide 7: Teorema de Convolución
 * F{x(t) * h(t)} = X(f) * H(f)
 * x(t): señal deseada 50 Hz + interferencia 200 Hz.
 * Filtro Butterworth pasa-bajas de orden n = 4, fc = 100 Hz.
 * |H(f)| = 1 / sqrt(1 + (f / fc)^(2n)).
 */
export function generateConvolutionData() {
  const fs = 2000;
  const duration = 0.08; // 80 ms
  const N = Math.round(fs * duration);
  const fDesired = 50;
  const fNoise = 200;
  const fc = 100;
  const order = 4;

  // Ganancias del filtro en 50 Hz y 200 Hz
  const gainDesired = 1 / Math.sqrt(1 + Math.pow(fDesired / fc, 2 * order)); // ~0.97
  const gainNoise = 1 / Math.sqrt(1 + Math.pow(fNoise / fc, 2 * order)); // ~0.062

  const timeLabels = [];
  const xInput = [];
  const yFiltered = [];

  for (let n = 0; n < N; n++) {
    const t = n / fs;
    timeLabels.push((t * 1000).toFixed(1));
    const sDesired = Math.sin(2 * Math.PI * fDesired * t);
    const sNoise = 0.65 * Math.sin(2 * Math.PI * fNoise * t);
    const inVal = sDesired + sNoise;

    // Salida filtrada LTI
    const outVal = gainDesired * sDesired + gainNoise * sNoise;

    xInput.push(Number(inVal.toFixed(3)));
    yFiltered.push(Number(outVal.toFixed(3)));
  }

  // Espectro de 0 a 300 Hz
  const numFreq = 80;
  const maxF = 300;
  const freqLabels = [];
  const xMag = [];
  const yMag = [];
  const hFilter = [];

  for (let i = 0; i <= numFreq; i++) {
    const f = (i * maxF) / numFreq;
    freqLabels.push(f.toFixed(0));

    // Respuesta en frecuencia del filtro
    const H = 1 / Math.sqrt(1 + Math.pow(f / fc, 2 * order));
    hFilter.push(Number(H.toFixed(3)));

    // Espectro de entrada analítico (picos en 50 y 200 Hz suavizados para visualización)
    const delta50 = Math.exp(-Math.pow(f - fDesired, 2) / 12);
    const delta200 = 0.65 * Math.exp(-Math.pow(f - fNoise, 2) / 12);
    const inSpec = delta50 + delta200;
    const outSpec = inSpec * H;

    xMag.push(Number(inSpec.toFixed(3)));
    yMag.push(Number(outSpec.toFixed(3)));
  }

  return {
    time: {
      labels: timeLabels,
      unit: 'ms',
      datasets: [
        {
          label: 'x(t) Entrada (50 Hz + interferencia 200 Hz)',
          data: xInput,
          borderColor: '#3b82f6',
          borderWidth: 1.8,
          pointRadius: 0,
        },
        {
          label: 'y(t) = x(t) * h(t) Salida Filtrada (Limpia)',
          data: yFiltered,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderWidth: 2.2,
          pointRadius: 0,
          fill: true,
        },
      ],
    },
    freq: {
      labels: freqLabels,
      unit: 'Hz',
      datasets: [
        {
          label: '|X(f)| Entrada',
          data: xMag,
          borderColor: '#3b82f6',
          borderWidth: 1.8,
          pointRadius: 0,
        },
        {
          label: '|H(f)| Respuesta Butterworth (fc = 100 Hz)',
          data: hFilter,
          borderColor: '#f97316',
          borderWidth: 2,
          borderDash: [4, 4],
          pointRadius: 0,
        },
        {
          label: '|Y(f)| = |X(f)|·|H(f)| Espectro Filtrado',
          data: yMag,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          borderWidth: 2.2,
          pointRadius: 0,
          fill: true,
        },
      ],
    },
  };
}

/**
 * Slide 8: Derivación Temporal
 * F{ dx(t)/dt } = j 2π f * X(f)
 * Señal: x(t) = sin(2π * 15 t) + 0.45 * sin(2π * 45 t)
 * Derivada analítica: dx/dt = 2π*15*cos(...) + 0.45*2π*45*cos(...)
 * En frecuencia: cada componente se multiplica por 2π f.
 * La componente de 45 Hz se amplifica 3 veces más que la de 15 Hz!
 */
export function generateDifferentiationData() {
  const fs = 1000;
  const duration = 0.15; // 150 ms
  const N = Math.round(fs * duration);
  const f1 = 15;
  const f2 = 45;
  const a1 = 1.0;
  const a2 = 0.45;

  const timeLabels = [];
  const xTime = [];
  const dxTime = [];

  // Factor de escala para visualización comparativa de amplitud en el tiempo
  const derivScale = 1 / (2 * Math.PI * f1);

  for (let n = 0; n < N; n++) {
    const t = n / fs;
    timeLabels.push((t * 1000).toFixed(1));
    const val = a1 * Math.sin(2 * Math.PI * f1 * t) + a2 * Math.sin(2 * Math.PI * f2 * t);
    const dval =
      a1 * (2 * Math.PI * f1) * Math.cos(2 * Math.PI * f1 * t) +
      a2 * (2 * Math.PI * f2) * Math.cos(2 * Math.PI * f2 * t);

    xTime.push(Number(val.toFixed(3)));
    dxTime.push(Number((dval * derivScale).toFixed(3))); // Normalizado respecto a la primera armónica
  }

  // Espectro de 0 a 70 Hz
  const numFreq = 70;
  const maxF = 70;
  const freqLabels = [];
  const origSpec = [];
  const derivSpec = [];
  const rampGain = [];

  for (let i = 0; i <= numFreq; i++) {
    const f = (i * maxF) / numFreq;
    freqLabels.push(f.toFixed(0));

    // Ganancia lineal normalizada de 2*pi*f
    const ramp = (2 * Math.PI * f) / (2 * Math.PI * f1);
    rampGain.push(Number(ramp.toFixed(2)));

    // Espectro de entrada
    const p1 = a1 * Math.exp(-Math.pow(f - f1, 2) / 6);
    const p2 = a2 * Math.exp(-Math.pow(f - f2, 2) / 6);
    const specIn = p1 + p2;

    // Espectro derivado: |j 2pi f X(f)|
    const specOut = (p1 * (2 * Math.PI * f1) + p2 * (2 * Math.PI * f2)) * derivScale;

    origSpec.push(Number(specIn.toFixed(3)));
    derivSpec.push(Number(specOut.toFixed(3)));
  }

  return {
    time: {
      labels: timeLabels,
      unit: 'ms',
      datasets: [
        {
          label: 'x(t) Original (15 Hz + 45 Hz)',
          data: xTime,
          borderColor: '#3b82f6',
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'dx(t)/dt Derivada (Realce de armónicos altos)',
          data: dxTime,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderWidth: 2.2,
          pointRadius: 0,
          fill: true,
        },
      ],
    },
    freq: {
      labels: freqLabels,
      unit: 'Hz',
      datasets: [
        {
          label: '|X(f)| Original (15 Hz = 1.0, 45 Hz = 0.45)',
          data: origSpec,
          borderColor: '#3b82f6',
          borderWidth: 2,
          pointRadius: 0,
        },
        {
          label: 'Factor |j 2π f| / (2π·15) (Ganancia lineal)',
          data: rampGain,
          borderColor: '#f97316',
          borderWidth: 1.8,
          borderDash: [4, 4],
          pointRadius: 0,
        },
        {
          label: '|X_deriv(f)| = 2π f · |X(f)| (45 Hz realzado a 1.35)',
          data: derivSpec,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.25)',
          borderWidth: 2.2,
          pointRadius: 0,
          fill: true,
        },
      ],
    },
  };
}

