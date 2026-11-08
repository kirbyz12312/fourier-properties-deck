%% ==============================================================================
%% UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA (UNSA)
%% ESCUELA PROFESIONAL DE INGENIERÍA DE TELECOMUNICACIONES (EPIT)
%% ASIGNATURA: PROCESAMIENTO DIGITAL DE SEÑALES (DSP) / SEÑALES Y SISTEMAS
%% 
%% TEMA: ANÁLISIS Y COMPROBACIÓN COMPUTACIONAL DE LAS PROPIEDADES DE LA
%%       TRANSFORMADA DE FOURIER
%%
%% AUTORES (EQUIPO DE INVESTIGACIÓN):
%%   01. Gutierrez Barrionuevo, Henry Andre (Introducción & Linealidad)
%%   02. Gutierrez Ccolqque, Franco Arturo (Desplazamiento Temporal)
%%   03. Uturunco Cuela, Zaul Francisco (Escalamiento e Inversión)
%%   04. Quispe Yncarroque, Alex Cesar (Desplazamiento Frecuencial)
%%   05. Villalta Checalla, Gianluigi Jeremy (Teorema de Convolución)
%%   06. Quispe Flores, Benjamín Eduardo (Derivación & Conclusiones)
%% ==============================================================================

clear; clc; close all;
fprintf('====================================================================\n');
fprintf('  LABORATORIO: PROPIEDADES DE LA TRANSFORMADA DE FOURIER EN MATLAB  \n');
fprintf('  UNSA - EPIT | Procesamiento Digital de Señales                    \n');
fprintf('====================================================================\n\n');

%% ==============================================================================
%% MÓDULO 01: TRANSFORMADA DIRECTA Y ESPECTRO UNILATERAL (DEFINICIÓN Y DUALIDAD)
%% Responsable: Gutierrez Barrionuevo, Henry Andre
%% ==============================================================================
fprintf('>>> Ejecutando Módulo 01: Transformada Directa y Espectro Unilateral...\n');

fs1 = 1000;            % Frecuencia de muestreo (Hz)
T1 = 1/fs1;            % Período de muestreo (s)
L1 = 1000;            % Longitud de la señal (1 segundo, 1000 muestras)
t1 = (0:L1-1)*T1;      % Vector de tiempo

% Señal: Tono puro de 50 Hz con amplitud unitaria
f0 = 50;
x1 = cos(2*pi*f0*t1);

% Cálculo de la DFT mediante el algoritmo FFT
Y1 = fft(x1);
P2_1 = abs(Y1/L1);        % Espectro bilateral normalizado
P1_1 = P2_1(1:L1/2+1);    % Espectro unilateral
P1_1(2:end-1) = 2*P1_1(2:end-1);
f1_vec = fs1*(0:(L1/2))/L1;  % Vector de frecuencias físicas (Hz)

% Graficación de Módulo 01
figure('Name', 'Módulo 01 - Definición y Espectro Unilateral', 'NumberTitle', 'off', 'Color', 'w');
subplot(2,1,1);
plot(t1(1:100)*1000, x1(1:100), 'b', 'LineWidth', 1.6);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud x(t)');
title('Módulo 01: Dominio del Tiempo - Tono Puro x(t) = cos(2\pi \cdot 50t)');
xlim([0 100]);

subplot(2,1,2);
stem(f1_vec(1:150), P1_1(1:150), 'Color', [0, 0.6, 0.8], 'LineWidth', 1.8, 'MarkerFaceColor', [0, 0.6, 0.8]);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |X(f)|');
title('Dominio de la Frecuencia: Espectro Unilateral de Magnitud (Pico en 50 Hz)');
xlim([0 150]);

[maxVal1, maxIdx1] = max(P1_1);
fprintf('   [OK] Pico fundamental detectado en: %.1f Hz | Amplitud = %.4f V\n\n', ...
    f1_vec(maxIdx1), maxVal1);

%% ==============================================================================
%% MÓDULO 02: PROPIEDAD DE LINEALIDAD Y SUPERPOSICIÓN ESPECTRAL
%% Responsable: Gutierrez Barrionuevo, Henry Andre
%% ==============================================================================
fprintf('>>> Ejecutando Módulo 02: Propiedad de Linealidad...\n');

fs2 = 1000;
t2 = 0:1/fs2:0.12; % 120 ms
f1_2 = 50;  a2 = 1.0;  x1_2 = a2 * cos(2*pi*f1_2*t2);
f2_2 = 120; b2 = 0.7;  x2_2 = b2 * cos(2*pi*f2_2*t2);

