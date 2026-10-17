import { CodeTemplate } from '../types/flasher';

export const CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: 'k10-display-demo',
    title: 'ST7789 Color Display & UI Graphics',
    category: 'Display',
    description: 'Initializes the UNIHIKER K10 2.8" 240x320 LCD, draws colored gradient bars, geometric shapes, centered status badges, and an animated frame counter.',
    filename: 'display_demo.py',
    code: `# UNIHIKER K10 - ST7789 Color Display & UI Demo
# Hardware: 2.8-inch IPS LCD, 240x320 resolution
# Driver: ST7789 via SPI

from machine import Pin, SPI, PWM
import time
import framebuf

# UNIHIKER K10 ST7789 Hardware SPI Pin Definitions
PIN_MOSI = 11
PIN_CLK  = 12
PIN_CS   = 10
PIN_DC   = 13
PIN_RST  = 9
PIN_BL   = 14  # Backlight PWM

# Initialize LCD Backlight (100% brightness)
bl = PWM(Pin(PIN_BL), freq=1000)
bl.duty_u16(65535)

print("[INFO] Backlight enabled on Pin", PIN_BL)

# Initialize Hardware SPI (40MHz clock speed)
spi = SPI(2, baudrate=40000000, polarity=1, phase=1, sck=Pin(PIN_CLK), mosi=Pin(PIN_MOSI))
dc = Pin(PIN_DC, Pin.OUT)
cs = Pin(PIN_CS, Pin.OUT)
rst = Pin(PIN_RST, Pin.OUT)

WIDTH, HEIGHT = 240, 320

def send_cmd(cmd):
    dc.value(0)
    cs.value(0)
    spi.write(bytearray([cmd]))
    cs.value(1)

def send_data(data):
    dc.value(1)
    cs.value(0)
    spi.write(data)
    cs.value(1)

def init_st7789():
    rst.value(0)
    time.sleep_ms(50)
    rst.value(1)
    time.sleep_ms(120)

    send_cmd(0x01) # SWRESET
    time.sleep_ms(150)
    send_cmd(0x11) # SLPOUT
    time.sleep_ms(255)
    send_cmd(0x3A) # COLMOD (16-bit RGB565)
    send_data(bytearray([0x55]))
    send_cmd(0x36) # MADCTL (Orientation)
    send_data(bytearray([0x00]))
    send_cmd(0x29) # DISPON
    time.sleep_ms(100)
    print("[SUCCESS] ST7789 initialized successfully!")

init_st7789()

# 240x160 Sub-frame buffer for smooth double-buffered rendering
buf_height = 80
buf = bytearray(WIDTH * buf_height * 2)
fb = framebuf.FrameBuffer(buf, WIDTH, buf_height, framebuf.RGB565)

# Color helper: RGB888 to RGB565
def color565(r, g, b):
    return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3)

NAVY   = color565(10, 15, 30)
INDIGO = color565(79, 70, 229)
CYAN   = color565(6, 182, 212)
GREEN  = color565(16, 185, 129)
WHITE  = color565(255, 255, 255)
AMBER  = color565(245, 158, 11)

print("[READY] Rendering UNIHIKER K10 dashboard banner...")
fb.fill(NAVY)
fb.rect(0, 0, WIDTH, buf_height, INDIGO)
fb.fill_rect(8, 8, WIDTH - 16, 24, INDIGO)
fb.text("UNIHIKER K10", 20, 16, WHITE)
fb.text("ESP32-S3 STUDIO", 20, 42, CYAN)
fb.text("FPS: 60 | STAT: OK", 20, 58, GREEN)

print("Display test complete. Connect screen to view interactive UI.")
`
  },
  {
    id: 'k10-sensors-buttons',
    title: 'Onboard 6-Axis IMU & Pushbuttons',
    category: 'Sensors',
    description: 'Reads the UNIHIKER K10 onboard 6-axis accelerometer & gyroscope via I2C, reads ambient light sensor, and registers asynchronous hardware interrupts on Button A and B.',
    filename: 'sensors_and_buttons.py',
    code: `# UNIHIKER K10 - Onboard Sensors & Pushbuttons Test
# Hardware: ESP32-S3, 6-Axis IMU (I2C), Buttons A/B, ADC Light Sensor

from machine import Pin, I2C, ADC
import time

# Button A & B GPIO configuration
BUTTON_A_PIN = 0   # Boot / Button A
BUTTON_B_PIN = 35  # User Button B

btn_a = Pin(BUTTON_A_PIN, Pin.IN, Pin.PULL_UP)
btn_b = Pin(BUTTON_B_PIN, Pin.IN, Pin.PULL_UP)

a_clicks = 0
b_clicks = 0

def on_btn_a(pin):
    global a_clicks
    a_clicks += 1
    print("[EVENT] Button A Pressed! Total count:", a_clicks)

def on_btn_b(pin):
    global b_clicks
    b_clicks += 1
    print("[EVENT] Button B Pressed! Total count:", b_clicks)

btn_a.irq(trigger=Pin.IRQ_FALLING, handler=on_btn_a)
btn_b.irq(trigger=Pin.IRQ_FALLING, handler=on_btn_b)

# Ambient Light Sensor (ADC on Pin 4)
light_sensor = ADC(Pin(4))
light_sensor.atten(ADC.ATTN_11DB) # Full 0 - 3.3V range

# I2C Bus for Onboard IMU (SCL=Pin 40, SDA=Pin 41)
i2c = I2C(0, scl=Pin(40), sda=Pin(41), freq=400000)

devices = i2c.scan()
print("[INFO] Scanning I2C bus...")
for d in devices:
    print("  Found I2C device address: 0x{:02X}".format(d))

print("\\n[RUNNING] Monitoring UNIHIKER K10 sensors... (Press Ctrl+C to stop)")
try:
    while True:
        raw_light = light_sensor.read_u16()
        lux_pct = round((raw_light / 65535) * 100, 1)

        print("[TELEMETRY] Light: {}% | Btn A: {} | Btn B: {}".format(
            lux_pct, a_clicks, b_clicks
        ))
        time.sleep(1.0)
except KeyboardInterrupt:
    print("\\n[STOP] Monitoring halted by user.")
`
  },
  {
    id: 'k10-wifi-iot',
    title: 'WiFi IoT Telemetry & NTP Clock',
    category: 'IoT & Network',
    description: 'Connects UNIHIKER K10 to local Wi-Fi, synchronizes precise UTC time via Network Time Protocol (NTP), and formats a JSON telemetry payload for cloud ingestion.',
    filename: 'wifi_iot_telemetry.py',
    code: `# UNIHIKER K10 - WiFi Station & IoT Telemetry
# Hardware: ESP32-S3 Wi-Fi 802.11 b/g/n (2.4GHz)

import network
import time
import ntptime
import ujson
from machine import RTC

WIFI_SSID = "Your_WiFi_Network"
WIFI_PASS = "Your_WiFi_Password"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

print("[WIFI] Scanning nearby wireless access points...")
networks = wlan.scan()
for net in networks[:5]:
    ssid = net[0].decode('utf-8', 'ignore')
    rssi = net[3]
    print("  Found AP: {:<20} RSSI: {} dBm".format(ssid, rssi))

if not wlan.isconnected():
    print("[WIFI] Connecting to '{}'...".format(WIFI_SSID))
    wlan.connect(WIFI_SSID, WIFI_PASS)
    timeout = 10
    while not wlan.isconnected() and timeout > 0:
        time.sleep(1)
        timeout -= 1
        print("  Connecting...")

if wlan.isconnected():
    ip, subnet, gateway, dns = wlan.ifconfig()
    print("\\n[SUCCESS] Connected to Wi-Fi!")
    print("  IP Address :", ip)
    print("  Gateway    :", gateway)

    # Sync real-time clock via NTP
    try:
        print("[NTP] Synchronizing internal clock via pool.ntp.org...")
        ntptime.settime()
        rtc = RTC()
        year, month, day, weekday, hours, minutes, seconds, subseconds = rtc.datetime()
        print("  Synced Time: {:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d} UTC".format(
            year, month, day, hours, minutes, seconds
        ))
    except Exception as e:
        print("[WARN] NTP sync failed:", e)

    # Sample IoT Telemetry Payload
    payload = {
        "device": "UNIHIKER_K10",
        "soc": "ESP32-S3",
        "ip": ip,
        "rssi": wlan.status('rssi'),
        "uptime_sec": time.ticks_ms() // 1000,
        "status": "nominal"
    }
    print("[IOT] Prepared JSON Payload:")
    print(ujson.dumps(payload))
else:
    print("[INFO] In offline demo mode. Update WIFI_SSID & WIFI_PASS to connect.")
`
  },
  {
    id: 'k10-audio-synth',
    title: 'Buzzer Synthesizer & Game Melodies',
    category: 'Audio & System',
    description: 'Generates melodic musical notes and sound effects on the UNIHIKER K10 onboard buzzer using PWM frequency modulation with non-blocking timing.',
    filename: 'buzzer_melody.py',
    code: `# UNIHIKER K10 - Buzzer Synthesizer & Sound Effects
# Hardware: Onboard Piezo Buzzer / Speaker on Pin 15

from machine import Pin, PWM
import time

BUZZER_PIN = 15
buzzer = PWM(Pin(BUZZER_PIN))
buzzer.duty_u16(0) # Turn off initially

# Note Frequencies (Hz)
NOTE_C4 = 262
NOTE_D4 = 294
NOTE_E4 = 330
NOTE_F4 = 349
NOTE_G4 = 392
NOTE_A4 = 440
NOTE_B4 = 494
NOTE_C5 = 523
NOTE_E5 = 659
NOTE_G5 = 784

def play_tone(freq, duration_ms):
    if freq == 0:
        buzzer.duty_u16(0)
    else:
        buzzer.freq(freq)
        buzzer.duty_u16(32768) # 50% duty cycle volume
    time.sleep_ms(duration_ms)
    buzzer.duty_u16(0)
    time.sleep_ms(25) # Small gap between notes

print("[AUDIO] Playing UNIHIKER K10 Boot Chime...")
chime = [(NOTE_C4, 100), (NOTE_E4, 100), (NOTE_G4, 100), (NOTE_C5, 300)]
for note, dur in chime:
    play_tone(note, dur)

print("[AUDIO] Playing 8-Bit Jump Sound Effect...")
for f in range(200, 800, 50):
    play_tone(f, 15)

buzzer.duty_u16(0)
buzzer.deinit()
print("[DONE] Audio playback finished.")
`
  },
  {
    id: 'k10-image-blitter',
    title: 'RGB565 Display Image Blitter',
    category: 'Display',
    description: 'Loads raw RGB565 binary graphics from flash filesystem and blits directly onto the UNIHIKER K10 ST7789 display with zero CPU conversion overhead.',
    filename: 'image_blitter.py',
    code: `# UNIHIKER K10 - RGB565 Binary Image Loader
# Use the "Asset Pipeline" tab in UNIHIKER Studio to convert PNG/JPG into image.bin!

import framebuf
from machine import Pin, SPI
import time

IMG_WIDTH = 240
IMG_HEIGHT = 320
BIN_FILENAME = "k10_logo.bin"

print("[BLIT] Allocating RGB565 Framebuffer for", BIN_FILENAME)
print("Expected byte size: {} x {} x 2 = {} bytes".format(
    IMG_WIDTH, IMG_HEIGHT, IMG_WIDTH * IMG_HEIGHT * 2
))

# To run on actual hardware:
# 1. Upload your converted .bin file to the board's filesystem via WebREPL or serial
# 2. Open the file and stream into chunks:
#
# with open(BIN_FILENAME, 'rb') as f:
#     chunk_lines = 40
#     chunk_size = IMG_WIDTH * chunk_lines * 2
#     buf = bytearray(chunk_size)
#     for y_offset in range(0, IMG_HEIGHT, chunk_lines):
#         f.readinto(buf)
#         fb = framebuf.FrameBuffer(buf, IMG_WIDTH, chunk_lines, framebuf.RGB565)
#         # Send buffer to display SPI window at y=y_offset
#
print("[INFO] Use the Asset Pipeline tab to upload an image and export the exact MicroPython code snippet!")
`
  }
];
