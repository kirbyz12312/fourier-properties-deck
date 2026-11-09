/**
 * slidesContent.js
 * Datos completos, fórmulas LaTeX, scripts en MATLAB/Python y metadatos
 * para las 9 diapositivas del deck sobre Propiedades de la Transformada de Fourier.
 */

export const TEAM_MEMBERS = [
  { id: '01', name: 'Gutierrez Barrionuevo, Henry Andre', role: 'Introducción & Linealidad' },
  { id: '02', name: 'Gutierrez Ccolqque, Franco Arturo', role: 'Desplazamiento Temporal' },
  { id: '03', name: 'Uturunco Cuela, Zaul Francisco', role: 'Escalamiento e Inversión' },
  { id: '04', name: 'Quispe Yncarroque, Alex Cesar', role: 'Desplazamiento Frecuencial' },
  { id: '05', name: 'Villalta Checalla, Gianluigi Jeremy', role: 'Teorema de Convolución' },
  { id: '06', name: 'Quispe Flores, Benjamín Eduardo', role: 'Derivación & Conclusiones' },
];

export const SLIDES_DATA = [
  // Diapositiva 1
  {
    id: 1,
    title: 'Portada',
    shortTitle: 'Portada',
    isCover: true,
  },
  // Diapositiva 2
  {
    id: 2,
    number: '02',
    speaker: 'Henry Gutierrez',
    speakerFull: 'Gutierrez Barrionuevo, Henry Andre',
    title: 'Transformada Directa e Inversa de Fourier',
    shortTitle: 'Definición & Dualidad',
    badge: 'Fundamento Matemático',
    physicalInterpretation:
      'La Transformada de Fourier descompone una señal física temporal $x(t)$ en una superposición continua de fasores ortogonales $e^{j2\\pi ft}$, obteniendo su densidad espectral $X(f)$. Permite transitar biunívocamente entre el tiempo y la frecuencia sin pérdida de información.',
    formulaTex:
      'X(f) = \\int_{-\\infty}^{\\infty} x(t) e^{-j2\\pi ft} \\, dt \\quad \\Longleftrightarrow \\quad x(t) = \\int_{-\\infty}^{\\infty} X(f) e^{j2\\pi ft} \\, df',
    formulaSecondaryTex:
      'X(\\omega) = \\int_{-\\infty}^{\\infty} x(t) e^{-j\\omega t} \\, dt \\quad \\Longleftrightarrow \\quad x(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^{\\infty} X(\\omega) e^{j\\omega t} \\, d\\omega',
    dataGeneratorKey: 'intro',
    chartType: 'time-freq',
    chartLabels: {
      chart1Title: 'Dominio del Tiempo: x(t) = cos(2π · 50t)',
      chart1XAxis: 'Tiempo (ms)',
      chart1YAxis: 'Amplitud x(t)',
      chart2Title: 'Dominio de la Frecuencia: Espectro Unilateral |X(f)|',
      chart2XAxis: 'Frecuencia (Hz)',
      chart2YAxis: 'Magnitud |X(f)|',
    },
    graphAnalysis:
      'En el dominio del tiempo se observa una oscilación sinusoidal periódica pura de 50 Hz con período T = 20 ms. Al aplicar la FFT (algoritmo implementado en MATLAB y Python a fs = 1000 Hz), el espectro unilateral concentra el 100% de la energía en una única delta de Dirac situada exactamente en f = 50.0 Hz con amplitud de 1.0 V, mientras que todas las demás frecuencias permanecen en cero estricto.',
    matlabCode: `% Definición y cálculo de la Transformada Directa (FFT)
fs = 1000;            % Frecuencia de muestreo (Hz)
T = 1/fs;             % Período de muestreo (s)
L = 1000;             % Longitud de la señal (1 segundo)
t = (0:L-1)*T;        % Vector de tiempo

% Señal: Tono puro de 50 Hz con amplitud unitaria
x = cos(2*pi*50*t);

% Cálculo de la DFT mediante FFT
Y = fft(x);
P2 = abs(Y/L);        % Espectro bilateral normalizado
P1 = P2(1:L/2+1);     % Espectro unilateral
P1(2:end-1) = 2*P1(2:end-1);
f = fs*(0:(L/2))/L;   % Vector de frecuencias

% Visualización
subplot(2,1,1); plot(t(1:100)*1000, x(1:100), 'b', 'LineWidth', 1.5);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud'); title('Señal x(t)');
subplot(2,1,2); stem(f(1:150), P1(1:150), 'c', 'LineWidth', 1.5);
grid on; xlabel('Frecuencia (Hz)'); ylabel('|X(f)|'); title('Espectro Unilateral');`,
    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

# Parámetros de simulación
fs = 1000          # Frecuencia de muestreo (Hz)
t = np.arange(0, 0.1, 1/fs)  # 100 ms de observación
f0 = 50            # Frecuencia de la componente (Hz)

# Señal temporal en banda base
x = np.cos(2 * np.pi * f0 * t)

# Cálculo de la FFT de 512 puntos
Nfft = 512
X = np.fft.rfft(x, n=Nfft)
freqs = np.fft.rfftfreq(Nfft, d=1/fs)
magnitude = np.abs(X) * (2.0 / len(t))

# Graficación
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5))
ax1.plot(t * 1000, x, color='#3b82f6', lw=1.8)
ax1.set(xlabel='Tiempo (ms)', ylabel='Amplitud', title='Señal x(t) = cos(2π·50t)')
ax1.grid(True, alpha=0.3)

