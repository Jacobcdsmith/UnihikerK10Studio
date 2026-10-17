import React from 'react';
import { Cpu, Eye, Radio, Sparkles, Sliders, Volume2, ShieldCheck, Compass } from 'lucide-react';

export const PinoutView: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          UNIHIKER K10 Hardware Architecture & Pinout
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprehensive pin mapping, peripheral addresses, and electrical specifications for the ESP32-S3 microcontroller.
        </p>
      </div>

      {/* SoC & Core Specs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Microcontroller</span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">ESP32-S3 (WROOM-1)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dual-core 32-bit Xtensa LX7 running at 240 MHz with vector instructions for AI acceleration.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Memory & Storage</span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">16MB Flash + 8MB PSRAM</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            High-speed Octal SPI PSRAM for large FrameBuffers and embedded MicroPython workloads.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-cyan-400">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Color Display</span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">2.8" IPS LCD (ST7789)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            240 x 320 resolution, 65k RGB565 colors, driven over 40MHz SPI bus with PWM backlight dimming.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-amber-400">
            <Radio className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Wireless Radio</span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Wi-Fi 4 + BLE 5.0</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            2.4 GHz 802.11 b/g/n Wi-Fi with Long Range mode and Bluetooth Low Energy Mesh capability.
          </p>
        </div>
      </div>

      {/* Hardware Pin Mapping Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-3">
          Onboard Peripheral GPIO Assignments
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                <th className="py-2.5 px-3">Peripheral</th>
                <th className="py-2.5 px-3">ESP32-S3 Pin</th>
                <th className="py-2.5 px-3">Signal Name</th>
                <th className="py-2.5 px-3">Protocol / Mode</th>
                <th className="py-2.5 px-3">Default Configuration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">ST7789 Display MOSI</td>
                <td className="py-2 px-3 text-indigo-400">GPIO 11</td>
                <td className="py-2 px-3">SPI2_MOSI</td>
                <td className="py-2 px-3">Master SPI (40MHz)</td>
                <td className="py-2 px-3 text-slate-400">Output Data</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">ST7789 Display SCLK</td>
                <td className="py-2 px-3 text-indigo-400">GPIO 12</td>
                <td className="py-2 px-3">SPI2_CLK</td>
                <td className="py-2 px-3">Master SPI Clock</td>
                <td className="py-2 px-3 text-slate-400">Output Clock</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">ST7789 Display CS</td>
                <td className="py-2 px-3 text-indigo-400">GPIO 10</td>
                <td className="py-2 px-3">LCD_CS</td>
                <td className="py-2 px-3">Chip Select (Active Low)</td>
                <td className="py-2 px-3 text-slate-400">Digital OUT</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">ST7789 Display DC / RS</td>
                <td className="py-2 px-3 text-indigo-400">GPIO 13</td>
                <td className="py-2 px-3">LCD_DC</td>
                <td className="py-2 px-3">Data / Command Select</td>
                <td className="py-2 px-3 text-slate-400">Digital OUT (0=CMD, 1=DATA)</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">ST7789 Display Reset</td>
                <td className="py-2 px-3 text-indigo-400">GPIO 9</td>
                <td className="py-2 px-3">LCD_RST</td>
                <td className="py-2 px-3">Hardware Reset</td>
                <td className="py-2 px-3 text-slate-400">Digital OUT (Active Low)</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">LCD Backlight Control</td>
                <td className="py-2 px-3 text-indigo-400">GPIO 14</td>
                <td className="py-2 px-3">LCD_BL</td>
                <td className="py-2 px-3">LEDC / PWM</td>
                <td className="py-2 px-3 text-slate-400">1000 Hz, 0-100% Duty Cycle</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">6-Axis IMU (SCL)</td>
                <td className="py-2 px-3 text-cyan-400">GPIO 40</td>
                <td className="py-2 px-3">I2C0_SCL</td>
                <td className="py-2 px-3">I2C Clock (400kHz)</td>
                <td className="py-2 px-3 text-slate-400">Pull-up 4.7kΩ</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">6-Axis IMU (SDA)</td>
                <td className="py-2 px-3 text-cyan-400">GPIO 41</td>
                <td className="py-2 px-3">I2C0_SDA</td>
                <td className="py-2 px-3">I2C Data (400kHz)</td>
                <td className="py-2 px-3 text-slate-400">Address 0x68 or 0x69</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">Ambient Light Sensor</td>
                <td className="py-2 px-3 text-amber-400">GPIO 4</td>
                <td className="py-2 px-3">LIGHT_ADC</td>
                <td className="py-2 px-3">ADC1_CH3</td>
                <td className="py-2 px-3 text-slate-400">12-bit Analog In (0 - 3.3V)</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">Onboard Speaker / Buzzer</td>
                <td className="py-2 px-3 text-emerald-400">GPIO 15</td>
                <td className="py-2 px-3">BUZZER_PWM</td>
                <td className="py-2 px-3">LEDC PWM Tone</td>
                <td className="py-2 px-3 text-slate-400">Tone Freq 100Hz - 10kHz</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">Button A (BOOT)</td>
                <td className="py-2 px-3 text-purple-400">GPIO 0</td>
                <td className="py-2 px-3">BOOT / BTN_A</td>
                <td className="py-2 px-3">Digital IN with Pull-up</td>
                <td className="py-2 px-3 text-slate-400">Active Low (0 when pressed)</td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-2 px-3 font-semibold text-white font-sans">Button B (User Key)</td>
                <td className="py-2 px-3 text-purple-400">GPIO 35</td>
                <td className="py-2 px-3">BTN_B</td>
                <td className="py-2 px-3">Digital IN with Pull-up</td>
                <td className="py-2 px-3 text-slate-400">Active Low (0 when pressed)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
