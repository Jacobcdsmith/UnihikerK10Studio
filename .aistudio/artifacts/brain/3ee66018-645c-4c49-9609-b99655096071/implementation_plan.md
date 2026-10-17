# UNIHIKER K10 Studio: ESP32-S3 Web Flasher, REPL & Asset Pipeline

A comprehensive browser-based engineering environment for the UNIHIKER K10 (ESP32-S3), combining high-speed Web Serial firmware flashing, interactive serial monitor with REPL controls, MicroPython code development with built-in K10 hardware templates, and an image-to-RGB565 graphics pipeline for the onboard 240x320 color display.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core decisions were confirmed during Phase 1 clarification:
> - **Full Suite Scope**: Flasher with bundled firmware presets + MicroPython code editor + RGB565 asset converter.
> - **Interactive Serial Terminal**: Dedicated serial engine supporting baud rate switching (115200 for REPL / 921600 for flashing), DTR/RTS hardware reset triggers, and an inline command bar with MicroPython shortcuts (Ctrl+C break, Ctrl+D soft reboot).
> - **Curated K10 Templates**: Full starter library covering K10 ST7789 display graphics, onboard 6-axis IMU/light/mic sensors, and WiFi IoT telemetry.

- **Dependency Strategy**: `esptool-js` and `xterm` with `@xterm/addon-fit` will be installed for direct browser-to-chip communication via standard Web Serial API.
- **Web Serial Environment Graceful Fallback**: If accessed in an unsupported browser (Firefox/Safari without Web Serial) or non-HTTPS/isolated iframe sandbox without serial permission, the UI will display a diagnostic guidance banner with clear instructions and simulated offline testing mode.

---

## 1. Overview & Core Concept

- **What It Does**: UNIHIKER K10 Studio is an all-in-one web IDE and hardware flasher designed specifically for DFRobot's UNIHIKER K10 (ESP32-S3 dual-core microcontroller with 2.8" color LCD, onboard sensors, and camera). It enables developers, educators, and hobbyists to connect via USB-C, flash factory or custom firmware binaries, send commands through a serial REPL, write and test MicroPython code, and generate optimized RGB565 graphics ready for display.
- **Target Audience**: Hardware engineers, IoT developers, STEM educators, and robotics creators using the ESP32-S3 / UNIHIKER K10 platform.
- **Key Value**: Eliminates python toolchain setup (`esptool.py`, pip, command-line flashing drivers) and third-party image converters, allowing full device initialization, code authoring, and graphics preparation entirely within the web browser.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Board Handshake & Diagnostic Inspection**:
   - User plugs in UNIHIKER K10 via USB-C.
   - User clicks **Connect Board** in the top bar. Browser presents the serial port picker filtered for Espressif (0x303A) and USB-UART bridges (CH340/CP210x).
   - Upon connection, the system detects ESP32-S3 chip revision, MAC address, crystal frequency, and flash memory specs, displaying verified chip status and enabling active workspace tabs.

2. **Firmware Flashing & Factory Restore**:
   - User switches between **Bundled Firmware Presets** (UNIHIKER K10 Official MicroPython OS, Factory Diagnostic Firmware, Blank Erase) or **Custom Binaries** (Bootloader, Partition Table, App Bin).
   - User clicks **Write to UNIHIKER K10**.
   - Real-time progress bar, written byte counter, and high-speed transfer logs stream dynamically in the console.

3. **Interactive Serial Monitor & REPL**:
   - User monitors live standard out from the running ESP32-S3 firmware.
   - User enters single-line commands into the REPL input bar or clicks quick action triggers (`Ctrl+C Interrupt`, `Ctrl+D Soft Reset`, `Hardware DTR/RTS Reset`, `Clear Terminal`).
   - Baud rate switch allows seamless toggling between 115200 bps (MicroPython standard) and custom speeds (9600, 57600, 230400, 921600).

4. **MicroPython Editor & K10 Hardware Templates**:
   - Code workspace with syntax highlighting, line numbers, and file actions (Copy, Download `.py`, Send to REPL).
   - Template library loaded with verified UNIHIKER K10 hardware routines:
     - *Display & UI Demo*: Screen initialization, text drawing, geometric primitives, and framebuf rendering.
     - *Onboard Sensors Demo*: Reading 6-axis gyroscope/accelerometer, ambient light sensor, and user pushbuttons A/B.
     - *WiFi & Cloud Telemetry*: Access point connection, NTP time synchronization, and HTTP JSON telemetry post.
     - *Buzzer & Melody Player*: PWM tone generation for game audio and feedback chimes.