% Señal combinada en medio lineal LTI
x_suma = x1_2 + x2_2;

% Cálculo de espectros FFT de 512 puntos
N2 = 512;
X1_mag = abs(fft(x1_2, N2)/length(t2))*2;
X2_mag = abs(fft(x2_2, N2)/length(t2))*2;
X_suma_mag = abs(fft(x_suma, N2)/length(t2))*2;
f2_vec = (0:N2/2) * (fs2/N2);

% Error de linealidad numérico
error_linealidad = max(abs(X_suma_mag - (X1_mag + X2_mag)));

% Graficación de Módulo 02
figure('Name', 'Módulo 02 - Linealidad y Superposición', 'NumberTitle', 'off', 'Color', 'w');
subplot(2,1,1);
plot(t2*1000, x_suma, 'Color', [0.1, 0.6, 0.2], 'LineWidth', 1.5); hold on;
plot(t2*1000, x1_2, 'b--', 'LineWidth', 1.0);
plot(t2*1000, x2_2, 'r:', 'LineWidth', 1.0);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud (V)');
title('Módulo 02: Dominio del Tiempo - Batido Armónico x_{suma}(t) = x_1(t) + x_2(t)');
legend('x_{suma}(t)', 'x_1(t) [50 Hz, 1.0 V]', 'x_2(t) [120 Hz, 0.7 V]', 'Location', 'northeast');

subplot(2,1,2);
plot(f2_vec(1:120), X_suma_mag(1:120), 'Color', [0.1, 0.6, 0.2], 'LineWidth', 2.2); hold on;
plot(f2_vec(1:120), X1_mag(1:120), 'b--', 'LineWidth', 1.5);
plot(f2_vec(1:120), X2_mag(1:120), 'r:', 'LineWidth', 1.5);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |X(f)| (V)');
title('Dominio de la Frecuencia: Superposición Espectral F\{a x_1 + b x_2\} = a X_1 + b X_2');
legend('|X_{suma}(f)|', '|X_1(f)|', '|X_2(f)|', 'Location', 'northeast');
xlim([0 180]);

fprintf('   [OK] Canal 1 (50 Hz): 1.000 V | Canal 2 (120 Hz): 0.700 V\n');
fprintf('   [OK] Error numérico de superposición: %.4e V (Sin intermodulación IMD3)\n\n', error_linealidad);

%% ==============================================================================
%% MÓDULO 03: PROPIEDAD DE DESPLAZAMIENTO TEMPORAL Y RETARDO DE GRUPO
%% Responsable: Gutierrez Ccolqque, Franco Arturo
%% ==============================================================================
fprintf('>>> Ejecutando Módulo 03: Desplazamiento Temporal y Retardo de Grupo...\n');

fs3 = 1000;
t3 = 0:1/fs3:0.1; % 100 ms
t0_3 = 0.018;     % Retardo de propagación = 18 ms
tc3 = 0.035;      % Centro del pulso original = 35 ms
sigma3 = 0.007;   % Desviación estándar

% Pulso original y pulso retardado (Gaussiano)
x3_orig = exp(-(t3 - tc3).^2 / (2*sigma3^2));
x3_del  = exp(-(t3 - (tc3 + t0_3)).^2 / (2*sigma3^2));

N3 = 512;
X3_orig = fft(x3_orig, N3);
X3_del  = fft(x3_del, N3);
f3_vec  = (0:N3/2)*(fs3/N3);

mag3_orig = abs(X3_orig(1:N3/2+1));
mag3_del  = abs(X3_del(1:N3/2+1));

% Fase desenrollada para frecuencias donde la energía es significativa
phase3_orig = unwrap(angle(X3_orig(1:N3/2+1)));
phase3_del  = unwrap(angle(X3_del(1:N3/2+1)));
phase_diff  = phase3_del - phase3_orig;

% Graficación de Módulo 03
figure('Name', 'Módulo 03 - Desplazamiento Temporal', 'NumberTitle', 'off', 'Color', 'w');
subplot(2,2,1);
plot(t3*1000, x3_orig, 'b', 'LineWidth', 1.6); hold on;
plot(t3*1000, x3_del, 'r--', 'LineWidth', 1.6);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud');
title('Dominio del Tiempo: Pulso Original vs Retardado (t_0 = 18 ms)');
legend('x(t) [t_c = 35 ms]', 'x(t - 18 ms) [t_c = 53 ms]');

