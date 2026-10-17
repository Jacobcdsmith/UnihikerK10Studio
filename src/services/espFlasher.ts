import { ESPLoader, Transport, ClassicReset } from 'esptool-js';
import { DeviceInfo } from '../types/flasher';

export interface FlashFilePayload {
  data: Uint8Array;
  address: number;
}

export type LogCallback = (text: string) => void;
export type ProgressCallback = (fileIndex: number, written: number, total: number) => void;

export class EspFlasherService {
  private port: any = null;
  private transport: Transport | null = null;
  private esploader: ESPLoader | null = null;
  private isSimulation = false;
  private deviceInfo: DeviceInfo | null = null;

  isWebSerialSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  getDeviceInfo(): DeviceInfo | null {
    return this.deviceInfo;
  }

  isSimulated(): boolean {
    return this.isSimulation;
  }

  async connect(
    baudRate: number = 115200,
    onLog: LogCallback,
    forceSimulation = false
  ): Promise<DeviceInfo> {
    if (forceSimulation || !this.isWebSerialSupported()) {
      this.isSimulation = true;
      this.deviceInfo = {
        chip: 'ESP32-S3 (Simulation)',
        mac: '7C:DF:A1:02:4B:9C',
        crystal: '40MHz',
        features: ['Wi-Fi 802.11b/g/n', 'BLE 5.0', 'Dual-Core LX7 @ 240MHz', '16MB Flash', '8MB Octal PSRAM'],
        flashSize: '16MB'
      };
      onLog('\x1b[33m[SYS] Connected in Simulated UNIHIKER K10 Mode.\x1b[0m\r\n');
      onLog('\x1b[32m[CHIP] ESP32-S3 (QFN56) revision v0.2, 16MB Flash, 8MB PSRAM\x1b[0m\r\n');
      onLog('\x1b[36m>>> MicroPython v1.23.0 on 2026-10-17; UNIHIKER K10 with ESP32S3\r\nType "help()" for more information.\r\n>>> \x1b[0m');
      return this.deviceInfo;
    }

    try {
      this.isSimulation = false;
      onLog('\x1b[36m[SYS] Requesting USB Serial Port...\x1b[0m\r\n');

      try {
        this.port = await (navigator as any).serial.requestPort({
          filters: [
            { usbVendorId: 0x303a }, // Espressif VID (Native USB & USB-JTAG)
            { usbVendorId: 0x1a86 }, // WCH CH340 / CH343
            { usbVendorId: 0x10c4 }, // Silicon Labs CP210x
            { usbVendorId: 0x0403 }, // FTDI
          ],
        });
      } catch (portErr: any) {
        if (portErr.name === 'NotFoundError') {
          onLog('\x1b[33m[CANCELLED] Serial port selection was dismissed by user.\x1b[0m\r\n');
          throw new Error('Port selection cancelled');
        }
        if (portErr.name === 'SecurityError') {
          onLog('\x1b[31m[SECURITY ERROR] Web Serial access blocked by browser security policy or iframe restrictions.\x1b[0m\r\n');
          throw new Error('Web Serial access blocked by browser security policy');
        }
        throw portErr;
      }

      this.transport = new Transport(this.port, true);

      const terminalAdapter = {
        clean: () => {},
        writeLine: (data: string) => onLog(data + '\r\n'),
        write: (data: string) => onLog(data),
      };

      // Multi-baud rate connection strategy with progressive fallback (921600 -> 460800 -> 115200)
      const tryBauds = [921600, 460800, 115200];
      let chipName = 'ESP32-S3';
      let syncSuccess = false;
      let lastSyncError: any = null;

      for (const testBaud of tryBauds) {
        try {
          onLog(`\x1b[34m[BOOT] Handshaking with ESP32-S3 ROM bootloader (${testBaud} baud)...\x1b[0m\r\n`);
          this.esploader = new ESPLoader({
            transport: this.transport,
            baudrate: testBaud,
            romBaudrate: 115200,
            terminal: terminalAdapter,
          });

          chipName = await this.esploader.main();
          syncSuccess = true;
          break;
        } catch (syncErr: any) {
          lastSyncError = syncErr;
          onLog(`\x1b[33m[RETRY] Handshake at ${testBaud} baud failed: ${syncErr.message || syncErr}. Retrying at lower baud rate...\x1b[0m\r\n`);
          await new Promise((r) => setTimeout(r, 150));
        }
      }

      if (!syncSuccess) {
        onLog('\r\n\x1b[31m[BOOTLOADER SYNC TIMEOUT] Could not synchronize with ESP32-S3 ROM bootloader.\x1b[0m\r\n');
        onLog('\x1b[33m--- UNIHIKER K10 MANUAL BOOTLOADER RESCUE SEQUENCE ---\x1b[0m\r\n');
        onLog('1. Press and hold Button A (BOOT / GPIO 0) on the UNIHIKER K10\r\n');
        onLog('2. Press and release the RESET button\r\n');
        onLog('3. Release Button A\r\n');
        onLog('4. Click "Connect" again in the top bar\r\n');
        throw new Error(lastSyncError?.message || 'Bootloader handshake timed out');
      }

      let mac = 'Unknown';
      try {
        if (this.esploader && this.esploader.chip && typeof (this.esploader.chip as any).readMac === 'function') {
          mac = await (this.esploader.chip as any).readMac();
        }
      } catch (e) {
        // Fallback MAC read
      }

      this.deviceInfo = {
        chip: chipName || 'ESP32-S3',
        mac: mac,
        crystal: '40MHz',
        features: ['Wi-Fi 802.11b/g/n', 'BLE 5.0', 'Dual Core LX7', '16MB Flash', 'Octal PSRAM'],
        flashSize: '16MB',
      };

      onLog(`\r\n\x1b[32m[SYS] Handshake Successful! Connected to ${this.deviceInfo.chip} (MAC: ${mac})\x1b[0m\r\n`);

      return this.deviceInfo;
    } catch (err: any) {
      if (this.transport) {
        try {
          await this.transport.disconnect();
        } catch {}
      }
      this.port = null;
      this.transport = null;
      this.esploader = null;
      throw err;
    }
  }

