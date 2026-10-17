import React, { useState } from 'react';
import {
  Zap,
  RotateCw,
  Trash2,
  CheckCircle2,
  Sparkles,
  Download,
  AlertTriangle,
  FolderOpen,
  Info,
  ShieldAlert,
  ArrowRight,
  Search,
} from 'lucide-react';
import { FlashSlot, FirmwarePreset, SerialStatus, DeviceInfo } from '../types/flasher';
import { FIRMWARE_PRESETS } from '../data/firmwarePresets';

interface DownloadState {
  isDownloading: boolean;
  message: string;
  percentage: number;
}

interface FlasherViewProps {
  slots: FlashSlot[];
  setSlots: React.Dispatch<React.SetStateAction<FlashSlot[]>>;
  isFlashing: boolean;
  progress: number;
  downloadState: DownloadState | null;
  status: SerialStatus;
  deviceInfo: DeviceInfo | null;
  onFlash: (eraseAll: boolean, targetPreset?: FirmwarePreset) => Promise<void>;
  onRestoreFactory: (presetId: 'k10-factory-diag' | 'k10-micropython-v1-23') => Promise<void>;
  onReset: () => void;
  onConnect: () => void;
  onSimulateConnect: () => void;
  isWebSerialSupported: boolean;
  isSimulated: boolean;
}