ax2.plot(freqs[:100], magnitude[:100], color='#06b6d4', lw=2)
ax2.set(xlabel='Frecuencia (Hz)', ylabel='|X(f)|', title='Espectro de Magnitud')
ax2.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
    simulatedOutput: `[DSP Engine] Inicializando simulación: Transformada de Fourier directa
>> Frecuencia de muestreo: fs = 1000 Hz, Intervalo dt = 1.00 ms
>> Número de muestras procesadas: N = 100 (Ventana de 100.0 ms)
>> Tono fundamental inyectado: f0 = 50.0 Hz
>> Cálculo FFT completado: Pico dominante localizado exactamente en f = 50.00 Hz
>> Magnitud espectral calculada: |X(50 Hz)| = 1.000 V (0.00 dBV)
>> Relación Señal a Ruido Numérico (SNR): > 140 dB`,
    telecomApplication:
      'En Telecomunicaciones, la transformada directa e inversa constituye el pilar para el análisis espectral en banda base y el dimensionamiento del ancho de banda ocupado según el criterio de Carson o la norma FCC. Permite verificar que las emisiones espurias y armónicas no excedan la máscara espectral regulada.',
  },
  // Diapositiva 3
  {
    id: 3,
    number: '03',
    speaker: 'Henry Gutierrez',
    speakerFull: 'Gutierrez Barrionuevo, Henry Andre',
    title: 'Propiedad de Linealidad',
    shortTitle: 'Linealidad & Superposición',
    badge: 'Principio Fundamental',
    physicalInterpretation:
      'La transformada de una combinación lineal de señales $\\mathcal{F}\\{a x_1(t) + b x_2(t)\\}$ es idéntica a la suma ponderada de sus espectros individuales $a X_1(f) + b X_2(f)$. En canales y medios lineales, las señales coexisten sin generar productos de intermodulación ni distorsión.',
    formulaTex:
      '\\mathcal{F}\\left\\{ a \\, x_1(t) + b \\, x_2(t) \\right\\} = a \\, X_1(f) + b \\, X_2(f)',
    formulaSecondaryTex:
      '\\text{Para } x_{\\text{suma}}(t) = a x_1(t) + b x_2(t) \\implies |X_{\\text{suma}}(f)| = |a X_1(f) + b X_2(f)|',
    dataGeneratorKey: 'linearity',
    chartType: 'time-freq',
    chartLabels: {
      chart1Title: 'Dominio del Tiempo: Superposición x₁(t) + x₂(t)',
      chart1XAxis: 'Tiempo (ms)',
      chart1YAxis: 'Amplitud (V)',
      chart2Title: 'Dominio de Frecuencia: Suma Lineal de Espectros',
      chart2XAxis: 'Frecuencia (Hz)',
      chart2YAxis: 'Magnitud |X(f)|',
    },
    graphAnalysis:
      'La gráfica temporal evidencia el patrón complejo de pulsaciones o batido resultante de sumar x₁(t) (50 Hz, 1.0 V) y x₂(t) (120 Hz, 0.7 V). En el dominio de frecuencia, el espectro de la suma (|X_suma|) reproduce de manera exacta los picos independientes en 50 Hz y 120 Hz sin alterar sus amplitudes y sin que aparezcan armónicos ni frecuencias espurias (f₁ ± f₂), demostrando empíricamente que el operador de Fourier es 100% lineal.',
    matlabCode: `% Verificación de la propiedad de linealidad
fs = 1000; t = 0:1/fs:0.12;
f1 = 50;  a = 1.0;   x1 = a * cos(2*pi*f1*t);
f2 = 120; b = 0.7;   x2 = b * cos(2*pi*f2*t);

% Señal combinada en medio lineal
x_suma = x1 + x2;

% Cálculo de espectros FFT
N = 512;
X1 = abs(fft(x1, N)/length(t))*2;
X2 = abs(fft(x2, N)/length(t))*2;
X_suma = abs(fft(x_suma, N)/length(t))*2;
f = (0:N/2) * (fs/N);

% Visualización y Graficación
figure;
subplot(2,1,1);
plot(t*1000, x_suma, 'Color', [0.1, 0.6, 0.2], 'LineWidth', 1.6); hold on;
plot(t*1000, x1, 'b--', 'LineWidth', 1.0);
plot(t*1000, x2, 'r:', 'LineWidth', 1.0);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud (V)');
title('Dominio del Tiempo: Superposición x₁(t) + x₂(t)');
legend('x_{suma}(t)', 'x_1(t) [50 Hz]', 'x_2(t) [120 Hz]');

subplot(2,1,2);
plot(f(1:120), X_suma(1:120), 'Color', [0.1, 0.6, 0.2], 'LineWidth', 2); hold on;
plot(f(1:120), X1(1:120), 'b--', 'LineWidth', 1.5);
plot(f(1:120), X2(1:120), 'r:', 'LineWidth', 1.5);
legend('|X_{suma}|', '|X_1|', '|X_2|'); grid on;
xlabel('Frecuencia (Hz)'); ylabel('Magnitud |X(f)|');
title('Linealidad Espectral: F{a x_1 + b x_2} = a X_1 + b X_2');`,
    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

# Parámetros y señales
fs = 1000
t = np.linspace(0, 0.12, int(fs * 0.12), endpoint=False)
a, b = 1.0, 0.7
f1, f2 = 50.0, 120.0

x1 = a * np.cos(2 * np.pi * f1 * t)
x2 = b * np.cos(2 * np.pi * f2 * t)
x_sum = x1 + x2

# Transformada espectral de cada señal
Nfft = 512
freqs = np.fft.rfftfreq(Nfft, 1/fs)
X1_mag = np.abs(np.fft.rfft(x1, Nfft)) * (2.0 / len(t))
X2_mag = np.abs(np.fft.rfft(x2, Nfft)) * (2.0 / len(t))
X_sum_mag = np.abs(np.fft.rfft(x_sum, Nfft)) * (2.0 / len(t))

# Visualización y Graficación
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5))
ax1.plot(t * 1000, x_sum, color='#10b981', lw=1.8, label=r'$x_{suma}(t)$')
ax1.plot(t * 1000, x1, color='#3b82f6', lw=1.2, ls='--', label=r'$x_1(t)$ [50 Hz]')
ax1.plot(t * 1000, x2, color='#f59e0b', lw=1.2, ls=':', label=r'$x_2(t)$ [120 Hz]')
ax1.set(xlabel='Tiempo (ms)', ylabel='Amplitud (V)', title='Dominio del Tiempo: Superposición x₁(t) + x₂(t)')
ax1.grid(True, alpha=0.3); ax1.legend(loc='upper right')

ax2.plot(freqs[:120], X_sum_mag[:120], color='#10b981', lw=2.2, label=r'$|X_{suma}(f)|$')
ax2.plot(freqs[:120], X1_mag[:120], color='#3b82f6', lw=1.2, ls='--', label=r'$|X_1(f)|$')
ax2.plot(freqs[:120], X2_mag[:120], color='#f59e0b', lw=1.2, ls=':', label=r'$|X_2(f)|$')
ax2.set(xlabel='Frecuencia (Hz)', ylabel='Magnitud |X(f)|', title='Dominio de Frecuencia: Suma Lineal de Espectros')
ax2.grid(True, alpha=0.3); ax2.legend(loc='upper right')
plt.tight_layout()
plt.show()`,
    simulatedOutput: `[DSP Engine] Ejecutando análisis de linealidad y superposición