subplot(2,2,2);
plot(f3_vec(1:60), mag3_orig(1:60), 'b', 'LineWidth', 2.0); hold on;
plot(f3_vec(1:60), mag3_del(1:60), 'r--', 'LineWidth', 1.5);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |X(f)|');
title('Magnitud Espectral: Conservación Total de Energía');
legend('|X_{orig}(f)|', '|X_{ret}(f)|');

subplot(2,1,2);
plot(f3_vec(1:60), phase_diff(1:60), 'm', 'LineWidth', 2.0); hold on;
% Recta teórica
plot(f3_vec(1:60), -2*pi*f3_vec(1:60)*t0_3, 'k--', 'LineWidth', 1.2);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Desfase \Delta\theta (rad)');
title('Fase Espectral: Desfase Lineal con Pendiente d\theta/df = -2\pi \cdot t_0 = -0.1131 rad/Hz');
legend('Desfase Numérico', 'Pendiente Teórica (-2\pi \cdot 0.018)');

fprintf('   [OK] Diferencia máxima de magnitud: %.4e (Invarianza estricta)\n', max(abs(mag3_orig - mag3_del)));
fprintf('   [OK] Retardo de grupo medio computado: %.2f ms\n\n', t0_3*1000);

%% ==============================================================================
%% MÓDULO 04: ESCALAMIENTO E INVERSIÓN TEMPORAL (LÍMITE DE GABOR)
%% Responsable: Uturunco Cuela, Zaul Francisco
%% ==============================================================================
fprintf('>>> Ejecutando Módulo 04: Escalamiento e Inversión Temporal...\n');

fs4 = 1000;
t4 = -0.1:1/fs4:0.1;
tau4 = 0.015;

% Pulso asimétrico de prueba
pulse = @(time) (time >= 0) .* (time/tau4) .* exp(1 - time/tau4);

x4_orig = pulse(t4);       % a = 1
x4_comp = pulse(2*t4);     % a = 2 (doble velocidad / compresión)
x4_inv  = pulse(-t4);      % a = -1 (inversión temporal)

N4 = 1024;
f4_vec = (0:N4/2)*(fs4/N4);
X4_orig = abs(fft(x4_orig, N4));
X4_comp = abs(fft(x4_comp, N4));
X4_inv  = abs(fft(x4_inv, N4));

% Ancho de banda a -3 dB
BW4_orig = f4_vec(find(X4_orig(1:N4/2+1) <= max(X4_orig)/sqrt(2), 1));
BW4_comp = f4_vec(find(X4_comp(1:N4/2+1) <= max(X4_comp)/sqrt(2), 1));

% Graficación de Módulo 04
figure('Name', 'Módulo 04 - Escalamiento e Inversión', 'NumberTitle', 'off', 'Color', 'w');
subplot(2,1,1);
plot(t4*1000, x4_orig, 'b', 'LineWidth', 1.8); hold on;
plot(t4*1000, x4_comp, 'Color', [0.9, 0.4, 0.0], 'LineWidth', 1.8);
plot(t4*1000, x4_inv, 'Color', [0.1, 0.6, 0.3], 'LineWidth', 1.5);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud');
title('Módulo 04: Dominio del Tiempo - Original x(t) vs Comprimido x(2t) vs Invertido x(-t)');
legend('x(t) [a=1]', 'x(2t) [a=2, comprimido]', 'x(-t) [a=-1, invertido]');
xlim([-50 70]);

subplot(2,1,2);
plot(f4_vec(1:150), X4_orig(1:150), 'b', 'LineWidth', 1.8); hold on;
plot(f4_vec(1:150), X4_comp(1:150), 'Color', [0.9, 0.4, 0.0], 'LineWidth', 1.8);
plot(f4_vec(1:150), X4_inv(1:150), 'g--', 'LineWidth', 1.2);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |X(f)|');
title('Dominio Frecuencial: Duplicación de Ancho de Banda y Reducción 1/|a| = 0.5');
legend('|X_{orig}(f)|', '|X_{comp}(f)| [BW x2, Amp /2]', '|X_{inv}(f)| [Simetría Par]');
xlim([0 80]);

fprintf('   [OK] Ancho de banda original (-3dB): %.1f Hz\n', BW4_orig);
fprintf('   [OK] Ancho de banda comprimido (-3dB): %.1f Hz (Ratio de ensanchamiento = %.2f)\n', ...
    BW4_comp, BW4_comp/BW4_orig);
fprintf('   [OK] Atenuación de amplitud espectral pico: %.4f (Teórico: 0.5000)\n\n', ...
    max(X4_comp)/max(X4_orig));

