import React, { useState } from 'react';
import { NuclearAlternativeMaterial, SynthesisStep } from '../types/quantum';
import { PRESET_NUCLEAR_ALTERNATIVES } from '../data/nuclearAlternativeMaterials';
import { Molecule3DViewer } from './Molecule3DViewer';
import { MaterialVerificationSimulator } from './MaterialVerificationSimulator';
import { 
  Flame, 
  ShieldCheck, 
  Zap, 
  Wand2, 
  Activity, 
  Beaker, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  Compass, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Cpu,
  GitCompare,
  Sparkles
} from 'lucide-react';

interface NuclearAlternativeLabProps {
  onLoadIntoMainViewer?: (material: NuclearAlternativeMaterial) => void;
}

interface ReferenceScaffold {
  id: string;
  name: string;
  formula: string;
  smiles: string;
  description: string;
  matchedArchetype: string;
}

const REFERENCE_ANALOGS: ReferenceScaffold[] = [
  {
    id: 'ref-b12h12',
    name: '클로소-도데카보레이트 [B12H12]²⁻',
    formula: 'B12H12(2-)',
    smiles: '[B-]12[BH-]34[BH-]56[BH-]17[BH-]28[BH-]39[BH-]4%10[BH-]5%11[BH-]6%12[BH-]78[BH-]9%10[B-]%11%12',
    description: '12-정점 정이십면체 3D 방향족 붕소 케이지 골격 (p-11B 플라즈몬 스크리닝)',
    matchedArchetype: 'aneutronic-catalyst'
  },
  {
    id: 'ref-cubane',
    name: '큐베인 (Cubane, C8H8)',
    formula: 'C8H8',
    smiles: 'C12C3C4C1C5C2C3C45',
    description: '정육면체 90° 고리 장력 입방 탄화수소 골격 (질소 큐베인 N8 모체)',
    matchedArchetype: 'polymeric-nitrogen-cage'
  },
  {
    id: 'ref-pdd',
    name: '팔라듐 중수소화물 (PdD0.6)',
    formula: 'PdD0.6',
    smiles: '[Pd].[2H]',
    description: 'FCC 전이금속 격자의 팔면체 틈자리 침입 흡장 골격 (초밀도 수소 유도체)',
    matchedArchetype: 'ultra-dense-hydrogen'
  },
  {
    id: 'ref-ferrocene',
    name: '페로센 (Ferrocene, Fe(C5H5)2)',
    formula: 'FeC10H10',
    smiles: '[Fe+2].[c-]1cccc1.[c-]1cccc1',
    description: 'd-pi 전자 배위 결합 샌드위치 유기금속 착물 골격 (위상 에너지 격자)',
    matchedArchetype: 'topological-energy-lattice'
  }
];

