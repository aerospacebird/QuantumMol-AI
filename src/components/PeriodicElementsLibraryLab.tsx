/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  PERIODIC_ELEMENTS, 
  PeriodicElement, 
  CATEGORY_COLORS, 
  convertElementToMolecule 
} from '../data/periodicTableData';
import { Molecule, Atom } from '../types/quantum';
import { Molecule3DViewer } from './Molecule3DViewer';
import { 
  Layers, 
  Sparkles, 
  Search, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Sliders, 
  Compass, 
  Cpu, 
  Flame, 
  Activity, 
  CheckCircle2, 
  Atom as AtomIcon,
  ChevronRight,
  Filter,
  Eye,
  Maximize2
} from 'lucide-react';

interface PeriodicElementsLibraryLabProps {
  onLoadIntoMainViewer?: (mol: Molecule) => void;
  onOpenVqe?: (mol: Molecule) => void;
  onOpenReactionKinetics?: (mol: Molecule) => void;
}

export const PeriodicElementsLibraryLab: React.FC<PeriodicElementsLibraryLabProps> = ({
  onLoadIntoMainViewer,
  onOpenVqe,
  onOpenReactionKinetics
}) => {
  // Selected element for detailed 3D inspection
  const [selectedNumber, setSelectedNumber] = useState<number>(1); // Default: Hydrogen
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [crystalFilter, setCrystalFilter] = useState<string>('all');

  // Auto-tour (Slideshow) Mode
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [tourSpeedMs, setTourSpeedMs] = useState<number>(2500); // 2.5 seconds per element
  const tourTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Selected element object
  const currentElement: PeriodicElement = useMemo(() => {
    return PERIODIC_ELEMENTS.find(e => e.number === selectedNumber) || PERIODIC_ELEMENTS[0];
  }, [selectedNumber]);

  // Converted molecule model for 3D Viewer
  const currentMolecule: Molecule = useMemo(() => {
    return convertElementToMolecule(currentElement);
  }, [currentElement]);

  // Filtered elements list
  const filteredElements = useMemo(() => {
    return PERIODIC_ELEMENTS.filter(el => {
      // Category filter
      if (categoryFilter !== 'all' && el.category !== categoryFilter) return false;
      // Period filter
      if (periodFilter !== 'all' && el.period.toString() !== periodFilter) return false;
      // Crystal/allotrope filter
      if (crystalFilter !== 'all') {
        const desc = el.allotropeStructure.description.toLowerCase();
        const crys = el.crystalStructure.toLowerCase();
        if (crystalFilter === 'diatomic' && !crys.includes('diatomic') && !desc.includes('이원자')) return false;
        if (crystalFilter === 'bcc' && !crys.includes('bcc') && !crys.includes('체심')) return false;
        if (crystalFilter === 'fcc' && !crys.includes('fcc') && !crys.includes('면심')) return false;
        if (crystalFilter === 'hcp' && !crys.includes('hcp') && !crys.includes('조밀')) return false;
        if (crystalFilter === 'diamond' && !crys.includes('diamond') && !crys.includes('다이아몬드')) return false;
        if (crystalFilter === 'ring' && !desc.includes('고리') && !desc.includes('왕관')) return false;
        if (crystalFilter === 'tetra' && !desc.includes('사면체') && !desc.includes('p4')) return false;
        if (crystalFilter === 'cluster' && !desc.includes('20면체') && !desc.includes('b12')) return false;
        if (crystalFilter === 'noble' && el.category !== 'noble-gas') return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          el.number.toString() === q ||
          el.symbol.toLowerCase().includes(q) ||
          el.name.toLowerCase().includes(q) ||
          el.koreanName.includes(q) ||
          el.crystalStructure.toLowerCase().includes(q) ||
          el.electronConfiguration.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, categoryFilter, periodFilter, crystalFilter]);

  // Handle Auto-Tour cycling
  useEffect(() => {
    if (isAutoTour) {
      tourTimerRef.current = setInterval(() => {
        setSelectedNumber(prev => {
          const next = prev >= 118 ? 1 : prev + 1;
          return next;
        });
      }, tourSpeedMs);
    } else {
      if (tourTimerRef.current) clearInterval(tourTimerRef.current);
    }

    return () => {
      if (tourTimerRef.current) clearInterval(tourTimerRef.current);
    };
  }, [isAutoTour, tourSpeedMs]);

  // Navigate to previous / next element
  const handlePrevElement = () => {
    setSelectedNumber(prev => (prev <= 1 ? 118 : prev - 1));
  };

  const handleNextElement = () => {
    setSelectedNumber(prev => (prev >= 118 ? 1 : prev + 1));
  };

  const catColor = CATEGORY_COLORS[currentElement.category] || CATEGORY_COLORS['nonmetal'];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Header Banner */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 shrink-0 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <AtomIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              주기율표 118종 전원소 분자 라이브러리 &amp; 3D 분자구조 갤러리
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                118 Elements 100% 탑재
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              수소(¹H)부터 오가네손(¹¹⁸Og)까지 전 118개 원소의 고유 3D 원자 클러스터, 결정계 격자, 결합 차수 및 양자 전자구조 시현
            </p>
          </div>
        </div>

        {/* Auto-Tour (Slideshow) Controls & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Auto Tour Button */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setIsAutoTour(!isAutoTour)}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isAutoTour
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
              }`}
              title="전 118개 원소 3D 분자구조를 자동으로 순환 시현합니다."
            >
              {isAutoTour ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoTour ? '자동 순환 정지' : '전원소 3D 자동 순환'}</span>
            </button>

            {isAutoTour && (
              <select
                value={tourSpeedMs}
                onChange={(e) => setTourSpeedMs(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-[10px] text-slate-300 rounded px-1.5 py-0.5 outline-none font-mono"
              >
                <option value={1500}>1.5초</option>
                <option value={2500}>2.5초</option>
                <option value={4000}>4.0초</option>
              </select>
            )}
          </div>

          {/* Load into Main 3D Viewer */}
          {onLoadIntoMainViewer && (
            <button
              onClick={() => onLoadIntoMainViewer(currentMolecule)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="현재 선택된 원소 분자구조를 메인 3D 뷰어로 전송합니다."
            >
              <Compass className="w-3.5 h-3.5" />
              <span>메인 3D 뷰어 로드</span>
            </button>
          )}

          {/* Open VQE Lab */}
          {onOpenVqe && (
            <button
              onClick={() => onOpenVqe(currentMolecule)}
              className="px-2.5 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors hidden sm:flex"
              title="이 원소의 VQE 바닥상태 에너지를 양자 회로로 정밀 계산합니다."
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>VQE 분석</span>
            </button>
          )}

          {/* Open Reaction Kinetics */}
          {onOpenReactionKinetics && (
            <button
              onClick={() => onOpenReactionKinetics(currentMolecule)}
              className="px-2.5 py-1.5 bg-amber-600/80 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors hidden md:flex"
              title="반응 역학 실험실에서 고온/고압 반응성을 시뮬레이션합니다."
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>반응역학</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dual-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Element Gallery / Selector Grid (48% width) */}
        <div className="w-[48%] border-r border-slate-800/80 flex flex-col bg-slate-950/70 shrink-0 overflow-hidden">
          {/* Search & Quick Filter Bar */}
          <div className="p-3 border-b border-slate-800 space-y-2.5 bg-slate-950">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="원소기호, 원자번호, 한국어명 검색 (예: 79, Au, 금, Ti, 탄소, Fe)..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none transition-colors"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2 py-1 outline-none text-xs"
              >
                <option value="all">전체 계열 (118종)</option>
                <option value="nonmetal">비금속 (Nonmetal)</option>
                <option value="noble-gas">비활성 기체 (Noble Gas)</option>
                <option value="alkali-metal">알칼리 금속 (Alkali)</option>
                <option value="alkaline-earth">알칼리토금속 (Alkaline Earth)</option>
                <option value="metalloid">준금속 (Metalloid)</option>
                <option value="halogen">할로겐 (Halogen)</option>
                <option value="transition-metal">전이 금속 (Transition)</option>
                <option value="post-transition">전이후 금속 (Post-trans)</option>
                <option value="lanthanide">란타넘족 희토류 (57~71)</option>
                <option value="actinide">악티늄족 방사성 (89~103)</option>
              </select>

              {/* Period Filter */}
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2 py-1 outline-none text-xs"
              >
                <option value="all">전 주기 (1P~7P)</option>
                <option value="1">1주기 (H, He)</option>
                <option value="2">2주기 (Li ~ Ne)</option>
                <option value="3">3주기 (Na ~ Ar)</option>
                <option value="4">4주기 (K ~ Kr)</option>
                <option value="5">5주기 (Rb ~ Xe)</option>
                <option value="6">6주기 (Cs ~ Rn)</option>
                <option value="7">7주기 (Fr ~ Og 초중원소)</option>
              </select>

              {/* Crystal / Allotrope Structure Filter */}
              <select
                value={crystalFilter}
                onChange={(e) => setCrystalFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2 py-1 outline-none text-xs"
              >
                <option value="all">전 결정/분자 격자</option>
                <option value="diatomic">이원자 분자 (Diatomic)</option>
                <option value="bcc">체심입방 (BCC)</option>
                <option value="fcc">면심입방 (FCC)</option>
                <option value="hcp">조밀육방 (HCP)</option>
                <option value="diamond">다이아몬드 사면체</option>
                <option value="ring">고리형 분자 (S8 등)</option>
                <option value="tetra">사면체 분자 (P4 등)</option>
                <option value="cluster">20면체 바구니 (B12)</option>
                <option value="noble">8면체 배위/비활성</option>
              </select>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-800/60">
              <span>필터링된 원소: <strong className="text-emerald-400 font-bold">{filteredElements.length}</strong> / 118종</span>
              <span className="text-cyan-400">클릭 즉시 우측 3D 분자구조 시현</span>
            </div>
          </div>

          {/* Scrollable Element Cards Grid */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
            {filteredElements.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                검색 조건에 일치하는 원소가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {filteredElements.map((el) => {
                  const isSelected = el.number === currentElement.number;
                  const itemColor = CATEGORY_COLORS[el.category] || CATEGORY_COLORS['nonmetal'];

                  return (
                    <button
                      key={el.number}
                      onClick={() => {
                        setSelectedNumber(el.number);
                        setIsAutoTour(false);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all relative flex flex-col justify-between h-[84px] group ${
                        isSelected
                          ? 'bg-emerald-950/80 border-emerald-400 shadow-md shadow-emerald-950 ring-2 ring-emerald-500/40 z-10'
                          : `${itemColor.bg} ${itemColor.border} hover:border-slate-500 hover:bg-slate-900/60`
                      }`}
                    >
                      {/* Top Bar: Number & Period */}
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">#{el.number}</span>
                        <span className="text-[9px] font-mono text-slate-500">{el.period}P · {el.group}G</span>
                      </div>

                      {/* Center: Symbol & Korean Name */}
                      <div className="text-center my-0.5">
                        <span className="text-lg font-black tracking-tight text-slate-100 block leading-tight">
                          {el.symbol}
                        </span>
                        <span className="text-[10px] text-slate-300 font-semibold block truncate">
                          {el.koreanName}
                        </span>
                      </div>

                      {/* Bottom Bar: Lattice Type & Atom Count */}
                      <div className="flex items-center justify-between w-full text-[8.5px] font-mono text-slate-400 border-t border-slate-800/60 pt-0.5">
                        <span className="truncate max-w-[70px]" title={el.crystalStructure}>
                          {el.crystalStructure.split(' ')[0]}
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          {el.allotropeStructure.atoms.length}원자
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Navigator Footer */}
          <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              onClick={handlePrevElement}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 font-mono transition-colors text-[11px]"
            >
              <SkipBack className="w-3 h-3" /> 이전 원소
            </button>
            <span className="text-[11px] font-mono text-slate-300">
              선택: <strong className="text-emerald-400 font-bold">#{currentElement.number} {currentElement.symbol}</strong> ({currentElement.koreanName})
            </span>
            <button
              onClick={handleNextElement}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 font-mono transition-colors text-[11px]"
            >
              다음 원소 <SkipForward className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Side: Interactive 3D Molecular Simulation Viewport & Comprehensive Metrics (52% width) */}
        <div className="w-[52%] flex flex-col p-3 space-y-3 overflow-y-auto bg-slate-950">
          {/* Selected Element Overview Card */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-base font-black font-mono shadow-sm">
                    {currentElement.symbol}
                  </span>
                  <div>
                    <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                      {currentElement.name}
                      <span className="text-sm font-semibold text-emerald-300">
                        ({currentElement.koreanName}, 원자번호 {currentElement.number}번)
                      </span>
                    </h3>
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                      <span>{currentElement.period}주기 · {currentElement.group}족</span>
                      <span>·</span>
                      <span className={`px-1.5 py-0.2 rounded border text-[10px] font-mono ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                        {currentElement.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Dropdown */}
              <div className="flex items-center gap-1.5">
                <select
                  value={currentElement.number}
                  onChange={(e) => {
                    setSelectedNumber(Number(e.target.value));
                    setIsAutoTour(false);
                  }}
                  className="bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono outline-none focus:border-emerald-500"
                >
                  {PERIODIC_ELEMENTS.map(el => (
                    <option key={el.number} value={el.number}>
                      #{el.number} {el.symbol} - {el.koreanName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              {currentElement.description}
            </p>
          </div>

          {/* Interactive 3D Molecular / Crystal Cluster Viewport */}
          <div className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
            {/* Viewport Header */}
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                3D 원소 분자/결정 구조 모델링 ({currentMolecule.formula})
              </span>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="text-emerald-300 font-bold">{currentMolecule.atoms.length}개 원자</span>
                <span>·</span>
                <span className="text-cyan-300 font-bold">{currentMolecule.bonds.length}개 결합</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  {currentElement.crystalStructure}
                </span>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="h-[320px] relative bg-slate-950/70">
              <Molecule3DViewer molecule={currentMolecule} />
              
              {/* Bottom Structure Caption */}
              <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[9px] font-mono bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/80 text-slate-300">
                <span className="text-slate-400">결정/분자계:</span>
                <span className="text-cyan-300 font-bold">{currentElement.crystalStructure}</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-300 font-bold">{currentElement.allotropeStructure.description}</span>
              </div>
            </div>
          </div>

          {/* Comprehensive Quantum & Physical Properties Matrix */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              양자 화학 &amp; 원소 물성 데이터 매트릭스
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">원자량 (Atomic Mass)</span>
                <span className="text-slate-200 font-bold">{currentElement.atomicMass.toFixed(3)} u</span>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">전기음성도 (Pauling)</span>
                <span className="text-cyan-300 font-bold">{currentElement.electronegativity ?? '비활성 (N/A)'}</span>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">바닥상태 에너지 (E_0)</span>
                <span className="text-emerald-400 font-bold">{currentElement.groundStateEnergyHa.toFixed(3)} Ha</span>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">1차 이온화 에너지</span>
                <span className="text-purple-300 font-bold">{currentElement.ionizationEnergyEV.toFixed(2)} eV</span>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">전자 배치 (Configuration)</span>
                <span className="text-amber-300 font-bold text-[11px] truncate block" title={currentElement.electronConfiguration}>
                  {currentElement.electronConfiguration}
                </span>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">원자가 전자수 (Valence)</span>
                <span className="text-slate-200 font-bold">{currentElement.valenceElectrons}개 전자</span>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">가능 산화수 (Oxidation)</span>
                <span className="text-cyan-400 font-bold">{currentElement.oxidationStates.join(', ')}</span>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                <span className="text-[10px] text-slate-500 block">필요 양자 큐비트 (QPU)</span>
                <span className="text-indigo-400 font-bold">{currentMolecule.quantumProperties.qubitsRequired} Qubits</span>
              </div>
            </div>
          </div>

          {/* Atom Coordinates & Bonding Table */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                원자 좌표 및 결합 벡터 상세 ({currentMolecule.atoms.length}개 원자, {currentMolecule.bonds.length}개 결합)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                기저함수: STO-3G / Jordan-Wigner 매핑
              </span>
            </span>

            <div className="max-h-[140px] overflow-y-auto scrollbar-thin rounded-lg border border-slate-800/80 bg-slate-950 text-[10px] font-mono">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="p-1.5">ID</th>
                    <th className="p-1.5">원소</th>
                    <th className="p-1.5">X (Å)</th>
                    <th className="p-1.5">Y (Å)</th>
                    <th className="p-1.5">Z (Å)</th>
                    <th className="p-1.5">궤도함수</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {currentMolecule.atoms.map((atom) => (
                    <tr key={atom.id} className="hover:bg-slate-900/40">
                      <td className="p-1.5 text-slate-500">#{atom.id}</td>
                      <td className="p-1.5 font-bold text-emerald-400">{atom.symbol}</td>
                      <td className="p-1.5">{atom.x.toFixed(3)}</td>
                      <td className="p-1.5">{atom.y.toFixed(3)}</td>
                      <td className="p-1.5">{atom.z.toFixed(3)}</td>
                      <td className="p-1.5 text-cyan-300">{atom.hybridization || 's/p/d'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
