import React, { useState } from 'react';
import {
  Search,
  Zap,
  Download,
  Cpu,
  CheckCircle2,
  HardDrive,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  PlusCircle,
  X,
  Star,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { FIRMWARE_PRESETS } from '../data/firmwarePresets';
import { FirmwarePreset, SerialStatus } from '../types/flasher';

interface FirmwareExplorerViewProps {
  status: SerialStatus;
  onFlashPreset: (preset: FirmwarePreset) => void;
  onOpenAutoMapper: () => void;
  onOpenSecurityLab?: () => void;
  isBusy: boolean;
}

export const FirmwareExplorerView: React.FC<FirmwareExplorerViewProps> = ({
  status,
  onFlashPreset,
  onOpenAutoMapper,
  onOpenSecurityLab,
  isBusy,
}) => {
  const [presets, setPresets] = useState<FirmwarePreset[]>(FIRMWARE_PRESETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Custom firmware submission form
  const [customName, setCustomName] = useState('');
  const [customVersion, setCustomVersion] = useState('v1.0.0-custom');
  const [customCategory, setCustomCategory] = useState<'Community' | 'Unverified'>('Unverified');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customAddress, setCustomAddress] = useState('0x10000');
  const [customDesc, setCustomDesc] = useState('');
  const [customFeatures, setCustomFeatures] = useState('');

  const categories = ['All', 'Official', 'Community', 'Unverified', 'Runtimes', 'IoT', 'Graphics', 'Utility'];

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return presets.length;
    if (cat === 'Unverified') return presets.filter((p) => p.isUnverified || p.category === 'Unverified').length;
    if (cat === 'Community') return presets.filter((p) => p.isCommunity || p.category === 'Community').length;
    return presets.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
  };

  const quickTags = [
    { label: 'All', query: '' },
    { label: 'Marauder & RF', query: 'Marauder' },
    { label: 'Bruce Multi-Tool', query: 'Bruce' },
    { label: 'BadUSB & HID', query: 'BadUSB' },
    { label: 'Home Assistant & MQTT', query: 'Home' },
    { label: 'TinyML AI', query: 'TinyML' },
    { label: 'Retro Gaming', query: 'Emulator' },
    { label: 'Spectrum Waterfall', query: 'Spectrum' },
  ];

  const filteredPresets = presets.filter((preset) => {
    const matchesSearch =
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (preset.author && preset.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      preset.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Unverified'
        ? preset.isUnverified || preset.category === 'Unverified'
        : selectedCategory === 'Community'
        ? preset.isCommunity || preset.category === 'Community'
        : preset.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const isConnected = status === 'connected' || status === 'flashing';

  const handleAddCustomFirmware = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customUrl) return;

    const newPreset: FirmwarePreset = {
      id: `custom-${Date.now()}`,
      name: customName,
      version: customVersion,
      category: customCategory,
      isCommunity: customCategory === 'Community',
      isUnverified: customCategory === 'Unverified',
      author: customAuthor || 'Community Contributor',
      description: customDesc || 'Custom community firmware image.',
      flashSize: '16MB Flash',
      chipTarget: 'ESP32-S3',
      downloadUrl: customUrl,
      features: customFeatures
        ? customFeatures.split(',').map((f) => f.trim())
        : ['Custom user partition', 'Community build'],
      binarySources: [
        {
          name: customName,
          address: customAddress,
          url: customUrl,
          sizeBytes: 1048576,
          description: 'Custom community binary',
        },
      ],
      slots: [
        { name: 'Custom Application', address: customAddress, description: 'Custom firmware binary' },
      ],
    };

    setPresets((prev) => [newPreset, ...prev]);
    setShowAddModal(false);
    // Reset form
    setCustomName('');
    setCustomUrl('');
    setCustomAuthor('');
    setCustomDesc('');
    setCustomFeatures('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Open Firmware Ecosystem
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-mono">ESP32-S3 / UNIHIKER K10</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-amber-400 font-medium">{presets.length} Total Firmwares</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Firmware & Runtime Explorer
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Discover and install official OS images, community security toolkits, language runtimes, smart home platforms, retro emulators, and unverified community builds for the UNIHIKER K10.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Custom Firmware</span>
            </button>

            {onOpenSecurityLab && (
              <button
                onClick={onOpenSecurityLab}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 text-white transition shadow-md shadow-emerald-700/20"
                title="Open Security Assessment & Embedded Research Lab"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Security Lab</span>
              </button>
            )}

            <button
              onClick={onOpenAutoMapper}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Auto-Mapper</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community & Unverified Disclaimer Notice */}
      <div className="bg-slate-900/50 border border-amber-900/50 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-300 font-semibold block mb-0.5">
            Community & Unverified Builds Policy:
          </strong>
          Community and unverified firmwares are contributed by open-source tinkerers and independent creators. Always verify peripheral pinouts with the <strong>Hardware Pin Auto-Mapper</strong> before flashing, or make a fresh backup.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category filter tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{cat === 'All' ? 'All Firmwares' : cat === 'Unverified' ? 'Unverified / Exp' : cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search firmwares, author, features..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Quick Community Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Quick Tags:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => {
                setSearchQuery(tag.query);
                if (tag.query) setSelectedCategory('All');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition shrink-0 border ${
                (tag.query === '' && searchQuery === '') || (tag.query !== '' && searchQuery === tag.query)
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Firmware Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPresets.map((preset) => {
          const totalSize = preset.binarySources.reduce((acc, s) => acc + (s.sizeBytes || 0), 0);
          return (
            <div
              key={preset.id}
              className={`border rounded-xl p-5 flex flex-col justify-between transition group shadow-sm hover:shadow-md ${
                preset.isUnverified
                  ? 'bg-slate-900/60 border-amber-900/40 hover:border-amber-700/60'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header tag and version */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {preset.category}
                    </span>

                    {preset.isFactory && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-1.5 rounded">
                        OFFICIAL
                      </span>
                    )}

                    {preset.isCommunity && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-1.5 rounded">
                        COMMUNITY
                      </span>
                    )}

                    {preset.isUnverified && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-950/80 border border-amber-800/80 px-1.5 rounded">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>UNVERIFIED</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
                    {preset.version}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition">
                  {preset.name}
                </h3>

                {preset.author && (
                  <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
                    <span>By: <span className="text-slate-300">{preset.author}</span></span>
                    {preset.starsCount && (
                      <span className="flex items-center gap-1 text-amber-400/90 font-mono">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{preset.starsCount.toLocaleString()}</span>
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-3">
                  {preset.description}
                </p>

                {/* Features */}
                <div className="space-y-1.5 mb-4">
                  {preset.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom footer & actions */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{preset.chipTarget}</span>
                  <span>{totalSize > 0 ? `${(totalSize / 1024 / 1024).toFixed(1)} MB` : preset.flashSize}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onFlashPreset(preset)}
                    disabled={isBusy}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white disabled:bg-slate-800 disabled:text-slate-500 transition shadow-sm ${
                      preset.isUnverified
                        ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isConnected ? 'Flash to K10' : 'Select & Flash'}</span>
                  </button>

                  {preset.downloadUrl && (
                    <a
                      href={preset.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                      title="Download binary image directly"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {preset.sourceRepo && (
                    <a
                      href={preset.sourceRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                      title="View GitHub Repository"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 border border-slate-800 rounded-xl">
          <Layers className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">No matching firmwares found</h4>
          <p className="text-xs text-slate-500 mt-1">Try another search or click "Add Custom Firmware" to submit one.</p>
        </div>
      )}

      {/* Add Custom / Community Firmware Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              Add Community or Custom Firmware
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Supply a download URL for any open-source ESP32-S3 binary to flash it directly on the UNIHIKER K10.
            </p>

            <form onSubmit={handleAddCustomFirmware} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Firmware Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Custom ESP32-S3 IoT Node"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Version</label>
                  <input
                    type="text"
                    value={customVersion}
                    onChange={(e) => setCustomVersion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Community">Community Build</option>
                    <option value="Unverified">Unverified / Experimental</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Author / Contributor</label>
                  <input
                    type="text"
                    placeholder="e.g. Community Dev"
                    value={customAuthor}
                    onChange={(e) => setCustomAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Flash Memory Offset</label>
                  <input
                    type="text"
                    placeholder="0x10000 or 0x0000"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono text-indigo-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Binary Download URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://.../firmware.bin"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description of what this firmware does..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Key Features (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Wi-Fi AP, ST7789 display, Sensors"
                  value={customFeatures}
                  onChange={(e) => setCustomFeatures(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md shadow-indigo-600/20"
                >
                  Add to Explorer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
