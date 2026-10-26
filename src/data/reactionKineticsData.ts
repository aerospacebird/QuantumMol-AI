import { 
  Atom, 
  Bond, 
  ReactionCoordinatePoint, 
  ReactionEnergyStep, 
  ReactionKineticsResult 
} from '../types/quantum';

export interface ReactionEnvironmentConfig {
  temperatureK: number;
  pressureAtm: number;
  atmosphere: 'inert_vacuum' | 'high_oxygen' | 'reducing_hydrogen' | 'corrosive_sulfur' | 'hydrothermal_water';
}

export const ATMOSPHERE_OPTIONS = [
  { id: 'inert_vacuum', name: '초고진공 / 불활성 아르곤 (Inert Vacuum / Ar)', icon: '🛡️', color: 'text-cyan-300' },
  { id: 'high_oxygen', name: '초고온 산화 대기 (High O₂ Oxidation)', icon: '🔥', color: 'text-rose-400' },
  { id: 'reducing_hydrogen', name: '고온 환원성 수소 가스 (Reducing H₂ Gas)', icon: '⚡', color: 'text-amber-300' },
  { id: 'corrosive_sulfur', name: '고부식성 황화물/산성 가스 (Corrosive SO₂/H₂S)', icon: '☣️', color: 'text-purple-400' },
  { id: 'hydrothermal_water', name: '초임계 수열/고압 수증기 (Supercritical H₂O)', icon: '💧', color: 'text-blue-400' }
] as const;

