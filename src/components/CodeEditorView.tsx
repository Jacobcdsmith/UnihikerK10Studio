import React, { useState } from 'react';
import {
  Play,
  Download,
  Copy,
  Check,
  RotateCcw,
  FileCode,
  Sparkles,
  BookOpen,
  Send,
} from 'lucide-react';
import { CODE_TEMPLATES } from '../data/codeTemplates';
import { CodeTemplate, SerialStatus } from '../types/flasher';

interface CodeEditorViewProps {
  status: SerialStatus;
  onSendText: (text: string) => Promise<void>;
  onSendControlChar: (char: string) => Promise<void>;
  onSwitchToTerminal: () => void;
  injectedFile?: { code: string; filename: string } | null;
}

export const CodeEditorView: React.FC<CodeEditorViewProps> = ({
  status,
  onSendText,
  onSendControlChar,
  onSwitchToTerminal,
  injectedFile,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(CODE_TEMPLATES[0]);
  const [code, setCode] = useState<string>(CODE_TEMPLATES[0].code);
  const [activeFilename, setActiveFilename] = useState<string>(CODE_TEMPLATES[0].filename);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const isConnected = status === 'connected' || status === 'flashing';

  // Update editor whenever injectedFile changes
  React.useEffect(() => {
    if (injectedFile) {
      setCode(injectedFile.code);
      setActiveFilename(injectedFile.filename);
    }
  }, [injectedFile]);

  const handleSelectTemplate = (template: CodeTemplate) => {
    setSelectedTemplate(template);
    setCode(template.code);
    setActiveFilename(template.filename);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFilename || 'main.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunOnBoard = async () => {
    if (!isConnected) return;
    setIsRunning(true);
    try {
      // Step 1: Send Ctrl+C to interrupt any running loops
      await onSendControlChar('\x03');
      await new Promise((r) => setTimeout(r, 150));

      // Step 2: Send Ctrl+E to enter raw paste mode in MicroPython if supported
      // Or split code by line and send with small pauses
      const lines = code.split('\n');
      for (const line of lines) {
        await onSendText(line);
        await new Promise((r) => setTimeout(r, 20));
      }

      onSwitchToTerminal();
    } finally {
      setIsRunning(false);
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] bg-slate-950 overflow-hidden">
      {/* Sidebar: Templates & Hardware Reference */}
      <aside className="w-full lg:w-80 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>K10 Code Templates</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Curated MicroPython scripts tested on UNIHIKER K10 hardware.
          </p>
        </div>

        <div className="space-y-2 flex-1">
          {CODE_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-indigo-400">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {tmpl.filename}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{tmpl.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* UNIHIKER K10 Pin Summary Card */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-400 space-y-1.5">
          <span className="font-semibold text-slate-300 block">Quick Pin Reference:</span>
          <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
            <div><span className="text-slate-500">LCD SPI:</span> Pin 11, 12</div>
            <div><span className="text-slate-500">Backlight:</span> Pin 14</div>
            <div><span className="text-slate-500">IMU I2C:</span> Pin 40, 41</div>
            <div><span className="text-slate-500">Light ADC:</span> Pin 4</div>
            <div><span className="text-slate-500">Buzzer PWM:</span> Pin 15</div>
            <div><span className="text-slate-500">Button A/B:</span> Pin 0, 35</div>
          </div>
        </div>
      </aside>

      {/* Main Code Editor View */}
      <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {/* Editor Top Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white">{activeFilename}</span>
            <span className="text-xs text-slate-500">({lineCount} lines)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCode(selectedTemplate.code)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset code to original template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copy code to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Download Python script"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .py</span>
            </button>

            <button
              onClick={handleRunOnBoard}
              disabled={!isConnected || isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800 disabled:text-slate-500 transition shadow-lg shadow-emerald-600/20"
              title="Transmits this script to the UNIHIKER K10 serial REPL and opens monitor"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Streaming to K10...' : 'Run on Board (REPL)'}</span>
            </button>
          </div>
        </div>

        {/* Editor Text Area with Line Numbers */}
        <div className="flex-1 flex overflow-hidden bg-[#090d16]">
          {/* Gutter Line Numbers */}
          <div className="w-12 py-3 bg-[#070a10] border-r border-slate-800/80 text-right pr-3 select-none text-slate-600 font-mono text-xs overflow-hidden">
            {lineNumbers.map((num) => (
              <div key={num} className="leading-6">
                {num}
              </div>
            ))}
          </div>

          {/* Interactive Code Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 p-3 bg-transparent font-mono text-xs text-slate-200 leading-6 resize-none focus:outline-none overflow-y-auto selection:bg-indigo-600/40"
          />
        </div>
      </main>
    </div>
  );
};