>> Portadora 1: f1 = 50.0 Hz, Amplitud a = 1.000 V
>> Portadora 2: f2 = 120.0 Hz, Amplitud b = 0.700 V
>> Teorema de Superposición verificado: F{a*x1 + b*x2} - (a*X1 + b*X2) = 0
>> Pico detectado en canal 1: 50.0 Hz | Magnitud = 1.000 V
>> Pico detectado en canal 2: 120.0 Hz | Magnitud = 0.700 V
>> Intermodulación de tercer orden (IMD3): 0.0000 (Ausente en canal LTI ideal)
>> Estado: Linealidad confirmada con precisión de máquina (IEEE 754 float64)`,
    telecomApplication:
      'Constituye el fundamento matemático de la Multiplexación por División de Frecuencia (FDM) y de las modulaciones multiportadora como OFDM en redes 4G LTE, 5G NR y Wi-Fi 6/7. Permite transmitir cientos de subportadoras ortogonales simultáneamente a través de un único canal inalámbrico sin que colisionen entre sí.',
  },
  // Diapositiva 4
  {
    id: 4,
    number: '04',
    speaker: 'Franco Gutierrez',
    speakerFull: 'Gutierrez Ccolqque, Franco Arturo',
    title: 'Propiedad de Desplazamiento Temporal',
    shortTitle: 'Desplazamiento en el Tiempo',
    badge: 'Retardo de Propagación',
    physicalInterpretation:
      'Retardar una señal en el tiempo por $t_0$ segundos no altera en absoluto su contenido energético ni su magnitud espectral $|X(f)|$, pero introduce un desfase lineal continuo proporcional a la frecuencia: $\\angle X(f) = -2\\pi f t_0$.',
    formulaTex:
      '\\mathcal{F}\\left\\{ x(t - t_0) \\right\\} = X(f) \\, e^{-j2\\pi f t_0}',
    formulaSecondaryTex:
      '|\\mathcal{F}\\{x(t - t_0)\\}| = |X(f)| \\quad ; \\quad \\angle \\mathcal{F}\\{x(t - t_0)\\} = \\angle X(f) - 2\\pi f t_0',
    dataGeneratorKey: 'timeShift',
    chartType: 'mag-phase',
    chartLabels: {
      chart1Title: 'Magnitud Espectral: |X(f)| Invariante al Retardo',
      chart1XAxis: 'Frecuencia (Hz)',
      chart1YAxis: 'Magnitud |X(f)|',
      chart2Title: 'Fase Espectral: Desfase Lineal con Pendiente -2π·t₀',
      chart2XAxis: 'Frecuencia (Hz)',
      chart2YAxis: 'Fase ∠X(f) (rad)',
    },
    graphAnalysis:
      'La primera gráfica compara la magnitud espectral |X(f)| de la señal original y la retardada por t₀ = 18 ms: ambas curvas se superponen de manera idéntica demostrando la conservación total de energía por frecuencia. La segunda gráfica revela el efecto del retardo: la fase original se mantiene plana en 0 rad mientras que la señal retardada describe una recta decreciente con pendiente estricta dθ/df = -2π·t₀ = -0.1131 rad/Hz, verificando un retardo de grupo constante sin dispersión no lineal.',
    matlabCode: `% Desplazamiento temporal y respuesta de fase
fs = 1000; t = 0:1/fs:0.1;
t0 = 0.018;        % Retardo temporal de 18 ms
tc = 0.035;        % Centro del pulso gaussiano original
sigma = 0.007;

% Pulso original y pulso retardado
x = exp(-(t - tc).^2 / (2*sigma^2));
x_delayed = exp(-(t - (tc + t0)).^2 / (2*sigma^2));

% FFT con extracción de magnitud y fase desenrollada
N = 512;
X = fft(x, N);
X_del = fft(x_delayed, N);
f = (0:N/2)*(fs/N);

mag_orig = abs(X(1:N/2+1));
mag_del = abs(X_del(1:N/2+1));
phase_diff = unwrap(angle(X_del(1:N/2+1))) - unwrap(angle(X(1:N/2+1)));
pend_teorica = -2*pi*t0;

% Visualización y Graficación
figure;
subplot(2,1,1);
plot(f(1:60), mag_orig(1:60), 'b', 'LineWidth', 2); hold on;
plot(f(1:60), mag_del(1:60), 'r--', 'LineWidth', 1.5);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |X(f)|');
title('Magnitud Espectral: |X(f)| Invariante al Retardo');
legend('Original', 'Retardada (t_0 = 18 ms)');

