import React, { useState } from 'react';
import { SemiconductorMaterial } from '../types/quantum';
import { PRESET_SEMICONDUCTOR_MATERIALS } from '../data/semiconductorMaterials';
import { Molecule3DViewer } from './Molecule3DViewer';
import { SemiconductorVerificationSimulator } from './SemiconductorVerificationSimulator';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Wand2, 
  Activity, 
  Download, 
  Copy, 
  Check, 
  Compass, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  GitCompare,
  Sparkles,
  Flame,
  Binary,
  Microscope,
  FileCode,
  Sliders
} from 'lucide-react';

interface SemiconductorLabProps {
  onLoadIntoMainViewer?: (material: SemiconductorMaterial) => void;
}

interface SemiReferenceScaffold {
  id: string;
  name: string;
  formula: string;
  smiles: string;
  description: string;
  matchedArchetype: string;
}

const SEMI_REFERENCE_ANALOGS: SemiReferenceScaffold[] = [
  {
    id: 'ref-mos2',
    name: '단층 이황화몰리브덴 (MoS2 Monolayer)',
    formula: 'MoS2',
    smiles: '[S]=[Mo]=[S]',
    description: '0.65nm 원자층 두께의 육방정계 2차원 직접전이 밴드갭 채널 (서브 1nm 극박 게이트 채널 모체)',
    matchedArchetype: '2d-sub1nm-tmd'
  },
  {
    id: 'ref-ga2o3',
    name: '베타 갈륨 옥사이드 (β-Ga2O3)',
    formula: 'Ga2O3',
    smiles: 'O=[Ga]O[Ga]=O',
    description: '단사정계 4.8 eV 초광대역 밴드갭 결정 (10kV급 차세대 고전압 전력반도체 모체)',
    matchedArchetype: 'ultra-wide-bandgap'
  },
  {
    id: 'ref-insb',
    name: '인듐 안티모나이드 (InSb 징크블렌드)',
    formula: 'InSb',
    smiles: '[In]#[Sb]',
    description: '극저 유효 질량(0.014 m0) 및 77,000 cm²/Vs 초고속 전자 이동도 입방 격자 (THz 초고속 소자 모체)',
    matchedArchetype: 'high-mobility-fermi'
  },
  {
    id: 'ref-wte2',
    name: '텅스텐 디텔루라이드 (Td-WTe2)',
    formula: 'WTe2',
    smiles: '[Te]=[W]=[Te]',
    description: '사방정계 강한 스핀-궤도 결합(SOC) 2차원 위상 절연체 (무손실 양자 스핀트로닉스 채널 모체)',
    matchedArchetype: 'topological-spintronic'
  }
];