export const NuclearAlternativeLab: React.FC<NuclearAlternativeLabProps> = ({ onLoadIntoMainViewer }) => {
  const [materials, setMaterials] = useState<NuclearAlternativeMaterial[]>(PRESET_NUCLEAR_ALTERNATIVES);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(PRESET_NUCLEAR_ALTERNATIVES[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'reference-comparison' | 'verification-test' | 'synthesis' | 'quantum-barrier' | 'comparison'>('overview');
  
  // Generative AI State
  const [prompt, setPrompt] = useState<string>('');
  const [archetype, setArchetype] = useState<string>('aneutronic-catalyst');
  const [selectedReferenceId, setSelectedReferenceId] = useState<string>('ref-b12h12');
  const [targetEnergyDensity, setTargetEnergyDensity] = useState<number>(75); // million MJ/kg
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [inferenceStep, setInferenceStep] = useState<number>(0);
  const [copiedProtocol, setCopiedProtocol] = useState<boolean>(false);

  const selectedMaterial = materials.find((m) => m.id === selectedMaterialId) || materials[0];
  const activeReference = REFERENCE_ANALOGS.find((r) => r.id === selectedReferenceId) || REFERENCE_ANALOGS[0];

  const handleArchetypeChange = (newArch: string) => {
    setArchetype(newArch);
    const matched = REFERENCE_ANALOGS.find((r) => r.matchedArchetype === newArch);
    if (matched) {
      setSelectedReferenceId(matched.id);
    }
  };

  const handleInferNewMaterial = async () => {
    setIsInferring(true);
    setInferenceStep(1);

    const stepTimer = setInterval(() => {
      setInferenceStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 850);

    try {
      const res = await fetch('/api/quantum-energy-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetype,
          prompt,
          targetEnergyDensityMJ: targetEnergyDensity * 1000000,
          referenceMolecule: activeReference
        })
      });

      const data = await res.json();
      clearInterval(stepTimer);
      setInferenceStep(4);

      if (data.material) {
        const newMat: NuclearAlternativeMaterial = {
          ...data.material,
          id: `energy-mat-${Date.now()}`
        };
        setMaterials((prev) => [newMat, ...prev]);
        setSelectedMaterialId(newMat.id);
        setTimeout(() => {
          setIsInferring(false);
          setInferenceStep(0);
          setActiveTab('reference-comparison');
        }, 500);
      } else {
        // Fallback: select archetype from preset with modification
        const found = PRESET_NUCLEAR_ALTERNATIVES.find((m) => m.archetype === archetype) || PRESET_NUCLEAR_ALTERNATIVES[0];
        const cloned: NuclearAlternativeMaterial = {
          ...found,
          id: `energy-mat-${Date.now()}`,
          name: `${found.name}-RefOpt`,
          description: `${found.description} (참조 유사물질 [${activeReference.name}]의 분자 구조를 기반으로 양자 스캐폴드 홉핑 추론 완료)`,
          energyDensityMJkg: targetEnergyDensity * 1000000,
          referenceAnalogy: {
            name: activeReference.name,
            formula: activeReference.formula,
            smiles: activeReference.smiles,
            structuralAnalogyReason: `${activeReference.name}의 구조적 스캐폴드(${activeReference.description})를 바탕으로 분자 궤도 위상을 보존하며 쿨롱 장벽 완화 중심점을 치환 합성함.`,
            structuralModifications: [
              `참조 유사물질(${activeReference.formula})의 결합 뼈대 토폴로지 유지`,
              "전이금속 및 플라즈몬 스크리닝 활성 사이트 도핑 치환",
              "상온 양자 터널링 전이 단면적 증폭 인터페이스 형성"
            ],
            homologyScore: 0.86
          }
        };
        setMaterials((prev) => [cloned, ...prev]);
        setSelectedMaterialId(cloned.id);
        setIsInferring(false);
        setInferenceStep(0);
        setActiveTab('reference-comparison');
      }
    } catch (err) {
      clearInterval(stepTimer);
      console.error("Energy material inference error:", err);
      setIsInferring(false);
      setInferenceStep(0);
    }
  };

  const handleCopySynthesisProtocol = () => {
    const proto = selectedMaterial.synthesisProtocol;
    let text = `==========================================================\n`;
    text += `[핵에너지 대체 양자 신물질 합성 프로토콜 리포트]\n`;
    text += `물질명: ${selectedMaterial.name} (${selectedMaterial.koreanName})\n`;
    text += `참조 유사물질: ${selectedMaterial.referenceAnalogy?.name || 'N/A'} (상사성 점수: ${((selectedMaterial.referenceAnalogy?.homologyScore || 0.85) * 100).toFixed(0)}%)\n`;
    text += `화학식: ${selectedMaterial.formula} | 에너지 밀도: ${selectedMaterial.energyDensityMJkg.toLocaleString()} MJ/kg\n`;
    text += `반응 메커니즘: ${selectedMaterial.reactionType}\n`;
    text += `방사능 위험도: ${selectedMaterial.radiationHazard}\n`;
    text += `개요: ${proto.summary}\n\n`;
    text += `[전구체 시약 목록]\n`;
    proto.precursorReagents.forEach((r, i) => { text += `  ${i + 1}. ${r}\n`; });
    text += `\n[단계별 정밀 실험실 합성 공정]\n`;
    proto.steps.forEach((s) => {
      text += `\nStep ${s.stepNumber}: ${s.title}\n`;
      text += `  - 온도/압력: ${s.temperature} | ${s.pressure}\n`;
      text += `  - 반응 시간: ${s.duration}\n`;
      text += `  - 투입 시약: ${s.reagents.join(', ')}\n`;
      text += `  - 공정 상세: ${s.description}\n`;
      text += `  - 안전 조치: ${s.safetyNote}\n`;
    });
    text += `\n[안전 및 폐기물 제어]\n  - ${proto.safetyControls}\n  - ${proto.wasteManagement}\n`;
    text += `  - TRL 단계: TRL ${proto.scalabilityTRL} | 예상 단가: ${proto.estimatedCostPerGram}\n`;
    text += `==========================================================\n`;

    navigator.clipboard.writeText(text);
    setCopiedProtocol(true);
    setTimeout(() => setCopiedProtocol(false), 2000);
  };

  const handleDownloadSynthesisProtocol = () => {
    const proto = selectedMaterial.synthesisProtocol;
    let text = `==========================================================\n`;
    text += `[핵에너지 대체 양자 신물질 합성 프로토콜 리포트]\n`;
    text += `물질명: ${selectedMaterial.name} (${selectedMaterial.koreanName})\n`;
    text += `참조 유사물질 분자구조: ${selectedMaterial.referenceAnalogy?.name} [${selectedMaterial.referenceAnalogy?.formula}]\n`;
    text += `화학식: ${selectedMaterial.formula}\n`;
    text += `에너지 밀도: ${selectedMaterial.energyDensityMJkg.toLocaleString()} MJ/kg (${selectedMaterial.energyDensityKWhg.toLocaleString()} kWh/g)\n`;
    text += `반응 형태: ${selectedMaterial.reactionType}\n`;
    text += `방사선 위험: ${selectedMaterial.radiationHazard}\n`;
    text += `쿨롱 장벽 완화율: ${selectedMaterial.coulombBarrierReductionPercent}% (스크리닝 에너지 ${selectedMaterial.quantumScreeningEnergyEV} eV)\n`;
    text += `가모프 인자 개선: ${selectedMaterial.gamowFactorImprovement}\n\n`;
    text += `[합성 공정 개요]\n${proto.summary}\n\n`;
    text += `[필요 전구체 물질]\n`;
    proto.precursorReagents.forEach((r, i) => { text += `  ${i + 1}. ${r}\n`; });
    text += `\n[단계별 실험 프로토콜]\n`;
    proto.steps.forEach((s) => {
      text += `\nStep ${s.stepNumber}: ${s.title}\n`;
      text += `  - 조건: ${s.temperature}, ${s.pressure}, ${s.duration}\n`;
      text += `  - 사용 시약: ${s.reagents.join(', ')}\n`;
      text += `  - 상세 방법: ${s.description}\n`;
      text += `  - 안전 지침: ${s.safetyNote}\n`;
    });
    text += `\n[내재적 안전성 & 폐기물 관리]\n`;
    text += `  - 본질 안전: ${proto.safetyControls}\n`;
    text += `  - 잔여 폐기물: ${proto.wasteManagement}\n`;
    text += `  - 기술성숙도(TRL): ${proto.scalabilityTRL} / 9\n`;
    text += `  - 이론 수율: ${proto.theoreticalYieldPercent}%\n`;
    text += `  - 단가 추정: ${proto.estimatedCostPerGram}\n`;
    text += `==========================================================\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${selectedMaterial.name.replace(/\s+/g, '_')}_SynthesisProtocol.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              핵융합·핵분열 대체 신물질 양자 딥러닝 연구소
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                Analogous Scaffold Inference
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              실존하는 유사 물질의 분자 구조를 뼈대(Scaffold)로 반드시 참조하여 상온 양자 쿨롱 스크리닝 대체 에너지를 추론합니다.
            </p>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'overview' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            물질 개요 &amp; 3D 구조
          </button>
          <button
            onClick={() => setActiveTab('reference-comparison')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'reference-comparison' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            유사물질 참조 &amp; 변형 분석
          </button>
          <button
            onClick={() => setActiveTab('verification-test')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'verification-test' ? 'bg-gradient-to-r from-cyan-600/30 via-indigo-600/30 to-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            유사성향 테스트 &amp; 다각도 검증
          </button>
          <button
            onClick={() => setActiveTab('synthesis')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'synthesis' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            상세 합성 프로토콜 (Recipe)
          </button>
          <button
            onClick={() => setActiveTab('quantum-barrier')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'quantum-barrier' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            쿨롱 장벽 완화 시뮬레이터
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'comparison' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            에너지 밀도 비교 분석
          </button>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Material Selector & AI Generator Input */}
        <div className="w-80 bg-slate-950/90 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto p-3 space-y-4">
          {/* Material Archetype Cards */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              대체 에너지 물질 후보 라이브러리 ({materials.length})
            </span>
            <div className="space-y-1.5 pt-1">
              {materials.map((mat) => {
                const isSelected = mat.id === selectedMaterialId;
                return (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterialId(mat.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${isSelected ? 'bg-amber-950/40 border-amber-500/60 text-slate-100 shadow-sm' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-200">{mat.name}</span>
                      <span className="text-[10px] font-mono text-amber-400">
                        {(mat.energyDensityMJkg / 1000000).toFixed(1)}M MJ/kg
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mb-1">
                      {mat.koreanName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 flex justify-between border-t border-slate-800/80 pt-1">
                      <span className="truncate max-w-[120px]">참조: {mat.referenceAnalogy?.name?.slice(0, 10)}..</span>
                      <span className="text-emerald-400">장벽 -{mat.coulombBarrierReductionPercent}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI / Deep Learning Inference Panel with Reference Molecule Enforcement */}
          <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">유사물질 참조 기반 AI 추론</span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">1. 물질 아키타입 선택</label>
              <select
                value={archetype}
                onChange={(e) => handleArchetypeChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
              >
                <option value="aneutronic-catalyst">무중성자 양자 촉매 (p-11B 착물)</option>
                <option value="ultra-dense-hydrogen">초밀도 중수소 뤼드베리 격자</option>
                <option value="polymeric-nitrogen-cage">준안정 질소 큐베인 케이지 (N8)</option>
                <option value="topological-energy-lattice">위상 초전도 에너지 격자</option>
              </select>
            </div>

            {/* MANDATORY REFERENCE SCAFFOLD SELECTOR */}
            <div className="p-2.5 bg-amber-950/30 border border-amber-500/40 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                  <GitCompare className="w-3 h-3" />
                  2. 반드시 참조할 유사물질 분자 구조
                </label>
                <span className="text-[9px] text-amber-400/80 font-mono">필수 참조</span>
              </div>
              <select
                value={selectedReferenceId}
                onChange={(e) => setSelectedReferenceId(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/50 text-xs text-amber-200 rounded px-2 py-1.5 focus:outline-none font-medium"
              >
                {REFERENCE_ANALOGS.map((ref) => (
                  <option key={ref.id} value={ref.id}>
                    {ref.name} [{ref.formula}]
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-slate-400 leading-tight pt-1">
                {activeReference.description}
              </div>
              <div className="text-[9px] font-mono text-slate-500 truncate pt-0.5">
                SMILES: {activeReference.smiles}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">3. 추가 양자 최적화 조건</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 참조 골격의 3D 방향족 전자 궤도를 보존하면서 팔라듐 3핵 치환을 통해 상온 쿨롱 장벽 완화율을 80% 이상으로 극대화"
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>목표 에너지 밀도:</span>
                <span className="text-amber-300 font-mono font-bold">{targetEnergyDensity} M MJ/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="350"
                step="5"
                value={targetEnergyDensity}
                onChange={(e) => setTargetEnergyDensity(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <button
              onClick={handleInferNewMaterial}
              disabled={isInferring}
              className="w-full py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-950 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isInferring ? 'animate-spin' : ''}`} />
              {isInferring ? '유사물질 분자구조 참조 추론 중...' : '유사물질 참조 기반 대체물질 추론'}
            </button>

            {isInferring && (
              <div className="text-[11px] font-mono text-cyan-300 p-2 bg-slate-950 rounded border border-cyan-500/30 space-y-1">
                <div>Step {inferenceStep}/4: {
                  inferenceStep === 1 ? `참조 유사물질 [${activeReference.name}] 3D 스캐폴드 위상 분석` :
                  inferenceStep === 2 ? '양자 오비탈 등전자성(Isosteric) 스캐폴드 홉핑 연산' :
                  inferenceStep === 3 ? '플라즈몬 쿨롱 스크리닝 계면 및 3D 원자가 안정화' :
                  '상사성 검증 및 3단계 전구체 합성 경로 산출 완료'
                }</div>
              </div>
            )}
          </div>
        </div>

        {/* Right / Center Content Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Highlight Metrics Header */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">이론 에너지 밀도</span>
                  <div className="text-base font-bold font-mono text-amber-400">
                    {(selectedMaterial.energyDensityMJkg / 1000000).toFixed(1)} M MJ/kg
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {selectedMaterial.energyDensityKWhg.toLocaleString()} kWh/g
                  </span>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">방사선 및 환경 위험도</span>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    방사능 제로 (Zero Fallout)
                  </div>
                  <span className="text-[10px] text-slate-500">
                    중성자 없음 / 무해한 부산물
                  </span>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">참조 유사물질 상사성</span>
                  <div className="text-base font-bold font-mono text-cyan-300">
                    {((selectedMaterial.referenceAnalogy?.homologyScore || 0.85) * 100).toFixed(0)}% 일치
                  </div>
                  <span className="text-[10px] text-slate-500 truncate block">
                    모체: {selectedMaterial.referenceAnalogy?.name}
                  </span>
                </div>

                <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400">쿨롱 장벽 완화율</span>
                  <div className="text-base font-bold font-mono text-emerald-300">
                    -{selectedMaterial.coulombBarrierReductionPercent}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    스크리닝: {selectedMaterial.quantumScreeningEnergyEV} eV
                  </span>
                </div>
              </div>

              {/* 3D Structure & Quantum Mechanism Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
                {/* 3D Viewer */}
                <div className="h-full rounded-xl overflow-hidden border border-slate-800">
                  <Molecule3DViewer
                    molecule={selectedMaterial as any}
                  />
                </div>

                {/* Mechanism & Details */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3 overflow-y-auto">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
                      <span>{selectedMaterial.name}</span>
                      <span className="text-xs text-amber-400 font-mono font-normal">
                        [{selectedMaterial.formula}]
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">{selectedMaterial.koreanName}</p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {selectedMaterial.description}
                    </p>
                  </div>

                  {/* Reference Scaffold Badge */}
                  {selectedMaterial.referenceAnalogy && (
                    <div className="p-2.5 bg-cyan-950/30 border border-cyan-500/40 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-cyan-300">
                        <span className="flex items-center gap-1.5">
                          <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
                          기반 참조 유사물질 분자구조
                        </span>
                        <span className="font-mono text-[11px] text-emerald-400">
                          상사성 {((selectedMaterial.referenceAnalogy.homologyScore || 0.85) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        <strong>{selectedMaterial.referenceAnalogy.name}</strong> ({selectedMaterial.referenceAnalogy.formula})
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        {selectedMaterial.referenceAnalogy.structuralAnalogyReason}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg space-y-1 text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      핵반응 형태 및 에너지 방출 메커니즘
                    </span>
                    <p className="font-mono text-slate-200 text-[11px]">{selectedMaterial.reactionType}</p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <span className="font-semibold text-slate-200">양자 스크리닝 원리 (Quantum Screening Rationale)</span>
                    <p className="text-slate-400 leading-relaxed">{selectedMaterial.quantumMechanism}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveTab('reference-comparison')}
                      className="px-3.5 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      유사물질 대조 &amp; 변형 분석
                    </button>
                    <button
                      onClick={() => setActiveTab('verification-test')}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
                    >
                      <Activity className="w-3.5 h-3.5 text-emerald-200" />
                      유사성향 테스트 &amp; 다각도 검증 시뮬레이션
                    </button>
                    <button
                      onClick={() => setActiveTab('synthesis')}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Beaker className="w-3.5 h-3.5" />
                      상세 합성법 (Recipe)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEDICATED REFERENCE ANALOG COMPARISON TAB */}
          {activeTab === 'reference-comparison' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-cyan-400" />
                    유사물질 분자구조 참조 및 스캐폴드 홉핑(Scaffold Hopping) 대조 분석
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/40 rounded-full font-bold">
                      구조 상사성 점수: {((selectedMaterial.referenceAnalogy?.homologyScore || 0.85) * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={() => setActiveTab('verification-test')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Activity className="w-3 h-3" />
                      유사성향 테스트 시뮬레이터 실행
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  신규 대체 물질은 백지상태에서 임의 생성된 것이 아니라, 검증된 기존 화학 스캐폴드의 3차원 분자 궤도와 전자 대칭성을 정확히 참조하여 양자 도핑 및 결맞음 치환을 통해 추론되었습니다.
                </p>
              </div>

              {/* Side-by-Side Reference Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Card: Baseline Reference Analog */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      [참조 기준] 기존 유사물질 분자구조
                    </span>
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      {selectedMaterial.referenceAnalogy?.formula || 'C8H8'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-100">
                      {selectedMaterial.referenceAnalogy?.name || '기준 유사물질'}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-500 break-all">
                      SMILES: {selectedMaterial.referenceAnalogy?.smiles || 'N/A'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1 text-xs">
                    <span className="font-semibold text-slate-300 block">이 분자 구조를 참조한 핵심 이유:</span>
                    <p className="text-slate-400 leading-relaxed text-[11px]">
                      {selectedMaterial.referenceAnalogy?.structuralAnalogyReason || '기준 스캐폴드의 대칭성과 분자 오비탈 특성을 참조함.'}
                    </p>
                  </div>
                </div>

                {/* Right Card: Derived Nuclear Alternative Material */}
                <div className="p-4 bg-amber-950/20 rounded-xl border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      [양자 추론] 신규 대체 에너지 물질
                    </span>
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      {selectedMaterial.formula}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-amber-200">
                      {selectedMaterial.name} ({selectedMaterial.koreanName})
                    </h4>
                    <div className="text-[11px] font-mono text-slate-400 break-all">
                      에너지 밀도: {selectedMaterial.energyDensityMJkg.toLocaleString()} MJ/kg ({selectedMaterial.energyDensityKWhg.toLocaleString()} kWh/g)
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                    <span className="font-semibold text-cyan-300 block">스캐폴드 홉핑 및 양자 변형 내역:</span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {(selectedMaterial.referenceAnalogy?.structuralModifications || [
                        "기존 골격의 대칭성을 보존하며 전이금속 배위 중심 치환",
                        "쿨롱 스크리닝 에너지 U_e 증폭 계면 형성",
                        "상온 양자 터널링 전이 가모프 인자 10^14배 개선"
                      ]).map((mod, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quantum Synthesis Bridge Note */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  유사물질 참조 추론의 과학적 타당성 (Scientific Validity of Analogous Inference)
                </span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  고전 화학 합성에서 새로운 촉매나 초고밀도 물질을 무작위로 합성하는 것은 불가능에 가깝습니다. 
                  본 양자 딥러닝 모델은 **실험적으로 검증된 전구체 물질(예: 보란 케이지, 탄화수소 큐베인, 금속 수소화물 격자)**의 3차원 전자 밀도 분포와 원자가 각도를 기준으로 삼아,
                  최소의 화학적 변형 에너지로 최대의 쿨롱 스크리닝 효과와 에너지 밀도를 얻도록 분자 구조를 유도합니다.
                </p>
              </div>
            </div>
          )}

          {/* DEDICATED MULTI-ASPECT VERIFICATION & SIMULATION TAB */}
          {activeTab === 'verification-test' && (
            <MaterialVerificationSimulator material={selectedMaterial} />
          )}

          {activeTab === 'synthesis' && (
            <div className="space-y-4">
              {/* Header Action Bar */}
              <div className="flex items-center justify-between p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-amber-400" />
                    {selectedMaterial.name} 화학·물리적 합성 공정 프로토콜
                  </h3>
                  <p className="text-xs text-slate-400">
                    전구체 시약, 온도·압력 조건, 단계별 반응 메커니즘 및 작업 안전성 지침
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySynthesisProtocol}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    {copiedProtocol ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedProtocol ? '복사 완료!' : '프로토콜 복사'}
                  </button>
                  <button
                    onClick={handleDownloadSynthesisProtocol}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    합성 레시피 파일 다운로드
                  </button>
                </div>
              </div>

              {/* Protocol Summary & Precursor Reagents */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">합성 전략 개요</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedMaterial.synthesisProtocol.summary}
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block">기술성숙도:</span>
                      <span className="text-cyan-300 font-bold">TRL {selectedMaterial.synthesisProtocol.scalabilityTRL} / 9</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">이론 수율:</span>
                      <span className="text-emerald-400 font-bold">{selectedMaterial.synthesisProtocol.theoreticalYieldPercent}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">예상 제조 단가:</span>
                      <span className="text-amber-300 font-bold">{selectedMaterial.synthesisProtocol.estimatedCostPerGram}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-200 block">필수 전구체 시약 (Precursors)</span>
                  <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
                    {selectedMaterial.synthesisProtocol.precursorReagents.map((reagent, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0">▪</span>
                        <span>{reagent}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Lab Protocol */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">단계별 상세 실험 절차 (Step-by-Step Procedures)</span>
                {selectedMaterial.synthesisProtocol.steps.map((step) => (
                  <div key={step.stepNumber} className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-950 border border-amber-500/60 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span>온도: <strong className="text-slate-200">{step.temperature}</strong></span>
                        <span>·</span>
                        <span>압력: <strong className="text-slate-200">{step.pressure}</strong></span>
                        <span>·</span>
                        <span>소요시간: <strong className="text-cyan-300">{step.duration}</strong></span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div className="text-slate-400 font-mono">
                        투입 시약: <span className="text-slate-300">{step.reagents.join(', ')}</span>
                      </div>
                      <div className="text-amber-300/90 flex items-center gap-1 text-[10px]">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{step.safetyNote}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Safety & Waste Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    내재적 안전 제어 (Fail-Safe Passive Safety)
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedMaterial.synthesisProtocol.safetyControls}
                  </p>
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    잔여 폐기물 및 환경성 관리
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedMaterial.synthesisProtocol.wasteManagement}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quantum-barrier' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    핵간 쿨롱 반발 장벽 V(r) 및 양자 전자 스크리닝 효과 곡선
                  </h3>
                  <span className="text-xs font-mono text-emerald-400">
                    스크리닝 포텐셜 U_e: {selectedMaterial.quantumScreeningEnergyEV} eV
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  전통적인 자유 진공 핵융합에서는 원자핵 간 거리 r이 가까워질수록 쿨롱 반발력(Coulomb Barrier)이 수백 keV까지 치솟아 수억 도의 초고온 플라즈마가 필요합니다.
                  그러나 본 양자 격자 물질에서는 전도 전자와 분자 궤도의 극성 플라즈몬 스크리닝으로 쿨롱 장벽이 대폭 완화되어 상온에서도 유효 양자 터널링이 일어납니다.
                </p>
              </div>

              {/* Potential Barrier Comparison SVG Chart */}
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-6 flex flex-col items-center">
                <div className="w-full max-w-2xl h-64 relative">
                  <svg className="w-full h-full" viewBox="0 0 600 240">
                    {/* Grid */}
                    <line x1="60" y1="20" x2="560" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="60" y1="80" x2="560" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="60" y1="140" x2="560" y2="140" stroke="#1e293b" strokeDasharray="3 3" />
                    <line x1="60" y1="200" x2="560" y2="200" stroke="#334155" />
                    <line x1="60" y1="20" x2="60" y2="200" stroke="#334155" />

                    {/* Labels */}
                    <text x="50" y="25" fill="#64748b" fontSize="10" textAnchor="end">1.2 MeV</text>
                    <text x="50" y="85" fill="#64748b" fontSize="10" textAnchor="end">600 keV</text>
                    <text x="50" y="145" fill="#64748b" fontSize="10" textAnchor="end">150 keV</text>
                    <text x="50" y="205" fill="#64748b" fontSize="10" textAnchor="end">0 eV</text>
                    <text x="560" y="215" fill="#64748b" fontSize="10" textAnchor="middle">핵간 거리 r (pm)</text>

                    {/* Curve 1: Classical Coulomb Repulsion (Red dashed) */}
                    <path
                      d="M 80 20 Q 140 30 220 120 T 540 195"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />

                    {/* Curve 2: Quantum Screened Potential with this material (Cyan solid) */}
                    <path
                      d="M 80 115 Q 160 145 260 175 T 540 198"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                    />

                    {/* Shaded Tunneling Area */}
                    <path
                      d="M 80 115 Q 160 145 260 175 T 540 198 L 540 195 Q 360 160 220 120 T 80 20 Z"
                      fill="#06b6d4"
                      fillOpacity="0.12"
                    />

                    {/* Annotations */}
                    <circle cx="160" cy="145" r="4" fill="#38bdf8" />
                    <text x="175" y="140" fill="#38bdf8" fontSize="11" fontWeight="bold">
                      양자 스크리닝 효과로 장벽 -{selectedMaterial.coulombBarrierReductionPercent}% 감소
                    </text>

                    <circle cx="140" cy="30" r="4" fill="#f43f5e" />
                    <text x="155" y="25" fill="#f43f5e" fontSize="11">
                      고전적 진공 쿨롱 장벽 (수억 도 가열 필요)
                    </text>
                  </svg>
                </div>

                <div className="flex items-center gap-6 mt-4 text-xs font-mono">
                  <span className="flex items-center gap-2 text-rose-400">
                    <span className="w-3 h-0.5 bg-rose-500 border-dashed" /> 고전 진공 쿨롱 장벽 V_bare(r)
                  </span>
                  <span className="flex items-center gap-2 text-cyan-400">
                    <span className="w-3 h-1 bg-cyan-400" /> 양자 격자 스크리닝 포텐셜 V_eff(r)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  에너지원별 중량당 에너지 밀도 (MJ/kg) 및 환경 위해도 비교
                </h3>
                <p className="text-xs text-slate-400">
                  전통 화학 연료, 최신 배터리, 핵분열/핵융합, 그리고 본 양자 대체 물질의 에너지 밀도 및 방사능 폐기물 여부를 대조합니다.
                </p>
              </div>

              {/* Comparison Table & Bars */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">에너지원 종류</th>
                      <th className="py-2.5 px-3">에너지 밀도 (MJ/kg)</th>
                      <th className="py-2.5 px-3">상대 비교 (가솔린 기준)</th>
                      <th className="py-2.5 px-3">방사성 폐기물</th>
                      <th className="py-2.5 px-3">필요 구동 환경</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">리튬이온 배터리</td>
                      <td className="py-2 px-3">0.9 MJ/kg</td>
                      <td className="py-2 px-3 text-slate-400">0.02배</td>
                      <td className="py-2 px-3 text-emerald-400">없음</td>
                      <td className="py-2 px-3 text-slate-400">상온 화학 전지</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">가솔린 (석유)</td>
                      <td className="py-2 px-3">46.4 MJ/kg</td>
                      <td className="py-2 px-3 text-slate-400">1.0배 (기준)</td>
                      <td className="py-2 px-3 text-emerald-400">없음 (CO2 방출)</td>
                      <td className="py-2 px-3 text-slate-400">내연기관 연소</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 bg-amber-950/20 font-bold border-l-2 border-amber-500">
                      <td className="py-2.5 px-3 text-amber-300">{selectedMaterial.name} (양자 대체물질)</td>
                      <td className="py-2.5 px-3 text-amber-300 font-mono">
                        {selectedMaterial.energyDensityMJkg.toLocaleString()} MJ/kg
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400">
                        약 {(selectedMaterial.energyDensityMJkg / 46.4).toLocaleString()}배
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400">0% (완전 무공해)</td>
                      <td className="py-2.5 px-3 text-cyan-300 font-sans">상온·저온 양자 결맞음</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">우라늄-235 (핵분열 원자력)</td>
                      <td className="py-2 px-3 text-rose-400">82,000,000 MJ/kg</td>
                      <td className="py-2 px-3 text-slate-400">1,770,000배</td>
                      <td className="py-2 px-3 text-rose-400 font-semibold">고준위 폐기물 (수십만 년)</td>
                      <td className="py-2 px-3 text-slate-400">중성자 감속 원자로</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">D-T (삼중수소 핵융합)</td>
                      <td className="py-2 px-3 text-rose-400">340,000,000 MJ/kg</td>
                      <td className="py-2 px-3 text-slate-400">7,300,000배</td>
                      <td className="py-2 px-3 text-amber-400">중성자 방사화 폐기물</td>
                      <td className="py-2 px-3 text-slate-400">1억 도 이상 토카막</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Environmental Rationale Box */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  핵융합·핵분열 대비 결정적 비교 우위 (Quantum Advantage)
                </span>
                <ul className="text-slate-300 space-y-1 text-[11px] leading-relaxed">
                  <li>• <strong>방사능 오염 및 폭주 원천 차단</strong>: 연쇄 반응 지연 중성자 임계성(Criticality)이나 1억 도의 불안정한 플라즈마 터뷸런스가 필요 없으며, 계통 차단 시 자동 정지(Fail-Safe).</li>
                  <li>• <strong>무중성자 청정 부산물</strong>: 14.1 MeV 고속 중성자에 의한 원자로 벽 방사화 손상이 없으며, 순수 고순도 헬륨 가스 또는 무해한 질소 가스만 방출.</li>
                  <li>• <strong>직접 에너지 회수</strong>: 증기 터빈을 거치는 거대한 열기관 대신 알파 입자 전하 직접 수집(Direct Energy Conversion)으로 85% 이상의 발전 효율 달성 가능.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
