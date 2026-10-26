export interface Atom {
  id: number;
  symbol: string;
  x: number;
  y: number;
  z: number;
  charge: number;
  hybridization: string;
}

export interface Bond {
  atom1: number;
  atom2: number;
  order: number; // 1 = single, 2 = double, 3 = triple, 1.5 = aromatic
}

export interface QuantumProperties {
  groundStateEnergy: number; // in Hartrees (Ha)
  vqeIterations: number;
  fidelityScore: number; // 0.0 ~ 1.0
  homoEnergy: number; // eV
  lumoEnergy: number; // eV
  homoLumoGap: number; // eV
  dipoleMoment: number; // Debye
  zeroPointEnergy?: number; // kcal/mol
  qubitsRequired: number;
  pauliTermsCount: number;
  quantumAdvantageMetric: string;
}

export interface DeepLearningMetrics {
  qganDiscriminatorLoss: number;
  generatorFidelity: number;
  valenceValidityRate: number;
  sascore: number; // Synthetic Accessibility (1-10)
  qedScore: number; // Quantitative Estimate of Drug-likeness (0-1)
  logP: number;
  molecularWeight: number;
  hydrogenBondDonors?: number;
  hydrogenBondAcceptors?: number;
}

export interface QuantumCircuitConfig {
  numQubits: number;
  depth: number;
  ansatzType: 'UCCSD' | 'RyRz' | 'StronglyEntangling' | 'HardwareEfficient';
  parameters: number[];
}

export interface Molecule {
  id: string;
  name: string;
  commonName: string;
  formula: string;
  smiles: string;
  description: string;
  quantumRationale: string;
  atoms: Atom[];
  bonds: Bond[];
  quantumProperties: QuantumProperties;
  deepLearningMetrics: DeepLearningMetrics;
  suggestedApplications: string[];
  synthesisRouteSummary: string;
  quantumCircuitConfig: QuantumCircuitConfig;
  isGenerated?: boolean;
}

export interface VqeStep {
  iteration: number;
  energy: number;
  gradientNorm: number;
  parameterShift: number;
  fidelity: number;
}

export interface VqeSimulationResult {
  moleculeName: string;
  optimizer: string;
  groundStateCalculated: number;
  exactFciEnergy: number;
  energyErrorMHa: number;
  convergenceHistory: VqeStep[];
  ansatz: string;
}

export interface SynthesisStep {
  stepNumber: number;
  title: string;
  description: string;
  temperature: string;
  pressure: string;
  reagents: string[];
  duration: string;
  safetyNote: string;
}

export interface SynthesisProtocol {
  summary: string;
  precursorReagents: string[];
  steps: SynthesisStep[];
  safetyControls: string;
  wasteManagement: string;
  scalabilityTRL: number; // Technology Readiness Level (1-9)
  estimatedCostPerGram: string;
  theoreticalYieldPercent: number;
}

export interface ReferenceAnalogy {
  name: string;
  formula: string;
  smiles: string;
  structuralAnalogyReason: string; // 왜 이 유사 물질의 분자구조를 참조했는지에 대한 양자화학적 설명
  structuralModifications: string[]; // 참조 물질 대비 변형된 핵심 원자/결합 및 스캐폴드 홉핑(Scaffold Hopping) 내역
  homologyScore: number; // 구조적 상사성 점수 (0.0 ~ 1.0)
}

