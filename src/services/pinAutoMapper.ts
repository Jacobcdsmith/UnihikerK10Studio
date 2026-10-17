export interface PinConfig {
  tftMosi: number;
  tftSclk: number;
  tftCs: number;
  tftDc: number;
  tftRst: number;
  tftBacklight: number;
  i2cScl: number;
  i2cSda: number;
  lightAdc: number;
  buzzerPwm: number;
  buttonA: number;
  buttonB: number;
  cameraEnabled?: boolean;
}

export const DEFAULT_K10_PINS: PinConfig = {
  tftMosi: 11,
  tftSclk: 12,
  tftCs: 10,
  tftDc: 13,
  tftRst: 9,
  tftBacklight: 14,
  i2cScl: 40,
  i2cSda: 41,
  lightAdc: 4,
  buzzerPwm: 15,
  buttonA: 0,
  buttonB: 35,
};

export type TargetFramework = 'micropython' | 'arduino' | 'espidf' | 'circuitpython' | 'tft_espi';

export interface SourceDeviceProfile {
  id: string;
  name: string;
  category: 'security' | 'development' | 'm5stack' | 'generic';
  description: string;
  originalPins: Partial<PinConfig>;
  notes: string;
  adaptationGuidance: string;
}

export const SOURCE_DEVICE_PROFILES: SourceDeviceProfile[] = [
  {
    id: 'k10-native',
    name: 'UNIHIKER K10 Native Pin Architecture',
    category: 'development',
    description: 'Reference hardware configuration for UNIHIKER K10 ESP32-S3 with 2.8" ST7789 IPS LCD & onboard sensors.',
    originalPins: DEFAULT_K10_PINS,
    notes: 'Direct 1:1 mapping with no translation needed. Optimal 40MHz SPI bus frequency and fast I2C sensors at 400kHz.',
    adaptationGuidance: 'Use directly in custom MicroPython or Arduino sketches without external wiring.'
  },
  {
    id: 'esp32-marauder',
    name: 'ESP32 Marauder Wi-Fi / BLE Pen-Test Firmware',
    category: 'security',
    description: 'Community wireless penetration testing suite originally written for generic ESP32 and ILI9341/ST7789 modules.',
    originalPins: {
      tftMosi: 23,
      tftSclk: 18,
      tftCs: 5,
      tftDc: 19,
      tftRst: 4,
      tftBacklight: 32,
      buttonA: 0,
      buttonB: 34,
      buzzerPwm: 25,
      i2cScl: 22,
      i2cSda: 21,
    },
    notes: 'Marauder default SPI pins (23, 18, 5, 19) auto-mapped to K10 FSPI bus (11, 12, 10, 13). Navigation adapted for Buttons A & B.',
    adaptationGuidance: 'Compile with generated User_Setup.h or flash pre-adapted k10-esp32-marauder binary from Firmware Explorer.'
  },
  {
    id: 'bruce-multitool',
    name: 'Bruce Multi-Tool Offensive Security Suite',
    category: 'security',
    description: 'Popular multi-tool firmware for RF auditing, IR, BadUSB, and wireless research.',
    originalPins: {
      tftMosi: 13,
      tftSclk: 14,
      tftCs: 15,
      tftDc: 27,
      tftRst: 33,
      tftBacklight: 32,
      buttonA: 36,
      buttonB: 39,
      buzzerPwm: 2,
      i2cScl: 22,
      i2cSda: 21,
    },
    notes: 'Screen pins mapped to K10 ST7789. BadUSB scripts leverage native ESP32-S3 USB OTG (GPIO 19/20).',
    adaptationGuidance: 'Remap navigation buttons to K10 GPIO 0 (Key A) and GPIO 35 (Key B).'
  },
  {
    id: 'm5stack-core2',
    name: 'M5Stack Core2 / CoreS3 Source Projects',
    category: 'm5stack',
    description: 'Projects built for M5Stack Core2 / CoreS3 with ILI9342/ST7789 displays and AXP power management.',
    originalPins: {
      tftMosi: 23,
      tftSclk: 18,
      tftCs: 5,
      tftDc: 15,
      tftRst: -1,
      tftBacklight: -1, // Controlled via AXP192
      i2cScl: 22,
      i2cSda: 21,
      buttonA: 38,
      buttonB: 37,
      buzzerPwm: 2,
    },
    notes: 'UNIHIKER K10 uses direct GPIO 14 PWM for backlight control instead of AXP PMIC. I2C mapped from 21/22 to 40/41.',
    adaptationGuidance: 'Remove AXP192/AXP2101 power library dependencies and replace with K10 direct pin initialization.'
  },
  {
    id: 'lilygo-tdisplay-s3',
    name: 'LilyGO T-Display S3 Source Projects',
    category: 'development',
    description: 'Firmware designed for LilyGO T-Display S3 (ST7789 170x320 / 240x320 parallel/SPI).',
    originalPins: {
      tftMosi: 11,
      tftSclk: 12,
      tftCs: 10,
      tftDc: 11,
      tftRst: 1,
      tftBacklight: 38,
      buttonA: 0,
      buttonB: 14,
      buzzerPwm: -1,
      i2cScl: 44,
      i2cSda: 43,
    },
    notes: 'K10 shares the same SPI MOSI/SCLK/CS lines (GPIO 11, 12, 10). Backlight remaps from GPIO 38 to GPIO 14.',
    adaptationGuidance: 'Update backlight pin to GPIO 14 and secondary button from GPIO 14 to GPIO 35.'
  },
  {
    id: 'cardputer',
    name: 'M5Cardputer Portable Terminal & Tools',
    category: 'm5stack',
    description: 'Compact cyberdeck applications built for M5Cardputer with ST7789 display and matrix keyboard.',
    originalPins: {
      tftMosi: 35,
      tftSclk: 36,
      tftCs: 37,
      tftDc: 34,
      tftRst: 33,
      tftBacklight: 38,
      buttonA: 0,
      buttonB: -1,
      buzzerPwm: 2,
      i2cScl: 2,
      i2cSda: 1,
    },
    notes: 'K10 displays full 240x320 resolution (Cardputer is 135x240). Onboard ICM20689 and AHT20 provide motion/temp sensors.',
    adaptationGuidance: 'Scale display buffer from 135x240 to 240x320 and remap buzzer from GPIO 2 to GPIO 15.'
  },
  {
    id: 'generic-esp32-wroom',
    name: 'Generic ESP32 / WROOM-32 VSPI Code',
    category: 'generic',
    description: 'Standard Arduino / ESP-IDF sketches utilizing the default VSPI bus on original ESP32 chips.',
    originalPins: {
      tftMosi: 23,
      tftSclk: 18,
      tftCs: 5,
      tftDc: 2,
      tftRst: 4,
      tftBacklight: 15,
      i2cScl: 22,
      i2cSda: 21,
      buttonA: 0,
      buttonB: 35,
      buzzerPwm: 25,
      lightAdc: 36,
    },
    notes: 'ESP32 classic uses VSPI pins (23/18/5). ESP32-S3 uses FSPI / SPI2 (11/12/10) with hardware DMA.',
    adaptationGuidance: 'Substitute classic VSPI definitions with K10 SPI2 definitions. Set SPI frequency to 40MHz or 80MHz.'
  }
];

