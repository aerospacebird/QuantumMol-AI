import React from 'react';
import { DockingPose, CandidateLigandInfo } from '../types/quantum';

interface BindingAffinityRadarChartProps {
  primaryPose: DockingPose;
  secondaryPose?: DockingPose | null;
  ligand: CandidateLigandInfo;
  primaryLabel?: string;
  secondaryLabel?: string;
  size?: number;
}

export interface RadarMetric {
  key: string;
  label: string;
  primaryValue: number; // 0 to 100
  secondaryValue?: number; // 0 to 100
  displayPrimary: string;
  displaySecondary?: string;
}

export function computeRadarMetrics(
  pose: DockingPose,
  ligand: CandidateLigandInfo
): { key: string; label: string; score: number; display: string }[] {
  // 1. Delta G Affinity (5 to 15 kcal/mol -> 0 to 100%)
  const rawDg = Math.abs(pose.affinityKcalMol);
  const affinityScore = Math.min(100, Math.max(15, Math.round(((rawDg - 5) / 10) * 100)));

  // 2. vdW / Hydrophobic Contact
  const rawVdw = Math.abs(pose.energyBreakdown.vdwEnergy);
  const vdwScore = Math.min(100, Math.max(20, Math.round((rawVdw / (rawDg * 0.55)) * 82 + (ligand.logP * 4))));

  // 3. Electrostatic Complementarity
  const rawElec = Math.abs(pose.energyBreakdown.electrostaticEnergy);
  const saltBridgeCount = pose.interactions.filter(i => i.type === 'salt_bridge').length;
  const elecScore = Math.min(100, Math.max(20, Math.round((rawElec / (rawDg * 0.35)) * 75 + saltBridgeCount * 14)));

  // 4. H-Bond Network Strength
  const hBondCount = pose.interactions.filter(i => i.type === 'hydrogen_bond').length;
  const rawHBond = Math.abs(pose.energyBreakdown.hBondEnergy);
  const hBondScore = Math.min(100, Math.max(15, Math.round(hBondCount * 18 + (rawHBond / 2.2) * 18)));

  // 5. Ligand Efficiency (LE: ~0.15 to ~0.50 kcal/atom -> 0 to 100%)
  const leScore = Math.min(100, Math.max(10, Math.round(pose.ligandEfficiency * 210)));

  // 6. Pocket Shape & Torsional Fit
  const shapeScore = Math.min(100, Math.max(25, Math.round(96 - (pose.rmsdUpperBound * 14) - (ligand.rotatableBonds * 2.2))));

  return [
    { key: 'affinity', label: '결합 친화도 (ΔG)', score: affinityScore, display: `${pose.affinityKcalMol} kcal/mol` },
    { key: 'vdw', label: 'vdW/소수성 접촉', score: vdwScore, display: `${pose.energyBreakdown.vdwEnergy} kcal` },
    { key: 'elec', label: '정전기 상보성', score: elecScore, display: `${pose.energyBreakdown.electrostaticEnergy} kcal` },
    { key: 'hbond', label: '수소결합 네트워크', score: hBondScore, display: `${hBondCount}개 형성` },
    { key: 'le', label: '리간드 효율 (LE)', score: leScore, display: `${pose.ligandEfficiency} kcal/atom` },
    { key: 'shape', label: '포켓 형태 적합도', score: shapeScore, display: `RMSD ${pose.rmsdUpperBound}Å` },
  ];
}