export interface NuclearAlternativeMaterial {
  id: string;
  name: string;
  koreanName: string;
  archetype: 'aneutronic-catalyst' | 'ultra-dense-hydrogen' | 'polymeric-nitrogen-cage' | 'topological-energy-lattice' | 'custom';
  formula: string;
  smiles: string;
  description: string;
  referenceAnalogy: ReferenceAnalogy; // 반드시 참조된 유사 물질의 분자구조 및 상사성 정보
  energyDensityMJkg: number; // Megajoules per kilogram
  energyDensityKWhg: number; // kWh per gram
  energyComparisonSummary: string; // e.g. "가솔린의 5,600배, 우라늄-235의 12% 수준 (방사성 낙진 0%)"
  reactionType: string;
  radiationHazard: string; // "Zero (방사선 방출 없음, 고순도 헬륨 4He/질소 및 전기 직접 회수)"
  quantumMechanism: string;
  quantumScreeningEnergyEV: number; // Electron screening potential in eV
  coulombBarrierReductionPercent: number; // Coulomb barrier lowering percentage
  gamowFactorImprovement: string; // e.g. "터널링 확률 10^12배 향상"
  atoms: Atom[];
  bonds: Bond[];
  quantumProperties: QuantumProperties;
  deepLearningMetrics: DeepLearningMetrics;
  synthesisProtocol: SynthesisProtocol;
  quantumCircuitConfig: QuantumCircuitConfig;
}

export interface SemiconductorMaterial {
  id: string;
  name: string;
  koreanName: string;
  archetype: '2d-sub1nm-tmd' | 'ultra-wide-bandgap' | 'high-mobility-fermi' | 'topological-spintronic' | 'custom';
  formula: string;
  smiles: string;
  description: string;
  referenceAnalogy: ReferenceAnalogy; // 기반 참조 유사 반도체 분자/격자 구조 (MoS2, GaN, Si, WTe2 등)
  bandgapEV: number; // Bandgap in eV (e.g. 1.85 eV, 4.8 eV)
  bandgapType: 'Direct' | 'Indirect';
  electronMobility: number; // cm^2 / V*s
  holeMobility: number; // cm^2 / V*s
  effectiveMassElectron: number; // in units of electron rest mass m_0 (e.g. 0.09 m_0)
  breakdownFieldMVcm: number; // Critical Breakdown Field in MV/cm (e.g. 8.0 MV/cm)
  dielectricConstant: number; // Relative permittivity epsilon_r (k)
  baligaFOM: number; // Baliga's Figure of Merit relative to Silicon (=1)
  subthresholdSwingMVdec: number; // Steep subthreshold swing in mV/decade (<60 mV/dec)
  onOffRatio: string; // e.g. "10^8"
  quantumAdvantageMechanism: string; // 양자 터널링 방지, 베리 위상(Berry phase), 2차원 양자 구속 효과
  atoms: Atom[];
  bonds: Bond[];
  quantumProperties: QuantumProperties;
  deepLearningMetrics: DeepLearningMetrics;
  synthesisProtocol: SynthesisProtocol; // MOCVD, ALD, MBE 에피택시 공정
  quantumCircuitConfig: QuantumCircuitConfig;
}

