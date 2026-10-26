/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PRESET_MOLECULES } from './data/presetMolecules';
import { Molecule, Atom, ElementalSynthesizedMaterial } from './types/quantum';
import { ALL_PERIODIC_MOLECULES } from './data/periodicTableData';
import { Molecule3DViewer } from './components/Molecule3DViewer';
import { QuantumCircuitView } from './components/QuantumCircuitView';
import { VqeSimulator } from './components/VqeSimulator';
import { DeepLearningGenerator } from './components/DeepLearningGenerator';
import { MolecularPropertiesCard } from './components/MolecularPropertiesCard';
import { ColabExportModal } from './components/ColabExportModal';
import { NuclearAlternativeLab } from './components/NuclearAlternativeLab';
import { SemiconductorLab } from './components/SemiconductorLab';
import { PeriodicTableLab } from './components/PeriodicTableLab';
import { ReactionKineticsLab } from './components/ReactionKineticsLab';
import { IsotopeQuantumLab } from './components/IsotopeQuantumLab';
import { AlphaFoldLab } from './components/AlphaFoldLab';
import { PeriodicElementsLibraryLab } from './components/PeriodicElementsLibraryLab';
import { CrazyAiGrapheneLab } from './components/CrazyAiGrapheneLab';
import { UserManualModal } from './components/UserManualModal';
import { 
  Atom as AtomIcon, 
  Cpu, 
  Wand2, 
  Zap, 
  Layers, 
  Compass, 
  Plus, 
  Sparkles, 
  FlaskConical, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Cloud,
  Flame,
  GitCompare,
  Dna,
  Activity,
  Search,
  Filter,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [molecules, setMolecules] = useState<Molecule[]>(() => [
    ...PRESET_MOLECULES,
    ...ALL_PERIODIC_MOLECULES
  ]);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>(PRESET_MOLECULES[0].id);
  const [activeMainTab, setActiveMainTab] = useState<'3d-sim' | 'generator' | 'vqe' | 'circuit' | 'properties' | 'nuclear-alt' | 'semiconductor' | 'periodic-table' | 'reaction-kinetics' | 'isotope-lab' | 'alphafold' | 'periodic-library' | 'crazy-graphene'>('3d-sim');
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [synthesizedMaterialForKinetics, setSynthesizedMaterialForKinetics] = useState<ElementalSynthesizedMaterial | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isColabModalOpen, setIsColabModalOpen] = useState<boolean>(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState<boolean>(false);

  // Molecular Library Sidebar Filter and Search State
  const [libCategoryFilter, setLibCategoryFilter] = useState<'all' | 'periodic' | 'presets' | 'generated'>('all');
  const [libSearchQuery, setLibSearchQuery] = useState<string>('');

  const filteredMolecules = molecules.filter((m) => {
    const isPeriodic = m.id.startsWith('elem-');
    const isGenerated = !!m.isGenerated;
    const isPreset = !isPeriodic && !isGenerated;

    if (libCategoryFilter === 'periodic' && !isPeriodic) return false;
    if (libCategoryFilter === 'presets' && !isPreset) return false;
    if (libCategoryFilter === 'generated' && !isGenerated) return false;

    if (libSearchQuery.trim()) {
      const q = libSearchQuery.toLowerCase().trim();
      return (
        m.name.toLowerCase().includes(q) ||
        m.commonName.toLowerCase().includes(q) ||
        m.formula.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const currentMolecule = molecules.find((m) => m.id === selectedMoleculeId) || molecules[0];

  const handleMoleculeGenerated = (newMolecule: Molecule) => {
    setMolecules((prev) => [newMolecule, ...prev]);
    setSelectedMoleculeId(newMolecule.id);
    setActiveMainTab('3d-sim');
    const elemSymbols = Array.from(new Set(newMolecule.atoms.map(a => a.symbol))).join(', ');
    setNotification(`🚀 우주 신물질 '${newMolecule.name}' (${newMolecule.formula}) 합성 완료! 선택 원소 [${elemSymbols}]가 3D 뷰어에 100% 반영되어 시현되었습니다.`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleUpdateCircuitParams = (newParams: number[]) => {
    setMolecules((prev) =>
      prev.map((m) =>
        m.id === currentMolecule.id
          ? {
              ...m,
              quantumCircuitConfig: {
                ...m.quantumCircuitConfig,
                parameters: newParams,
              },
            }
          : m
      )
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Main Navigation Header */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <AtomIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              QuantumMol AI
              <span className="text-[10px] text-cyan-400 font-mono font-normal">v2.4 QML-Studio</span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              양자 컴퓨팅 분자 시뮬레이션 &amp; 딥러닝 분자 구조 추론 플랫폼
            </p>
          </div>
        </div>

        {/* Center Primary Action Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800/90">
          <button
            onClick={() => setActiveMainTab('3d-sim')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === '3d-sim' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            3D 분자 뷰어
          </button>
          <button
            onClick={() => setActiveMainTab('generator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'generator' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md' : 'text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-200'}`}
          >
            <Wand2 className="w-3.5 h-3.5 animate-pulse" />
            양자 딥러닝 분자 생성기
          </button>
          <button
            onClick={() => setActiveMainTab('vqe')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'vqe' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            VQE 시뮬레이터
          </button>
          <button
            onClick={() => setActiveMainTab('circuit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'circuit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Cpu className="w-3.5 h-3.5" />
            양자 회로 (PQC)
          </button>
          <button
            onClick={() => setActiveMainTab('properties')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'properties' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Compass className="w-3.5 h-3.5" />
            물성 리포트
          </button>
          <button
            onClick={() => setActiveMainTab('nuclear-alt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'nuclear-alt' ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-md' : 'text-amber-400 hover:bg-amber-950/40 hover:text-amber-200'}`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            핵에너지 대체 양자물질 랩
          </button>
          <button
            onClick={() => setActiveMainTab('semiconductor')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'semiconductor' ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-md' : 'text-indigo-400 hover:bg-indigo-950/40 hover:text-indigo-200'}`}
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            차세대 반도체 양자 랩
          </button>
          <button
            onClick={() => setActiveMainTab('periodic-table')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'periodic-table' ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md' : 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-200'}`}
          >
            <AtomIcon className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            주기율표 &amp; 원소합성
          </button>
          <button
            onClick={() => setActiveMainTab('periodic-library')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'periodic-library' ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md' : 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-200'}`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            원소 118 분자 라이브러리
          </button>
          <button
            onClick={() => setActiveMainTab('reaction-kinetics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'reaction-kinetics' ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 text-white shadow-md' : 'text-rose-400 hover:bg-rose-950/40 hover:text-rose-200'}`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-300 animate-pulse" />
            반응 역학 실험실
          </button>
          <button
            onClick={() => setActiveMainTab('isotope-lab')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'isotope-lab' ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-md' : 'text-amber-400 hover:bg-amber-950/40 hover:text-amber-200'}`}
          >
            <GitCompare className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            동위원소 양자비교 (Li·LiD / H₂·D₂·T₂)
          </button>
          <button
            onClick={() => setActiveMainTab('alphafold')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'alphafold' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md' : 'text-cyan-400 hover:bg-blue-950/40 hover:text-cyan-200'}`}
          >
            <Dna className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            AlphaFold 단백질 접힘
          </button>
          <button
            onClick={() => setActiveMainTab('crazy-graphene')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${activeMainTab === 'crazy-graphene' ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-cyan-600 text-white shadow-md shadow-amber-950/60 ring-1 ring-amber-400/50' : 'text-amber-400 hover:bg-amber-950/50 hover:text-amber-200'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            crazy ai &amp; robotics Graphene
          </button>
        </nav>

        {/* Right Status Indicator & Colab Action & User Manual Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUserManualOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-cyan-600/20 via-indigo-600/20 to-emerald-600/20 hover:from-cyan-600/30 hover:to-emerald-600/30 text-cyan-300 border border-cyan-500/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-950"
            title="QuantumMol AI 모든 메뉴의 상세 조작법 및 사용설명서 열기"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">사용설명서</span>
            <span className="text-[10px] font-mono px-1 py-0.2 bg-cyan-400/20 rounded text-cyan-200">14대 메뉴</span>
          </button>

          <button
            onClick={() => setIsColabModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 text-amber-300 border border-amber-500/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-amber-950"
            title="구글 Colab에서 Streamlit + Cloudflare Tunnel로 시현할 수 있는 코드 및 노트북 다운로드"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Colab 웹 시현 배포</span>
            <span className="text-[10px] font-mono px-1 py-0.2 bg-amber-400/20 rounded text-amber-200">.ipynb</span>
          </button>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400 border-l border-slate-800 pl-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300">QPU 활성</span>
            </div>
            <span>·</span>
            <span>{currentMolecule.quantumProperties.qubitsRequired}Q</span>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="absolute top-16 right-6 z-50 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs max-w-md animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Molecular Library */}
        <aside className="w-80 bg-slate-950/80 border-r border-slate-800/80 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                분자 라이브러리 ({filteredMolecules.length}/{molecules.length})
              </span>
              <button
                onClick={() => setActiveMainTab('generator')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
              >
                <Plus className="w-3 h-3" /> 신규 생성
              </button>
            </div>

            {/* Direct Open 118 Elements Molecular Library Gallery Banner */}
            <button
              onClick={() => setActiveMainTab('periodic-library')}
              className="w-full py-1.5 px-2.5 bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-cyan-950/90 hover:from-emerald-900 hover:to-cyan-900 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center justify-between transition-all shadow-sm group"
            >
              <div className="flex items-center gap-1.5">
                <AtomIcon className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>주기율표 118종 전원소 3D 갤러리</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                118/118 완비
              </span>
            </button>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={libSearchQuery}
                onChange={(e) => setLibSearchQuery(e.target.value)}
                placeholder="원소기호, 분자명, 화학식 검색 (Au, Fe, H2, 벤젠)..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
              <button
                onClick={() => setLibCategoryFilter('all')}
                className={`py-1 rounded text-center transition-all ${
                  libCategoryFilter === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setLibCategoryFilter('periodic')}
                className={`py-1 rounded text-center transition-all ${
                  libCategoryFilter === 'periodic'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                원소 118
              </button>
              <button
                onClick={() => setLibCategoryFilter('presets')}
                className={`py-1 rounded text-center transition-all ${
                  libCategoryFilter === 'presets'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                벤치마크
              </button>
              <button
                onClick={() => setLibCategoryFilter('generated')}
                className={`py-1 rounded text-center transition-all ${
                  libCategoryFilter === 'generated'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                AI생성
              </button>
            </div>
          </div>

          {/* Molecule List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {filteredMolecules.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                검색 조건에 맞는 분자 또는 원소가 없습니다.
              </div>
            ) : (
              filteredMolecules.map((mol) => {
                const isSelected = mol.id === selectedMoleculeId;
                const isPeriodic = mol.id.startsWith('elem-');
                return (
                  <button
                    key={mol.id}
                    onClick={() => {
                      setSelectedMoleculeId(mol.id);
                      setSelectedAtom(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-slate-100 shadow-sm ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200 truncate">
                        {mol.name}
                      </span>
                      {mol.isGenerated ? (
                        <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> AI/QML
                        </span>
                      ) : isPeriodic ? (
                        <span className="text-[9px] text-emerald-300 font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/30">
                          원소 단체/격자
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Benchmark</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mb-1.5">
                      {mol.commonName}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/60 pt-1">
                      <span className="text-slate-300 font-semibold">{mol.formula}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400">{mol.quantumProperties.groundStateEnergy} Ha</span>
                        {isPeriodic && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMoleculeId(mol.id);
                              setSelectedAtom(null);
                              setActiveMainTab('3d-sim');
                            }}
                            className="px-1.5 py-0.2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 rounded border border-emerald-500/30 text-[9px] cursor-pointer font-bold"
                            title="3D 분자구조 즉시 시현"
                          >
                            3D 시현
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Current Molecule Summary in Sidebar Footer */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[11px] space-y-1.5 font-mono text-slate-400">
            <div className="flex justify-between">
              <span>원자수 / 결합수:</span>
              <span className="text-slate-200">{currentMolecule.atoms.length} / {currentMolecule.bonds.length}</span>
            </div>
            <div className="flex justify-between">
              <span>HOMO-LUMO Gap:</span>
              <span className="text-cyan-300 font-semibold">{currentMolecule.quantumProperties.homoLumoGap} eV</span>
            </div>
            <div className="flex justify-between">
              <span>쌍극자 모멘트:</span>
              <span className="text-amber-300">{currentMolecule.quantumProperties.dipoleMoment} D</span>
            </div>
          </div>
        </aside>

        {/* Center / Main Content Area */}
        <main className="flex-1 flex flex-col p-3 overflow-hidden bg-slate-950">
          {activeMainTab === '3d-sim' && (
            <div className="w-full h-full grid grid-rows-1 lg:grid-rows-1 gap-3">
              <Molecule3DViewer
                molecule={currentMolecule}
                selectedAtom={selectedAtom}
                onSelectAtom={(atom) => setSelectedAtom(atom)}
                onSelectMoleculeById={(id) => {
                  setSelectedMoleculeId(id);
                  setSelectedAtom(null);
                }}
              />
            </div>
          )}

          {activeMainTab === 'generator' && (
            <DeepLearningGenerator
              onMoleculeGenerated={handleMoleculeGenerated}
              currentMolecule={currentMolecule}
            />
          )}

          {activeMainTab === 'vqe' && (
            <VqeSimulator
              molecule={currentMolecule}
              onSimulationComplete={(res) => {
                setNotification(`VQE 최적화 완료: 바닥상태 ${res.groundStateCalculated} Ha 도달 (오차 ${res.energyErrorMHa} mHa)`);
                setTimeout(() => setNotification(null), 4000);
              }}
            />
          )}

          {activeMainTab === 'circuit' && (
            <QuantumCircuitView
              molecule={currentMolecule}
              onUpdateParameters={handleUpdateCircuitParams}
            />
          )}

          {activeMainTab === 'properties' && (
            <MolecularPropertiesCard molecule={currentMolecule} />
          )}

          {activeMainTab === 'nuclear-alt' && (
            <NuclearAlternativeLab />
          )}

          {activeMainTab === 'semiconductor' && (
            <SemiconductorLab
              onLoadIntoMainViewer={(semi) => {
                handleMoleculeGenerated({
                  id: semi.id,
                  name: semi.name,
                  commonName: semi.koreanName,
                  formula: semi.formula,
                  smiles: semi.smiles,
                  description: semi.description,
                  quantumRationale: semi.quantumAdvantageMechanism,
                  atoms: semi.atoms,
                  bonds: semi.bonds,
                  quantumProperties: semi.quantumProperties,
                  deepLearningMetrics: semi.deepLearningMetrics,
                  quantumCircuitConfig: semi.quantumCircuitConfig,
                  suggestedApplications: [
                    `서브볼츠만(SS = ${semi.subthresholdSwingMVdec} mV/dec) 1nm 로직 게이트 채널`,
                    `초고속 전하이동도(${semi.electronMobility.toLocaleString()} cm²/Vs) THz 집적회로`,
                    `고내압(${semi.breakdownFieldMVcm} MV/cm) 전력반도체 파워트레인 모듈`
                  ],
                  synthesisRouteSummary: semi.synthesisProtocol.summary
                });
                setActiveMainTab('3d-sim');
                setNotification(`차세대 반도체 [${semi.name}] 구조가 메인 3D 뷰어에 로드되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
            />
          )}

          {activeMainTab === 'periodic-table' && (
            <PeriodicTableLab
              onLoadIntoMainViewer={(mol) => {
                handleMoleculeGenerated(mol);
                setActiveMainTab('3d-sim');
                setNotification(`합성 신물질 [${mol.name}] 구조가 메인 3D 뷰어에 로드되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
              onOpenReactionKinetics={(material) => {
                setSynthesizedMaterialForKinetics(material);
                setActiveMainTab('reaction-kinetics');
                setNotification(`신물질 [${material.name}] (${material.formula})이 반응 역학 실험실로 전송되었습니다.`);
                setTimeout(() => setNotification(null), 4000);
              }}
              onOpenPeriodicLibrary={() => setActiveMainTab('periodic-library')}
            />
          )}

          {activeMainTab === 'periodic-library' && (
            <PeriodicElementsLibraryLab
              onLoadIntoMainViewer={(mol) => {
                setSelectedMoleculeId(mol.id);
                setSelectedAtom(null);
                setActiveMainTab('3d-sim');
                setNotification(`원소 [${mol.name}] (${mol.commonName}) 3D 분자구조가 메인 뷰어에 로드되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
              onOpenVqe={(mol) => {
                setSelectedMoleculeId(mol.id);
                setSelectedAtom(null);
                setActiveMainTab('vqe');
                setNotification(`원소 [${mol.name}] VQE 양자 시뮬레이터로 전환되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
              onOpenReactionKinetics={(mol) => {
                setSelectedMoleculeId(mol.id);
                setSelectedAtom(null);
                setActiveMainTab('reaction-kinetics');
                setNotification(`원소 [${mol.name}] 반응 역학 실험실로 전환되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
            />
          )}

          {activeMainTab === 'reaction-kinetics' && (
            <ReactionKineticsLab
              initialMaterial={synthesizedMaterialForKinetics}
              onLoadIntoMainViewer={(mol) => {
                handleMoleculeGenerated(mol);
                setActiveMainTab('3d-sim');
                setNotification(`반응 역학 모델 [${mol.name}] 구조가 메인 3D 뷰어에 로드되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
            />
          )}

          {activeMainTab === 'isotope-lab' && (
            <IsotopeQuantumLab
              onLoadIntoMainViewer={(mol) => {
                handleMoleculeGenerated(mol);
                setActiveMainTab('3d-sim');
                setNotification(`동위원소 모델 [${mol.name}] 구조가 메인 3D 뷰어에 로드되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
            />
          )}

          {activeMainTab === 'alphafold' && (
            <AlphaFoldLab
              onLoadIntoMainViewer={(mol) => {
                handleMoleculeGenerated(mol);
                setActiveMainTab('3d-sim');
                setNotification(`AlphaFold 표적 [${mol.name}] 구조가 메인 3D 뷰어에 로드되었습니다.`);
                setTimeout(() => setNotification(null), 3500);
              }}
            />
          )}

          {activeMainTab === 'crazy-graphene' && (
            <CrazyAiGrapheneLab
              onLoadIntoMainViewer={(mol) => {
                handleMoleculeGenerated(mol);
                setActiveMainTab('3d-sim');
                setNotification(`🚀 그래핀 스크리닝 후보 [${mol.name}] (${mol.formula}) 구조가 메인 3D 뷰어에 100% 합성 로드되었습니다.`);
                setTimeout(() => setNotification(null), 5000);
              }}
            />
          )}
        </main>

        {/* Right Drawer / Split Panel: Live Quantum Metrics & Quick Inspection */}
        {activeMainTab === '3d-sim' && (
          <aside className="w-80 bg-slate-950/80 border-l border-slate-800/80 hidden xl:flex flex-col shrink-0 overflow-y-auto p-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                실시간 양자 전자 상태 (Live States)
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">VQE 해밀토니안 고유에너지</span>
                <div className="text-sm font-bold font-mono text-cyan-300">
                  {currentMolecule.quantumProperties.groundStateEnergy} Ha
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {(currentMolecule.quantumProperties.groundStateEnergy * 627.509).toFixed(1)} kcal/mol
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">HOMO - LUMO 궤도 갭</span>
                <div className="text-sm font-bold font-mono text-emerald-400">
                  {currentMolecule.quantumProperties.homoLumoGap} eV
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  HOMO: {currentMolecule.quantumProperties.homoEnergy} eV / LUMO: {currentMolecule.quantumProperties.lumoEnergy} eV
                </div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400">QML 잠재 피델리티 (Fidelity)</span>
                <div className="text-sm font-bold font-mono text-indigo-300">
                  {(currentMolecule.quantumProperties.fidelityScore * 100).toFixed(2)}%
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Ansatz: {currentMolecule.quantumCircuitConfig.ansatzType} ({currentMolecule.quantumCircuitConfig.depth} 깊이)
                </div>
              </div>
            </div>

            {/* Selected Atom Details */}
            {selectedAtom ? (
              <div className="bg-cyan-950/30 border border-cyan-500/40 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">
                    선택 원자: {selectedAtom.symbol} (#{selectedAtom.id})
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedAtom.hybridization}</span>
                </div>
                <div className="text-[11px] font-mono space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mulliken 부분 전하:</span>
                    <span className={selectedAtom.charge < 0 ? 'text-red-400' : 'text-blue-400'}>
                      {selectedAtom.charge > 0 ? `+${selectedAtom.charge.toFixed(2)}` : selectedAtom.charge.toFixed(2)} e
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">좌표 (X, Y, Z):</span>
                    <span>{selectedAtom.x.toFixed(2)}, {selectedAtom.y.toFixed(2)}, {selectedAtom.z.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-lg text-center text-xs text-slate-500">
                3D 뷰어에서 원자를 클릭하면 상세 양자 전하와 결합 궤도를 분석할 수 있습니다.
              </div>
            )}

            {/* Quantum Rationale snippet */}
            <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-lg space-y-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-200 block">양자 물리적 설계 타당성</span>
              <p className="line-clamp-4 leading-relaxed">{currentMolecule.quantumRationale}</p>
            </div>

            {/* Quick Action to VQE or Generator */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setActiveMainTab('vqe')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                VQE 수렴 곡선 정밀 계산
              </button>
              <button
                onClick={() => setActiveMainTab('generator')}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Wand2 className="w-3.5 h-3.5" />
                이 골격 기반 신규 분자 추론
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Colab & Cloudflare Tunnel Export Modal */}
      <ColabExportModal
        isOpen={isColabModalOpen}
        onClose={() => setIsColabModalOpen(false)}
      />

      {/* Comprehensive User Manual & Menu Guide Modal */}
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
        onNavigateTab={(tabKey) => {
          setActiveMainTab(tabKey as any);
        }}
      />
    </div>
  );
}