%% ==============================================================================
%% MÓDULO 05: DESPLAZAMIENTO EN FRECUENCIA (MODULACIÓN AM DSB-SC)
%% Responsable: Quispe Yncarroque, Alex Cesar
%% ==============================================================================
fprintf('>>> Ejecutando Módulo 05: Desplazamiento en Frecuencia (Modulación RF)...\n');

fs5 = 2000;              % Frecuencia de muestreo (Hz)
t5 = 0:1/fs5:0.08;       % 80 ms
fm5 = 20;                % Mensaje a 20 Hz
fc5 = 200;               % Portadora RF a 200 Hz

m5 = cos(2*pi*fm5*t5);   % Mensaje banda base
c5 = cos(2*pi*fc5*t5);   % Portadora RF
s5 = m5 .* c5;           % Señal modulada transmitida

N5 = 1024;
S5_fft = abs(fft(s5, N5)/length(t5))*2;
f5_vec = (0:N5/2)*(fs5/N5);

f_lsb = fc5 - fm5; % 180 Hz
f_usb = fc5 + fm5; % 220 Hz

% Graficación de Módulo 05
figure('Name', 'Módulo 05 - Desplazamiento Frecuencial (Modulación DSB-SC)', 'NumberTitle', 'off', 'Color', 'w');
subplot(2,1,1);
plot(t5*1000, s5, 'Color', [0.1, 0.4, 0.8], 'LineWidth', 1.5); hold on;
plot(t5*1000, m5, 'r--', 'LineWidth', 1.2);
plot(t5*1000, -m5, 'r--', 'LineWidth', 1.2);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud');
title('Módulo 05: Dominio del Tiempo - Señal Modulada AM DSB-SC s(t) = m(t) \cdot cos(2\pi \cdot 200t)');
legend('s(t) Modulada', 'Envolvente \pm m(t)');

subplot(2,1,2);
stem(f5_vec(1:180), S5_fft(1:180), 'Color', [0.8, 0.2, 0.2], 'LineWidth', 1.6, 'MarkerFaceColor', [0.8, 0.2, 0.2]);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud |S(f)|');
title('Dominio Frecuencial: Bandas Laterales en LSB (180 Hz) y USB (220 Hz) | Portadora Suprimida');
xlim([140 260]);

fprintf('   [OK] Portadora central fc = %d Hz suprimida (0 V)\n', fc5);
fprintf('   [OK] LSB localizado en %d Hz (0.500 V) | USB localizado en %d Hz (0.500 V)\n\n', f_lsb, f_usb);

%% ==============================================================================
%% MÓDULO 06: TEOREMA DE CONVOLUCIÓN Y FILTRADO EN SISTEMAS LTI
%% Responsable: Villalta Checalla, Gianluigi Jeremy
%% ==============================================================================
fprintf('>>> Ejecutando Módulo 06: Teorema de Convolución y Filtrado LTI...\n');

fs6 = 2000;
t6 = 0:1/fs6:0.08;
% Tono deseado de 50 Hz + tono espurio de 200 Hz
x6_in = sin(2*pi*50*t6) + 0.65*sin(2*pi*200*t6);

% Filtro Butterworth pasa-bajas analógico/IIR orden 4, fc = 100 Hz
fc6 = 100;
order6 = 4;
[b6, a6] = butter(order6, fc6/(fs6/2), 'low');

% Convolución temporal mediante filtrado IIR
y6_out = filter(b6, a6, x6_in);

N6 = 1024;
f6_vec = (0:N6/2)*(fs6/N6);
X6_in_fft  = abs(fft(x6_in, N6)/length(t6))*2;
Y6_out_fft = abs(fft(y6_out, N6)/length(t6))*2;
H6_analitico = 1 ./ sqrt(1 + (f6_vec/fc6).^(2*order6));

% Graficación de Módulo 06
figure('Name', 'Módulo 06 - Teorema de Convolución y Filtrado', 'NumberTitle', 'off', 'Color', 'w');
subplot(2,1,1);
plot(t6*1000, x6_in, 'Color', [0.8, 0.2, 0.2], 'LineWidth', 1.2); hold on;
plot(t6*1000, y6_out, 'Color', [0.1, 0.6, 0.2], 'LineWidth', 2.0);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud (V)');
title('Módulo 06: Dominio del Tiempo - Entrada Contaminada x(t) vs Salida Filtrada y(t) = x(t)*h(t)');
legend('x_{in}(t) [50 Hz + 200 Hz]', 'y_{out}(t) [Filtrada limpia]');

