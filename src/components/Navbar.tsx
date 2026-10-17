import React from 'react';
import { Cpu, Usb, CheckCircle2, AlertCircle, Compass } from 'lucide-react';
import { SerialStatus, DeviceInfo } from '../types/flasher';

interface NavbarProps {
  activeTab: 'flasher' | 'explorer' | 'security' | 'terminal' | 'editor' | 'assets' | 'pinout';
  setActiveTab: (tab: 'flasher' | 'explorer' | 'security' | 'terminal' | 'editor' | 'assets' | 'pinout') => void;
  status: SerialStatus;
  deviceInfo: DeviceInfo | null;
  onConnect: () => void;
  onDisconnect: () => void;
  isSimulated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  deviceInfo,
  onConnect,
  onDisconnect,
  isSimulated,
}) => {
  const isConnected = status === 'connected' || status === 'flashing';

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Brand wordmark (single line) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-600/30">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap block">
            UNIHIKER K10 Studio
          </span>
          <span className="text-xs text-slate-400 block -mt-0.5">
            ESP32-S3 Web Flasher & Toolchain
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links (single line, clean typography) */}
      <nav className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800/80 shrink-0">
        <button
          onClick={() => setActiveTab('flasher')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'flasher'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Firmware Flasher
        </button>
        <button
          onClick={() => setActiveTab('explorer')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'explorer'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Firmware Explorer
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Security Lab
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'terminal'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Serial REPL
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'editor'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          MicroPython Editor
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'assets'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          RGB565 Converter
        </button>
        <button
          onClick={() => setActiveTab('pinout')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            activeTab === 'pinout'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          K10 Pinout & Specs
        </button>
      </nav>

      {/* Zone 3: Connection Action (single primary action) */}
      <div className="flex items-center gap-3 shrink-0">
        {isConnected ? (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{deviceInfo?.chip || 'ESP32-S3'}</span>
              {isSimulated && (
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1 rounded ml-1 font-mono">
                  SIM
                </span>
              )}
            </div>
            <button
              onClick={onDisconnect}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition whitespace-nowrap"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={status === 'connecting'}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/25 disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
          >
            <Usb className="w-4 h-4" />
            {status === 'connecting' ? 'Connecting...' : 'Connect Board'}
          </button>
        )}
      </div>
    </header>
  );
};
