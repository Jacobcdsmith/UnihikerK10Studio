import { FirmwarePreset } from '../types/flasher';

export const FIRMWARE_PRESETS: FirmwarePreset[] = [
  // --- Official Category ---
  {
    id: 'k10-factory-diag',
    name: 'UNIHIKER K10 Factory Diagnostic & Self-Test OS',
    version: 'v2.1.4-factory',
    category: 'Official',
    isFactory: true,
    author: 'DFRobot Official',
    sourceRepo: 'https://github.com/DFRobot/Unihiker_K10_Firmware',
    starsCount: 142,
    description: 'Original DFRobot UNIHIKER K10 factory self-test suite. Restores factory defaults and sequentially verifies ST7789 color display, touchscreen, 6-axis IMU, ambient light sensor, microphone VU-meter, and buzzer.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3 (Dual Core LX7)',
    downloadUrl: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/unihiker_k10_factory_diag_v2.1.4.bin',
    features: [
      'Original DFRobot factory calibration & test suite',
      'ST7789 240x320 screen color bars & touchscreen test',
      '6-axis IMU gyroscope & bubble level visualizer',
      'Button A/B debounce & microphone VU-meter',
      'Restores factory NVS calibration'
    ],
    binarySources: [
      {
        name: 'Factory Bootloader',
        address: '0x0000',
        url: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/bootloader.bin',
        sizeBytes: 16384,
        description: 'ESP32-S3 secondary bootloader with Octal PSRAM timing'
      },
      {
        name: 'Partition Table',
        address: '0x8000',
        url: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/partitions.bin',
        sizeBytes: 3072,
        description: 'Factory partition map with NVS, phy_init, and factory application'
      },
      {
        name: 'Factory Application Image',
        address: '0x10000',
        url: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/unihiker_k10_factory_diag_v2.1.4.bin',
        sizeBytes: 1572864,
        description: 'Complete UNIHIKER K10 hardware test application'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Factory bootloader' },
      { name: 'Partition Table', address: '0x8000', description: 'Diagnostic partition table' },
      { name: 'Diagnostic Suite Binary', address: '0x10000', description: 'DFRobot Factory QA & calibration application' }
    ]
  },
  {
    id: 'k10-micropython-v1-23',
    name: 'UNIHIKER K10 Official MicroPython OS',
    version: 'v1.23.0-k10',
    category: 'Official',
    isFactory: false,
    author: 'DFRobot & MicroPython Core',
    sourceRepo: 'https://github.com/DFRobot/Unihiker_K10_MicroPython',
    starsCount: 389,
    description: 'Preconfigured MicroPython environment tailored for UNIHIKER K10 hardware: ST7789 display, ICM20689 6-axis IMU, AHT20 temperature/humidity, light sensor, and I2S audio.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3 (Dual Core LX7)',
    downloadUrl: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/unihiker_k10_micropython_v1.23.0.bin',
    features: [
      'ST7789 240x320 Display Driver pre-compiled',
      'Onboard 6-Axis Motion Sensor module',
      'Dual Core FreeRTOS threading support',
      'Full asyncio & WebREPL network modules'
    ],
    binarySources: [
      {
        name: 'Bootloader',
        address: '0x0000',
        url: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/bootloader_s3_octal.bin',
        sizeBytes: 16384,
        description: 'ESP32-S3 secondary bootloader with Octal SPI PSRAM support'
      },
      {
        name: 'Partition Table',
        address: '0x8000',
        url: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/partitions_16mb.bin',
        sizeBytes: 3072,
        description: 'Custom 16MB partition map (NVS, otadata, phy_init, factory app, vfs)'
      },
      {
        name: 'MicroPython Unified Binary',
        address: '0x10000',
        url: 'https://raw.githubusercontent.com/DFRobot/Unihiker_K10_Firmware/main/release/unihiker_k10_micropython_v1.23.0.bin',
        sizeBytes: 2097152,
        description: 'MicroPython v1.23 kernel image for UNIHIKER K10 ESP32-S3'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'ESP32-S3 secondary bootloader with Octal SPI PSRAM support' },
      { name: 'Partition Table', address: '0x8000', description: 'Custom 16MB partition map' },
      { name: 'MicroPython Firmware', address: '0x10000', description: 'MicroPython v1.23 kernel image' }
    ]
  },

  // --- Community Category ---
  {
    id: 'k10-esp32-marauder',
    name: 'ESP32 Marauder Wi-Fi & BLE Research Firmware',
    version: 'v1.1.0-s3',
    category: 'Community',
    isCommunity: true,
    author: 'JustCallMeKo & Marauder Project',
    sourceRepo: 'https://github.com/justcallmekoko/ESP32Marauder',
    starsCount: 5600,
    description: 'Legendary embedded Wi-Fi and Bluetooth protocol analyzer ported for ESP32-S3. Features on-screen menu for the ST7789 display, 802.11 beacon monitoring, probe request sniffing, BLE advertisement scanner, and PCAP stream output over serial.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/justcallmekoko/ESP32Marauder/releases/download/v1.1.0/marauder_esp32s3_k10.bin',
    features: [
      '802.11 Beacon, probe & deauth frame sniffer',
      'Live Wireshark PCAP capture stream via USB-CDC',
      'BLE tracker and air-tag detection',
      'ST7789 color touchscreen & button menu controls'
    ],
    binarySources: [
      {
        name: 'Bootloader',
        address: '0x0000',
        url: 'https://github.com/justcallmekoko/ESP32Marauder/releases/download/v1.1.0/bootloader.bin',
        sizeBytes: 16384,
        description: 'ESP32-S3 secondary bootloader'
      },
      {
        name: 'Partitions',
        address: '0x8000',
        url: 'https://github.com/justcallmekoko/ESP32Marauder/releases/download/v1.1.0/partitions.bin',
        sizeBytes: 3072,
        description: 'Marauder partition table'
      },
      {
        name: 'Marauder Core Binary',
        address: '0x10000',
        url: 'https://github.com/justcallmekoko/ESP32Marauder/releases/download/v1.1.0/marauder_esp32s3_k10.bin',
        sizeBytes: 2621440,
        description: 'Marauder protocol analyzer image'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Marauder Core', address: '0x10000', description: 'Marauder binary' }
    ]
  },
  {
    id: 'k10-bruce-multitool',
    name: 'Bruce Multi-Protocol Embedded Research Suite',
    version: 'v1.7.2',
    category: 'Community',
    isCommunity: true,
    author: 'pr3y & Bruce Devs',
    sourceRepo: 'https://github.com/pr3y/Bruce',
    starsCount: 3400,
    description: 'Open-source modular multi-tool firmware for ESP32-S3 devices. Features native USB-HID BadUSB automation scripts, 2.4GHz RF spectrum sweeps, BLE proximity scanning, and themeable ST7789 user interface.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/pr3y/Bruce/releases/download/v1.7.2/bruce_k10_esp32s3.bin',
    features: [
      'Native USB-HID BadUSB keystroke automation',
      '2.4 GHz RF spectrum & RSSI signal meter',
      'BLE proximity war-walking & advertisement auditor',
      'Interactive ST7789 display with custom theme skins'
    ],
    binarySources: [
      {
        name: 'Bruce Multi-Tool Binary',
        address: '0x0000',
        url: 'https://github.com/pr3y/Bruce/releases/download/v1.7.2/bruce_k10_esp32s3.bin',
        sizeBytes: 3670016,
        description: 'Unified Bruce multi-tool firmware image'
      }
    ],
    slots: [
      { name: 'Bruce Unified Image', address: '0x0000', description: 'Bruce all-in-one image' }
    ]
  },
  {
    id: 'k10-openhasp',
    name: 'openHASP Touchscreen Home Automation Dashboard',
    version: 'v0.7.0',
    category: 'Community',
    isCommunity: true,
    author: 'openHASP Development Team',
    sourceRepo: 'https://github.com/HASwitchPlate/openHASP',
    starsCount: 3100,
    description: 'Dedicated display UI firmware for ST7789 screens. Directly connects to Home Assistant via MQTT to render climate controls, light switches, media sliders, and temperature gauges using light JSONL page templates without compiling C code.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/HASwitchPlate/openHASP/releases/download/v0.7.0/openhasp_esp32s3_k10.bin',
    features: [
      'Home Assistant MQTT discovery integration',
      'Dynamic JSONL page & widget layout engine',
      'ST7789 display & touch calibration',
      'Over-The-Air (OTA) web config manager'
    ],
    binarySources: [
      {
        name: 'openHASP Firmware',
        address: '0x10000',
        url: 'https://github.com/HASwitchPlate/openHASP/releases/download/v0.7.0/openhasp_esp32s3_k10.bin',
        sizeBytes: 2097152,
        description: 'openHASP display controller'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'openHASP Core', address: '0x10000', description: 'openHASP binary' }
    ]
  },
  {
    id: 'k10-ghost-esp',
    name: 'Ghost ESP Wi-Fi & RF Diagnostic Platform',
    version: 'v1.5.0',
    category: 'Community',
    isCommunity: true,
    author: 'GhostESP Team',
    sourceRepo: 'https://github.com/GhostESP/GhostESP',
    starsCount: 1750,
    description: 'Lightweight RF analysis and wireless diagnostic firmware for ESP32-S3. Provides real-time channel occupancy heatmaps, rogue AP detection, deauthentication frame monitors, and web-based terminal control.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/GhostESP/GhostESP/releases/download/v1.5.0/ghost_esp32s3.bin',
    features: [
      'RF channel occupancy & congestion heatmaps',
      'Rogue AP & beacon anomaly detection',
      'Passive 802.11 promiscuous mode packet filter',
      'Captive portal and web management console'
    ],
    binarySources: [
      {
        name: 'Ghost ESP Image',
        address: '0x0000',
        url: 'https://github.com/GhostESP/GhostESP/releases/download/v1.5.0/ghost_esp32s3.bin',
        sizeBytes: 2228224,
        description: 'Ghost ESP combined image'
      }
    ],
    slots: [
      { name: 'Ghost ESP Binary', address: '0x0000', description: 'Ghost ESP unified binary' }
    ]
  },
  {
    id: 'k10-microhydra',
    name: 'MicroHydra Portable App Launcher & OS',
    version: 'v2.1.0',
    category: 'Community',
    isCommunity: true,
    author: 'echo-lalia & MicroHydra Community',
    sourceRepo: 'https://github.com/echo-lalia/MicroHydra',
    starsCount: 1600,
    description: 'Modular app launcher and lightweight operating environment for handheld ESP32 devices. Features a card-based home menu, app store installer, text editor, file manager, and MicroPython plugin runtime.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/echo-lalia/MicroHydra/releases/download/v2.1.0/microhydra_esp32s3_k10.bin',
    features: [
      'Card-based launcher UI with icons on ST7789',
      'Sandboxed MicroPython app runtime',
      'On-device LittleFS file manager',
      'Reconfigurable button navigation'
    ],
    binarySources: [
      {
        name: 'MicroHydra Unified Image',
        address: '0x0000',
        url: 'https://github.com/echo-lalia/MicroHydra/releases/download/v2.1.0/microhydra_esp32s3_k10.bin',
        sizeBytes: 3145728,
        description: 'MicroHydra OS launcher'
      }
    ],
    slots: [
      { name: 'MicroHydra OS', address: '0x0000', description: 'MicroHydra combined image' }
    ]
  },
  {
    id: 'k10-edge-impulse-tinyml',
    name: 'Edge Impulse TinyML Keyword Spotter & Audio Classifier',
    version: 'v1.18.0',
    category: 'Community',
    isCommunity: true,
    author: 'Edge Impulse & Embedded ML Group',
    sourceRepo: 'https://github.com/edgeimpulse/example-esp32-cam',
    starsCount: 2400,
    description: 'Deep neural network inferencing on ESP32-S3 using Xtensa Vector Instructions (ESP-NN). Continuously samples the UNIHIKER K10 onboard microphone and detects acoustic keywords and anomalies with real-time probability meters on screen.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3 (Xtensa DSP / ESP-NN)',
    downloadUrl: 'https://github.com/edgeimpulse/firmware-esp32/releases/download/v1.18.0/edge_impulse_k10_audio.bin',
    features: [
      'Hardware-accelerated ESP-NN vector DSP',
      'Continuous 16kHz microphone DMA sampling',
      'Live inference probability display on LCD',
      'Under 15ms inference latency'
    ],
    binarySources: [
      {
        name: 'TinyML Inference Engine',
        address: '0x10000',
        url: 'https://github.com/edgeimpulse/firmware-esp32/releases/download/v1.18.0/edge_impulse_k10_audio.bin',
        sizeBytes: 2621440,
        description: 'Edge Impulse TinyML model binary'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'TinyML Engine', address: '0x10000', description: 'TinyML classifier' }
    ]
  },
  {
    id: 'k10-esppwn-badusb',
    name: 'ESPPwn USB-OTG Keystroke Automation Suite',
    version: 'v2.0',
    category: 'Community',
    isCommunity: true,
    author: 'ESPPwn OpenDev Community',
    sourceRepo: 'https://github.com/esppwn/esppwn-firmware',
    starsCount: 1250,
    description: 'USB-OTG hardware automation engine running DuckyScript payloads through the native ESP32-S3 USB PHY. Configured via Wi-Fi Web interface or triggered by UNIHIKER K10 physical buttons.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3 (Native USB OTG)',
    downloadUrl: 'https://github.com/esppwn/esppwn-firmware/releases/download/v2.0/esppwn_k10_s3.bin',
    features: [
      'Native DuckyScript 1.0 & 2.0 parsing',
      'Wi-Fi AP live payload uploader',
      'Button A/B one-touch script triggers',
      'Mass storage & serial composite USB device'
    ],
    binarySources: [
      {
        name: 'ESPPwn Core',
        address: '0x10000',
        url: 'https://github.com/esppwn/esppwn-firmware/releases/download/v2.0/esppwn_k10_s3.bin',
        sizeBytes: 1572864,
        description: 'ESPPwn automation firmware'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'ESPPwn Engine', address: '0x10000', description: 'ESPPwn binary' }
    ]
  },
  {
    id: 'k10-rf-spectrum-analyzer',
    name: 'ESP32-S3 2.4GHz RF Spectrum Waterfall Analyzer',
    version: 'v1.2.0',
    category: 'Community',
    isCommunity: true,
    author: 'RF-Hacker Lab & Espressif Community',
    sourceRepo: 'https://github.com/espressif/esp-radar',
    starsCount: 1850,
    description: 'Real-time Fast Fourier Transform (FFT) radio frequency waterfall display. Scans the 2.4 GHz spectrum across 84 channels at 100 sweeps/sec, rendering dynamic color heatmaps of Wi-Fi, Bluetooth, microwave, and drone interference.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/espressif/esp-radar/releases/download/v1.2.0/spectrum_waterfall_k10.bin',
    features: [
      'High-speed 100 sweeps/sec RF sampling',
      'Full-color waterfall spectrogram on ST7789',
      'Peak frequency and RSSI signal meter',
      'Interference source identification'
    ],
    binarySources: [
      {
        name: 'Spectrum Analyzer Binary',
        address: '0x10000',
        url: 'https://github.com/espressif/esp-radar/releases/download/v1.2.0/spectrum_waterfall_k10.bin',
        sizeBytes: 1310720,
        description: 'RF waterfall spectrogram app'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'RF Analyzer Core', address: '0x10000', description: 'RF spectrogram binary' }
    ]
  },
  {
    id: 'k10-peanut-gb',
    name: 'Peanut-GB Game Boy & GBC Hardware Core',
    version: 'v1.4.1',
    category: 'Graphics',
    isCommunity: true,
    author: 'deltabeard & RetroESP Devs',
    sourceRepo: 'https://github.com/deltabeard/Peanut-GB',
    starsCount: 2100,
    description: 'Optimized bare-metal Game Boy / Game Boy Color core running full 60 FPS on the ESP32-S3. Uses DMA display transfer to the ST7789 screen and synthesis for classic 4-channel chiptune audio.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/deltabeard/Peanut-GB/releases/download/v1.4.1/peanut_gb_k10.bin',
    features: [
      'Accurate 60 FPS video timing',
      'Direct DMA SPI ST7789 blitter',
      'Chiptune sound synthesis over buzzer/speaker',
      'Save state support to SPIFFS flash'
    ],
    binarySources: [
      {
        name: 'Peanut-GB Binary',
        address: '0x10000',
        url: 'https://github.com/deltabeard/Peanut-GB/releases/download/v1.4.1/peanut_gb_k10.bin',
        sizeBytes: 1835008,
        description: 'Game Boy emulator core'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Peanut-GB Engine', address: '0x10000', description: 'GB emulator' }
    ]
  },
  {
    id: 'k10-cyberdeck-terminal',
    name: 'K10 CyberDeck Portable Field Terminal & Serial Sniffer',
    version: 'v1.0.4',
    category: 'Community',
    isCommunity: true,
    author: 'CyberDeck Community & RetroTech',
    sourceRepo: 'https://github.com/cyberdeck-esp/k10-terminal',
    starsCount: 970,
    description: 'Turn UNIHIKER K10 into a pocket cyberdeck console. Full VT100 / ANSI terminal with baud rate switcher, RS485/UART monitor, network ping/traceroute tools, and hex dump inspector on the color display.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/cyberdeck-esp/k10-terminal/releases/download/v1.0.4/cyberdeck_k10.bin',
    features: [
      'ANSI / VT100 color terminal engine',
      'Hardware UART & I2C bus traffic snooper',
      'Wi-Fi network diagnostic ping/traceroute',
      'On-screen soft keyboard and button navigation'
    ],
    binarySources: [
      {
        name: 'CyberDeck Binary',
        address: '0x10000',
        url: 'https://github.com/cyberdeck-esp/k10-terminal/releases/download/v1.0.4/cyberdeck_k10.bin',
        sizeBytes: 1572864,
        description: 'CyberDeck terminal firmware'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'CyberDeck Core', address: '0x10000', description: 'CyberDeck terminal' }
    ]
  },
  {
    id: 'k10-nodemcu-lua',
    name: 'NodeMCU Lua 5.1 Embedded Scripting OS',
    version: 'v3.0.1',
    category: 'Runtimes',
    isCommunity: true,
    author: 'NodeMCU Open Source Team',
    sourceRepo: 'https://github.com/nodemcu/nodemcu-firmware',
    starsCount: 7100,
    description: 'Classic event-driven Lua scripting environment tailored for the ESP32-S3. Features non-blocking I/O, built-in MQTT client, file system API, and ST7789 display graphics bindings.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/nodemcu/nodemcu-firmware/releases/download/v3.0.1/nodemcu_esp32s3_k10.bin',
    features: [
      'Event-driven non-blocking Lua engine',
      'Lightweight memory usage under 2MB',
      'ST7789 graphics primitives in Lua',
      'Interactive serial Lua REPL'
    ],
    binarySources: [
      {
        name: 'NodeMCU Binary',
        address: '0x10000',
        url: 'https://github.com/nodemcu/nodemcu-firmware/releases/download/v3.0.1/nodemcu_esp32s3_k10.bin',
        sizeBytes: 1966080,
        description: 'NodeMCU Lua binary'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'NodeMCU Lua', address: '0x10000', description: 'Lua runtime' }
    ]
  },
  {
    id: 'k10-homekit-hap',
    name: 'Native Apple HomeKit Multi-Sensor Firmware',
    version: 'v2.1.0',
    category: 'IoT',
    isCommunity: true,
    author: 'esp-homekit Community',
    sourceRepo: 'https://github.com/maximkulkin/esp-homekit',
    starsCount: 3800,
    description: 'Direct Apple HomeKit Accessory Protocol (HAP) implementation for UNIHIKER K10. Pairs directly with iPhone/iPad Apple Home app without Homebridge or third-party cloud servers. Exposes ambient light, temperature, humidity, and motion.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/maximkulkin/esp-homekit/releases/download/v2.1.0/homekit_k10.bin',
    features: [
      'Zero-cloud local Apple HomeKit pairing',
      'Hardware ChaCha20-Poly1305 encryption',
      'Exposes onboard light & IMU sensors',
      'Apple Home setup QR code on LCD display'
    ],
    binarySources: [
      {
        name: 'HomeKit Firmware',
        address: '0x10000',
        url: 'https://github.com/maximkulkin/esp-homekit/releases/download/v2.1.0/homekit_k10.bin',
        sizeBytes: 2359296,
        description: 'Apple HomeKit sensor firmware'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'HomeKit Core', address: '0x10000', description: 'HomeKit binary' }
    ]
  },
  {
    id: 'k10-zephyr-rtos',
    name: 'Zephyr RTOS Industrial Microkernel',
    version: 'v3.6.0',
    category: 'Runtimes',
    isCommunity: true,
    author: 'Linux Foundation & Zephyr Project',
    sourceRepo: 'https://github.com/zephyrproject-rtos/zephyr',
    starsCount: 9800,
    description: 'Safety-certifiable, highly modular real-time operating system by the Linux Foundation. Features cooperative and preemptive multi-threading, memory protection, modular device tree driver model, and IP stack.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/zephyrproject-rtos/zephyr/releases/download/v3.6.0/zephyr_esp32s3_k10.bin',
    features: [
      'POSIX PSE51 compatibility layer',
      'Deterministic low-latency RTOS kernel',
      'DeviceTree hardware abstraction',
      'IPv4/IPv6 networking & CoAP'
    ],
    binarySources: [
      {
        name: 'Zephyr OS Binary',
        address: '0x10000',
        url: 'https://github.com/zephyrproject-rtos/zephyr/releases/download/v3.6.0/zephyr_esp32s3_k10.bin',
        sizeBytes: 1572864,
        description: 'Zephyr RTOS image'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Zephyr Kernel', address: '0x10000', description: 'Zephyr binary' }
    ]
  },
  {
    id: 'k10-can-obd-logger',
    name: 'CAN Bus & OBD-II Vehicle Telemetry Hub',
    version: 'v2.0.1',
    category: 'Community',
    isCommunity: true,
    author: 'OpenCarDev & ESP-CAN Community',
    sourceRepo: 'https://github.com/espressif/esp-idf/tree/master/examples/peripherals/twai',
    starsCount: 1400,
    description: 'Automotive Two-Wire Automotive Interface (TWAI / CAN 2.0B) sniffer and real-time dashboard. Decodes OBD-II PID metrics (RPM, speed, coolant temp, throttle) and displays gauge clusters on the ST7789 LCD.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3 (TWAI Controller)',
    downloadUrl: 'https://github.com/espressif/esp-idf/releases/download/v5.2.0/twai_can_k10.bin',
    features: [
      'Hardware TWAI (CAN 2.0B) up to 1 Mbps',
      'Live analog gauge needles on LCD',
      'OBD-II standard PID auto-query engine',
      'CSV trip logger to SPIFFS flash'
    ],
    binarySources: [
      {
        name: 'CAN Logger Binary',
        address: '0x10000',
        url: 'https://github.com/espressif/esp-idf/releases/download/v5.2.0/twai_can_k10.bin',
        sizeBytes: 1179648,
        description: 'CAN telemetry firmware'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'CAN Engine', address: '0x10000', description: 'CAN binary' }
    ]
  },
  {
    id: 'k10-chip8-pack',
    name: 'CHIP-8 / Super-CHIP VM & 30-Game Archive',
    version: 'v1.2.0',
    category: 'Graphics',
    isCommunity: true,
    author: 'Chip8-ESP Devs',
    sourceRepo: 'https://github.com/timofurrer/chip8',
    starsCount: 580,
    description: 'Turn the UNIHIKER K10 into a retro indie arcade. Bundles an ultra-smooth CHIP-8 and SCHIP interpreter with 30 legendary public-domain titles (Pong, Space Invaders, Tetris, Pacman) with custom CRT scanline shaders.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/timofurrer/chip8/releases/download/v1.2.0/chip8_k10_bundle.bin',
    features: [
      'Includes 30 built-in vintage games',
      'Simulated phosphor glow & scanline shader',
      'Button A/B responsive gaming controls',
      'Instant game selector carousel'
    ],
    binarySources: [
      {
        name: 'CHIP-8 Bundle',
        address: '0x10000',
        url: 'https://github.com/timofurrer/chip8/releases/download/v1.2.0/chip8_k10_bundle.bin',
        sizeBytes: 819200,
        description: 'CHIP-8 emulator with 30 games'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'CHIP-8 Engine', address: '0x10000', description: 'CHIP-8 binary' }
    ]
  },
  {
    id: 'k10-toit-runtime',
    name: 'Toit High-Performance Cloud-Native Runtime',
    version: 'v2.1.0',
    category: 'Runtimes',
    isCommunity: true,
    author: 'Toitware',
    sourceRepo: 'https://github.com/toitlang/toit',
    starsCount: 2300,
    description: 'Modern, memory-safe, object-oriented language designed specifically for ESP32. Executes byte-code over 30x faster than MicroPython with sandboxed task execution, live OTA app swapping, and ST7789 display libraries.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/toitlang/toit/releases/download/v2.1.0/toit_esp32s3_k10.bin',
    features: [
      '30x speedup compared to standard interpreters',
      'Fault-isolated sandboxed applications',
      'Zero-downtime OTA code updating',
      'Native ST7789 vector rendering'
    ],
    binarySources: [
      {
        name: 'Toit Runtime Image',
        address: '0x0000',
        url: 'https://github.com/toitlang/toit/releases/download/v2.1.0/toit_esp32s3_k10.bin',
        sizeBytes: 2621440,
        description: 'Toit runtime firmware'
      }
    ],
    slots: [
      { name: 'Toit Unified Image', address: '0x0000', description: 'Toit firmware image' }
    ]
  },
  {
    id: 'k10-meshtastic',
    name: 'Meshtastic Off-Grid Mesh Communicator',
    version: 'v2.3.13',
    category: 'Community',
    isCommunity: true,
    author: 'Meshtastic Project',
    sourceRepo: 'https://github.com/meshtastic/firmware',
    starsCount: 11400,
    description: 'Decentralized, off-grid encrypted communication platform for ESP32-S3. Provides secure messaging, device telemetry relay, GPS packet broadcasting, and Bluetooth app pairing.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/meshtastic/firmware/releases/download/v2.3.13/firmware-esp32s3-k10.bin',
    features: [
      'Encrypted mesh radio communication (AES256)',
      'BLE pairing with iOS & Android companion apps',
      'On-screen message viewer on 2.8" LCD',
      'Node status & battery telemetry tracking'
    ],
    binarySources: [
      {
        name: 'Meshtastic Firmware',
        address: '0x0000',
        url: 'https://github.com/meshtastic/firmware/releases/download/v2.3.13/firmware-esp32s3-k10.bin',
        sizeBytes: 3145728,
        description: 'Complete Meshtastic image for ESP32-S3'
      }
    ],
    slots: [
      { name: 'Meshtastic Unified Image', address: '0x0000', description: 'Meshtastic unified binary' }
    ]
  },
  {
    id: 'k10-fluidnc',
    name: 'FluidNC / Grbl_ESP32 CNC Motion Controller',
    version: 'v3.7.16',
    category: 'Community',
    isCommunity: true,
    author: 'Mitch Bradley & Buildlog.Net',
    sourceRepo: 'https://github.com/bdring/FluidNC',
    starsCount: 2200,
    description: 'High-speed motion control firmware for CNC routers, laser engravers, and plotters. Supports multi-axis step generation, web-based G-code streaming, and Wi-Fi file uploads.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/bdring/FluidNC/releases/download/v3.7.16/fluidnc-v3.7.16-esp32s3.bin',
    features: [
      'Multi-axis coordinate motion planning',
      'Web-based G-Code streaming console & DRO',
      'Custom YAML machine hardware configuration',
      'Wi-Fi Station & Access Point wireless interface'
    ],
    binarySources: [
      {
        name: 'FluidNC Binary',
        address: '0x0000',
        url: 'https://github.com/bdring/FluidNC/releases/download/v3.7.16/fluidnc-v3.7.16-esp32s3.bin',
        sizeBytes: 2424832,
        description: 'FluidNC firmware image'
      }
    ],
    slots: [
      { name: 'FluidNC Image', address: '0x0000', description: 'FluidNC motion controller' }
    ]
  },
  {
    id: 'k10-espidf-adf',
    name: 'ESP-ADF HiFi Network Audio Streamer',
    version: 'v2.6',
    category: 'Community',
    isCommunity: true,
    author: 'Espressif ADF Community',
    sourceRepo: 'https://github.com/espressif/esp-adf',
    starsCount: 3900,
    description: 'Hardware audio streaming and synthesis platform. Plays MP3, FLAC, AAC, and Web Radio over Wi-Fi with visual frequency spectrum equalizer on the ST7789 display.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/espressif/esp-adf/releases/download/v2.6/esp_adf_audio_player_s3.bin',
    features: [
      'Lossless FLAC, WAV, and MP3 streaming',
      'Real-time FFT audio visualizer on color screen',
      'Internet radio station preset selector',
      'I2S digital audio output and PWM speaker DAC'
    ],
    binarySources: [
      {
        name: 'ADF Audio Player',
        address: '0x10000',
        url: 'https://github.com/espressif/esp-adf/releases/download/v2.6/esp_adf_audio_player_s3.bin',
        sizeBytes: 2097152,
        description: 'ESP-ADF audio player executable'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Audio Player', address: '0x10000', description: 'ADF audio binary' }
    ]
  },

  // --- Runtimes Category ---
  {
    id: 'k10-circuitpython-9',
    name: 'Adafruit CircuitPython 9.x for ESP32-S3',
    version: 'v9.1.4',
    category: 'Runtimes',
    isCommunity: true,
    author: 'Adafruit Industries',
    sourceRepo: 'https://github.com/adafruit/circuitpython',
    starsCount: 4200,
    description: 'CircuitPython build configured for ESP32-S3 with 16MB Flash / 8MB Octal PSRAM. Mounts as a USB Mass Storage drive (CIRCUITPY) for drag-and-drop code editing.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://downloads.circuitpython.org/bin/espressif_esp32s3_devkitc_1_n8r8/en_US/adafruit-circuitpython-espressif_esp32s3_devkitc_1_n8r8-en_US-9.1.4.bin',
    features: [
      'USB MSC drive mounting (code.py)',
      'displayio support for ST7789 display',
      'Extensive Adafruit library ecosystem',
      'BLE and Wi-Fi AP/station networking'
    ],
    binarySources: [
      {
        name: 'CircuitPython Combined Image',
        address: '0x0000',
        url: 'https://downloads.circuitpython.org/bin/espressif_esp32s3_devkitc_1_n8r8/en_US/adafruit-circuitpython-espressif_esp32s3_devkitc_1_n8r8-en_US-9.1.4.bin',
        sizeBytes: 2457600,
        description: 'Complete CircuitPython firmware image containing bootloader, partitions, and interpreter'
      }
    ],
    slots: [
      { name: 'CircuitPython Unified Binary', address: '0x0000', description: 'CircuitPython combined image' }
    ]
  },
  {
    id: 'k10-tinygo',
    name: 'TinyGo Embedded WebAssembly & Go Runtime',
    version: 'v0.33.0',
    category: 'Runtimes',
    isCommunity: true,
    author: 'TinyGo Compiler Team',
    sourceRepo: 'https://github.com/tinygo-org/tinygo',
    starsCount: 15600,
    description: 'Compiled Go runtime targeting microcontroller architectures. Generates fast, compact binaries with full support for Go channels, goroutines, and TinyDraw graphics.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/tinygo-org/tinygo/releases/download/v0.33.0/tinygo_esp32s3_k10.bin',
    features: [
      'Go concurrency with lightweight goroutines',
      'TinyDraw high-speed vector screen driver',
      'Compiled native code without runtime interpreter',
      'Low memory footprint under 500KB'
    ],
    binarySources: [
      {
        name: 'TinyGo Binary',
        address: '0x10000',
        url: 'https://github.com/tinygo-org/tinygo/releases/download/v0.33.0/tinygo_esp32s3_k10.bin',
        sizeBytes: 524288,
        description: 'TinyGo compiled kernel'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'TinyGo Runtime', address: '0x10000', description: 'Go binary' }
    ]
  },
  {
    id: 'k10-espruino-js',
    name: 'Espruino JavaScript Interpreter for ESP32-S3',
    version: 'v2.22',
    category: 'Runtimes',
    isCommunity: true,
    author: 'Gordon Williams & Espruino',
    sourceRepo: 'https://github.com/espruino/Espruino',
    starsCount: 2800,
    description: 'Bare-metal JavaScript engine running directly on the ESP32-S3 microcontroller. Features interactive Web IDE REPL, event loop, and direct SPI/I2C peripheral bindings.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://www.espruino.com/binaries/espruino_2v22_esp32s3.bin',
    features: [
      'Interactive JavaScript REPL',
      'Event-driven async I/O model',
      'Built-in HTTP client and WebSocket engine',
      'Real-time memory garbage collector'
    ],
    binarySources: [
      {
        name: 'Espruino JS Binary',
        address: '0x10000',
        url: 'https://www.espruino.com/binaries/espruino_2v22_esp32s3.bin',
        sizeBytes: 1835008,
        description: 'Espruino JS firmware image'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Secondary bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Standard partition map' },
      { name: 'Espruino Engine', address: '0x10000', description: 'JavaScript runtime' }
    ]
  },
  {
    id: 'k10-rust-nostd',
    name: 'Rust Embedded no_std Runtime for ESP32-S3',
    version: 'v0.18-nightly',
    category: 'Runtimes',
    isCommunity: true,
    author: 'esp-rs Working Group',
    sourceRepo: 'https://github.com/esp-rs/esp-template',
    starsCount: 1800,
    description: 'Memory-safe, high-performance bare-metal Rust application template for ESP32-S3. Uses esp-hal and embedded-graphics for ultra-fast ST7789 frame rendering.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3 (Xtensa Dual Core)',
    downloadUrl: 'https://github.com/esp-rs/esp-template/releases/download/v0.18.0/esp32s3_rust_demo.bin',
    features: [
      'Zero-cost abstractions with Rust safety',
      'Direct DMA SPI display acceleration',
      'Ultra low power consumption profile',
      'Static memory allocation without OS overhead'
    ],
    binarySources: [
      {
        name: 'Rust App Binary',
        address: '0x10000',
        url: 'https://github.com/esp-rs/esp-template/releases/download/v0.18.0/esp32s3_rust_demo.bin',
        sizeBytes: 819200,
        description: 'Bare-metal Rust firmware executable'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partition table' },
      { name: 'Rust Kernel', address: '0x10000', description: 'Rust binary' }
    ]
  },

  // --- IoT & Smart Home Category ---
  {
    id: 'k10-esphome',
    name: 'ESPHome Smart Sensor Node for UNIHIKER K10',
    version: 'v2024.9.0',
    category: 'IoT',
    isCommunity: true,
    author: 'Nabu Casa & ESPHome Community',
    sourceRepo: 'https://github.com/esphome/esphome',
    starsCount: 8200,
    description: 'Home Assistant-native firmware configuring UNIHIKER K10 as an intelligent climate and presence node. Streams 6-axis motion, light levels, and renders HA dashboard entities on the screen.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/esphome/firmware/releases/download/2024.9.0/esphome_esp32s3_k10.bin',
    features: [
      'Native Home Assistant API auto-discovery',
      'OTA wireless firmware upgrades',
      'Live LCD dashboard displaying room temperature',
      'Button A/B triggers Home Assistant automations'
    ],
    binarySources: [
      {
        name: 'ESPHome Binary',
        address: '0x10000',
        url: 'https://github.com/esphome/firmware/releases/download/2024.9.0/esphome_esp32s3_k10.bin',
        sizeBytes: 1966080,
        description: 'ESPHome firmware image'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'ESPHome App', address: '0x10000', description: 'Home Assistant node app' }
    ]
  },
  {
    id: 'k10-tasmota',
    name: 'Tasmota ESP32-S3 Sensor & Display Hub',
    version: 'v14.2.0',
    category: 'IoT',
    isCommunity: true,
    author: 'Theo Arends & Tasmota Team',
    sourceRepo: 'https://github.com/arendst/Tasmota',
    starsCount: 22100,
    description: 'Comprehensive open-source IoT firmware with responsive web server, MQTT telemetry, timer schedules, and rule-based automation engine.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://ota.tasmota.com/tasmota32/release/tasmota32s3.bin',
    features: [
      'Built-in Web UI with local AP configuration',
      'MQTT & HTTP REST telemetry streaming',
      'Display driver with graphical widgets',
      'Over-The-Air (OTA) web updater'
    ],
    binarySources: [
      {
        name: 'Tasmota32-S3 Image',
        address: '0x0000',
        url: 'https://ota.tasmota.com/tasmota32/release/tasmota32s3.bin',
        sizeBytes: 2097152,
        description: 'Full Tasmota firmware bundle'
      }
    ],
    slots: [
      { name: 'Tasmota Firmware', address: '0x0000', description: 'Tasmota combined image' }
    ]
  },
  {
    id: 'k10-wled',
    name: 'WLED Sound-Reactive & Ambient Display Engine',
    version: 'v0.14.4',
    category: 'IoT',
    isCommunity: true,
    author: 'Aircoookie & WLED Open Dev',
    sourceRepo: 'https://github.com/Aircoookie/WLED',
    starsCount: 16900,
    description: 'Lighting and ambient effects firmware with audio-reactive spectrum visualizers utilizing the UNIHIKER K10 onboard microphone and ST7789 color display.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/Aircoookie/WLED/releases/download/v0.14.4/WLED_0.14.4_ESP32-S3.bin',
    features: [
      'Real-time FFT audio spectrum visualizer',
      'Over 100+ dynamic color animations',
      'E1.31 DMX and Philips Hue integration',
      'Mobile App and Web browser controller'
    ],
    binarySources: [
      {
        name: 'WLED Binary',
        address: '0x10000',
        url: 'https://github.com/Aircoookie/WLED/releases/download/v0.14.4/WLED_0.14.4_ESP32-S3.bin',
        sizeBytes: 1835008,
        description: 'WLED ESP32-S3 image'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'WLED App', address: '0x10000', description: 'WLED core' }
    ]
  },

  // --- Graphics & Multimedia Category ---
  {
    id: 'k10-lvgl-gui',
    name: 'LVGL v9 Touch GUI & Widgets Showcase',
    version: 'v9.1.0',
    category: 'Graphics',
    isCommunity: true,
    author: 'LVGL LLC & Community',
    sourceRepo: 'https://github.com/lvgl/lvgl',
    starsCount: 17200,
    description: 'High-performance Light and Versatile Graphics Library (LVGL) build demonstrating smooth 60 FPS animations, meters, circular dials, sliders, and chart graphs on the 2.8" IPS LCD.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/lvgl/lvgl/releases/download/v9.1.0/lvgl_esp32s3_k10_demo.bin',
    features: [
      'Antialiased vector UI elements and gauges',
      'Double-buffered DMA rendering pipeline',
      'MicroPython & C API bindings',
      'Smartwatch and industrial HMI layout demos'
    ],
    binarySources: [
      {
        name: 'LVGL Demo Binary',
        address: '0x10000',
        url: 'https://github.com/lvgl/lvgl/releases/download/v9.1.0/lvgl_esp32s3_k10_demo.bin',
        sizeBytes: 2359296,
        description: 'LVGL GUI showcase image'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'LVGL App', address: '0x10000', description: 'LVGL firmware' }
    ]
  },

  // --- UNVERIFIED / EXPERIMENTAL COMMUNITY SECTION ---
  {
    id: 'k10-doom-prboom',
    name: 'Doom (1993) PrBoom Engine Port for ESP32-S3',
    version: 'v1.1-experimental',
    category: 'Unverified',
    isUnverified: true,
    author: 'Espressif Systems & Community Hacker',
    sourceRepo: 'https://github.com/espressif/esp32-doom',
    starsCount: 1350,
    description: 'Experimental port of the classic Doom engine running natively on ESP32-S3. Renders 320x240 @ 35 FPS using Octal PSRAM framebuffer with buzzer sound and button controls.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/espressif/esp32-doom/releases/download/v1.1/doom_esp32s3_k10.bin',
    features: [
      'Native Doom shareware WAD gameplay',
      'Hardware double-buffering via Octal SPI PSRAM',
      'Button A: Fire, Button B: Open/Action',
      'PWM sound effects and music synthesizer'
    ],
    binarySources: [
      {
        name: 'Doom Engine & Shareware WAD',
        address: '0x10000',
        url: 'https://github.com/espressif/esp32-doom/releases/download/v1.1/doom_esp32s3_k10.bin',
        sizeBytes: 4194304,
        description: 'Doom engine with shareware game assets'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Large app partition' },
      { name: 'Doom Core', address: '0x10000', description: 'Doom binary' }
    ]
  },
  {
    id: 'k10-retro-emu',
    name: 'ESP32 Retro Console & 8-Bit Emulator Core',
    version: 'v1.4.2-unverified',
    category: 'Unverified',
    isUnverified: true,
    author: 'RetroESP Community',
    sourceRepo: 'https://github.com/espressif/esp32-retro-emu',
    starsCount: 890,
    description: 'Experimental multi-system retro emulator core supporting NES, GameBoy, and Sega Master System ROMs with 60 FPS video and chiptune audio synthesis.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/espressif/esp32-retro-emu/releases/download/v1.4.2/retro_emu_k10.bin',
    features: [
      'Cycle-accurate 60 FPS video emulation',
      'I2S PWM audio DAC synthesizer',
      'Save state support on internal flash',
      'Button A/B mapped to game controller inputs'
    ],
    binarySources: [
      {
        name: 'Emulator Core',
        address: '0x10000',
        url: 'https://github.com/espressif/esp32-retro-emu/releases/download/v1.4.2/retro_emu_k10.bin',
        sizeBytes: 1572864,
        description: 'Retro gaming emulator firmware'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Emulator Engine', address: '0x10000', description: 'Retro emulator binary' }
    ]
  },
  {
    id: 'k10-aprs-beacon',
    name: 'APRS Amateur Radio Beacon & Weather Station',
    version: 'v1.2-beta',
    category: 'Unverified',
    isUnverified: true,
    author: 'HamRadio OpenDev',
    sourceRepo: 'https://github.com/hamradio-esp/aprs-k10',
    starsCount: 410,
    description: 'Experimental Automatic Packet Reporting System telemetry encoder. Samples onboard environmental sensors (light, temperature, motion) and broadcasts AFSK 1200 baud audio packets.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/hamradio-esp/aprs-k10/releases/download/v1.2/aprs_weather_k10.bin',
    features: [
      'Bell 202 AFSK 1200 baud audio packet modulator',
      'Real-time weather telemetry formatting',
      'Live transmission log on ST7789 display',
      'NTP timecode packet stamping'
    ],
    binarySources: [
      {
        name: 'APRS Firmware',
        address: '0x10000',
        url: 'https://github.com/hamradio-esp/aprs-k10/releases/download/v1.2/aprs_weather_k10.bin',
        sizeBytes: 1048576,
        description: 'APRS beacon application'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'APRS App', address: '0x10000', description: 'APRS binary' }
    ]
  },
  {
    id: 'k10-forth-microkernel',
    name: 'Experimental Forth Microkernel & JIT',
    version: 'v0.9.3-alpha',
    category: 'Unverified',
    isUnverified: true,
    author: 'Embedded Hacker Lab',
    sourceRepo: 'https://github.com/forth-esp/micro-forth',
    starsCount: 320,
    description: 'Experimental bare-metal interactive Forth microkernel. Compiles threaded code incrementally directly in RAM with instant dictionary inspection and low-level register access.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/forth-esp/micro-forth/releases/download/v0.9.3/forth_esp32s3.bin',
    features: [
      'Sub-millisecond interactive Forth compiler',
      'Direct hardware memory poke and peek',
      'Ultra-minimal footprint under 128KB',
      'Interactive serial REPL terminal interface'
    ],
    binarySources: [
      {
        name: 'Forth Microkernel',
        address: '0x10000',
        url: 'https://github.com/forth-esp/micro-forth/releases/download/v0.9.3/forth_esp32s3.bin',
        sizeBytes: 262144,
        description: 'Forth OS kernel'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Forth Core', address: '0x10000', description: 'Forth executable' }
    ]
  },

  // --- Additional Community & Specialty Firmwares ---
  {
    id: 'k10-usb-hid-injector',
    name: 'ESP32-S3 Native USB-HID Keystroke & Automation Injector',
    version: 'v2.1.0',
    category: 'Community',
    isCommunity: true,
    author: 'USB-HID OpenDev Community',
    sourceRepo: 'https://github.com/espressif/esp-idf/tree/master/examples/peripherals/usb/device/tusb_hid',
    starsCount: 2950,
    description: 'Hardware USB-OTG composite device running on the native ESP32-S3 USB PHY. Supports programmable macro keystroke playback, mouse automation, and USB gamepad emulation with button triggers.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3 (Native USB OTG)',
    downloadUrl: 'https://github.com/espressif/esp-idf/releases/download/v5.2.0/tusb_hid_k10.bin',
    features: [
      'Native USB 2.0 Full-Speed composite HID device',
      'Programmable automation script interpreter',
      'Button A/B triggers assigned macro sequences',
      'On-screen status indicator on 2.8" ST7789 display'
    ],
    binarySources: [
      {
        name: 'USB-HID Firmware',
        address: '0x10000',
        url: 'https://github.com/espressif/esp-idf/releases/download/v5.2.0/tusb_hid_k10.bin',
        sizeBytes: 1048576,
        description: 'Native USB-HID automation binary'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'USB-HID App', address: '0x10000', description: 'USB-HID core' }
    ]
  },
  {
    id: 'k10-freertos-smp-bench',
    name: 'Dual-Core FreeRTOS SMP Stress Benchmark & Tracer',
    version: 'v10.5.1',
    category: 'Community',
    isCommunity: true,
    author: 'FreeRTOS & Espressif Core',
    sourceRepo: 'https://github.com/espressif/esp-idf',
    starsCount: 13800,
    description: 'Real-time multi-tasking diagnostic benchmark for both Xtensa LX7 240MHz cores. Visualizes CPU load distribution, task context switch latencies, and queue throughput on the color display.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3 (Dual Core LX7)',
    downloadUrl: 'https://github.com/espressif/esp-idf/releases/download/v5.2.0/freertos_smp_k10.bin',
    features: [
      'Dual-core SMP affinity scheduling visualization',
      'Microsecond context-switch latency counter',
      'Real-time CPU0 & CPU1 utilization graphs on LCD',
      'Inter-processor communication (IPC) test suite'
    ],
    binarySources: [
      {
        name: 'FreeRTOS SMP Benchmark',
        address: '0x10000',
        url: 'https://github.com/espressif/esp-idf/releases/download/v5.2.0/freertos_smp_k10.bin',
        sizeBytes: 1572864,
        description: 'SMP benchmark executable'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Benchmark Binary', address: '0x10000', description: 'FreeRTOS benchmark binary' }
    ]
  },
  {
    id: 'k10-openlog-blackbox',
    name: 'OpenLog Blackbox Telemetry & Sensor Logger',
    version: 'v3.2.0',
    category: 'Community',
    isCommunity: true,
    author: 'SparkFun & OpenLog Community',
    sourceRepo: 'https://github.com/sparkfun/OpenLog',
    starsCount: 1650,
    description: 'High-frequency telemetry logging engine sampling the onboard ICM20689 6-axis IMU, ambient light sensor, and microphone at up to 1000Hz into SPIFFS or SD card storage with USB-CDC streaming.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/sparkfun/OpenLog/releases/download/v3.2.0/openlog_k10_blackbox.bin',
    features: [
      'High-speed 1000Hz IMU ring-buffer recording',
      'Automatic CSV and binary telemetry formatting',
      'USB-CDC high-speed data export',
      'Live rolling strip-chart on 240x320 screen'
    ],
    binarySources: [
      {
        name: 'OpenLog Binary',
        address: '0x10000',
        url: 'https://github.com/sparkfun/OpenLog/releases/download/v3.2.0/openlog_k10_blackbox.bin',
        sizeBytes: 1048576,
        description: 'OpenLog telemetry application'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'OpenLog Core', address: '0x10000', description: 'OpenLog binary' }
    ]
  },
  {
    id: 'k10-apache-nuttx',
    name: 'Apache NuttX POSIX-Compliant Real-Time OS',
    version: 'v12.5.0',
    category: 'Runtimes',
    isCommunity: true,
    author: 'Apache Software Foundation',
    sourceRepo: 'https://github.com/apache/nuttx',
    starsCount: 2700,
    description: 'Full-featured UNIX/POSIX-like operating system running on the ESP32-S3. Includes standard NuttShell (NSH), POSIX threads (pthread), BSD sockets, and modular driver interfaces.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/apache/nuttx/releases/download/nuttx-12.5.0/nuttx_esp32s3_k10.bin',
    features: [
      'Interactive NuttShell (NSH) with command line tools (ls, ps, top, cat)',
      'Standard POSIX system calls & C runtime library',
      'TCP/IP networking stack with socket API',
      'FrameBuffer driver binding for ST7789 display'
    ],
    binarySources: [
      {
        name: 'NuttX OS Binary',
        address: '0x10000',
        url: 'https://github.com/apache/nuttx/releases/download/nuttx-12.5.0/nuttx_esp32s3_k10.bin',
        sizeBytes: 2097152,
        description: 'NuttX RTOS image'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'NuttX Kernel', address: '0x10000', description: 'NuttX executable' }
    ]
  },
  {
    id: 'k10-nmea-marine-hub',
    name: 'NMEA 0183/2000 Marine Sensor & Navigation Hub',
    version: 'v2.4.1',
    category: 'IoT',
    isCommunity: true,
    author: 'Sailoog & OpenPlotter Team',
    sourceRepo: 'https://github.com/openplotter/openplotter-settings',
    starsCount: 920,
    description: 'Marine navigation instrument display and sensor multiplexer. Uses onboard 6-axis IMU as an electronic heel/pitch boat inclinometer while broadcasting NMEA 0183 sentences over Wi-Fi UDP.',
    flashSize: '16MB Flash',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/openplotter/openplotter-esp32/releases/download/v2.4.1/marine_k10.bin',
    features: [
      'Heel angle and pitch inclinometer with audio roll warning',
      'NMEA 0183 UDP broadcast over local yacht Wi-Fi',
      'Large high-contrast nautical day/night display mode',
      'Barometric pressure and environmental logging'
    ],
    binarySources: [
      {
        name: 'Marine Hub Binary',
        address: '0x10000',
        url: 'https://github.com/openplotter/openplotter-esp32/releases/download/v2.4.1/marine_k10.bin',
        sizeBytes: 1572864,
        description: 'Marine sensor hub firmware'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'Marine Hub', address: '0x10000', description: 'Marine firmware' }
    ]
  },
  {
    id: 'k10-esp-matter',
    name: 'ESP-Matter Multi-Sensor Smart Home Firmware',
    version: 'v1.2-release',
    category: 'IoT',
    isCommunity: true,
    author: 'Connectivity Standards Alliance (CSA) & Espressif',
    sourceRepo: 'https://github.com/espressif/esp-matter',
    starsCount: 1950,
    description: 'Certified Matter 1.2 protocol node enabling seamless native pairing with Apple Home, Google Home, Amazon Alexa, and Home Assistant without proprietary hubs.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/espressif/esp-matter/releases/download/v1.2.0/matter_sensor_k10.bin',
    features: [
      'Native Matter over Wi-Fi commissioning via BLE',
      'Apple Home & Google Home QR code pairing',
      'Light sensor and temperature cluster endpoints',
      'Multi-admin simultaneous fabric support'
    ],
    binarySources: [
      {
        name: 'Matter Sensor Node',
        address: '0x10000',
        url: 'https://github.com/espressif/esp-matter/releases/download/v1.2.0/matter_sensor_k10.bin',
        sizeBytes: 3145728,
        description: 'Matter protocol firmware'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Matter partition table' },
      { name: 'Matter Core', address: '0x10000', description: 'Matter binary' }
    ]
  },
  {
    id: 'k10-zx-spectrum-128k',
    name: 'Sinclair ZX Spectrum 128K Computer with AY Sound',
    version: 'v2.4',
    category: 'Graphics',
    isCommunity: true,
    author: 'Z80 ESP32 Community',
    sourceRepo: 'https://github.com/dcrespo/ZX-ESPectrum',
    starsCount: 780,
    description: 'Accurate 8-bit home computer emulator recreating the British Sinclair ZX Spectrum 128K (+3). Features full Z80 instruction cycle timing, AY-3-8912 sound synthesis, and virtual onscreen keyboard.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/dcrespo/ZX-ESPectrum/releases/download/v2.4/spectrum128_k10.bin',
    features: [
      'Sinclair 128K BASIC operating environment',
      'AY-3-8912 programmable sound generator (PSG) audio',
      'Tape snapshot loading (.Z80, .SNA) from flash',
      'Button A/B Kempston joystick emulation'
    ],
    binarySources: [
      {
        name: 'ZX Spectrum Emulator',
        address: '0x10000',
        url: 'https://github.com/dcrespo/ZX-ESPectrum/releases/download/v2.4/spectrum128_k10.bin',
        sizeBytes: 1572864,
        description: 'ZX Spectrum 128K emulator binary'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'ZX Engine', address: '0x10000', description: 'Spectrum emulator' }
    ]
  },
  {
    id: 'k10-c64-emulator',
    name: 'Commodore 64 (C64) Computer with SID 6581 Synthesis',
    version: 'v1.8.5',
    category: 'Graphics',
    isCommunity: true,
    author: 'MOS6502 ESP32 Project',
    sourceRepo: 'https://github.com/joshua-marlow/esp32-c64',
    starsCount: 640,
    description: 'Hardware emulation of the legendary Commodore 64 micro-computer. Features MOS 6510 CPU emulation, VIC-II graphics, and real-time SID 6581 sound synthesis rendered over the UNIHIKER K10 speaker.',
    flashSize: '16MB Flash / 8MB PSRAM',
    chipTarget: 'ESP32-S3',
    downloadUrl: 'https://github.com/joshua-marlow/esp32-c64/releases/download/v1.8.5/c64_k10_sid.bin',
    features: [
      'Commodore BASIC V2 operating environment',
      'Cycle-accurate SID 6581 audio synthesis filter emulation',
      'VIC-II 320x200 multicolor bitmap graphics rendering',
      'Built-in PRG / D64 floppy disk image loader'
    ],
    binarySources: [
      {
        name: 'C64 Emulator',
        address: '0x10000',
        url: 'https://github.com/joshua-marlow/esp32-c64/releases/download/v1.8.5/c64_k10_sid.bin',
        sizeBytes: 1835008,
        description: 'Commodore 64 emulator binary'
      }
    ],
    slots: [
      { name: 'Bootloader', address: '0x0000', description: 'Bootloader' },
      { name: 'Partitions', address: '0x8000', description: 'Partitions' },
      { name: 'C64 Engine', address: '0x10000', description: 'C64 emulator' }
    ]
  },

  // --- Utilities Category ---
  {
    id: 'k10-erase-clean',
    name: 'Erase Flash & Factory Reset Utility',
    version: 'v1.0.0',
    category: 'Utility',
    isFactory: false,
    author: 'Espressif Toolchain',
    sourceRepo: 'https://github.com/espressif/esptool',
    starsCount: 6500,
    description: 'Completely wipes the entire 16MB Flash memory, removing corrupted filesystems, NVS keys, and boot loops. Prepares the board for a fresh firmware installation.',
    flashSize: 'Full Chip Erase',
    chipTarget: 'ESP32-S3',
    downloadUrl: '',
    features: [
      'Zeroes all flash sectors',
      'Restores factory NVS calibration state',
      'Resolves bootloader checksum errors',
      'Prepares clean slate for any firmware'
    ],
    binarySources: [],
    slots: [
      {
        name: 'Full Erase Flag',
        address: '0x0000',
        description: 'Signals esptool to trigger chip_erase sequence'
      }
    ]
  }
];
