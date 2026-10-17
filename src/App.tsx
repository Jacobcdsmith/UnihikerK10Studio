/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { Navbar } from './components/Navbar';
import { FlasherView } from './components/FlasherView';
import { TerminalView } from './components/TerminalView';
import { CodeEditorView } from './components/CodeEditorView';
import { AssetPipelineView } from './components/AssetPipelineView';
import { PinoutView } from './components/PinoutView';
import { FirmwareExplorerView } from './components/FirmwareExplorerView';
import { SecurityLabView } from './components/SecurityLabView';
import { FlashSlot, SerialStatus, DeviceInfo, FirmwarePreset } from './types/flasher';
import { flasherService, FlashFilePayload } from './services/espFlasher';
import { firmwareDownloader, DownloadProgress } from './services/firmwareDownloader';
import { FIRMWARE_PRESETS } from './data/firmwarePresets';

interface DownloadState {
  isDownloading: boolean;
  message: string;
  percentage: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'flasher' | 'explorer' | 'security' | 'terminal' | 'editor' | 'assets' | 'pinout'>('flasher');
  const [status, setStatus] = useState<SerialStatus>('disconnected');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadState, setDownloadState] = useState<DownloadState | null>(null);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [injectedFile, setInjectedFile] = useState<{ code: string; filename: string } | null>(null);

  const [slots, setSlots] = useState<FlashSlot[]>([
    { id: '1', name: 'Bootloader', address: '0x0000', file: null, data: null, enabled: true },
    { id: '2', name: 'Partition Table', address: '0x8000', file: null, data: null, enabled: true },
    { id: '3', name: 'MicroPython Application', address: '0x10000', file: null, data: null, enabled: true },
    { id: '4', name: 'VFS Storage (LittleFS / SPIFFS)', address: '0x210000', file: null, data: null, enabled: false },
  ]);

  const xtermRef = useRef<XTerm | null>(null);

  const writeToTerminal = (text: string) => {
    if (xtermRef.current) {
      xtermRef.current.write(text);
    }
  };

  const handleConnect = async () => {
    try {
      setStatus('connecting');
      writeToTerminal('\r\n\x1b[33m[SYS] Requesting USB Serial Port Access...\x1b[0m\r\n');
      const dev = await flasherService.connect(baudRate, writeToTerminal, false);
      setDeviceInfo(dev);
      setIsSimulated(flasherService.isSimulated());
      setStatus('connected');
    } catch (err: any) {
      writeToTerminal(`\r\n\x1b[31m[ERROR] Connection failed: ${err.message}\x1b[0m\r\n`);
      setStatus('error');
    }
  };

  const handleSimulatedConnect = async () => {
    try {
      setStatus('connecting');
      const dev = await flasherService.connect(baudRate, writeToTerminal, true);
      setDeviceInfo(dev);
      setIsSimulated(true);
      setStatus('connected');
    } catch (err: any) {
      setStatus('error');
    }
  };

  const handleDisconnect = async () => {
    await flasherService.disconnect();
    setStatus('disconnected');
    setDeviceInfo(null);
    setIsSimulated(false);
    writeToTerminal('\r\n\x1b[33m[SYS] UNIHIKER K10 Disconnected.\x1b[0m\r\n');
  };

  /**
   * One-Click Restore Factory Firmware:
   * Fetches official binaries from download URLs and auto-flashes to the board
   */
  const handleRestoreFactory = async (presetId: 'k10-factory-diag' | 'k10-micropython-v1-23') => {
    const preset = FIRMWARE_PRESETS.find((p) => p.id === presetId) || FIRMWARE_PRESETS[0];

    // Ensure connection first (if not connected, prompt connect or simulation)
    if (!flasherService.isConnected()) {
      if (flasherService.isWebSerialSupported()) {
        try {
          await handleConnect();
        } catch {
          return;
        }
      } else {
        await handleSimulatedConnect();
      }
    }

    try {
      setDownloadState({
        isDownloading: true,
        message: `Downloading ${preset.name}...`,
        percentage: 10,
      });

      writeToTerminal(`\r\n\x1b[35m=== Initiating Factory Restore: ${preset.name} ===\x1b[0m\r\n`);

      const payloads = await firmwareDownloader.fetchPresetBinaries(
        preset,
        (dl: DownloadProgress) => {
          setDownloadState({
            isDownloading: true,
            message: `Downloading ${dl.sourceName} (${dl.percentage}%)...`,
            percentage: dl.percentage,
          });
        },
        writeToTerminal
      );

      // Populate slots in UI for visibility
      setSlots((prev) =>
        prev.map((slot, idx) => {
          const match = payloads.find((p) => p.address === parseInt(slot.address, 16));
          if (match) {
            return {
              ...slot,
              data: match.data,
              size: match.data.length,
              enabled: true,
            };
          }
          return slot;
        })
      );

      setDownloadState(null);

      // Trigger automatic flashing with chip erase
      setIsFlashing(true);
      setStatus('flashing');
      setProgress(0);

      writeToTerminal('\x1b[36m[FLASH] Erasing flash sectors and restoring official partition layout...\x1b[0m\r\n');

      await flasherService.flash(
        payloads,
        true, // Erase all for clean factory state
        (fileIdx, written, total) => {
          const pct = Math.floor((written / total) * 100);
          setProgress(pct);
        },
        writeToTerminal
      );

      writeToTerminal(`\r\n\x1b[32m[FACTORY RESTORE COMPLETE] UNIHIKER K10 successfully restored to ${preset.version}!\x1b[0m\r\n`);
      await flasherService.resetBoard(true, writeToTerminal);
    } catch (err: any) {
      writeToTerminal(`\r\n\x1b[31m[RESTORE ERROR] ${err.message}\x1b[0m\r\n`);
    } finally {
      setDownloadState(null);
      setIsFlashing(false);
      setStatus('connected');
    }
  };

  const handleFlash = async (eraseAll: boolean, targetPreset?: FirmwarePreset) => {
    let flashFiles: FlashFilePayload[] = [];
    const activeSlots = slots.filter((s) => s.enabled && s.data);

    if (activeSlots.length > 0) {
      flashFiles = activeSlots.map((s) => ({
        address: parseInt(s.address, 16),
        data: s.data!,
      }));
    } else if (targetPreset && targetPreset.binarySources && targetPreset.binarySources.length > 0) {
      // Download preset binaries if user clicked flash on preset
      try {
        setDownloadState({
          isDownloading: true,
          message: `Fetching ${targetPreset.name} binary packages...`,
          percentage: 20,
        });

        flashFiles = await firmwareDownloader.fetchPresetBinaries(
          targetPreset,
          (dl: DownloadProgress) => {
            setDownloadState({
              isDownloading: true,
              message: `Downloading ${dl.sourceName} (${dl.percentage}%)...`,
              percentage: dl.percentage,
            });
          },
          writeToTerminal
        );
      } finally {
        setDownloadState(null);
      }
    } else {
      // Fallback empty payload
      flashFiles = [
        { address: 0x0000, data: new Uint8Array(4096) },
        { address: 0x8000, data: new Uint8Array(3072) },
        { address: 0x10000, data: new Uint8Array(65536) },
      ];
    }

    try {
      setIsFlashing(true);
      setStatus('flashing');
      setProgress(0);

      await flasherService.flash(
        flashFiles,
        eraseAll,
        (fileIdx, written, total) => {
          const pct = Math.floor((written / total) * 100);
          setProgress(pct);
        },
        writeToTerminal
      );
    } catch (err: any) {
      writeToTerminal(`\r\n\x1b[31m[FLASH ERROR] ${err.message}\x1b[0m\r\n`);
    } finally {
      setIsFlashing(false);
      setStatus('connected');
    }
  };

  const handleResetBoard = async () => {
    await flasherService.resetBoard(true, writeToTerminal);
  };

  const handleSendText = async (text: string) => {
    await flasherService.sendSerialText(text, writeToTerminal);
  };

  const handleSendControlChar = async (char: string) => {
    await flasherService.sendControlCharacter(char, writeToTerminal);
  };

  const handleInjectCodeToEditor = (code: string, filename: string) => {
    setInjectedFile({ code, filename });
    setActiveTab('editor');
    writeToTerminal(`\r\n\x1b[36m[AUTO-MAPPER] Successfully injected ${filename} into MicroPython Editor.\x1b[0m\r\n`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        status={status}
        deviceInfo={deviceInfo}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isSimulated={isSimulated}
      />

      <main className="flex-1 overflow-x-hidden">
        {activeTab === 'flasher' && (
          <FlasherView
            slots={slots}
            setSlots={setSlots}
            isFlashing={isFlashing}
            progress={progress}
            downloadState={downloadState}
            status={status}
            deviceInfo={deviceInfo}
            onFlash={handleFlash}
            onRestoreFactory={handleRestoreFactory}
            onReset={handleResetBoard}
            onConnect={handleConnect}
            onSimulateConnect={handleSimulatedConnect}
            isWebSerialSupported={flasherService.isWebSerialSupported()}
            isSimulated={isSimulated}
          />
        )}

        {activeTab === 'explorer' && (
          <FirmwareExplorerView
            status={status}
            onFlashPreset={async (preset) => {
              setActiveTab('flasher');
              await handleFlash(true, preset);
            }}
            onOpenAutoMapper={() => {
              setActiveTab('assets');
            }}
            onOpenSecurityLab={() => {
              setActiveTab('security');
            }}
            isBusy={isFlashing || (downloadState?.isDownloading ?? false)}
          />
        )}

        {activeTab === 'security' && (
          <SecurityLabView
            onOpenAutoMapper={() => {
              setActiveTab('assets');
            }}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
            }}
          />
        )}

        {activeTab === 'terminal' && (
          <TerminalView
            status={status}
            baudRate={baudRate}
            setBaudRate={setBaudRate}
            onSendText={handleSendText}
            onSendControlChar={handleSendControlChar}
            onResetBoard={handleResetBoard}
            xtermRef={xtermRef}
          />
        )}

        {activeTab === 'editor' && (
          <CodeEditorView
            status={status}
            onSendText={handleSendText}
            onSendControlChar={handleSendControlChar}
            onSwitchToTerminal={() => setActiveTab('terminal')}
            injectedFile={injectedFile}
          />
        )}

        {activeTab === 'assets' && (
          <AssetPipelineView
            status={status}
            onSendText={handleSendText}
            onSendControlChar={handleSendControlChar}
            onInjectCodeToEditor={handleInjectCodeToEditor}
          />
        )}

        {activeTab === 'pinout' && <PinoutView />}
      </main>
    </div>
  );
}