  async flash(
    files: FlashFilePayload[],
    eraseAll: boolean,
    onProgress: ProgressCallback,
    onLog: LogCallback
  ): Promise<void> {
    if (this.isSimulation) {
      onLog('\r\n\x1b[33m[SIMULATION] Starting Simulated Flash Write...\x1b[0m\r\n');
      const totalSteps = 24;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((res) => setTimeout(res, 60));
        const pct = Math.round((i / totalSteps) * 100);
        onProgress(0, pct, 100);
        if (i === 4) onLog('[FLASH] Writing Bootloader sector at 0x0000...\r\n');
        if (i === 8) onLog('[FLASH] Writing Partition Table at 0x8000...\r\n');
        if (i === 14) onLog('[FLASH] Writing Application Firmware at 0x10000...\r\n');
        if (i === 22) onLog('[VERIFY] MD5 Verification passed for all memory sectors.\r\n');
      }
      onLog('\r\n\x1b[32m[SUCCESS] Simulated Flash operation completed successfully!\x1b[0m\r\n');
      return;
    }

    if (!this.esploader) {
      throw new Error('Device is not connected. Please connect board first.');
    }

    onLog('\r\n\x1b[36m[FLASH] Initializing Flash Memory transfer...\x1b[0m\r\n');

    const flashOptions = {
      fileArray: files,
      flashMode: 'keep' as const,
      flashFreq: 'keep' as const,
      flashSize: 'keep' as const,
      eraseAll: eraseAll,
      compress: true,
      reportProgress: (fileIndex: number, written: number, total: number) => {
        onProgress(fileIndex, written, total);
      },
    };

