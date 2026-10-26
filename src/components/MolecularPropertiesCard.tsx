import React, { useState } from 'react';
import { Molecule } from '../types/quantum';
import { COLAB_NOTEBOOK_JSON } from '../utils/colabCodeGenerator';
import { Download, Copy, Check, ShieldCheck, Zap, Compass, FileText, Share2, Sparkles, Cloud } from 'lucide-react';

interface MolecularPropertiesCardProps {
  molecule: Molecule;
}

export const MolecularPropertiesCard: React.FC<MolecularPropertiesCardProps> = ({ molecule }) => {
  const [copiedSmiles, setCopiedSmiles] = useState(false);
  const qp = molecule.quantumProperties;
  const dlm = molecule.deepLearningMetrics;

  const handleDownloadColabNotebook = () => {
    const jsonStr = JSON.stringify(COLAB_NOTEBOOK_JSON, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/x-ipynb+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'QuantumMol_AI_Colab_Cloudflare.ipynb';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySmiles = () => {
    navigator.clipboard.writeText(molecule.smiles);
    setCopiedSmiles(true);
    setTimeout(() => setCopiedSmiles(false), 2000);
  };

  const handleDownloadPdb = () => {
    // Generate standard PDB format text
    let pdb = `HEADER    QUANTUM GENERATED MOLECULE               ${new Date().toISOString().slice(0, 10)}\n`;
    pdb += `TITLE     ${molecule.name} - ${molecule.commonName}\n`;
    pdb += `REMARK    GROUND STATE ENERGY: ${qp.groundStateEnergy} HARTREES\n`;
    pdb += `REMARK    HOMO-LUMO GAP: ${qp.homoLumoGap} EV\n`;
    molecule.atoms.forEach((atom, idx) => {
      const x = atom.x.toFixed(3).padStart(8, ' ');
      const y = atom.y.toFixed(3).padStart(8, ' ');
      const z = atom.z.toFixed(3).padStart(8, ' ');
      const sym = atom.symbol.padEnd(2, ' ');
      const atomIdx = (idx + 1).toString().padStart(5, ' ');
      pdb += `HETATM${atomIdx} ${sym}   MOL A   1    ${x}${y}${z}  1.00  0.00          ${atom.symbol.padStart(2, ' ')}\n`;
    });
    molecule.bonds.forEach((bond) => {
      const a1 = (bond.atom1 + 1).toString().padStart(5, ' ');
      const a2 = (bond.atom2 + 1).toString().padStart(5, ' ');
      pdb += `CONECT${a1}${a2}\n`;
    });
    pdb += `END\n`;

    const blob = new Blob([pdb], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${molecule.name.replace(/\s+/g, '_')}.pdb`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadXyz = () => {
    let xyz = `${molecule.atoms.length}\n`;
    xyz += `${molecule.name} | E=${qp.groundStateEnergy} Ha | Gap=${qp.homoLumoGap} eV | SMILES=${molecule.smiles}\n`;
    molecule.atoms.forEach((atom) => {
      xyz += `${atom.symbol.padEnd(3, ' ')} ${atom.x.toFixed(6).padStart(12, ' ')} ${atom.y.toFixed(6).padStart(12, ' ')} ${atom.z.toFixed(6).padStart(12, ' ')}\n`;
    });

    const blob = new Blob([xyz], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${molecule.name.replace(/\s+/g, '_')}.xyz`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(molecule, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${molecule.name.replace(/\s+/g, '_')}_QuantumReport.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Lipinski Rule Check
  const lipinskiPass =
    dlm.molecularWeight <= 500 &&
    dlm.logP <= 5 &&
    (dlm.hydrogenBondDonors || 0) <= 5 &&
    (dlm.hydrogenBondAcceptors || 0) <= 10;

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">양자 및 딥러닝 분자 물성 프로필</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopySmiles}
            title="SMILES 복사"
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono border border-slate-700 flex items-center gap-1 transition-colors"
          >
            {copiedSmiles ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            SMILES
          </button>
          <button
            onClick={handleDownloadPdb}
            title="PDB 다운로드"
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            PDB
          </button>
          <button
            onClick={handleDownloadXyz}
            title="XYZ 다운로드"
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-mono border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3 h-3 text-indigo-400" />
            XYZ
          </button>
          <button
            onClick={handleExportJson}
            title="양자 리포트 JSON 내보내기"
            className="px-2 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-200 rounded text-[11px] font-mono border border-cyan-700/60 flex items-center gap-1 transition-colors"
          >
            <FileText className="w-3 h-3" />
            JSON
          </button>
          <button
            onClick={handleDownloadColabNotebook}
            title="구글 Colab + Cloudflare Tunnel 실행 노트북 다운로드"
            className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-200 rounded text-[11px] font-mono border border-amber-600/60 flex items-center gap-1.5 transition-colors font-semibold shadow-sm"
          >
            <Cloud className="w-3 h-3 text-amber-400" />
            Colab (.ipynb)
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Molecule Title & Chemical Info */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-100">{molecule.name}</h4>
            {molecule.isGenerated && (
              <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 양자 딥러닝 추론 생성물
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{molecule.commonName}</p>
          <div className="text-[11px] text-slate-500 font-mono break-all pt-1">
            SMILES: <span className="text-slate-300">{molecule.smiles}</span>
          </div>
        </div>

        {/* Section 1: Quantum Electronic Metrics */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            양자 화학 전자 구조 지표 (Quantum Metrics)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">VQE 바닥상태 에너지</span>
              <div className="text-xs font-bold font-mono text-cyan-300">{qp.groundStateEnergy} Ha</div>
              <span className="text-[10px] text-slate-500 font-mono">
                {(qp.groundStateEnergy * 627.509).toFixed(1)} kcal/mol
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">HOMO - LUMO 밴드갭</span>
              <div className="text-xs font-bold font-mono text-emerald-400">{qp.homoLumoGap} eV</div>
              <span className="text-[10px] text-slate-500 font-mono">
                HOMO: {qp.homoEnergy} / LUMO: {qp.lumoEnergy}
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">분자 쌍극자 모멘트</span>
              <div className="text-xs font-bold font-mono text-amber-300">{qp.dipoleMoment} Debye</div>
              <span className="text-[10px] text-slate-500">
                {qp.dipoleMoment > 2.5 ? '강한 극성' : '저극성/무극성'}
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">필요 큐비트 / 파울리 항</span>
              <div className="text-xs font-bold font-mono text-slate-200">
                {qp.qubitsRequired} Qubits / {qp.pauliTermsCount} Terms
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Jordan-Wigner 변환
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">양자 상태 수렴 피델리티</span>
              <div className="text-xs font-bold font-mono text-cyan-300">
                {(qp.fidelityScore * 100).toFixed(2)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {qp.vqeIterations} 스텝 수렴
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">영점 진동 에너지(ZPVE)</span>
              <div className="text-xs font-bold font-mono text-slate-300">
                {qp.zeroPointEnergy || 45.0} kcal/mol
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                조화진동자 근사
              </span>
            </div>
          </div>

          <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-2.5 text-xs">
            <span className="text-cyan-300 font-semibold block mb-0.5">양자 우위 검증 분석:</span>
            <span className="text-slate-300">{qp.quantumAdvantageMetric}</span>
          </div>
        </div>

        {/* Section 2: Deep Learning & Drug-likeness Metrics */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            딥러닝 제약 및 약물·물성 지표 (Deep Learning Metrics)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">분자량 (MW)</span>
              <div className="text-xs font-bold font-mono text-slate-200">
                {dlm.molecularWeight.toFixed(2)} g/mol
              </div>
              <span className="text-[10px] text-slate-500">
                {dlm.molecularWeight <= 500 ? '적정 범위 (≤500)' : '고분자'}
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">지질 친화도 (LogP)</span>
              <div className="text-xs font-bold font-mono text-slate-200">{dlm.logP.toFixed(2)}</div>
              <span className="text-[10px] text-slate-500">
                {dlm.logP >= 0 && dlm.logP <= 3 ? '최적 세포막 투과' : '친수/소수성'}
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">약물 유사성 (QED)</span>
              <div className="text-xs font-bold font-mono text-emerald-400">
                {(dlm.qedScore * 100).toFixed(0)}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                점수: {dlm.qedScore.toFixed(2)} / 1.0
              </span>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400">합성 용이성 (SAScore)</span>
              <div className="text-xs font-bold font-mono text-cyan-300">
                {dlm.sascore.toFixed(2)} / 10
              </div>
              <span className="text-[10px] text-slate-500">
                {dlm.sascore < 4.0 ? '합성 용이' : '복잡 골격'}
              </span>
            </div>
          </div>

          {/* Lipinski Rule of 5 Summary */}
          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
            <span className="text-slate-300">Lipinski Rule of 5 약물성 기준:</span>
            <span className={`font-mono font-semibold ${lipinskiPass ? 'text-emerald-400' : 'text-amber-400'}`}>
              {lipinskiPass ? '모든 기준 충족 (Pass)' : '부분 충족 (Review Required)'}
            </span>
          </div>
        </div>

        {/* Section 3: Physical Rationale & Synthesis Route */}
        <div className="space-y-2">
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <span className="font-semibold text-slate-200">구조 해설 & 양자적 타당성 (Quantum Rationale)</span>
            <p className="text-slate-400 leading-relaxed">{molecule.quantumRationale}</p>
          </div>

          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <span className="font-semibold text-slate-200">추천 합성 경로 (Synthetic Route)</span>
            <p className="text-slate-400 leading-relaxed">{molecule.synthesisRouteSummary}</p>
          </div>
        </div>

        {/* Section 4: Applications without pill enclosures (Clean typography per frontend constitution) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-300">추천 응용 분야 및 적용 연구:</span>
          <div className="text-xs text-slate-400 leading-relaxed font-mono">
            {molecule.suggestedApplications.map((app, i) => (
              <span key={i}>
                {app}
                {i < molecule.suggestedApplications.length - 1 && <span className="mx-2 text-slate-600">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
