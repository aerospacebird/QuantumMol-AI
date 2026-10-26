import React, { useState } from 'react';
import { ReactionCoordinatePoint, ReactionEnergyStep } from '../types/quantum';
import { Activity, Clock, Flame, Zap, Layers, Play, Pause, RotateCcw } from 'lucide-react';

interface ReactionEnergyGraphProps {
  timeSteps: ReactionEnergyStep[];
  coordinatePoints: ReactionCoordinatePoint[];
  currentTimeIndex: number;
  onSelectTimeIndex?: (index: number) => void;
  width?: number;
  height?: number;
}

export const ReactionEnergyGraph: React.FC<ReactionEnergyGraphProps> = ({
  timeSteps,
  coordinatePoints,
  currentTimeIndex,
  onSelectTimeIndex,
  width = 520,
  height = 240
}) => {
  const [graphMode, setGraphMode] = useState<'time-trajectory' | 'reaction-coordinate'>('time-trajectory');
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

  const padding = { top: 25, right: 35, bottom: 35, left: 50 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // 1. Calculations for Time-Trajectory Graph
  const minEnergy = Math.min(...timeSteps.map(s => Math.min(s.freeEnergyKcalMol, s.potentialEnergyKcalMol)), -10);
  const maxEnergy = Math.max(...timeSteps.map(s => Math.max(s.freeEnergyKcalMol, s.potentialEnergyKcalMol)), 60);
  const energyRange = (maxEnergy - minEnergy) || 1;
  const maxTime = timeSteps[timeSteps.length - 1]?.timePs || 100;

  const getTimeX = (t: number) => padding.left + (t / maxTime) * innerWidth;
  const getEnergyY = (e: number) => padding.top + innerHeight - ((e - minEnergy) / energyRange) * innerHeight;

  // Polyline for Free Energy
  const freeEnergyPoints = timeSteps.map(s => `${getTimeX(s.timePs)},${getEnergyY(s.freeEnergyKcalMol)}`).join(' ');
  // Polyline for Potential Energy
  const potentialEnergyPoints = timeSteps.map(s => `${getTimeX(s.timePs)},${getEnergyY(s.potentialEnergyKcalMol)}`).join(' ');
  // Polyline for Reactant Fraction (0 to 1 mapped to innerHeight)
  const reactantFractionPoints = timeSteps.map(s => `${getTimeX(s.timePs)},${padding.top + innerHeight - (s.reactantFraction * innerHeight)}`).join(' ');

  // 2. Calculations for Reaction Coordinate Profile
  const coordMinE = Math.min(...coordinatePoints.map(p => p.energyKcalMol), 0) - 5;
  const coordMaxE = Math.max(...coordinatePoints.map(p => p.energyKcalMol), 50) + 10;
  const coordRange = (coordMaxE - coordMinE) || 1;

  const getCoordX = (c: number) => padding.left + c * innerWidth;
  const getCoordY = (e: number) => padding.top + innerHeight - ((e - coordMinE) / coordRange) * innerHeight;

  // Smooth Bezier Curve Path for Reaction Coordinate
  const coordPathD = coordinatePoints.reduce((acc, curr, idx, arr) => {
    const x = getCoordX(curr.coordinate);
    const y = getCoordY(curr.energyKcalMol);
    if (idx === 0) return `M ${x} ${y}`;
    const prev = arr[idx - 1];
    const prevX = getCoordX(prev.coordinate);
    const prevY = getCoordY(prev.energyKcalMol);
    const cpX1 = prevX + (x - prevX) * 0.5;
    const cpX2 = prevX + (x - prevX) * 0.5;
    return `${acc} C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
  }, '');

  const currentStep = timeSteps[currentTimeIndex] || timeSteps[0];

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-xl border border-slate-800 p-3 space-y-2 shadow-md">
      {/* Top Header & Mode Switch */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>반응 역학 에너지 프로파일 &amp; 시계열 궤적</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[10px] font-semibold font-mono">
          <button
            onClick={() => setGraphMode('time-trajectory')}
            className={`px-2 py-0.5 rounded transition-colors ${
              graphMode === 'time-trajectory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            시계열 에너지 궤적 (Time-Resolved)
          </button>
          <button
            onClick={() => setGraphMode('reaction-coordinate')}
            className={`px-2 py-0.5 rounded transition-colors ${
              graphMode === 'reaction-coordinate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            반응 좌표계 (TS 장벽 곡선)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="freeEnergyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="coordBarrierGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac, idx) => {
            const y = padding.top + innerHeight * frac;
            return (
              <line
                key={`grid-y-${idx}`}
                x1={padding.left}
                y1={y}
                x2={padding.left + innerWidth}
                y2={y}
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Zero Energy Reference Line */}
          {graphMode === 'time-trajectory' && minEnergy <= 0 && maxEnergy >= 0 && (
            <line
              x1={padding.left}
              y1={getEnergyY(0)}
              x2={padding.left + innerWidth}
              y2={getEnergyY(0)}
              stroke="#475569"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
          )}

          {/* --- MODE 1: TIME-RESOLVED TRAJECTORY GRAPH --- */}
          {graphMode === 'time-trajectory' && (
            <>
              {/* Reactant fraction shaded area / curve */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.6"
                strokeDasharray="3 3"
                points={reactantFractionPoints}
              />

              {/* Potential energy curve */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                points={potentialEnergyPoints}
              />

              {/* Free energy area & curve */}
              <polygon
                fill="url(#freeEnergyGradient)"
                points={`${getTimeX(0)},${getEnergyY(minEnergy)} ${freeEnergyPoints} ${getTimeX(maxTime)},${getEnergyY(minEnergy)}`}
              />
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.4"
                points={freeEnergyPoints}
              />

              {/* Current time cursor line */}
              <line
                x1={getTimeX(currentStep.timePs)}
                y1={padding.top}
                x2={getTimeX(currentStep.timePs)}
                y2={padding.top + innerHeight}
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="3 2"
              />
              <circle
                cx={getTimeX(currentStep.timePs)}
                cy={getEnergyY(currentStep.freeEnergyKcalMol)}
                r="5"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </>
          )}

          {/* --- MODE 2: REACTION COORDINATE PROFILE --- */}
          {graphMode === 'reaction-coordinate' && (
            <>
              {/* Under-curve fill */}
              <path
                d={`${coordPathD} L ${getCoordX(1.0)} ${getCoordY(coordMinE)} L ${getCoordX(0.0)} ${getCoordY(coordMinE)} Z`}
                fill="url(#coordBarrierGradient)"
              />

              {/* Main transition barrier path */}
              <path
                d={coordPathD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.8"
              />

              {/* Coordinate Nodes */}
              {coordinatePoints.map((pt, pIdx) => {
                const cx = getCoordX(pt.coordinate);
                const cy = getCoordY(pt.energyKcalMol);
                const isPeak = pIdx === 2;

                return (
                  <g key={`pt-${pIdx}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isPeak ? 6 : 4.5}
                      fill={isPeak ? '#ef4444' : '#fbbf24'}
                      stroke="#0f172a"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy - 10}
                      textAnchor="middle"
                      fill={isPeak ? '#f87171' : '#cbd5e1'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {pt.energyKcalMol} kcal
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Axes labels */}
          <text
            x={padding.left - 8}
            y={padding.top + 5}
            textAnchor="end"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
          >
            {graphMode === 'time-trajectory' ? `${Math.round(maxEnergy)} kcal` : `${Math.round(coordMaxE)} kcal`}
          </text>
          <text
            x={padding.left - 8}
            y={padding.top + innerHeight}
            textAnchor="end"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="monospace"
          >
            {graphMode === 'time-trajectory' ? `${Math.round(minEnergy)} kcal` : `${Math.round(coordMinE)} kcal`}
          </text>

          <text
            x={padding.left + innerWidth / 2}
            y={height - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9.5"
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            {graphMode === 'time-trajectory' ? `반응 시간 경과 (Time, 0 ~ ${maxTime} ps)` : `반응 좌표 (Reaction Coordinate: Reactant → TS‡ → Product)`}
          </text>
        </svg>
      </div>

      {/* Graph Legend & Scrubber Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono">
        <div className="flex items-center gap-3">
          {graphMode === 'time-trajectory' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-cyan-400 rounded" />
                <span className="text-cyan-300 font-bold">자유 에너지 ΔG(t)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-amber-400 rounded" />
                <span className="text-amber-300">위치 에너지 V(t)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 border-b border-red-500 border-dashed" />
                <span className="text-red-400">잔류 분율 [A](t)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-red-300 font-bold">전이 상태 장벽 극대점 (TS‡)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-amber-400 rounded" />
                <span className="text-slate-300">최저 에너지 반응 경로</span>
              </div>
            </>
          )}
        </div>

        {/* Time Index Info */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">t = {currentStep.timePs} ps</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-bold">
            ΔG = {currentStep.freeEnergyKcalMol} kcal/mol
          </span>
        </div>
      </div>

      {/* Time Step Slider Scrubber (when in time-trajectory mode) */}
      {graphMode === 'time-trajectory' && onSelectTimeIndex && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-slate-400 shrink-0">시간 진행 (Time Scrubber):</span>
          <input
            type="range"
            min={0}
            max={timeSteps.length - 1}
            value={currentTimeIndex}
            onChange={(e) => onSelectTimeIndex(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