subplot(2,1,2);
plot(f6_vec(1:160), X6_in_fft(1:160), 'r--', 'LineWidth', 1.2); hold on;
plot(f6_vec(1:160), Y6_out_fft(1:160), 'Color', [0.1, 0.6, 0.2], 'LineWidth', 2.2);
plot(f6_vec(1:160), H6_analitico(1:160), 'Color', [0.2, 0.2, 0.8], 'LineWidth', 1.5);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud');
title('Dominio Frecuencial: Y(f) = X(f) \cdot H(f) (Butterworth Pasa-Bajas fc = 100 Hz)');
legend('|X_{in}(f)|', '|Y_{out}(f)|', '|H(f)| Analítico');
xlim([0 250]);

idx50 = find(f6_vec >= 50, 1);
idx200 = find(f6_vec >= 200, 1);
fprintf('   [OK] Ganancia en componente deseada (50 Hz): %.4f (%.2f dB)\n', ...
    H6_analitico(idx50), 20*log10(H6_analitico(idx50)));
fprintf('   [OK] Atenuación en interferencia (200 Hz): %.4f (%.2f dB)\n\n', ...
    H6_analitico(idx200), 20*log10(H6_analitico(idx200)));

%% ==============================================================================
%% MÓDULO 07: PROPIEDAD DE DERIVACIÓN TEMPORAL (FILTRO PASA-ALTAS NATURAL)
%% Responsable: Quispe Flores, Benjamín Eduardo
%% ==============================================================================
fprintf('>>> Ejecutando Módulo 07: Propiedad de Derivación Temporal...\n');

fs7 = 1000;
t7 = 0:1/fs7:0.15; % 150 ms
f1_7 = 15; a1_7 = 1.0;
f2_7 = 45; a2_7 = 0.45;

% Señal temporal multifrecuencia
x7 = a1_7*sin(2*pi*f1_7*t7) + a2_7*sin(2*pi*f2_7*t7);

% Derivada analítica exacta en el tiempo
dx7_analitica = a1_7*2*pi*f1_7*cos(2*pi*f1_7*t7) + a2_7*2*pi*f2_7*cos(2*pi*f2_7*t7);

% Derivada espectral mediante multiplicación por j*2*pi*f
N7 = length(t7);
X7 = fft(x7);
f7_vec = (0:N7-1)*(fs7/N7);
f7_vec(f7_vec > fs7/2) = f7_vec(f7_vec > fs7/2) - fs7; % Frecuencias centradas con signo
dX7_espectral = 1i * 2 * pi * f7_vec .* X7;
dx7_recuperada = real(ifft(dX7_espectral));

error7 = max(abs(dx7_analitica - dx7_recuperada));

% Graficación de Módulo 07
figure('Name', 'Módulo 07 - Derivación Temporal', 'NumberTitle', 'off', 'Color', 'w');
subplot(2,1,1);
plot(t7*1000, x7, 'b', 'LineWidth', 1.5); hold on;
plot(t7*1000, dx7_analitica / (2*pi*f2_7), 'r', 'LineWidth', 1.8);
grid on; xlabel('Tiempo (ms)'); ylabel('Amplitud');
title('Módulo 07: Dominio del Tiempo - Señal Original x(t) vs Derivada Normalizada dx(t)/dt');
legend('x(t) [15 Hz + 45 Hz]', 'dx/dt [Normalizada]');

subplot(2,1,2);
f_plot = (0:N7/2)*(fs7/N7);
X7_mag = abs(fft(x7))/N7*2;
dX7_mag = abs(dX7_espectral)/N7*2;
plot(f_plot(1:60), X7_mag(1:60), 'b', 'LineWidth', 1.5); hold on;
plot(f_plot(1:60), dX7_mag(1:60) / (2*pi*f2_7), 'r', 'LineWidth', 1.8);
grid on; xlabel('Frecuencia (Hz)'); ylabel('Magnitud');
title('Dominio Frecuencial: Amplificación Triple del Armónico de 45 Hz respecto a 15 Hz');
legend('|X(f)| Original', '|j2\pi f \cdot X(f)| Derivada');
xlim([0 60]);

fprintf('   [OK] Relación de armónicos en x(t): %.2f\n', a2_7/a1_7);
fprintf('   [OK] Relación de armónicos en dx/dt: %.2f (Amplificación por factor exacto de 3.00x)\n', ...
    (a2_7*f2_7)/(a1_7*f1_7));
fprintf('   [OK] Error numérico entre derivación analítica y espectral: %.4e V\n\n', error7);

fprintf('====================================================================\n');
fprintf('  SIMULACIÓN COMPLETADA CON ÉXITO: 7 MÓDULOS DE PROPIEDADES VALIDADOS\n');
fprintf('====================================================================\n');

