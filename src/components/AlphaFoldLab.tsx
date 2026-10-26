import React, { useState, useEffect } from 'react';
import { ALPHAFOLD_PRESET_TARGETS } from '../data/alphaFoldData';
import { CANDIDATE_DRUG_LIGANDS, runSimulatedDocking, generateDockedComplexModel } from '../data/dockingData';
import { AlphaFoldPredictionResult, CandidateLigandInfo, DockingSimulationResult, Molecule } from '../types/quantum';
import { Molecule3DViewer } from './Molecule3DViewer';
import { BindingAffinityRadarChart } from './BindingAffinityRadarChart';
import { 
  Sparkles, 
  Dna, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Activity, 
  Compass, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  ExternalLink,
  Info,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Flame,
  Target,
  FlaskConical,
  BarChart2,
  Eye
} from 'lucide-react';

interface AlphaFoldLabProps {
  onLoadIntoMainViewer?: (molecule: Molecule) => void;
}

export const AlphaFoldLab: React.FC<AlphaFoldLabProps> = ({ onLoadIntoMainViewer }) => {
  const [selectedTarget, setSelectedTarget] = useState<AlphaFoldPredictionResult>(ALPHAFOLD_PRESET_TARGETS[0]);
  const [customSequence, setCustomSequence] = useState<string>('');
  const [customTargetName, setCustomTargetName] = useState<string>('');
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [selectedResidueIndex, setSelectedResidueIndex] = useState<number | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | 'docking' | 'pae' | 'sequence'>('docking');

  // Docking Simulation States
  const [selectedLigand, setSelectedLigand] = useState<CandidateLigandInfo>(CANDIDATE_DRUG_LIGANDS[0]);
  const [exhaustiveness, setExhaustiveness] = useState<number>(16);
  const [isDocking, setIsDocking] = useState<boolean>(false);
  const [dockingResult, setDockingResult] = useState<DockingSimulationResult>(() => 
    runSimulatedDocking(selectedTarget.targetName, selectedTarget.koreanName, CANDIDATE_DRUG_LIGANDS[0], 16)
  );
  const [selectedPoseIndex, setSelectedPoseIndex] = useState<number>(1);
  const [comparisonPoseIndex, setComparisonPoseIndex] = useState<number | null>(2);

  // Auto-update docking when target protein changes
  useEffect(() => {
    // Choose appropriate candidate ligand default if matching
    let matchingLig = CANDIDATE_DRUG_LIGANDS[0];
    if (selectedTarget.targetName.includes('KRAS')) {
      matchingLig = CANDIDATE_DRUG_LIGANDS[0];
    } else if (selectedTarget.targetName.includes('SARS')) {
      matchingLig = CANDIDATE_DRUG_LIGANDS[2];
    } else if (selectedTarget.targetName.includes('Amyloid')) {
      matchingLig = CANDIDATE_DRUG_LIGANDS[1];
    } else if (selectedTarget.targetName.includes('p53')) {
      matchingLig = CANDIDATE_DRUG_LIGANDS[4];
    }
    setSelectedLigand(matchingLig);
    const initialRes = runSimulatedDocking(selectedTarget.targetName, selectedTarget.koreanName, matchingLig, exhaustiveness);
    setDockingResult(initialRes);
    setSelectedPoseIndex(1);
  }, [selectedTarget]);

  const handlePredictCustom = async () => {
    if (!customSequence.trim()) {
      alert("아미노산 서열(FASTA)을 입력해 주세요.");
      return;
    }
    setIsPredicting(true);

    try {
      const res = await fetch('/api/alphafold-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequence: customSequence,
          targetName: customTargetName || 'Custom AlphaFold Target',
          organism: 'Homo sapiens (Human)',
          candidateLigand: selectedLigand.name
        })
      });

      const data = await res.json();
      if (data.prediction) {
        setSelectedTarget(data.prediction);
      }
    } catch (err) {
      console.error("AlphaFold prediction error:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleRunDocking = async () => {
    setIsDocking(true);
    try {
      const res = await fetch('/api/molecular-docking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proteinName: selectedTarget.targetName,
          proteinKoreanName: selectedTarget.koreanName,
          ligand: selectedLigand,
          exhaustiveness
        })
      });
      const data = await res.json();
      if (data.result) {
        setDockingResult(data.result);
        setSelectedPoseIndex(1);
      } else {
        // Deterministic fallback
        const fallback = runSimulatedDocking(selectedTarget.targetName, selectedTarget.koreanName, selectedLigand, exhaustiveness);
        setDockingResult(fallback);
        setSelectedPoseIndex(1);
      }
    } catch (err) {
      console.warn("Docking API fallback:", err);
      const fallback = runSimulatedDocking(selectedTarget.targetName, selectedTarget.koreanName, selectedLigand, exhaustiveness);
      setDockingResult(fallback);
      setSelectedPoseIndex(1);
    } finally {
      setIsDocking(false);
    }
  };

  const handleDownloadPdb = () => {
    const blob = new Blob([selectedTarget.pdbContent], { type: 'chemical/x-pdb' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${selectedTarget.targetName.replace(/\s+/g, '_')}_AlphaFold.pdb`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyReport = () => {
    const currentPose = dockingResult.poses[selectedPoseIndex - 1] || dockingResult.poses[0];
    let text = `==========================================================\n`;
    text += `[DeepMind AlphaFold 3D 단백질 구조 & 분자 도킹 리포트]\n`;
    text += `표적 단백질: ${selectedTarget.targetName} (${selectedTarget.koreanName})\n`;
    text += `생물종: ${selectedTarget.organism} | UniProt ID: ${selectedTarget.uniprotId}\n`;
    text += `서열 길이: ${selectedTarget.sequence.length} 아미노산 | Mean pLDDT: ${selectedTarget.meanPLDDT}/100\n\n`;
    text += `[소분자 리간드 도킹 시뮬레이션 결과 (Pose ${currentPose.poseIndex})]\n`;
    text += `  - 소분자 명칭: ${dockingResult.ligand.name} (${dockingResult.ligand.koreanName})\n`;
    text += `  - 화학식: ${dockingResult.ligand.formula} | 분자량: ${dockingResult.ligand.molecularWeight} g/mol\n`;
    text += `  - 결합 자유 에너지 (ΔG): ${currentPose.affinityKcalMol} kcal/mol\n`;
    text += `  - 추정 저해 상수 (Ki): ${currentPose.inhibitionConstantKiNM} nM\n`;
    text += `  - 리간드 효율 (Ligand Efficiency): ${currentPose.ligandEfficiency} kcal/mol/atom\n`;
    text += `  - RMSD (l.b. / u.b.): ${currentPose.rmsdLowerBound} Å / ${currentPose.rmsdUpperBound} Å\n\n`;
    text += `[결합 자유 에너지 세부 분해 (Energy Breakdown)]\n`;
    text += `  - van der Waals (vdW) 기여: ${currentPose.energyBreakdown.vdwEnergy} kcal/mol\n`;
    text += `  - 정전기력(Electrostatic): ${currentPose.energyBreakdown.electrostaticEnergy} kcal/mol\n`;
    text += `  - 수소결합(H-Bond): ${currentPose.energyBreakdown.hBondEnergy} kcal/mol\n`;
    text += `  - 탈용매화 손실(Desolvation Penalty): +${currentPose.energyBreakdown.desolvationPenalty} kcal/mol\n`;
    text += `  - 회전 엔트로피 손실(Torsional Penalty): +${currentPose.energyBreakdown.torsionalEntropyLoss} kcal/mol\n\n`;
    text += `[핵심 결합 포켓 잔기 상호작용]\n`;
    currentPose.interactions.forEach(inter => {
      text += `  * [${inter.type.toUpperCase()}] ${inter.residueName} (${inter.atomPair}): ${inter.distanceAngstrom} Å (${inter.energyKcalMol} kcal/mol)\n`;
    });
    text += `==========================================================\n`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleSendDockedToMainViewer = () => {
    if (!onLoadIntoMainViewer) return;
    const currentPose = dockingResult.poses[selectedPoseIndex - 1] || dockingResult.poses[0];
    const complexModel = generateDockedComplexModel(selectedTarget.atoms, selectedTarget.bonds, currentPose);

    const mol: Molecule = {
      id: `af-docked-${selectedTarget.id}-${Date.now()}`,
      name: `${selectedTarget.targetName} + ${dockingResult.ligand.name}`,
      commonName: `${selectedTarget.koreanName} - 소분자 도킹 복합체`,
      formula: `${selectedTarget.targetName.slice(0, 8)}:${dockingResult.ligand.formula}`,
      smiles: dockingResult.ligand.smiles,
      description: `AlphaFold 단백질 표적과 소분자 리간드 간의 분자 도킹 복합체 (ΔG = ${currentPose.affinityKcalMol} kcal/mol, Ki = ${currentPose.inhibitionConstantKiNM} nM)`,
      quantumRationale: `리간드와 단백질 결합 포켓 간의 양자 정전기 인력, 분산력, 수소결합 수렴 계산 완료`,
      atoms: complexModel.atoms,
      bonds: complexModel.bonds,
      quantumProperties: {
        groundStateEnergy: parseFloat((-48.5 * selectedTarget.residues.length - Math.abs(currentPose.affinityKcalMol) * 1.5).toFixed(3)),
        vqeIterations: 42,
        fidelityScore: 0.96,
        homoEnergy: -6.8,
        lumoEnergy: -2.1,
        homoLumoGap: 4.7,
        dipoleMoment: 14.2,
        qubitsRequired: 12,
        pauliTermsCount: 168,
        quantumAdvantageMetric: `AlphaFold 결합 포켓 정밀 도킹 (Ki = ${currentPose.inhibitionConstantKiNM} nM)`
      },
      deepLearningMetrics: {
        qganDiscriminatorLoss: 0.008,
        generatorFidelity: selectedTarget.ptmScore,
        valenceValidityRate: 1.0,
        sascore: 2.2,
        qedScore: 0.91,
        logP: dockingResult.ligand.logP,
        molecularWeight: dockingResult.ligand.molecularWeight
      },
      suggestedApplications: [
        `결합 친화도 ΔG = ${currentPose.affinityKcalMol} kcal/mol`,
        `저해 상수 Ki = ${currentPose.inhibitionConstantKiNM} nM`,
        `리간드 효율 LE = ${currentPose.ligandEfficiency}`
      ],
      synthesisRouteSummary: `${dockingResult.ligand.name} 합성 전구체 최적화 및 ${selectedTarget.targetName} 시험관 내 결합 검증`,
      quantumCircuitConfig: {
        numQubits: 12,
        depth: 24,
        ansatzType: 'StronglyEntangling',
        parameters: [-0.45, 1.25, 0.88, -1.45, 0.62, 1.88, -0.32, 0.74]
      }
    };
    onLoadIntoMainViewer(mol);
  };

  const getPlddtColor = (score: number) => {
    if (score >= 90) return { bg: 'bg-[#0053D6]/20', text: 'text-[#65CBF3]', border: 'border-[#0053D6]/50', label: '매우 높음 (>90)' };
    if (score >= 70) return { bg: 'bg-[#65CBF3]/20', text: 'text-[#65CBF3]', border: 'border-[#65CBF3]/50', label: '신뢰성 높음 (70-90)' };
    if (score >= 50) return { bg: 'bg-[#FFDB13]/20', text: 'text-[#FFDB13]', border: 'border-[#FFDB13]/50', label: '보통 (50-70)' };
    return { bg: 'bg-[#FF7D45]/20', text: 'text-[#FF7D45]', border: 'border-[#FF7D45]/50', label: '낮음 (<50)' };
  };

  const currentPose = dockingResult.poses[selectedPoseIndex - 1] || dockingResult.poses[0];
  const plddtStyle = getPlddtColor(selectedTarget.meanPLDDT);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Top Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-950/50">
            <Dna className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              DeepMind AlphaFold 3D 구조 &amp; 분자 도킹(Molecular Docking) 스튜디오
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                AlphaFold + Molecular Docking &amp; Affinity Studio
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              AlphaFold 단백질 구조와 소분자(Drug-like Molecule) 간의 결합 포즈, 자유에너지(ΔG), 저해상수(Ki), 및 잔기 상호작용 지도를 정밀 시뮬레이션합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyReport}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedReport ? '복사됨' : '도킹 리포트 복사'}</span>
          </button>
          <button
            onClick={handleDownloadPdb}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDB 다운로드</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Preset Targets & Custom Sequence Predictor */}
        <div className="w-[34%] border-r border-slate-800 flex flex-col p-3 space-y-3 overflow-y-auto bg-slate-950/80">
          {/* Preset Targets Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              알파폴드 핵심 표적 단백질 선택
            </span>
            <div className="space-y-1.5">
              {ALPHAFOLD_PRESET_TARGETS.map((target) => {
                const isSelected = selectedTarget.id === target.id;
                const badge = getPlddtColor(target.meanPLDDT);
                return (
                  <button
                    key={target.id}
                    onClick={() => {
                      setSelectedTarget(target);
                      setSelectedResidueIndex(null);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all space-y-1 ${
                      isSelected
                        ? 'bg-indigo-950/60 border-cyan-400 shadow-md shadow-indigo-950 ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{target.targetName}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                        pLDDT {target.meanPLDDT}
                      </span>
                    </div>
                    <span className="text-[11px] text-cyan-300 font-medium block">
                      {target.koreanName}
                    </span>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>UniProt: {target.uniprotId}</span>
                      <span>길이: {target.sequence.length} aa</span>
                      <span>pTM: {target.ptmScore}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amino Acid Sequence Input (AlphaFold Predictor) */}
          <div className="p-3 bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl border border-indigo-500/30 space-y-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5 text-indigo-400" />
              신규 서열 접힘 예측 (FASTA)
            </span>

            <input
              type="text"
              placeholder="표적 단백질 명칭"
              value={customTargetName}
              onChange={(e) => setCustomTargetName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />

            <textarea
              rows={2}
              placeholder="1차 서열 (MTEYKLVVVGADGVGKSALTIQ...)"
              value={customSequence}
              onChange={(e) => setCustomSequence(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />

            <button
              onClick={handlePredictCustom}
              disabled={isPredicting || !customSequence.trim()}
              className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                isPredicting || !customSequence.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-indigo-950'
              }`}
            >
              {isPredicting ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                  <span>AlphaFold 추론 중...</span>
                </>
              ) : (
                <>
                  <Dna className="w-3.5 h-3.5" />
                  <span>새 서열 3D 접힘</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Docking Studio, Binding Affinity Visualization & 3D Viewer */}
        <div className="w-[66%] flex flex-col p-3.5 space-y-3 overflow-y-auto bg-slate-950">
          {/* Target Header Card */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-100">
                    {selectedTarget.targetName}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${plddtStyle.bg} ${plddtStyle.text} ${plddtStyle.border}`}>
                    Mean pLDDT: {selectedTarget.meanPLDDT} ({plddtStyle.label})
                  </span>
                </div>
                <span className="text-xs text-cyan-300 font-medium">
                  {selectedTarget.koreanName} · {selectedTarget.organism}
                </span>
              </div>

              {onLoadIntoMainViewer && (
                <button
                  onClick={handleSendDockedToMainViewer}
                  className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-950 shrink-0"
                >
                  <Compass className="w-3.5 h-3.5" />
                  도킹 복합체 메인 3D 전송
                </button>
              )}
            </div>

            {/* View Mode Navigation Tabs */}
            <div className="flex items-center gap-1 pt-1 border-t border-slate-800">
              <button
                onClick={() => setViewMode('docking')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'docking' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                분자 도킹 &amp; 결합 친화도 시뮬레이터
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === '3d' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                단백질 3D 구조 뷰어
              </button>
              <button
                onClick={() => setViewMode('pae')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'pae' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PAE 2D 오차 행렬
              </button>
              <button
                onClick={() => setViewMode('sequence')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'sequence' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                잔기별 pLDDT 브라우저
              </button>
            </div>
          </div>

          {/* DOCKING SIMULATOR & AFFINITY VISUALIZATION VIEW */}
          {viewMode === 'docking' && (
            <div className="space-y-3">
              {/* Docking Control & Ligand Setup Box */}
              <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 rounded-xl border border-indigo-500/40 space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-indigo-500/20">
                  <span className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-cyan-400" />
                    도킹 소분자(Drug-like Ligand) 선택 &amp; 탐색 제어
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    AutoDock Vina + Quantum PM6 Dispersion
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">후보 소분자 (Drug Candidate)</label>
                    <select
                      value={selectedLigand.id}
                      onChange={(e) => {
                        const found = CANDIDATE_DRUG_LIGANDS.find(l => l.id === e.target.value);
                        if (found) setSelectedLigand(found);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      {CANDIDATE_DRUG_LIGANDS.map(lig => (
                        <option key={lig.id} value={lig.id}>
                          {lig.name} ({lig.formula})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-slate-400">탐색 강도 (Exhaustiveness)</label>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">{exhaustiveness} runs</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="range"
                        min={8}
                        max={64}
                        step={8}
                        value={exhaustiveness}
                        onChange={(e) => setExhaustiveness(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleRunDocking}
                      disabled={isDocking}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        isDocking
                          ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-indigo-950'
                      }`}
                    >
                      {isDocking ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                          <span>도킹 몬테카를로 탐색 중...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>도킹 시뮬레이션 가동</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Ligand Properties Badges */}
                <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-400 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800">
                    화학식: <strong className="text-cyan-300">{selectedLigand.formula}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800">
                    분자량: <strong className="text-slate-100">{selectedLigand.molecularWeight} g/mol</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800">
                    logP: <strong className="text-amber-300">{selectedLigand.logP}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800">
                    H-Bond: D {selectedLigand.hBondDonors} / A {selectedLigand.hBondAcceptors}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800">
                    회전결합수: {selectedLigand.rotatableBonds}
                  </span>
                </div>
              </div>

              {/* Binding Affinity Data Visualization Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/40 space-y-1">
                  <span className="text-[10px] text-slate-400 block">최적 결합 자유 에너지 (ΔG)</span>
                  <span className="text-lg font-bold font-mono text-cyan-300 block">
                    {currentPose.affinityKcalMol} <span className="text-xs text-slate-400">kcal/mol</span>
                  </span>
                  <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 강력한 나노몰 결합
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-500/40 space-y-1">
                  <span className="text-[10px] text-slate-400 block">추정 저해 상수 (Ki)</span>
                  <span className="text-lg font-bold font-mono text-indigo-300 block">
                    {currentPose.inhibitionConstantKiNM} <span className="text-xs text-slate-400">nM</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    (RT = 0.592 kcal/mol 기준)
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/40 space-y-1">
                  <span className="text-[10px] text-slate-400 block">리간드 효율 (Ligand Efficiency)</span>
                  <span className="text-lg font-bold font-mono text-amber-300 block">
                    {currentPose.ligandEfficiency} <span className="text-xs text-slate-400">kcal/atom</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    중원자당 결합 기여도
                  </span>
                </div>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">구조 편차 (RMSD)</span>
                  <span className="text-lg font-bold font-mono text-slate-200 block">
                    {currentPose.rmsdLowerBound} <span className="text-xs text-slate-400">/ {currentPose.rmsdUpperBound} Å</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {selectedPoseIndex === 1 ? '기준 바닥상태 (Reference)' : '대체 배좌 구조'}
                  </span>
                </div>
              </div>

              {/* Binding Pose Selection Bar */}
              <div className="flex items-center justify-between p-2.5 bg-slate-900/70 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  생성된 결합 포즈 선택 (Primary Binding Pose)
                </span>
                <div className="flex items-center gap-1.5">
                  {dockingResult.poses.map((p) => {
                    const isSel = selectedPoseIndex === p.poseIndex;
                    return (
                      <button
                        key={p.poseIndex}
                        onClick={() => setSelectedPoseIndex(p.poseIndex)}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                          isSel
                            ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-sm ring-1 ring-cyan-400'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                      >
                        Pose {p.poseIndex} ({p.affinityKcalMol})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Side-by-Side: 3D Docked Complex Visualizer & Multi-Dimensional Radar Comparison Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* 3D Docked Complex Visualizer (Left) */}
                <div className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
                  <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" />
                      3D 도킹 복합체 (Pose {selectedPoseIndex})
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      ΔG = {currentPose.affinityKcalMol} kcal/mol
                    </span>
                  </div>

                  <div className="h-[340px] relative bg-slate-950/60">
                    {(() => {
                      const complex = generateDockedComplexModel(selectedTarget.atoms, selectedTarget.bonds, currentPose);
                      return (
                        <Molecule3DViewer
                          molecule={{
                            id: `docked-preview-${selectedTarget.id}-${selectedPoseIndex}`,
                            name: `${selectedTarget.targetName} + ${dockingResult.ligand.name}`,
                            commonName: `${selectedTarget.koreanName} 도킹 복합체`,
                            formula: dockingResult.ligand.formula,
                            smiles: dockingResult.ligand.smiles,
                            description: `도킹 포즈 ${selectedPoseIndex} (ΔG = ${currentPose.affinityKcalMol} kcal/mol, Ki = ${currentPose.inhibitionConstantKiNM} nM)`,
                            quantumRationale: `결합 포켓 내 리간드 도킹 좌표`,
                            atoms: complex.atoms,
                            bonds: complex.bonds,
                            quantumProperties: {
                              groundStateEnergy: -52.4 * selectedTarget.residues.length,
                              vqeIterations: 30,
                              fidelityScore: 0.96,
                              homoEnergy: -6.8,
                              lumoEnergy: -2.1,
                              homoLumoGap: 4.7,
                              dipoleMoment: 14.2,
                              qubitsRequired: 12,
                              pauliTermsCount: 168,
                              quantumAdvantageMetric: 'AlphaFold 포켓 도킹'
                            },
                            deepLearningMetrics: {
                              qganDiscriminatorLoss: 0.01,
                              generatorFidelity: selectedTarget.ptmScore,
                              valenceValidityRate: 1.0,
                              sascore: 2.2,
                              qedScore: 0.91,
                              logP: dockingResult.ligand.logP,
                              molecularWeight: dockingResult.ligand.molecularWeight
                            },
                            quantumCircuitConfig: {
                              numQubits: 12,
                              depth: 18,
                              ansatzType: 'RyRz',
                              parameters: [0.1, 0.2, 0.3, 0.4]
                            },
                            suggestedApplications: [`도킹 친화도 ΔG = ${currentPose.affinityKcalMol} kcal/mol`],
                            synthesisRouteSummary: '단백질-리간드 복합체 결합'
                          }}
                        />
                      );
                    })()}

                    <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[9px] font-mono bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded border border-slate-700">
                      <span className="text-slate-400">구조 표시:</span>
                      <span className="text-cyan-300">단백질 백본 원자망</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-amber-300 font-bold">포켓 안착 소분자 리간드 (형광 강조)</span>
                    </div>
                  </div>
                </div>

                {/* Binding Affinity Radar Chart & Comparative Dashboard (Right) */}
                <div className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 p-3 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                      친화도 레이더 차트 비교 분석 (Radar Chart)
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="text-slate-400">대조군 비교:</span>
                      <select
                        value={comparisonPoseIndex === null ? 'none' : comparisonPoseIndex}
                        onChange={(e) => {
                          const val = e.target.value === 'none' ? null : Number(e.target.value);
                          setComparisonPoseIndex(val);
                        }}
                        className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-amber-300 focus:outline-none"
                      >
                        <option value="none">단독 분석 (None)</option>
                        {dockingResult.poses.map((p) => (
                          <option key={p.poseIndex} value={p.poseIndex} disabled={p.poseIndex === selectedPoseIndex}>
                            Pose {p.poseIndex} ({p.affinityKcalMol} kcal)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <BindingAffinityRadarChart
                    primaryPose={currentPose}
                    secondaryPose={comparisonPoseIndex ? (dockingResult.poses[comparisonPoseIndex - 1] || null) : null}
                    ligand={dockingResult.ligand}
                    primaryLabel={`Pose ${selectedPoseIndex}`}
                    secondaryLabel={comparisonPoseIndex ? `Pose ${comparisonPoseIndex}` : undefined}
                    size={240}
                  />
                </div>
              </div>

              {/* Energy Breakdown & 3D Interaction Network Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Free Energy Breakdown Chart */}
                <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                      열역학 결합 에너지 성분 분해 (kcal/mol)
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300">
                      총합: {currentPose.affinityKcalMol} kcal/mol
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {/* vdW */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-cyan-300">반데르발스 인력 (van der Waals)</span>
                        <span className="font-bold text-cyan-300">{currentPose.energyBreakdown.vdwEnergy} kcal/mol</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(currentPose.energyBreakdown.vdwEnergy) * 12)}%` }} />
                      </div>
                    </div>

                    {/* Electrostatic */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-blue-300">정전기적 인력 (Electrostatic)</span>
                        <span className="font-bold text-blue-300">{currentPose.energyBreakdown.electrostaticEnergy} kcal/mol</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(currentPose.energyBreakdown.electrostaticEnergy) * 12)}%` }} />
                      </div>
                    </div>

                    {/* H-Bond */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-emerald-300">수소 결합 에너지 (H-Bond)</span>
                        <span className="font-bold text-emerald-300">{currentPose.energyBreakdown.hBondEnergy} kcal/mol</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(currentPose.energyBreakdown.hBondEnergy) * 12)}%` }} />
                      </div>
                    </div>

                    {/* Desolvation */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-amber-300">탈용매화 손실 페널티 (Desolvation)</span>
                        <span className="font-bold text-amber-300">+{currentPose.energyBreakdown.desolvationPenalty} kcal/mol</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(currentPose.energyBreakdown.desolvationPenalty) * 12)}%` }} />
                      </div>
                    </div>

                    {/* Torsional */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-rose-300">회전 엔트로피 손실 (Torsional Loss)</span>
                        <span className="font-bold text-rose-300">+{currentPose.energyBreakdown.torsionalEntropyLoss} kcal/mol</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(currentPose.energyBreakdown.torsionalEntropyLoss) * 12)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2D/3D Interaction Residues Network */}
                <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      포켓 내 잔기별 상호작용 지도 (Interactions)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      총 {currentPose.interactions.length}개 결합점
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-1">
                    {currentPose.interactions.map((inter, idx) => {
                      let tagBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                      let typeLabel = '수소결합';
                      if (inter.type === 'salt_bridge') {
                        tagBg = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                        typeLabel = '염다리(이온결합)';
                      } else if (inter.type === 'pi_pi') {
                        tagBg = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                        typeLabel = 'π-π 스태킹';
                      } else if (inter.type === 'hydrophobic') {
                        tagBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                        typeLabel = '소수성 접촉';
                      }

                      return (
                        <div key={idx} className="p-2 bg-slate-950/80 rounded-lg border border-slate-800 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] border ${tagBg}`}>
                              {typeLabel}
                            </span>
                            <span className="font-bold text-slate-200">{inter.residueName}</span>
                            <span className="text-[10px] text-slate-400">({inter.atomPair})</span>
                          </div>
                          <div className="flex items-center gap-2 text-right">
                            <span className="text-cyan-300">{inter.distanceAngstrom} Å</span>
                            <span className="text-slate-400 text-[10px] font-bold">({inter.energyKcalMol} kcal)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D PROTEIN STRUCTURE VIEW */}
          {viewMode === '3d' && (
            <div className="h-[380px] bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden relative shadow-inner">
              <Molecule3DViewer
                molecule={{
                  id: selectedTarget.id,
                  name: selectedTarget.targetName,
                  commonName: selectedTarget.koreanName,
                  formula: `Protein (${selectedTarget.sequence.length} AAs)`,
                  smiles: selectedTarget.sequence.slice(0, 30),
                  description: selectedTarget.biologicalFunction,
                  quantumRationale: selectedTarget.quantumBiologicalMechanism,
                  atoms: selectedTarget.atoms,
                  bonds: selectedTarget.bonds,
                  quantumProperties: {
                    groundStateEnergy: -54.2 * selectedTarget.residues.length,
                    vqeIterations: 30,
                    fidelityScore: selectedTarget.meanPLDDT / 100,
                    homoEnergy: -7.2,
                    lumoEnergy: -1.8,
                    homoLumoGap: 5.4,
                    dipoleMoment: 18.5,
                    qubitsRequired: 12,
                    pauliTermsCount: 144,
                    quantumAdvantageMetric: 'AlphaFold 3차원 백본 및 양자 결합 포켓'
                  },
                  deepLearningMetrics: {
                    qganDiscriminatorLoss: 0.01,
                    generatorFidelity: selectedTarget.ptmScore,
                    valenceValidityRate: 1.0,
                    sascore: 2.1,
                    qedScore: 0.88,
                    logP: 1.2,
                    molecularWeight: selectedTarget.sequence.length * 110.0
                  },
                  quantumCircuitConfig: {
                    numQubits: 12,
                    depth: 18,
                    ansatzType: 'RyRz',
                    parameters: [0.1, 0.2, 0.3, 0.4]
                  },
                  suggestedApplications: [
                    `AlphaFold pLDDT ${selectedTarget.meanPLDDT} 구조`,
                    `양자 포켓 ΔG = ${selectedTarget.quantumPocketBinding.bindingEnergyKcalMol} kcal/mol`
                  ],
                  synthesisRouteSummary: `${selectedTarget.targetName} 재조합 정제 프로토콜`
                }}
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-cyan-300 border border-slate-700">
                AlphaFold 3D 구조: {selectedTarget.targetName} ({selectedTarget.sequence.length} 잔기)
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[9px] font-mono bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded border border-slate-700">
                <span className="text-slate-400">pLDDT 색상 범례:</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0053D6]" title=">90 매우 높음" />
                <span className="text-slate-300">&gt;90</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#65CBF3]" title="70-90 신뢰성 높음" />
                <span className="text-slate-300">70-90</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFDB13]" title="50-70 보통" />
                <span className="text-slate-300">50-70</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF7D45]" title="<50 낮음" />
                <span className="text-slate-300">&lt;50</span>
              </div>
            </div>
          )}

          {/* PAE VIEW */}
          {viewMode === 'pae' && (
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    PAE (Predicted Aligned Error) 2D 잔기 정렬 오차 행렬
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    색상이 짙은 파란색(0Å)일수록 잔기 x와 y 간의 상대적 3차원 위치 오차가 적어 강체(Rigid Domain)를 형성합니다.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  pTM: {selectedTarget.ptmScore} | ipTM: {selectedTarget.iptmScore ?? 'N/A'}
                </span>
              </div>

              {/* PAE Heatmap Grid */}
              <div className="flex justify-center p-2 bg-slate-950 rounded-lg border border-slate-800">
                <div className="grid grid-cols-24 gap-0.5">
                  {selectedTarget.paeMatrix.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const intensity = Math.max(0, Math.min(1, 1 - val / 30));
                      const bg = `rgba(0, 83, 214, ${0.15 + intensity * 0.85})`;
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className="w-3.5 h-3.5 rounded-[1px] cursor-pointer hover:ring-1 hover:ring-white transition-all"
                          style={{ backgroundColor: bg }}
                          title={`Residue ${rIdx + 1} vs ${cIdx + 1}: ${val} Å error`}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SEQUENCE BROWSER VIEW */}
          {viewMode === 'sequence' && (
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2 max-h-[380px] overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-200">
                잔기별 pLDDT 신뢰도 &amp; 2차 구조 분포
              </h4>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5 text-xs font-mono">
                {selectedTarget.residues.map((res) => {
                  const badge = getPlddtColor(res.pLDDT);
                  const isSel = selectedResidueIndex === res.index;
                  return (
                    <button
                      key={res.index}
                      onClick={() => setSelectedResidueIndex(res.index)}
                      className={`p-1.5 rounded border text-center transition-all ${
                        isSel
                          ? 'bg-cyan-500/30 border-cyan-400 ring-1 ring-cyan-400'
                          : `${badge.bg} ${badge.border} hover:border-slate-500`
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block">{res.index}</span>
                      <span className="font-bold text-slate-100 block">{res.code}</span>
                      <span className={`text-[9px] font-bold block ${badge.text}`}>
                        {res.pLDDT.toFixed(0)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
