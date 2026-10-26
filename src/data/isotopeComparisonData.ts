import { Atom, Bond, QuantumProperties } from '../types/quantum';

export interface IsotopeSystemComparison {
  id: string;
  name: string;
  koreanName: string;
  formula: string;
  description: string;
  bondingType: '금속 결합 (Metallic BCC)' | '이온 결합 (Ionic FCC NaCl형)' | '공유 결합 (Covalent σ-bond)';
  nuclearMassTotalAmu: number;
  reducedMassAmu: number; // mu
  vibrationalFrequencyCm1: number; // wavenumber nu
  zeroPointEnergyKjMol: number; // ZPE
  dissociationEnergyEv: number; // D0
  meanBondLengthAngstrom: number; // r0
  meltingPointCelsius: number;
  quantumMechanicsSummary: string;
  atoms: Atom[];
  bonds: Bond[];
  quantumProperties: QuantumProperties;
}

export const LITHIUM_ISOTOPE_SYSTEMS: IsotopeSystemComparison[] = [
  {
    id: 'lithium-metal-bcc',
    name: 'Elemental Lithium (Li metal)',
    koreanName: '순수 금속 리튬 (BCC 결정 격자)',
    formula: 'Li (BCC)',
    description: '체심입방(BCC) 격자에서 2s 전자가 전도 띠(Conduction Band)로 비국재화된 자유전자 가스를 형성하여 높은 전기·열전도도를 나타내는 전형적인 알칼리 금속 결합입니다.',
    bondingType: '금속 결합 (Metallic BCC)',
    nuclearMassTotalAmu: 6.94,
    reducedMassAmu: 3.47,
    vibrationalFrequencyCm1: 350.0,
    zeroPointEnergyKjMol: 2.10,
    dissociationEnergyEv: 1.63, // cohesive energy
    meanBondLengthAngstrom: 3.04, // Li-Li distance
    meltingPointCelsius: 180.5,
    quantumMechanicsSummary: '비국재화된 2s 자유 전자가 페르미 표면(Fermi surface)을 형성하며 금속 결합을 이룹니다. 이온 결정인 LiH/LiD에 비해 결합 세기가 온화하여 180.5°C에서 쉽게 액화됩니다.',
    atoms: [
      { id: 0, symbol: 'Li', x: 0.0, y: 0.0, z: 0.0, charge: 0.0, hybridization: 'metal' },
      { id: 1, symbol: 'Li', x: 1.52, y: 1.52, z: 1.52, charge: 0.0, hybridization: 'metal' },
      { id: 2, symbol: 'Li', x: -1.52, y: 1.52, z: 1.52, charge: 0.0, hybridization: 'metal' },
      { id: 3, symbol: 'Li', x: 1.52, y: -1.52, z: 1.52, charge: 0.0, hybridization: 'metal' },
      { id: 4, symbol: 'Li', x: -1.52, y: -1.52, z: 1.52, charge: 0.0, hybridization: 'metal' },
      { id: 5, symbol: 'Li', x: 1.52, y: 1.52, z: -1.52, charge: 0.0, hybridization: 'metal' },
      { id: 6, symbol: 'Li', x: -1.52, y: 1.52, z: -1.52, charge: 0.0, hybridization: 'metal' },
      { id: 7, symbol: 'Li', x: 1.52, y: -1.52, z: -1.52, charge: 0.0, hybridization: 'metal' },
      { id: 8, symbol: 'Li', x: -1.52, y: -1.52, z: -1.52, charge: 0.0, hybridization: 'metal' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 },
      { atom1: 0, atom2: 5, order: 1 },
      { atom1: 0, atom2: 6, order: 1 },
      { atom1: 0, atom2: 7, order: 1 },
      { atom1: 0, atom2: 8, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -7.478,
      vqeIterations: 24,
      fidelityScore: 0.995,
      homoEnergy: -5.39,
      lumoEnergy: -0.22,
      homoLumoGap: 5.17,
      dipoleMoment: 0.0,
      qubitsRequired: 4,
      pauliTermsCount: 48,
      quantumAdvantageMetric: 'BCC 금속 결정 밴드 오비탈 수렴 계산'
    }
  },
  {
    id: 'lithium-hydride-lih',
    name: 'Lithium Hydride (LiH)',
    koreanName: '수소화 리튬 (경수소 ¹H 이온 결정)',
    formula: 'Li¹H (Rock-salt FCC)',
    description: '리튬(Li⁺) 양이온과 경수소 음이온(H⁻, 1s² 헬륨 전자배치)이 1:1로 결합한 암염(NaCl)형 면심입방 이온성 결정 격자입니다.',
    bondingType: '이온 결합 (Ionic FCC NaCl형)',
    nuclearMassTotalAmu: 7.95,
    reducedMassAmu: 0.881, // mu = (7 * 1.008) / (7 + 1.008)
    vibrationalFrequencyCm1: 594.0, // optical phonon frequency
    zeroPointEnergyKjMol: 8.42,
    dissociationEnergyEv: 2.43,
    meanBondLengthAngstrom: 2.043,
    meltingPointCelsius: 689.0,
    quantumMechanicsSummary: '가벼운 수소(¹H) 핵의 큰 진동 진폭으로 인해 영점 진동 에너지(ZPE = 8.42 kJ/mol)가 LiD 대비 38% 높으며, 포논 산란이 활발합니다.',
    atoms: [
      { id: 0, symbol: 'Li', x: 0.0, y: 0.0, z: 0.0, charge: 0.85, hybridization: 's' },
      { id: 1, symbol: 'H', x: 2.04, y: 0.0, z: 0.0, charge: -0.85, hybridization: 's' },
      { id: 2, symbol: 'H', x: -2.04, y: 0.0, z: 0.0, charge: -0.85, hybridization: 's' },
      { id: 3, symbol: 'H', x: 0.0, y: 2.04, z: 0.0, charge: -0.85, hybridization: 's' },
      { id: 4, symbol: 'H', x: 0.0, y: -2.04, z: 0.0, charge: -0.85, hybridization: 's' },
      { id: 5, symbol: 'H', x: 0.0, y: 0.0, z: 2.04, charge: -0.85, hybridization: 's' },
      { id: 6, symbol: 'H', x: 0.0, y: 0.0, z: -2.04, charge: -0.85, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 },
      { atom1: 0, atom2: 5, order: 1 },
      { atom1: 0, atom2: 6, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -7.882,
      vqeIterations: 32,
      fidelityScore: 0.996,
      homoEnergy: -7.13,
      lumoEnergy: 0.00,
      homoLumoGap: 7.13,
      dipoleMoment: 5.88,
      qubitsRequired: 6,
      pauliTermsCount: 96,
      quantumAdvantageMetric: '이온성 수소화물 암염 격자 VQE 6-큐비트 계산'
    }
  },
  {
    id: 'lithium-deuteride-lid',
    name: 'Lithium Deuteride (LiD)',
    koreanName: '중수소화 리튬 (중수소 ²H/D 이온 결정)',
    formula: 'Li²D (Rock-salt FCC)',
    description: '중수소(D⁻, 양성자 1개 + 중성자 1개) 음이온이 리튬(Li⁺)과 결합한 결정으로, 중성자 질량으로 인해 LiH 대비 결합 거리가 수축되고 영점 에너지가 낮아집니다.',
    bondingType: '이온 결합 (Ionic FCC NaCl형)',
    nuclearMassTotalAmu: 8.95,
    reducedMassAmu: 1.571, // mu = (7 * 2.014) / (7 + 2.014)
    vibrationalFrequencyCm1: 430.0, // optical phonon frequency
    zeroPointEnergyKjMol: 6.08,
    dissociationEnergyEv: 2.47,
    meanBondLengthAngstrom: 2.039, // Ubbelohde effect lattice contraction
    meltingPointCelsius: 691.0,
    quantumMechanicsSummary: '중수소 질량(2.014 amu)이 2배 증가함에 따라 포논 진동수가 1/sqrt(mu) 비율로 감소(430 cm^-1). 영점 진동 에너지(ZPE)가 6.08 kJ/mol로 낮아져 유효 포텐셜 우물 바닥에 더 깊이 위치하여 열역학적으로 더 높은 융점(691°C)과 결합 해리 에너지를 가집니다.',
    atoms: [
      { id: 0, symbol: 'Li', x: 0.0, y: 0.0, z: 0.0, charge: 0.85, hybridization: 's' },
      { id: 1, symbol: 'H', x: 2.039, y: 0.0, z: 0.0, charge: -0.85, hybridization: 's' }, // Represents D
      { id: 2, symbol: 'H', x: -2.039, y: 0.0, z: 0.0, charge: -0.85, hybridization: 's' },
      { id: 3, symbol: 'H', x: 0.0, y: 2.039, z: 0.0, charge: -0.85, hybridization: 's' },
      { id: 4, symbol: 'H', x: 0.0, y: -2.039, z: 0.0, charge: -0.85, hybridization: 's' },
      { id: 5, symbol: 'H', x: 0.0, y: 0.0, z: 2.039, charge: -0.85, hybridization: 's' },
      { id: 6, symbol: 'H', x: 0.0, y: 0.0, z: -2.039, charge: -0.85, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 },
      { atom1: 0, atom2: 5, order: 1 },
      { atom1: 0, atom2: 6, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -7.905,
      vqeIterations: 34,
      fidelityScore: 0.997,
      homoEnergy: -7.15,
      lumoEnergy: 0.00,
      homoLumoGap: 7.15,
      dipoleMoment: 5.86,
      qubitsRequired: 6,
      pauliTermsCount: 96,
      quantumAdvantageMetric: '중수소 동위원소 시프트(Isotope Shift) ZPE 질량 재규격화 해석'
    }
  }
];

export const HYDROGEN_ISOTOPE_SYSTEMS: IsotopeSystemComparison[] = [
  {
    id: 'hydrogen-h2',
    name: 'Hydrogen Gas (¹H₂)',
    koreanName: '경수소 분자 (H₂ - 양성자 1개씩)',
    formula: '¹H₂',
    description: '가장 가벼운 수소 동위원소 이원자 분자로, 전자의 보른-오펜하이머(Born-Oppenheimer) 퍼텐셜 우물 상단에 위치하여 가장 큰 영점 진동(ZPE)을 갖습니다.',
    bondingType: '공유 결합 (Covalent σ-bond)',
    nuclearMassTotalAmu: 2.016,
    reducedMassAmu: 0.5039,
    vibrationalFrequencyCm1: 4401.2,
    zeroPointEnergyKjMol: 26.32, // 0.273 eV
    dissociationEnergyEv: 4.476, // D0 = De - ZPE
    meanBondLengthAngstrom: 0.7414,
    meltingPointCelsius: -259.2,
    quantumMechanicsSummary: '환산 질량(mu = 0.5039 amu)이 가장 작아 기본 진동수 nu_0 = 4,401 cm^-1로 가장 높습니다. 비조화(Anharmonic) 진동 폭이 커서 평균 결합 길이(0.7414 Å)가 동위원소 중 가장 깁니다.',
    atoms: [
      { id: 0, symbol: 'H', x: -0.3707, y: 0.0, z: 0.0, charge: 0.0, hybridization: 's' },
      { id: 1, symbol: 'H', x: 0.3707, y: 0.0, z: 0.0, charge: 0.0, hybridization: 's' }
    ],
    bonds: [{ atom1: 0, atom2: 1, order: 1 }],
    quantumProperties: {
      groundStateEnergy: -1.1744,
      vqeIterations: 18,
      fidelityScore: 0.999,
      homoEnergy: -13.6,
      lumoEnergy: 2.2,
      homoLumoGap: 15.8,
      dipoleMoment: 0.0,
      qubitsRequired: 2,
      pauliTermsCount: 15,
      quantumAdvantageMetric: 'H2 양자 2-큐비트 엄밀 해 VQE 바닥상태'
    }
  },
  {
    id: 'deuterium-d2',
    name: 'Deuterium Gas (²D₂)',
    koreanName: '중수소 분자 (D₂ - 양성자 1 + 중성자 1)',
    formula: '²D₂',
    description: '핵 내에 중성자 1개가 추가된 안정한 수소 동위원소 이원자 분자로, 원자핵 질량이 2배(2.014 amu)가 되어 진동 파수가 1/√2 비율로 감소합니다.',
    bondingType: '공유 결합 (Covalent σ-bond)',
    nuclearMassTotalAmu: 4.028,
    reducedMassAmu: 1.0070,
    vibrationalFrequencyCm1: 3115.5, // 4401.2 / sqrt(2) ≈ 3112
    zeroPointEnergyKjMol: 18.63, // 0.193 eV
    dissociationEnergyEv: 4.556, // D0 is higher because ZPE is lower
    meanBondLengthAngstrom: 0.7410,
    meltingPointCelsius: -254.4,
    quantumMechanicsSummary: '환산 질량(mu = 1.007 amu)이 약 2배로 증가하여 진동수 nu_0가 3,115.5 cm^-1로 줄어들고 ZPE가 18.63 kJ/mol로 29% 감소합니다. 바닥 상태 에너지가 우물 더 깊은 곳에 놓이므로 결합 해리 에너지 D0가 4.556 eV로 H₂보다 강합니다 (운동학적 동위원소 효과 KIE의 원인).',
    atoms: [
      { id: 0, symbol: 'H', x: -0.3705, y: 0.0, z: 0.0, charge: 0.0, hybridization: 's' },
      { id: 1, symbol: 'H', x: 0.3705, y: 0.0, z: 0.0, charge: 0.0, hybridization: 's' }
    ],
    bonds: [{ atom1: 0, atom2: 1, order: 1 }],
    quantumProperties: {
      groundStateEnergy: -1.1824,
      vqeIterations: 20,
      fidelityScore: 0.999,
      homoEnergy: -13.6,
      lumoEnergy: 2.2,
      homoLumoGap: 15.8,
      dipoleMoment: 0.0,
      qubitsRequired: 2,
      pauliTermsCount: 15,
      quantumAdvantageMetric: 'D2 동위원소 환산질량 보정 VQE 계산'
    }
  },
  {
    id: 'tritium-t2',
    name: 'Tritium Gas (³T₂)',
    koreanName: '삼중수소 분자 (T₂ - 양성자 1 + 중성자 2)',
    formula: '³T₂',
    description: '원자핵에 양성자 1개와 중성자 2개를 지닌 방사성 동위원소(반감기 12.32년, 저에너지 베타선 18.6 keV 방출) 분자로, 가장 무거운 수소 동소체입니다.',
    bondingType: '공유 결합 (Covalent σ-bond)',
    nuclearMassTotalAmu: 6.032,
    reducedMassAmu: 1.5080,
    vibrationalFrequencyCm1: 2546.5, // 4401.2 / sqrt(3) ≈ 2541
    zeroPointEnergyKjMol: 15.23, // 0.158 eV
    dissociationEnergyEv: 4.591, // highest dissociation energy
    meanBondLengthAngstrom: 0.7408,
    meltingPointCelsius: -252.5,
    quantumMechanicsSummary: '환산 질량(mu = 1.508 amu)이 경수소 대비 약 3배에 달하여 진동수가 2,546.5 cm^-1로 가장 낮습니다. 영점 진동 에너지(ZPE = 15.23 kJ/mol)가 가장 작아 분자 결합 해리 에너지가 4.591 eV로 가장 높으며, 평균 결합 길이(0.7408 Å)가 가장 짧고 견고합니다.',
    atoms: [
      { id: 0, symbol: 'H', x: -0.3704, y: 0.0, z: 0.0, charge: 0.0, hybridization: 's' },
      { id: 1, symbol: 'H', x: 0.3704, y: 0.0, z: 0.0, charge: 0.0, hybridization: 's' }
    ],
    bonds: [{ atom1: 0, atom2: 1, order: 1 }],
    quantumProperties: {
      groundStateEnergy: -1.1859,
      vqeIterations: 22,
      fidelityScore: 0.999,
      homoEnergy: -13.6,
      lumoEnergy: 2.2,
      homoLumoGap: 15.8,
      dipoleMoment: 0.0,
      qubitsRequired: 2,
      pauliTermsCount: 15,
      quantumAdvantageMetric: 'T2 삼중수소 3핵자 양자 질량 재규격화'
    }
  }
];