export interface PinReplacementDetail {
  from: string;
  to: string;
  purpose: string;
}

export class PinAutoMapperService {
  /**
   * Generates dynamic pin-mapping boilerplate for target framework
   */
  generateMapping(framework: TargetFramework, config: PinConfig = DEFAULT_K10_PINS): { code: string; filename: string } {
    switch (framework) {
      case 'micropython':
        return {
          filename: 'k10_pins.py',
          code: `# ==============================================================================
# UNIHIKER K10 (ESP32-S3) Auto-Mapped Hardware Pin Definitions
# Generated by UNIHIKER K10 Studio Auto-Mapper
# Target: 2.8" ST7789 IPS LCD (240x320) + Onboard Sensors & Peripherals
# ==============================================================================

from machine import Pin, SPI, I2C, PWM, ADC

# --- ST7789 Color Display SPI Bus ---
PIN_LCD_MOSI = ${config.tftMosi}
PIN_LCD_SCLK = ${config.tftSclk}
PIN_LCD_CS   = ${config.tftCs}
PIN_LCD_DC   = ${config.tftDc}
PIN_LCD_RST  = ${config.tftRst}
PIN_LCD_BL   = ${config.tftBacklight} # PWM Backlight

# --- Onboard Sensors (I2C Bus 0) ---
PIN_I2C_SCL  = ${config.i2cScl}
PIN_I2C_SDA  = ${config.i2cSda}
I2C_ADDR_IMU = 0x68  # ICM20689 6-Axis Accelerometer / Gyroscope
I2C_ADDR_ENV = 0x38  # AHT20 Temperature & Humidity Sensor

# --- Analog Inputs & Audio ---
PIN_LIGHT_ADC = ${config.lightAdc}  # Ambient Light Sensor (ADC1_CH3)
PIN_BUZZER    = ${config.buzzerPwm} # Piezo Speaker PWM

# --- User Pushbuttons (Active Low with Pull-Up) ---
PIN_BTN_A    = ${config.buttonA}   # BOOT / Key A
PIN_BTN_B    = ${config.buttonB}  # User Key B

def init_k10_peripherals():
    """Helper routine to initialize K10 hardware buses with detected pins"""
    print("[K10] Initializing hardware peripherals...")
    
    # Backlight PWM @ 1kHz
    bl = PWM(Pin(PIN_LCD_BL), freq=1000)
    bl.duty_u16(65535) # 100% brightness
    
    # SPI Display Bus (40 MHz)
    display_spi = SPI(
        2,
        baudrate=40000000,
        polarity=1,
        phase=1,
        sck=Pin(PIN_LCD_SCLK),
        mosi=Pin(PIN_LCD_MOSI)
    )
    
    # Sensor I2C Bus (400 kHz)
    sensor_i2c = I2C(
        0,
        scl=Pin(PIN_I2C_SCL),
        sda=Pin(PIN_I2C_SDA),
        freq=400000
    )
    
    # Pushbuttons with internal pull-up
    btn_a = Pin(PIN_BTN_A, Pin.IN, Pin.PULL_UP)
    btn_b = Pin(PIN_BTN_B, Pin.IN, Pin.PULL_UP)
    
    # Light Sensor ADC
    light = ADC(Pin(PIN_LIGHT_ADC))
    light.atten(ADC.ATTN_11DB)
    
    print("[K10] Peripherals initialized successfully.")
    return {
        "display_spi": display_spi,
        "sensor_i2c": sensor_i2c,
        "backlight": bl,
        "btn_a": btn_a,
        "btn_b": btn_b,
        "light_adc": light,
    }

# To use in your code:
# import k10_pins
# hw = k10_pins.init_k10_peripherals()
`,
        };

      case 'arduino':
        return {
          filename: 'k10_pins.h',
          code: `/**
 * UNIHIKER K10 (ESP32-S3) Auto-Mapped Hardware Definitions
 * Generated by UNIHIKER K10 Studio Auto-Mapper
 * Compatible with Arduino ESP32 core, TFT_eSPI, and Arduino_GFX
 */

#pragma once
#include <Arduino.h>

// =============================================================================
// ST7789 2.8" IPS Display (240x320)
// =============================================================================
#define K10_TFT_MOSI      ${config.tftMosi}
#define K10_TFT_SCLK      ${config.tftSclk}
#define K10_TFT_CS        ${config.tftCs}
#define K10_TFT_DC        ${config.tftDc}
#define K10_TFT_RST       ${config.tftRst}
#define K10_TFT_BL        ${config.tftBacklight}
#define K10_TFT_WIDTH     240
#define K10_TFT_HEIGHT    320

// =============================================================================
// Onboard I2C Sensors (ICM20689 6-Axis IMU & AHT20)
// =============================================================================
#define K10_I2C_SCL       ${config.i2cScl}
#define K10_I2C_SDA       ${config.i2cSda}
#define K10_I2C_FREQ      400000U
#define K10_IMU_I2C_ADDR  0x68
#define K10_AHT_I2C_ADDR  0x38

// =============================================================================
// Analog & Audio Signals
// =============================================================================
#define K10_LIGHT_SENSOR  ${config.lightAdc}
#define K10_BUZZER_PIN    ${config.buzzerPwm}

// =============================================================================
// Pushbuttons (Active LOW)
// =============================================================================
#define K10_BTN_A         ${config.buttonA}
#define K10_BTN_B         ${config.buttonB}

inline void initK10Pins() {
  pinMode(K10_TFT_BL, OUTPUT);
  digitalWrite(K10_TFT_BL, HIGH); // Backlight ON

  pinMode(K10_BTN_A, INPUT_PULLUP);
  pinMode(K10_BTN_B, INPUT_PULLUP);

  pinMode(K10_BUZZER_PIN, OUTPUT);
  digitalWrite(K10_BUZZER_PIN, LOW);
}
`,
        };

      case 'tft_espi':
        return {
          filename: 'User_Setup.h',
          code: `/**
 * TFT_eSPI User_Setup.h configuration for UNIHIKER K10 (ESP32-S3)
 * Generated by UNIHIKER K10 Studio Auto-Mapper
 * Used for building ESP32 Marauder, Bruce, Nemesis, and Arduino graphics tools.
 */

#define USER_SETUP_LOADED 1

// Define ST7789 display controller
#define ST7789_DRIVER
#define TFT_WIDTH  240
#define TFT_HEIGHT 320

// Hardware SPI pins for UNIHIKER K10
#define TFT_MOSI ${config.tftMosi}
#define TFT_SCLK ${config.tftSclk}
#define TFT_CS   ${config.tftCs}
#define TFT_DC   ${config.tftDc}
#define TFT_RST  ${config.tftRst}
#define TFT_BL   ${config.tftBacklight}
#define TFT_BACKLIGHT_ON HIGH

// Fonts to load
#define LOAD_GLCD
#define LOAD_FONT2
#define LOAD_FONT4
#define LOAD_FONT6
#define LOAD_FONT7
#define LOAD_FONT8
#define LOAD_GFXFF
#define SMOOTH_FONT

// SPI Bus Frequency (ST7789 handles 40-80 MHz on ESP32-S3)
#define SPI_FREQUENCY  40000000
#define SPI_READ_FREQUENCY 20000000
`,
        };

      case 'espidf':
        return {
          filename: 'k10_board.h',
          code: `/**
 * UNIHIKER K10 (ESP32-S3) Board Support Definitions
 * Generated by UNIHIKER K10 Studio Auto-Mapper
 * Target: ESP-IDF v5.x / FreeRTOS
 */

#pragma once

#include "driver/gpio.h"
#include "driver/spi_master.h"
#include "driver/i2c.h"

// ST7789 SPI LCD Display Lines
#define LCD_HOST               SPI2_HOST
#define PIN_NUM_LCD_MOSI       GPIO_NUM_${config.tftMosi}
#define PIN_NUM_LCD_CLK        GPIO_NUM_${config.tftSclk}
#define PIN_NUM_LCD_CS         GPIO_NUM_${config.tftCs}
#define PIN_NUM_LCD_DC         GPIO_NUM_${config.tftDc}
#define PIN_NUM_LCD_RST        GPIO_NUM_${config.tftRst}
#define PIN_NUM_LCD_BCKL       GPIO_NUM_${config.tftBacklight}

#define LCD_PIXEL_CLOCK_HZ     (40 * 1000 * 1000)
#define LCD_H_RES              240
#define LCD_V_RES              320

// I2C Sensor Bus
#define I2C_MASTER_NUM         I2C_NUM_0
#define I2C_MASTER_SCL_IO      GPIO_NUM_${config.i2cScl}
#define I2C_MASTER_SDA_IO      GPIO_NUM_${config.i2cSda}
#define I2C_MASTER_FREQ_HZ     400000

// Onboard User Controls
#define GPIO_BUTTON_A          GPIO_NUM_${config.buttonA}
#define GPIO_BUTTON_B          GPIO_NUM_${config.buttonB}
#define GPIO_BUZZER            GPIO_NUM_${config.buzzerPwm}
#define ADC_LIGHT_CHANNEL      ADC_CHANNEL_3 // GPIO ${config.lightAdc}
`,
        };

      case 'circuitpython':
        return {
          filename: 'board_k10.py',
          code: `# UNIHIKER K10 CircuitPython Pin Definitions
# Generated by UNIHIKER K10 Studio Auto-Mapper

import board
import busio
import digitalio

# Display SPI Bus
LCD_MOSI = board.IO${config.tftMosi}
LCD_CLK  = board.IO${config.tftSclk}
LCD_CS   = board.IO${config.tftCs}
LCD_DC   = board.IO${config.tftDc}
LCD_RST  = board.IO${config.tftRst}
LCD_BL   = board.IO${config.tftBacklight}

# I2C Sensor Bus
I2C_SCL  = board.IO${config.i2cScl}
I2C_SDA  = board.IO${config.i2cSda}

# Peripherals
LIGHT_ADC = board.IO${config.lightAdc}
BUZZER    = board.IO${config.buzzerPwm}
BUTTON_A  = board.IO${config.buttonA}
BUTTON_B  = board.IO${config.buttonB}

def get_i2c():
    return busio.I2C(I2C_SCL, I2C_SDA, frequency=400000)
`,
        };
    }
  }

