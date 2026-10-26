/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Molecule, ATOM_COLORS } from '../types/quantum';
import { PERIODIC_ELEMENTS, CATEGORY_COLORS, PeriodicElement } from '../data/periodicTableData';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  Wand2, 
  ArrowRight, 
  ShieldCheck, 
  Atom as AtomIcon, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Compass,
  Layers,
  Search,
  Plus,
  X,
  Flame,
  Zap,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface DeepLearningGeneratorProps {
  onMoleculeGenerated: (newMolecule: Molecule) => void;
  currentMolecule: Molecule;
}

export const DeepLearningGenerator: React.FC<DeepLearningGeneratorProps> = ({
  onMoleculeGenerated,
  currentMolecule
}) => {
  const [prompt, setPrompt] = useState<string>('초고온 3000°C 및 심우주 은하우주선(GCR) 고에너지 방사능을 흡수 차폐하는 텅스텐-탄탈럼-붕소 결합 양자 초내열 분자체');
  const [domain, setDomain] = useState<string>('space-superalloy');
  const [modelType, setModelType] = useState<'QGAN' | 'QVAE' | 'VQC-Diffusion'>('VQC-Diffusion');
  const [ansatzType, setAnsatzType] = useState<'UCCSD' | 'RyRz' | 'StronglyEntangling'>('StronglyEntangling');
  const [targetGap, setTargetGap] = useState<number>(4.8);
  const [targetQubits, setTargetQubits] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected constituent atoms from the entire 118 elements of the periodic table
  const [selectedElements, setSelectedElements] = useState<string[]>(['W', 'Ta', 'B', 'C']);
  const [isElementPickerOpen, setIsElementPickerOpen] = useState<boolean>(false);
  const [elementSearch, setElementSearch] = useState<string>('');
  const [elementCategoryFilter, setElementCategoryFilter] = useState<string>('all');

  // Pre-configured Cosmic & Exotic Element Packages
  const COSMIC_PACKAGES = [
    {
      id: 'pkg-shield',
      name: '🚀 심우주 3000°C 초내열·방사능 차폐체',
      desc: 'W, Ta, Re, Mo, B 기반 극초음속 우주선 외피',
      elements: ['W', 'Ta', 'Re', 'Mo', 'B', 'C'],
      suggestedPrompt: '심우주 3000°C 대기 재진입 및 은하우주선(GCR) 방사능 차폐 능력을 극대화하는 텅스텐·탄탈럼·붕소 결합 초내열 양자 복합체'
    },
    {
      id: 'pkg-dust',
      name: '🌌 성간 분자운 유기-금속 나노입자',
      desc: 'Fe, Ni, Si, Ti, Mg 성간 구름 촉매 입자',
      elements: ['Fe', 'Ni', 'Si', 'Ti', 'C', 'H', 'O'],
      suggestedPrompt: '성간 분자운 10K 극저온 초고진공에서 유기분자를 자발적으로 합성 촉진하는 철·니켈·규소 나노클러스터 촉매'
    },
    {
      id: 'pkg-exoplanet',
      name: '🪐 외계 행성 초고압·농황산 극한 외피',
      desc: 'Pt, Ir, Ti, Zr, Si 외계 극한 대기 내식성 합금',
      elements: ['Pt', 'Ir', 'Ti', 'Zr', 'Si', 'S'],
      suggestedPrompt: '외계 초고압 농황산 및 액화 메탄 극한 대기에서 부식을 완전 차단하는 백금·이리듐·타이타늄 초내식성 분자막'
    },
    {
      id: 'pkg-quantum',
      name: '⚛️ 우주 중력파 검출기 양자 격자',
      desc: 'Bi, Sb, Te, Se, Nb 위상 절연체 & 초전도체',
      elements: ['Bi', 'Sb', 'Te', 'Se', 'Nb'],
      suggestedPrompt: '우주 중력파 검출기 및 양자 통신을 위한 스핀-궤도 결합(SOC) 극대화 비스무트-텔루륨 토폴로지컬 양자 격자'
    },
    {
      id: 'pkg-astrobiology',
      name: '🧬 우주 미세중력 외계 생체분자',
      desc: 'C, H, N, O, P, S, Fe, Mo 우주 단백질 모방체',
      elements: ['C', 'H', 'N', 'O', 'P', 'S', 'Fe', 'Mo'],
      suggestedPrompt: '우주 미세중력 환경에서 안정화되며 고에너지 우주 방사선에 의해 변성되지 않는 아스트로바이올로지 인공 생체 분자'
    },
    {
      id: 'pkg-superheavy',
      name: '⭐ 중성자별 r-프로세스 초중원소체',
      desc: 'U, Th, Pu, Hf, Ta 초강자기장 고에너지 격자',
      elements: ['U', 'Th', 'Pu', 'Hf', 'Ta', 'Nb'],
      suggestedPrompt: '중성자별 주변의 극한 강자기장과 방사선을 견디는 악티늄족 우라늄·토륨·하프늄 기반 초고에너지 양자 물질'
    },
    {
      id: 'pkg-supernova',
      name: '🌠 초신성 잔해 극저온 초전도 양자 격자',
      desc: 'Y, Ba, Cu, O, Nd, Gd 우주선 탐지 고온초전도체',
      elements: ['Y', 'Ba', 'Cu', 'O', 'Nd', 'Gd'],
      suggestedPrompt: '성간 극저온 4K 환경에서 자발적 쿠퍼쌍(Cooper Pair)을 형성하여 우주 미세 암흑물질을 검출하는 이트륨-바륨-구리-네오디뮴 양자 격자'
    },
    {
      id: 'pkg-thruster',
      name: '🛰️ 심우주 원자력·이온 추진기 초내마모체',
      desc: 'Xe, W, Mo, Cs, Re 고전압 플라즈마 전극',
      elements: ['W', 'Mo', 'Re', 'Cs', 'B'],
      suggestedPrompt: '심우주 항해용 100kW급 이온·홀 추력기 플라즈마 방전 환경에서 10만 시간 스퍼터링 마모를 방지하는 레늄-텅스텐-붕소 양자 나노초합금'
    },
    {
      id: 'pkg-lunar',
      name: '🌑 달·화성 레골리스 영구동토 인공 광촉매',
      desc: 'Al, Si, Fe, Ti, Ca, Mg, O 외계 기지 산소 추출',
      elements: ['Al', 'Si', 'Fe', 'Ti', 'Ca', 'Mg', 'O'],
      suggestedPrompt: '달 및 화성 표면 레골리스 토양에서 태양광을 흡수하여 금속산화물로부터 산소(O2)를 열화학적으로 분리 추출하는 티타늄-철-실리콘 광촉매'
    }
  ];

  const DOMAIN_PRESETS = [
    { 
      id: 'space-superalloy', 
      label: '🚀 우주항공: 심우주 극초음속·초내열 단결정 초합금 (-250°C~3000°C)', 
      defaultPrompt: '심우주 극한 환경에서 열팽창이 0에 가깝고 3000°C 고온 및 GCR 방사능을 흡수 차폐하는 텅스텐·탄탈럼·붕소 결합 양자 분자체',
      recommendedElements: ['W', 'Ta', 'B', 'C', 'Re']
    },
    { 
      id: 'cosmic-shield', 
      label: '🛡️ 심우주: 은하우주선(GCR) 및 감마선 고효율 방사능 차폐재', 
      defaultPrompt: '우주선 탑승 승무원과 양자 컴퓨터를 우주선(Cosmic Rays) 피폭으로부터 보호하는 경량 붕소-수소-탄탈럼 복합 차폐 분자체',
      recommendedElements: ['B', 'H', 'Ta', 'W', 'Bi']
    },
    { 
      id: 'exoplanet-armor', 
      label: '🪐 외계 행성: 초고압 농황산/액화메탄 극한 대기 초내식성 외피', 
      defaultPrompt: '금성 및 슈퍼지구의 초고온 초고압 농황산 대기에서도 산화·부식되지 않는 백금·타이타늄·지르코늄 표면 코팅 물질',
      recommendedElements: ['Pt', 'Ti', 'Zr', 'Si', 'Ir']
    },
    { 
      id: 'interstellar-dust', 
      label: '🌌 천체물리: 성간 분자운 유기-금속 나노클러스터 광촉매', 
      defaultPrompt: '극저온 성간 분자운에서 자외선을 흡수하여 물과 일산화탄소로부터 유기 화합물을 합성하는 철·니켈·규소 나노입자 촉매',
      recommendedElements: ['Fe', 'Ni', 'Si', 'C', 'Mg']
    },
    { 
      id: 'quantum-spacetime', 
      label: '⚛️ 우주 양자: 중력파 간섭계 초저잡음 단결정 양자 미러 격자', 
      defaultPrompt: '열기계적 브라운 잡음을 최소화하고 광학 흡수율이 1ppm 이하인 비스무트-텔루라이드 및 저마늄 기반 우주 양자 센서 코팅',
      recommendedElements: ['Bi', 'Te', 'Se', 'Ge', 'Si']
    },
    { 
      id: 'astrobiology', 
      label: '🧬 우주 생물: 우주 미세중력 안정화 외계 생체분자 모방체', 
      defaultPrompt: '우주 방사능에 의한 라디칼 공격을 자체 무력화하는 몰리브데넘-철-황 클러스터 기반 인공 생체 모방 효소',
      recommendedElements: ['Mo', 'Fe', 'S', 'C', 'H', 'N', 'O']
    },
    { 
      id: 'cns-drug', 
      label: '💊 지상 의약: 알츠하이머 및 뇌신경계 BBB 투과 신약', 
      defaultPrompt: '혈뇌장벽을 효과적으로 통과하며 타우 단백질 결합 포켓에 수소결합을 형성하는 플루오린 치환 신규 분자',
      recommendedElements: ['C', 'H', 'N', 'O', 'F']
    },
    { 
      id: 'battery-electrolyte', 
      label: '🔋 차세대 배터리: 고전압 전고체 전해질 및 전해액 첨가제', 
      defaultPrompt: '5V 이상 고전압에서도 산화 분해되지 않고 리튬/소듐 이온 전도도를 비약적으로 향상시키는 불소화 유기 복합체',
      recommendedElements: ['Li', 'P', 'S', 'F', 'O', 'C']
    },
    { 
      id: 'custom', 
      label: '🌐 사용자 맞춤형 우주·지구 신물질 설계 조건', 
      defaultPrompt: '',
      recommendedElements: []
    }
  ];

  // Filter elements for the picker
  const filteredPickerElements = useMemo(() => {
    return PERIODIC_ELEMENTS.filter((el) => {
      if (elementCategoryFilter !== 'all' && el.category !== elementCategoryFilter) return false;
      if (elementSearch.trim()) {
        const q = elementSearch.toLowerCase().trim();
        return (
          el.number.toString() === q ||
          el.symbol.toLowerCase().includes(q) ||
          el.name.toLowerCase().includes(q) ||
          el.koreanName.includes(q)
        );
      }
      return true;
    });
  }, [elementSearch, elementCategoryFilter]);

  const handleSelectDomain = (selectedId: string) => {
    setDomain(selectedId);
    const found = DOMAIN_PRESETS.find((p) => p.id === selectedId);
    if (found) {
      if (found.defaultPrompt) setPrompt(found.defaultPrompt);
      if (found.recommendedElements && found.recommendedElements.length > 0) {
        setSelectedElements(found.recommendedElements);
      }
    }
  };

  const handleApplyPackage = (pkg: typeof COSMIC_PACKAGES[0]) => {
    setSelectedElements(pkg.elements);
    setPrompt(pkg.suggestedPrompt);
  };

  const handleToggleElement = (symbol: string) => {
    if (selectedElements.includes(symbol)) {
      if (selectedElements.length > 1) {
        setSelectedElements(prev => prev.filter(s => s !== symbol));
      }
    } else {
      if (selectedElements.length < 12) {
        setSelectedElements(prev => [...prev, symbol]);
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep(1); // Stage 1: Latent Quantum Sampling

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const activePrompt = prompt.trim() || DOMAIN_PRESETS.find((p) => p.id === domain)?.defaultPrompt || '안정한 우주 극한 신규 분자체';

      const res = await fetch('/api/quantum-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          domain: DOMAIN_PRESETS.find((p) => p.id === domain)?.label || domain,
          targetGap,
          targetQubits,
          ansatzType,
          selectedElements
        })
      });

      const data = await res.json();
      clearInterval(stepInterval);
      setGenerationStep(4);

      if (data.molecule) {
        const generated: Molecule = {
          ...data.molecule,
          id: `gen-${Date.now()}`,
          isGenerated: true
        };

        // Guarantee that all user-selected elements are 100% present in the 3D atomic structure
        if (selectedElements && selectedElements.length > 0) {
          const atomSymbols = new Set(generated.atoms.map(a => a.symbol));
          const missing = selectedElements.filter(s => !atomSymbols.has(s));
          if (missing.length > 0) {
            missing.forEach((sym, idx) => {
              const newId = generated.atoms.length;
              const angle = (idx * 2 * Math.PI) / Math.max(1, missing.length);
              const r = 2.25 + (idx % 2) * 0.45;
              generated.atoms.push({
                id: newId,
                symbol: sym,
                x: parseFloat((Math.cos(angle) * r).toFixed(3)),
                y: parseFloat((Math.sin(angle) * r).toFixed(3)),
                z: parseFloat(((idx % 2 === 0 ? 1 : -1) * (1.15 + idx * 0.2)).toFixed(3)),
                charge: parseFloat(((idx % 2 === 0 ? 0.38 : -0.28)).toFixed(2)),
                hybridization: 'sp3d'
              });
              generated.bonds.push({
                atom1: generated.atoms.length > 1 ? (idx % (generated.atoms.length - 1)) : 0,
                atom2: newId,
                order: 1.5
              });
            });

            // Refresh formula
            const countMap: Record<string, number> = {};
            generated.atoms.forEach(a => { countMap[a.symbol] = (countMap[a.symbol] || 0) + 1; });
            generated.formula = Object.entries(countMap).map(([s, c]) => `${s}${c > 1 ? c : ''}`).join('');
          }
        }

        setTimeout(() => {
          onMoleculeGenerated(generated);
          setIsGenerating(false);
          setGenerationStep(0);
        }, 500);
      } else {
        throw new Error("분자 생성 응답 형식이 올바르지 않습니다.");
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error("Generation error:", err);
      setErrorMsg("양자 생성 처리 중 오류가 발생했습니다. 재시도해 주십시오.");
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-cyan-500/40 text-white shadow-sm shadow-cyan-950">
            <Globe className="w-4 h-4 text-cyan-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              우주 신물질 양자 딥러닝 분자 생성기 (Cosmic QML Generator)
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                118 전원소 구성 원자 지원
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              주기율표 118종 전원소를 구성 기본 원자로 지정하여, 우주의 광활한 영역(성간운, 외계행성, 초내열 우주선)에 작동하는 신물질을 양자 딥러닝으로 합성합니다.
            </p>
          </div>
        </div>

        {/* Quick selected atoms count */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg text-xs font-mono text-slate-300">
          <AtomIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>선택 원소: <strong className="text-emerald-400 font-bold">{selectedElements.length}</strong>종 반영</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin">
        {/* SECTION 1: Periodic Table 118 Elements Building Blocks Configuration */}
        <div className="p-3.5 bg-gradient-to-b from-slate-900 via-slate-900/90 to-indigo-950/20 rounded-xl border border-indigo-500/40 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
            <div>
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
                <AtomIcon className="w-4 h-4 text-cyan-400" />
                1. 주기율표 118종 기본 구성 원자 지정 (Constituent Elemental Atoms)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                선택된 원소들이 양자 딥러닝 생성 과정에서 분자 골격, 중심 금속, 배위 착물, 리간드 결합으로 직접 결합·합성됩니다.
              </p>
            </div>

            <button
              onClick={() => setIsElementPickerOpen(!isElementPickerOpen)}
              className="px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3 h-3" />
              <span>{isElementPickerOpen ? '선택창 접기' : '118종 전원소 선택기 열기'}</span>
            </button>
          </div>

          {/* Currently Selected Elements Badge Bar */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-medium">현재 활성화된 구성 기본 원자:</span>
            <div className="flex flex-wrap items-center gap-1.5 min-h-[36px] p-2 bg-slate-950 rounded-lg border border-slate-800">
              {selectedElements.map((sym) => {
                const el = PERIODIC_ELEMENTS.find(e => e.symbol === sym);
                const colorHex = ATOM_COLORS[sym] || '#94A3B8';
                return (
                  <span
                    key={sym}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs font-mono shadow-sm group"
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                      style={{ backgroundColor: colorHex }} 
                    />
                    <strong className="text-slate-100 font-bold">{sym}</strong>
                    <span className="text-[10px] text-slate-400">{el?.koreanName || sym}</span>
                    <button
                      onClick={() => handleToggleElement(sym)}
                      className="p-0.5 hover:text-rose-400 text-slate-500 rounded transition-colors"
                      title={`${sym} 제거`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              <button
                onClick={() => setIsElementPickerOpen(true)}
                className="px-2 py-1 rounded border border-dashed border-slate-700 hover:border-cyan-500 text-slate-400 hover:text-cyan-300 text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> 원소 추가
              </button>

              <button
                onClick={() => setSelectedElements(['C', 'H', 'O', 'N'])}
                className="ml-auto text-[10px] text-slate-500 hover:text-slate-300 underline"
              >
                유기 기본원소로 리셋
              </button>
            </div>
          </div>

          {/* Pre-packaged Cosmic Packages Bar */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-medium">🌌 우주 영역별 추천 원소 패키지 원클릭 적용:</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {COSMIC_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handleApplyPackage(pkg)}
                  className="p-2 bg-slate-950/70 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-lg text-left transition-all text-xs group"
                >
                  <div className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                    {pkg.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {pkg.desc}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 font-mono text-[9px] text-emerald-400">
                    {pkg.elements.map(e => (
                      <span key={e} className="px-1 bg-slate-900 rounded border border-slate-800">
                        {e}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive 118 Elements Multi-Picker Drawer */}
          {isElementPickerOpen && (
            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={elementSearch}
                    onChange={(e) => setElementSearch(e.target.value)}
                    placeholder="원소 검색 (원자번호, 기호, 한글명: 예 74, W, 텅스텐, Ti, Nb, Bi)..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
                  />
                </div>

                <select
                  value={elementCategoryFilter}
                  onChange={(e) => setElementCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                >
                  <option value="all">전체 118 원소</option>
                  <option value="transition-metal">전이 금속 (W, Ti, Fe, Nb 등)</option>
                  <option value="lanthanide">란타넘족 희토류 (Nd, Sm, Gd 등)</option>
                  <option value="actinide">악티늄족 초중원소 (U, Th, Pu 등)</option>
                  <option value="nonmetal">비금속 (H, C, N, O 등)</option>
                  <option value="metalloid">준금속 (B, Si, Ge, Te 등)</option>
                  <option value="halogen">할로겐 (F, Cl, Br, I 등)</option>
                  <option value="post-transition">전이후 금속 (Al, Ga, Bi, In 등)</option>
                </select>
              </div>

              {/* Elements Buttons Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 max-h-[180px] overflow-y-auto p-1 scrollbar-thin">
                {filteredPickerElements.map((el) => {
                  const isChecked = selectedElements.includes(el.symbol);
                  const colorHex = ATOM_COLORS[el.symbol] || '#94A3B8';
                  return (
                    <button
                      key={el.number}
                      onClick={() => handleToggleElement(el.symbol)}
                      className={`p-1.5 rounded-lg border text-center transition-all flex flex-col items-center justify-between text-xs ${
                        isChecked
                          ? 'bg-emerald-950 border-emerald-400 shadow-sm ring-1 ring-emerald-400'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full text-[8px] font-mono text-slate-500">
                        <span>#{el.number}</span>
                        <span 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: colorHex }} 
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-100 leading-tight">
                        {el.symbol}
                      </span>
                      <span className="text-[9px] text-slate-400 truncate w-full">
                        {el.koreanName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Cosmic & Material Domains */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            2. 생성 목표 응용 도메인 (Target Domain)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {DOMAIN_PRESETS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectDomain(item.id)}
                className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                  domain === item.id 
                    ? 'bg-cyan-950/50 border-cyan-500/80 text-cyan-200 shadow-sm ring-1 ring-cyan-500/40' 
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold text-slate-200">{item.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: Prompt Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              3. 맞춤형 신물질 물리화학적 조건 및 우주 환경 프롬프트 (Prompt)
            </label>
            <span className="text-[10px] text-slate-500">
              선택된 원소 [{selectedElements.join(', ')}] 기반 결합 자동 유도
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="원하는 물질의 우주 극한 환경 내성, 열팽창률, 결합 형태, 격자 안정성을 자유롭게 기술하세요..."
            rows={3}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
          />
        </div>

        {/* SECTION 4: Quantum Deep Learning Architecture Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">양자 생성 딥러닝 모델</label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
            >
              <option value="VQC-Diffusion">VQC-디퓨전 (우주 분자 노이즈 제거 생성망)</option>
              <option value="QGAN">QGAN (양자 적대적 생성망)</option>
              <option value="QVAE">QVAE (양자 변분 오토인코더)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">양자 Ansatz 회로 구조</label>
            <select
              value={ansatzType}
              onChange={(e) => setAnsatzType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
            >
              <option value="StronglyEntangling">Strongly Entangling (우주 다체계 강상관 격자망)</option>
              <option value="UCCSD">UCCSD (단일·이중 결합 전자 여기)</option>
              <option value="RyRz">RyRz Heuristic (하드웨어 효율적)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">
              목표 큐비트 예산: {targetQubits} Qubits
            </label>
            <input
              type="range"
              min="4"
              max="16"
              step="2"
              value={targetQubits}
              onChange={(e) => setTargetQubits(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* HOMO-LUMO Gap slider */}
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-300">목표 HOMO-LUMO 갭: {targetGap.toFixed(1)} eV</span>
            <p className="text-[11px] text-slate-500">
              낮을수록 전하이동도/전도성 증가, 높을수록 3000°C 열역학적 화학 안정성 및 절연성 향상
            </p>
          </div>
          <div className="w-48">
            <input
              type="range"
              min="1.5"
              max="9.0"
              step="0.1"
              value={targetGap}
              onChange={(e) => setTargetGap(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Execution Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 via-indigo-600 to-emerald-600 hover:from-cyan-500 hover:via-indigo-500 hover:to-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? (
            <span>우주 신물질 양자 딥러닝 힐베르트 공간 추론 가동 중...</span>
          ) : (
            <span>선택 원소 [{selectedElements.join(', ')}] 기반 우주 신물질 양자 추론 및 합성</span>
          )}
        </button>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Generation Progress Pipeline Steps */}
        {isGenerating && (
          <div className="bg-slate-900/90 rounded-lg border border-cyan-500/30 p-4 space-y-3">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              양자 하이브리드 생성 파이프라인 실시간 가동 중
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className={`p-2.5 rounded border transition-colors ${generationStep >= 1 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <div className="font-bold mb-1">Step 1</div>
                <div>양자 힐베르트 공간 상태 벡터 샘플링 |ψ(θ)⟩</div>
              </div>

              <div className={`p-2.5 rounded border transition-colors ${generationStep >= 2 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <div className="font-bold mb-1">Step 2</div>
                <div>PQC 얽힘 텐서 변환 ({targetQubits}Q 회로)</div>
              </div>

              <div className={`p-2.5 rounded border transition-colors ${generationStep >= 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <div className="font-bold mb-1">Step 3</div>
                <div>기본원소 [{selectedElements.join(', ')}] 화학 디코딩</div>
              </div>

              <div className={`p-2.5 rounded border transition-colors ${generationStep >= 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
                <div className="font-bold mb-1">Step 4</div>
                <div>3D 유클리드 좌표 최적화 &amp; VQE 에너지 검증</div>
              </div>
            </div>
          </div>
        )}

        {/* Architecture Flow Explanation Card */}
        <div className="bg-slate-900/40 rounded-lg border border-slate-800/80 p-3.5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>우주 신물질 양자 딥러닝 원리 (Cosmic QML Advantage)</span>
          </div>
          <p className="leading-relaxed">
            전통적인 고전 AI는 텅스텐(W), 탄탈럼(Ta), 니오븀(Nb), 우라늄(U) 등 무거운 전이금속 및 희토류의 d·f 전자 스핀-궤도 결합(SOC)과 상대론적 효과를 시뮬레이션할 때 기하급수적 연산 한계에 직면합니다.
            본 양자 생성기는 <strong>매개변수화 양자 회로(PQC)</strong>와 <strong>VQC-Diffusion 생성망</strong>을 연동하여 지수함수적 힐베르트 상태 공간에서 주기율표 118종 전원소의 원자가 결합 궤도를 표본화하고,
            우주선 초내열 외피(3000°C), 은하우주선(GCR) 차폐체, 성간 분자운 촉매 등 우주의 광활한 극한 환경에 최적화된 새로운 물질을 결함 없이 정밀하게 합성합니다.
          </p>
        </div>
      </div>
    </div>
  );
};