export const ATOM_COLORS: Record<string, string> = {
  H: '#FFFFFF',
  He: '#D9FFFF',
  Li: '#CC80FF',
  Be: '#C2FF00',
  B: '#FFB5B5',
  C: '#334155',
  N: '#3B82F6',
  O: '#EF4444',
  F: '#10B981',
  Ne: '#B3E3F5',
  Na: '#AB5CF2',
  Mg: '#8AFF00',
  Al: '#BFA6A6',
  Si: '#38BDF8',
  P: '#F97316',
  S: '#EAB308',
  Cl: '#22C55E',
  Ar: '#80D1E3',
  K: '#8F40D4',
  Ca: '#3DFF00',
  Sc: '#E6E6E6',
  Ti: '#06B6D4',
  V: '#A6A6AB',
  Cr: '#8A99C7',
  Mn: '#9C7AC7',
  Fe: '#E2E8F0',
  Co: '#0066FF',
  Ni: '#10B981',
  Cu: '#C88033',
  Zn: '#7D80B0',
  Ga: '#818CF8',
  Ge: '#60A5FA',
  As: '#A78BFA',
  Se: '#34D399',
  Br: '#A62929',
  Kr: '#5CB8D1',
  Rb: '#702EB8',
  Sr: '#00FF00',
  Y: '#94FFFF',
  Zr: '#94E0E0',
  Nb: '#73C2C9',
  Mo: '#2DD4BF',
  Tc: '#3B9E9E',
  Ru: '#248F8F',
  Rh: '#0A7D8C',
  Pd: '#38BDF8',
  Ag: '#C0C0C0',
  Cd: '#FFD98F',
  In: '#C084FC',
  Sn: '#668080',
  Sb: '#E879F9',
  Te: '#4ADE80',
  I: '#940094',
  Xe: '#429EB0',
  Cs: '#57178F',
  Ba: '#00C900',
  La: '#70D4FF',
  Ce: '#FFFFC7',
  Pr: '#D9FFC7',
  Nd: '#C7FFC7',
  Sm: '#A3FFC7',
  Eu: '#61FFC7',
  Gd: '#45FFC7',
  Tb: '#30FFC7',
  Dy: '#1FFFC7',
  Ho: '#00FF9C',
  Er: '#00E675',
  Tm: '#00D452',
  Yb: '#00BF38',
  Lu: '#00AB24',
  Hf: '#4DC2FF',
  Ta: '#4DA6FF',
  W: '#06B6D4',
  Re: '#267DAB',
  Os: '#266696',
  Ir: '#175487',
  Pt: '#E5E4E2',
  Au: '#FFD700',
  Hg: '#B8B8D0',
  Tl: '#A6544D',
  Pb: '#575961',
  Bi: '#9E4FB3',
  Po: '#AB5C00',
  At: '#754F45',
  Rn: '#428296',
  Fr: '#420066',
  Ra: '#007D00',
  Ac: '#70ABFA',
  Th: '#00BAFF',
  Pa: '#00A1FF',
  U: '#00E600',
  Np: '#0080FF',
  Pu: '#006BFF',
  Am: '#545CF2',
  Cm: '#785CE3',
  Bk: '#8A4FE3',
  Cf: '#A136D4',
  Es: '#B31FD4',
  Fm: '#B31FBA',
  Md: '#B30DA6',
  No: '#BD0D87',
  Lr: '#C70066',
  Rf: '#CC0059',
  Db: '#D1004F',
  Sg: '#D90045',
  Bh: '#E00038',
  Hs: '#E6002E',
  Mt: '#EB0026',
  Ds: '#F0001F',
  Rg: '#F50017',
  Cn: '#FA000D',
  Nh: '#FF1493',
  Fl: '#1E90FF',
  Mc: '#9370DB',
  Lv: '#FF6347',
  Ts: '#FFD700',
  Og: '#00CED1',
  default: '#94A3B8'
};

export const ATOM_RADII: Record<string, number> = {
  H: 0.32,
  He: 0.40,
  Li: 0.75,
  Be: 0.65,
  B: 0.80,
  C: 0.70,
  N: 0.65,
  O: 0.60,
  F: 0.55,
  Ne: 0.48,
  Na: 0.90,
  Mg: 0.85,
  Al: 0.85,
  Si: 0.85,
  P: 0.95,
  S: 0.90,
  Cl: 0.88,
  Ar: 0.70,
  K: 1.10,
  Ca: 1.00,
  Sc: 0.95,
  Ti: 0.95,
  V: 0.90,
  Cr: 0.90,
  Mn: 0.90,
  Fe: 0.85,
  Co: 0.85,
  Ni: 0.85,
  Cu: 0.85,
  Zn: 0.85,
  Ga: 0.90,
  Ge: 0.90,
  As: 0.90,
  Se: 0.95,
  Br: 0.95,
  Kr: 0.85,
  Rb: 1.20,
  Sr: 1.10,
  Y: 1.05,
  Zr: 1.00,
  Nb: 0.98,
  Mo: 1.00,
  Tc: 0.95,
  Ru: 0.95,
  Rh: 0.95,
  Pd: 0.95,
  Ag: 0.98,
  Cd: 1.00,
  In: 1.05,
  Sn: 1.05,
  Sb: 1.05,
  Te: 1.05,
  I: 1.05,
  Xe: 0.95,
  Cs: 1.30,
  Ba: 1.20,
  La: 1.15,
  Ce: 1.15,
  Pr: 1.15,
  Nd: 1.15,
  Pm: 1.15,
  Sm: 1.15,
  Eu: 1.15,
  Gd: 1.15,
  Tb: 1.15,
  Dy: 1.15,
  Ho: 1.15,
  Er: 1.15,
  Tm: 1.15,
  Yb: 1.15,
  Lu: 1.15,
  Hf: 1.00,
  Ta: 1.00,
  W: 1.00,
  Re: 1.00,
  Os: 1.00,
  Ir: 1.00,
  Pt: 1.00,
  Au: 1.00,
  Hg: 1.05,
  Tl: 1.10,
  Pb: 1.10,
  Bi: 1.10,
  Po: 1.10,
  At: 1.10,
  Rn: 1.00,
  Fr: 1.35,
  Ra: 1.25,
  Ac: 1.20,
  Th: 1.18,
  Pa: 1.18,
  U: 1.15,
  Np: 1.15,
  Pu: 1.15,
  Am: 1.15,
  Cm: 1.15,
  Bk: 1.15,
  Cf: 1.15,
  Es: 1.15,
  Fm: 1.15,
  Md: 1.15,
  No: 1.15,
  Lr: 1.15,
  Rf: 1.10,
  Db: 1.10,
  Sg: 1.10,
  Bh: 1.10,
  Hs: 1.10,
  Mt: 1.10,
  Ds: 1.10,
  Rg: 1.10,
  Cn: 1.10,
  Nh: 1.10,
  Fl: 1.10,
  Mc: 1.10,
  Lv: 1.10,
  Ts: 1.10,
  Og: 1.10,
  default: 0.75
};