5. **Display Asset Pipeline (PNG to RGB565)**:
   - Drag & drop or upload PNG, JPG, or SVG graphics.
   - Interactive preview configured for UNIHIKER K10 screen dimensions (240x320 portrait or 320x240 landscape).
   - Processing options: Aspect ratio crop/scale, Floyd-Steinberg error diffusion dithering, and Little-Endian / Big-Endian byte swap.
   - Export formats: MicroPython `bytearray` snippet, C/C++ `uint16_t` array for Arduino/ESP-IDF, raw `.bin` download, and ready-to-run MicroPython display loader script.

### Visual Identity & Theme

- **Aesthetic Direction**: Developer console with utilitarian precision. Dark slate architecture matching professional embedded toolchains (Espressif IDF, PlatformIO, VS Code).
- **Color Palette**:
  - Dominant Canvas (60%): `#090D16` (Deep Obsidian / Midnight Slate)
  - Structural Surfaces (30%): `#111827` (Card panels), `#1F2937` (Subtle borders and dividers)
  - Accent Budget (10%): `#4F46E5` / `#6366F1` (Indigo primary focus), `#059669` / `#10B981` (Emerald flash success and connected indicators), `#F59E0B` (Amber warnings/reset state)
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` or `Outfit` for clean, modern structure.
  - Body & Microcopy: `DM Sans` / `Plus Jakarta Sans` at 13px–14px.
  - Code & Telemetry: `JetBrains Mono` / `ui-monospace` with `tabular-nums` for addresses, offsets, hex memory, and serial logs.
- **Top Bar Contract**:
  - Single-line wordmark: `UNIHIKER K10 Studio`
  - Single-line view tabs: `Flasher`, `Serial REPL`, `Code Editor`, `Asset Pipeline`
  - Action zone: Serial Connection button (`Connect Board` / `Disconnect`) with real-time port/chip indicator.

---

## 3. Key Product Decisions & Trade-Offs

- **Browser-Side Web Serial & esptool-js**:
  - *Chosen Approach*: Execute chip detection, ROM bootloader handshaking (SLIP framing, MD5 hashing, flashing) 100% in the client browser using Web Serial.
  - *Why*: Eliminates server proxy latency, allows offline-first flashing without uploading firmware binaries to an external cloud server, and directly accesses physical USB ports.
  - *Trade-off*: Requires Chromium-based browser (Chrome, Edge, Opera, Brave). We provide clear diagnostics and simulated fallback for preview sandboxes.

- **Monaco-Like Lightweight Code Editor vs. External Dependencies**:
  - *Chosen Approach*: Build a modular, high-performance editor with Python syntax highlighting, line numbering, snippet insertion, and auto-indent.
  - *Why*: Provides instant load times, zero bundle bloat, responsive layout, and flawless mobile/tablet viewability.

- **RGB565 Canvas Processing in Client Browser**:
  - *Chosen Approach*: Use HTML5 Canvas 2D ImageData buffer parsing to convert 32-bit RGBA pixels into 16-bit RGB565 (`(R & 0xF8) << 8 | (G & 0xFC) << 3 | (B >> 3)`) with optional Little-Endian byte-swapping for ST7789 display controllers.
  - *Why*: Instantaneous client-side conversion without server round-trips, supporting immediate live preview and downloadable byte files.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│  [Wordmark] ── [Flasher | Serial REPL | Editor | Asset Pipeline] ── [Connect Board] │
└────────────────────────────────────────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────────┐               ┌────────────────────┐
│         Active Studio View        │               │   Serial Manager   │
│                                   │               │  (Web Serial API)  │
│ ┌───────────────────────────────┐ │               └──────────┬─────────┘
│ │ 1. Flasher View               │ │                          │
│ │  - Bundled Firmwares Preset   │ │                          │
│ │  - Custom Binary Slots        │ │                          ▼
│ │  - Write Progress & MD5 Check │ │               ┌────────────────────┐
│ ├───────────────────────────────┤ │               │  ESP32-S3 Bridge   │
│ │ 2. Serial & REPL Console      │ │◄──────────────┤  - esptool-js      │
│ │  - xterm.js Display           │ │               │  - SLIP Transport  │
│ │  - Command Input + Shortcuts  │ │               │  - DTR/RTS Pins    │
│ │  - Baud Selector (115.2k-921k)│ │               └────────────────────┘
│ ├───────────────────────────────┤ │
│ │ 3. MicroPython Code Editor    │ │
│ │  - Hardware Templates (4 K10) │ │
│ │  - Line Numbers & Syntax      │ │
│ │  - Send to REPL / Download    │ │
│ ├───────────────────────────────┤ │
│ │ 4. RGB565 Asset Pipeline      │ │
│ │  - Drag & Drop Image Ingest   │ │
│ │  - 240x320 / 320x240 Resizer  │ │
│ │  - Dither & Endianness Engine │ │
│ │  - C & MicroPython Exporter   │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

### Data Model & State

- **`DeviceConnectionState`**:
  - `status`: `'disconnected' | 'connecting' | 'connected' | 'flashing' | 'error'`
  - `port`: `SerialPort | null`
  - `chip`: `string | null` (e.g. `'ESP32-S3 (QFN56) revision v0.2'`)
  - `mac`: `string | null`
  - `baudRate`: `number` (default `115200` for monitor, `921600` for flashing)

- **`FirmwareSlot`**:
  - `name`: `string` ('Bootloader', 'Partitions', 'App')
  - `address`: `string` ('0x0000', '0x8000', '0x10000')
  - `file`: `File | null`
  - `data`: `Uint8Array | string | null`
  - `size`: `number`

- **`FirmwarePreset`**:
  - `id`: `string` ('k10-micropython-v1.23' | 'k10-factory-test' | 'erase-all')
  - `title`: `string`
  - `description`: `string`
  - `slots`: `FirmwareSlot[]`

- **`ImageConverterState`**:
  - `sourceImage`: `string | null`
  - `targetWidth`: `number` (default `240`)
  - `targetHeight`: `number` (default `320`)
  - `dither`: `boolean`
  - `swapBytes`: `boolean` (ST7789 big-endian byte-order)
  - `outputFormat`: `'c_array' | 'py_bytes' | 'raw_bin'`
  - `convertedBytes`: `Uint8Array | null`

### Key Interactive Components

1. **`FlasherPanel`**:
   - Tabbed toggle between Preset Bundles and Custom Memory Partitions.
   - Hex address editing with auto-validation (`0x...`).
   - High-speed flashing execution with staged write percentages and verification.

2. **`TerminalPanel`**:
   - Embedded `xterm.js` terminal container with auto-fitting resize observer.
   - Top controls: Baud rate selector dropdown, clear button, copy logs button, DTR/RTS hardware reset trigger buttons.
   - Bottom REPL bar: Input text field with command history (Up/Down arrow memory) and MicroPython control keystroke buttons (`Ctrl+C`, `Ctrl+D`, `Ctrl+B`).

3. **`CodeEditorPanel`**:
   - Template browser selector with categorized UNIHIKER K10 samples.
   - Code viewer/editor with line numbering, file name tab, and action buttons (`Send to Board`, `Copy Code`, `Save .py`).

4. **`AssetPipelinePanel`**:
   - Image upload dropzone with immediate canvas preview.
   - Screen orientation switch (Portrait 240x320 vs Landscape 320x240).
   - Real-time side-by-side comparison: Original image vs 16-bit RGB565 simulated LCD output.
   - Code preview pane with instant copy and binary download.

---

## 5. Verification Plan

1. **Compilation & Linting**:
   - Run `install_applet_package` for `esptool-js`, `xterm`, `@xterm/addon-fit`.
   - Run `compile_applet` to ensure TypeScript types, Vite bundling, and styles compile with 0 errors.
2. **Web Serial Hardware Handshake**:
   - Verify connection triggers with standard filters (`0x303a`, `0x1a86`, `0x10c4`).
   - Verify non-Chromium / sandbox fallback states show helpful instructions.
3. **Firmware Flashing Engine**:
   - Verify custom file loading and binary parsing.
   - Verify address parsing (hex to int conversion).
   - Verify bundled presets load valid partition descriptors.
4. **Terminal & REPL**:
   - Verify `xterm.js` canvas rendering, resize handler, and clear functionality.
   - Verify REPL input handling and control characters (`\x03` for Ctrl+C, `\x04` for Ctrl+D).
5. **Asset Converter**:
   - Upload sample test image and verify RGB565 color quantization math.
   - Verify generated C array and MicroPython byte strings match expected byte length ($240 \times 320 \times 2 = 153,600\text{ bytes}$).
