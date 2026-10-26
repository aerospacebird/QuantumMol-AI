import { Atom, Bond, DomainProductionRecommendation, ElementalSynthesizedMaterial } from '../types/quantum';
import { PeriodicElement, PERIODIC_ELEMENTS } from './periodicTableData';

export interface PresetMaterialRecipe {
  id: string;
  name: string;
  koreanName: string;
  formula: string;
  elements: { symbol: string; count: number }[];
  primaryDomain: string;
  domainIcon: string;
  highlightTag: string;
  description: string;
}

export const PRESET_MATERIAL_RECIPES: PresetMaterialRecipe[] = [
  {
    id: 'recipe-aerospace-nbtial',
    name: 'Q-SuperAlloy Nb₂TiAl',
    koreanName: '극초음속 우주항공 초내열 감마-타이타늄 알루미나이드',
    formula: 'Nb2TiAl',
    elements: [
      { symbol: 'Nb', count: 2 },
      { symbol: 'Ti', count: 1 },
      { symbol: 'Al', count: 1 }
    ],
    primaryDomain: '우주항공 & 극한환경',
    domainIcon: '🚀',
    highlightTag: '1450°C 고온 크립 저항',
    description: '니오븀(Nb)의 초고융점과 티타늄(Ti), 알루미늄(Al)의 경량 금속간 화합물 격자로 초음속 연소실 및 터빈 블레이드에 최적화된 초내열 소재'
  },
  {
    id: 'recipe-semi-ga2o3',
    name: 'Q-PowerSemi β-Ga₂O₃',
    koreanName: '초광대역 밴드갭(4.8eV) 차세대 전력반도체 단결정',
    formula: 'Ga2O3',
    elements: [
      { symbol: 'Ga', count: 2 },
      { symbol: 'O', count: 3 }
    ],
    primaryDomain: '차세대 전력반도체',
    domainIcon: '⚡',
    highlightTag: '절연파괴전계 8 MV/cm',
    description: 'SiC 및 GaN을 능가하는 4.8eV의 초광대역 밴드갭을 지녀 초고압 전기차 인버터 및 우주 방사선 내성 RF 칩에 적용되는 차세대 산화물 반도체'
  },
  {
    id: 'recipe-battery-llzo',
    name: 'Q-SolidElectrolyte Li₇La₃Zr₂O₁₂',
    koreanName: '가넷형 LLZO 초이온전도성 전고체 배터리 고체전해질',
    formula: 'Li7La3Zr2O12',
    elements: [
      { symbol: 'Li', count: 7 },
      { symbol: 'La', count: 3 },
      { symbol: 'Zr', count: 2 },
      { symbol: 'O', count: 6 }
    ],
    primaryDomain: '전고체 배터리 & 에너지 저장',
    domainIcon: '🔋',
    highlightTag: '1.2 mS/cm 이온전도도 & 화재 0%',
    description: '리튬 덴드라이트 침투를 원천 차단하고 발화 위험이 전혀 없는 고밀도 전고체 배터리 핵심 세라믹 전해질'
  },
  {
    id: 'recipe-quantum-ybco',
    name: 'Q-HighTc YBa₂Cu₃O₇',
    koreanName: 'YBCO 페로브스카이트 고온 초전도 양자 격자',
    formula: 'YBa2Cu3O7',
    elements: [
      { symbol: 'Y', count: 1 },
      { symbol: 'Ba', count: 2 },
      { symbol: 'Cu', count: 3 },
      { symbol: 'O', count: 7 }
    ],
    primaryDomain: '양자 컴퓨팅 큐비트 & 초전도',
    domainIcon: '⚛️',
    highlightTag: '임계온도 Tc = 93K (액체질소)',
    description: '구리-산소 평면(CuO₂) 내 양자 d-파 대칭 쿠퍼쌍 응축으로 초고속 무손실 양자 정보 전송 및 고자기장 코일 구현'
  },
  {
    id: 'recipe-catalyst-ptnife',
    name: 'Q-NanoCatalyst PtNiFe',
    koreanName: '그린 수소 수전해 초고효율 삼원계 나노합금 촉매',
    formula: 'PtNiFe',
    elements: [
      { symbol: 'Pt', count: 1 },
      { symbol: 'Ni', count: 1 },
      { symbol: 'Fe', count: 1 }
    ],
    primaryDomain: '탄소중립 & 그린수소 촉매',
    domainIcon: '🌿',
    highlightTag: '수전해 과전압 190 mV 달성',
    description: '백금(Pt) 사용량을 70% 절감하면서 철(Fe)과 니켈(Ni)의 전자 오비탈 전하이동으로 산소/수소 발생 반응 속도를 극대화'
  },
  {
    id: 'recipe-bio-titazr',
    name: 'Q-BioTitanium Ti₃TaZr',
    koreanName: '생체적합 저탄성률 다공성 인공관절 티타늄 합금',
    formula: 'Ti3TaZr',
    elements: [
      { symbol: 'Ti', count: 3 },
      { symbol: 'Ta', count: 1 },
      { symbol: 'Zr', count: 1 }
    ],
    primaryDomain: '바이오메디컬 & 임플란트',
    domainIcon: '🧬',
    highlightTag: '인간 골조직 탄성계수 45 GPa 일치',
    description: '독성 원소(V, Al)를 완전 배제하고 탄탈륨(Ta)과 지르코늄(Zr)으로 골융합 세포 증식을 촉진하여 뼈 응력 차폐(Stress Shielding) 부작용 방지'
  }
];