export const FlasherView: React.FC<FlasherViewProps> = ({
  slots,
  setSlots,
  isFlashing,
  progress,
  downloadState,
  status,
  deviceInfo,
  onFlash,
  onRestoreFactory,
  onReset,
  onConnect,
  onSimulateConnect,
  isWebSerialSupported,
  isSimulated,
}) => {
  const [mode, setMode] = useState<'presets' | 'custom'>('presets');
  const [selectedPreset, setSelectedPreset] = useState<FirmwarePreset>(FIRMWARE_PRESETS[0]);
  const [eraseAll, setEraseAll] = useState(false);
  const [presetSearch, setPresetSearch] = useState('');
  const [presetCategory, setPresetCategory] = useState('All');

  const presetCategories = ['All', 'Official', 'Community', 'Runtimes', 'IoT', 'Graphics', 'Utility', 'Unverified'];

  const filteredPresets = FIRMWARE_PRESETS.filter((preset) => {
    const matchesSearch =
      preset.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
      preset.description.toLowerCase().includes(presetSearch.toLowerCase()) ||
      (preset.author && preset.author.toLowerCase().includes(presetSearch.toLowerCase())) ||
      preset.features.some((f) => f.toLowerCase().includes(presetSearch.toLowerCase()));

    const matchesCategory =
      presetCategory === 'All'
        ? true
        : presetCategory === 'Community'
        ? preset.isCommunity || preset.category === 'Community'
        : presetCategory === 'Official'
        ? preset.isFactory || preset.category === 'Official'
        : presetCategory === 'Unverified'
        ? preset.isUnverified || preset.category === 'Unverified'
        : preset.category.toLowerCase() === presetCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const isConnected = status === 'connected' || status === 'flashing';
  const isBusy = isFlashing || (downloadState?.isDownloading ?? false);

  const handleFileChange = (slotId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      const uint8 = new Uint8Array(buffer);
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, file, data: uint8, size: file.size, enabled: true } : s
        )
      );
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddressChange = (slotId: string, address: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, address } : s))
    );
  };

  const toggleSlotEnabled = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const clearSlotFile = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, file: null, data: null, size: undefined } : s))
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Unsupported Browser Banner */}
      {!isWebSerialSupported && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-200">
                Web Serial API Not Available in this Browser
              </h3>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                Direct USB hardware communication requires Google Chrome, Microsoft Edge, or Opera. You can still test all UNIHIKER K10 features, download presets, and run simulations using our built-in simulator mode.
              </p>
            </div>
          </div>
          {!isConnected && (
            <button
              onClick={onSimulateConnect}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-500 text-white shrink-0 transition"
            >
              Start Simulator
            </button>
          )}
        </div>
      )}

      {/* ONE-CLICK RESTORE FACTORY HERO CARD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Official Firmware Recovery
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-emerald-400 font-medium">Automatic Remote Download</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Restore Official UNIHIKER K10 Firmware
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Instantly download verified factory binaries from official repositories and flash directly to your UNIHIKER K10 with one click. Restores ST7789 display, sensors, bootloader, and default configurations.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => onRestoreFactory('k10-factory-diag')}
              disabled={isBusy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-500 transition shadow-lg shadow-indigo-600/30 whitespace-nowrap"
              title="Downloads official DFRobot factory test suite and auto-flashes to the board"
            >
              <Download className="w-4 h-4" />
              <span>Restore Factory Diag OS</span>
            </button>

            <button
              onClick={() => onRestoreFactory('k10-micropython-v1-23')}
              disabled={isBusy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800 disabled:text-slate-500 transition shadow-lg shadow-emerald-600/30 whitespace-nowrap"
              title="Downloads official UNIHIKER K10 MicroPython OS and auto-flashes to the board"
            >
              <Zap className="w-4 h-4" />
              <span>Flash Official MicroPython</span>
            </button>
          </div>
        </div>

        {/* Live Download & Flashing Progress Overlay */}
        {(downloadState?.isDownloading || isFlashing) && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-300 flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                {downloadState?.isDownloading ? downloadState.message : 'Flashing sectors to ESP32-S3 memory...'}
              </span>
              <span className="text-indigo-400 font-bold tabular-nums">
                {downloadState?.isDownloading ? `${downloadState.percentage}%` : `${progress}%`}
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 transition-all duration-150"
                style={{
                  width: `${downloadState?.isDownloading ? downloadState.percentage : progress}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mode Selection Segmented Control */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Firmware Library & Partition Payloads
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an official preset bundle or upload custom compiled binary files.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setMode('presets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              mode === 'presets'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bundled Firmware Presets
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              mode === 'custom'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Partitions
          </button>
        </div>
      </div>

      {mode === 'presets' ? (
        <div className="space-y-4">
          {/* Preset filter and search toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
              {presetCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPresetCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                    presetCategory === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {cat === 'All' ? 'All Presets' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={presetSearch}
                onChange={(e) => setPresetSearch(e.target.value)}
                placeholder="Search presets..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPresets.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`p-5 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900/90 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        {preset.category}
                      </span>
                      {preset.isFactory && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 rounded">
                          FACTORY
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {preset.version}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5">{preset.name}</h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    {preset.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Target: {preset.chipTarget}</span>
                  <span className="font-mono">{preset.flashSize}</span>
                </div>
              </div>
            );
          })}
        </div>

          {filteredPresets.length === 0 && (
            <div className="text-center py-8 bg-slate-900/30 border border-slate-800 rounded-xl text-xs text-slate-400">
              No firmware presets match "{presetSearch}". Try a different search term or category.
            </div>
          )}
        </div>
      ) : (
        /* Custom Flash Slots */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Partition Payload Configuration</span>
            <span>Offset Addresses must be hex (e.g. 0x0000, 0x10000)</span>
          </div>

          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition ${
                slot.enabled
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={slot.enabled}
                    onChange={() => toggleSlotEnabled(slot.id)}
                    disabled={isBusy}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {slot.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {slot.size ? `${(slot.size / 1024).toFixed(1)} KB` : 'No file selected'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
                    <span className="text-[11px] text-slate-500 mr-1 font-mono">Addr:</span>
                    <input
                      type="text"
                      value={slot.address}
                      onChange={(e) => handleAddressChange(slot.id, e.target.value)}
                      disabled={isBusy}
                      className="bg-transparent font-mono text-xs text-indigo-300 w-20 focus:outline-none"
                    />
                  </div>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>{slot.file ? 'Replace' : 'Browse .bin'}</span>
                    <input
                      type="file"
                      accept=".bin"
                      onChange={(e) => handleFileChange(slot.id, e)}
                      disabled={isBusy}
                      className="hidden"
                    />
                  </label>

                  {slot.file && (
                    <button
                      onClick={() => clearSlotFile(slot.id)}
                      disabled={isBusy}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                      title="Clear file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flashing Action Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Manual Flash Execution</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Flash selected preset or custom partition layout at 921,600 baud.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
            <input
              type="checkbox"
              checked={eraseAll}
              onChange={(e) => setEraseAll(e.target.checked)}
              disabled={isBusy}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Erase Entire Flash Before Writing</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          {isConnected ? (
            <button
              onClick={() => onFlash(eraseAll, mode === 'presets' ? selectedPreset : undefined)}
              disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800 disabled:text-slate-500 transition shadow-lg shadow-emerald-600/20"
            >
              <Zap className="w-4 h-4" />
              {isBusy
                ? 'Processing Firmware Flash...'
                : mode === 'presets'
                ? `Flash Preset: ${selectedPreset.name}`
                : 'Write Partitions to UNIHIKER K10'}
            </button>
          ) : (
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={onConnect}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/25"
              >
                <Zap className="w-4 h-4" />
                Connect UNIHIKER K10 to Flash
              </button>
              <button
                onClick={onSimulateConnect}
                className="py-3 px-4 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                Test in Simulator
              </button>
            </div>
          )}

          <button
            onClick={onReset}
            disabled={!isConnected || isBusy}
            className="px-4 py-3 rounded-lg text-xs font-semibold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Trigger hardware reset via DTR/RTS lines"
          >
            Hard Reset
          </button>
        </div>
      </div>

      {/* Embedded Hardware Boot Guide Note */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Troubleshooting ESP32-S3 USB Flashing:</span>
        </div>
        <p className="leading-relaxed">
          • If connection times out or fails to handshake, hold the <strong className="text-slate-200">BOOT</strong> button (Button A) on the back of the UNIHIKER K10, press and release the <strong className="text-slate-200">RESET</strong> button, then release the BOOT button. This forces the ROM bootloader into download mode.
        </p>
        <p className="leading-relaxed">
          • UNIHIKER K10 features dual USB-C ports: ensure your cable is plugged into the main <strong className="text-slate-200">ESP32-S3 USB</strong> port, not a power-only bank port.
        </p>
      </div>
    </div>
  );
};