export interface AlphaFoldResidue {
  index: number;
  code: string;
  name: string;
  pLDDT: number; // 0 to 100
  secondaryStructure: 'helix' | 'sheet' | 'coil';
  coordinates: {
    ca: [number, number, number];
    n?: [number, number, number];
    c?: [number, number, number];
  };
}

export interface QuantumPocketBinding {
  ligandName: string;
  bindingEnergyKcalMol: number; // Delta G
  inhibitionConstantKiNM: number; // Ki in nM
  keyInteractingResidues: string[];
  hBondCount: number;
  quantumPharmacophore: string;
  electrostaticFitScore: number; // 0.0 ~ 1.0
}

export interface AlphaFoldPredictionResult {
  id: string;
  targetName: string;
  koreanName: string;
  organism: string;
  uniprotId: string;
  sequence: string;
  meanPLDDT: number;
  ptmScore: number;
  iptmScore?: number;
  helixPercent: number;
  sheetPercent: number;
  coilPercent: number;
  paeMatrix: number[][]; // sampled 2D error matrix
  residues: AlphaFoldResidue[];
  pdbContent: string;
  atoms: Atom[];
  bonds: Bond[];
  quantumPocketBinding: QuantumPocketBinding;
  biologicalFunction: string;
  quantumBiologicalMechanism: string;
}

export interface DockingInteraction {
  type: 'hydrogen_bond' | 'pi_pi' | 'hydrophobic' | 'salt_bridge' | 'halogen_bond';
  residueName: string;
  atomPair: string;
  distanceAngstrom: number;
  energyKcalMol: number;
}

export interface DockingPose {
  poseIndex: number;
  affinityKcalMol: number; // Delta G
  inhibitionConstantKiNM: number; // Ki
  rmsdLowerBound: number;
  rmsdUpperBound: number;
  ligandEfficiency: number; // Delta G / Heavy Atoms
  energyBreakdown: {
    vdwEnergy: number;
    electrostaticEnergy: number;
    hBondEnergy: number;
    desolvationPenalty: number;
    torsionalEntropyLoss: number;
  };
  interactions: DockingInteraction[];
  coordinates: { x: number; y: number; z: number }[];
}

export interface CandidateLigandInfo {
  id: string;
  name: string;
  koreanName: string;
  formula: string;
  molecularWeight: number;
  logP: number;
  hBondDonors: number;
  hBondAcceptors: number;
  rotatableBonds: number;
  smiles: string;
  targetMechanism: string;
}

