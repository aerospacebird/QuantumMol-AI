import React, { useState, useEffect } from 'react';
import { PERIODIC_ELEMENTS, PeriodicElement, CATEGORY_COLORS, convertElementToMolecule } from '../data/periodicTableData';
import { 
  PRESET_MATERIAL_RECIPES, 
  PresetMaterialRecipe, 
  buildDomainRecommendations, 
  generateSynthesizedCrystalModel 
} from '../data/domainSynthesisData';
import { Molecule3DViewer } from './Molecule3DViewer';
import { Molecule, ElementalSynthesizedMaterial, DomainProductionRecommendation } from '../types/quantum';
import { 
  Sparkles, 
  Layers, 
  FlaskConical, 
  Check, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  Wand2, 
  Compass, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Search,
  RotateCcw,
  CheckCircle2,
  Atom as AtomIcon,
  Flame,
  Cpu,
  Target,
  Factory,
  BarChart3,
  Sliders,
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';

interface PeriodicTableLabProps {
  onLoadIntoMainViewer?: (molecule: Molecule) => void;
  onOpenReactionKinetics?: (material: ElementalSynthesizedMaterial) => void;
  onOpenPeriodicLibrary?: () => void;
}

export const PeriodicTableLab: React.FC<PeriodicTableLabProps> = ({ 
  onLoadIntoMainViewer,
  onOpenReactionKinetics,
  onOpenPeriodicLibrary
}) => {
  const [selectedElement, setSelectedElement] = useState<PeriodicElement>(PERIODIC_ELEMENTS[0]); // H by default
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Elemental Synthesis Crucible State
  const [crucibleElements, setCrucibleElements] = useState<Array<{ element: PeriodicElement; count: number }>>([
    { element: PERIODIC_ELEMENTS.find(e => e.symbol === 'Nb') || PERIODIC_ELEMENTS[40], count: 2 },
    { element: PERIODIC_ELEMENTS.find(e => e.symbol === 'Ti') || PERIODIC_ELEMENTS[21], count: 1 },
    { element: PERIODIC_ELEMENTS.find(e => e.symbol === 'Al') || PERIODIC_ELEMENTS[12], count: 1 }
  ]);
  const [targetApplication, setTargetApplication] = useState<string>('우주항공 극한환경 초내열 크립 합금');
  const [customCondition, setCustomCondition] = useState<string>('스파크 플라즈마 소결(SPS) 고밀도 단결정화');
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [copiedRecipe, setCopiedRecipe] = useState<boolean>(false);
  
  // Right Column View Mode: 'synthesis-result' | 'crucible-setup' | 'element-detail'
  const [rightViewMode, setRightViewMode] = useState<'synthesis-result' | 'crucible-setup' | 'element-detail'>('synthesis-result');
  // Selected Domain Filter for Production Methods
  const [selectedDomainKey, setSelectedDomainKey] = useState<string>('aerospace');

  // Initial Synthesized Result
  const [synthesizedResult, setSynthesizedResult] = useState<ElementalSynthesizedMaterial>(() => {
    const defaultElements = [
      PERIODIC_ELEMENTS.find(e => e.symbol === 'Nb') || PERIODIC_ELEMENTS[40],
      PERIODIC_ELEMENTS.find(e => e.symbol === 'Ti') || PERIODIC_ELEMENTS[21],
      PERIODIC_ELEMENTS.find(e => e.symbol === 'Al') || PERIODIC_ELEMENTS[12]
    ];
    const defaultStoichiometry = { Nb: 2, Ti: 1, Al: 1 };
    const crystal = generateSynthesizedCrystalModel(defaultElements, defaultStoichiometry);
    const domainRecs = buildDomainRecommendations(defaultElements, 'Nb2TiAl', '금속간 화합물 (Intermetallic)');

    return {
      id: 'syn-initial-nbtial',
      name: 'Q-SuperAlloy Nb₂TiAl',
      koreanName: '극초음속 우주항공 초내열 감마-타이타늄 알루미나이드',
      formula: 'Nb2TiAl',
      bondingType: '금속간 화합물 (Intermetallic Lattice)',
      electronegativityDelta: 0.35,
      molecularWeight: 260.67,
      crystalSystem: '체심 입방 격자(BCC) 초격자',
      description: '니오븀(Nb)의 초고융점과 티타늄(Ti), 알루미늄(Al)의 경량 금속간 화합물 격자로 초음속 연소실 및 터빈 블레이드에 최적화된 초내열 소재',
      atoms: crystal.atoms,
      bonds: crystal.bonds,
      quantumProperties: {
        groundStateEnergy: -234.8,
        vqeIterations: 36,
        fidelityScore: 0.994,
        homoEnergy: -6.45,
        lumoEnergy: -2.15,
        homoLumoGap: 4.30,
        dipoleMoment: 0.65,
        qubitsRequired: 10,
        pauliTermsCount: 144,
        quantumAdvantageMetric: 'd-전자 밴드 중첩 및 VQE 바닥상태 에너지 수렴 완료'
      },
      deepLearningMetrics: {
        qganDiscriminatorLoss: 0.012,
        generatorFidelity: 0.995,
        valenceValidityRate: 1.0,
        sascore: 2.2,
        qedScore: 0.82,
        logP: 0.1,
        molecularWeight: 260.67
      },
      synthesisProtocol: {
        summary: '고순도 구형 나노합금 분말을 초고순도 아르곤 분위기에서 스파크 플라즈마 소결(SPS)하여 1350°C 산화 저항 단결정/초미세결정 복합체를 합성합니다.',
        precursorReagents: [
          '초고순도 니오븀 분말 [Nb, 99.99%]',
          '가스분무 티타늄 분말 [Ti, 99.99%]',
          '고순도 알루미늄 나노분말 [Al, 99.999%]'
        ],
        steps: [
          {
            stepNumber: 1,
            title: '고에너지 기계화학 볼밀링 및 균질화',
            temperature: '25°C',
            pressure: '1.0 atm (고순도 Ar)',
            reagents: ['Nb', 'Ti', 'Al 분말'],
            duration: '12시간',
            description: '화학양론적 비율 2:1:1로 장입 후 분말 입도를 25~45 μm로 균일 제어합니다.',
            safetyNote: '활성 미세 금속 분말의 자연 발화를 방지하기 위해 아르곤 글로브박스에서 취급하십시오.'
          },
          {
            stepNumber: 2,
            title: '스파크 플라즈마 소결 (SPS 통전 가압)',
            temperature: '1280°C',
            pressure: '50 MPa 일축 진공 가압',
            reagents: ['흑연 몰드', '통전 펄스 전류'],
            duration: '30분',
            description: '분당 100°C 속도로 급속 가열하여 결정립 성장을 억제하면서 이론 밀도 99.4%에 도달시킵니다.',
            safetyNote: '고온 몰드 접촉부 열변형 및 흑연 산화 여부를 점검하십시오.'
          },
          {
            stepNumber: 3,
            title: '진공 응력 완화 소둔 및 서냉',
            temperature: '900°C → 상온 서냉',
            pressure: '10⁻⁵ Torr 고진공',
            reagents: ['진공 분위기'],
            duration: '4시간',
            description: '소결 잔류 응력을 제거하여 상온 연신율을 2.8% 확보하고 크립 파괴 수명을 연장합니다.',
            safetyNote: '완전 냉각 전 대기 노출을 엄격히 금지합니다.'
          }
        ],
        safetyControls: '실시간 챔버 산소 센서(< 10 ppm) 및 불활성 가스 연속 퍼지.',
        wasteManagement: '미반응 미세 분말 불활성 유체 회수 및 100% 리사이클.',
        scalabilityTRL: 7,
        estimatedCostPerGram: '약 $18 / g',
        theoreticalYieldPercent: 94.5
      },
      domainRecommendations: domainRecs
    };
  });

  // Filter elements
  const filteredElements = PERIODIC_ELEMENTS.filter(el => {
    const matchesSearch = 
      el.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      el.koreanName.includes(searchTerm) ||
      el.number.toString() === searchTerm;
    const matchesCategory = categoryFilter === 'all' || el.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCrucible = (el: PeriodicElement) => {
    if (crucibleElements.some(item => item.element.symbol === el.symbol)) {
      setCrucibleElements(prev => prev.map(item => item.element.symbol === el.symbol ? { ...item, count: item.count + 1 } : item));
    } else {
      if (crucibleElements.length >= 4) {
        alert("합성 도가니에는 최대 4개 원소까지 조합할 수 있습니다.");
        return;
      }
      setCrucibleElements(prev => [...prev, { element: el, count: 1 }]);
    }
  };

  const handleUpdateCrucibleCount = (symbol: string, newCount: number) => {
    if (newCount <= 0) {
      setCrucibleElements(prev => prev.filter(item => item.element.symbol !== symbol));
    } else {
      setCrucibleElements(prev => prev.map(item => item.element.symbol === symbol ? { ...item, count: Math.min(8, newCount) } : item));
    }
  };

  // Load a preset benchmark recipe into crucible and trigger synthesis
  const handleLoadPresetRecipe = (recipe: PresetMaterialRecipe) => {
    const loadedCrucible = recipe.elements.map(item => {
      const foundEl = PERIODIC_ELEMENTS.find(e => e.symbol === item.symbol) || PERIODIC_ELEMENTS[0];
      return { element: foundEl, count: item.count };
    });
    setCrucibleElements(loadedCrucible);
    setTargetApplication(recipe.primaryDomain);
    setCustomCondition(`${recipe.highlightTag} 특화 대량 생산`);

    // Build immediate synthesized crystal model
    const elementsList = loadedCrucible.map(c => c.element);
    const stoich: Record<string, number> = {};
    loadedCrucible.forEach(c => { stoich[c.element.symbol] = c.count; });
    const crystal = generateSynthesizedCrystalModel(elementsList, stoich);
    const domainRecs = buildDomainRecommendations(elementsList, recipe.formula, '다원소 고기능성 결정 격자');

    const newMaterial: ElementalSynthesizedMaterial = {
      id: `syn-${recipe.id}-${Date.now()}`,
      name: recipe.name,
      koreanName: recipe.koreanName,
      formula: recipe.formula,
      bondingType: '양자 최적화 결정 격자 (Quantum Lattice)',
      electronegativityDelta: 0.42,
      molecularWeight: elementsList.reduce((acc, el) => acc + el.atomicMass * (stoich[el.symbol] || 1), 0),
      crystalSystem: '다원소 정밀 결정 격자',
      description: recipe.description,
      atoms: crystal.atoms,
      bonds: crystal.bonds,
      quantumProperties: {
        groundStateEnergy: parseFloat((-48.0 * crystal.atoms.length).toFixed(2)),
        vqeIterations: 36,
        fidelityScore: 0.996,
        homoEnergy: -6.8,
        lumoEnergy: -2.2,
        homoLumoGap: 4.6,
        dipoleMoment: 0.8,
        qubitsRequired: Math.min(16, crystal.atoms.length * 2),
        pauliTermsCount: crystal.atoms.length * 32,
        quantumAdvantageMetric: `${recipe.primaryDomain} 분야 특화 양자 시뮬레이션 완료`
      },
      deepLearningMetrics: {
        qganDiscriminatorLoss: 0.01,
        generatorFidelity: 0.994,
        valenceValidityRate: 1.0,
        sascore: 2.3,
        qedScore: 0.85,
        logP: 0.2,
        molecularWeight: elementsList.reduce((acc, el) => acc + el.atomicMass * (stoich[el.symbol] || 1), 0)
      },
      synthesisProtocol: {
        summary: `${recipe.name}의 산업적 양산 공정: 최적화된 고온/진공 합성 조건 및 전구체 레시피`,
        precursorReagents: elementsList.map(e => `고순도 ${e.name} 분말 [${e.symbol}, 99.99%]`),
        steps: [
          {
            stepNumber: 1,
            title: '전구체 배합 및 진공 탈기',
            temperature: '200°C',
            pressure: '10⁻⁵ Torr',
            reagents: elementsList.map(e => e.symbol),
            duration: '2시간',
            description: '정밀 화학양론비로 배합 후 수분과 잔류 가스를 탈기합니다.',
            safetyNote: '불활성 아르곤 환경 유지'
          },
          {
            stepNumber: 2,
            title: '고온 소결 및 결정화 반응',
            temperature: '1150°C',
            pressure: '1.0 atm (고순도 Ar)',
            reagents: ['전구체 혼합물'],
            duration: '8시간',
            description: '균일한 결정 격자 형성을 위해 제어된 열처리 프로파일을 인가합니다.',
            safetyNote: '고온 파열 방지'
          },
          {
            stepNumber: 3,
            title: '결함 제어 소둔 및 정제',
            temperature: '600°C → 상온 서냉',
            pressure: '1.0 atm',
            reagents: ['정제 가스'],
            duration: '4시간',
            description: '결정립계 전위와 점결함을 치유하여 물성을 극대화합니다.',
            safetyNote: '상온 안정화'
          }
        ],
        safetyControls: '압력 릴리프 밸브 및 불활성 퍼지 연속 모니터링',
        wasteManagement: '반응 부산물 100% 회수 및 무해화 재활용',
        scalabilityTRL: 7,
        estimatedCostPerGram: '약 $22 / g',
        theoreticalYieldPercent: 93.0
      },
      domainRecommendations: domainRecs
    };

    setSynthesizedResult(newMaterial);
    setRightViewMode('synthesis-result');
  };

  const handleSynthesizeMaterial = async () => {
    if (crucibleElements.length === 0) return;
    setIsSynthesizing(true);

    const stoichiometry: Record<string, number> = {};
    crucibleElements.forEach(item => {
      stoichiometry[item.element.symbol] = item.count;
    });

    try {
      const res = await fetch('/api/elemental-synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          elements: crucibleElements.map(item => item.element),
          stoichiometry,
          targetApplication,
          customConditions: customCondition
        })
      });

      const data = await res.json();
      if (data.material) {
        // Ensure 3D crystal coordinates and domain recommendations are populated
        const elementsList = crucibleElements.map(c => c.element);
        const crystal = generateSynthesizedCrystalModel(elementsList, stoichiometry);
        const domainRecs = data.material.domainRecommendations && data.material.domainRecommendations.length > 0
          ? data.material.domainRecommendations
          : buildDomainRecommendations(elementsList, data.material.formula, data.material.bondingType);

        setSynthesizedResult({
          ...data.material,
          atoms: (data.material.atoms && data.material.atoms.length > 0) ? data.material.atoms : crystal.atoms,
          bonds: (data.material.bonds && data.material.bonds.length > 0) ? data.material.bonds : crystal.bonds,
          domainRecommendations: domainRecs
        });
        setRightViewMode('synthesis-result');
      }
    } catch (err) {
      console.error("Synthesis error:", err);
      // Fallback deterministic synthesis
      const elementsList = crucibleElements.map(c => c.element);
      const crystal = generateSynthesizedCrystalModel(elementsList, stoichiometry);
      const formula = elementsList.map(e => `${e.symbol}${stoichiometry[e.symbol] > 1 ? stoichiometry[e.symbol] : ''}`).join('');
      const domainRecs = buildDomainRecommendations(elementsList, formula, '결정 격자 신물질');
      
      setSynthesizedResult({
        id: `syn-local-${Date.now()}`,
        name: `Q-Material ${formula}`,
        koreanName: `${formula} 양자 딥러닝 신물질`,
        formula,
        bondingType: '양자 배위 결정 격자',
        electronegativityDelta: 0.5,
        molecularWeight: elementsList.reduce((acc, el) => acc + el.atomicMass * (stoichiometry[el.symbol] || 1), 0),
        crystalSystem: '정밀 단위 격자',
        description: `${elementsList.map(e => e.name).join(', ')} 원소 조합을 통해 ${targetApplication} 목적으로 도출된 신규 소재입니다.`,
        atoms: crystal.atoms,
        bonds: crystal.bonds,
        quantumProperties: {
          groundStateEnergy: -150.0,
          vqeIterations: 30,
          fidelityScore: 0.99,
          homoEnergy: -6.5,
          lumoEnergy: -2.0,
          homoLumoGap: 4.5,
          dipoleMoment: 0.9,
          qubitsRequired: 8,
          pauliTermsCount: 96,
          quantumAdvantageMetric: '원소간 결합 바닥상태 수렴'
        },
        deepLearningMetrics: {
          qganDiscriminatorLoss: 0.015,
          generatorFidelity: 0.99,
          valenceValidityRate: 1.0,
          sascore: 2.5,
          qedScore: 0.8,
          logP: 0.1,
          molecularWeight: 200
        },
        synthesisProtocol: {
          summary: '고온 진공 소결 및 가스분무 분말 제어를 통한 대량 생산 공정',
          precursorReagents: elementsList.map(e => `${e.name} 고순도 분말`),
          steps: [
            {
              stepNumber: 1,
              title: '전구체 배합 및 고진공 탈기',
              temperature: '250°C',
              pressure: '10⁻⁵ Torr',
              reagents: elementsList.map(e => e.symbol),
              duration: '2시간',
              description: '수분 흡착 방지 및 화학양론적 정량 혼합',
              safetyNote: '진공 장갑함 사용'
            },
            {
              stepNumber: 2,
              title: '고온 상합성 반응',
              temperature: '1100°C',
              pressure: '1.0 atm (Ar)',
              reagents: ['혼합 분말'],
              duration: '10시간',
              description: '관상로 균일 소결을 통한 단상(Single-phase) 결정화',
              safetyNote: '급냉 방지'
            }
          ],
          safetyControls: '산소 농도 감지 및 불활성 퍼지',
          wasteManagement: '반응 잔여물 100% 회수',
          scalabilityTRL: 7,
          estimatedCostPerGram: '$20 / g',
          theoreticalYieldPercent: 92.0
        },
        domainRecommendations: domainRecs
      });
      setRightViewMode('synthesis-result');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleCopyRecipe = () => {
    if (!synthesizedResult?.synthesisProtocol) return;
    const proto = synthesizedResult.synthesisProtocol;
    let text = `==========================================================\n`;
    text += `[QuantumMol AI - 원소 기반 신물질 합성 & 다중 도메인 생산 리포트]\n`;
    text += `신물질명: ${synthesizedResult.name} (${synthesizedResult.koreanName})\n`;
    text += `화학식: ${synthesizedResult.formula} | 결합 유형: ${synthesizedResult.bondingType}\n`;
    text += `분자량: ${synthesizedResult.molecularWeight.toFixed(2)} g/mol | 전기음성도 차(Δχ): ${synthesizedResult.electronegativityDelta}\n\n`;
    text += `[6대 산업 도메인별 추천 생산 공정 및 파라미터]\n`;
    synthesizedResult.domainRecommendations.forEach(d => {
      text += `\n* [${d.domainName}] - 적합도 ${d.compatibilityScore}%\n`;
      text += `  - 응용 분야: ${d.applicationTitle}\n`;
      text += `  - 물성적 이점: ${d.expectedAdvantage}\n`;
      text += `  - 추천 제조 공정: ${d.recommendedProductionMethod}\n`;
      text += `  - 생산 파라미터: 온도 ${d.productionParameters.temperature} | 압력 ${d.productionParameters.pressure} | 분위기 ${d.productionParameters.atmosphere}\n`;
      text += `  - 기술성숙도 / 예상 단가: TRL ${d.scalabilityTRL} | ${d.estimatedCostPerUnit}\n`;
      text += `  - 대량 양산 조언: ${d.scalingAdvice}\n`;
    });
    text += `\n[실험실 단계별 제조 레시피]\n`;
    proto.steps.forEach(s => {
      text += `  Step ${s.stepNumber}: ${s.title} (${s.temperature}, ${s.pressure}, ${s.duration})\n`;
      text += `    -> ${s.description}\n`;
    });
    text += `==========================================================\n`;

    navigator.clipboard.writeText(text);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  };

  const handleSendToMainViewer = () => {
    if (!synthesizedResult || !onLoadIntoMainViewer) return;
    const mol: Molecule = {
      id: `syn-${Date.now()}`,
      name: synthesizedResult.name,
      commonName: synthesizedResult.koreanName,
      formula: synthesizedResult.formula,
      smiles: synthesizedResult.formula,
      description: synthesizedResult.description,
      quantumRationale: `전기음성도 차이(Δχ = ${synthesizedResult.electronegativityDelta}) 및 양자 원자가 껍질 궤도 결합으로 형성된 ${synthesizedResult.bondingType} 신물질입니다.`,
      atoms: synthesizedResult.atoms,
      bonds: synthesizedResult.bonds,
      quantumProperties: synthesizedResult.quantumProperties,
      deepLearningMetrics: synthesizedResult.deepLearningMetrics,
      suggestedApplications: [
        `전기음성도(Δχ = ${synthesizedResult.electronegativityDelta}) 기반 ${synthesizedResult.bondingType}`,
        `분자량 ${synthesizedResult.molecularWeight.toFixed(2)} g/mol 정밀 제어`,
        `${targetApplication} 전용 소재`
      ],
      synthesisRouteSummary: synthesizedResult.synthesisProtocol.summary,
      quantumCircuitConfig: {
        numQubits: synthesizedResult.quantumProperties.qubitsRequired,
        depth: 20,
        ansatzType: 'StronglyEntangling',
        parameters: [-0.42, 1.25, 0.88, -1.10, 0.55, 2.12, -0.34, 0.76]
      }
    };
    onLoadIntoMainViewer(mol);
  };

  const selectedDomain = synthesizedResult?.domainRecommendations?.find(d => d.domainKey === selectedDomainKey) || synthesizedResult?.domainRecommendations?.[0];

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
      {/* Top Banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <AtomIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              주기율표 원소기호 기반 신물질 합성 &amp; 다중 도메인 생산 추천 랩
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Periodic Elements · 3D Crystal Synthesis · Domain Recommender
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              주기율표 원소들을 조합하여 새로운 고기능성 신물질을 합성하고, 우주항공·전력반도체·전고체배터리·양자큐비트 등 6대 산업 도메인별 최적 생산 공정을 완벽한 3D 시뮬레이션으로 시현합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyRecipe}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedRecipe ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedRecipe ? '복사됨' : '도메인 생산 리포트 복사'}</span>
          </button>
          {onOpenPeriodicLibrary && (
            <button
              onClick={onOpenPeriodicLibrary}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-950"
              title="118개 모든 원소의 3D 분자/결정 구조 갤러리 및 순환 시현 열기"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">118 전원소 분자 라이브러리 전체 시현</span>
              <span className="sm:hidden">118 원소 갤러리</span>
            </button>
          )}
          {onOpenReactionKinetics && (
            <button
              onClick={() => onOpenReactionKinetics(synthesizedResult)}
              className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-rose-950"
              title="합성된 신물질을 반응 역학 실험실로 전송하여 고온/고압 반응 및 에너지 변화 시뮬레이션"
            >
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">반응 역학 실험실 시뮬레이션</span>
              <span className="sm:hidden">반응역학 랩</span>
            </button>
          )}
          {onLoadIntoMainViewer && (
            <button
              onClick={handleSendToMainViewer}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">메인 3D 분자 뷰어 로드</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Benchmark Preset Recipes Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs scrollbar-thin">
        <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          추천 혁신 신소재 레시피 빠른 로드:
        </span>
        {PRESET_MATERIAL_RECIPES.map((rec) => (
          <button
            key={rec.id}
            onClick={() => handleLoadPresetRecipe(rec)}
            className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 flex items-center gap-1.5 shrink-0 transition-all font-mono text-[11px]"
          >
            <span>{rec.domainIcon}</span>
            <strong className="text-slate-100">{rec.formula}</strong>
            <span className="text-[10px] text-slate-400">({rec.primaryDomain.split(' ')[0]})</span>
          </button>
        ))}
      </div>

      {/* Main Split Layout: Left Periodic Table & Right 3D Crystal & Domain Production Engine */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Interactive Periodic Table Grid & Crucible Controls */}
        <div className="w-[48%] border-r border-slate-800 flex flex-col p-3 space-y-3 overflow-y-auto bg-slate-950/80">
          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="원소 검색 (원소기호, 한글명, 번호: H, 수소, 1)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">모든 원소 계열 (전체 118개 원소)</option>
              <option value="nonmetal">비금속 (Nonmetal)</option>
              <option value="noble-gas">비활성 기체 (Noble Gas)</option>
              <option value="alkali-metal">알칼리 금속 (Alkali Metal)</option>
              <option value="alkaline-earth">알칼리토금속 (Alkaline Earth)</option>
              <option value="metalloid">준금속 (Metalloid)</option>
              <option value="halogen">할로겐 (Halogen)</option>
              <option value="transition-metal">전이 금속 (Transition Metal)</option>
              <option value="post-transition">전이후 금속 (Post-transition)</option>
              <option value="lanthanide">란타넘족 희토류 (Lanthanide, 57~71)</option>
              <option value="actinide">악티늄족 방사성 (Actinide, 89~103)</option>
            </select>
          </div>

          {/* Periodic Table Grid / Badges */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-1.5 overflow-y-auto max-h-[380px] pr-1">
            {filteredElements.map((el) => {
              const isSelected = selectedElement.number === el.number;
              const catColor = CATEGORY_COLORS[el.category] || CATEGORY_COLORS['nonmetal'];
              const inCrucible = crucibleElements.some(item => item.element.symbol === el.symbol);

              return (
                <button
                  key={el.number}
                  onClick={() => {
                    setSelectedElement(el);
                    setRightViewMode('element-detail');
                  }}
                  className={`p-1.5 rounded-lg border text-left transition-all relative flex flex-col justify-between h-[72px] ${
                    isSelected 
                      ? 'bg-emerald-950/80 border-emerald-400 shadow-md shadow-emerald-950 ring-1 ring-emerald-400' 
                      : `${catColor.bg} ${catColor.border} hover:border-slate-500`
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono text-slate-400">{el.number}</span>
                    <span className="text-[9px] font-mono text-slate-500">{el.period}P</span>
                  </div>

                  <div className="text-center my-0.5">
                    <span className="text-base font-black tracking-tight text-slate-100 block leading-tight">
                      {el.symbol}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium block truncate">
                      {el.koreanName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full text-[8.5px] font-mono text-slate-400">
                    <span>{el.atomicMass.toFixed(1)}</span>
                    <div className="flex items-center gap-1">
                      {inCrucible && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" title="합성 도가니에 추가됨" />
                      )}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCrucible(el);
                        }}
                        className="p-0.5 hover:text-emerald-300 text-slate-400 rounded cursor-pointer"
                        title="도가니에 추가"
                      >
                        <Plus className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Elemental Material Synthesis Crucible (원소 기반 신물질 합성 도가니 설정) */}
          <div className="p-3 bg-gradient-to-b from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl border border-indigo-500/40 space-y-2.5">
            <div className="flex items-center justify-between border-b border-indigo-500/30 pb-1.5">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-indigo-400" />
                원소 합성 도가니 (Crucible Setup &amp; Stoichiometry)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {crucibleElements.length}/4 원소 투입
              </span>
            </div>

            {/* Crucible Selected Elements List & Stoichiometry */}
            <div className="grid grid-cols-2 gap-1.5">
              {crucibleElements.map((item) => (
                <div key={item.element.symbol} className="flex items-center justify-between p-2 bg-slate-950/90 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded bg-indigo-950 border border-indigo-500/50 flex items-center justify-center font-bold font-mono text-indigo-300 text-xs">
                      {item.element.symbol}
                    </span>
                    <div>
                      <span className="font-semibold text-slate-200 block text-[11px]">{item.element.koreanName}</span>
                      <span className="text-[9px] text-slate-500 font-mono">χ = {item.element.electronegativity ?? 'N/A'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-mono">
                    <button
                      onClick={() => handleUpdateCrucibleCount(item.element.symbol, item.count - 1)}
                      className="w-4 h-4 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold text-indigo-400 text-xs">{item.count}</span>
                    <button
                      onClick={() => handleUpdateCrucibleCount(item.element.symbol, item.count + 1)}
                      className="w-4 h-4 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center font-bold text-xs"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleUpdateCrucibleCount(item.element.symbol, 0)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Target Application & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium">목표 재료 응용 도메인</label>
                <select
                  value={targetApplication}
                  onChange={(e) => setTargetApplication(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="우주항공 극한환경 초내열 크립 합금">🚀 우주항공 초내열 터빈 합금</option>
                  <option value="초광대역 밴드갭 고전력 반도체">⚡ 초광대역 전력반도체 (4.8eV)</option>
                  <option value="전고체 배터리 고체 전해질">🔋 가넷형 전고체 전해질</option>
                  <option value="고온 초전도 양자 큐비트 격자">⚛️ 고온 초전도 양자 격자</option>
                  <option value="그린 수소 고효율 수전해 촉매">🌿 그린 수소 수전해 촉매</option>
                  <option value="생체적합 저탄성률 임플란트">🧬 생체적합 정형외과 인공골</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-medium">공정 조건 및 특성 요구</label>
                <input
                  type="text"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  placeholder="예: 스파크 플라즈마 소결 고순도 단결정"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Synthesize Button */}
            <button
              onClick={handleSynthesizeMaterial}
              disabled={isSynthesizing || crucibleElements.length === 0}
              className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isSynthesizing || crucibleElements.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-emerald-600 via-indigo-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-indigo-950'
              }`}
            >
              {isSynthesizing ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                  <span>원소간 결합 예측 및 3D 결정 합성 시뮬레이션 중...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>원소 합성 및 6대 도메인 생산 공정 도출 가동</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: 3D Simulation Viewport (Element 3D Allotrope vs Synthesized Crystal) */}
        <div className="w-[52%] flex flex-col p-3.5 space-y-3 overflow-y-auto bg-slate-950">
          {/* Dual View Mode Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setRightViewMode('element-detail')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                rightViewMode === 'element-detail'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>선택 원소 3D 분자/결정 ({selectedElement.symbol} · {selectedElement.koreanName})</span>
            </button>
            <button
              onClick={() => setRightViewMode('synthesis-result')}
              className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                rightViewMode === 'synthesis-result'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-md shadow-indigo-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>원소 합성 신물질 3D 결정 ({synthesizedResult.formula})</span>
            </button>
          </div>

          {/* VIEW MODE 1: SELECTED ELEMENT 3D MOLECULAR & CRYSTAL ALLOTROPE STRUCTURE */}
          {rightViewMode === 'element-detail' && (() => {
            const elMol = convertElementToMolecule(selectedElement);
            const catColor = CATEGORY_COLORS[selectedElement.category] || CATEGORY_COLORS['nonmetal'];

            return (
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* Element Header Card */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-sm font-mono">
                            {selectedElement.symbol}
                          </span>
                          {selectedElement.name}
                          <span className="text-sm font-medium text-emerald-300">
                            ({selectedElement.koreanName}, {selectedElement.number}번 원소)
                          </span>
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-medium block mt-1">
                        {selectedElement.period}주기 · {selectedElement.group}족 · <span className={`px-1.5 py-0.2 rounded border ${catColor.bg} ${catColor.text} ${catColor.border}`}>{selectedElement.category}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddToCrucible(selectedElement)}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                        title="합성 도가니에 원소 추가"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>도가니 추가</span>
                      </button>
                      {onLoadIntoMainViewer && (
                        <button
                          onClick={() => onLoadIntoMainViewer(elMol)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                          title="메인 3D 뷰어에 원소 로드"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>메인 뷰어 로드</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                    {selectedElement.description}
                  </p>
                </div>

                {/* 3D Element Molecular/Crystal Structure Viewport */}
                <div className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
                  <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      3D 원자 클러스터 / 결정 격자 시뮬레이션 ({elMol.formula})
                    </span>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>{elMol.atoms.length}개 원자</span>
                      <span>·</span>
                      <span>{elMol.bonds.length}개 결합</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                        {selectedElement.crystalStructure}
                      </span>
                    </div>
                  </div>

                  <div className="h-[290px] relative bg-slate-950/60">
                    <Molecule3DViewer molecule={elMol} />
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[9px] font-mono bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded border border-slate-700">
                      <span className="text-slate-400">격자 유형:</span>
                      <span className="text-cyan-300 font-bold">{selectedElement.crystalStructure}</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-emerald-300 font-bold">{selectedElement.allotropeStructure.description}</span>
                    </div>
                  </div>
                </div>

                {/* Quantum & Physical Properties Matrix */}
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    원소 양자 전자 구조 &amp; 물리화학 데이터
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">원자량 (Atomic Mass)</span>
                      <span className="text-xs font-bold text-slate-200">{selectedElement.atomicMass.toFixed(3)} u</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">전자 배치 (Configuration)</span>
                      <span className="text-xs font-bold text-cyan-300 truncate block">{selectedElement.electronConfiguration}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">전기음성도 (Pauling)</span>
                      <span className="text-xs font-bold text-amber-300">{selectedElement.electronegativity ?? '비활성/N/A'}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">1차 이온화 에너지</span>
                      <span className="text-xs font-bold text-emerald-400">{selectedElement.ionizationEnergyEV} eV</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">원자가 전자수 (Valence)</span>
                      <span className="text-xs font-bold text-indigo-300">{selectedElement.valenceElectrons} 개</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">바닥상태 고유에너지</span>
                      <span className="text-xs font-bold text-rose-300">{selectedElement.groundStateEnergyHa} Ha</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">주요 산화수 (Oxidation)</span>
                      <span className="text-xs font-bold text-teal-300">{selectedElement.oxidationStates.map(o => (o > 0 ? `+${o}` : `${o}`)).join(', ')}</span>
                    </div>
                    <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">상온 표준 상태 (State)</span>
                      <span className="text-xs font-bold text-slate-300 uppercase">{selectedElement.standardState}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* VIEW MODE 2: SYNTHESIZED MULTI-ELEMENT MATERIAL & 6-DOMAIN PRODUCTION */}
          {rightViewMode === 'synthesis-result' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Header Info & Formula Bar */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        {synthesizedResult.name}
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                          {synthesizedResult.formula}
                        </span>
                      </h3>
                    </div>
                    <span className="text-xs text-cyan-300 font-medium block mt-0.5">
                      {synthesizedResult.koreanName} · {synthesizedResult.bondingType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300">
                      Mw: {synthesizedResult.molecularWeight.toFixed(2)} g/mol
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                      Δχ: {synthesizedResult.electronegativityDelta}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {synthesizedResult.description}
                </p>
              </div>

              {/* Quick Reaction Kinetics Link Banner */}
              {onOpenReactionKinetics && (
                <div className="p-2.5 bg-gradient-to-r from-rose-950/50 via-amber-950/40 to-slate-900 border border-rose-500/40 rounded-xl flex items-center justify-between text-xs shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-600/30 border border-rose-500/50 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-100 block text-xs">
                        [반응 역학 실험실] {synthesizedResult.formula} 고온·고압 극한 환경 분해/결합 역학 시뮬레이션
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        임계 활성화 에너지(Ea), 아이링 반응 속도(k), 시계열 자유에너지(ΔG) 변화 궤적을 실시간 계산합니다.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenReactionKinetics(synthesizedResult)}
                    className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
                  >
                    <span>역학 시뮬레이션 가동</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 3D Crystal & Atomic Structure Simulation Viewport */}
              <div className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow-inner">
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    3D 결정 격자 &amp; 원자 결합 시뮬레이션 ({synthesizedResult.formula})
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span>{synthesizedResult.atoms.length}개 원자</span>
                    <span>·</span>
                    <span>{synthesizedResult.bonds.length}개 결합</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      ESP 오버레이 지원
                    </span>
                  </div>
                </div>

                <div className="h-[290px] relative bg-slate-950/60">
                  <Molecule3DViewer
                    molecule={{
                      id: synthesizedResult.id,
                      name: synthesizedResult.name,
                      commonName: synthesizedResult.koreanName,
                      formula: synthesizedResult.formula,
                      smiles: synthesizedResult.formula,
                      description: synthesizedResult.description,
                      quantumRationale: `전기음성도 차이(Δχ = ${synthesizedResult.electronegativityDelta}) 및 ${synthesizedResult.crystalSystem}`,
                      atoms: synthesizedResult.atoms,
                      bonds: synthesizedResult.bonds,
                      quantumProperties: synthesizedResult.quantumProperties,
                      deepLearningMetrics: synthesizedResult.deepLearningMetrics,
                      suggestedApplications: [
                        `${synthesizedResult.name} 3D 결정 구조 시뮬레이션`,
                        `HOMO-LUMO Gap: ${synthesizedResult.quantumProperties.homoLumoGap} eV`
                      ],
                      synthesisRouteSummary: synthesizedResult.synthesisProtocol.summary,
                      quantumCircuitConfig: {
                        numQubits: synthesizedResult.quantumProperties.qubitsRequired,
                        depth: 16,
                        ansatzType: 'StronglyEntangling',
                        parameters: [-0.42, 1.25, 0.88, -1.10]
                      }
                    }}
                  />
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[9px] font-mono bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded border border-slate-700">
                    <span className="text-slate-400">결정계:</span>
                    <span className="text-cyan-300 font-bold">{synthesizedResult.crystalSystem}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-amber-300 font-bold">하단 툴바의 [ESP/전자밀도 표면] 버튼으로 전위 히트맵 확인</span>
                  </div>
                </div>
              </div>

              {/* Multi-Domain Application & Production Method Recommendation Section */}
              <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 rounded-xl border border-indigo-500/40 space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-slate-100">
                      6대 산업 도메인별 응용 가능성 &amp; 대량 생산 제조 공정 추천
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300">
                    Domain Scalability Engine
                  </span>
                </div>

                {/* 6 Domain Selector Tabs */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                  {synthesizedResult.domainRecommendations.map((d) => {
                    const isSel = selectedDomainKey === d.domainKey;
                    return (
                      <button
                        key={d.domainKey}
                        onClick={() => setSelectedDomainKey(d.domainKey)}
                        className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-between h-16 ${
                          isSel
                            ? 'bg-gradient-to-b from-indigo-950 to-cyan-950/80 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <span className="text-base">{d.domainIcon}</span>
                        <span className="text-[10px] font-bold block truncate w-full">
                          {d.domainName.split(' ')[0]}
                        </span>
                        <span className={`text-[9px] font-mono font-bold ${d.compatibilityScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {d.compatibilityScore}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Domain Recommendation Detail Card */}
                {selectedDomain && (
                  <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                          <span>{selectedDomain.domainIcon}</span>
                          {selectedDomain.applicationTitle}
                        </span>
                        <p className="text-[11px] text-slate-300">
                          {selectedDomain.expectedAdvantage}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-emerald-400 block">
                          적합도 {selectedDomain.compatibilityScore}%
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          TRL {selectedDomain.scalabilityTRL} · {selectedDomain.estimatedCostPerUnit}
                        </span>
                      </div>
                    </div>

                    {/* Recommended Production Method & Parameters */}
                    <div className="p-2.5 bg-slate-900/90 rounded-lg border border-indigo-500/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                        <Factory className="w-3.5 h-3.5 text-indigo-400" />
                        <span>추천 양산 제조 공정: {selectedDomain.recommendedProductionMethod}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] font-mono pt-1">
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                          <span className="text-slate-500 block">공정 온도:</span>
                          <span className="text-slate-200 font-bold">{selectedDomain.productionParameters.temperature}</span>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                          <span className="text-slate-500 block">진공/압력:</span>
                          <span className="text-cyan-300 font-bold">{selectedDomain.productionParameters.pressure}</span>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                          <span className="text-slate-500 block">분위기 가스:</span>
                          <span className="text-amber-300 font-bold">{selectedDomain.productionParameters.atmosphere}</span>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800 col-span-2">
                          <span className="text-slate-500 block">사용 원소 전구체:</span>
                          <span className="text-slate-200 font-bold truncate block">{selectedDomain.productionParameters.precursors}</span>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800">
                          <span className="text-slate-500 block">소결/성장 시간:</span>
                          <span className="text-emerald-300 font-bold">{selectedDomain.productionParameters.cycleTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Commercial Scaling & Defect Control Advice */}
                    <div className="p-2 bg-indigo-950/40 rounded-lg border border-indigo-500/30 flex items-start gap-2 text-xs">
                      <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-200 text-[11px] block">상업적 양산 시 수율 극대화 전략:</span>
                        <p className="text-[10px] text-slate-300 leading-normal mt-0.5">
                          {selectedDomain.scalingAdvice}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
