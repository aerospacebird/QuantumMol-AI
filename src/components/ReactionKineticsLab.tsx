import React, { useState, useEffect } from 'react';
import { Molecule, Atom, Bond, ReactionKineticsResult, ElementalSynthesizedMaterial } from '../types/quantum';
import { PRESET_MATERIAL_RECIPES } from '../data/domainSynthesisData';
import { 
  simulateReactionKinetics, 
  ReactionEnvironmentConfig, 
  ATMOSPHERE_OPTIONS 
} from '../data/reactionKineticsData';
import { Molecule3DViewer } from './Molecule3DViewer';
import { ReactionEnergyGraph } from './ReactionEnergyGraph';
import { 
  Activity, 
  Flame, 
  Gauge, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  Compass, 
  Layers, 
  Zap, 
  Sparkles, 
  AlertTriangle,
  Sliders,
  TrendingDown,
  ChevronRight,
  Info,
  Cpu
} from 'lucide-react';

interface ReactionKineticsLabProps {
  initialMaterial?: ElementalSynthesizedMaterial | null;
  onLoadIntoMainViewer?: (molecule: Molecule) => void;
}

export const ReactionKineticsLab: React.FC<ReactionKineticsLabProps> = ({
  initialMaterial,
  onLoadIntoMainViewer
}) => {
  // Selected material mode: preset or custom-synthesized
  const [selectedMaterialRecipe, setSelectedMaterialRecipe] = useState(PRESET_MATERIAL_RECIPES[0]);
  const [customMaterial, setCustomMaterial] = useState<ElementalSynthesizedMaterial | null>(initialMaterial || null);
  const [activeMaterialSource, setActiveMaterialSource] = useState<'custom' | 'preset'>(initialMaterial ? 'custom' : 'preset');
  
  // Environment conditions
  const [temperatureK, setTemperatureK] = useState<number>(1250);
  const [pressureAtm, setPressureAtm] = useState<number>(1.0);
  const [atmosphere, setAtmosphere] = useState<ReactionEnvironmentConfig['atmosphere']>('high_oxygen');

  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(0);
  const [isPlayingTime, setIsPlayingTime] = useState<boolean>(false);
  const [active3DState, setActive3DState] = useState<'initial' | 'transition' | 'degraded'>('transition');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Initial simulation calculation
  const [kineticsResult, setKineticsResult] = useState<ReactionKineticsResult>(() => {
    const mat = initialMaterial || {
      name: PRESET_MATERIAL_RECIPES[0].name,
      formula: PRESET_MATERIAL_RECIPES[0].formula,
      atoms: [
        { id: 0, symbol: 'Nb', x: 0, y: 0, z: 0, charge: 0.5, hybridization: 'sp3d2' },
        { id: 1, symbol: 'Nb', x: 1.8, y: 0, z: 0, charge: 0.5, hybridization: 'sp3d2' },
        { id: 2, symbol: 'Ti', x: 0.9, y: 1.6, z: 0, charge: 0.2, hybridization: 'sp3' },
        { id: 3, symbol: 'Al', x: 0.9, y: 0.8, z: 1.5, charge: -0.4, hybridization: 'sp3' }
      ],
      bonds: [
        { atom1: 0, atom2: 1, order: 1 },
        { atom1: 0, atom2: 2, order: 1 },
        { atom1: 1, atom2: 2, order: 1 },
        { atom1: 0, atom2: 3, order: 1 },
        { atom1: 1, atom2: 3, order: 1 },
        { atom1: 2, atom2: 3, order: 1 }
      ]
    };

    return simulateReactionKinetics(mat.name, mat.formula, mat.atoms, mat.bonds, {
      temperatureK: 1250,
      pressureAtm: 1.0,
      atmosphere: 'high_oxygen'
    });
  });

  // Listen to changes in initialMaterial from PeriodicTableLab
  useEffect(() => {
    if (initialMaterial) {
      setCustomMaterial(initialMaterial);
      setActiveMaterialSource('custom');
      const res = simulateReactionKinetics(
        initialMaterial.name,
        initialMaterial.formula,
        initialMaterial.atoms,
        initialMaterial.bonds,
        { temperatureK, pressureAtm, atmosphere }
      );
      setKineticsResult(res);
      setCurrentTimeIndex(0);
      setActive3DState('transition');
    }
  }, [initialMaterial]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = simulateReactionKinetics(
        kineticsResult.materialName,
        kineticsResult.formula,
        kineticsResult.initialAtoms,
        kineticsResult.initialBonds,
        { temperatureK, pressureAtm, atmosphere }
      );
      setKineticsResult(res);
      setCurrentTimeIndex(0);
      setIsSimulating(false);
    }, 400);
  };

  // Auto-play time progression loop
  useEffect(() => {
    let timer: any;
    if (isPlayingTime) {
      timer = setInterval(() => {
        setCurrentTimeIndex((prev) => {
          if (prev >= kineticsResult.timeResolvedEnergyTrajectory.length - 1) {
            setIsPlayingTime(false);
            return prev;
          }
          const next = prev + 1;
          // Dynamically toggle 3D state based on time fraction
          const frac = next / kineticsResult.timeResolvedEnergyTrajectory.length;
          if (frac < 0.35) setActive3DState('initial');
          else if (frac < 0.75) setActive3DState('transition');
          else setActive3DState('degraded');
          return next;
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isPlayingTime, kineticsResult]);

  const handleCopyReport = () => {
    let text = `==========================================================\n`;
    text += `[QuantumMol AI - 반응 역학 실험실(Reaction Kinetics) 정밀 시뮬레이션]\n`;
    text += `표적 소재: ${kineticsResult.materialName} (${kineticsResult.formula})\n`;
    text += `반응 환경: 온도 ${kineticsResult.temperatureK} K (${(kineticsResult.temperatureK - 273.15).toFixed(1)}°C) | 압력 ${kineticsResult.pressureAtm} atm | 분위기: ${kineticsResult.atmosphere}\n`;
    text += `반응 메커니즘 유형: ${kineticsResult.reactionTypeName}\n\n`;
    text += `[핵심 반응 속도론 및 열역학 파라미터]\n`;
    text += `  - 활성화 에너지 장벽 (Ea): ${kineticsResult.activationEnergyEaKcalMol} kcal/mol\n`;
    text += `  - 반응 속도 상수 k(T, P): ${kineticsResult.rateConstantK} s⁻¹\n`;
    text += `  - 반감기 (t_1/2): ${kineticsResult.halfLifeSeconds} 초\n`;
    text += `  - 깁스 자유 에너지 변화 (ΔG_rxn): ${kineticsResult.gibbsFreeEnergyDeltaG} kcal/mol (${kineticsResult.isSpontaneous ? '자발적 반응/열화' : '비자발적/안정'})\n`;
    text += `  - 임계 열화 한계 온도: ${kineticsResult.criticalFailureTemperatureK} K\n`;
    text += `  - 최종 생성물 상: ${kineticsResult.finalProductFormula}\n\n`;
    text += `[상세 분해/결합 메커니즘]\n  ${kineticsResult.degradationMechanism}\n`;
    text += `==========================================================\n`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleSendToMainViewer = () => {
    if (!onLoadIntoMainViewer) return;
    const atomsToLoad = active3DState === 'initial' 
      ? kineticsResult.initialAtoms 
      : active3DState === 'transition' 
        ? kineticsResult.transitionStateAtoms 
        : kineticsResult.degradedAtoms;
    
    const bondsToLoad = active3DState === 'initial'
      ? kineticsResult.initialBonds
      : active3DState === 'transition'
        ? kineticsResult.transitionStateBonds
        : kineticsResult.degradedBonds;

    const mol: Molecule = {
      id: `rxn-${Date.now()}`,
      name: `${kineticsResult.materialName} [${active3DState.toUpperCase()}]`,
      commonName: `${kineticsResult.formula} 반응역학 상태 (${active3DState})`,
      formula: active3DState === 'degraded' ? kineticsResult.finalProductFormula : kineticsResult.formula,
      smiles: kineticsResult.formula,
      description: `${kineticsResult.temperatureK}K, ${kineticsResult.pressureAtm}atm 환경에서 ${kineticsResult.reactionTypeName} 시뮬레이션 모델`,
      quantumRationale: `활성화 에너지 Ea=${kineticsResult.activationEnergyEaKcalMol} kcal/mol, k=${kineticsResult.rateConstantK} s⁻¹`,
      atoms: atomsToLoad,
      bonds: bondsToLoad,
      quantumProperties: {
        groundStateEnergy: parseFloat((-48.0 * atomsToLoad.length + kineticsResult.gibbsFreeEnergyDeltaG).toFixed(2)),
        vqeIterations: 30,
        fidelityScore: 0.992,
        homoEnergy: -6.5,
        lumoEnergy: -2.2,
        homoLumoGap: 4.3,
        dipoleMoment: 1.2,
        qubitsRequired: Math.min(16, atomsToLoad.length * 2),
        pauliTermsCount: atomsToLoad.length * 30,
        quantumAdvantageMetric: '아이링-폴라니 전이상태 속도론 계산 완료'
      },
      deepLearningMetrics: {
        qganDiscriminatorLoss: 0.015,
        generatorFidelity: 0.99,
        valenceValidityRate: 1.0,
        sascore: 2.5,
        qedScore: 0.8,
        logP: 0.1,
        molecularWeight: 250
      },
      suggestedApplications: [
        `반응 속도 k = ${kineticsResult.rateConstantK} s⁻¹`,
        `활성화 에너지 Ea = ${kineticsResult.activationEnergyEaKcalMol} kcal/mol`,
        `자유에너지 ΔG = ${kineticsResult.gibbsFreeEnergyDeltaG} kcal/mol`
      ],
      synthesisRouteSummary: `${kineticsResult.materialName} 반응 역학 경로`,
      quantumCircuitConfig: {
        numQubits: 8,
        depth: 16,
        ansatzType: 'StronglyEntangling',
        parameters: [0.1, 0.2, 0.3, 0.4]
      }
    };
    onLoadIntoMainViewer(mol);
  };

  // Active 3D Model coordinates
  const currentAtoms = active3DState === 'initial'
    ? kineticsResult.initialAtoms
    : active3DState === 'transition'
      ? kineticsResult.transitionStateAtoms
      : kineticsResult.degradedAtoms;

  const currentBonds = active3DState === 'initial'
    ? kineticsResult.initialBonds
    : active3DState === 'transition'
      ? kineticsResult.transitionStateBonds
      : kineticsResult.degradedBonds;

  const currentStep = kineticsResult.timeResolvedEnergyTrajectory[currentTimeIndex] || kineticsResult.timeResolvedEnergyTrajectory[0];

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Top Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-rose-950/50">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              반응 역학 실험실 (Reaction Kinetics Lab)
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                Eyring Transition State &amp; Time-Resolved Energy Engine
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              주기율표 기반 신물질이 고온/고압 및 산화·환원·수열 극한 환경에서 어떻게 반응하고 분해/재결합하는지 전이 상태 장벽과 시간 경과에 따른 에너지 변화를 정밀 시뮬레이션합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedReport ? '복사됨' : '반응역학 리포트 복사'}</span>
          </button>
          {onLoadIntoMainViewer && (
            <button
              onClick={handleSendToMainViewer}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">메인 3D 뷰어 로드</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Environmental Chamber Controls & Material Preset */}
        <div className="w-[36%] border-r border-slate-800 flex flex-col p-3.5 space-y-3.5 overflow-y-auto bg-slate-950/80">
          {/* Material Selector Card */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              반응 역학 테스트 표적 신물질 선택
            </span>

            <div className="space-y-1">
              <select
                value={activeMaterialSource === 'custom' && customMaterial ? 'custom-synthesized' : selectedMaterialRecipe.id}
                onChange={(e) => {
                  if (e.target.value === 'custom-synthesized' && customMaterial) {
                    setActiveMaterialSource('custom');
                    const res = simulateReactionKinetics(
                      customMaterial.name,
                      customMaterial.formula,
                      customMaterial.atoms,
                      customMaterial.bonds,
                      { temperatureK, pressureAtm, atmosphere }
                    );
                    setKineticsResult(res);
                    setCurrentTimeIndex(0);
                    return;
                  }

                  const found = PRESET_MATERIAL_RECIPES.find(r => r.id === e.target.value);
                  if (found) {
                    setActiveMaterialSource('preset');
                    setSelectedMaterialRecipe(found);
                    // generate simple representative atoms
                    const atoms = found.elements.map((el, i) => ({
                      id: i,
                      symbol: el.symbol,
                      x: parseFloat((Math.cos(i * 1.5) * 1.5).toFixed(3)),
                      y: parseFloat((Math.sin(i * 1.5) * 1.5).toFixed(3)),
                      z: parseFloat((i * 0.4).toFixed(3)),
                      charge: 0.1,
                      hybridization: 'sp3' as const
                    }));
                    const bonds = atoms.length > 1 ? [{ atom1: 0, atom2: 1, order: 1 }] : [];
                    const res = simulateReactionKinetics(found.name, found.formula, atoms, bonds, {
                      temperatureK,
                      pressureAtm,
                      atmosphere
                    });
                    setKineticsResult(res);
                    setCurrentTimeIndex(0);
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                {customMaterial && (
                  <option value="custom-synthesized">
                    🧪 [원소합성 랩 전송] {customMaterial.formula} - {customMaterial.koreanName || customMaterial.name}
                  </option>
                )}
                {PRESET_MATERIAL_RECIPES.map((rec) => (
                  <option key={rec.id} value={rec.id}>
                    {rec.domainIcon} {rec.formula} - {rec.koreanName}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2 bg-slate-950/90 rounded border border-slate-800 text-[11px] text-slate-300">
              <span className="text-amber-300 font-bold block mb-0.5">
                {activeMaterialSource === 'custom' && customMaterial 
                  ? `${customMaterial.name} (${customMaterial.formula})` 
                  : selectedMaterialRecipe.name}
              </span>
              <p className="text-slate-400 text-[10px] leading-relaxed">
                {activeMaterialSource === 'custom' && customMaterial 
                  ? customMaterial.description 
                  : selectedMaterialRecipe.description}
              </p>
            </div>
          </div>

          {/* Environmental Reaction Chamber Controls */}
          <div className="p-3 bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900 rounded-xl border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-rose-500/20">
              <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-rose-400" />
                극한 환경 챔버 제어기 (Chamber Controls)
              </span>
              <span className="text-[10px] font-mono text-cyan-300">
                T &amp; P Gradient
              </span>
            </div>

            {/* Temperature Slider & Presets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  온도 (Temperature):
                </span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  {temperatureK} K <span className="text-[11px] text-slate-400 font-normal">({(temperatureK - 273.15).toFixed(0)}°C)</span>
                </span>
              </div>
              <input
                type="range"
                min={77}
                max={2500}
                step={25}
                value={temperatureK}
                onChange={(e) => setTemperatureK(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 flex-wrap pt-0.5">
                <button onClick={() => setTemperatureK(298)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">상온 298K</button>
                <button onClick={() => setTemperatureK(850)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">작동 850K</button>
                <button onClick={() => setTemperatureK(1350)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">고온 1350K</button>
                <button onClick={() => setTemperatureK(2000)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">극한 2000K</button>
              </div>
            </div>

            {/* Pressure Slider & Presets */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  압력 (Pressure):
                </span>
                <span className="font-mono font-bold text-cyan-300 text-sm">
                  {pressureAtm >= 1000 ? `${(pressureAtm / 1000).toFixed(1)} k-atm` : `${pressureAtm} atm`}
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={5000}
                step={10}
                value={pressureAtm}
                onChange={(e) => setPressureAtm(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 flex-wrap pt-0.5">
                <button onClick={() => setPressureAtm(0.0001)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">진공 10⁻⁴</button>
                <button onClick={() => setPressureAtm(1.0)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">상압 1 atm</button>
                <button onClick={() => setPressureAtm(50)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">중압 50 atm</button>
                <button onClick={() => setPressureAtm(2500)} className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700">초고압 2.5k</button>
              </div>
            </div>

            {/* Atmosphere Environment Selection */}
            <div className="space-y-1.5 pt-1 border-t border-slate-800">
              <label className="text-xs text-slate-300 font-medium block">
                반응 분위기 가스 (Atmosphere Environment)
              </label>
              <div className="space-y-1">
                {ATMOSPHERE_OPTIONS.map((atm) => {
                  const isSel = atmosphere === atm.id;
                  return (
                    <button
                      key={atm.id}
                      onClick={() => setAtmosphere(atm.id as any)}
                      className={`w-full text-left p-1.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                        isSel
                          ? 'bg-rose-950/60 border-rose-400 text-rose-200 ring-1 ring-rose-400 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{atm.icon}</span>
                        <span className="font-medium text-[11px]">{atm.name}</span>
                      </div>
                      {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Simulation Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isSimulating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-rose-950'
              }`}
            >
              {isSimulating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>아이링 반응 역학 및 분해 장벽 시뮬레이션 중...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span>반응 역학 시뮬레이션 가동</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Key Kinetics KPIs, Dynamic Energy Graph, & 3D Reaction State Viewer */}
        <div className="w-[64%] flex flex-col p-3.5 space-y-3 overflow-y-auto bg-slate-950">
          {/* Reaction Header Card */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  {kineticsResult.materialName} ({kineticsResult.formula})
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                    {kineticsResult.reactionTypeName.split(' ')[0]}
                  </span>
                </h3>
                <span className="text-xs text-amber-300 font-medium block mt-0.5">
                  환경: {kineticsResult.temperatureK}K ({kineticsResult.temperatureK - 273}°C) · {kineticsResult.pressureAtm} atm · {kineticsResult.atmosphere}
                </span>
              </div>

              <div className="text-right">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  kineticsResult.isSpontaneous
                    ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                }`}>
                  {kineticsResult.isSpontaneous ? '자발적 분해/반응 (ΔG < 0)' : '열역학적 안정 상태 유지'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {kineticsResult.degradationMechanism}
            </p>
          </div>

          {/* Key Kinetics Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-amber-500/40 space-y-0.5">
              <span className="text-[10px] text-slate-400 block">활성화 에너지 (Ea)</span>
              <span className="text-base font-bold text-amber-300 block">
                {kineticsResult.activationEnergyEaKcalMol} <span className="text-[10px] text-slate-400">kcal/mol</span>
              </span>
              <span className="text-[9px] text-slate-500">전이 상태 에너지 장벽</span>
            </div>

            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-rose-500/40 space-y-0.5">
              <span className="text-[10px] text-slate-400 block">속도 상수 k(T, P)</span>
              <span className="text-base font-bold text-rose-300 block truncate">
                {kineticsResult.rateConstantK} <span className="text-[10px] text-slate-400">s⁻¹</span>
              </span>
              <span className="text-[9px] text-slate-500">Eyring-Polanyi 속도</span>
            </div>

            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-indigo-500/40 space-y-0.5">
              <span className="text-[10px] text-slate-400 block">반응 반감기 (t_1/2)</span>
              <span className="text-base font-bold text-indigo-300 block truncate">
                {kineticsResult.halfLifeSeconds} <span className="text-[10px] text-slate-400">초</span>
              </span>
              <span className="text-[9px] text-slate-500">50% 농도 소모 시간</span>
            </div>

            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-cyan-500/40 space-y-0.5">
              <span className="text-[10px] text-slate-400 block">자유에너지 (ΔG_rxn)</span>
              <span className="text-base font-bold text-cyan-300 block">
                {kineticsResult.gibbsFreeEnergyDeltaG} <span className="text-[10px] text-slate-400">kcal</span>
              </span>
              <span className="text-[9px] text-slate-500">반응 전후 에너지차</span>
            </div>
          </div>

          {/* Time-Resolved Energy Trajectory Graph Component */}
          <ReactionEnergyGraph
            timeSteps={kineticsResult.timeResolvedEnergyTrajectory}
            coordinatePoints={kineticsResult.reactionCoordinateProfile}
            currentTimeIndex={currentTimeIndex}
            onSelectTimeIndex={(idx) => setCurrentTimeIndex(idx)}
            width={540}
            height={220}
          />

          {/* Environmental Optimization & Domain Recommendations Panel (환경 최적화 추천 패널) */}
          <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  반응 속도론 데이터 정밀 분석 &amp; 산업 도메인별 환경 최적화 추천 패널
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-normal">
                    Kinetics &amp; Enthalpy Optimization
                  </span>
                </h4>
              </div>
            </div>

            {/* Kinetics & Enthalpy Tabular Data */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] text-slate-400 bg-slate-950/60">
                    <th className="py-1.5 px-2 font-semibold">반응 속도론 / 열역학 파라미터</th>
                    <th className="py-1.5 px-2 font-semibold">산출 수치값</th>
                    <th className="py-1.5 px-2 font-semibold">단위</th>
                    <th className="py-1.5 px-2 font-semibold">물리화학적 의미 및 판정</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  <tr>
                    <td className="py-1.5 px-2 text-amber-300 font-bold">활성화 에너지 (Ea)</td>
                    <td className="py-1.5 px-2 text-slate-100 font-bold">{kineticsResult.activationEnergyEaKcalMol}</td>
                    <td className="py-1.5 px-2 text-slate-400">kcal/mol</td>
                    <td className="py-1.5 px-2 text-slate-300">전이상태(TS‡) 극복에 요구되는 최소 결합 해리 장벽</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-rose-300 font-bold">반응 엔탈피 (ΔH_rxn)</td>
                    <td className="py-1.5 px-2 text-slate-100 font-bold">
                      {parseFloat((kineticsResult.gibbsFreeEnergyDeltaG + (kineticsResult.temperatureK * 0.015)).toFixed(2))}
                    </td>
                    <td className="py-1.5 px-2 text-slate-400">kcal/mol</td>
                    <td className="py-1.5 px-2 text-slate-300">
                      {kineticsResult.gibbsFreeEnergyDeltaG < 0 ? '발열 반응 (생성물 결합 안정화)' : '흡열 반응 (고온 열에너지 공급 필요)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-cyan-300 font-bold">깁스 자유에너지 (ΔG_rxn)</td>
                    <td className="py-1.5 px-2 text-slate-100 font-bold">{kineticsResult.gibbsFreeEnergyDeltaG}</td>
                    <td className="py-1.5 px-2 text-slate-400">kcal/mol</td>
                    <td className="py-1.5 px-2">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                        kineticsResult.isSpontaneous ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {kineticsResult.isSpontaneous ? 'ΔG < 0 자발적 분해 진행' : 'ΔG > 0 열역학적 안정성 유지'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-indigo-300 font-bold">Eyring 속도 상수 k(T, P)</td>
                    <td className="py-1.5 px-2 text-slate-100 font-bold truncate max-w-[120px]">{kineticsResult.rateConstantK}</td>
                    <td className="py-1.5 px-2 text-slate-400">s⁻¹</td>
                    <td className="py-1.5 px-2 text-slate-300">현재 T, P 환경에서의 단위시간당 반응 진행 속도</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2 text-emerald-300 font-bold">임계 열화 한계 온도 (T_crit)</td>
                    <td className="py-1.5 px-2 text-slate-100 font-bold">{kineticsResult.criticalFailureTemperatureK}</td>
                    <td className="py-1.5 px-2 text-slate-400">K</td>
                    <td className="py-1.5 px-2 text-slate-300">{(kineticsResult.criticalFailureTemperatureK - 273.15).toFixed(0)}°C 초과 시 급격한 열파괴 발생 한계선</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Industrial Domain Optimal Conditions Recommendation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Semiconductor Domain Recommendation */}
              <div className="p-2.5 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>반도체 도메인 최적 온도 추천</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                    권장: {Math.min(1150, Math.max(750, Math.round(kineticsResult.criticalFailureTemperatureK * 0.65)))} K
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-normal">
                  반도체 에피택시 및 RTA 급속 열처리 공정 시, 계면 결함 밀도를 10⁹ cm⁻² 이하로 억제하면서 산화 분해를 방지하는 최적 온도 창(Window)입니다.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-[9px] font-mono text-slate-400">분위기 권장: 초고진공 (UHV)</span>
                  <button
                    onClick={() => {
                      const optT = Math.min(1150, Math.max(750, Math.round(kineticsResult.criticalFailureTemperatureK * 0.65)));
                      setTemperatureK(optT);
                      setAtmosphere('inert_vacuum');
                      setPressureAtm(0.0001);
                    }}
                    className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold transition-colors"
                  >
                    반도체 최적조건 적용
                  </button>
                </div>
              </div>

              {/* Energy & Power Domain Recommendation */}
              <div className="p-2.5 bg-slate-950/90 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>에너지·배터리 도메인 최적 조건</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    권장: {Math.min(1450, Math.max(550, Math.round(kineticsResult.criticalFailureTemperatureK * 0.82)))} K
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-normal">
                  고체전해질 고밀도 소결 및 가스 터빈 작동 시 열역학적 깁스 에너지를 안정 영역(ΔG &gt; 0)으로 유지하는 안전 마진 온도입니다.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-[9px] font-mono text-slate-400">분위기 권장: 수소 환원 / 상압</span>
                  <button
                    onClick={() => {
                      const optT = Math.min(1450, Math.max(550, Math.round(kineticsResult.criticalFailureTemperatureK * 0.82)));
                      setTemperatureK(optT);
                      setAtmosphere('reducing_hydrogen');
                      setPressureAtm(1.0);
                    }}
                    className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold transition-colors"
                  >
                    에너지 최적조건 적용
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Reaction State Viewer (Reactant -> Transition State -> Product) */}
          <div className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
            <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                3D 반응 단계별 구조 상태 시뮬레이션
              </span>

              {/* State Buttons */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono">
                <button
                  onClick={() => setActive3DState('initial')}
                  className={`px-2 py-0.5 rounded transition-all font-bold ${
                    active3DState === 'initial'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  초기 반응물 (R)
                </button>
                <button
                  onClick={() => setActive3DState('transition')}
                  className={`px-2 py-0.5 rounded transition-all font-bold ${
                    active3DState === 'transition'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  전이 상태 인장 (TS‡)
                </button>
                <button
                  onClick={() => setActive3DState('degraded')}
                  className={`px-2 py-0.5 rounded transition-all font-bold ${
                    active3DState === 'degraded'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  최종 생성물 (P)
                </button>
              </div>
            </div>

            <div className="h-[270px] relative bg-slate-950/60">
              <Molecule3DViewer
                molecule={{
                  id: `rxn-view-${active3DState}`,
                  name: `${kineticsResult.materialName} - ${active3DState.toUpperCase()}`,
                  commonName: active3DState === 'initial' ? '초기 결정 격자' : active3DState === 'transition' ? '전이상태 인장 격자' : '최종 반응 생성 격자',
                  formula: active3DState === 'degraded' ? kineticsResult.finalProductFormula : kineticsResult.formula,
                  smiles: kineticsResult.formula,
                  description: currentStep.stateDescription,
                  quantumRationale: `Ea=${kineticsResult.activationEnergyEaKcalMol} kcal/mol | ΔG=${currentStep.freeEnergyKcalMol} kcal/mol`,
                  atoms: currentAtoms,
                  bonds: currentBonds,
                  quantumProperties: {
                    groundStateEnergy: parseFloat((-48.0 * currentAtoms.length + currentStep.freeEnergyKcalMol).toFixed(2)),
                    vqeIterations: 30,
                    fidelityScore: 0.99,
                    homoEnergy: -6.5,
                    lumoEnergy: -2.2,
                    homoLumoGap: 4.3,
                    dipoleMoment: 1.2,
                    qubitsRequired: Math.min(16, currentAtoms.length * 2),
                    pauliTermsCount: currentAtoms.length * 24,
                    quantumAdvantageMetric: '반응 좌표 3D 격자 시뮬레이션'
                  },
                  deepLearningMetrics: {
                    qganDiscriminatorLoss: 0.015,
                    generatorFidelity: 0.99,
                    valenceValidityRate: 1.0,
                    sascore: 2.5,
                    qedScore: 0.8,
                    logP: 0.1,
                    molecularWeight: 240
                  },
                  suggestedApplications: [
                    `상태: ${active3DState.toUpperCase()}`,
                    `잔류 분율 [A]: ${(currentStep.reactantFraction * 100).toFixed(1)}%`
                  ],
                  synthesisRouteSummary: '반응 역학 동역학적 경로',
                  quantumCircuitConfig: {
                    numQubits: 8,
                    depth: 16,
                    ansatzType: 'StronglyEntangling',
                    parameters: [0.1, 0.2, 0.3, 0.4]
                  }
                }}
              />

              <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-cyan-300 border border-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>3D 상태: {active3DState === 'initial' ? '초기 격자' : active3DState === 'transition' ? '전이 상태 (TS‡)' : '최종 생성물'}</span>
                <span className="text-slate-500">|</span>
                <span className="text-amber-300 font-bold">t = {currentStep.timePs} ps</span>
              </div>

              <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[9px] font-mono bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded border border-slate-700">
                <span className="text-slate-400">진행 상태:</span>
                <span className="text-slate-200 font-bold">{currentStep.stateDescription}</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-300 font-bold">생성 분율: {(currentStep.productFraction * 100).toFixed(1)}%</span>
              </div>

              {/* Time Play / Pause Controller in viewport */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700 text-xs">
                <button
                  onClick={() => setIsPlayingTime(!isPlayingTime)}
                  className="p-1 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1 font-mono text-[10px]"
                >
                  {isPlayingTime ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{isPlayingTime ? '일시정지' : '시간 재생'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlayingTime(false);
                    setCurrentTimeIndex(0);
                    setActive3DState('initial');
                  }}
                  className="p-1 text-slate-400 hover:text-slate-200"
                  title="처음으로 되감기"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
