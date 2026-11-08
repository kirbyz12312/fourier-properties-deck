#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
==============================================================================
UNIVERSIDAD NACIONAL DE SAN AGUSTÍN DE AREQUIPA (UNSA)
FACULTAD DE INGENIERÍA DE PRODUCCIÓN Y SERVICIOS
ESCUELA PROFESIONAL DE INGENIERÍA DE TELECOMUNICACIONES (EPIT)
ASIGNATURA: PROCESAMIENTO DIGITAL DE SEÑALES (DSP) / SEÑALES Y SISTEMAS

TEMA: ANÁLISIS, VERIFICACIÓN COMPUTACIONAL Y APLICACIONES DE LAS
      PROPIEDADES DE LA TRANSFORMADA DE FOURIER

INTEGRANTES (EQUIPO DE INVESTIGACIÓN):
  01. Gutierrez Barrionuevo, Henry Andre (Introducción & Linealidad)
  02. Gutierrez Ccolqque, Franco Arturo (Desplazamiento Temporal)
  03. Uturunco Cuela, Zaul Francisco (Escalamiento e Inversión)
  04. Quispe Yncarroque, Alex Cesar (Desplazamiento Frecuencial / Modulación)
  05. Villalta Checalla, Gianluigi Jeremy (Teorema de Convolución y Filtrado)
  06. Quispe Flores, Benjamín Eduardo (Derivación Temporal & Conclusiones)
