import { Molecule } from '../types/quantum';

export const PRESET_MOLECULES: Molecule[] = [
  {
    id: 'mol-water',
    name: 'Water (H2O)',
    commonName: '물 분자 (VQE 벤치마크)',
    formula: 'H2O',
    smiles: 'O',
    description: '양자 화학 계산의 표준 벤치마크 시스템입니다. 비공유 전자쌍 2개와 O-H 시그마 결합으로 이루어진 104.5도 굽은형 분자 구조를 가집니다.',
    quantumRationale: 'STO-3G 기저함수 기준 14개 스핀-오비탈을 Jordan-Wigner 변환하여 4개 큐비트로 테이퍼링(tapering) 축소 시뮬레이션이 가능합니다. VQE 바닥상태 에너지 수렴 정밀도가 높습니다.',
    atoms: [
      { id: 0, symbol: 'O', x: 0.000, y: 0.000, z: 0.117, charge: -0.66, hybridization: 'sp3' },
      { id: 1, symbol: 'H', x: 0.000, y: 0.757, z: -0.469, charge: 0.33, hybridization: 's' },
      { id: 2, symbol: 'H', x: 0.000, y: -0.757, z: -0.469, charge: 0.33, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -75.0125,
      vqeIterations: 18,
      fidelityScore: 0.9994,
      homoEnergy: -12.62,
      lumoEnergy: 1.25,
      homoLumoGap: 13.87,
      dipoleMoment: 1.85,
      zeroPointEnergy: 13.2,
      qubitsRequired: 4,
      pauliTermsCount: 14,
      quantumAdvantageMetric: "Full CI 대비 화학적 정확도(<1.6 mHa) 18 스텝 내 달성"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.012,
      generatorFidelity: 0.998,
      valenceValidityRate: 1.0,
      sascore: 1.0,
      qedScore: 0.42,
      logP: -0.07,
      molecularWeight: 18.015,
      hydrogenBondDonors: 2,
      hydrogenBondAcceptors: 1
    },
    suggestedApplications: [
      "양자 회로 오차 완화(Error Mitigation) 표준 검증원",
      "초전도 큐비트 알고리즘 캘리브레이션",
      "용매화 수화 껍질 양자 다체계 시뮬레이션"
    ],
    synthesisRouteSummary: "자연계 풍부 / 수소 및 산소 분자의 직접 산화 반응.",
    quantumCircuitConfig: {
      numQubits: 4,
      depth: 6,
      ansatzType: 'UCCSD',
      parameters: [0.12, -0.45, 0.88, 1.34]
    }
  },
  {
    id: 'mol-lih',
    name: 'Lithium Hydride (LiH)',
    commonName: '수소화 리튬 (양자 이온성 결합)',
    formula: 'LiH',
    smiles: '[LiH]',
    description: '극성 이온 결합을 띤 알칼리 금속 수소화물로, 양자컴퓨터에서 분자 해밀토니안의 강한 상관관계를 시뮬레이션하는 대표 분자입니다.',
    quantumRationale: '코어 전자 동결(Frozen core) 근사를 적용하여 4~6 큐비트 UCCSD 회로로 바닥상태 및 결합 해리 곡선(Potential Energy Surface)을 오차 0.8 mHa 수준으로 구현합니다.',
    atoms: [
      { id: 0, symbol: 'Li', x: 0.000, y: 0.000, z: -0.400, charge: 0.78, hybridization: 's' },
      { id: 1, symbol: 'H', x: 0.000, y: 0.000, z: 1.195, charge: -0.78, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -7.8824,
      vqeIterations: 22,
      fidelityScore: 0.9987,
      homoEnergy: -7.95,
      lumoEnergy: -0.82,
      homoLumoGap: 7.13,
      dipoleMoment: 5.88,
      zeroPointEnergy: 4.1,
      qubitsRequired: 6,
      pauliTermsCount: 42,
      quantumAdvantageMetric: "다전자 섭동 이론(MP2) 대비 전자 재배치 항 정확도 99.2% 유지"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.018,
      generatorFidelity: 0.994,
      valenceValidityRate: 1.0,
      sascore: 1.2,
      qedScore: 0.38,
      logP: -0.35,
      molecularWeight: 7.95,
      hydrogenBondDonors: 0,
      hydrogenBondAcceptors: 1
    },
    suggestedApplications: [
      "고밀도 고체 수소 저장 매체 연구",
      "이차전지 양극재 계면 환원 메커니즘 해석",
      "우주 항공 저온 열차폐 복합체"
    ],
    synthesisRouteSummary: "용융 리튬 금속과 고순도 수소 기체의 600°C 직접 접촉 반응.",
    quantumCircuitConfig: {
      numQubits: 6,
      depth: 8,
      ansatzType: 'RyRz',
      parameters: [0.42, -0.91, 1.12, -0.33, 0.77, 1.55]
    }
  },
  {
    id: 'mol-methane',
    name: 'Methane (CH4)',
    commonName: '메탄 (정사면체 sp3 탄화수소)',
    formula: 'CH4',
    smiles: 'C',
    description: '완전한 정사면체(Td 대칭군) 구조를 가지며, 탄소의 sp3 혼성 궤도함수가 수소 4개와 동등한 시그마 결합을 형성하는 가장 단순한 유기 분자입니다.',
    quantumRationale: '대칭성 기반 큐비트 테이퍼링(Z2 symmetry reduction)을 통해 16 큐비트에서 8 큐비트로 압축 가능하며, 하이젠베르크 교환 상호작용이 균등하게 분산됩니다.',
    atoms: [
      { id: 0, symbol: 'C', x: 0.000, y: 0.000, z: 0.000, charge: -0.48, hybridization: 'sp3' },
      { id: 1, symbol: 'H', x: 0.628, y: 0.628, z: 0.628, charge: 0.12, hybridization: 's' },
      { id: 2, symbol: 'H', x: -0.628, y: -0.628, z: 0.628, charge: 0.12, hybridization: 's' },
      { id: 3, symbol: 'H', x: -0.628, y: 0.628, z: -0.628, charge: 0.12, hybridization: 's' },
      { id: 4, symbol: 'H', x: 0.628, y: -0.628, z: -0.628, charge: 0.12, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -40.2173,
      vqeIterations: 24,
      fidelityScore: 0.9972,
      homoEnergy: -13.12,
      lumoEnergy: 3.45,
      homoLumoGap: 16.57,
      dipoleMoment: 0.00,
      zeroPointEnergy: 27.8,
      qubitsRequired: 8,
      pauliTermsCount: 96,
      quantumAdvantageMetric: "Td 대칭성 궤도 보존 하에서 Hartree-Fock 대비 상관에너지 94% 회수"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.021,
      generatorFidelity: 0.991,
      valenceValidityRate: 1.0,
      sascore: 1.0,
      qedScore: 0.35,
      logP: 1.09,
      molecularWeight: 16.04,
      hydrogenBondDonors: 0,
      hydrogenBondAcceptors: 0
    },
    suggestedApplications: [
      "천연가스 및 C1 가스 촉매 전환 경로 시뮬레이션",
      "탄소 포집 후 합성가스 반응기 설계",
      "온실가스 분해 양자 플라즈마 역학"
    ],
    synthesisRouteSummary: "천연가스 분별 증류 또는 이산화탄소 사바티에(Sabatier) 메탄화 반응.",
    quantumCircuitConfig: {
      numQubits: 8,
      depth: 10,
      ansatzType: 'UCCSD',
      parameters: [0.25, -0.62, 1.45, -0.88, 0.33, 1.15, -0.42, 0.78]
    }
  },
  {
    id: 'mol-benzene',
    name: 'Benzene (C6H6)',
    commonName: '벤젠 (비편재화 파이 전자계)',
    formula: 'C6H6',
    smiles: 'c1ccccc1',
    description: '공명 혼성 구조를 갖는 방향족 탄화수소의 기본 골격입니다. 탄소 6개의 p 오비탈이 환형으로 겹쳐 6개의 비편재화 파이 전자가 양자 얽힘을 구성합니다.',
    quantumRationale: '파이 전자의 강한 정적 상관 효과(Strong Static Correlation)로 인해 고전 DFT로는 밴드갭 오차가 발생하기 쉬우나, VQE의 다체 얽힘 회로가 정확한 공명 에너지를 계산합니다.',
    atoms: [
      { id: 0, symbol: 'C', x: 0.000, y: 1.397, z: 0.000, charge: -0.11, hybridization: 'sp2' },
      { id: 1, symbol: 'C', x: 1.210, y: 0.699, z: 0.000, charge: -0.11, hybridization: 'sp2' },
      { id: 2, symbol: 'C', x: 1.210, y: -0.699, z: 0.000, charge: -0.11, hybridization: 'sp2' },
      { id: 3, symbol: 'C', x: 0.000, y: -1.397, z: 0.000, charge: -0.11, hybridization: 'sp2' },
      { id: 4, symbol: 'C', x: -1.210, y: -0.699, z: 0.000, charge: -0.11, hybridization: 'sp2' },
      { id: 5, symbol: 'C', x: -1.210, y: 0.699, z: 0.000, charge: -0.11, hybridization: 'sp2' },
      { id: 6, symbol: 'H', x: 0.000, y: 2.481, z: 0.000, charge: 0.11, hybridization: 's' },
      { id: 7, symbol: 'H', x: 2.149, y: 1.240, z: 0.000, charge: 0.11, hybridization: 's' },
      { id: 8, symbol: 'H', x: 2.149, y: -1.240, z: 0.000, charge: 0.11, hybridization: 's' },
      { id: 9, symbol: 'H', x: 0.000, y: -2.481, z: 0.000, charge: 0.11, hybridization: 's' },
      { id: 10, symbol: 'H', x: -2.149, y: -1.240, z: 0.000, charge: 0.11, hybridization: 's' },
      { id: 11, symbol: 'H', x: -2.149, y: 1.240, z: 0.000, charge: 0.11, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1.5 },
      { atom1: 1, atom2: 2, order: 1.5 },
      { atom1: 2, atom2: 3, order: 1.5 },
      { atom1: 3, atom2: 4, order: 1.5 },
      { atom1: 4, atom2: 5, order: 1.5 },
      { atom1: 5, atom2: 0, order: 1.5 },
      { atom1: 0, atom2: 6, order: 1 },
      { atom1: 1, atom2: 7, order: 1 },
      { atom1: 2, atom2: 8, order: 1 },
      { atom1: 3, atom2: 9, order: 1 },
      { atom1: 4, atom2: 10, order: 1 },
      { atom1: 5, atom2: 11, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -230.7745,
      vqeIterations: 38,
      fidelityScore: 0.9945,
      homoEnergy: -9.24,
      lumoEnergy: -0.38,
      homoLumoGap: 8.86,
      dipoleMoment: 0.00,
      zeroPointEnergy: 62.4,
      qubitsRequired: 12,
      pauliTermsCount: 384,
      quantumAdvantageMetric: "활성 공간 CAS(6,6) 회로를 12 큐비트 CNOT 격자망으로 3배 이상 압축"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.035,
      generatorFidelity: 0.978,
      valenceValidityRate: 1.0,
      sascore: 1.1,
      qedScore: 0.44,
      logP: 2.13,
      molecularWeight: 78.11,
      hydrogenBondDonors: 0,
      hydrogenBondAcceptors: 0
    },
    suggestedApplications: [
      "방향족 고리 기반 신약 파머코포어(Pharmacophore) 매핑",
      "유기 전자소자(OLED) 전도성 백본 설계",
      "그래핀 양자점 에지 상태 시뮬레이션"
    ],
    synthesisRouteSummary: "석유화학 나프타 접촉 개질 공정 또는 톨루엔 탈알킬화 반응.",
    quantumCircuitConfig: {
      numQubits: 12,
      depth: 16,
      ansatzType: 'StronglyEntangling',
      parameters: [0.15, -0.82, 1.34, -0.41, 0.92, 1.88, -0.63, 0.47, -1.15, 0.69, -0.38, 0.81]
    }
  },
  {
    id: 'mol-caffeine',
    name: 'Caffeine (C8H10N4O2)',
    commonName: '카페인 (퓨린 알칼로이드 리간드)',
    formula: 'C8H10N4O2',
    smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
    description: '중추신경계 아데노신 A2A 수용체 길항제로 작용하는 대표적인 다환성 복소환 화합물입니다. 복합적인 수소결합 수용체 부위를 포함합니다.',
    quantumRationale: '양자 딥러닝 잠재 공간에서 전자 밀도 분포와 정전기 전위(ESP)를 학습하여, 퓨린 고리의 전자 풍부 질소 원자가 타깃 단백질 잔기와 강한 양자 분산력을 형성하도록 모델링되었습니다.',
    atoms: [
      { id: 0, symbol: 'N', x: -1.82, y: -0.32, z: 0.00, charge: -0.25, hybridization: 'sp2' },
      { id: 1, symbol: 'C', x: -0.95, y: -1.35, z: 0.00, charge: 0.45, hybridization: 'sp2' },
      { id: 2, symbol: 'O', x: -1.35, y: -2.51, z: 0.00, charge: -0.45, hybridization: 'sp2' },
      { id: 3, symbol: 'N', x: 0.41, y: -0.98, z: 0.00, charge: -0.28, hybridization: 'sp2' },
      { id: 4, symbol: 'C', x: 0.88, y: 0.31, z: 0.00, charge: 0.42, hybridization: 'sp2' },
      { id: 5, symbol: 'O', x: 2.08, y: 0.58, z: 0.00, charge: -0.42, hybridization: 'sp2' },
      { id: 6, symbol: 'C', x: -0.08, y: 1.38, z: 0.00, charge: 0.12, hybridization: 'sp2' },
      { id: 7, symbol: 'C', x: -1.45, y: 0.98, z: 0.00, charge: 0.18, hybridization: 'sp2' },
      { id: 8, symbol: 'N', x: 0.18, y: 2.71, z: 0.00, charge: -0.32, hybridization: 'sp2' },
      { id: 9, symbol: 'C', x: -0.98, y: 3.12, z: 0.00, charge: 0.22, hybridization: 'sp2' },
      { id: 10, symbol: 'N', x: -1.98, y: 2.12, z: 0.00, charge: -0.29, hybridization: 'sp2' },
      { id: 11, symbol: 'C', x: -3.25, y: -0.65, z: 0.00, charge: -0.15, hybridization: 'sp3' },
      { id: 12, symbol: 'C', x: 1.45, y: -2.01, z: 0.00, charge: -0.15, hybridization: 'sp3' },
      { id: 13, symbol: 'C', x: 1.55, y: 3.25, z: 0.00, charge: -0.15, hybridization: 'sp3' },
      { id: 14, symbol: 'H', x: -1.15, y: 4.18, z: 0.00, charge: 0.15, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 1, atom2: 2, order: 2 },
      { atom1: 1, atom2: 3, order: 1 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 4, atom2: 5, order: 2 },
      { atom1: 4, atom2: 6, order: 1 },
      { atom1: 6, atom2: 7, order: 2 },
      { atom1: 7, atom2: 0, order: 1 },
      { atom1: 6, atom2: 8, order: 1 },
      { atom1: 8, atom2: 9, order: 2 },
      { atom1: 9, atom2: 10, order: 1 },
      { atom1: 10, atom2: 7, order: 1 },
      { atom1: 0, atom2: 11, order: 1 },
      { atom1: 3, atom2: 12, order: 1 },
      { atom1: 8, atom2: 13, order: 1 },
      { atom1: 9, atom2: 14, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -680.5218,
      vqeIterations: 45,
      fidelityScore: 0.981,
      homoEnergy: -6.15,
      lumoEnergy: -1.68,
      homoLumoGap: 4.47,
      dipoleMoment: 3.64,
      zeroPointEnergy: 134.2,
      qubitsRequired: 14,
      pauliTermsCount: 420,
      quantumAdvantageMetric: "다원환 복소환의 이종원자(Heteroatom) 결합 에너지 편차 1.2% 이내 억제"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.038,
      generatorFidelity: 0.972,
      valenceValidityRate: 1.0,
      sascore: 2.1,
      qedScore: 0.65,
      logP: -0.07,
      molecularWeight: 194.19,
      hydrogenBondDonors: 0,
      hydrogenBondAcceptors: 3
    },
    suggestedApplications: [
      "A2A 수용체 선택적 저해제 유도체 합성",
      "양자 결합 친화도 QSAR 모델 훈련 데이터셋",
      "인지기능 개선 신경전달물질 증폭제 개발"
    ],
    synthesisRouteSummary: "다이메틸요소(Dimethylurea)와 에틸 시아노아세테이트의 트라우베(Traube) 퓨린 합성.",
    quantumCircuitConfig: {
      numQubits: 14,
      depth: 20,
      ansatzType: 'UCCSD',
      parameters: [0.35, -1.1, 0.44, 1.89, -0.66, 0.92, -1.4, 0.77, 0.21, -0.54, 1.15, -0.98, 0.38, -0.19]
    }
  },
  {
    id: 'mol-q-novel-1',
    name: 'Q-NeuroProtect-B7',
    commonName: '양자 최적화 신경보호 아릴피라졸 (AI/양자 생성)',
    formula: 'C11H12FN3O',
    smiles: 'CC1=CC(=NN1C2=CC=C(C=C2)F)C(=O)N',
    description: '양자 변분 생성기(QVAE-Ansatz)를 통해 혈뇌장벽(BBB) 투과율과 미세아교세포 염증 수용체 친화도를 동시 극대화하도록 탐색된 신규 저분자 화합물입니다.',
    quantumRationale: 'UCCSD 8-큐비트 회로에서 해밀토니안 고유에너지가 -482.193 Ha로 최저 안정점에 수렴하였으며, 불소(F) 치환기의 강한 전기음성도에 의한 국소 쌍극자 모멘트(3.18 D)가 수소결합 포켓을 유도합니다.',
    isGenerated: true,
    atoms: [
      { id: 0, symbol: 'C', x: 0.00, y: 0.00, z: 0.00, charge: 0.12, hybridization: 'sp2' },
      { id: 1, symbol: 'C', x: 1.34, y: 0.22, z: 0.05, charge: -0.08, hybridization: 'sp2' },
      { id: 2, symbol: 'C', x: 1.82, y: 1.54, z: -0.04, charge: 0.24, hybridization: 'sp2' },
      { id: 3, symbol: 'N', x: 0.78, y: 2.29, z: -0.15, charge: -0.28, hybridization: 'sp2' },
      { id: 4, symbol: 'N', x: -0.32, y: 1.38, z: -0.12, charge: -0.18, hybridization: 'sp2' },
      { id: 5, symbol: 'C', x: -1.71, y: 1.76, z: -0.18, charge: 0.15, hybridization: 'sp2' },
      { id: 6, symbol: 'C', x: -2.31, y: 2.34, z: 0.95, charge: -0.05, hybridization: 'sp2' },
      { id: 7, symbol: 'C', x: -3.68, y: 2.62, z: 0.89, charge: -0.02, hybridization: 'sp2' },
      { id: 8, symbol: 'C', x: -4.43, y: 2.34, z: -0.26, charge: 0.35, hybridization: 'sp2' },
      { id: 9, symbol: 'F', x: -5.76, y: 2.62, z: -0.32, charge: -0.32, hybridization: 'sp' },
      { id: 10, symbol: 'C', x: -3.85, y: 1.77, z: -1.39, charge: -0.04, hybridization: 'sp2' },
      { id: 11, symbol: 'C', x: -2.48, y: 1.48, z: -1.36, charge: -0.05, hybridization: 'sp2' },
      { id: 12, symbol: 'C', x: 3.25, y: 2.01, z: -0.01, charge: 0.48, hybridization: 'sp2' },
      { id: 13, symbol: 'O', x: 4.16, y: 1.25, z: 0.21, charge: -0.42, hybridization: 'sp2' },
      { id: 14, symbol: 'N', x: 3.48, y: 3.32, z: -0.27, charge: -0.38, hybridization: 'sp2' },
      { id: 15, symbol: 'C', x: -0.84, y: -1.22, z: 0.12, charge: -0.15, hybridization: 'sp3' },
      { id: 16, symbol: 'H', x: 1.95, y: -0.66, z: 0.19, charge: 0.08, hybridization: 's' },
      { id: 17, symbol: 'H', x: -1.72, y: 2.57, z: 1.84, charge: 0.09, hybridization: 's' },
      { id: 18, symbol: 'H', x: -4.13, y: 3.07, z: 1.76, charge: 0.08, hybridization: 's' },
      { id: 19, symbol: 'H', x: -4.43, y: 1.55, z: -2.28, charge: 0.08, hybridization: 's' },
      { id: 20, symbol: 'H', x: -2.02, y: 1.04, z: -2.23, charge: 0.08, hybridization: 's' },
      { id: 21, symbol: 'H', x: 4.43, y: 3.65, z: -0.25, charge: 0.15, hybridization: 's' },
      { id: 22, symbol: 'H', x: 2.75, y: 3.96, z: -0.48, charge: 0.14, hybridization: 's' },
      { id: 23, symbol: 'H', x: -1.90, y: -0.96, z: 0.08, charge: 0.05, hybridization: 's' },
      { id: 24, symbol: 'H', x: -0.63, y: -1.94, z: -0.67, charge: 0.05, hybridization: 's' },
      { id: 25, symbol: 'H', x: -0.67, y: -1.72, z: 1.07, charge: 0.05, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1.5 },
      { atom1: 1, atom2: 2, order: 1.5 },
      { atom1: 2, atom2: 3, order: 1.5 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 4, atom2: 0, order: 1.5 },
      { atom1: 4, atom2: 5, order: 1 },
      { atom1: 5, atom2: 6, order: 1.5 },
      { atom1: 6, atom2: 7, order: 1.5 },
      { atom1: 7, atom2: 8, order: 1.5 },
      { atom1: 8, atom2: 9, order: 1 },
      { atom1: 8, atom2: 10, order: 1.5 },
      { atom1: 10, atom2: 11, order: 1.5 },
      { atom1: 11, atom2: 5, order: 1.5 },
      { atom1: 2, atom2: 12, order: 1 },
      { atom1: 12, atom2: 13, order: 2 },
      { atom1: 12, atom2: 14, order: 1 },
      { atom1: 0, atom2: 15, order: 1 },
      { atom1: 1, atom2: 16, order: 1 },
      { atom1: 6, atom2: 17, order: 1 },
      { atom1: 7, atom2: 18, order: 1 },
      { atom1: 10, atom2: 19, order: 1 },
      { atom1: 11, atom2: 20, order: 1 },
      { atom1: 14, atom2: 21, order: 1 },
      { atom1: 14, atom2: 22, order: 1 },
      { atom1: 15, atom2: 23, order: 1 },
      { atom1: 15, atom2: 24, order: 1 },
      { atom1: 15, atom2: 25, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -482.1934,
      vqeIterations: 42,
      fidelityScore: 0.984,
      homoEnergy: -6.42,
      lumoEnergy: -1.78,
      homoLumoGap: 4.64,
      dipoleMoment: 3.18,
      zeroPointEnergy: 124.6,
      qubitsRequired: 8,
      pauliTermsCount: 164,
      quantumAdvantageMetric: "O(log N) 회로 깊이로 고전 FCI 연산 대비 85% 시간 단축"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.042,
      generatorFidelity: 0.967,
      valenceValidityRate: 0.998,
      sascore: 2.34,
      qedScore: 0.88,
      logP: 1.62,
      molecularWeight: 221.23,
      hydrogenBondDonors: 1,
      hydrogenBondAcceptors: 3
    },
    suggestedApplications: [
      "알츠하이머 타우 단백질 응집 저해 후보 물질",
      "중추신경계(CNS) 투과 표적 치료제 리간드",
      "자가면역성 뇌염 미세아교세포 조절 인자"
    ],
    synthesisRouteSummary: "4-플루오로페닐히드라진과 에틸 아세토아세테이트의 고리화 축합 후 카르복사미드 아민화 반응(원팟 2단계 수율 78%).",
    quantumCircuitConfig: {
      numQubits: 8,
      depth: 14,
      ansatzType: 'UCCSD',
      parameters: [0.34, -1.22, 0.78, 2.11, -0.45, 1.89, -0.67, 0.15]
    }
  }
];