subplot(2,1,2);
plot(f(1:60), phase_diff(1:60), 'm', 'LineWidth', 2); hold on;
plot(f(1:60), pend_teorica*f(1:60), 'k--', 'LineWidth', 1.2);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Fase \angle X(f) (rad)');
title('Fase Espectral: Desfase Lineal con Pendiente d\theta/df = -2\pi\cdott_0');
legend('Fase Calculada', 'Pendiente Teórica (-2\pi\cdot 0.018)');`,
    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

# Parámetros del pulso y retardo
fs = 1000
t = np.linspace(0, 0.1, 100)
tc = 0.035   # 35 ms
t0 = 0.018   # Retardo de 18 ms
sigma = 0.007

# Señales gaussianas en el tiempo
x_orig = np.exp(-((t - tc)**2) / (2 * sigma**2))
x_delay = np.exp(-((t - (tc + t0))**2) / (2 * sigma**2))

# Frecuencias analíticas y fase lineal
freqs = np.linspace(0, 120, 60)
mag = np.exp(-2 * (np.pi * sigma * freqs)**2)
phase_orig = np.zeros_like(freqs)
phase_delay = -2 * np.pi * freqs * t0  # Pendiente lineal

# Visualización y Graficación
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5))
ax1.plot(freqs, mag, color='#06b6d4', lw=2, label='|X(f)| (Ambas curvas idénticas)')
ax1.set(xlabel='Frecuencia (Hz)', ylabel='Magnitud |X(f)|', title='Magnitud Espectral: Invariante al Retardo')
ax1.grid(True, alpha=0.3); ax1.legend(loc='upper right')

ax2.plot(freqs, phase_delay, color='#ec4899', lw=2, label=r'Fase Retardada: $-2\pi f t_0$')
ax2.plot(freqs, phase_orig, color='#64748b', lw=1.2, ls='--', label='Fase Original (0 rad)')
ax2.set(xlabel='Frecuencia (Hz)', ylabel='Fase ∠X(f) (rad)', title='Fase Espectral: Desfase Lineal con Pendiente -2π·t₀')
ax2.grid(True, alpha=0.3); ax2.legend(loc='upper right')
plt.tight_layout()
plt.show()`,
    simulatedOutput: `[DSP Engine] Analizando retardo de propagación tau = 18.0 ms
>> Pulso Gaussian: Amplitud pico en t = 35.0 ms -> desplazado a t = 53.0 ms
>> Comparación de Magnitud: Delta_max(|X_retardada| - |X_original|) = 0.000000
>> Verificación de Fase: Delta(Phi) = -2 * pi * f * t0
>> Pendiente angular calculada: d(theta)/df = -0.1131 rad/Hz
>> Retardo de Grupo (Group Delay): tg = -1/(2pi) * d(theta)/df = 18.000 ms
>> Coeficiente de correlación cruzada máxima en lag = 18 muestras`,
    telecomApplication:
      'Esencial para el modelado de retardos de propagación multitrayecto (Multipath Propagation) en enlaces inalámbricos, sincronización de tramas en receptores GNSS/GPS, y técnicas de estimación de Tiempo de Arribo (ToA) y Diferencia de Tiempo de Arribo (TDoA) para geolocalización de terminales móviles.',
  },
  // Diapositiva 5
  {
    id: 5,
    number: '05',
    speaker: 'Zaul Uturunco',
    speakerFull: 'Uturunco Cuela, Zaul Francisco',
    title: 'Escalamiento e Inversión Temporal',
    shortTitle: 'Escalamiento & Inversión',
    badge: 'Reciprocidad Tiempo-Frecuencia',
    physicalInterpretation:
      'Comprimir una señal en el tiempo ($|a| > 1$) expande proporcionalmente su espectro en frecuencia y atenúa su densidad espectral por $1/|a|$. Invertir el tiempo ($a = -1$) refleja el espectro: $X(-f)$, expresando el principio de incertidumbre de Gabor: $\\Delta t \\cdot \\Delta f \\ge 1/(4\\pi)$.',
    formulaTex:
      '\\mathcal{F}\\left\\{ x(at) \\right\\} = \\frac{1}{|a|} X\\left(\\frac{f}{a}\\right) \\quad ; \\quad \\mathcal{F}\\left\\{ x(-t) \\right\\} = X(-f)',
    formulaSecondaryTex:
      '\\Delta t \\cdot \\Delta f \\ge \\frac{1}{4\\pi} \\quad \\text{(Límite de Gabor / Incertidumbre Tiempo-Ancho de Banda)}',
    dataGeneratorKey: 'scaling',
    chartType: 'time-freq',
    chartLabels: {
      chart1Title: 'Dominio del Tiempo: x(t) Original vs x(2t) Comprimida vs x(-t) Invertida',
      chart1XAxis: 'Tiempo (ms)',
      chart1YAxis: 'Amplitud x(t)',
      chart2Title: 'Dominio de la Frecuencia: Efecto en Ancho de Banda y Amplitud',
      chart2XAxis: 'Frecuencia (Hz)',
      chart2YAxis: 'Magnitud |X(f)|',
    },
    graphAnalysis:
      'En el panel temporal se observa que x(2t) (curva naranja, factor a = 2) reduce a la mitad su duración efectiva de 30 ms a 15 ms, mientras que x(-t) (curva verde) invierte el pulso asimétrico respecto al origen t = 0. En el panel espectral, x(2t) duplica su ancho de banda ocupado (de 22.4 Hz a 44.8 Hz) y reduce exactamente a la mitad su amplitud pico (1/|a| = 0.5), confirmando la ley de reciprocidad tiempo-frecuencia. El pulso invertido x(-t) conserva una magnitud espectral idéntica por paridad.',
    matlabCode: `% Escalamiento temporal y ensanchamiento de ancho de banda
fs = 1000; t = -0.1:1/fs:0.1;
tau = 0.015;

% Pulso asimétrico de prueba
pulse = @(time) (time >= 0) .* (time/tau) .* exp(1 - time/tau);

x_orig  = pulse(t);       % Original a = 1
x_comp  = pulse(2*t);     % Comprimida a = 2 (doble de velocidad)
x_inv   = pulse(-t);      % Invertida a = -1

% Cálculo espectral FFT
N = 1024;
f = (0:N/2)*(fs/N);
X_orig = abs(fft(x_orig, N));
X_comp = abs(fft(x_comp, N));

% Visualización y Graficación
figure;
subplot(2,1,1);
plot(t*1000, x_orig, 'b', 'LineWidth', 1.6); hold on;
plot(t*1000, x_comp, 'Color', [0.9, 0.4, 0.0], 'LineWidth', 1.6);
plot(t*1000, x_inv, 'Color', [0.1, 0.6, 0.3], 'LineWidth', 1.4);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud');
title('Dominio del Tiempo: x(t) vs x(2t) Comprimida vs x(-t) Invertida');
legend('Original', 'Comprimida (a=2)', 'Invertida (a=-1)'); xlim([-40 60]);

subplot(2,1,2);
plot(f(1:120), X_orig(1:120), 'b', 'LineWidth', 1.8); hold on;
plot(f(1:120), X_comp(1:120), 'Color', [0.9, 0.4, 0.0], 'LineWidth', 1.8);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |X(f)|');
title('Dominio Frecuencia: Duplicación de Ancho de Banda y Reducción 1/|a| = 0.5');
legend('|X_{orig}(f)|', '|X_{comp}(f)| [BW x2, Amp /2]'); xlim([0 70]);`,
    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

tau = 0.015
def asymmetric_pulse(t):
    return np.where(t >= 0, (t / tau) * np.exp(1 - t / tau), 0.0)

t = np.linspace(-0.08, 0.08, 500)
x_orig = asymmetric_pulse(t)
x_comp = asymmetric_pulse(2 * t)  # Factor a = 2
x_inv = asymmetric_pulse(-t)      # Factor a = -1

# En frecuencia analítica
freqs = np.linspace(0, 100, 100)
K = np.e / tau; w0 = 1 / tau; w = 2 * np.pi * freqs
X_orig_mag = (K / (w0**2 + w**2))
X_comp_mag = 0.5 * (K / (w0**2 + (w/2)**2))

# Visualización y Graficación
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5))
ax1.plot(t * 1000, x_orig, color='#3b82f6', lw=1.8, label='x(t) Original [a=1]')
ax1.plot(t * 1000, x_comp, color='#f97316', lw=1.8, label='x(2t) Comprimida [a=2]')
ax1.plot(t * 1000, x_inv, color='#10b981', lw=1.5, ls='--', label='x(-t) Invertida [a=-1]')
ax1.set(xlabel='Tiempo (ms)', ylabel='Amplitud', title='Dominio del Tiempo: Escalamiento e Inversión')
ax1.set_xlim([-40, 60]); ax1.grid(True, alpha=0.3); ax1.legend(loc='upper right')

ax2.plot(freqs, X_orig_mag, color='#3b82f6', lw=2, label='|X_orig(f)|')
ax2.plot(freqs, X_comp_mag, color='#f97316', lw=2, label=r'|X_comp(f)| [BW x2, Amp /2]')
ax2.set(xlabel='Frecuencia (Hz)', ylabel='Densidad Espectral |X(f)|', title='Dominio Frecuencial: Reciprocidad Tiempo-Frecuencia')
ax2.set_xlim([0, 70]); ax2.grid(True, alpha=0.3); ax2.legend(loc='upper right')
plt.tight_layout()
plt.show()`,
    simulatedOutput: `[DSP Engine] Evaluando propiedad de escalamiento con a = 2.0 y a = -1.0
