export type CompatibilityStatus = 'compatible' | 'incompatible' | 'under_review';

export interface SecurityTool {
  id: string;
  name: string;
  purpose: string;
  category: 'Cryptography & eFuse' | 'Wireless & RF Auditing' | 'Hardware & Bus Analysis' | 'Firmware Integrity';
  downloadSource: string;
  license: string;
  targetHardware: string;
  compatibilityStatus: CompatibilityStatus;
  compatibilityNotes: string;
  constraints: {
    socArchitecture?: string; // e.g. "Xtensa LX7 Dual-Core"
    wirelessRadio?: string;   // e.g. "Wi-Fi 802.11 b/g/n (2.4GHz)"
    bleSupport?: string;      // e.g. "BLE 5.0"
    usbInterface?: string;    // e.g. "USB-OTG / Serial-JTAG"
    psramRequirement?: string;// e.g. "8MB Octal PSRAM"
    flashRequirement?: string;// e.g. "Requires >= 4MB Flash"
  };
  features: string[];
  docUrl?: string;
  githubStars?: number;
}
