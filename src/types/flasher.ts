export interface FlashSlot {
  id: string;
  name: string;
  address: string; // e.g. "0x0000", "0x8000", "0x10000"
  file: File | null;
  data: Uint8Array | null;
  size?: number;
  enabled: boolean;
}

export interface FirmwareBinarySource {
  name: string;
  address: string; // Hex string e.g. "0x0000", "0x8000", "0x10000"
  url: string;
  sizeBytes?: number;
  description: string;
  sha256?: string;
}

export interface FirmwarePreset {
  id: string;
  name: string;
  version: string;
  category: 'Official' | 'Community' | 'Utility' | 'IoT' | 'Runtimes' | 'Graphics' | 'Unverified';
  description: string;
  flashSize: string;
  chipTarget: string;
  features: string[];
  isFactory?: boolean;
  isCommunity?: boolean;
  isUnverified?: boolean;
  author?: string;
  sourceRepo?: string;
  starsCount?: number;
  downloadUrl?: string;
  binarySources: FirmwareBinarySource[];
  slots: {
    name: string;
    address: string;
    description: string;
    defaultData?: Uint8Array;
  }[];
}

export type SerialStatus = 'disconnected' | 'connecting' | 'connected' | 'flashing' | 'error';

export interface DeviceInfo {
  chip: string;
  mac?: string;
  features?: string[];
  crystal?: string;
  flashSize?: string;
}

export interface CodeTemplate {
  id: string;
  title: string;
  category: 'Display' | 'Sensors' | 'IoT & Network' | 'Audio & System';
  description: string;
  filename: string;
  code: string;
}

export type RGB565Format = 'c_array' | 'py_bytes' | 'raw_bin' | 'py_runner';

export interface ConversionOptions {
  width: number;
  height: number;
  dither: boolean;
  swapBytes: boolean; // True for ST7789 Big-Endian
  format: RGB565Format;
}
