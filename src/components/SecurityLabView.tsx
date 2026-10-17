import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Search,
  Filter,
  Download,
  ExternalLink,
  Cpu,
  Radio,
  Key,
  HardDrive,
  FileCode,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SECURITY_TOOLS } from '../data/securityTools';
import { SecurityTool, CompatibilityStatus } from '../types/security';

interface SecurityLabViewProps {
  onOpenAutoMapper: () => void;
  onNavigateToTab?: (tab: 'flasher' | 'explorer' | 'terminal' | 'editor' | 'assets' | 'pinout' | 'security') => void;
}

export const SecurityLabView: React.FC<SecurityLabViewProps> = ({
  onOpenAutoMapper,
  onNavigateToTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCompatible, setOnlyCompatible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Cryptography & eFuse',
    'Wireless & RF Auditing',
    'Hardware & Bus Analysis',
    'Firmware Integrity',
  ];

  const filteredTools = SECURITY_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.targetHardware.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || tool.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesCompatibility = onlyCompatible
      ? tool.compatibilityStatus === 'compatible'
      : true;

    return matchesSearch && matchesCategory && matchesCompatibility;
  });

  const compatibleCount = SECURITY_TOOLS.filter((t) => t.compatibilityStatus === 'compatible').length;
  const underReviewCount = SECURITY_TOOLS.filter((t) => t.compatibilityStatus === 'under_review').length;
  const incompatibleCount = SECURITY_TOOLS.filter((t) => t.compatibilityStatus === 'incompatible').length;

  const renderStatusBadge = (status: CompatibilityStatus) => {
    switch (status) {
      case 'compatible':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ESP32-S3 Compatible</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Under Review / Expansion Req</span>
          </span>
        );
      case 'incompatible':
        return (
          <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-950/80 border border-red-800/80 px-2.5 py-1 rounded-lg">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            <span>Incompatible Architecture</span>
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>Security Assessment & Embedded Research Lab</span>
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-mono">UNIHIKER K10 (ESP32-S3)</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Hardware Security & Diagnostic Tooling Lab
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Curated repository of hardware audit utilities, diagnostic packet monitors, eFuse cryptographic verifiers, and physical bus analyzers specifically mapped and verified for the UNIHIKER K10 and ESP32-S3 microcontroller.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenAutoMapper}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/25 whitespace-nowrap"
            >
              <Cpu className="w-4 h-4" />
              <span>Auto-Map Hardware Pins</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Compatibility Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-xl">
            <span className="text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Hardware Compatibility</span>
            </span>
            <span className="text-emerald-400 font-bold font-mono text-sm">{compatibleCount}</span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-xl">
            <span className="text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Under Review / Expansion Shield</span>
            </span>
            <span className="text-amber-400 font-bold font-mono text-sm">{underReviewCount}</span>
          </div>

          <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 px-3.5 py-2 rounded-xl">
            <span className="text-slate-400 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Incompatible Architectures (P4 / RISC-V)</span>
            </span>
            <span className="text-red-400 font-bold font-mono text-sm">{incompatibleCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Compatibility toggle & Search input */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap select-none hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={onlyCompatible}
              onChange={(e) => setOnlyCompatible(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Show Only ESP32-S3 Compatible</span>
          </label>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessment utilities..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Security Tools Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className={`border rounded-xl p-5 flex flex-col justify-between transition group shadow-sm hover:shadow-md ${
              tool.compatibilityStatus === 'compatible'
                ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                : tool.compatibilityStatus === 'under_review'
                ? 'bg-slate-900/60 border-amber-900/40 hover:border-amber-700/60'
                : 'bg-slate-950/50 border-red-950/60 opacity-80'
            }`}
          >
            <div>
              {/* Header: Category & Compatibility Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  {tool.category}
                </span>
                {renderStatusBadge(tool.compatibilityStatus)}
              </div>

              {/* Title & Purpose */}
              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-indigo-300 transition">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {tool.purpose}
              </p>

              {/* Hardware & Compatibility Details Box */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Target Hardware:</span>
                  <span className="text-slate-200 font-semibold">{tool.targetHardware}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Open-Source License:</span>
                  <span className="text-indigo-300">{tool.license}</span>
                </div>
                <div className="pt-2 border-t border-slate-900 text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300 block mb-0.5">Compatibility Notes:</strong>
                  {tool.compatibilityNotes}
                </div>
              </div>

              {/* Hardware Architecture Constraints Grid */}
              <div className="mb-4">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                  Verified Hardware Constraints:
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                  {tool.constraints.socArchitecture && (
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                      <span className="text-slate-500">CPU: </span>{tool.constraints.socArchitecture}
                    </div>
                  )}
                  {tool.constraints.wirelessRadio && (
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                      <span className="text-slate-500">Radio: </span>{tool.constraints.wirelessRadio}
                    </div>
                  )}
                  {tool.constraints.bleSupport && (
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                      <span className="text-slate-500">BLE: </span>{tool.constraints.bleSupport}
                    </div>
                  )}
                  {tool.constraints.psramRequirement && (
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                      <span className="text-slate-500">RAM: </span>{tool.constraints.psramRequirement}
                    </div>
                  )}
                  {tool.constraints.flashRequirement && (
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                      <span className="text-slate-500">Flash: </span>{tool.constraints.flashRequirement}
                    </div>
                  )}
                  {tool.constraints.usbInterface && (
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60 truncate">
                      <span className="text-slate-500">USB: </span>{tool.constraints.usbInterface}
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features List */}
              <div className="space-y-1.5 mb-4">
                {tool.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mr-2 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <button
                onClick={onOpenAutoMapper}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Auto-Map Pins</span>
              </button>

              <div className="flex items-center gap-2">
                {tool.docUrl && (
                  <a
                    href={tool.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
                  >
                    <span>Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <a
                  href={tool.downloadSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Source</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 border border-slate-800 rounded-xl">
          <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">No matching security assessment tools found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or unchecking "Show Only ESP32-S3 Compatible".
          </p>
        </div>
      )}
    </div>
  );
};