    try {
      await this.esploader.writeFlash(flashOptions);
      onLog('\r\n\x1b[32m[SUCCESS] UNIHIKER K10 Firmware written and MD5 verified!\x1b[0m\r\n');
      await this.esploader.after();
    } catch (err: any) {
      onLog(`\r\n\x1b[31m[FLASH FAILURE] ${err.message || err}\x1b[0m\r\n`);
      onLog('\x1b[33m[TROUBLESHOOTING]\x1b[0m\r\n');
      onLog('• Ensure your USB cable supports high-speed data (not charging-only)\r\n');
      onLog('• If flashing fails mid-way, check "Erase Entire Flash Before Writing" and retry\r\n');
      onLog('• You can also reboot the board using Button A (BOOT) + RESET\r\n');
      throw err;
    }
  }

  async resetBoard(hardReset = false, onLog?: LogCallback): Promise<void> {
    if (this.isSimulation) {
      if (onLog) {
        onLog('\r\n\x1b[33m[RESET] Board reset pulse sent. Rebooting UNIHIKER K10...\x1b[0m\r\n');
        onLog('\x1b[36m>>> MicroPython v1.23.0 on 2026-10-17; UNIHIKER K10 with ESP32S3\r\n>>> \x1b[0m');
      }
      return;
    }

    try {
      if (this.transport) {
        const resetStrategy = new ClassicReset(this.transport, 50);
        await resetStrategy.reset();
        if (onLog) onLog('\r\n\x1b[32m[SYS] Hardware reset completed via DTR/RTS pulse.\x1b[0m\r\n');
      } else if (this.port) {
        await this.port.setSignals({ dataTerminalReady: false, requestToSend: true });
        await new Promise((res) => setTimeout(res, 100));
        await this.port.setSignals({ dataTerminalReady: true, requestToSend: false });
        await new Promise((res) => setTimeout(res, 100));
        await this.port.setSignals({ dataTerminalReady: false, requestToSend: false });
        if (onLog) onLog('\r\n\x1b[32m[SYS] DTR/RTS reset pulse dispatched.\x1b[0m\r\n');
      }
    } catch (err: any) {
      if (onLog) onLog(`\r\n\x1b[31m[RESET ERROR] ${err.message}\x1b[0m\r\n`);
    }
  }

  async sendSerialText(text: string, onLog?: LogCallback): Promise<void> {
    if (this.isSimulation) {
      if (onLog) {
        onLog(text + '\r\n');
        const clean = text.trim();
        if (clean === 'help()') {
          onLog('Welcome to MicroPython on the UNIHIKER K10!\r\nFor online docs please visit http://docs.micropython.org/\r\nControl commands:\r\n  CTRL-A -- enter raw REPL mode\r\n  CTRL-B -- enter normal REPL mode\r\n  CTRL-C -- interrupt a running program\r\n  CTRL-D -- soft reset\r\n>>> ');
        } else if (clean.startsWith('import os')) {
          onLog('>>> ');
        } else if (clean.includes('uname()')) {
          onLog("(sysname='esp32', nodename='unihiker-k10', release='1.23.0', version='v1.23 on 2026-10-17', machine='UNIHIKER K10 with ESP32S3')\r\n>>> ");
        } else if (clean.startsWith('print(')) {
          const match = clean.match(/print\((?:'|")(.+?)(?:'|")\)/);
          const out = match ? match[1] : 'Output';
          onLog(`${out}\r\n>>> `);
        } else {
          onLog(`>>> `);
        }
      }
      return;
    }

    if (this.transport && this.transport.device) {
      const encoder = new TextEncoder();
      const data = encoder.encode(text + '\r\n');
      if (this.transport.device.writable) {
        const writer = this.transport.device.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
      }
    }
  }

  async sendControlCharacter(code: string, onLog?: LogCallback): Promise<void> {
    if (this.isSimulation) {
      if (code === '\x03') {
        if (onLog) onLog('^C\r\nTraceback (most recent call last):\r\nKeyboardInterrupt\r\n>>> ');
      } else if (code === '\x04') {
        if (onLog) onLog('^D\r\nMPY: soft reboot\r\nMicroPython v1.23.0 on 2026-10-17; UNIHIKER K10 with ESP32S3\r\nType "help()" for more information.\r\n>>> ');
      } else {
        if (onLog) onLog('>>> ');
      }
      return;
    }

    if (this.transport && this.transport.device && this.transport.device.writable) {
      const encoder = new TextEncoder();
      const writer = this.transport.device.writable.getWriter();
      await writer.write(encoder.encode(code));
      writer.releaseLock();
    }
  }

  async disconnect(): Promise<void> {
    if (this.transport) {
      try {
        await this.transport.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
      this.transport = null;
      this.esploader = null;
      this.port = null;
    }
    this.isSimulation = false;
    this.deviceInfo = null;
  }

  isConnected(): boolean {
    return this.isSimulation || (this.transport !== null && this.esploader !== null);
  }
}

export const flasherService = new EspFlasherService();