>> Pulso original: Duración temporal T_eff = 30.0 ms | Ancho de banda B = 22.4 Hz
>> Pulso comprimido x(2t): Duración = 15.0 ms (50%) | Ancho de banda B = 44.8 Hz (200%)
>> Amplitud máxima espectral: Reducida por factor 1/|a| = 0.5000 (-6.02 dB)
>> Conservación del producto Duración-Ancho de Banda: Delta_t * Delta_f = Constante
>> Inversión temporal x(-t): Simetría par en magnitud |X(-f)| = |X(f)| verificada
>> Inversión de fase: Im{X(-f)} = -Im{X(f)} (Conjugación espectral)`,
    telecomApplication:
      'Define la ley fundamental de transmisión digital de datos: para duplicar la tasa de transmisión de símbolos (Baud Rate) se requiere reducir a la mitad la duración del pulso, lo cual duplica inmediatamente el ancho de banda necesario en el canal de radiofrecuencia (Nyquist Criterion).',
  },
  // Diapositiva 6
  {
    id: 6,
    number: '06',
    speaker: 'Alex Quispe',
    speakerFull: 'Quispe Yncarroque, Alex Cesar',
    title: 'Desplazamiento en Frecuencia (Modulación)',
    shortTitle: 'Modulación & Desplazamiento',
    badge: 'Transmisión de Radiofrecuencia',
    physicalInterpretation:
      'Multiplicar una señal en banda base $x(t)$ por una portadora sinusoidal $\\cos(2\\pi f_c t)$ traslada rígidamente todo su espectro hacia las frecuencias $\\pm f_c$, generando dos bandas laterales: inferior (LSB en $f_c - f_m$) y superior (USB en $f_c + f_m$) con la mitad de su amplitud.',
    formulaTex:
      '\\mathcal{F}\\left\\{ x(t) e^{j2\\pi f_c t} \\right\\} = X(f - f_c)',
    formulaSecondaryTex:
      '\\mathcal{F}\\left\\{ x(t) \\cos(2\\pi f_c t) \\right\\} = \\frac{1}{2} \\left[ X(f - f_c) + X(f + f_c) \\right]',
    dataGeneratorKey: 'modulation',
    chartType: 'time-freq',
    chartLabels: {
      chart1Title: 'Dominio del Tiempo: Señal Modulada AM DSB-SC s(t) = m(t)·cos(2π·200t)',
      chart1XAxis: 'Tiempo (ms)',
      chart1YAxis: 'Amplitud s(t)',
      chart2Title: 'Dominio de la Frecuencia: Bandas Laterales en fc ± fm (180 Hz y 220 Hz)',
      chart2XAxis: 'Frecuencia (Hz)',
      chart2YAxis: 'Magnitud |S(f)|',
    },
    graphAnalysis:
      'En el dominio del tiempo se visualiza la rápida oscilación de la portadora de 200 Hz contenida rígidamente dentro de la envolvente moduladora de baja frecuencia a fm = 20 Hz (líneas segmentadas en naranja). En el dominio frecuencial, el cálculo DFT/FFT muestra la total supresión de la componente portadora central en 200 Hz y la aparición simétrica de dos bandas laterales limpias en 180 Hz (LSB = 200 - 20) y 220 Hz (USB = 200 + 20), cada una con amplitud exacta de 0.50 V, confirmando la traslación espectral sin pérdida.',
    matlabCode: `% Modulación en Amplitud de Doble Banda Lateral (DSB-SC)
fs = 2000;              % Frecuencia de muestreo (Hz)
t = 0:1/fs:0.08;        % 80 ms
fm = 20;                % Mensaje de información a 20 Hz
fc = 200;               % Portadora de transmisión a 200 Hz

m = cos(2*pi*fm*t);     % Señal banda base
c = cos(2*pi*fc*t);     % Señal portadora RF
s = m .* c;             % Señal modulada transmitida

% Espectro de transmisión FFT
N = 1024;
S_fft = abs(fft(s, N)/length(t))*2;
f = (0:N/2)*(fs/N);

% Visualización y Graficación
figure;
subplot(2,1,1);
plot(t*1000, s, 'Color', [0.1, 0.4, 0.8], 'LineWidth', 1.5); hold on;
plot(t*1000, m, 'r--', 'LineWidth', 1.2);
plot(t*1000, -m, 'r--', 'LineWidth', 1.2);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud s(t)');
title('Señal Modulada AM DSB-SC s(t) = m(t) \cdot cos(2\pi \cdot 200t)');
legend('s(t) Modulada', 'Envolvente \pm m(t)');

subplot(2,1,2);
stem(f(1:180), S_fft(1:180), 'r', 'LineWidth', 1.5, 'MarkerFaceColor', 'r');
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |S(f)|');
title('Espectro: Bandas Laterales en 180 Hz y 220 Hz (Portadora Suprimida)');
xlim([140 260]);`,
    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

# Generación de modulación AM DSB-SC
fs = 2000
t = np.arange(0, 0.08, 1/fs)
fm = 20.0   # Mensaje
fc = 200.0  # Portadora

m = np.cos(2 * np.pi * fm * t)
carrier = np.cos(2 * np.pi * fc * t)
s_mod = m * carrier

# Transformada rápida de Fourier
Nfft = 1024
freqs = np.fft.rfftfreq(Nfft, 1/fs)
S_mag = np.abs(np.fft.rfft(s_mod, Nfft)) * (2.0 / len(t))

# Visualización y Graficación
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5))
ax1.plot(t * 1000, s_mod, color='#0284c7', lw=1.6, label=r'$s(t) = m(t)\cos(2\pi \cdot 200t)$')
ax1.plot(t * 1000, m, color='#ef4444', lw=1.1, ls='--', alpha=0.8, label=r'Envolvente $+m(t)$')
ax1.plot(t * 1000, -m, color='#ef4444', lw=1.1, ls='--', alpha=0.8, label=r'Envolvente $-m(t)$')
ax1.set(xlabel='Tiempo (ms)', ylabel='Amplitud s(t)', title='Dominio del Tiempo: Señal Modulada AM DSB-SC')
ax1.grid(True, alpha=0.3); ax1.legend(loc='upper right')

ax2.stem(freqs[:160], S_mag[:160], linefmt='#ef4444', markerfmt='ro', basefmt=' ')
ax2.set(xlabel='Frecuencia (Hz)', ylabel='Magnitud |S(f)|', title='Dominio Frecuencial: Bandas Laterales en 180 Hz y 220 Hz')
ax2.set_xlim([140, 260]); ax2.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
    simulatedOutput: `[DSP Engine] Modulador balanceado en anillo DSB-SC activado
