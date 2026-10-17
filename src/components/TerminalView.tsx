import React, { useState, useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import {
  TerminalSquare,
  Trash2,
  Copy,
  Send,
  RotateCcw,
  Sliders,
  Check,
  CornerDownLeft,
  Command,
} from 'lucide-react';
import { SerialStatus } from '../types/flasher';

interface TerminalViewProps {
  status: SerialStatus;
  baudRate: number;
  setBaudRate: (baud: number) => void;
  onSendText: (text: string) => Promise<void>;
  onSendControlChar: (char: string) => Promise<void>;
  onResetBoard: () => Promise<void>;
  xtermRef: React.MutableRefObject<XTerm | null>;
}

const COMMON_BAUD_RATES = [9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600];

export const TerminalView: React.FC<TerminalViewProps> = ({
  status,
  baudRate,
  setBaudRate,
  onSendText,
  onSendControlChar,
  onResetBoard,
  xtermRef,
}) => {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);

  const isConnected = status === 'connected' || status === 'flashing';

  useEffect(() => {
    if (terminalContainerRef.current && !xtermRef.current) {
      const term = new XTerm({
        cursorBlink: true,
        fontSize: 13,
        lineHeight: 1.4,
        fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#090d16',
          foreground: '#cbd5e1',
          cursor: '#818cf8',
          black: '#0f172a',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#a855f7',
          cyan: '#06b6d4',
          white: '#f8fafc',
          brightBlack: '#475569',
          brightRed: '#f87171',
          brightGreen: '#34d399',
          brightYellow: '#fbbf24',
          brightBlue: '#60a5fa',
          brightMagenta: '#c084fc',
          brightCyan: '#22d3ee',
          brightWhite: '#ffffff',
        },
      });

      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(terminalContainerRef.current);
      fit.fit();

      xtermRef.current = term;
      fitAddonRef.current = fit;

      term.writeln('\x1b[36m=== UNIHIKER K10 Serial Console & MicroPython REPL ===\x1b[0m');
      term.writeln('\x1b[90mConnect your device via USB-C to inspect logs and send commands directly.\x1b[0m\r\n');
    }

    const handleResize = () => {
      fitAddonRef.current?.fit();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [xtermRef]);

  // Handle command submission
  const handleSendCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput;
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setCommandInput('');

    await onSendText(cmd);
  };

  // Keyboard navigation through command history
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCommandInput(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setCommandInput('');
      } else {
        setHistoryIndex(nextIdx);
        setCommandInput(history[nextIdx] || '');
      }
    }
  };

  const handleClear = () => {
    xtermRef.current?.clear();
  };

  const handleCopyLogs = () => {
    // Select all terminal buffer text if available
    xtermRef.current?.selectAll();
    const selection = xtermRef.current?.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    xtermRef.current?.clearSelection();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-950 p-4 gap-3">
      {/* Top Terminal Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <TerminalSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white">Live Serial Monitor & REPL</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Baud rate selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Baud:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={status === 'flashing'}
              className="bg-slate-950 text-indigo-300 font-mono text-xs border border-slate-800 rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
            >
              {COMMON_BAUD_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  {rate} {rate === 115200 ? '(REPL default)' : rate === 921600 ? '(Flash speed)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendControlChar('\x03')}
            disabled={!isConnected}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 disabled:opacity-40 transition"
            title="Send Ctrl+C Keyboard Interrupt"
          >
            Ctrl+C (Break)
          </button>

          <button
            onClick={() => onSendControlChar('\x04')}
            disabled={!isConnected}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 disabled:opacity-40 transition"
            title="Send Ctrl+D Soft Reboot"
          >
            Ctrl+D (Reboot)
          </button>

          <button
            onClick={onResetBoard}
            disabled={!isConnected}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 transition"
            title="Pulse DTR/RTS hardware lines to reset board"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Pin</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Copy terminal buffer to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Clear terminal window"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* xterm Canvas Box */}
      <div className="flex-1 rounded-xl border border-slate-800 bg-[#090d16] p-2.5 overflow-hidden shadow-inner flex flex-col">
        <div ref={terminalContainerRef} className="h-full w-full" />
      </div>

      {/* Interactive REPL Input Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 shadow-sm">
        <form onSubmit={handleSendCommand} className="flex items-center gap-2">
          <div className="flex items-center pl-2 text-indigo-400 font-mono text-xs select-none">
            &gt;&gt;&gt;
          </div>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
            placeholder={
              isConnected
                ? 'Type MicroPython command (e.g. import os; os.uname()) or press Up for history...'
                : 'Connect UNIHIKER K10 to send interactive REPL commands...'
            }
            className="flex-1 bg-transparent font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none px-2 py-1"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick snippet macros */}
            <button
              type="button"
              onClick={() => onSendText('help()')}
              disabled={!isConnected}
              className="px-2 py-0.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded transition disabled:opacity-40"
            >
              help()
            </button>
            <button
              type="button"
              onClick={() => onSendText('import os; print(os.uname())')}
              disabled={!isConnected}
              className="px-2 py-0.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded transition disabled:opacity-40"
            >
              uname()
            </button>
            <button
              type="button"
              onClick={() => onSendText('import gc; gc.collect(); print(gc.mem_free(), "bytes free")')}
              disabled={!isConnected}
              className="px-2 py-0.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 rounded transition disabled:opacity-40"
            >
              mem_free()
            </button>

            <button
              type="submit"
              disabled={!isConnected || !commandInput.trim()}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-slate-800 disabled:text-slate-600 transition ml-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