export function buildDomainRecommendations(
  elements: PeriodicElement[],
  formula: string,
  bondingType: string
): DomainProductionRecommendation[] {
  const symbols = elements.map(e => e.symbol);
  const hasRefractory = symbols.some(s => ['Nb', 'Ta', 'W', 'Mo', 'Ti', 'Zr', 'Hf', 'Re'].includes(s));
  const hasSemiconductor = symbols.some(s => ['Ga', 'In', 'Si', 'Ge', 'O', 'N', 'As', 'Sb', 'Te', 'Se'].includes(s));
  const hasBattery = symbols.some(s => ['Li', 'Na', 'P', 'S', 'La', 'Zr', 'O', 'F', 'Co', 'Ni', 'Mn'].includes(s));
  const hasSupercond = symbols.some(s => ['Y', 'Ba', 'Cu', 'O', 'Bi', 'Sr', 'Ca', 'Fe', 'Se'].includes(s));
  const hasCatalyst = symbols.some(s => ['Pt', 'Pd', 'Ir', 'Ru', 'Ni', 'Fe', 'Co', 'Cu', 'Mo'].includes(s));
  const hasBiocompatible = symbols.some(s => ['Ti', 'Ta', 'Zr', 'Nb', 'Mg', 'Ca', 'P', 'Zn'].includes(s));

  // 1. Aerospace
  const aeroScore = hasRefractory ? 96 : (symbols.some(s => ['Al', 'Ni', 'Fe', 'Cr'].includes(s)) ? 82 : 45);
  // 2. Semiconductor
  const semiScore = hasSemiconductor ? 95 : (bondingType.includes('공유') ? 78 : 38);
  // 3. Solid Battery
  const battScore = hasBattery ? 94 : (symbols.includes('Li') || symbols.includes('Na') ? 85 : 42);
  // 4. Quantum Superconductor
  const quantScore = hasSupercond ? 95 : (symbols.some(s => ['Nb', 'Al', 'Pb', 'Sn'].includes(s)) ? 80 : 35);
  // 5. Green Hydrogen Catalyst
  const cataScore = hasCatalyst ? 96 : (symbols.some(s => ['C', 'N', 'W', 'V'].includes(s)) ? 75 : 40);
  // 6. Biomedical
  const bioScore = hasBiocompatible ? 94 : (symbols.every(s => !['Pb', 'Hg', 'Cd', 'As', 'Tl'].includes(s)) ? 68 : 20);

  return [
    {
      domainKey: 'aerospace',
      domainName: '우주항공 & 극한환경 (Aerospace)',
      domainIcon: '🚀',
      compatibilityScore: aeroScore,
      applicationTitle: `${formula} 극초음속 비행체 열차폐재 및 고온 가스터빈`,
      expectedAdvantage: `${formula} 결정립계의 고온 전위 이동 억제로 1300°C 이상 산화 방지 및 초저열팽창 달성`,
      recommendedProductionMethod: '스파크 플라즈마 소결(SPS, Spark Plasma Sintering) 및 전자빔 용융 3D 적층제조(EBM)',
      productionParameters: {
        temperature: '1250°C ~ 1400°C 고온 소결',
        pressure: '50 MPa 일축 가압 진공',
        precursors: `${symbols.join(', ')} 고순도(99.99%) 구형 가스분무 나노합금 분말`,
        atmosphere: '초고순도 Ar (99.9999%) 불활성 분위기',
        cycleTime: '승온 15분 / 유지 30분 / 급랭'
      },
      scalabilityTRL: 7,
      estimatedCostPerUnit: 'kg당 $85 ~ $140',
      scalingAdvice: '소결 시 승온 속도를 분당 100°C로 제어하여 결정립 성장을 억제하고 상온 취성을 방지하십시오.'
    },
    {
      domainKey: 'semiconductor',
      domainName: '차세대 전력반도체 & 광전자 (Semiconductors)',
      domainIcon: '⚡',
      compatibilityScore: semiScore,
      applicationTitle: `${formula} 초광대역 밴드갭 고전력 소자 및 초고주파 RF 칩`,
      expectedAdvantage: `높은 발리가 에너지 지수(Baliga FOM)와 초저 온저항(R_on)으로 전력 손실 80% 저감`,
      recommendedProductionMethod: '유기금속 화학기상증착(MOCVD) 및 분자선 에피택시(MBE, Molecular Beam Epitaxy)',
      productionParameters: {
        temperature: '750°C ~ 950°C 기판 온도',
        pressure: '50 ~ 200 mbar 저압 MOCVD',
        precursors: `${symbols.map(s => `${s} 유기금속 알킬 착물`).join(', ')}`,
        atmosphere: '수소(H₂) 및 고순도 질소(N₂) 캐리어 가스',
        cycleTime: '시간당 1.5 ~ 2.0 μm 에피택시 성장'
      },
      scalabilityTRL: 6,
      estimatedCostPerUnit: '웨이퍼(6인치)당 $450 ~ $800',
      scalingAdvice: '기판과의 격자 부정합(Lattice Mismatch)을 줄이기 위해 원자층 완충 박막(Buffer Layer)을 필수 삽입하십시오.'
    },
    {
      domainKey: 'battery',
      domainName: '전고체 배터리 & 에너지 저장 (Solid Batteries)',
      domainIcon: '🔋',
      compatibilityScore: battScore,
      applicationTitle: `${formula} 무발화 고밀도 전고체 배터리용 초이온전도성 전해질`,
      expectedAdvantage: `넓은 전기화학적 안정 창(0~5V) 및 리튬 음극과의 계면 부반응 억제`,
      recommendedProductionMethod: '고에너지 유성 볼밀링(Planetary Ball Milling) 및 롤투롤(R2R) 건식 전사 코팅',
      productionParameters: {
        temperature: '상온 밀링 후 650°C ~ 850°C 단시간 소성',
        pressure: '1.0 atm (수분 < 0.1 ppm)',
        precursors: `${symbols.join(', ')} 고순도 탄산염 및 황화물/산화물 전구체`,
        atmosphere: '노점(Dew Point) -75°C 이하 드라이룸 질소 분위기',
        cycleTime: '밀링 24시간 후 소성 6시간'
      },
      scalabilityTRL: 8,
      estimatedCostPerUnit: 'kg당 $35 ~ $65',
      scalingAdvice: '대기 중 수분 접촉 시 유해가스 발생을 방지하기 위해 입자 표면에 지르코니아(ZrO₂) 원자층 보호막 코팅을 권장합니다.'
    },
    {
      domainKey: 'quantum',
      domainName: '양자 컴퓨팅 큐비트 & 초전도체 (Quantum & Superconducting)',
      domainIcon: '⚛️',
      compatibilityScore: quantScore,
      applicationTitle: `${formula} 양자 프로세서 조셉슨 접합 및 무손실 초전도 버스라인`,
      expectedAdvantage: `초전도 갭 대칭성을 통한 큐비트 디코히어런스 시간(T1/T2) 3배 연장`,
      recommendedProductionMethod: '초고진공 펄스 레이저 증착(PLD, Pulsed Laser Deposition) 및 초저온 스퍼터링',
      productionParameters: {
        temperature: '780°C 에피택시 증착',
        pressure: '10⁻⁸ Torr 초고진공 챔버',
        precursors: `${formula} 균일 단일 타겟 디스크 (순도 99.999%)`,
        atmosphere: '산소 분압 200 mTorr 정밀 제어',
        cycleTime: '원자층 단위(Layer-by-Layer) 정밀 증착'
      },
      scalabilityTRL: 5,
      estimatedCostPerUnit: '샘플 칩당 $1,200 ~ $2,500',
      scalingAdvice: '자선 결함(Flux Pinning Centers) 밀도를 통제하여 양자 간섭계(SQUID) 노이즈를 최소화하십시오.'
    },
    {
      domainKey: 'catalyst',
      domainName: '탄소중립 & 그린수소 수전해 촉매 (Green Hydrogen)',
      domainIcon: '🌿',
      compatibilityScore: cataScore,
      applicationTitle: `${formula} 양이온 교환막 수전해(PEMWE) 산소/수소 발생 고활성 나노촉매`,
      expectedAdvantage: `d-밴드 중심 이동(d-band Center Shift)으로 흡탈착 활성화 에너지 장벽 40% 저감`,
      recommendedProductionMethod: '열수 합성(Hydrothermal Synthesis) 및 유동층 원자층 증착(Fluidized-bed ALD)',
      productionParameters: {
        temperature: '180°C 수열 반응기',
        pressure: '15 bar 자기 발생 수증기압',
        precursors: `${symbols.map(s => `${s} 염화물 및 질산염 수용액`).join(', ')}`,
        atmosphere: 'pH 10 알칼리 조절 수용액 환경',
        cycleTime: '12시간 수열 합성 후 세척/동결건조'
      },
      scalabilityTRL: 8,
      estimatedCostPerUnit: 'g당 $12 ~ $28 (귀금속 함량 70% 절감)',
      scalingAdvice: '탄소 나노튜브(CNT) 지지체 표면에 2~3nm 크기로 균일 분산시켜 비표면적을 180 m²/g 이상으로 유지하십시오.'
    },
    {
      domainKey: 'biomedical',
      domainName: '바이오메디컬 & 생체적합 임플란트 (Biomedical)',
      domainIcon: '🧬',
      compatibilityScore: bioScore,
      applicationTitle: `${formula} 환자 맞춤형 골형성 유도 3D 다공성 정형외과 인공골`,
      expectedAdvantage: `인체 뼈와 유사한 30~45 GPa의 탄성계수로 응력 차폐 방지 및 세포 접착률 98%`,
      recommendedProductionMethod: '선택적 레이저 용융 3D 프린팅(SLM, Selective Laser Melting)',
      productionParameters: {
        temperature: '레이저 용융 풀 1650°C',
        pressure: '1.0 atm (산소 농도 < 100 ppm)',
        precursors: `${formula} 플라즈마 회전전극법(PREP)으로 제조된 15~45 μm 구형 분말`,
        atmosphere: '초고순도 Ar 연속 순환 정제',
        cycleTime: '시간당 15 cm³ 적층 빌드'
      },
      scalabilityTRL: 9,
      estimatedCostPerUnit: '인공관절 세트당 $600 ~ $1,100',
      scalingAdvice: '적층 후 800°C에서 진공 응력 완화 열처리를 수행하여 잔류 응력을 제거하고 골유착 표면 양극산화(Anodization) 처리를 병행하십시오.'
    }
  ];
}

