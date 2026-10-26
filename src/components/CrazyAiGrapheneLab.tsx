import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  Cpu,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Flame,
  Atom as AtomIcon,
  BookOpen,
  ArrowRight,
  Maximize2,
  RefreshCw,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import {
  GRAPHENE_CANDIDATES,
  GRAPHENE_PCA_POINTS,
  PRESENTATION_SLIDES,
  GrapheneCandidate,
  PcaPoint,
  createGrapheneMolecule
} from '../data/grapheneMaterialsData';
import { Molecule } from '../types/quantum';

interface CrazyAiGrapheneLabProps {
  onLoadIntoMainViewer: (mol: Molecule) => void;
}

export const CrazyAiGrapheneLab: React.FC<CrazyAiGrapheneLabProps> = ({
  onLoadIntoMainViewer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ppt' | 'colab' | 'candidates' | 'analysis' | 'dft'>('candidates');
  const [selectedCandidate, setSelectedCandidate] = useState<GrapheneCandidate>(GRAPHENE_CANDIDATES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'mid'>('all');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isPresentationFullscreen, setIsPresentationFullscreen] = useState(false);
  const [dftCompletedSteps, setDftCompletedSteps] = useState<Record<string, number[]>>({
    'mp-4691': [1, 4, 6],
    'mp-1029975': [1, 2, 4],
    'mp-9956': [1, 2, 3, 4, 5, 7]
  });

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    return GRAPHENE_CANDIDATES.filter((cand) => {
      const matchesSearch =
        cand.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cand.material_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesScore = true;
      if (scoreFilter === 'high') {
        matchesScore = cand.graphene_score >= 2.0;
      } else if (scoreFilter === 'mid') {
        matchesScore = cand.graphene_score >= 1.8 && cand.graphene_score < 2.0;
      }
      return matchesSearch && matchesScore;
    });
  }, [searchTerm, scoreFilter]);

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex] || PRESENTATION_SLIDES[0];

  const handleToggleDftStep = (materialId: string, stepNum: number) => {
    setDftCompletedSteps((prev) => {
      const current = prev[materialId] || [];
      const updated = current.includes(stepNum)
        ? current.filter((s) => s !== stepNum)
        : [...current, stepNum].sort((a, b) => a - b);
      return { ...prev, [materialId]: updated };
    });
  };

  const handleLoadMolecule = (cand: GrapheneCandidate) => {
    const mol = createGrapheneMolecule(cand);
    onLoadIntoMainViewer(mol);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800/80 p-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold font-mono tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                CRAZY AI &amp; ROBOTICS
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Graphene Materials Transformer V5
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CrystalNN Geometric Bias
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Multi-Task (Ef, Eg, Ehull)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              CRAZY AI &amp; Robotics Graphene 종합 연구소
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Materials Project 빅데이터와 CrystalNN 기하학적 구조 추출, Geometric Attention Bias Transformer를 결합하여 그래핀 유사 2D 신물질을 스크리닝·랭킹하고 양자화학 DFT 검증 체크리스트를 제공하는 통합 파이프라인입니다.
            </p>
          </div>

          {/* Quick Action Badges / Downloads */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="/assets/aistudio/CRAZY_AI_Graphene_Materials_Transformer_V5_2_Integrated_with_Illustrations_Korean_Annotated_3c0d22be.ipynb"
              download="CRAZY_AI_Graphene_Materials_Transformer_V5_2.ipynb"
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-950"
              title="Google Colab Jupyter Notebook (.ipynb) 원본 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Colab 노트북 (.ipynb)</span>
            </a>
            <a
              href="/assets/aistudio/CRAZY_AI_Graphene_Transformer_V5_Presentation_b7a72457.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="독립 브라우저 탭에서 PPT Web 슬라이드 전체화면 열기"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>PPT Web 전체화면</span>
            </a>
            <button
              onClick={() => setIsScriptModalOpen(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="11~12분 정밀 발표 스크립트 전문 보기"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>발표 스크립트 (12분)</span>
            </button>
          </div>
        </div>

        {/* KPI Mini Metric Bar */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-slate-800/60">
          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">스크리닝 대상 결정체</div>
              <div className="text-sm font-bold font-mono text-cyan-200">32,534+ 무기화합물</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">최고 랭킹 후보 1위</div>
              <div className="text-sm font-bold font-mono text-amber-200">Ag₂CO₃ (Score 4.24)</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">AI 트랜스포머 구조</div>
              <div className="text-sm font-bold font-mono text-indigo-200">ComFormer 4L Pre-LN</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">학습 최적 수렴 구간</div>
              <div className="text-sm font-bold font-mono text-emerald-200">25 ~ 40 Epochs MSE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-5 shrink-0 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 py-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveSubTab('candidates')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'candidates'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>그래핀 후보 랭킹 (Top 50)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ppt')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'ppt'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>PPT Web 슬라이드 &amp; 발표 스크립트</span>
            </button>

            <button
              onClick={() => setActiveSubTab('colab')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'colab'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Colab 노트북 &amp; 6단계 파이프라인</span>
            </button>

            <button
              onClick={() => setActiveSubTab('analysis')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'analysis'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>학습 곡선 &amp; PCA 임베딩 분석</span>
            </button>

            <button
              onClick={() => setActiveSubTab('dft')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'dft'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
              <span>DFT 7단계 정밀 검증 프로토콜</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 hidden md:block">
            Model: <span className="text-cyan-300">MaterialsTransformer V5.2</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: Candidates Ranked Table & Material Detail                          */}
        {/* ========================================================================= */}
        {activeSubTab === 'candidates' && (
          <div className="space-y-6">
            {/* Search & Filter Controls */}
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="화학식 또는 Material ID 검색 (예: Ag2CO3, mp-4691, Al2(CN2)3)..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setScoreFilter('all')}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      scoreFilter === 'all'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    전체 ({GRAPHENE_CANDIDATES.length})
                  </button>
                  <button
                    onClick={() => setScoreFilter('high')}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      scoreFilter === 'high'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    Score ≥ 2.0 (상위권)
                  </button>
                  <button
                    onClick={() => setScoreFilter('mid')}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      scoreFilter === 'mid'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    1.8 ~ 2.0
                  </button>
                </div>
              </div>

              {/* CSV Download Link */}
              <div className="flex items-center gap-2">
                <a
                  href="/assets/aistudio/graphene_like_candidates_ranked_v5__2__fc7b0bb0.csv"
                  download="graphene_like_candidates_ranked_v5_2.csv"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="50종 그래핀 유사 후보 CSV 원본 다운로드"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>랭킹 CSV</span>
                </a>
                <a
                  href="/assets/aistudio/materials_with_graphene_scores_v5__2__ea084eb3.csv"
                  download="materials_with_graphene_scores_v5_2.csv"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="500종 전체 물질 예측값 및 그래핀 스코어 CSV 다운로드"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>전체 500종 CSV</span>
                </a>
              </div>
            </div>

            {/* Split View: Table on Left / Selected Card on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Candidates Table (7 cols) */}
              <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    그래핀 유사 후보 물질 랭킹 ({filteredCandidates.length}개)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    선택 후 우측에서 3D 로드 및 DFT 분석
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">순위</th>
                        <th className="p-2.5">화학식</th>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5 text-right">G-Score</th>
                        <th className="p-2.5 text-right">Ef (eV)</th>
                        <th className="p-2.5 text-right">Eg (eV)</th>
                        <th className="p-2.5 text-right">3배위</th>
                        <th className="p-2.5 text-center">선택</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {filteredCandidates.map((cand) => {
                        const isSelected = selectedCandidate.material_id === cand.material_id;
                        return (
                          <tr
                            key={cand.material_id}
                            onClick={() => setSelectedCandidate(cand)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-amber-500/15 border-l-4 border-l-amber-500'
                                : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="p-2.5 font-mono font-bold">
                              {cand.rank <= 3 ? (
                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                                  cand.rank === 1 ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                                  cand.rank === 2 ? 'bg-slate-400/30 text-slate-200 border border-slate-400/40' :
                                  'bg-amber-700/30 text-amber-400 border border-amber-700/40'
                                }`}>
                                  {cand.rank}
                                </span>
                              ) : (
                                <span className="text-slate-400">#{cand.rank}</span>
                              )}
                            </td>
                            <td className="p-2.5 font-bold font-mono text-cyan-200">
                              {cand.formula}
                            </td>
                            <td className="p-2.5 font-mono text-slate-400 text-[11px]">
                              {cand.material_id}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold">
                              <span className={`px-2 py-0.5 rounded ${
                                cand.graphene_score >= 3.0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                cand.graphene_score >= 2.0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              }`}>
                                {cand.graphene_score.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">
                              {cand.pred_formation_energy.toFixed(2)}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-300">
                              {cand.pred_band_gap.toFixed(2)}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-400">
                              {(cand.three_coordinate_fraction * 100).toFixed(0)}%
                            </td>
                            <td className="p-2.5 text-center">
                              <ChevronRight className={`w-4 h-4 mx-auto transition-transform ${isSelected ? 'text-amber-400 translate-x-1' : 'text-slate-600'}`} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Material Detail Card (5 cols) */}
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Rank #{selectedCandidate.rank}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {selectedCandidate.material_id}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black font-mono text-cyan-300 mt-1">
                        {selectedCandidate.formula}
                      </h2>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">Graphene Score</div>
                      <div className="text-2xl font-black font-mono text-amber-400">
                        {selectedCandidate.graphene_score.toFixed(3)}
                      </div>
                    </div>
                  </div>

                  {/* Core Properties Matrix */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">예측 형성 에너지 (Ef)</div>
                      <div className="text-sm font-bold font-mono text-emerald-300">
                        {selectedCandidate.pred_formation_energy.toFixed(3)} eV/atom
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        DFT 목표값: {selectedCandidate.formation_energy.toFixed(3)}
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">예측 밴드갭 (Band Gap)</div>
                      <div className="text-sm font-bold font-mono text-cyan-300">
                        {selectedCandidate.pred_band_gap.toFixed(3)} eV
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        DFT 목표값: {selectedCandidate.band_gap.toFixed(3)} eV
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">Energy Above Hull (Ehull)</div>
                      <div className="text-sm font-bold font-mono text-indigo-300">
                        {selectedCandidate.pred_energy_above_hull.toFixed(4)} eV/atom
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {selectedCandidate.pred_energy_above_hull <= 0.05 ? '열역학적 초안정상' : '준안정상'}
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-400">3배위 구조 분율 (sp²)</div>
                      <div className="text-sm font-bold font-mono text-amber-300">
                        {(selectedCandidate.three_coordinate_fraction * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        탄소 3배위수: {selectedCandidate.carbon_three_coordinate_count}개
                      </div>
                    </div>
                  </div>

                  {/* Structural Proxies Details */}
                  <div className="bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-lg space-y-2 text-xs">
                    <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
                      CrystalNN 기하학적 프록시 평가치
                    </span>
                    <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">평균 결합각 (Mean Bond Angle):</span>
                        <span className="text-cyan-300">{selectedCandidate.mean_bond_angle.toFixed(1)}° (이상값: 120°)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">탄소 sp² 각도 편차:</span>
                        <span className="text-amber-300">{selectedCandidate.carbon_sp2_angle_deviation.toFixed(1)}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">C–C 결합길이 편차:</span>
                        <span className="text-slate-200">{selectedCandidate.cc_bond_length_deviation.toFixed(3)} Å</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">평균 배위수 (Mean CN):</span>
                        <span className="text-indigo-300">{selectedCandidate.mean_coordination_number.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Screening Verdict Note */}
                  <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-lg flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200/90 leading-relaxed">
                      <strong className="text-amber-300 block">AI 스크리닝 주의사항 (Heuristic Verdict):</strong>
                      graphene_score는 구조 기반 우선순위 랭킹 휴리스틱이며, DFT 계산이나 실험 결과를 대체하지 않습니다. 실제 Dirac cone 및 2D 안정성은 DFT 검증 탭에서 확인해야 합니다.
                    </div>
                  </div>
                </div>

                {/* Primary Action Button: Load into 3D Molecular Simulator */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => handleLoadMolecule(selectedCandidate)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 via-orange-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-950"
                  >
                    <AtomIcon className="w-4 h-4 animate-spin text-amber-200" />
                    <span>[3D 시뮬레이터에 로드] — {selectedCandidate.formula} 입체 분자 합성 시현</span>
                  </button>

                  <div className="text-center text-[10px] text-slate-500">
                    클릭 시 선택된 후보의 3D 나노격자 원자 좌표와 결합 구조를 메인 뷰어에 즉시 합성 반영합니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PPT Web & Presentation Script                                     */}
        {/* ========================================================================= */}
        {activeSubTab === 'ppt' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  CRAZY AI Graphene Materials Transformer V5 웹 발표 프레젠테이션
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  12개 핵심 슬라이드와 11~12분 정밀 한국어 발표 스크립트가 연동된 반응형 인터랙티브 덱입니다.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPresentationFullscreen(!isPresentationFullscreen)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{isPresentationFullscreen ? '창 축소' : '임베드 확대'}</span>
                </button>
                <a
                  href="/assets/aistudio/CRAZY_AI_Graphene_Transformer_V5_Presentation_b7a72457.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>새 창에서 전체화면 재생</span>
                </a>
              </div>
            </div>

            {/* Embedded Presentation Frame */}
            <div className={`bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative transition-all ${
              isPresentationFullscreen ? 'h-[750px]' : 'h-[520px]'
            }`}>
              <iframe
                src="/assets/aistudio/CRAZY_AI_Graphene_Transformer_V5_Presentation_b7a72457.html"
                title="CRAZY AI Graphene Transformer V5 Presentation"
                className="w-full h-full border-0"
              />
            </div>

            {/* Slide-by-Slide Script Navigator */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    슬라이드 {currentSlide.slideNumber} / {PRESENTATION_SLIDES.length}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    {currentSlide.title}
                  </h4>
                  <span className="text-xs text-slate-400">
                    예상 소요 시간: {currentSlide.duration} | 분야: {currentSlide.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-300 px-2">
                    {currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}
                  </span>
                  <button
                    disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
                    onClick={() => setCurrentSlideIndex((i) => Math.min(PRESENTATION_SLIDES.length - 1, i + 1))}
                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Summary & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800/80 space-y-2">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    슬라이드 핵심 발표 요약 (Script Summary)
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentSlide.summary}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">핵심 하이라이트:</span>
                    <ul className="space-y-1">
                      {currentSlide.keyHighlights.map((hl, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actual Speech Script in Korean */}
                <div className="bg-slate-950/70 p-4 rounded-lg border border-slate-800/80 space-y-2">
                  <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    한국어 실시간 발표 대본 (Narration Script)
                  </span>
                  <div className="space-y-2 text-xs text-slate-200 leading-relaxed font-sans max-h-48 overflow-y-auto pr-1">
                    {currentSlide.script.map((paragraph, idx) => (
                      <p key={idx} className="bg-slate-900/60 p-2 rounded border border-slate-800/60">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Jump Buttons for All 12 Slides */}
              <div className="pt-2">
                <div className="text-[11px] text-slate-400 mb-2">슬라이드 바로가기:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {PRESENTATION_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.slideNumber}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`p-2 rounded-lg text-left text-[11px] transition-all border ${
                        currentSlideIndex === idx
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                          : 'bg-slate-950 hover:bg-slate-800/80 text-slate-400 border-slate-800'
                      }`}
                    >
                      <div className="font-mono font-bold text-[10px] text-slate-500">Slide {slide.slideNumber}</div>
                      <div className="font-medium truncate">{slide.title.split('—')[0].replace('슬라이드 ', '')}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: Colab Notebook & 6-Stage Pipeline                                 */}
        {/* ========================================================================= */}
        {activeSubTab === 'colab' && (
          <div className="space-y-6">
            {/* Top Download Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Jupyter Notebook v5.2
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    GPU T4 Accelerated
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    한국어 주석 완비
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  CRAZY AI Graphene Materials Transformer V5_2 Integrated.ipynb
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl">
                  Materials Project 데이터 추출부터 CrystalNN Voronoi 이웃 그래프 생성, ComFormer 기하학적 편향 학습, 50종 그래핀 유사 후보 도출까지 전 과정을 담은 실무 연구 노트북입니다.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/assets/aistudio/CRAZY_AI_Graphene_Materials_Transformer_V5_2_Integrated_with_Illustrations_Korean_Annotated_3c0d22be.ipynb"
                  download="CRAZY_AI_Graphene_Materials_Transformer_V5_2.ipynb"
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-950"
                >
                  <Download className="w-4 h-4" />
                  <span>노트북 다운로드 (.ipynb)</span>
                </a>
                <a
                  href="https://colab.research.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Colab 열기</span>
                </a>
              </div>
            </div>

            {/* 6-Stage End-to-End Pipeline Walkthrough */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                6단계 엔드투엔드(End-to-End) 스크리닝 파이프라인
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-xs font-bold font-mono">1</span>
                    <h5 className="text-xs font-bold text-slate-200">Materials Project 데이터 수집</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    MPRester API를 통해 32,534+ 무기 결정의 구조(Structure), 형성 에너지, 밴드갭, Convex Hull 분율 및 CIF 정보를 일괄 추출합니다.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 p-1.5 rounded border border-cyan-900/40">
                    doc_count: 32,534 | Rate: 299 docs/s
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xs font-bold font-mono">2</span>
                    <h5 className="text-xs font-bold text-slate-200">CrystalNN 기하학적 피처 추출</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Voronoi 다면체 해석을 통해 원자별 국소 이웃, edge_index 결합 쌍, 결합 거리(Å) 및 3배위 분율 구조 프록시를 생성합니다.
                  </p>
                  <div className="text-[10px] font-mono text-indigo-400/90 bg-indigo-950/40 p-1.5 rounded border border-indigo-900/40">
                    edge_attr: Bond lengths (Å) &amp; Angles
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs font-bold font-mono">3</span>
                    <h5 className="text-xs font-bold text-slate-200">MaterialsTransformer V5 학습</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    4층 Pre-LN ComFormer Encoder와 결합길이 기하학적 어텐션 바이어스를 통해 형성 에너지, 밴드갭, Ehull을 멀티태스크로 동시 학습합니다.
                  </p>
                  <div className="text-[10px] font-mono text-amber-400/90 bg-amber-950/40 p-1.5 rounded border border-amber-900/40">
                    Attn: QKᵀ / √dₖ + Bias(bond_length)
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-xs font-bold font-mono">4</span>
                    <h5 className="text-xs font-bold text-slate-200">graphene_score 휴리스틱 랭킹</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    1.42Å 기준 C-C 결합길이 편차, 120° 결합각 편차, 3배위수 분율 및 예측 열역학 물성을 가중 결합하여 고득점 후보를 순위화합니다.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/40 p-1.5 rounded border border-emerald-900/40">
                    Top-1: Ag2CO3 (Score 4.242)
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xs font-bold font-mono">5</span>
                    <h5 className="text-xs font-bold text-slate-200">PCA 임베딩 &amp; 트리 모델 비교</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    128차원 ComFormer 잠재 표현 공간을 PCA 2차원으로 축소하고 Random Forest/XGBoost 독립 기준모형과 예측 성능을 상호 비교합니다.
                  </p>
                  <div className="text-[10px] font-mono text-purple-400/90 bg-purple-950/40 p-1.5 rounded border border-purple-900/40">
                    PCA1 vs PCA2 Latent Clusters
                  </div>
                </div>

                <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-xs font-bold font-mono">6</span>
                    <h5 className="text-xs font-bold text-slate-200">7단계 DFT 심층 검증 체크리스트</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    도출된 후보군에 대해 Dirac cone, 포논 동적 안정성, 2D Cleavage Energy, Fermi DOS, 상 안정성을 순차 검증하도록 안내합니다.
                  </p>
                  <div className="text-[10px] font-mono text-rose-400/90 bg-rose-950/40 p-1.5 rounded border border-rose-900/40">
                    DFT Protocol Checklist
                  </div>
                </div>
              </div>
            </div>

            {/* Core PyTorch Code Snippet from Notebook */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden space-y-2">
              <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  PyTorch Core: GeometricBiasMultiheadAttention &amp; ComFormer Layer
                </span>
                <span className="text-[10px] font-mono text-slate-500">Python 3.10 / PyTorch / PyG</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-950/90">
{`# ------------------------------------------------------------------------------
# 1. Geometric Bias Multihead Attention Module (결합 길이 거리 편향 주입)
# ------------------------------------------------------------------------------
class GeometricBiasMultiheadAttention(nn.Module):
    def __init__(self, embed_dim, num_heads, rbf_dim=32):
        super().__init__()
        self.mha = nn.MultiheadAttention(embed_dim, num_heads, batch_first=True)
        self.rbf_proj = nn.Linear(rbf_dim, num_heads)  # 결합길이 RBF -> Head별 Bias 사영

    def forward(self, x, bond_dists=None, key_padding_mask=None):
        # Attention Score = (Q * K^T) / sqrt(d_k) + Geometric_Bias(bond_dists)
        if bond_dists is not None:
            rbf_feats = rbf_expansion(bond_dists) # [B, N, N, rbf_dim]
            bias = self.rbf_proj(rbf_feats).permute(0, 3, 1, 2) # [B*heads, N, N]
        else:
            bias = None
        out, _ = self.mha(x, x, x, attn_mask=bias, key_padding_mask=key_padding_mask)
        return out

# ------------------------------------------------------------------------------
# 2. MaterialsTransformerV5 Pre-LN Multi-Task Model
# ------------------------------------------------------------------------------
class MaterialsTransformerV5(nn.Module):
    def __init__(self, num_species=95, elem_dim=9, embed_dim=128, depth=4):
        super().__init__()
        self.atom_embed = nn.Embedding(num_species, embed_dim)
        self.elem_proj = nn.Linear(elem_dim, embed_dim)
        self.layers = nn.ModuleList([
            ComFormerEncoderLayer(embed_dim, num_heads=4) for _ in range(depth)
        ])
        self.pool = AttentionPooling(embed_dim)
        
        # 3 Multi-Task Heads (형성 에너지, 밴드갭, Convex Hull 에너지)
        self.head_ef = nn.Linear(embed_dim, 1)    # Formation Energy (eV/atom)
        self.head_eg = nn.Linear(embed_dim, 1)    # Band Gap (eV)
        self.head_ehull = nn.Linear(embed_dim, 1) # Energy Above Hull (eV/atom)`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: Training Dynamics & PCA Embeddings                                 */}
        {/* ========================================================================= */}
        {activeSubTab === 'analysis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Training Curve Image Asset Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      1. MaterialsTransformer V5 학습 및 검증 곡선 (Training Curves)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">MSE Loss History</span>
                  </div>

                  <div className="my-3 bg-black/60 rounded-lg overflow-hidden border border-slate-800 p-2 flex items-center justify-center">
                    <img
                      src="/assets/aistudio/training_curve_v5__2__cf74a037.png"
                      alt="MaterialsTransformer V5 Training Curve"
                      className="w-full h-auto max-h-[320px] object-contain rounded"
                    />
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <strong className="text-cyan-300 block text-[11px] uppercase tracking-wider">
                      학습 동역학(Training Dynamics) 해석 보고서:
                    </strong>
                    <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                      <li><strong className="text-slate-200">1~10 Epochs:</strong> Train 및 Validation MSE 손실이 초반에 급격히 감소하며 원자 번호와 결합 길이 특징을 신속히 인코딩.</li>
                      <li><strong className="text-slate-200">25~40 Epochs:</strong> 가중치 감쇠(Weight Decay)와 Pre-LN 구조에 의해 진동 없이 안정적으로 수렴(Plateau).</li>
                      <li><strong className="text-slate-200">일반화 검증:</strong> Train 오차와 Validation 오차 간의 간극이 매우 좁아 중대한 과적합(Overfitting) 없이 우수한 일반화 성능을 증명.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/assets/aistudio/training_curve_v5__2__cf74a037.png"
                    download="training_curve_v5_2.png"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>학습 곡선 고해상도 PNG 다운로드</span>
                  </a>
                </div>
              </div>

              {/* PCA Embedding Image Asset Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      2. Graphene Embedding PCA 2D 투영 산점도 (Latent Space)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">PCA1 vs PCA2</span>
                  </div>

                  <div className="my-3 bg-black/60 rounded-lg overflow-hidden border border-slate-800 p-2 flex items-center justify-center">
                    <img
                      src="/assets/aistudio/graphene_embedding_pca_v5__2__7f0ae44e.png"
                      alt="Graphene Embedding PCA Plot"
                      className="w-full h-auto max-h-[320px] object-contain rounded"
                    />
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    <strong className="text-amber-300 block text-[11px] uppercase tracking-wider">
                      잠재 임베딩 공간(Latent Space) 해석 보고서:
                    </strong>
                    <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                      <li><strong className="text-slate-200">색상 스케일:</strong> 노란색·연두색일수록 높은 graphene_score를 의미하며, 보라색일수록 비그래핀성 3차원 벌크 구조를 반영.</li>
                      <li><strong className="text-slate-200">군집 구조:</strong> 상위 랭킹 결정체들이 특정 잠재 영역에 느슨한 클러스터를 형성하여 모델이 2D-like 구조적 대칭성을 학습했음을 시사.</li>
                      <li><strong className="text-slate-200">주의사항:</strong> 이 공간은 유사성 구조의 수학적 2차원 투영일 뿐, 물리적인 층상 분리 가능성을 직접 증명하는 것은 아닙니다.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/assets/aistudio/graphene_embedding_pca_v5__2__7f0ae44e.png"
                    download="graphene_embedding_pca_v5_2.png"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>PCA 투영도 고해상도 PNG 다운로드</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive PCA Data Table & Search */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  PCA 2차원 좌표 데이터 테이블 ({GRAPHENE_PCA_POINTS.length}개 샘플 포인트)
                </span>
                <a
                  href="/assets/aistudio/graphene_embedding_pca_v5__2__85e2c5e5.csv"
                  download="graphene_embedding_pca_v5_2.csv"
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 rounded border border-slate-700 flex items-center gap-1.5 w-fit"
                >
                  <Download className="w-3 h-3" />
                  <span>500개 전체 PCA CSV 다운로드</span>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto pr-1">
                {GRAPHENE_PCA_POINTS.map((pt) => (
                  <div
                    key={pt.material_id}
                    className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-0.5 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="font-bold text-cyan-300 truncate">{pt.formula}</div>
                    <div className="text-[10px] text-slate-500">{pt.material_id}</div>
                    <div className="text-slate-400">PCA1: <span className="text-slate-200">{pt.pca1.toFixed(2)}</span></div>
                    <div className="text-slate-400">PCA2: <span className="text-slate-200">{pt.pca2.toFixed(2)}</span></div>
                    <div className="text-amber-400 font-bold">Score: {pt.graphene_score.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DFT 7-Step Verification Protocol                                  */}
        {/* ========================================================================= */}
        {activeSubTab === 'dft' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  밀도범함수론(DFT) 7단계 정밀 검증 프로토콜 &amp; 체크리스트
                </h3>
                <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Slide 11 기준 가이드라인
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                MaterialsTransformer V5가 제시한 상위 후보들은 구조적 프록시에 기반한 스크리닝이므로, 실제 합성 및 응용 전 아래 7가지 양자역학적 물리 검증을 반드시 통과해야 합니다.
              </p>
            </div>

            {/* Candidate Selector for DFT Tracking */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs text-slate-400 shrink-0 font-medium">검증 대상 선택:</span>
              {GRAPHENE_CANDIDATES.slice(0, 8).map((cand) => {
                const isCurrent = selectedCandidate.material_id === cand.material_id;
                const completedCount = (dftCompletedSteps[cand.material_id] || []).length;
                return (
                  <button
                    key={cand.material_id}
                    onClick={() => setSelectedCandidate(cand)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shrink-0 transition-all border ${
                      isCurrent
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span>{cand.formula}</span>
                    <span className="ml-1.5 text-[10px] text-emerald-400">({completedCount}/7)</span>
                  </button>
                );
              })}
            </div>

            {/* 7-Step Interactive Verification Cards */}
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  title: '전자 밴드 구조 (Electronic Band Structure) & Dirac Cone 탐색',
                  importance: '필수 (Essential)',
                  desc: 'Brillouin zone의 고대칭점(K, M, Gamma)에서 원뿔형 선형 에너지 분산(Linear Dispersion) 및 무질량 디락 페르미온 존재 여부를 확인합니다.',
                  targetMetric: 'K-point 선형 기울기 v_F ≈ 10^6 m/s',
                  caution: 'Al2(CN2)3 같은 절연체의 경우 유효 질량과 밴드 갭의 직렬성을 분석.'
                },
                {
                  step: 2,
                  title: '포논 분산 스펙트럼 (Phonon Spectrum) & 동적 안정성(Dynamical Stability)',
                  importance: '필수 (Essential)',
                  desc: 'Density Functional Perturbation Theory(DFPT)를 통해 전체 Brillouin zone에서 허수 진동수(음의 진동수 모드)가 없는지 검증합니다.',
                  targetMetric: '음의 주파수(Imaginary Frequency) 0개',
                  caution: '준2차원 구조 특성상 장파장 ZA 굴곡 모드(Flexural Mode)의 q^2 분산 거동 확인.'
                },
                {
                  step: 3,
                  title: '2D 층간 박리 에너지 (Cleavage Energy / Exfoliation Energy)',
                  importance: '핵심 (High)',
                  desc: '벌크 결정에서 단일 2차원 시트로 박리할 때 필요한 단위 면적당 표면 에너지를 계산하여 기계적 테이프 박리 또는 액상 박리 가능성을 타진합니다.',
                  targetMetric: 'E_cleave < 0.35 J/m² (흑연 기준 ≈ 0.37 J/m²)',
                  caution: 'AlCr2C의 경우 화학적 HF 에칭을 통한 Al 제거 후 Cr2C MXene 분리 에너지 산출.'
                },
                {
                  step: 4,
                  title: '형성 에너지 (Formation Energy) & 볼록 껍질(Convex Hull) 비교',
                  importance: '필수 (Essential)',
                  desc: 'Materials Project에 등록된 모든 기존 경쟁 상(Competing Phases) 대비 화학 포텐셜 분해 에너지를 정밀 DFT로 계산합니다.',
                  targetMetric: 'E_above_hull ≤ 0.05 eV/atom (열역학적 상안정)',
                  caution: 'AI 예측값과 VASP/Quantum ESPRESSO 정밀 계산치 간의 일치도 검증.'
                },
                {
                  step: 5,
                  title: 'Fermi 준위 상태밀도 (DOS at E_F) & 전도성 타입 분류',
                  importance: '중요 (Medium)',
                  desc: '페르미 준위(E_F) 근처의 총 상태밀도(Total DOS)와 원자 오비탈 부분 상태밀도(pDOS)를 분해하여 반금속, 금속, 반도체 여부를 판정합니다.',
                  targetMetric: 'DOS(E_F) = 0 (반금속) 또는 유한값 (금속성)',
                  caution: 'Ag2CO3 복합체의 경우 산소 2p 및 은 4d 오비탈 혼성화 분석.'
                },
                {
                  step: 6,
                  title: 'AI 예측 물성 vs DFT 정밀 수렴 오차 검증 (Chemical Accuracy)',
                  importance: '검증 (Validation)',
                  desc: 'MaterialsTransformer V5가 예측한 밴드갭과 형성 에너지를 정밀 PBE / HSE06 하이브리드 범함수 계산값과 대조합니다.',
                  targetMetric: '오차 한계: 형성 에너지 < 0.05 eV/atom, 밴드갭 < 0.25 eV',
                  caution: 'PBE의 전형적인 밴드갭 과소평가(Underestimation)를 보정하기 위해 HSE06 권장.'
                },
                {
                  step: 7,
                  title: '실험적 합성 경로 (Synthesis Route) & 환경 안전성 평가',
                  importance: '응용 (Application)',
                  desc: '화학기상증착(CVD), 액상 초음파 박리, 또는 고온 방전 플라즈마 소결(SPS) 공정의 실현 가능성과 전구체 안전성을 검토합니다.',
                  targetMetric: '상온/대기압 안정성 및 독성 평가',
                  caution: '비소(As) 함유 물질(Ag3AsS3)은 유독성 가스 배출 방지 프로토콜 수립 필수.'
                }
              ].map((item) => {
                const currentCompleted = dftCompletedSteps[selectedCandidate.material_id] || [];
                const isChecked = currentCompleted.includes(item.step);
                return (
                  <div
                    key={item.step}
                    onClick={() => handleToggleDftStep(selectedCandidate.material_id, item.step)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 ${
                          isChecked
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {isChecked ? '✓' : item.step}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">
                              {item.title}
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-mono ${
                              item.importance.includes('필수') ? 'bg-rose-500/20 text-rose-300' :
                              item.importance.includes('핵심') ? 'bg-amber-500/20 text-amber-300' :
                              'bg-cyan-500/20 text-cyan-300'
                            }`}>
                              {item.importance}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.desc}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                            <div className="text-emerald-300">
                              <span className="text-slate-500">통과 기준치: </span>{item.targetMetric}
                            </div>
                            <div className="text-amber-300/90">
                              <span className="text-slate-500">특이 사항: </span>{item.caution}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`text-[11px] font-semibold ${
                          isChecked ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          {isChecked ? '검증 완료' : '클릭하여 체크'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 11~12 Min Full Script Modal */}
      {isScriptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  CRAZY AI Graphene Materials Transformer V5 미니 프로젝트 발표 스크립트 (약 11–12분)
                </h3>
              </div>
              <button
                onClick={() => setIsScriptModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800"
              >
                닫기 ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 text-xs text-slate-200 leading-relaxed font-sans">
              {PRESENTATION_SLIDES.map((slide) => (
                <div key={slide.slideNumber} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-300 text-sm">
                      슬라이드 {slide.slideNumber}. {slide.title}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{slide.duration}</span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-slate-300">
                    {slide.script.map((line, lidx) => (
                      <p key={lidx}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