export const BindingAffinityRadarChart: React.FC<BindingAffinityRadarChartProps> = ({
  primaryPose,
  secondaryPose,
  ligand,
  primaryLabel = 'Pose 1 (최적 결합)',
  secondaryLabel = 'Pose 2 (비교)',
  size = 280
}) => {
  const primaryMetrics = computeRadarMetrics(primaryPose, ligand);
  const secondaryMetrics = secondaryPose ? computeRadarMetrics(secondaryPose, ligand) : null;

  const numAxes = primaryMetrics.length;
  const center = size / 2;
  const radius = (size / 2) - 40;

  // Concentric polygon levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, valueNorm: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const x = center + radius * valueNorm * Math.cos(angle);
    const y = center + radius * valueNorm * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate SVG polygon points
  const primaryPoints = primaryMetrics.map((m, i) => {
    const { x, y } = getCoordinates(i, m.score / 100);
    return `${x},${y}`;
  }).join(' ');

  const secondaryPoints = secondaryMetrics?.map((m, i) => {
    const { x, y } = getCoordinates(i, m.score / 100);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900/90 rounded-xl border border-slate-800 shadow-md">
      <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-slate-800 text-xs">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          결합 부위 친화도 다차원 레이더 차트 (Affinity Radar)
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/80 border border-cyan-400" />
            <span className="text-cyan-300 font-bold">{primaryLabel}</span>
          </div>
          {secondaryPose && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/80 border border-amber-400" />
              <span className="text-amber-300 font-bold">{secondaryLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <radialGradient id="primaryRadarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.15" />
            </radialGradient>
            <radialGradient id="secondaryRadarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Concentric Grid Polygons */}
          {levels.map((lvl, lIdx) => {
            const gridPoints = Array.from({ length: numAxes }).map((_, i) => {
              const { x, y } = getCoordinates(i, lvl);
              return `${x},${y}`;
            }).join(' ');

            return (
              <polygon
                key={lIdx}
                points={gridPoints}
                fill="none"
                stroke={lIdx === levels.length - 1 ? 'rgba(71, 85, 105, 0.8)' : 'rgba(51, 65, 85, 0.4)'}
                strokeWidth={lIdx === levels.length - 1 ? '1.5' : '1'}
                strokeDasharray={lIdx < levels.length - 1 ? '2 2' : 'none'}
              />
            );
          })}

          {/* Radial Axis Lines */}
          {Array.from({ length: numAxes }).map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(71, 85, 105, 0.5)"
                strokeWidth="1"
              />
            );
          })}

          {/* Secondary Pose Polygon (if provided) */}
          {secondaryPoints && (
            <>
              <polygon
                points={secondaryPoints}
                fill="url(#secondaryRadarGlow)"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />
              {secondaryMetrics?.map((m, i) => {
                const { x, y } = getCoordinates(i, m.score / 100);
                return (
                  <circle
                    key={`sec-dot-${i}`}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#fbbf24"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                );
              })}
            </>
          )}

          {/* Primary Pose Polygon */}
          <polygon
            points={primaryPoints}
            fill="url(#primaryRadarGlow)"
            stroke="#06b6d4"
            strokeWidth="2.2"
          />

          {/* Primary Vertex Points */}
          {primaryMetrics.map((m, i) => {
            const { x, y } = getCoordinates(i, m.score / 100);
            return (
              <circle
                key={`pri-dot-${i}`}
                cx={x}
                cy={y}
                r="4"
                fill="#22d3ee"
                stroke="#0f172a"
                strokeWidth="1.5"
                className="hover:r-5 transition-all cursor-pointer"
              />
            );
          })}

          {/* Axis Labels */}
          {primaryMetrics.map((m, i) => {
            const { x, y, angle } = getCoordinates(i, 1.22);
            // Label alignment based on position
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            if (Math.cos(angle) > 0.3) textAnchor = 'start';
            else if (Math.cos(angle) < -0.3) textAnchor = 'end';

            return (
              <g key={`label-${i}`}>
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill="#cbd5e1"
                  fontSize="9.5"
                  fontWeight="bold"
                  className="select-none font-sans"
                >
                  {m.label}
                </text>
                <text
                  x={x}
                  y={y + 11}
                  textAnchor={textAnchor}
                  fill="#06b6d4"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="600"
                  className="select-none"
                >
                  {m.display} ({m.score}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Metric Breakdown Cards Underneath */}
      <div className="w-full grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono">
        {primaryMetrics.map((m, idx) => (
          <div key={idx} className="p-1.5 bg-slate-950/80 rounded border border-slate-800/80 flex flex-col justify-between">
            <span className="text-slate-400 truncate">{m.label.split(' ')[0]}</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-cyan-300 font-bold">{m.display}</span>
              <span className="text-slate-500 font-bold">{m.score}점</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