export interface DockingSimulationResult {
  targetProtein: string;
  targetKoreanName: string;
  ligand: CandidateLigandInfo;
  exhaustiveness: number;
  gridBox: {
    center: [number, number, number];
    size: [number, number, number];
  };
  bestAffinityKcalMol: number;
  bestKiNM: number;
  poses: DockingPose[];
  dockedAtoms?: Atom[];
  dockedBonds?: Bond[];
}

export interface DomainProductionRecommendation {
  domainKey: 'aerospace' | 'semiconductor' | 'battery' | 'quantum' | 'catalyst' | 'biomedical';
  domainName: string;
  domainIcon: string;
  compatibilityScore: number; // 0 to 100
  applicationTitle: string;
  expectedAdvantage: string;
  recommendedProductionMethod: string;
  productionParameters: {
    temperature: string;
    pressure: string;
    precursors: string;
    atmosphere: string;
    cycleTime: string;
  };
  scalabilityTRL: number; // 1 to 9
  estimatedCostPerUnit: string;
  scalingAdvice: string;
}

export interface ElementalSynthesizedMaterial {
  id: string;
  name: string;
  koreanName: string;
  formula: string;
  bondingType: string;
  electronegativityDelta: number;
  molecularWeight: number;
  crystalSystem: string;
  description: string;
  atoms: Atom[];
  bonds: Bond[];
  quantumProperties: {
    groundStateEnergy: number;
    vqeIterations: number;
    fidelityScore: number;
    homoEnergy: number;
    lumoEnergy: number;
    homoLumoGap: number;
    dipoleMoment: number;
    qubitsRequired: number;
    pauliTermsCount: number;
    quantumAdvantageMetric: string;
  };
  deepLearningMetrics: {
    qganDiscriminatorLoss: number;
    generatorFidelity: number;
    valenceValidityRate: number;
    sascore: number;
    qedScore: number;
    logP: number;
    molecularWeight: number;
  };
  synthesisProtocol: {
    summary: string;
    precursorReagents: string[];
    steps: {
      stepNumber: number;
      title: string;
      temperature: string;
      pressure: string;
      reagents: string[];
      duration: string;
      description: string;
      safetyNote: string;
    }[];
    safetyControls: string;
    wasteManagement: string;
    scalabilityTRL: number;
    estimatedCostPerGram: string;
    theoreticalYieldPercent: number;
  };
  domainRecommendations: DomainProductionRecommendation[];
}

export interface ReactionEnergyStep {
  timePs: number;
  freeEnergyKcalMol: number;
  potentialEnergyKcalMol: number;
  kineticEnergyKcalMol: number;
  reactantFraction: number; // 1.0 -> 0.0
  productFraction: number; // 0.0 -> 1.0
  temperatureK: number;
  pressureAtm: number;
  stateDescription: string;
}

export interface ReactionCoordinatePoint {
  coordinate: number; // 0.0 (Reactant) -> 0.5 (Transition State) -> 1.0 (Product)
  energyKcalMol: number;
  label: string;
}

export interface ReactionKineticsResult {
  materialName: string;
  formula: string;
  temperatureK: number;
  pressureAtm: number;
  atmosphere: string;
  reactionType: 'decomposition' | 'oxidation' | 'phase_transition' | 'cross_coupling' | 'hydrolysis';
  reactionTypeName: string;
  activationEnergyEaKcalMol: number;
  rateConstantK: number;
  halfLifeSeconds: number;
  gibbsFreeEnergyDeltaG: number;
  isSpontaneous: boolean;
  reactionCoordinateProfile: ReactionCoordinatePoint[];
  timeResolvedEnergyTrajectory: ReactionEnergyStep[];
  transitionStateDescription: string;
  finalProductFormula: string;
  initialAtoms: Atom[];
  initialBonds: Bond[];
  transitionStateAtoms: Atom[];
  transitionStateBonds: Bond[];
  degradedAtoms: Atom[];
  degradedBonds: Bond[];
  degradationMechanism: string;
  criticalFailureTemperatureK: number;
  criticalFailurePressureAtm: number;
}