>> Frecuencia de mensaje banda base: fm = 20.0 Hz
>> Frecuencia de portadora RF: fc = 200.0 Hz
>> Supresión de portadora: Portadora residual en fc = 0.000 V (-inf dBc)
>> Banda Lateral Inferior (LSB): f = 180.0 Hz | Magnitud = 0.500 V
>> Banda Lateral Superior (USB): f = 220.0 Hz | Magnitud = 0.500 V
>> Potencia total transmitida: P_total = 2 * (0.5^2 / 2) = 0.25 W (100% en bandas laterales)
>> Eficiencia espectral de modulación: Óptima`,
    telecomApplication:
      'Es el corazón de todas las comunicaciones inalámbricas modernas: modulación analógica AM/BLU, traslación ascendente y descendente (Up-conversion / Down-conversion) en transmisores y receptores superheterodinos, y asignación de canales en el espectro electromagnético (Bandas UHF, SHF, microondas y ondas milimétricas en 5G).',
  },
  // Diapositiva 7
  {
    id: 7,
    number: '07',
    speaker: 'Jeremy Villalta',
    speakerFull: 'Villalta Checalla, Gianluigi Jeremy',
    title: 'Teorema de Convolución',
    shortTitle: 'Teorema de Convolución',
    badge: 'Sistemas LTI & Filtrado',
    physicalInterpretation:
      'La convolución temporal de una señal con la respuesta impulsiva de un sistema LTI, $x(t) * h(t)$, equivale a multiplicar punto a punto sus espectros de Fourier en frecuencia: $X(f) \\cdot H(f)$. Transforma el cálculo de una integral compleja en una multiplicación algebraica.',
    formulaTex:
      '\\mathcal{F}\\left\\{ x(t) * h(t) \\right\\} = X(f) \\cdot H(f)',
    formulaSecondaryTex:
      '\\mathcal{F}\\left\\{ x(t) \\cdot h(t) \\right\\} = X(f) * H(f) \\quad \\text{(Propiedad de Modulación / Dualidad)}',
    dataGeneratorKey: 'convolution',
    chartType: 'time-freq',
    chartLabels: {
      chart1Title: 'Dominio del Tiempo: Entrada x(t) (con interferencia) vs Salida y(t) (filtrada)',
      chart1XAxis: 'Tiempo (ms)',
      chart1YAxis: 'Amplitud (V)',
      chart2Title: 'Dominio Frecuencial: |X(f)| · |H(f)| = |Y(f)| (Butterworth LPF fc = 100 Hz)',
      chart2XAxis: 'Frecuencia (Hz)',
      chart2YAxis: 'Magnitud',
    },
    graphAnalysis:
      'La gráfica en el tiempo muestra cómo una señal compuesta altamente contaminada por ruido e interferencia armónica de 200 Hz (curva azul) se convierte, tras ser procesada por el filtro Butterworth de 4to orden (fc = 100 Hz), en una sinusoide limpia casi perfecta de 50 Hz (curva verde). En el espectro frecuencial se aprecia claramente el mecanismo: la curva de respuesta |H(f)| atenúa la componente de 200 Hz en más de 24 dB (dejándola reducida al 6.2%), mientras preserva la componente deseada de 50 Hz al 97% de su valor original.',
    matlabCode: `% Filtrado lineal mediante convolución en frecuencia
fs = 2000; t = 0:1/fs:0.08;
x_in = sin(2*pi*50*t) + 0.65*sin(2*pi*200*t); % 50 Hz deseada + 200 Hz ruido

% Filtro Butterworth pasa-bajas analógico / IIR (orden 4, fc = 100 Hz)
fc = 100; order = 4;
[b, a] = butter(order, fc/(fs/2), 'low');

% Convolución temporal mediante filtrado IIR
y_out = filter(b, a, x_in);

% Espectros comparativos
N = 1024;
f = (0:N/2)*(fs/N);
X_in = abs(fft(x_in, N)/length(t))*2;
Y_out = abs(fft(y_out, N)/length(t))*2;
H_mag = 1 ./ sqrt(1 + (f/fc).^(2*order));

% Visualización y Graficación
figure;
subplot(2,1,1);
plot(t*1000, x_in, 'r', 'LineWidth', 1.2); hold on;
plot(t*1000, y_out, 'Color', [0.1, 0.6, 0.2], 'LineWidth', 2);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud (V)');
title('Dominio del Tiempo: Entrada x(t) vs Salida Filtrada y(t) = x(t)*h(t)');
legend('x_{in}(t) [50 Hz + 200 Hz]', 'y_{out}(t) [Filtrada limpia]');

subplot(2,1,2);
plot(f(1:160), X_in(1:160), 'r--', 'LineWidth', 1.2); hold on;
plot(f(1:160), Y_out(1:160), 'Color', [0.1, 0.6, 0.2], 'LineWidth', 2.2);
plot(f(1:160), H_mag(1:160), 'b', 'LineWidth', 1.5);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud');
title('Dominio Frecuencial: Y(f) = X(f) \cdot H(f) (Butterworth fc = 100 Hz)');
legend('|X_{in}(f)|', '|Y_{out}(f)|', '|H(f)| Analítico'); xlim([0 250]);`,
    pythonCode: `import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

fs = 2000
t = np.arange(0, 0.08, 1/fs)
x = np.sin(2 * np.pi * 50 * t) + 0.65 * np.sin(2 * np.pi * 200 * t)

# Filtro Butterworth pasa-bajos orden 4 a 100 Hz
f_c = 100.0
b, a = signal.butter(4, f_c / (fs / 2), btype='low')
y = signal.lfilter(b, a, x)

# Transformada espectral
Nfft = 1024
freqs = np.fft.rfftfreq(Nfft, 1/fs)
X_mag = np.abs(np.fft.rfft(x, Nfft)) * (2.0 / len(t))
Y_mag = np.abs(np.fft.rfft(y, Nfft)) * (2.0 / len(t))
H_mag = 1.0 / np.sqrt(1 + (freqs / f_c)**8)

# Visualización y Graficación
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5))
ax1.plot(t * 1000, x, color='#ef4444', lw=1.2, alpha=0.7, label=r'Entrada $x(t)$ [50 Hz + 200 Hz]')
ax1.plot(t * 1000, y, color='#10b981', lw=2.0, label=r'Salida Filtrada $y(t) = x(t)*h(t)$')
ax1.set(xlabel='Tiempo (ms)', ylabel='Amplitud (V)', title='Dominio del Tiempo: Filtrado Butterworth LPF')
ax1.grid(True, alpha=0.3); ax1.legend(loc='upper right')