  /**
   * Cross-Board Code Adapter:
   * Inspects source code and replaces legacy pin numbers with UNIHIKER K10 target pins
   */
  adaptSourceCode(
    sourceCode: string,
    sourceProfileId: string = 'generic-esp32-wroom'
  ): {
    adaptedCode: string;
    replacements: PinReplacementDetail[];
  } {
    const profile = SOURCE_DEVICE_PROFILES.find((p) => p.id === sourceProfileId) || SOURCE_DEVICE_PROFILES[0];
    const original = profile.originalPins;
    const replacements: PinReplacementDetail[] = [];
    let code = sourceCode;

    const mapItem = (fromPin: number | undefined, toPin: number, name: string) => {
      if (fromPin === undefined || fromPin === toPin || fromPin < 0) return;

      const regexDef = new RegExp(`(#define\\s+\\w*${name}\\w*\\s+)(${fromPin})\\b`, 'gi');
      if (regexDef.test(code)) {
        code = code.replace(regexDef, `$1${toPin} /* Auto-Mapped for K10 */`);
        replacements.push({ from: `Pin ${fromPin}`, to: `GPIO ${toPin}`, purpose: name });
      }

      // MicroPython style: Pin(23)
      const regexPy = new RegExp(`(Pin\\()\\s*${fromPin}\\s*(\\))`, 'g');
      if (regexPy.test(code)) {
        code = code.replace(regexPy, `$1${toPin}$2`);
        replacements.push({ from: `Pin(${fromPin})`, to: `Pin(${toPin})`, purpose: name });
      }

      // Arduino pinMode(23, ...)
      const regexArd = new RegExp(`(pinMode\\(\\s*)${fromPin}(\\s*,)`, 'g');
      if (regexArd.test(code)) {
        code = code.replace(regexArd, `$1${toPin}$2`);
      }
    };

    mapItem(original.tftMosi, DEFAULT_K10_PINS.tftMosi, 'MOSI');
    mapItem(original.tftSclk, DEFAULT_K10_PINS.tftSclk, 'SCLK');
    mapItem(original.tftCs, DEFAULT_K10_PINS.tftCs, 'CS');
    mapItem(original.tftDc, DEFAULT_K10_PINS.tftDc, 'DC');
    mapItem(original.tftRst, DEFAULT_K10_PINS.tftRst, 'RST');
    mapItem(original.tftBacklight, DEFAULT_K10_PINS.tftBacklight, 'BL');
    mapItem(original.i2cScl, DEFAULT_K10_PINS.i2cScl, 'SCL');
    mapItem(original.i2cSda, DEFAULT_K10_PINS.i2cSda, 'SDA');
    mapItem(original.buttonA, DEFAULT_K10_PINS.buttonA, 'BTN_A');
    mapItem(original.buttonB, DEFAULT_K10_PINS.buttonB, 'BTN_B');
    mapItem(original.buzzerPwm, DEFAULT_K10_PINS.buzzerPwm, 'BUZZER');

    // Prepend K10 Auto-Mapper Header
    const banner = `/*\n * [UNIHIKER K10 AUTO-MAPPED CODE]\n * Adapted from: ${profile.name}\n * Target: ESP32-S3, 2.8" ST7789 IPS LCD (240x320)\n */\n\n`;
    if (!code.includes('[UNIHIKER K10 AUTO-MAPPED CODE]')) {
      code = banner + code;
    }

    return {
      adaptedCode: code,
      replacements,
    };
  }
}

export const pinAutoMapper = new PinAutoMapperService();