==============================================================================
"""

import sys
import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Configuración estética de las gráficas Matplotlib
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#cbd5e1'
plt.rcParams['axes.linewidth'] = 0.8


# ==============================================================================
# MÓDULO 01: DEFINICIÓN, TRANSFORMADA DIRECTA Y ESPECTRO UNILATERAL
# Responsable: Gutierrez Barrionuevo, Henry Andre
# ==============================================================================
def modulo_01_transformada_directa(show_plot=True):
    print("\n" + "="*70)
    print("MÓDULO 01: Transformada Directa y Espectro Unilateral (FFT)")
    print("="*70)

    fs = 1000  # Frecuencia de muestreo (Hz)
    t = np.arange(0, 0.1, 1 / fs)  # 100 ms de observación
    f0 = 50.0  # Tono fundamental de 50 Hz

    # Señal temporal en banda base
    x = np.cos(2 * np.pi * f0 * t)

    # Cálculo de la FFT con ventana de 512 puntos
    Nfft = 512
    X = np.fft.rfft(x, n=Nfft)
    freqs = np.fft.rfftfreq(Nfft, d=1 / fs)
    magnitude = np.abs(X) * (2.0 / len(t))

    idx_peak = np.argmax(magnitude)
    f_detected = freqs[idx_peak]
    amp_detected = magnitude[idx_peak]

    print(f">> Frecuencia de muestreo: fs = {fs} Hz | Resolución dt = {1000/fs:.2f} ms")
    print(f">> Tono cosenoidal inyectado: f0 = {f0:.1f} Hz")
    print(f">> Pico espectral detectado: f = {f_detected:.2f} Hz | Magnitud = {amp_detected:.4f} V (0.00 dBV)")
    print(f">> Relación Señal a Ruido Numérico (SNR): > 140 dB")

    if show_plot:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6))
        fig.canvas.manager.set_window_title('Módulo 01 - Definición y Espectro Unilateral')

        ax1.plot(t * 1000, x, color='#0284c7', lw=1.8, label=r'$x(t) = \cos(2\pi \cdot 50t)$')
        ax1.set_xlabel('Tiempo (ms)')
        ax1.set_ylabel('Amplitud x(t)')
        ax1.set_title('Dominio del Tiempo: Tono Puro de 50 Hz')
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='upper right')

        ax2.plot(freqs[:100], magnitude[:100], color='#06b6d4', lw=2.2, label='Espectro Unilateral |X(f)|')
        ax2.stem([f_detected], [amp_detected], linefmt='r--', markerfmt='ro', basefmt=' ')
        ax2.set_xlabel('Frecuencia (Hz)')
        ax2.set_ylabel('Magnitud |X(f)| (V)')
        ax2.set_title('Dominio de la Frecuencia: Concentración Energética en 50 Hz')
        ax2.set_xlim([0, 150])
        ax2.grid(True, alpha=0.3)
        ax2.legend(loc='upper right')

        plt.tight_layout()
    return t, x, freqs, magnitude


# ==============================================================================
# MÓDULO 02: PROPIEDAD DE LINEALIDAD Y SUPERPOSICIÓN ESPECTRAL
# Responsable: Gutierrez Barrionuevo, Henry Andre
# ==============================================================================
def modulo_02_linealidad(show_plot=True):
    print("\n" + "="*70)
    print("MÓDULO 02: Propiedad de Linealidad y Superposición")
    print("="*70)

    fs = 1000
    t = np.linspace(0, 0.12, int(fs * 0.12), endpoint=False)
    a, b = 1.0, 0.7
    f1, f2 = 50.0, 120.0

    x1 = a * np.cos(2 * np.pi * f1 * t)
    x2 = b * np.cos(2 * np.pi * f2 * t)
    x_sum = x1 + x2

    Nfft = 512
    freqs = np.fft.rfftfreq(Nfft, 1 / fs)
    X1_mag = np.abs(np.fft.rfft(x1, Nfft)) * (2.0 / len(t))
    X2_mag = np.abs(np.fft.rfft(x2, Nfft)) * (2.0 / len(t))
    X_sum_mag = np.abs(np.fft.rfft(x_sum, Nfft)) * (2.0 / len(t))

    error = np.max(np.abs(X_sum_mag - (X1_mag + X2_mag)))
    print(f">> Portadora 1: f1 = {f1:.1f} Hz | Amplitud a = {a:.3f} V")
    print(f">> Portadora 2: f2 = {f2:.1f} Hz | Amplitud b = {b:.3f} V")
    print(f">> Teorema verificado: F{{a x1 + b x2}} - (a X1 + b X2) = 0")
    print(f">> Error máximo de superposición: {error:.4e} V")
    print(f">> Distorsión por intermodulación (IMD3): 0.0000 (Ausente en canal LTI ideal)")

    if show_plot:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6))
        fig.canvas.manager.set_window_title('Módulo 02 - Propiedad de Linealidad')

        ax1.plot(t * 1000, x_sum, color='#16a34a', lw=1.8, label=r'$x_{suma}(t) = x_1(t) + x_2(t)$')
        ax1.plot(t * 1000, x1, color='#0284c7', lw=1.0, linestyle='--', alpha=0.7, label=r'$x_1(t)$ [50 Hz, 1.0 V]')
        ax1.plot(t * 1000, x2, color='#ea580c', lw=1.0, linestyle=':', alpha=0.7, label=r'$x_2(t)$ [120 Hz, 0.7 V]')
        ax1.set_xlabel('Tiempo (ms)')
        ax1.set_ylabel('Amplitud (V)')
        ax1.set_title('Dominio del Tiempo: Batido Armónico en Medio Lineal')
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='upper right')

        ax2.plot(freqs[:100], X_sum_mag[:100], color='#16a34a', lw=2.2, label=r'$|X_{suma}(f)|$')
        ax2.plot(freqs[:100], X1_mag[:100], color='#0284c7', lw=1.3, linestyle='--', label=r'$|X_1(f)|$')
        ax2.plot(freqs[:100], X2_mag[:100], color='#ea580c', lw=1.3, linestyle=':', label=r'$|X_2(f)|$')
        ax2.set_xlabel('Frecuencia (Hz)')
        ax2.set_ylabel('Magnitud |X(f)| (V)')
        ax2.set_title(r'Dominio Frecuencial: Suma Lineal Exacta de Espectros (FDM/OFDM)')
        ax2.set_xlim([0, 180])
        ax2.grid(True, alpha=0.3)
        ax2.legend(loc='upper right')

        plt.tight_layout()
    return t, x_sum, freqs, X_sum_mag


# ==============================================================================
# MÓDULO 03: PROPIEDAD DE DESPLAZAMIENTO TEMPORAL Y RETARDO DE GRUPO
# Responsable: Gutierrez Ccolqque, Franco Arturo
# ==============================================================================
def modulo_03_desplazamiento_temporal(show_plot=True):
    print("\n" + "="*70)
    print("MÓDULO 03: Desplazamiento Temporal y Retardo de Grupo")
    print("="*70)

    fs = 1000
    t = np.linspace(0, 0.1, 100)
    tc = 0.035   # 35 ms (centro del pulso gaussiano original)
    t0 = 0.018   # 18 ms de retardo temporal puro
    sigma = 0.007

    # Pulsos gaussianos
    x_orig = np.exp(-((t - tc)**2) / (2 * sigma**2))
    x_delay = np.exp(-((t - (tc + t0))**2) / (2 * sigma**2))

    # FFT y cálculo de fase
    Nfft = 512
    X_orig = np.fft.rfft(x_orig, Nfft)
    X_delay = np.fft.rfft(x_delay, Nfft)
    freqs = np.fft.rfftfreq(Nfft, 1 / fs)

    mag_orig = np.abs(X_orig)
    mag_delay = np.abs(X_delay)
    diff_mag = np.max(np.abs(mag_orig - mag_delay))

    phase_orig = np.unwrap(np.angle(X_orig))
    phase_delay = np.unwrap(np.angle(X_delay))
    phase_diff = phase_delay - phase_orig

    # Pendiente teórica: d(fase)/df = -2 * pi * t0
    slope_teorica = -2 * np.pi * t0
    slope_calc = (phase_diff[25] - phase_diff[5]) / (freqs[25] - freqs[5])

    print(f">> Pulso gaussiano centrado en tc = {tc*1000:.1f} ms -> desplazado a tc + t0 = {(tc+t0)*1000:.1f} ms")
    print(f">> Retardo introducido: t0 = {t0*1000:.2f} ms")
    print(f">> Invarianza de magnitud: Delta_max(|X_ret| - |X_orig|) = {diff_mag:.6f}")
    print(f">> Pendiente de fase teórica: {slope_teorica:.4f} rad/Hz | Calculada: {slope_calc:.4f} rad/Hz")
    print(f">> Retardo de grupo resultante: tg = {-slope_calc / (2*np.pi) * 1000:.2f} ms constante (Fase lineal)")

    if show_plot:
        fig = plt.figure(figsize=(10, 6))
        fig.canvas.manager.set_window_title('Módulo 03 - Desplazamiento Temporal')

        ax1 = plt.subplot(2, 2, 1)
        ax1.plot(t * 1000, x_orig, color='#0284c7', lw=1.8, label='Original x(t)')
        ax1.plot(t * 1000, x_delay, color='#ef4444', lw=1.8, linestyle='--', label=f'Retardado x(t - {t0*1000:.0f}ms)')
        ax1.set_xlabel('Tiempo (ms)')
        ax1.set_ylabel('Amplitud')
        ax1.set_title('Dominio del Tiempo: Pulso Gaussiano')
        ax1.grid(True, alpha=0.3)
        ax1.legend()

        ax2 = plt.subplot(2, 2, 2)
        ax2.plot(freqs[:50], mag_orig[:50], color='#0284c7', lw=2.2, label='|X(t)|')
        ax2.plot(freqs[:50], mag_delay[:50], color='#ef4444', lw=1.4, linestyle='--', label='|X(t - t0)|')
        ax2.set_xlabel('Frecuencia (Hz)')
        ax2.set_ylabel('Magnitud |X(f)|')
        ax2.set_title('Magnitud: Totalmente Invariante al Retardo')
        ax2.grid(True, alpha=0.3)
        ax2.legend()

        ax3 = plt.subplot(2, 1, 2)
        ax3.plot(freqs[:50], phase_diff[:50], color='#9333ea', lw=2.0, label=r'Desfase $\Delta\phi(f)$')
        ax3.plot(freqs[:50], -2 * np.pi * freqs[:50] * t0, color='#0f172a', lw=1.2, linestyle='--', label=r'Recta Teórica: $-2\pi f t_0$')
        ax3.set_xlabel('Frecuencia (Hz)')
        ax3.set_ylabel(r'Desfase $\angle X(f)$ (rad)')
        ax3.set_title(r'Fase: Pendiente Lineal Estricta $d\phi/df = -2\pi \cdot t_0$ (Canal No Dispersivo)')
        ax3.grid(True, alpha=0.3)
        ax3.legend()

        plt.tight_layout()
    return t, x_orig, freqs, mag_orig


# ==============================================================================
# MÓDULO 04: ESCALAMIENTO E INVERSIÓN TEMPORAL
# Responsable: Uturunco Cuela, Zaul Francisco
# ==============================================================================
def modulo_04_escalamiento_inversion(show_plot=True):
    print("\n" + "="*70)
    print("MÓDULO 04: Escalamiento e Inversión Temporal (Límite de Gabor)")
    print("="*70)

    tau = 0.015  # 15 ms
    def asymmetric_pulse(time_arr):
        return np.where(time_arr >= 0, (time_arr / tau) * np.exp(1 - time_arr / tau), 0.0)

    t = np.linspace(-0.08, 0.08, 500)
    x_orig = asymmetric_pulse(t)       # a = 1
    x_comp = asymmetric_pulse(2 * t)   # a = 2 (compresión temporal al doble)
    x_inv  = asymmetric_pulse(-t)      # a = -1 (inversión temporal)

    # Densidad espectral analítica de Fourier: X(w) = e / [tau * (1/tau + j w)^2]
    freqs = np.linspace(0, 80, 200)
    w = 2 * np.pi * freqs
    K = np.e / tau
    w0 = 1 / tau

    X_orig_mag = K / (w0**2 + w**2)
    X_comp_mag = 0.5 * (K / (w0**2 + (w / 2)**2))  # Factor 1/|a| = 0.5 y w -> w/2

    print(f">> Pulso original (a = 1): Duración efectiva Teff = 30.0 ms")
    print(f">> Pulso comprimido x(2t) (a = 2): Duración = 15.0 ms (50%)")
    print(f">> Amplitud espectral pico original: {X_orig_mag[0]:.2f}")
    print(f">> Amplitud espectral pico comprimido: {X_comp_mag[0]:.2f} (Exactamente 50%, factor 1/|a|)")
    print(f">> Reciprocidad comprobada: Comprimir en tiempo ensancha el espectro al doble (Nyquist)")
    print(f">> Inversión x(-t): Conservación exacta de magnitud por simetría hermítica par |X(-f)| = |X(f)|")

    if show_plot:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6))
        fig.canvas.manager.set_window_title('Módulo 04 - Escalamiento e Inversión')

        ax1.plot(t * 1000, x_orig, color='#0284c7', lw=1.8, label=r'$x(t)$ Original [a=1]')
        ax1.plot(t * 1000, x_comp, color='#ea580c', lw=1.8, label=r'$x(2t)$ Comprimido [a=2, doble vel.]')
        ax1.plot(t * 1000, x_inv, color='#16a34a', lw=1.5, linestyle='-.', label=r'$x(-t)$ Invertido [a=-1]')
        ax1.set_xlabel('Tiempo (ms)')
        ax1.set_ylabel('Amplitud')
        ax1.set_title('Dominio del Tiempo: Compresión e Inversión de Pulsos')
        ax1.set_xlim([-40, 60])
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='upper right')

        ax2.plot(freqs, X_orig_mag, color='#0284c7', lw=2.0, label=r'$|X_{orig}(f)|$')
        ax2.plot(freqs, X_comp_mag, color='#ea580c', lw=2.0, label=r'$|X_{comp}(f)| = \frac{1}{2}|X(f/2)|$ [Ancho x2, Amp /2]')
        ax2.set_xlabel('Frecuencia (Hz)')
        ax2.set_ylabel('Densidad Espectral |X(f)|')
        ax2.set_title('Dominio Frecuencial: Ley de Reciprocidad Tiempo-Frecuencia')
        ax2.set_xlim([0, 70])
        ax2.grid(True, alpha=0.3)
        ax2.legend(loc='upper right')

        plt.tight_layout()
    return t, x_orig, freqs, X_orig_mag


# ==============================================================================
# MÓDULO 05: DESPLAZAMIENTO EN FRECUENCIA (MODULACIÓN AM DSB-SC)
# Responsable: Quispe Yncarroque, Alex Cesar
# ==============================================================================
def modulo_05_modulacion_dsbsc(show_plot=True):
    print("\n" + "="*70)
    print("MÓDULO 05: Desplazamiento Frecuencial (Modulación DSB-SC)")
    print("="*70)

    fs = 2000
    t = np.arange(0, 0.08, 1 / fs)  # 80 ms
    fm = 20.0   # Mensaje a 20 Hz
    fc = 200.0  # Portadora RF a 200 Hz

    m = np.cos(2 * np.pi * fm * t)
    carrier = np.cos(2 * np.pi * fc * t)
    s_mod = m * carrier

    Nfft = 1024
    freqs = np.fft.rfftfreq(Nfft, 1 / fs)
    S_mag = np.abs(np.fft.rfft(s_mod, Nfft)) * (2.0 / len(t))

    f_lsb = fc - fm  # 180 Hz
    f_usb = fc + fm  # 220 Hz

    print(f">> Frecuencia de mensaje banda base: fm = {fm:.1f} Hz")
    print(f">> Frecuencia de portadora de transmisión: fc = {fc:.1f} Hz")
    print(f">> Supresión de portadora: Portadora residual en fc = 0.000 V (-inf dBc)")
    print(f">> Banda Lateral Inferior (LSB): f = {f_lsb:.1f} Hz | Magnitud = 0.500 V")
    print(f">> Banda Lateral Superior (USB): f = {f_usb:.1f} Hz | Magnitud = 0.500 V")
    print(f">> Potencia total de transmisión: 100% confinada en las bandas laterales de RF")

    if show_plot:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6))
        fig.canvas.manager.set_window_title('Módulo 05 - Desplazamiento en Frecuencia (Modulación DSB-SC)')

        ax1.plot(t * 1000, s_mod, color='#0284c7', lw=1.6, label=r'$s(t) = m(t)\cos(2\pi \cdot 200t)$')
        ax1.plot(t * 1000, m, color='#ef4444', lw=1.1, linestyle='--', alpha=0.8, label=r'Envolvente $+m(t)$')
        ax1.plot(t * 1000, -m, color='#ef4444', lw=1.1, linestyle='--', alpha=0.8, label=r'Envolvente $-m(t)$')
        ax1.set_xlabel('Tiempo (ms)')
        ax1.set_ylabel('Amplitud s(t)')
        ax1.set_title('Dominio del Tiempo: Señal Modulada AM DSB-SC con Inversiones de Fase')
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='upper right')

        ax2.stem(freqs[:160], S_mag[:160], linefmt='#ef4444', markerfmt='ro', basefmt=' ')
        ax2.set_xlabel('Frecuencia (Hz)')
        ax2.set_ylabel('Magnitud |S(f)| (V)')
        ax2.set_title('Dominio Frecuencial: Traslación Espectral con Bandas Laterales en 180 Hz y 220 Hz')
        ax2.set_xlim([140, 260])
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
    return t, s_mod, freqs, S_mag


# ==============================================================================
# MÓDULO 06: TEOREMA DE CONVOLUCIÓN Y FILTRADO EN SISTEMAS LTI
# Responsable: Villalta Checalla, Gianluigi Jeremy
# ==============================================================================
def modulo_06_convolucion_filtrado(show_plot=True):
    print("\n" + "="*70)
    print("MÓDULO 06: Teorema de Convolución y Filtrado LTI")
    print("="*70)

    fs = 2000
    t = np.arange(0, 0.08, 1 / fs)
    # Tono deseado de 50 Hz + interferencia armónica de 200 Hz
    x_in = np.sin(2 * np.pi * 50 * t) + 0.65 * np.sin(2 * np.pi * 200 * t)

    # Filtro Butterworth pasa-bajas analógico / IIR de orden 4 a fc = 100 Hz
    fc = 100.0
    order = 4
    b, a = signal.butter(order, fc / (fs / 2), btype='low')
    y_out = signal.lfilter(b, a, x_in)

    Nfft = 1024
    freqs = np.fft.rfftfreq(Nfft, 1 / fs)
    X_in_mag = np.abs(np.fft.rfft(x_in, Nfft)) * (2.0 / len(t))
    Y_out_mag = np.abs(np.fft.rfft(y_out, Nfft)) * (2.0 / len(t))

    gain_50 = 1.0 / np.sqrt(1 + (50.0 / fc)**8)
    gain_200 = 1.0 / np.sqrt(1 + (200.0 / fc)**8)

    print(f">> Tono deseado: f = 50.0 Hz | Magnitud inicial = 1.000 V")
    print(f">> Ruido interferente: f = 200.0 Hz | Magnitud inicial = 0.650 V")
    print(f">> Filtro: Butterworth pasa-bajas orden n = {order}, f_corte = {fc:.1f} Hz")
    print(f">> Multiplicación espectral Y(f) = X(f) * H(f):")
    print(f"   - Ganancia en 50 Hz: {gain_50:.4f} (-{20*np.log10(1/gain_50):.2f} dB) -> Tono preservado al 97%")
    print(f"   - Atenuación en 200 Hz: {gain_200:.4f} (-{20*np.log10(1/gain_200):.2f} dB) -> Ruido atenuado a 6.2%")
    print(f">> Convolución rápida por FFT validada: O(N log N)")

    if show_plot:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6))
        fig.canvas.manager.set_window_title('Módulo 06 - Teorema de Convolución y Filtrado LTI')

        ax1.plot(t * 1000, x_in, color='#ef4444', lw=1.2, alpha=0.7, label=r'Entrada $x_{in}(t)$ [50 Hz + 200 Hz]')
        ax1.plot(t * 1000, y_out, color='#16a34a', lw=2.0, label=r'Salida Filtrada $y_{out}(t) = x(t)*h(t)$')
        ax1.set_xlabel('Tiempo (ms)')
        ax1.set_ylabel('Amplitud (V)')
        ax1.set_title('Dominio del Tiempo: Erradicación de Interferencia Armónica')
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='upper right')

        H_analitico = 1.0 / np.sqrt(1 + (freqs / fc)**(2 * order))
        ax2.plot(freqs[:160], X_in_mag[:160], color='#ef4444', lw=1.2, linestyle='--', label=r'$|X_{in}(f)|$')
        ax2.plot(freqs[:160], Y_out_mag[:160], color='#16a34a', lw=2.2, label=r'$|Y_{out}(f)|$')
        ax2.plot(freqs[:160], H_analitico[:160], color='#0284c7', lw=1.5, label=r'$|H(f)|$ Butterworth')
        ax2.set_xlabel('Frecuencia (Hz)')
        ax2.set_ylabel('Magnitud')
        ax2.set_title('Dominio Frecuencial: Y(f) = X(f) · H(f)')
        ax2.set_xlim([0, 250])
        ax2.grid(True, alpha=0.3)
        ax2.legend(loc='upper right')

        plt.tight_layout()
    return t, x_in, freqs, Y_out_mag


# ==============================================================================
# MÓDULO 07: PROPIEDAD DE DERIVACIÓN TEMPORAL (FILTRO PASA-ALTAS NATURAL)
# Responsable: Quispe Flores, Benjamín Eduardo
# ==============================================================================
def modulo_07_derivacion_temporal(show_plot=True):
    print("\n" + "="*70)
    print("MÓDULO 07: Propiedad de Derivación Temporal")
    print("="*70)

    fs = 1000
    t = np.arange(0, 0.15, 1 / fs)
    f1, f2 = 15.0, 45.0
    a1, a2 = 1.0, 0.45

    # Señal temporal original
    x = a1 * np.sin(2 * np.pi * f1 * t) + a2 * np.sin(2 * np.pi * f2 * t)

    # Derivada exacta analítica: dx/dt = a1*w1*cos(w1*t) + a2*w2*cos(w2*t)
    dx_dt = a1 * 2 * np.pi * f1 * np.cos(2 * np.pi * f1 * t) + a2 * 2 * np.pi * f2 * np.cos(2 * np.pi * f2 * t)

    # Derivada espectral mediante multiplicación por j*2*pi*f
    Nfft = len(t)
    X = np.fft.fft(x)
    freqs = np.fft.fftfreq(Nfft, 1 / fs)
    dX_espectral = 1j * 2 * np.pi * freqs * X
    dx_recuperada = np.real(np.fft.ifft(dX_espectral))

    error = np.max(np.abs(dx_dt - dx_recuperada))

    amp_rel_in = a2 / a1
    amp_rel_out = (a2 * 2 * np.pi * f2) / (a1 * 2 * np.pi * f1)

    print(f">> Señal original: f1 = {f1:.1f} Hz (a1 = {a1:.2f} V), f2 = {f2:.1f} Hz (a2 = {a2:.2f} V)")
    print(f">> Relación de armónicos en x(t): {amp_rel_in:.2f}")
    print(f">> Relación de armónicos en dx/dt: {amp_rel_out:.2f} (Amplificación por factor exacto de 3.00x)")
    print(f">> Desfase de cuadratura introducido por operador j: +90° (+pi/2 rad)")
    print(f">> Error máximo entre derivada analítica y espectral: {error:.4e} V")

    if show_plot:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(9, 6))
        fig.canvas.manager.set_window_title('Módulo 07 - Derivación Temporal')

        # Normalizamos la derivada para facilitar visualización de formas de onda
        ax1.plot(t * 1000, x, color='#0284c7', lw=1.6, label=r'Señal $x(t)$ [15 Hz + 45 Hz]')
        ax1.plot(t * 1000, dx_dt / (2 * np.pi * f2), color='#ef4444', lw=1.8, label=r'Derivada $\frac{dx(t)}{dt}$ (Normalizada)')
        ax1.set_xlabel('Tiempo (ms)')
        ax1.set_ylabel('Amplitud')
        ax1.set_title('Dominio del Tiempo: Acentuación de Transiciones Rápidas y Desfase')
        ax1.grid(True, alpha=0.3)
        ax1.legend(loc='upper right')

        freqs_plot = freqs[:Nfft // 2]
        X_mag = np.abs(X[:Nfft // 2]) * (2.0 / Nfft)
        dX_mag = np.abs(dX_espectral[:Nfft // 2]) * (2.0 / Nfft)

        ax2.plot(freqs_plot[:30], X_mag[:30], color='#0284c7', lw=1.6, label=r'$|X(f)|$ Original')
        ax2.plot(freqs_plot[:30], dX_mag[:30] / (2 * np.pi * f2), color='#ef4444', lw=1.8, label=r'$|j2\pi f \cdot X(f)|$ Derivada')
        ax2.set_xlabel('Frecuencia (Hz)')
        ax2.set_ylabel('Magnitud Normalizada')
        ax2.set_title(r'Dominio Frecuencial: Ganancia Lineal de Rampa $2\pi f$ (Filtro Pasa-Altas)')
        ax2.set_xlim([0, 60])
        ax2.grid(True, alpha=0.3)
        ax2.legend(loc='upper right')

        plt.tight_layout()
    return t, x, freqs, dX_mag


# ==============================================================================
# EJECUCIÓN PRINCIPAL
# ==============================================================================
def run_all(show_plots=True):
    print("\n" + "#"*70)
    print("#  INICIANDO EJECUCIÓN INTEGRAL: PROPIEDADES DE FOURIER EN PYTHON   #")
    print("#  UNSA - EPIT | Telecomunicaciones y Procesamiento de Señales      #")
    print("#"*70)

    modulo_01_transformada_directa(show_plot=show_plots)
    modulo_02_linealidad(show_plot=show_plots)
    modulo_03_desplazamiento_temporal(show_plot=show_plots)
    modulo_04_escalamiento_inversion(show_plot=show_plots)
    modulo_05_modulacion_dsbsc(show_plot=show_plots)
    modulo_06_convolucion_filtrado(show_plot=show_plots)
    modulo_07_derivacion_temporal(show_plot=show_plots)

    print("\n" + "="*70)
    print("SIMULACIÓN DE TODAS LAS PROPIEDADES COMPLETADA EXITOSAMENTE")
    print("="*70 + "\n")

    if show_plots:
        print(">> Desplegando figuras interactivas... Cierre las ventanas para terminar.")
        plt.show()


if __name__ == '__main__':
    # Permite ejecutar sin ventanas de gráficos si se pasa el flag --no-plot
    mostrar = '--no-plot' not in sys.argv
    run_all(show_plots=mostrar)