// Generate realistic 3D atomic crystal coordinates and bonds for the synthesized material
export function generateSynthesizedCrystalModel(
  elements: PeriodicElement[],
  stoichiometry: Record<string, number>
): { atoms: Atom[]; bonds: Bond[] } {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  let atomId = 0;

  // Total atoms in unit cell / cluster representation
  const flattened: { symbol: string; el: PeriodicElement }[] = [];
  elements.forEach(el => {
    const count = Math.min(8, Math.max(1, stoichiometry[el.symbol] || 1));
    for (let c = 0; c < count; c++) {
      flattened.push({ symbol: el.symbol, el });
    }
  });

  const totalAtoms = flattened.length;

  if (totalAtoms === 2) {
    // Diatomic or simple binary linear
    atoms.push(
      { id: 0, symbol: flattened[0].symbol, x: -1.05, y: 0, z: 0, charge: 0.4, hybridization: 'sp' },
      { id: 1, symbol: flattened[1].symbol, x: 1.05, y: 0, z: 0, charge: -0.4, hybridization: 'sp' }
    );
    bonds.push({ atom1: 0, atom2: 1, order: 1 });
  } else if (totalAtoms <= 5) {
    // Trigonal bipyramidal / tetrahedral clustered center
    atoms.push({
      id: 0,
      symbol: flattened[0].symbol,
      x: 0,
      y: 0,
      z: 0,
      charge: 0.6,
      hybridization: 'sp3'
    });
    atomId = 1;
    for (let i = 1; i < totalAtoms; i++) {
      const angle = ((Math.PI * 2) / (totalAtoms - 1)) * (i - 1);
      const r = 1.65;
      const zOffset = (i % 2 === 0 ? 0.45 : -0.45);
      atoms.push({
        id: atomId,
        symbol: flattened[i].symbol,
        x: parseFloat((r * Math.cos(angle)).toFixed(3)),
        y: parseFloat((r * Math.sin(angle)).toFixed(3)),
        z: parseFloat(zOffset.toFixed(3)),
        charge: -0.6 / (totalAtoms - 1),
        hybridization: 'sp3'
      });
      bonds.push({ atom1: 0, atom2: atomId, order: 1.5 });
      atomId++;
    }
  } else {
    // Multi-element 3D crystal lattice cluster (Perovskite / Fluorite / Heusler multi-shell)
    // Core center
    atoms.push({
      id: 0,
      symbol: flattened[0].symbol,
      x: 0,
      y: 0,
      z: 0,
      charge: 0.8,
      hybridization: 'octahedral'
    });

    const innerRadius = 1.7;
    const outerRadius = 2.8;

    for (let i = 1; i < totalAtoms; i++) {
      const isInner = i <= 6;
      const r = isInner ? innerRadius : outerRadius;
      const step = isInner ? (Math.PI * 2) / 6 : (Math.PI * 2) / Math.max(1, totalAtoms - 7);
      const idx = isInner ? i - 1 : i - 7;
      const angle = step * idx;
      const z = isInner ? (idx % 2 === 0 ? 0.75 : -0.75) : (idx % 3 === 0 ? 1.4 : idx % 3 === 1 ? 0 : -1.4);

      atoms.push({
        id: i,
        symbol: flattened[i].symbol,
        x: parseFloat((r * Math.cos(angle)).toFixed(3)),
        y: parseFloat((r * Math.sin(angle)).toFixed(3)),
        z: parseFloat(z.toFixed(3)),
        charge: -0.4,
        hybridization: 'sp3d2'
      });

      if (isInner) {
        bonds.push({ atom1: 0, atom2: i, order: 1 });
      } else {
        // Inter-shell bonds to nearby inner atoms
        const nearestInner = (idx % 6) + 1;
        bonds.push({ atom1: nearestInner, atom2: i, order: 1 });
      }
    }
  }

  return { atoms, bonds };
}