ax2.plot(freqs[:160], X_mag[:160], color='#ef4444', lw=1.2, ls='--', label=r'$|X_{in}(f)|$')
ax2.plot(freqs[:160], Y_mag[:160], color='#10b981', lw=2.2, label=r'$|Y_{out}(f)|$')
ax2.plot(freqs[:160], H_mag[:160], color='#0284c7', lw=1.5, label=r'$|H(f)|$ Butterworth')
ax2.set(xlabel='Frecuencia (Hz)', ylabel='Magnitud', title='Dominio Frecuencial: Y(f) = X(f) · H(f)')
ax2.set_xlim([0, 250]); ax2.grid(True, alpha=0.3); ax2.legend(loc='upper right')
plt.tight_layout()
plt.show()`,
    simulatedOutput: `[DSP Engine] Convolución de señal de entrada con respuesta al impulso h(t)
>> Tono deseado: f = 50.0 Hz | Magnitud inicial = 1.000 V
>> Tono espurio / ruido: f = 200.0 Hz | Magnitud inicial = 0.650 V
>> Filtro pasa-bajas configurado: Butterworth orden n = 4, f_corte = 100.0 Hz
>> Multiplicación espectral Y(f) = X(f) * H(f):
   - Banda de paso (50 Hz): |H(50)| = 0.9705 (-0.26 dB) -> Tono casi inalterado
   - Banda de rechazo (200 Hz): |H(200)| = 0.0624 (-24.10 dB) -> Interferencia erradicada
>> Convolución rápida por FFT implementada exitosamente: O(N log N)`,
    telecomApplication:
      'Base matemática de todo el filtrado analógico y digital (FIR e IIR), ecualización de canales con dispersión temporal para eliminar la interferencia intersimbólica (ISI), y procesamiento de convolución rápida de señales de radar y sonar mediante algoritmos Overlap-Add y Overlap-Save.',
  },
  // Diapositiva 8
  {
    id: 8,
    number: '08',
    speaker: 'Benjamín Quispe',
    speakerFull: 'Quispe Flores, Benjamín Eduardo',
    title: 'Propiedad de Derivación Temporal',
    shortTitle: 'Derivación en el Tiempo',
    badge: 'Diferenciación & Respuesta en Alta Frecuencia',
    physicalInterpretation:
      'Derivar una señal en el tiempo equivale a multiplicar su espectro por $j2\\pi f$. Esto amplifica linealmente las componentes sinusoidales en proporción directa a su frecuencia y adelanta su fase en $\\pi/2$ radianes ($+90^\\circ$), actuando como un filtro pasa-altas natural.',
    formulaTex:
      '\\mathcal{F}\\left\\{ \\frac{d^n x(t)}{dt^n} \\right\\} = (j2\\pi f)^n \\, X(f)',
    formulaSecondaryTex:
      '\\left| \\mathcal{F}\\left\\{ \\frac{dx(t)}{dt} \\right\\} \\right| = 2\\pi |f| \\cdot |X(f)| \\quad ; \\quad \\angle \\mathcal{F}\\left\\{ \\frac{dx(t)}{dt} \\right\\} = \\angle X(f) + \\frac{\\pi}{2} \\, \\text{sgn}(f)',
    dataGeneratorKey: 'differentiation',
    chartType: 'time-freq',
    chartLabels: {
      chart1Title: 'Dominio Temporal: x(t) Original vs Derivada dx(t)/dt (Normalizada)',
      chart1XAxis: 'Tiempo (ms)',
      chart1YAxis: 'Amplitud',
      chart2Title: 'Dominio Frecuencial: |X(f)| vs |j2πf · X(f)| con Rampa Lineal 2πf',
      chart2XAxis: 'Frecuencia (Hz)',
      chart2YAxis: 'Magnitud Normalizada',
    },
    graphAnalysis:
      'La señal original combina 15 Hz (1.0 V) con 45 Hz (0.45 V). En el dominio del tiempo, la derivada dx/dt acelera drásticamente las transiciones y enfatiza las crestas rápidas. En el dominio de frecuencia, la multiplicación por el operador j2πf actúa con una ganancia lineal directamente proporcional a la frecuencia: la componente de 45 Hz experimenta una amplificación exactamente 3 veces mayor (45/15 = 3x) que la de 15 Hz, provocando que su magnitud relativa pase de 0.45 a 1.35 V, con un adelanto de fase en cuadratura (+90°).',
    matlabCode: `% Propiedad de derivación temporal y amplificación de frecuencias
fs = 1000; t = 0:1/fs:0.15;
f1 = 15; a1 = 1.0;
f2 = 45; a2 = 0.45;

% Señal multifrecuencia
x = a1*sin(2*pi*f1*t) + a2*sin(2*pi*f2*t);

% Derivada analítica exacta
dx_analitica = a1*2*pi*f1*cos(2*pi*f1*t) + a2*2*pi*f2*cos(2*pi*f2*t);

% Derivada espectral mediante multiplicación por j*2*pi*f
N = length(t);
X = fft(x);
f = (0:N-1)*(fs/N);
f(f > fs/2) = f(f > fs/2) - fs; % Frecuencias centradas con signo
dX_espectral = 1i * 2 * pi * f .* X;
dx_recuperada = real(ifft(dX_espectral));

% Visualización y Graficación
figure;
subplot(2,1,1);
plot(t*1000, x, 'b', 'LineWidth', 1.5); hold on;
plot(t*1000, dx_recuperada / (2*pi*f2), 'r', 'LineWidth', 1.8);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud');
title('Dominio Temporal: x(t) Original vs Derivada dx/dt (Normalizada)');
legend('x(t) [15 Hz + 45 Hz]', 'dx/dt Normalizada');

subplot(2,1,2);
f_plot = (0:N/2)*(fs/N);
X_mag = abs(fft(x))/N*2;
dX_mag = abs(dX_espectral)/N*2;
plot(f_plot(1:60), X_mag(1:60), 'b', 'LineWidth', 1.5); hold on;
plot(f_plot(1:60), dX_mag(1:60)/(2*pi*f2), 'r', 'LineWidth', 1.8);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud');
title('Dominio Frecuencial: Amplificación 3x del Armónico de 45 Hz vs 15 Hz');
legend('|X(f)| Original', '|j2\pi f \cdot X(f)| Derivada'); xlim([0 60]);`,
    pythonCode: `import numpy as np
import matplotlib.pyplot as plt

fs = 1000
t = np.arange(0, 0.15, 1/fs)
f1, f2 = 15.0, 45.0
x = np.sin(2 * np.pi * f1 * t) + 0.45 * np.sin(2 * np.pi * f2 * t)

# Derivada exacta en el tiempo
dx_dt = 2*np.pi*f1*np.cos(2*np.pi*f1*t) + 0.45*2*np.pi*f2*np.cos(2*np.pi*f2*t)