export function simulateReactionKinetics(
  materialName: string,
  formula: string,
  initialAtoms: Atom[],
  initialBonds: Bond[],
  config: ReactionEnvironmentConfig
): ReactionKineticsResult {
  const { temperatureK, pressureAtm, atmosphere } = config;

  // Physical constants
  const R_kcal = 0.0019872; // kcal / (mol * K)
  const kB_h = 2.0836e10; // (k_B / h) in s^-1 * K^-1

  // Base activation energy (Ea) heuristic based on formula
  let baseEa = 48.0; // kcal/mol
  let reactionType: ReactionKineticsResult['reactionType'] = 'decomposition';
  let reactionTypeName = '고온 열분해 및 결정 격자 붕괴 (Thermal Decomposition)';
  let deltaH = 14.5; // Endothermic decomposition by default
  let deltaS = 0.028; // Positive entropy change for gas evolution / fragmentation
  let deltaV_cm3 = 8.5; // Molar volume expansion
  let finalFormula = `${formula} (Decay Products)`;
  let failureTempK = 1350;

  if (atmosphere === 'high_oxygen') {
    reactionType = 'oxidation';
    reactionTypeName = '표면 산화 피막 형성 및 고온 산화 반응 (High-temp Oxidation)';
    baseEa = 34.0;
    deltaH = -68.0; // Highly exothermic oxidation
    deltaS = -0.015;
    deltaV_cm3 = 12.0;
    finalFormula = `${formula}·O_x (Oxide Phase)`;
    failureTempK = 1100;
  } else if (atmosphere === 'reducing_hydrogen') {
    reactionType = 'cross_coupling';
    reactionTypeName = '수소 흡장 및 금속 수화물 상변태 (Hydrogenation / Hydride Formation)';
    baseEa = 28.5;
    deltaH = -24.0;
    deltaS = -0.022;
    deltaV_cm3 = -6.0;
    finalFormula = `${formula}·H_y (Hydride Phase)`;
    failureTempK = 850;
  } else if (atmosphere === 'corrosive_sulfur') {
    reactionType = 'decomposition';
    reactionTypeName = '황화물 침식 및 결정립계 입계 부식 (Corrosive Sulfidation)';
    baseEa = 38.0;
    deltaH = -32.0;
    deltaS = 0.012;
    deltaV_cm3 = 14.0;
    finalFormula = `${formula}·S_z (Corroded Phase)`;
    failureTempK = 980;
  } else if (atmosphere === 'hydrothermal_water') {
    reactionType = 'hydrolysis';
    reactionTypeName = '초임계 수열 가수분해 및 침출 (Hydrothermal Leaching)';
    baseEa = 31.0;
    deltaH = -18.0;
    deltaS = 0.005;
    deltaV_cm3 = 4.0;
    finalFormula = `${formula}·(OH)_w (Hydroxide Precipitate)`;
    failureTempK = 650;
  } else {
    // Inert / Vacuum
    if (formula.includes('Nb') || formula.includes('Ta') || formula.includes('W') || formula.includes('Ti')) {
      baseEa = 78.0; // High refractory barrier
      deltaH = 38.0;
      failureTempK = 1850;
    } else if (formula.includes('Li') || formula.includes('Na')) {
      baseEa = 32.0;
      deltaH = 12.0;
      failureTempK = 720;
    }
  }

  // Pressure activation volume work term: P * DeltaV
  // 1 atm * cm^3 = 0.0242 cal = 0.0000242 kcal
  const pressureWorkKcal = pressureAtm * (deltaV_cm3 * 0.0000242);
  const effectiveEa = Math.max(12.0, parseFloat((baseEa + pressureWorkKcal * 0.15).toFixed(2)));

  // Delta G_rxn at given T
  const deltaG_rxn = parseFloat((deltaH - (temperatureK * deltaS) + pressureWorkKcal).toFixed(2));
  const isSpontaneous = deltaG_rxn < 0;

  // Eyring-Polanyi Transition State Rate Constant k(T)
  const deltaG_barrier = Math.max(6.0, effectiveEa);
  const expTerm = Math.exp(-deltaG_barrier / (R_kcal * temperatureK));
  const rateConstantK = Math.min(1e12, Math.max(1e-15, kB_h * temperatureK * expTerm));
  const halfLifeSeconds = Math.max(1e-12, Math.min(1e15, Math.LN2 / rateConstantK));

  // 1. Reaction Coordinate Energy Profile Points (0.0 -> 1.0)
  const reactionCoordinateProfile: ReactionCoordinatePoint[] = [
    { coordinate: 0.0, energyKcalMol: 0.0, label: '초기 반응물 격자 (Reactant State R)' },
    { coordinate: 0.25, energyKcalMol: parseFloat((effectiveEa * 0.42).toFixed(2)), label: '격자 인장 및 전자 오비탈 왜곡 (Lattice Strain)' },
    { coordinate: 0.5, energyKcalMol: effectiveEa, label: `전이 상태 극대점 (Transition State TS‡, Ea=${effectiveEa} kcal)` },
    { coordinate: 0.75, energyKcalMol: parseFloat((effectiveEa * 0.55 + deltaG_rxn * 0.45).toFixed(2)), label: '중간체 결합 재배열 (Intermediate INT)' },
    { coordinate: 1.0, energyKcalMol: deltaG_rxn, label: `최종 생성/분해 상태 (Product P, ΔG=${deltaG_rxn} kcal)` }
  ];

  // 2. Time-Resolved Kinetic Evolution Steps (0 to 100 ps or min scale)
  const timeResolvedEnergyTrajectory: ReactionEnergyStep[] = [];
  const numSteps = 24;
  const totalTimeWindow = Math.min(100.0, Math.max(1.0, (halfLifeSeconds > 10 ? 100 : halfLifeSeconds * 5e11)));

  for (let s = 0; s <= numSteps; s++) {
    const tFrac = s / numSteps;
    const timePs = parseFloat((tFrac * totalTimeWindow).toFixed(2));
    
    // First-order decay fraction
    const decayFactor = Math.min(1.0, rateConstantK * (timePs * 1e-12));
    const reactantFrac = Math.max(0.0, Math.min(1.0, parseFloat(Math.exp(-decayFactor * 1e11).toFixed(4))));
    const productFrac = parseFloat((1.0 - reactantFrac).toFixed(4));

    // Dynamic Free Energy & Potential Energy
    const currentFreeEnergy = parseFloat((reactantFrac * 0.0 + productFrac * deltaG_rxn + Math.sin(tFrac * Math.PI) * (effectiveEa * 0.65)).toFixed(2));
    const currentKineticEnergy = parseFloat(((1.5 * R_kcal * temperatureK) * (1.0 + Math.sin(tFrac * 4 * Math.PI) * 0.15)).toFixed(2));
    const currentPotentialEnergy = parseFloat((currentFreeEnergy - currentKineticEnergy).toFixed(2));

    let stateDesc = '초기 결정 격자 안정 상태';
    if (tFrac > 0.15 && tFrac < 0.45) stateDesc = '열진동 및 화학적 결합 왜곡 개시';
    else if (tFrac >= 0.45 && tFrac <= 0.65) stateDesc = '전이 상태 장벽 통과 및 활성 착물 형성';
    else if (tFrac > 0.65 && tFrac < 0.9) stateDesc = '새로운 상(Phase) 핵생성 및 결정화';
    else if (tFrac >= 0.9) stateDesc = '최종 분해/반응 평형 도달';

    timeResolvedEnergyTrajectory.push({
      timePs,
      freeEnergyKcalMol: currentFreeEnergy,
      potentialEnergyKcalMol: currentPotentialEnergy,
      kineticEnergyKcalMol: currentKineticEnergy,
      reactantFraction: reactantFrac,
      productFraction: productFrac,
      temperatureK,
      pressureAtm,
      stateDescription: stateDesc
    });
  }

  // 3. Generate 3D Transition State Atoms & Degraded Product Atoms
  const transitionStateAtoms: Atom[] = initialAtoms.map((a, idx) => ({
    ...a,
    id: a.id,
    x: parseFloat((a.x * 1.15 + (Math.sin(idx) * 0.35)).toFixed(3)),
    y: parseFloat((a.y * 1.15 + (Math.cos(idx) * 0.35)).toFixed(3)),
    z: parseFloat((a.z * 1.15 + (idx % 2 === 0 ? 0.3 : -0.3)).toFixed(3)),
    charge: parseFloat(((a.charge || 0) * 1.4).toFixed(2))
  }));

  const transitionStateBonds: Bond[] = initialBonds.map(b => ({
    ...b,
    order: (b.order === 2 ? 1.5 : 1)
  }));

  // Degraded / Reacted product atoms (fragmented or newly formed)
  const degradedAtoms: Atom[] = initialAtoms.map((a, idx) => {
    const shift = (idx % 2 === 0 ? 1 : -1) * (1.5 + (idx * 0.2));
    return {
      ...a,
      id: a.id,
      x: parseFloat((a.x + shift).toFixed(3)),
      y: parseFloat((a.y + (idx % 3 === 0 ? 1.2 : -1.2)).toFixed(3)),
      z: parseFloat((a.z + (idx % 2 === 0 ? 0.8 : -0.8)).toFixed(3)),
      charge: parseFloat(((a.charge || 0) * 0.5).toFixed(2))
    };
  });

  // If oxidation/hydrolysis, add reactant adduct atoms (O or H)
  if (atmosphere === 'high_oxygen' || atmosphere === 'hydrothermal_water') {
    const addSym = atmosphere === 'high_oxygen' ? 'O' : 'O';
    const startId = degradedAtoms.length;
    for (let o = 0; o < Math.min(4, initialAtoms.length); o++) {
      degradedAtoms.push({
        id: startId + o,
        symbol: addSym,
        x: parseFloat((Math.cos(o * 1.5) * 2.8).toFixed(3)),
        y: parseFloat((Math.sin(o * 1.5) * 2.8).toFixed(3)),
        z: parseFloat((o * 0.6 - 1.0).toFixed(3)),
        charge: -0.45,
        hybridization: 'sp3'
      });
    }
  }

  const degradedBonds: Bond[] = initialBonds.filter((_, idx) => idx % 2 === 0);

  return {
    materialName,
    formula,
    temperatureK,
    pressureAtm,
    atmosphere,
    reactionType,
    reactionTypeName,
    activationEnergyEaKcalMol: effectiveEa,
    rateConstantK: parseFloat(rateConstantK.toExponential(3)),
    halfLifeSeconds: parseFloat(halfLifeSeconds.toExponential(3)),
    gibbsFreeEnergyDeltaG: deltaG_rxn,
    isSpontaneous,
    reactionCoordinateProfile,
    timeResolvedEnergyTrajectory,
    transitionStateDescription: `${temperatureK}K, ${pressureAtm} atm 환경에서 ${reactionTypeName}: 활성화 에너지 ${effectiveEa} kcal/mol 장벽을 넘어 전이 상태 도달`,
    finalProductFormula: finalFormula,
    initialAtoms,
    initialBonds,
    transitionStateAtoms,
    transitionStateBonds,
    degradedAtoms,
    degradedBonds,
    degradationMechanism: `열진동과 압력 구배에 의해 ${formula} 원자간 결합 차수가 붕괴되고, ${atmosphere} 환경과의 전자 이동으로 인해 새로운 ${finalFormula} 상으로 재결정화됩니다.`,
    criticalFailureTemperatureK: failureTempK,
    criticalFailurePressureAtm: 15000
  };
}
