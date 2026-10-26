import React, { useState } from 'react';
import { 
  LITHIUM_ISOTOPE_SYSTEMS, 
  HYDROGEN_ISOTOPE_SYSTEMS, 
  IsotopeSystemComparison 
} from '../data/isotopeComparisonData';
import { Molecule3DViewer } from './Molecule3DViewer';
import { Molecule } from '../types/quantum';
import { 
  Activity, 
  Compass, 
  Download, 
  Copy, 
  Check, 
  TrendingUp, 
  GitCompare, 
  Flame, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface IsotopeQuantumLabProps {
  onLoadIntoMainViewer?: (molecule: Molecule) => void;
}

export const IsotopeQuantumLab: React.FC<IsotopeQuantumLabProps> = ({ onLoadIntoMainViewer }) => {
  const [activeSubTab, setActiveSubTab] = useState<'lithium-system' | 'hydrogen-system'>('lithium-system');
  const [selectedLithiumId, setSelectedLithiumId] = useState<string>('lithium-deuteride-lid');
  const [selectedHydrogenId, setSelectedHydrogenId] = useState<string>('deuterium-d2');
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  const selectedLithium = LITHIUM_ISOTOPE_SYSTEMS.find(s => s.id === selectedLithiumId) || LITHIUM_ISOTOPE_SYSTEMS[2];
  const selectedHydrogen = HYDROGEN_ISOTOPE_SYSTEMS.find(s => s.id === selectedHydrogenId) || HYDROGEN_ISOTOPE_SYSTEMS[1];

  const handleCopyReport = () => {
    let text = `==========================================================\n`;
    text += `[QuantumMol AI - 동위원소 양자 역학 및 결정/분자 구조 비교 리포트]\n\n`;

    text += `[1. 리튬 동위원소 계열: 일반 리튬(Li) vs 수소화 리튬(LiH) vs 중수소화 리튬(LiD)]\n`;
    LITHIUM_ISOTOPE_SYSTEMS.forEach(sys => {
      text += `\n* ${sys.name} (${sys.koreanName})\n`;
      text += `  - 화학식: ${sys.formula} | 결합 유형: ${sys.bondingType}\n`;
      text += `  - 결합 거리/격자 상수: ${sys.meanBondLengthAngstrom} Å | 융점: ${sys.meltingPointCelsius}°C\n`;
      text += `  - 환산 질량(μ): ${sys.reducedMassAmu} amu | 포논 진동수: ${sys.vibrationalFrequencyCm1} cm⁻¹\n`;
      text += `  - 영점 진동 에너지(ZPE): ${sys.zeroPointEnergyKjMol} kJ/mol | 결합 해리 에너지: ${sys.dissociationEnergyEv} eV\n`;
      text += `  - 양자역학적 해석: ${sys.quantumMechanicsSummary}\n`;
    });

    text += `\n----------------------------------------------------------\n`;
    text += `[2. 수소 동위원소 계열: 경수소(H₂) vs 중수소(D₂) vs 삼중수소(T₂)]\n`;
    HYDROGEN_ISOTOPE_SYSTEMS.forEach(sys => {
      text += `\n* ${sys.name} (${sys.koreanName})\n`;
      text += `  - 핵 질량 합계: ${sys.nuclearMassTotalAmu} amu | 환산 질량(μ): ${sys.reducedMassAmu} amu\n`;
      text += `  - 기본 진동수(ν₀): ${sys.vibrationalFrequencyCm1} cm⁻¹ (진동수 비율 1 : 1/√2 : 1/√3)\n`;
      text += `  - 영점 진동 에너지(ZPE): ${sys.zeroPointEnergyKjMol} kJ/mol (${(sys.zeroPointEnergyKjMol / 96.485).toFixed(3)} eV)\n`;
      text += `  - 결합 해리 에너지(D₀ = De - ZPE): ${sys.dissociationEnergyEv} eV\n`;
      text += `  - 평균 결합 길이(r₀): ${sys.meanBondLengthAngstrom} Å (비조화성으로 인해 H₂ > D₂ > T₂)\n`;
      text += `  - 양자역학적 해석: ${sys.quantumMechanicsSummary}\n`;
    });
    text += `==========================================================\n`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadJson = () => {
    const data = {
      meta: {
        title: "QuantumMol AI Isotope Quantum Mechanics Certificate",
        timestamp: new Date().toISOString(),
      },
      lithiumIsotopeSystems: LITHIUM_ISOTOPE_SYSTEMS,
      hydrogenIsotopeSystems: HYDROGEN_ISOTOPE_SYSTEMS
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `Isotope_Quantum_Comparison_Report.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendToMain = (sys: IsotopeSystemComparison) => {
    if (!onLoadIntoMainViewer) return;
    const mol: Molecule = {
      id: `iso-${sys.id}-${Date.now()}`,
      name: sys.name,
      commonName: sys.koreanName,
      formula: sys.formula,
      smiles: sys.formula,
      description: sys.description,
      quantumRationale: sys.quantumMechanicsSummary,
      atoms: sys.atoms,
      bonds: sys.bonds,
      quantumProperties: sys.quantumProperties,
      deepLearningMetrics: {
        qganDiscriminatorLoss: 0.01,
        generatorFidelity: 0.99,
        valenceValidityRate: 1.0,
        sascore: 1.5,
        qedScore: 0.85,
        logP: 0.1,
        molecularWeight: sys.nuclearMassTotalAmu
      },
      suggestedApplications: [
        `환산 질량(μ = ${sys.reducedMassAmu} amu)에 의한 ZPE = ${sys.zeroPointEnergyKjMol} kJ/mol 해석`,
        `기본 진동수 ${sys.vibrationalFrequencyCm1} cm⁻¹ 분광학적 동위원소 시프트`,
        `${sys.bondingType} 기반 결합 에너지 분석`
      ],
      synthesisRouteSummary: `${sys.koreanName}의 동위원소 치환 및 초고순도 기체/결정 합성 경로`,
      quantumCircuitConfig: {
        numQubits: sys.quantumProperties.qubitsRequired,
        depth: 16,
        ansatzType: 'RyRz',
        parameters: [-0.42, 1.25, 0.88, -1.10]
      }
    };
    onLoadIntoMainViewer(mol);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Top Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              동위원소 양자 역학 &amp; 분자/결정 구조 비교 연구소
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                Isotope Quantum Mechanics Lab
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              일반 리튬(Li) vs 중수소화 리튬(LiD) vs 수소화 리튬(LiH), 그리고 수소(H₂) vs 중수소(D₂) vs 삼중수소(T₂)의 환산질량(μ), 영점 진동 에너지(ZPE), 격자 수축 및 해리 에너지를 정밀 비교합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveSubTab('lithium-system')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'lithium-system' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              리튬 동위원소 계열 (Li vs LiH vs LiD)
            </button>
            <button
              onClick={() => setActiveSubTab('hydrogen-system')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'hydrogen-system' 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              수소 동위원소 계열 (H₂ vs D₂ vs T₂)
            </button>
          </div>

          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedReport ? '복사됨' : '리포트 복사'}</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON 다운로드</span>
          </button>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
        {/* SUBTAB 1: Lithium System (Li metal vs LiH vs LiD) */}
        {activeSubTab === 'lithium-system' && (
          <div className="space-y-4">
            {/* 3-Way Comparative Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {LITHIUM_ISOTOPE_SYSTEMS.map((sys) => {
                const isSelected = selectedLithiumId === sys.id;
                return (
                  <button
                    key={sys.id}
                    onClick={() => setSelectedLithiumId(sys.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all space-y-2 relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/70 shadow-lg shadow-amber-950/60 ring-1 ring-amber-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {sys.formula}
                        </span>
                        <span className="text-xs font-mono text-amber-400 font-bold">
                          {sys.meltingPointCelsius}°C
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mt-1">
                        {sys.name}
                      </h4>
                      <p className="text-[11px] text-amber-300 font-medium">
                        {sys.koreanName}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {sys.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block">결합 거리:</span>
                        <span className="text-cyan-300 font-bold">{sys.meanBondLengthAngstrom} Å</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">영점 에너지:</span>
                        <span className="text-emerald-400 font-bold">{sys.zeroPointEnergyKjMol} kJ/mol</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected System Split: 3D View + Physics Breakdown */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* 3D Visualizer */}
              <div className="xl:col-span-6 h-[400px] bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
                <Molecule3DViewer
                  molecule={{
                    id: selectedLithium.id,
                    name: selectedLithium.name,
                    commonName: selectedLithium.koreanName,
                    formula: selectedLithium.formula,
                    smiles: selectedLithium.formula,
                    description: selectedLithium.description,
                    quantumRationale: selectedLithium.quantumMechanicsSummary,
                    atoms: selectedLithium.atoms,
                    bonds: selectedLithium.bonds,
                    quantumProperties: selectedLithium.quantumProperties,
                    deepLearningMetrics: {
                      qganDiscriminatorLoss: 0.01,
                      generatorFidelity: 0.99,
                      valenceValidityRate: 1.0,
                      sascore: 1.5,
                      qedScore: 0.85,
                      logP: 0.1,
                      molecularWeight: selectedLithium.nuclearMassTotalAmu
                    },
                    quantumCircuitConfig: {
                      numQubits: selectedLithium.quantumProperties.qubitsRequired,
                      depth: 16,
                      ansatzType: 'RyRz',
                      parameters: [0.1, 0.2, 0.3, 0.4]
                    },
                    suggestedApplications: [
                      `${selectedLithium.koreanName} 결정 격자 특성 분석`,
                      `환산 질량 μ = ${selectedLithium.reducedMassAmu} amu 포논 시프트`,
                      `우벨로데 효과 (r₀ = ${selectedLithium.meanBondLengthAngstrom} Å)`
                    ],
                    synthesisRouteSummary: `${selectedLithium.name} 단결정 및 고순도 박막 합성 경로`
                  }}
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-amber-300 border border-slate-700">
                  3D 격자/분자 구조: {selectedLithium.formula}
                </div>
                {onLoadIntoMainViewer && (
                  <button
                    onClick={() => handleSendToMain(selectedLithium)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-amber-600/90 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-md"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    메인 3D 분자 뷰어로 전송
                  </button>
                )}
              </div>

              {/* Quantum Mechanics and Isotope Shifts */}
              <div className="xl:col-span-6 p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      {selectedLithium.bondingType}
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      환산 질량 μ = {selectedLithium.reducedMassAmu} amu
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    {selectedLithium.name} ({selectedLithium.koreanName})
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {selectedLithium.quantumMechanicsSummary}
                  </p>
                </div>

                {/* Key Isotope Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">결합 거리 (r₀):</span>
                    <span className="text-cyan-300 font-bold text-sm">{selectedLithium.meanBondLengthAngstrom} Å</span>
                    <span className="text-[10px] text-slate-500 block">우벨로데 수축 효과</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">영점 에너지 (ZPE):</span>
                    <span className="text-emerald-400 font-bold text-sm">{selectedLithium.zeroPointEnergyKjMol} kJ/mol</span>
                    <span className="text-[10px] text-slate-500 block">E₀ = ½ ℏω</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">기본 진동수 (ν):</span>
                    <span className="text-amber-300 font-bold text-sm">{selectedLithium.vibrationalFrequencyCm1} cm⁻¹</span>
                    <span className="text-[10px] text-slate-500 block">광학 포논 분산</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">결합 해리/응집 에너지:</span>
                    <span className="text-indigo-400 font-bold text-sm">{selectedLithium.dissociationEnergyEv} eV</span>
                    <span className="text-[10px] text-slate-500 block">융점: {selectedLithium.meltingPointCelsius}°C</span>
                  </div>
                </div>

                {/* Comparative Summary Callout */}
                <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-500/40 text-xs space-y-1">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <GitCompare className="w-3.5 h-3.5 text-amber-400" />
                    핵심 물리 차이점 (Li 금속 vs LiH vs LiD):
                  </span>
                  <ul className="text-[11px] text-slate-300 space-y-1">
                    <li>▪ <strong>일반 Li 금속</strong>: 체심입방(BCC) 금속 결합으로 자유전자 가스가 열과 전기를 수송 (융점 180.5°C).</li>
                    <li>▪ <strong>수소화 리튬(LiH)</strong>: 암염(NaCl)형 면심입방 이온 결정 (Li⁺와 H⁻). 가벼운 H 원자로 인해 ZPE(8.42 kJ/mol)가 큼.</li>
                    <li>▪ <strong>중수소화 리튬(LiD)</strong>: 중성자가 추가되어 질량이 2배가 됨에 따라 환산질량 증가로 진동수(430 cm⁻¹) 및 ZPE(6.08 kJ/mol)가 감소. 우벨로데 효과로 격자 상수가 미세 수축(2.039 Å)되고 융점이 691°C로 상승함.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: Hydrogen Isotope System (H2 vs D2 vs T2) */}
        {activeSubTab === 'hydrogen-system' && (
          <div className="space-y-4">
            {/* 3-Way Comparative Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HYDROGEN_ISOTOPE_SYSTEMS.map((sys) => {
                const isSelected = selectedHydrogenId === sys.id;
                return (
                  <button
                    key={sys.id}
                    onClick={() => setSelectedHydrogenId(sys.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all space-y-2 relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/70 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {sys.formula}
                        </span>
                        <span className="text-xs font-mono text-cyan-400 font-bold">
                          {sys.vibrationalFrequencyCm1.toFixed(1)} cm⁻¹
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-100 mt-1">
                        {sys.name}
                      </h4>
                      <p className="text-[11px] text-cyan-300 font-medium">
                        {sys.koreanName}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {sys.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block">영점 에너지:</span>
                        <span className="text-emerald-400 font-bold">{sys.zeroPointEnergyKjMol} kJ/mol</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">해리 에너지 D₀:</span>
                        <span className="text-cyan-300 font-bold">{sys.dissociationEnergyEv} eV</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected System Split: 3D Diatomic Molecule + Potential Well Diagram */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* 3D Diatomic Visualizer */}
              <div className="xl:col-span-6 h-[400px] bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
                <Molecule3DViewer
                  molecule={{
                    id: selectedHydrogen.id,
                    name: selectedHydrogen.name,
                    commonName: selectedHydrogen.koreanName,
                    formula: selectedHydrogen.formula,
                    smiles: selectedHydrogen.formula,
                    description: selectedHydrogen.description,
                    quantumRationale: selectedHydrogen.quantumMechanicsSummary,
                    atoms: selectedHydrogen.atoms,
                    bonds: selectedHydrogen.bonds,
                    quantumProperties: selectedHydrogen.quantumProperties,
                    deepLearningMetrics: {
                      qganDiscriminatorLoss: 0.01,
                      generatorFidelity: 0.99,
                      valenceValidityRate: 1.0,
                      sascore: 1.0,
                      qedScore: 0.90,
                      logP: 0.0,
                      molecularWeight: selectedHydrogen.nuclearMassTotalAmu
                    },
                    quantumCircuitConfig: {
                      numQubits: 2,
                      depth: 10,
                      ansatzType: 'RyRz',
                      parameters: [0.1, 0.2]
                    },
                    suggestedApplications: [
                      `${selectedHydrogen.koreanName} 이원자 분자 진동 해석`,
                      `영점 진동 에너지(ZPE = ${selectedHydrogen.zeroPointEnergyKjMol} kJ/mol) 분석`,
                      `동위원소 해리 에너지 D₀ = ${selectedHydrogen.dissociationEnergyEv} eV`
                    ],
                    synthesisRouteSummary: `${selectedHydrogen.name} 분자성 기체 정제 및 극저온 분별 증류`
                  }}
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-cyan-300 border border-slate-700">
                  3D 이원자 분자: {selectedHydrogen.formula} (결합길이: {selectedHydrogen.meanBondLengthAngstrom} Å)
                </div>
                {onLoadIntoMainViewer && (
                  <button
                    onClick={() => handleSendToMain(selectedHydrogen)}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-cyan-600/90 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md shadow-md"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    메인 3D 분자 뷰어로 전송
                  </button>
                )}
              </div>

              {/* Quantum Potential Well Diagram & Energy Levels */}
              <div className="xl:col-span-6 p-4 bg-slate-900/70 rounded-xl border border-slate-800 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      환산 질량 μ = {selectedHydrogen.reducedMassAmu} amu
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      진동수 ν = {selectedHydrogen.vibrationalFrequencyCm1.toFixed(1)} cm⁻¹
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    {selectedHydrogen.name} ({selectedHydrogen.koreanName})
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {selectedHydrogen.quantumMechanicsSummary}
                  </p>
                </div>

                {/* Born-Oppenheimer Potential Well Diagram SVG */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">보른-오펜하이머 퍼텐셜 우물 V(r) &amp; 동위원소 ZPE 준위</span>
                    <span className="text-cyan-400 font-bold">D₀ = {selectedHydrogen.dissociationEnergyEv} eV</span>
                  </div>

                  <div className="h-32 w-full">
                    <svg className="w-full h-full" viewBox="0 0 400 130">
                      {/* Zero Energy reference */}
                      <line x1="20" y1="20" x2="390" y2="20" stroke="#334155" strokeDasharray="3 3" />
                      <text x="390" y="16" fill="#64748b" fontSize="8" textAnchor="end">V(∞) = 0 eV</text>

                      {/* Morse Potential Curve */}
                      <path
                        d="M 60 15 Q 80 120 130 120 T 260 35 T 390 22"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="2"
                      />

                      {/* Equilibrium well bottom */}
                      <text x="130" y="128" fill="#64748b" fontSize="8" textAnchor="middle">r_e = 0.741 Å</text>

                      {/* H2 Level (High ZPE, 26.3 kJ/mol) */}
                      <line x1="95" y1="100" x2="175" y2="100" stroke="#f43f5e" strokeWidth="2" />
                      <text x="180" y="103" fill="#f43f5e" fontSize="9" fontWeight="bold">H₂ (ZPE=26.3 kJ)</text>

                      {/* D2 Level (Mid ZPE, 18.6 kJ/mol) */}
                      <line x1="102" y1="107" x2="168" y2="107" stroke="#06b6d4" strokeWidth="2" />
                      <text x="175" y="110" fill="#06b6d4" fontSize="9" fontWeight="bold">D₂ (ZPE=18.6 kJ)</text>

                      {/* T2 Level (Low ZPE, 15.2 kJ/mol) */}
                      <line x1="108" y1="113" x2="162" y2="113" stroke="#10b981" strokeWidth="2" />
                      <text x="170" y="116" fill="#10b981" fontSize="9" fontWeight="bold">T₂ (ZPE=15.2 kJ)</text>
                    </svg>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    전자의 전하량(Z=1)이 동일하므로 전자 퍼텐셜 우물 곡선 V(r)은 3개 동위원소 모두 100% 동일하지만, 핵 질량이 무거울수록 우물 바닥에 더 깊이 위치하여 해리 에너지(D₀)가 커집니다.
                  </p>
                </div>

                {/* Physics Comparison Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">진동수 비율 (ν):</span>
                    <span className="text-cyan-300 font-bold">1 : 0.71 : 0.58</span>
                    <span className="text-[9px] text-slate-500 block">≈ 1 : 1/√2 : 1/√3</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">평균 결합 길이:</span>
                    <span className="text-emerald-400 font-bold">{selectedHydrogen.meanBondLengthAngstrom} Å</span>
                    <span className="text-[9px] text-slate-500 block">H₂ &gt; D₂ &gt; T₂</span>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">동위원소 효과 (KIE):</span>
                    <span className="text-amber-300 font-bold">k_H / k_D ≈ 6.5</span>
                    <span className="text-[9px] text-slate-500 block">C-H 반응 속도비</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