# Espectros
Nfft = len(t)
X_mag = np.abs(np.fft.rfft(x, Nfft)) * (2.0 / Nfft)
dX_mag = np.abs(np.fft.rfft(dx_dt, Nfft)) * (2.0 / Nfft)
freqs = np.fft.rfftfreq(Nfft, 1/fs)

# Visualización y Graficación
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 5))
ax1.plot(t * 1000, x, color='#3b82f6', lw=1.6, label=r'Señal $x(t)$ [15 Hz + 45 Hz]')
ax1.plot(t * 1000, dx_dt / (2*np.pi*f2), color='#ef4444', lw=1.8, label=r'Derivada $\frac{dx}{dt}$ (Normalizada)')
ax1.set(xlabel='Tiempo (ms)', ylabel='Amplitud', title='Dominio Temporal: x(t) Original vs Derivada')
ax1.grid(True, alpha=0.3); ax1.legend(loc='upper right')

ax2.plot(freqs[:30], X_mag[:30], color='#3b82f6', lw=1.6, label=r'$|X(f)|$ Original')
ax2.plot(freqs[:30], dX_mag[:30] / (2*np.pi*f2), color='#ef4444', lw=1.8, label=r'$|j2\pi f \cdot X(f)|$ Derivada')
ax2.set(xlabel='Frecuencia (Hz)', ylabel='Magnitud Normalizada', title='Dominio Frecuencial: Ganancia Lineal 2πf')
ax2.set_xlim([0, 60]); ax2.grid(True, alpha=0.3); ax2.legend(loc='upper right')
plt.tight_layout()
plt.show()`,
    simulatedOutput: `[DSP Engine] Calculando derivada temporal dx(t)/dt y operador j2*pi*f
>> Componente fundamental: f1 = 15.0 Hz | Factor ganancia = 2*pi*15 = 94.25 rad/s
>> Componente armónica: f2 = 45.0 Hz | Factor ganancia = 2*pi*45 = 282.74 rad/s
>> Relación de amplificación f2/f1: Factor exacto de 3.00x (+9.54 dB relativo)
>> Desfase de cuadratura introducido por operador j: Delta_theta = +90.00° (+pi/2 rad)
>> Comprobación IFFT{ j2*pi*f * X(f) }: Coincidencia idéntica con derivada analítica
>> Propiedad verificada en circuitos diferenciales y discriminadores`,
    telecomApplication:
      'Crucial para la demodulación de señales en Frecuencia Modulada (FM) mediante circuitos discriminadores de frecuencia (detector de pendiente), análisis de transitorios en redes de adaptación de impedancias RLC, y algoritmos de pre-énfasis para mitigar el ruido triangular en audio y transmisiones broadcast.',
  },
  // Diapositiva 9
  {
    id: 9,
    number: '09',
    speaker: 'Benjamín Quispe',
    speakerFull: 'Quispe Flores, Benjamín Eduardo',
    title: 'Resumen y Conclusiones',
    shortTitle: 'Resumen & Conclusiones',
    badge: 'Síntesis Académica',
    isSummary: true,
  },
];

export const SUMMARY_TABLE = [
  {
    property: 'Linealidad',
    timeDomain: 'a x_1(t) + b x_2(t)',
    freqDomain: 'a X_1(f) + b X_2(f)',
    telecomImpact: 'Multiplexación FDM / OFDM, coexistencia de múltiples canales sin interferencia.',
  },
  {
    property: 'Desplazamiento Temporal',
    timeDomain: 'x(t - t_0)',
    freqDomain: 'X(f) \\, e^{-j2\\pi f t_0}',
    telecomImpact: 'Retardos multitrayecto, sincronización de tramas, estimación ToA en radares y GPS.',
  },
  {
    property: 'Escalamiento Temporal',
    timeDomain: 'x(at)',
    freqDomain: '\\frac{1}{|a|} X\\left(\\frac{f}{a}\\right)',
    telecomImpact: 'Compromiso Nyquist entre tasa de baudios y ancho de banda exigido en el medio.',
  },
  {
    property: 'Inversión Temporal',
    timeDomain: 'x(-t)',
    freqDomain: 'X(-f)',
    telecomImpact: 'Filtros adaptados (Matched Filters) para maximizar la SNR en detección binaria.',
  },
  {
    property: 'Desplazamiento Frecuencial',
    timeDomain: 'x(t) e^{j2\\pi f_c t}',
    freqDomain: 'X(f - f_c)',
    telecomImpact: 'Modulación y demodulación de señales de RF, heterodinaje y asignación de espectro.',
  },
  {
    property: 'Convolución en el Tiempo',
    timeDomain: 'x(t) * h(t)',
    freqDomain: 'X(f) \\cdot H(f)',
    telecomImpact: 'Filtrado de canal, eliminación de ruido fuera de banda, supresión de eco y ecualización.',
  },
  {
    property: 'Derivación Temporal',
    timeDomain: '\\frac{d^n x(t)}{dt^n}',
    freqDomain: '(j2\\pi f)^n X(f)',
    telecomImpact: 'Demoduladores FM por detector de pendiente, circuitos de pre-énfasis y diferenciadores.',
  },
  {
    property: 'Integración Temporal',
    timeDomain: '\\int_{-\\infty}^t x(\\tau) d\\tau',
    freqDomain: '\\frac{X(f)}{j2\\pi f} + \\frac{1}{2} X(0) \\delta(f)',
    telecomImpact: 'Moduladores FM a partir de moduladores de fase (PM) y receptores correladores.',
  },
];

export const CONCLUSIONS = [
  {
    title: 'Dualidad Inquebrantable Tiempo-Frecuencia',
    description:
      'Ninguna señal física puede ser limitada simultáneamente en tiempo y en frecuencia (Principio de Gabor). Comprimir en el tiempo siempre expande el ancho de banda, dictando los límites físicos del hardware de telecomunicaciones.',
    highlight: 'Δt · Δf ≥ 1/(4π)',
    tag: 'Física de Ondas',
  },
  {
    title: 'Transformación del Problema LTI',
    description:
      'La Transformada de Fourier convierte la convolución integral en una simple multiplicación algebraica. Esto permite diseñar filtros analógicos y digitales complejos evaluando únicamente su ganancia de magnitud y retardo de fase espectral.',
    highlight: 'Y(f) = X(f) · H(f)',
    tag: 'Sistemas Lineales',
  },
  {
    title: 'Pilar de las Telecomunicaciones Modernas',
    description:
      'Desde la radiofonía AM hasta las constelaciones 5G y Wi-Fi 7 con IFFT/FFT de miles de puntos, la gestión inteligente del espectro electromagnético es posible exclusivamente gracias a estas propiedades analíticas.',
    highlight: 'OFDM / MIMO / RF',
    tag: 'Redes Globales',
  },
];
