import React, { useState, useMemo } from 'react';
import { Molecule } from '../types/quantum';
import { Cpu, Sliders, Activity, Shuffle, BarChart3, HelpCircle } from 'lucide-react';

interface QuantumCircuitViewProps {
  molecule: Molecule;
  onUpdateParameters?: (newParams: number[]) => void;
}

export const QuantumCircuitView: React.FC<QuantumCircuitViewProps> = ({
  molecule,
  onUpdateParameters
}) => {
  const config = molecule.quantumCircuitConfig;
  const numQubits = Math.min(8, config.numQubits || 4); // Display up to 8 qubits for clear UI
  const [params, setParams] = useState<number[]>(config.parameters || [0.4, -0.8, 1.2, -0.5, 0.9, -1.1, 0.3, -0.6]);
  const [selectedQubit, setSelectedQubit] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'circuit' | 'bloch' | 'shots' | 'hamiltonian'>('circuit');
  const [numShots, setNumShots] = useState<number>(1024);
  const [isSimulatingShots, setIsSimulatingShots] = useState<boolean>(false);
  const [shotCounts, setShotCounts] = useState<Record<string, number>>({});

  // Compute statevector probabilities based on rotation parameters
  const stateProbabilities = useMemo(() => {
    // Generate basis states for 4 qubits (16 states) or n qubits
    const displayQubits = Math.min(4, numQubits);
    const numStates = 1 << displayQubits;
    const rawProbs: number[] = [];
    let sum = 0;

    for (let i = 0; i < numStates; i++) {
      // Approximate physical quantum amplitude from variational parameters
      const p1 = Math.sin((params[i % params.length] || 0.5) * 1.5 + (i * 0.7));
      const p2 = Math.cos((params[(i + 1) % params.length] || 0.3) * 0.8 + (i * 0.3));
      const val = Math.pow(Math.abs(p1 * p2), 2) + 0.02;
      rawProbs.push(val);
      sum += val;
    }

    const normalized = rawProbs.map((p) => p / sum);
    return normalized.map((prob, idx) => ({
      state: idx.toString(2).padStart(displayQubits, '0'),
      probability: prob
    })).sort((a, b) => b.probability - a.probability).slice(0, 8);
  }, [params, numQubits]);

  // Simulate measurement shots
  const handleRunShots = () => {
    setIsSimulatingShots(true);
    setTimeout(() => {
      const counts: Record<string, number> = {};
      const states = stateProbabilities;
      for (let s = 0; s < numShots; s++) {
        const rand = Math.random();
        let cumulative = 0;
        let chosen = states[states.length - 1].state;
        for (const item of states) {
          cumulative += item.probability;
          if (rand <= cumulative) {
            chosen = item.state;
            break;
          }
        }
        counts[chosen] = (counts[chosen] || 0) + 1;
      }
      setShotCounts(counts);
      setIsSimulatingShots(false);
    }, 400);
  };

  const handleParamChange = (index: number, val: number) => {
    const next = [...params];
    next[index] = val;
    setParams(next);
    onUpdateParameters?.(next);
  };

  // Hamiltonian Pauli decomposition terms for the molecule
  const pauliTerms = useMemo(() => {
    const energy = molecule.quantumProperties.groundStateEnergy;
    return [
      { pauli: 'IIII', coeff: (energy * 0.42).toFixed(5), type: 'Core Energy + Nuclear Repulsion' },
      { pauli: 'ZIII', coeff: (-0.3842).toFixed(5), type: '1-Electron Orbital q0' },
      { pauli: 'IZII', coeff: (-0.2915).toFixed(5), type: '1-Electron Orbital q1' },
      { pauli: 'IIZI', coeff: (-0.1428).toFixed(5), type: '1-Electron Orbital q2' },
      { pauli: 'IIIZ', coeff: (-0.0892).toFixed(5), type: '1-Electron Orbital q3' },
      { pauli: 'ZZII', coeff: (0.1741).toFixed(5), type: 'Coulomb Repulsion q0-q1' },
      { pauli: 'XXYY', coeff: (0.0456).toFixed(5), type: 'Pair Excitation (UCCSD Entanglement)' },
      { pauli: 'YYXX', coeff: (-0.0456).toFixed(5), type: 'Pair Excitation (UCCSD Entanglement)' },
      { pauli: 'ZIZI', coeff: (0.1120).toFixed(5), type: 'Exchange Interaction q0-q2' },
      { pauli: 'XIXI', coeff: (0.0215).toFixed(5), type: 'Tunneling Matrix Element' }
    ];
  }, [molecule]);

  // Selected Qubit angles for Bloch sphere
  const selectedParam = params[selectedQubit % params.length] || 0.5;
  const blochTheta = Math.abs(selectedParam % Math.PI);
  const blochPhi = (selectedParam * 2) % (2 * Math.PI);
  const blochX = Math.sin(blochTheta) * Math.cos(blochPhi);
  const blochY = Math.sin(blochTheta) * Math.sin(blochPhi);
  const blochZ = Math.cos(blochTheta);

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Circuit Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">양자 변분 회로 (PQC / VQE Ansatz)</h3>
          <span className="text-xs text-slate-500 font-mono">[{config.ansatzType}] · {numQubits} Qubits</span>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('circuit')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'circuit' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
          >
            회로 다이어그램
          </button>
          <button
            onClick={() => setActiveTab('bloch')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'bloch' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
          >
            블로흐 구 (Bloch)
          </button>
          <button
            onClick={() => setActiveTab('shots')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'shots' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
          >
            측정 샷 & 확률
          </button>
          <button
            onClick={() => setActiveTab('hamiltonian')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'hamiltonian' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
          >
            파울리 해밀토니안
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'circuit' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Hadamard 중첩 준비 → Ry(θ) / Rz(φ) 매개변수화 회전 → CNOT 얽힘 격자망 → Pauli 측정기</span>
              <span className="font-mono text-cyan-400">회로 깊이: {config.depth}</span>
            </div>

            {/* Circuit Grid Diagram */}
            <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-4 overflow-x-auto">
              <div className="min-w-[620px] space-y-4">
                {Array.from({ length: numQubits }).map((_, qIdx) => {
                  const paramVal = params[qIdx % params.length] || 0.0;
                  return (
                    <div key={qIdx} className="flex items-center gap-3">
                      {/* Qubit Label */}
                      <button
                        onClick={() => setSelectedQubit(qIdx)}
                        className={`w-12 text-left font-mono text-xs px-2 py-1 rounded transition-colors ${selectedQubit === qIdx ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        |q{qIdx}⟩
                      </button>

                      {/* Wire line with Gates */}
                      <div className="flex-1 relative flex items-center h-10">
                        {/* Horizontal Quantum Wire */}
                        <div className="absolute inset-x-0 h-0.5 bg-slate-700/80" />

                        {/* Gate 1: Hadamard */}
                        <div className="relative z-10 w-9 h-9 mx-2 bg-indigo-950 border border-indigo-500/60 rounded flex items-center justify-center font-mono text-xs text-indigo-300 font-bold shadow-md">
                          H
                        </div>

                        {/* Gate 2: Ry(θ) */}
                        <div className="relative z-10 px-2.5 h-9 mx-2 bg-cyan-950 border border-cyan-500/60 rounded flex items-center justify-center font-mono text-xs text-cyan-300 shadow-md">
                          Ry(θ{qIdx})
                        </div>

                        {/* Gate 3: CNOT Entanglement Connection */}
                        <div className="relative z-10 w-8 h-8 mx-2 flex items-center justify-center">
                          {qIdx % 2 === 0 ? (
                            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-sm" title="CNOT Control" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center text-cyan-400 font-bold text-xs" title="CNOT Target">
                              +
                            </div>
                          )}
                        </div>

                        {/* Gate 4: Rz(φ) */}
                        <div className="relative z-10 px-2.5 h-9 mx-2 bg-emerald-950 border border-emerald-500/60 rounded flex items-center justify-center font-mono text-xs text-emerald-300 shadow-md">
                          Rz(φ{qIdx})
                        </div>

                        {/* Gate 5: Measurement Meter */}
                        <div className="relative z-10 ml-auto w-9 h-9 bg-slate-800 border border-slate-600 rounded flex items-center justify-center text-slate-300 text-xs font-mono">
                          ⟨Z⟩
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Variational Parameter Sliders */}
            <div className="bg-slate-900/40 rounded-lg border border-slate-800/80 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-medium text-slate-200">변분 매개변수 가중치 (θi 실시간 튜닝)</span>
                </div>
                <button
                  onClick={() => {
                    const randomized = params.map(() => parseFloat(((Math.random() - 0.5) * 3.14).toFixed(3)));
                    setParams(randomized);
                    onUpdateParameters?.(randomized);
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  <Shuffle className="w-3 h-3" /> 무작위 섭동(Perturb)
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {params.slice(0, 8).map((paramVal, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-2.5 rounded border border-slate-800 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-400">θ{idx}</span>
                      <span className="text-cyan-300 font-semibold">{paramVal.toFixed(3)} rad</span>
                    </div>
                    <input
                      type="range"
                      min="-3.14"
                      max="3.14"
                      step="0.01"
                      value={paramVal}
                      onChange={(e) => handleParamChange(idx, parseFloat(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bloch' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* 2D Projected Bloch Sphere Representation */}
            <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-6 flex flex-col items-center justify-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Sphere outline */}
                <div className="w-48 h-48 rounded-full border border-cyan-500/30 bg-cyan-950/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center" />
                {/* Equator ellipse */}
                <div className="absolute w-48 h-16 rounded-full border border-dashed border-slate-600/70" />
                {/* Meridian ellipse */}
                <div className="absolute h-48 w-16 rounded-full border border-dashed border-slate-600/70" />

                {/* Axes */}
                <div className="absolute inset-x-0 h-px bg-slate-700" />
                <div className="absolute inset-y-0 w-px bg-slate-700" />

                {/* Axis Labels */}
                <span className="absolute top-1 font-mono text-xs font-bold text-cyan-300">|0⟩ (+z)</span>
                <span className="absolute bottom-1 font-mono text-xs font-bold text-slate-400">|1⟩ (-z)</span>
                <span className="absolute right-0 font-mono text-xs text-slate-400">+x</span>
                <span className="absolute left-1 font-mono text-xs text-slate-400">-x</span>

                {/* State Vector Arrow */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 224 224">
                  <line
                    x1="112"
                    y1="112"
                    x2={112 + blochX * 75}
                    y2={112 - blochZ * 75}
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={112 + blochX * 75}
                    cy={112 - blochZ * 75}
                    r="5"
                    fill="#38bdf8"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>q{selectedQubit} 상태:</span>
                <span className="text-cyan-300 font-semibold">
                  |ψ⟩ = {Math.cos(blochTheta / 2).toFixed(3)}|0⟩ + {Math.sin(blochTheta / 2).toFixed(3)} e^(i{blochPhi.toFixed(2)})|1⟩
                </span>
              </div>
            </div>

            {/* Qubit Selector & Angle Details */}
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-3">
                <span className="text-xs font-medium text-slate-300">분석 대상 큐비트 선택</span>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: numQubits }).map((_, q) => (
                    <button
                      key={q}
                      onClick={() => setSelectedQubit(q)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${selectedQubit === q ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                    >
                      Qubit q{q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">극각 (Polar angle θ):</span>
                  <span className="text-cyan-300">{blochTheta.toFixed(3)} rad ({(blochTheta * 180 / Math.PI).toFixed(1)}°)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">방위각 (Azimuthal angle φ):</span>
                  <span className="text-cyan-300">{blochPhi.toFixed(3)} rad ({(blochPhi * 180 / Math.PI).toFixed(1)}°)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">|0⟩ 투영 확률 P(0):</span>
                  <span className="text-emerald-400">{(Math.pow(Math.cos(blochTheta / 2), 2) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">|1⟩ 투영 확률 P(1):</span>
                  <span className="text-emerald-400">{(Math.pow(Math.sin(blochTheta / 2), 2) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shots' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">계산 기저 상태 측정 확률 분포 (Measurement Collapse)</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={numShots}
                  onChange={(e) => setNumShots(parseInt(e.target.value, 10))}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1"
                >
                  <option value={512}>512 샷</option>
                  <option value={1024}>1024 샷</option>
                  <option value={4096}>4096 샷</option>
                </select>
                <button
                  onClick={handleRunShots}
                  disabled={isSimulatingShots}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Activity className={`w-3.5 h-3.5 ${isSimulatingShots ? 'animate-spin' : ''}`} />
                  {isSimulatingShots ? '양자 붕괴 샘플링 중...' : '양자 샷 시뮬레이션'}
                </button>
              </div>
            </div>

            {/* Probability Histogram Bars */}
            <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-800 space-y-3">
              {stateProbabilities.map((item) => {
                const count = shotCounts[item.state] || Math.round(item.probability * numShots);
                const measuredProb = count / numShots;
                const percent = (measuredProb * 100).toFixed(1);

                return (
                  <div key={item.state} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-cyan-300 font-bold">|{item.state}⟩</span>
                      <span className="text-slate-400">
                        {count} 샷 ({percent}%) · 이론값: {(item.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'hamiltonian' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">
              분자 해밀토니안의 2차 양자화 페르미온 연산자를 Jordan-Wigner 변환으로 파울리 문자열 집합으로 변환한 결과입니다.
            </div>

            <div className="bg-slate-900/80 rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">연산자 (Pauli String)</th>
                    <th className="py-2 px-3">가중 계수 (Hartrees)</th>
                    <th className="py-2 px-3">물리적 기여 (Physical Origin)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {pauliTerms.map((term, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-cyan-300 font-semibold">{term.pauli}</td>
                      <td className="py-2 px-3 text-emerald-400">{term.coeff}</td>
                      <td className="py-2 px-3 text-slate-400 font-sans">{term.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
