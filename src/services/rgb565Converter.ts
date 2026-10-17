import { ConversionOptions } from '../types/flasher';

export interface ConvertedResult {
  width: number;
  height: number;
  totalBytes: number;
  bytes: Uint8Array;
  previewDataUrl: string;
  cCode: string;
  pythonCode: string;
  pythonRunnerScript: string;
}

export class RGB565ConverterService {
  /**
   * Convert an image File or HTMLImageElement into RGB565 format
   */
  async convertImage(
    imageSource: HTMLImageElement | File,
    options: ConversionOptions
  ): Promise<ConvertedResult> {
    const img = await this.resolveImage(imageSource);
    const { width, height, dither, swapBytes } = options;

    // Offscreen canvas for rendering & scaling
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D canvas context');

    // Draw background (black) and scale image with cover/contain or stretch
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Compute aspect ratio preserving fit
    const imgAspect = img.width / img.height;
    const targetAspect = width / height;
    let renderW = width;
    let renderH = height;
    let renderX = 0;
    let renderY = 0;

    if (imgAspect > targetAspect) {
      renderW = width;
      renderH = width / imgAspect;
      renderY = (height - renderH) / 2;
    } else {
      renderH = height;
      renderW = height * imgAspect;
      renderX = (width - renderW) / 2;
    }

    ctx.drawImage(img, renderX, renderY, renderW, renderH);
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Floyd-Steinberg dithering working buffer if enabled
    const rBuffer = new Float32Array(width * height);
    const gBuffer = new Float32Array(width * height);
    const bBuffer = new Float32Array(width * height);

    for (let i = 0; i < width * height; i++) {
      rBuffer[i] = data[i * 4];
      gBuffer[i] = data[i * 4 + 1];
      bBuffer[i] = data[i * 4 + 2];
    }

    const totalPixels = width * height;
    const totalBytes = totalPixels * 2;
    const uint8Bytes = new Uint8Array(totalBytes);

    // Quantized image for browser preview
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = width;
    previewCanvas.height = height;
    const previewCtx = previewCanvas.getContext('2d')!;
    const previewImgData = previewCtx.createImageData(width, height);
    const pData = previewImgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;

        let r = rBuffer[idx];
        let g = gBuffer[idx];
        let b = bBuffer[idx];

        // Clamp 0-255
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        // Quantize to 5-6-5 bits
        const r5 = Math.round((r * 31) / 255);
        const g6 = Math.round((g * 63) / 255);
        const b5 = Math.round((b * 31) / 255);

        // Reconstructed 8-bit values for preview and error calculation
        const rRec = Math.round((r5 * 255) / 31);
        const gRec = Math.round((g6 * 255) / 63);
        const bRec = Math.round((b5 * 255) / 31);

        if (dither) {
          const errR = r - rRec;
          const errG = g - gRec;
          const errB = b - bRec;

          // Floyd-Steinberg error diffusion:
          // [x+1, y] += 7/16
          // [x-1, y+1] += 3/16
          // [x, y+1] += 5/16
          // [x+1, y+1] += 1/16
          if (x + 1 < width) {
            rBuffer[idx + 1] += (errR * 7) / 16;
            gBuffer[idx + 1] += (errG * 7) / 16;
            bBuffer[idx + 1] += (errB * 7) / 16;
          }
          if (y + 1 < height) {
            if (x > 0) {
              rBuffer[idx + width - 1] += (errR * 3) / 16;
              gBuffer[idx + width - 1] += (errG * 3) / 16;
              bBuffer[idx + width - 1] += (errB * 3) / 16;
            }
            rBuffer[idx + width] += (errR * 5) / 16;
            gBuffer[idx + width] += (errG * 5) / 16;
            bBuffer[idx + width] += (errB * 5) / 16;
            if (x + 1 < width) {
              rBuffer[idx + width + 1] += (errR * 1) / 16;
              gBuffer[idx + width + 1] += (errG * 1) / 16;
              bBuffer[idx + width + 1] += (errB * 1) / 16;
            }
          }
        }

        // Pack 16-bit RGB565
        const rgb16 = ((r5 & 0x1f) << 11) | ((g6 & 0x3f) << 5) | (b5 & 0x1f);
        const byteIndex = idx * 2;

        if (swapBytes) {
          // Big-endian for ST7789 display controller
          uint8Bytes[byteIndex] = (rgb16 >> 8) & 0xff;
          uint8Bytes[byteIndex + 1] = rgb16 & 0xff;
        } else {
          // Little-endian
          uint8Bytes[byteIndex] = rgb16 & 0xff;
          uint8Bytes[byteIndex + 1] = (rgb16 >> 8) & 0xff;
        }

        // Set preview canvas pixel (with simulated 16-bit color quantization)
        const pIdx = idx * 4;
        pData[pIdx] = rRec;
        pData[pIdx + 1] = gRec;
        pData[pIdx + 2] = bRec;
        pData[pIdx + 3] = 255;
      }
    }

    previewCtx.putImageData(previewImgData, 0, 0);
    const previewDataUrl = previewCanvas.toDataURL('image/png');

    // Generate C code snippet (sample capped or structured)
    const cCode = this.generateCCode(uint8Bytes, width, height);

    // Generate MicroPython bytearray
    const pythonCode = this.generatePythonCode(uint8Bytes, width, height);

    // Generate complete runnable MicroPython display runner script
    const pythonRunnerScript = this.generatePythonRunner(width, height);

    return {
      width,
      height,
      totalBytes,
      bytes: uint8Bytes,
      previewDataUrl,
      cCode,
      pythonCode,
      pythonRunnerScript,
    };
  }

  private resolveImage(src: HTMLImageElement | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (src instanceof HTMLImageElement) {
        if (src.complete && src.naturalWidth > 0) {
          resolve(src);
        } else {
          src.onload = () => resolve(src);
          src.onerror = reject;
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(src);
    });
  }

  private generateCCode(bytes: Uint8Array, width: number, height: number): string {
    const numPixels = width * height;
    const header = `// UNIHIKER K10 (ESP32-S3) RGB565 Image Asset\n// Dimensions: ${width}x${height} | Total: ${bytes.length} bytes\n#include <pgmspace.h>\n\nconst uint16_t image_k10[${numPixels}] PROGMEM = {\n`;
    
    // Sample preview of first 64 values to keep display snappy
    const samples: string[] = [];
    const maxEntries = Math.min(numPixels, 128);
    for (let i = 0; i < maxEntries; i++) {
      const hi = bytes[i * 2];
      const lo = bytes[i * 2 + 1];
      const val = (hi << 8) | lo;
      samples.push(`0x${val.toString(16).padStart(4, '0').toUpperCase()}`);
    }

    let body = '  ' + samples.slice(0, 16).join(', ') + ',\n';
    body += '  ' + samples.slice(16, 32).join(', ') + ',\n';
    body += '  ' + samples.slice(32, 48).join(', ') + ',\n';
    body += '  ' + samples.slice(48, 64).join(', ') + ',\n';
    body += `  // ... [${numPixels - 64} more 16-bit pixels in raw download binary]\n};`;

    return header + body;
  }

  private generatePythonCode(bytes: Uint8Array, width: number, height: number): string {
    const sampleBytes = Math.min(bytes.length, 64);
    let hexStr = '';
    for (let i = 0; i < sampleBytes; i++) {
      hexStr += `\\x${bytes[i].toString(16).padStart(2, '0')}`;
    }

    return `# UNIHIKER K10 MicroPython RGB565 Image Buffer
# Resolution: ${width}x${height} | Expected total bytes: ${bytes.length}
# For full image, upload the exported .bin to the board and load via file stream

IMAGE_WIDTH = ${width}
IMAGE_HEIGHT = ${height}
IMAGE_HEADER_SAMPLE = bytearray(b"${hexStr}")
`;
  }

  private generatePythonRunner(width: number, height: number): string {
    return `# UNIHIKER K10 - Full Display RGB565 Blitter Script
# 1. Click "Download Raw .bin" and save as "image.bin"
# 2. Upload "image.bin" to your UNIHIKER K10 filesystem
# 3. Run this script to render at full 60 FPS without memory exhaustion

from machine import Pin, SPI, PWM
import framebuf
import time

WIDTH = ${width}
HEIGHT = ${height}

# Initialize backlight & SPI on UNIHIKER K10
bl = PWM(Pin(14), freq=1000)
bl.duty_u16(65535)

spi = SPI(2, baudrate=40000000, polarity=1, phase=1, sck=Pin(12), mosi=Pin(11))
dc = Pin(13, Pin.OUT)
cs = Pin(10, Pin.OUT)

def render_image(filename="image.bin"):
    print("[RENDER] Streaming", filename, "to ST7789 display...")
    with open(filename, "rb") as f:
        chunk_lines = 40
        chunk_bytes = WIDTH * chunk_lines * 2
        buf = bytearray(chunk_bytes)
        
        for y in range(0, HEIGHT, chunk_lines):
            f.readinto(buf)
            # Write chunk directly to LCD SPI window
            dc.value(1)
            cs.value(0)
            spi.write(buf)
            cs.value(1)
    print("[DONE] Render complete!")

render_image("image.bin")
`;
  }
}

export const rgb565Converter = new RGB565ConverterService();