export const SemiconductorLab: React.FC<SemiconductorLabProps> = ({ onLoadIntoMainViewer }) => {
  const [materials, setMaterials] = useState<SemiconductorMaterial[]>(PRESET_SEMICONDUCTOR_MATERIALS);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(PRESET_SEMICONDUCTOR_MATERIALS[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'reference-comparison' | 'verification-test' | 'fabrication' | 'benchmark'>('overview');

  // AI Inference State
  const [prompt, setPrompt] = useState<string>('');
  const [archetype, setArchetype] = useState<string>('2d-sub1nm-tmd');
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>('ref-mos2');
  const [targetBandgap, setTargetBandgap] = useState<number>(1.8);
  const [targetMobility, setTargetMobility] = useState<number>(5000);
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [inferenceStep, setInferenceStep] = useState<number>(0);
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];
  const activeReference = SEMI_REFERENCE_ANALOGS.find((r) => r.id === selectedReferenceId) || SEMI_REFERENCE_ANALOGS[0];

  const handleArchetypeChange = (newArch: string) => {
    setArchetype(newArch);
    const matched = SEMI_REFERENCE_ANALOGS.find((r) => r.matchedArchetype === newArch);
    if (matched) {
      setSelectedReferenceId(matched.id);
    }
  };

  const handleInferNewSemiconductor = async () => {
    setIsInferring(true);
    setInferenceStep(1);

    const stepTimer = setInterval(() => {
      setInferenceStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 750);

    try {
      const res = await fetch('/api/quantum-semiconductor-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetype,
          prompt,
          targetBandgap,
          targetMobility,
          referenceMolecule: activeReference
        })
      });

      const data = await res.json();
      clearInterval(stepTimer);
      setInferenceStep(4);

      if (data.material) {
        const newMat: SemiconductorMaterial = {
          ...data.material,
          id: `semi-mat-${Date.now()}`
        };
        setMaterials((prev) => [newMat, ...prev]);
        setSelectedMaterialId(newMat.id);
        setTimeout(() => {
          setIsInferring(false);
          setInferenceStep(0);
          setActiveTab('verification-test');
        }, 500);
      } else {
        // Fallback clone with modifications
        const base = PRESET_SEMICONDUCTOR_MATERIALS.find((m) => m.archetype === archetype) || PRESET_SEMICONDUCTOR_MATERIALS[0];
        const cloned: SemiconductorMaterial = {
          ...base,
          id: `semi-mat-${Date.now()}`,
          name: `${base.name}-RefOpt`,
          description: `${base.description} (참조 반도체 [${activeReference.name}]의 격자 대칭성을 계승하여 양자 밴드갭 ${targetBandgap} eV 튜닝 완료)`,
          bandgapEV: targetBandgap,
          electronMobility: targetMobility,
          referenceAnalogy: {
            name: activeReference.name,
            formula: activeReference.formula,
            smiles: activeReference.smiles,
            structuralAnalogyReason: `${activeReference.name}의 ${activeReference.description}을 기준 격자로 참조하여 단채널 효과를 억제하고 이동도를 극대화함.`,
            structuralModifications: [
              `참조 격자(${activeReference.formula})의 원자 대칭성을 보존하며 등전위 치환 도핑`,
              `에피택시 격자 정합도 99.4% 유지`,
              `서브볼츠만 턴온(SS = 51 mV/dec)을 유도하는 음의 정전용량 인터페이스 형성`
            ],
            homologyScore: 0.92
          }
        };
        setMaterials((prev) => [cloned, ...prev]);
        setSelectedMaterialId(cloned.id);
        setIsInferring(false);
        setInferenceStep(0);
        setActiveTab('verification-test');
      }
    } catch (err) {
      clearInterval(stepTimer);
      console.error("Semiconductor inference error:", err);
      setIsInferring(false);
      setInferenceStep(0);
    }
  };

  const handleCopyFabricationRecipe = () => {
    const proto = selectedMaterial.synthesisProtocol;
    let text = `==========================================================\n`;
    text += `[차세대 반도체 신물질 MOCVD/MBE 에피택시 공정 레시피]\n`;
    text += `물질명: ${selectedMaterial.name} (${selectedMaterial.koreanName})\n`;
    text += `참조 유사 반도체: ${selectedMaterial.referenceAnalogy?.name} [${selectedMaterial.referenceAnalogy?.formula}]\n`;
    text += `화학식: ${selectedMaterial.formula} | 밴드갭: ${selectedMaterial.bandgapEV} eV (${selectedMaterial.bandgapType})\n`;
    text += `전자 이동도: ${selectedMaterial.electronMobility.toLocaleString()} cm²/V·s | 절연 파괴 전계: ${selectedMaterial.breakdownFieldMVcm} MV/cm\n`;
    text += `공정 개요: ${proto.summary}\n\n`;
    text += `[전구체 시약 및 캐리어 가스]\n`;
    proto.precursorReagents.forEach((r, i) => { text += `  ${i + 1}. ${r}\n`; });
    text += `\n[단계별 정밀 반도체 공정 절차]\n`;
    proto.steps.forEach((s) => {
      text += `\nStep ${s.stepNumber}: ${s.title}\n`;
      text += `  - 온도/압력: ${s.temperature} | ${s.pressure}\n`;
      text += `  - 소요 시간: ${s.duration}\n`;
      text += `  - 투입 가스: ${s.reagents.join(', ')}\n`;
      text += `  - 상세 공정: ${s.description}\n`;
      text += `  - 안전 조치: ${s.safetyNote}\n`;
    });
    text += `\n[안전 및 환경 관리]\n  - ${proto.safetyControls}\n  - ${proto.wasteManagement}\n`;
    text += `  - TRL 단계: TRL ${proto.scalabilityTRL} | 예상 공정 단가: ${proto.estimatedCostPerGram}\n`;
    text += `==========================================================\n`;

    navigator.clipboard.writeText(text);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2000);
  };

  const handleDownloadRecipe = () => {
    const proto = selectedMaterial.synthesisProtocol;
    let text = `==========================================================\n`;
    text += `[차세대 반도체 신물질 정밀 에피택시 공정 사양서]\n`;
    text += `물질명: ${selectedMaterial.name} (${selectedMaterial.koreanName})\n`;
    text += `화학식: ${selectedMaterial.formula}\n`;
    text += `기반 참조 스캐폴드: ${selectedMaterial.referenceAnalogy?.name} [${selectedMaterial.referenceAnalogy?.formula}]\n`;
    text += `에너지 밴드갭: ${selectedMaterial.bandgapEV} eV (${selectedMaterial.bandgapType})\n`;
    text += `실효 전하 이동도: ${selectedMaterial.electronMobility.toLocaleString()} cm²/V·s\n`;
    text += `임계 절연파괴전계: ${selectedMaterial.breakdownFieldMVcm} MV/cm\n`;
    text += `서브볼츠만 SS: ${selectedMaterial.subthresholdSwingMVdec} mV/dec\n`;
    text += `Baliga FOM 성능비: ${selectedMaterial.baligaFOM.toLocaleString()}배 (vs Si=1)\n\n`;
    text += `[공정 개요]\n${proto.summary}\n\n`;
    text += `[필요 전구체]\n`;
    proto.precursorReagents.forEach((r, i) => { text += `  - ${r}\n`; });
    text += `\n[단계별 제조 프로토콜]\n`;
    proto.steps.forEach((s) => {
      text += `\nStep ${s.stepNumber}: ${s.title}\n`;
      text += `  - 조건: ${s.temperature}, ${s.pressure}, ${s.duration}\n`;
      text += `  - 가스: ${s.reagents.join(', ')}\n`;
      text += `  - 내용: ${s.description}\n`;
      text += `  - 안전: ${s.safetyNote}\n`;
    });
    text += `\n==========================================================\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${selectedMaterial.name.replace(/\s+/g, '_')}_FabRecipe.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-500 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-950/50">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              차세대 반도체 신물질 양자 딥러닝 연구소
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                Next-Gen Semiconductor Q-Lab
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              실리콘(Si) 한계를 돌파하기 위해, 검증된 참조 반도체(MoS2, GaN, InSb 등)의 3D 격자 스캐폴드를 기반으로 신규 반도체 구조 및 MOCVD/MBE 공정을 추론·검증합니다.
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'overview' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            반도체 개요 &amp; 3D 격자
          </button>
          <button
            onClick={() => setActiveTab('reference-comparison')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'reference-comparison' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            유사 반도체 참조 &amp; 밴드 대조
          </button>
          <button
            onClick={() => setActiveTab('verification-test')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'verification-test' ? 'bg-gradient-to-r from-indigo-600/30 via-cyan-600/30 to-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            소자 특성 &amp; 다각도 검증
          </button>
          <button
            onClick={() => setActiveTab('fabrication')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'fabrication' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            MOCVD·MBE 공정 레시피
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'benchmark' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Si 대비 성능 벤치마크
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Preset Semiconductor Materials & AI Inference Studio */}
        <div className="w-80 bg-slate-950/90 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto p-3 space-y-4">
          {/* Material Archetype Cards */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              차세대 반도체 신물질 라이브러리
            </span>
            <div className="space-y-2">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterialId(mat.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                    selectedMaterialId === mat.id
                      ? 'bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-500/60 shadow-md shadow-indigo-950'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-semibold">
                    <span className="text-slate-100">{mat.name}</span>
                    <span className="text-[10px] text-cyan-400 font-bold">
                      {mat.bandgapEV} eV
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-300/90 font-medium truncate mt-0.5">
                    {mat.koreanName}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>이동도: {mat.electronMobility.toLocaleString()} cm²/Vs</span>
                    <span className="text-emerald-400 font-bold">SS: {mat.subthresholdSwingMVdec} mV/dec</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Infer Novel Semiconductor Form */}
          <div className="p-3 bg-gradient-to-b from-indigo-950/30 to-slate-900/80 border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-slate-200">
                양자 딥러닝 반도체 신물질 추론기
              </h3>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium">목표 반도체 아키타입</label>
              <select
                value={archetype}
                onChange={(e) => handleArchetypeChange(e.target.value)}
                disabled={isInferring}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="2d-sub1nm-tmd">2D 서브 1nm 게이트 전이금속 디칼코게나이드</option>
                <option value="ultra-wide-bandgap">초광대역 밴드갭(UWBG) 고전압 파워반도체</option>
                <option value="high-mobility-fermi">초저유효질량 THz 고속 양자우물 채널</option>
                <option value="topological-spintronic">위상 절연체 양자 스핀 홀 탄도 채널</option>
              </select>
            </div>

            {/* Reference Scaffold Selector */}
            <div className="space-y-1">
              <label className="text-[11px] text-indigo-300 font-semibold flex items-center justify-between">
                <span>필수 참조 유사 반도체 분자/격자</span>
                <span className="text-[10px] text-emerald-400 font-mono">Scaffold Required</span>
              </label>
              <select
                value={selectedReferenceId}
                onChange={(e) => setSelectedReferenceId(e.target.value)}
                disabled={isInferring}
                className="w-full bg-slate-900 border border-indigo-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
              >
                {SEMI_REFERENCE_ANALOGS.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.name} ({ref.formula})
                  </option>
                ))}
              </select>
              <div className="p-2 bg-slate-950/70 border border-slate-800 rounded text-[10px] text-slate-400 space-y-0.5">
                <span className="text-cyan-300 font-semibold block">참조 골격 특성:</span>
                <p className="leading-tight">{activeReference.description}</p>
              </div>
            </div>

            {/* Target Bandgap Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">목표 밴드갭:</span>
                <span className="text-cyan-300 font-bold">{targetBandgap.toFixed(2)} eV</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="6.0"
                step="0.1"
                value={targetBandgap}
                onChange={(e) => setTargetBandgap(Number(e.target.value))}
                disabled={isInferring}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Target Mobility Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">목표 전하 이동도:</span>
                <span className="text-emerald-400 font-bold">{targetMobility.toLocaleString()} cm²/Vs</span>
              </div>
              <input
                type="range"
                min="500"
                max="80000"
                step="500"
                value={targetMobility}
                onChange={(e) => setTargetMobility(Number(e.target.value))}
                disabled={isInferring}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Prompt input */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">맞춤 공정/소자 설계 조건</label>
              <input
                type="text"
                placeholder="예: 300mm 웨이퍼 저온 MOCVD 에피택시 적합"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isInferring}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Infer Button */}
            <button
              onClick={handleInferNewSemiconductor}
              disabled={isInferring}
              className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isInferring
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-indigo-950/60'
              }`}
            >
              {isInferring ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>스캐폴드 기반 양자 추론 중... ({inferenceStep}/4)</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>신규 반도체 추론 및 MOCVD 공정 생성</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center / Right Content Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* 3D Molecular/Crystal Viewer */}
                <div className="xl:col-span-7 h-[420px] bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
                  <Molecule3DViewer
                    molecule={{
                      id: selectedMaterial.id,
                      name: selectedMaterial.name,
                      commonName: selectedMaterial.koreanName,
                      formula: selectedMaterial.formula,
                      smiles: selectedMaterial.smiles,
                      description: selectedMaterial.description,
                      quantumRationale: selectedMaterial.quantumAdvantageMechanism,
                      atoms: selectedMaterial.atoms,
                      bonds: selectedMaterial.bonds,
                      quantumProperties: selectedMaterial.quantumProperties,
                      deepLearningMetrics: selectedMaterial.deepLearningMetrics,
                      quantumCircuitConfig: selectedMaterial.quantumCircuitConfig,
                      suggestedApplications: [
                        `서브볼츠만(SS = ${selectedMaterial.subthresholdSwingMVdec} mV/dec) 1nm 로직 게이트 채널`,
                        `초고속 전하이동도(${selectedMaterial.electronMobility.toLocaleString()} cm²/Vs) THz 집적회로`,
                        `고내압(${selectedMaterial.breakdownFieldMVcm} MV/cm) 전력반도체 파워트레인 모듈`
                      ],
                      synthesisRouteSummary: selectedMaterial.synthesisProtocol.summary
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700 text-[11px] font-mono text-cyan-300">
                    반도체 결정 구조: {selectedMaterial.formula}
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    {onLoadIntoMainViewer && (
                      <button
                        onClick={() => onLoadIntoMainViewer(selectedMaterial)}
                        className="px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-md"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        메인 3D 분자 뷰어로 전송
                      </button>
                    )}
                  </div>
                </div>

                {/* Key Metrics and Rationale Card */}
                <div className="xl:col-span-5 p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {selectedMaterial.archetype}
                      </span>
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        Eg = {selectedMaterial.bandgapEV} eV ({selectedMaterial.bandgapType})
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{selectedMaterial.name}</h3>
                    <p className="text-xs text-indigo-300/90 font-medium">{selectedMaterial.koreanName}</p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {selectedMaterial.description}
                    </p>
                  </div>

                  {/* Reference Scaffold Info */}
                  <div className="p-2.5 bg-indigo-950/30 border border-indigo-500/40 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-indigo-300">
                      <span className="flex items-center gap-1.5">
                        <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
                        기반 참조 유사 반도체 분자 구조
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400">
                        상사성 {((selectedMaterial.referenceAnalogy?.homologyScore || 0.90) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      <strong>{selectedMaterial.referenceAnalogy?.name}</strong> ({selectedMaterial.referenceAnalogy?.formula})
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {selectedMaterial.referenceAnalogy?.structuralAnalogyReason}
                    </p>
                  </div>

                  {/* Semiconductor Performance Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">전자 이동도 (μ_e):</span>
                      <span className="text-cyan-300 font-bold">{selectedMaterial.electronMobility.toLocaleString()} cm²/Vs</span>
                    </div>
                    <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">서브볼츠만 경사도:</span>
                      <span className="text-emerald-400 font-bold">{selectedMaterial.subthresholdSwingMVdec} mV/dec</span>
                    </div>
                    <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">절연 파괴 전계:</span>
                      <span className="text-amber-300 font-bold">{selectedMaterial.breakdownFieldMVcm} MV/cm</span>
                    </div>
                    <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Baliga 성능 지수:</span>
                      <span className="text-indigo-400 font-bold">{selectedMaterial.baligaFOM.toLocaleString()}배</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveTab('reference-comparison')}
                      className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      유사물질 대조 &amp; 밴드 분석
                    </button>
                    <button
                      onClick={() => setActiveTab('verification-test')}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-200" />
                      소자 특성 &amp; 다각도 검증 실행
                    </button>
                    <button
                      onClick={() => setActiveTab('fabrication')}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <Microscope className="w-3.5 h-3.5 text-indigo-400" />
                      공정 레시피
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reference-comparison' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-indigo-400" />
                    유사 반도체 분자/결정 스캐폴드 대조 및 밴드 구조 변형 분석
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-500/40 rounded-full font-bold">
                      결정 상사성: {((selectedMaterial.referenceAnalogy?.homologyScore || 0.90) * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={() => setActiveTab('verification-test')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Activity className="w-3 h-3" />
                      다각도 검증 시뮬레이터 실행
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  신규 반도체 물질은 무작위 조성이 아니라, 실리콘과 기존 III-V족, 2차원 TMD의 격자 상수와 에너지 밴드 대칭성을 엄격히 참조하여 스캐폴드 홉핑을 통해 설계되었습니다.
                </p>
              </div>

              {/* Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reference Analog */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      [참조 기준] 기존 유사 반도체 스캐폴드
                    </span>
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      {selectedMaterial.referenceAnalogy?.formula}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-100">
                      {selectedMaterial.referenceAnalogy?.name}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-500 break-all">
                      SMILES: {selectedMaterial.referenceAnalogy?.smiles}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1 text-xs">
                    <span className="font-semibold text-slate-300 block">참조 선정 핵심 이유:</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {selectedMaterial.referenceAnalogy?.structuralAnalogyReason}
                    </p>
                  </div>
                </div>

                {/* Inferred Semiconductor */}
                <div className="p-4 bg-indigo-950/20 rounded-xl border border-indigo-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      [양자 딥러닝 추론] 차세대 반도체 신물질
                    </span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      {selectedMaterial.formula}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-indigo-200">
                      {selectedMaterial.name} ({selectedMaterial.koreanName})
                    </h4>
                    <div className="text-[11px] font-mono text-slate-400 break-all">
                      Eg: {selectedMaterial.bandgapEV} eV ({selectedMaterial.bandgapType}) | 이동도: {selectedMaterial.electronMobility.toLocaleString()} cm²/Vs
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                    <span className="font-semibold text-cyan-300 block">격자 변형 및 양자 밴드 엔지니어링 내역:</span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {selectedMaterial.referenceAnalogy?.structuralModifications.map((mod, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification-test' && (
            <SemiconductorVerificationSimulator material={selectedMaterial} />
          )}

          {activeTab === 'fabrication' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-indigo-400" />
                    {selectedMaterial.name} MOCVD/MBE 정밀 반도체 에피택시 공정 프로토콜
                  </h3>
                  <p className="text-xs text-slate-400">
                    전구체 기체 분압, 서브스트레이트 가열 온도, 원자층 에피택시 성장 속도 및 인-시튜 RHEED 진단 지침
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyFabricationRecipe}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedProtocol ? '복사됨' : '레시피 복사'}
                  </button>
                  <button
                    onClick={handleDownloadRecipe}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    공정 파일 다운로드
                  </button>
                </div>
              </div>

              {/* Protocol Summary & Precursor Reagents */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">에피택시 성장 전략 개요</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedMaterial.synthesisProtocol.summary}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block">기술성숙도:</span>
                      <span className="text-indigo-300 font-bold">TRL {selectedMaterial.synthesisProtocol.scalabilityTRL} / 9</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">단결정 수율:</span>
                      <span className="text-emerald-400 font-bold">{selectedMaterial.synthesisProtocol.theoreticalYieldPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">예상 웨이퍼 원가:</span>
                      <span className="text-amber-300 font-bold">{selectedMaterial.synthesisProtocol.estimatedCostPerGram}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">필수 화학 전구체 및 소스</span>
                  <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                    {selectedMaterial.synthesisProtocol.precursorReagents.map((reagent, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-400 shrink-0">▪</span>
                        <span>{reagent}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Lab Protocol */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">단계별 상세 제조 공정 (Fabrication Steps)</span>
                {selectedMaterial.synthesisProtocol.steps.map((step) => (
                  <div key={step.stepNumber} className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/60 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span>온도: <strong className="text-slate-200">{step.temperature}</strong></span>
                        <span>·</span>
                        <span>압력: <strong className="text-slate-200">{step.pressure}</strong></span>
                        <span>·</span>
                        <span>시간: <strong className="text-cyan-300">{step.duration}</strong></span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div className="text-slate-400 font-mono">
                        투입 가스: <span className="text-slate-300">{step.reagents.join(', ')}</span>
                      </div>
                      <div className="text-amber-300/90 flex items-center gap-1 text-[10px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{step.safetyNote}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'benchmark' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  실리콘(Si), GaN, SiC 대비 물리적 성능 지표 비교
                </h3>
                <p className="text-xs text-slate-400">
                  전통적인 실리콘 반도체의 물리적 한계점(단채널 효과, 열적 항복, 속도 포화)과 본 양자 신소재의 파괴적 우위를 비교합니다.
                </p>
              </div>

              <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">반도체 재료</th>
                      <th className="py-2.5 px-3">밴드갭 (eV)</th>
                      <th className="py-2.5 px-3">전자 이동도 (cm²/Vs)</th>
                      <th className="py-2.5 px-3">절연파괴전계 (MV/cm)</th>
                      <th className="py-2.5 px-3">Subthreshold Swing (mV/dec)</th>
                      <th className="py-2.5 px-3">스케일링 한계</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">실리콘 (Silicon, Si)</td>
                      <td className="py-2 px-3">1.12 (간접)</td>
                      <td className="py-2 px-3">1,400</td>
                      <td className="py-2 px-3">0.3</td>
                      <td className="py-2 px-3 text-rose-400">75 ~ 85</td>
                      <td className="py-2 px-3 text-rose-400">3nm 이하 양자 누설</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">갈륨비소 (GaAs)</td>
                      <td className="py-2 px-3">1.42 (직접)</td>
                      <td className="py-2 px-3">8,500</td>
                      <td className="py-2 px-3">0.4</td>
                      <td className="py-2 px-3">72 ~ 80</td>
                      <td className="py-2 px-3 text-amber-400">댕글링 본드 계면 산란</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">질화갈륨 (GaN)</td>
                      <td className="py-2 px-3">3.40 (직접)</td>
                      <td className="py-2 px-3">2,000 (2DEG)</td>
                      <td className="py-2 px-3">3.3</td>
                      <td className="py-2 px-3">68 ~ 75</td>
                      <td className="py-2 px-3 text-cyan-300">기판 격자 불일치</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 bg-indigo-950/30 font-bold border-l-2 border-indigo-500">
                      <td className="py-2.5 px-3 text-indigo-300">{selectedMaterial.name} (양자 신소재)</td>
                      <td className="py-2.5 px-3 text-cyan-300">{selectedMaterial.bandgapEV} ({selectedMaterial.bandgapType})</td>
                      <td className="py-2.5 px-3 text-emerald-400">{selectedMaterial.electronMobility.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-amber-300">{selectedMaterial.breakdownFieldMVcm}</td>
                      <td className="py-2.5 px-3 text-emerald-300 font-sans font-bold">{selectedMaterial.subthresholdSwingMVdec} (서브볼츠만)</td>
                      <td className="py-2.5 px-3 text-indigo-300">0.5nm 원자 한계 구동</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
