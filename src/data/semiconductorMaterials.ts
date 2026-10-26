import { SemiconductorMaterial } from '../types/quantum';

export const PRESET_SEMICONDUCTOR_MATERIALS: SemiconductorMaterial[] = [
  {
    id: 'semi-2d-mowses',
    name: 'Q-2D-MoWSeS-1nm',
    koreanName: '초미세 1nm 서브 게이트 2차원 이종 전이금속 디칼코게나이드 채널',
    archetype: '2d-sub1nm-tmd',
    formula: 'MoWSe2S2',
    smiles: '[Mo]12(=[S])=[Se]3[W]1(=[S])=[Se]23',
    description: '실리콘 채널이 3nm 이하에서 겪는 드레인 유도 장벽 감소(DIBL) 및 양자 터널링 누설 전류를 0.65nm 원자층 두께의 2차원 양자 구속 효과로 완전 극복한 차세대 초저전력 로직 반도체 채널입니다.',
    referenceAnalogy: {
      name: '단층 이황화몰리브덴 (MoS2 Monolayer)',
      formula: 'MoS2',
      smiles: '[S]=[Mo]=[S]',
      structuralAnalogyReason: '단층 육방정계(Hexagonal 2H상)의 D3h 대칭성과 원자 두께(0.65nm)의 2차원 샌드위치 격자를 기준 스캐폴드로 참조함. 완벽한 댕글링 본드(Dangling Bond) 제로 표면 특성 유지.',
      structuralModifications: [
        '몰리브덴(Mo) 자리에 텅스텐(W)을 원자 단위로 교대 치환하여 밸리(Valley) 스핀 분극 유도',
        '황(S)과 셀레늄(Se)의 Janus 비대칭 계면을 형성하여 수직 고유 전기장(Built-in Dipole) 형성',
        '서브볼츠만(Sub-Boltzmann) 경사도(SS = 52 mV/dec)를 달성하는 상온 음의 정전용량(NC-FET) 적합 채널 구성'
      ],
      homologyScore: 0.91
    },
    bandgapEV: 1.82,
    bandgapType: 'Direct',
    electronMobility: 3850,
    holeMobility: 1420,
    effectiveMassElectron: 0.18,
    breakdownFieldMVcm: 4.8,
    dielectricConstant: 8.5,
    baligaFOM: 820,
    subthresholdSwingMVdec: 52.4,
    onOffRatio: '10^8',
    quantumAdvantageMechanism: '0.65nm 극박 원자층 내 2차원 양자 구속(2D Quantum Confinement) 효과로 게이트 전계 차폐율을 98%까지 극대화하여 1nm 게이트 길이에서도 단채널 효과(Short-Channel Effect)가 원천 배제됨.',
    atoms: [
      { id: 0, symbol: 'Mo', x: 0.00, y: 0.00, z: 0.00, charge: 0.48, hybridization: 'd' },
      { id: 1, symbol: 'W', x: 3.16, y: 0.00, z: 0.00, charge: 0.52, hybridization: 'd' },
      { id: 2, symbol: 'S', x: 1.58, y: 0.91, z: 1.56, charge: -0.25, hybridization: 'sp3' },
      { id: 3, symbol: 'S', x: -1.58, y: 0.91, z: 1.56, charge: -0.25, hybridization: 'sp3' },
      { id: 4, symbol: 'Se', x: 1.58, y: 0.91, z: -1.68, charge: -0.25, hybridization: 'sp3' },
      { id: 5, symbol: 'Se', x: -1.58, y: 0.91, z: -1.68, charge: -0.25, hybridization: 'sp3' },
      { id: 6, symbol: 'Mo', x: 1.58, y: 2.74, z: 0.00, charge: 0.48, hybridization: 'd' },
      { id: 7, symbol: 'W', x: 4.74, y: 2.74, z: 0.00, charge: 0.52, hybridization: 'd' },
      { id: 8, symbol: 'S', x: 3.16, y: 1.83, z: 1.56, charge: -0.25, hybridization: 'sp3' },
      { id: 9, symbol: 'Se', x: 3.16, y: 1.83, z: -1.68, charge: -0.25, hybridization: 'sp3' }
    ],
    bonds: [
      { atom1: 0, atom2: 2, order: 1.5 },
      { atom1: 0, atom2: 3, order: 1.5 },
      { atom1: 0, atom2: 4, order: 1.5 },
      { atom1: 0, atom2: 5, order: 1.5 },
      { atom1: 1, atom2: 2, order: 1.5 },
      { atom1: 1, atom2: 4, order: 1.5 },
      { atom1: 1, atom2: 8, order: 1.5 },
      { atom1: 1, atom2: 9, order: 1.5 },
      { atom1: 6, atom2: 2, order: 1.5 },
      { atom1: 6, atom2: 4, order: 1.5 },
      { atom1: 6, atom2: 8, order: 1.5 },
      { atom1: 6, atom2: 9, order: 1.5 },
      { atom1: 7, atom2: 8, order: 1.5 },
      { atom1: 7, atom2: 9, order: 1.5 }
    ],
    quantumProperties: {
      groundStateEnergy: -1420.85,
      vqeIterations: 42,
      fidelityScore: 0.994,
      homoEnergy: -5.48,
      lumoEnergy: -3.66,
      homoLumoGap: 1.82,
      dipoleMoment: 1.85,
      zeroPointEnergy: 142.3,
      qubitsRequired: 12,
      pauliTermsCount: 388,
      quantumAdvantageMetric: '2D 원자층 전자-정공 유효 질량 텐서를 VQE 12-큐비트로 99.4% 신뢰도 계산'
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.012,
      generatorFidelity: 0.993,
      valenceValidityRate: 1.0,
      sascore: 2.8,
      qedScore: 0.81,
      logP: -0.12,
      molecularWeight: 494.75
    },
    synthesisProtocol: {
      summary: '초고순도 금속유기화학기상증착(MOCVD)을 활용하여 사파이어 기판 위에 원자층 단위의 MoS2/WSe2 이종 계면을 650°C에서 에피택시 성장시킨 후 저온 ALD로 HfO2 유전체를 통합합니다.',
      precursorReagents: [
        '몰리브덴 헥사카보닐 [Mo(CO)6, 99.999%]',
        '텅스텐 헥사카보닐 [W(CO)6, 99.999%]',
        '디에틸 설파이드 [DES, (C2H5)2S]',
        '디메틸 셀레나이드 [DMSe, (CH3)2Se]',
        '캐리어 가스: 초고순도 수소(H2, 99.9999%) / 아르곤(Ar)'
      ],
      steps: [
        {
          stepNumber: 1,
          title: '사파이어 기판 수소 열처리 및 원자 평탄화',
          temperature: '1,000°C',
          pressure: '100 Torr (H2 분위기)',
          reagents: ['고순도 H2'],
          duration: '30분',
          description: '단결정 c-plane Al2O3 기판을 초고순도 수소 기류 하에서 고온 어닐링하여 표면 유기 오염물을 제거하고 원자 스텝(Atomic step)을 정렬합니다.',
          safetyNote: '수소 가스 누출 센서 및 방폭 인터록 시스템을 작동하십시오.'
        },
        {
          stepNumber: 2,
          title: 'MOCVD 원자층 층상 2차원 에피택시 성장',
          temperature: '650°C',
          pressure: '20 Torr',
          reagents: ['Mo(CO)6', 'W(CO)6', 'DES', 'DMSe'],
          duration: '45분 (성장 속도 0.2 nm/min)',
          description: '전구체 몰비를 정밀 제어(V/VI 비율 = 1:25)하여 댕글링 본드가 없는 대면적 단결정 단층 MoWSeS 박막을 수평 연속성 99.9%로 균일 증착합니다.',
          safetyNote: '배기 가스는 800°C 열 스크러버(Thermal Scrubber)를 거쳐 완전 무해화 처리하십시오.'
        },
        {
          stepNumber: 3,
          title: '원자층증착(ALD) 하이-k 게이트 유전체 계면 패시베이션',
          temperature: '250°C',
          pressure: '1.0 Torr',
          reagents: ['테트라키스(에틸메틸아미도)하프늄(TEMAH)', 'H2O 증기'],
          duration: '1시간 (25 사이클, 2.0nm HfO2)',
          description: '플라즈마 손상 없는 무손상(Damage-free) 열적 ALD 방식으로 2nm HfO2(k=22) 절연막을 계면 트랩 밀도(Dit < 10^11 cm^-2 eV^-1)로 증착합니다.',
          safetyNote: '수분 반응성 전구체 취급 시 아르곤 글로브 박스를 사용하십시오.'
        }
      ],
      safetyControls: '실시간 유독 가스(Se, S 부산물) 가스 감지기 24시간 감시, 자동 차단 밸브(Pneumatic Shutoff).',
      wasteManagement: '미반응 칼코겐 잔여물 활성탄 흡착 필터 회수 후 재활용, 환경 배출 0 ppm.',
      scalabilityTRL: 7,
      estimatedCostPerGram: '약 $35 / 300mm 웨이퍼 배치 공정',
      theoreticalYieldPercent: 94.2
    },
    quantumCircuitConfig: {
      numQubits: 12,
      depth: 22,
      ansatzType: 'StronglyEntangling',
      parameters: [-0.62, 1.45, 0.33, -1.82, 0.74, 2.15, -0.44, 0.88, -1.25, 0.52, 1.65, -0.78]
    }
  },
  {
    id: 'semi-uwbg-gao-diamond',
    name: 'Q-UWBG-Ga2O3-Al',
    koreanName: '초광대역 밴드갭(4.9eV) 알루미늄 도핑 베타-갈륨옥사이드 전력반도체',
    archetype: 'ultra-wide-bandgap',
    formula: '(Al0.2Ga0.8)2O3',
    smiles: '[O]=[Ga]O[Al](=O)O[Ga]=O',
    description: '전기차 파워트레인, 신재생에너지 인버터 및 초고압 전력망에서 10kV 이상의 고전압을 무손실로 스위칭하는 발리가 성능 지수(Baliga FOM) 3,450의 극한 전력반도체입니다.',
    referenceAnalogy: {
      name: '베타 갈륨 옥사이드 (β-Ga2O3)',
      formula: 'Ga2O3',
      smiles: 'O=[Ga]O[Ga]=O',
      structuralAnalogyReason: '단사정계(Monoclinic C2/m) 결정 대칭과 4.8 eV의 광대역 밴드갭을 기준 스캐폴드로 참조함. 용융법(Melt-growth) 대구경 웨이퍼 양산 적합성.',
      structuralModifications: [
        '팔면체 Ga(II) 사이트에 알루미늄(Al) 20%를 등전위 치환하여 밴드갭을 4.95 eV로 확장',
        '절연 파괴 전계(Breakdown Field)를 8.5 MV/cm로 증폭시켜 초고압 스위칭 손실 92% 절감',
        '실리콘 대비 전력 효율 3,450배(Baliga FOM) 달성'
      ],
      homologyScore: 0.93
    },
    bandgapEV: 4.95,
    bandgapType: 'Direct',
    electronMobility: 480,
    holeMobility: 45,
    effectiveMassElectron: 0.28,
    breakdownFieldMVcm: 8.5,
    dielectricConstant: 10.2,
    baligaFOM: 3450,
    subthresholdSwingMVdec: 58.0,
    onOffRatio: '10^10',
    quantumAdvantageMechanism: '4.95 eV의 초광대역 양자 에너지 장벽으로 인해 고온(350°C) 및 8.5 MV/cm의 극한 전계에서도 열적 충격 전리(Impact Ionization)와 눈사태 항복(Avalanche Breakdown)을 물리적으로 차단함.',
    atoms: [
      { id: 0, symbol: 'Ga', x: 0.00, y: 0.00, z: 0.00, charge: 0.85, hybridization: 'sp3' },
      { id: 1, symbol: 'Al', x: 1.95, y: 0.00, z: 0.00, charge: 0.88, hybridization: 'sp3' },
      { id: 2, symbol: 'O', x: 0.98, y: 1.65, z: 0.00, charge: -0.58, hybridization: 'sp2' },
      { id: 3, symbol: 'O', x: -0.98, y: 1.65, z: 0.00, charge: -0.58, hybridization: 'sp2' },
      { id: 4, symbol: 'Ga', x: 0.00, y: 3.30, z: 0.00, charge: 0.85, hybridization: 'sp3' },
      { id: 5, symbol: 'O', x: 2.93, y: 1.65, z: 0.00, charge: -0.58, hybridization: 'sp2' }
    ],
    bonds: [
      { atom1: 0, atom2: 2, order: 1.5 },
      { atom1: 0, atom2: 3, order: 1.5 },
      { atom1: 1, atom2: 2, order: 1.5 },
      { atom1: 1, atom2: 5, order: 1.5 },
      { atom1: 4, atom2: 2, order: 1.5 },
      { atom1: 4, atom2: 3, order: 1.5 }
    ],
    quantumProperties: {
      groundStateEnergy: -2180.45,
      vqeIterations: 38,
      fidelityScore: 0.996,
      homoEnergy: -8.12,
      lumoEnergy: -3.17,
      homoLumoGap: 4.95,
      dipoleMoment: 2.45,
      zeroPointEnergy: 188.0,
      qubitsRequired: 14,
      pauliTermsCount: 442,
      quantumAdvantageMetric: '4.95 eV 광대역 밴드갭 결함 준위 포논 방출 확률을 VQE로 정밀 해석'
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.010,
      generatorFidelity: 0.995,
      valenceValidityRate: 1.0,
      sascore: 2.2,
      qedScore: 0.84,
      logP: -0.85,
      molecularWeight: 202.82
    },
    synthesisProtocol: {
      summary: 'HVPE(수소화물 기상 에피택시) 및 에어로졸 화학기상증착으로 (010) 동종 단결정 β-Ga2O3 기판 위에 1,050°C에서 Al 치환 단결정 에피택시 층을 고속(5 μm/h) 성장시킵니다.',
      precursorReagents: [
        '고순도 갈륨 메탈 [Ga, 99.9999%]',
        '무수 염화수소 가스 [HCl, 99.999%]',
        '트리메틸알루미늄 [TMA, Al(CH3)3]',
        '초고순도 산소 가스 [O2, 99.9999%]'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'HVPE 인-시튜 GaCl 전구체 합성 및 기판 가열',
          temperature: '850°C (Ga 소스 영역) / 1,050°C (성장 영역)',
          pressure: '760 Torr (대기압 질소 기류)',
          reagents: ['Ga 메탈', 'HCl 가스'],
          duration: '30분',
          description: '용융 갈륨 금속에 HCl 가스를 통과시켜 GaCl 가스를 합성하여 성장 챔버로 이송합니다.',
          safetyNote: '고온 염화수소 가스 배관 부식 방지를 위해 하스텔로이 합금을 적용하십시오.'
        },
        {
          stepNumber: 2,
          title: '고속 에피택시 및 알루미늄 양자 밴드갭 튜닝',
          temperature: '1,050°C',
          pressure: '760 Torr',
          reagents: ['GaCl', 'TMA', 'O2'],
          duration: '2시간 (성장 두께 10 μm)',
          description: 'TMA 유량을 미세 조정하여 Al 20%의 균일 조성을 유지하면서 절연 파괴 전압 10 kV급의 고내압 드리프트 층을 성장시킵니다.',
          safetyNote: '발화성 TMA 전구체의 급격한 산소 접촉을 방지하기 위해 듀얼 노즐 구조를 유지하십시오.'
        },
        {
          stepNumber: 3,
          title: '산소 결함 보상 고온 어닐링 공정',
          temperature: '900°C',
          pressure: '1.0 atm (순산소 분위기)',
          reagents: ['O2 (99.9999%)'],
          duration: '1시간',
          description: '성장 중 발생한 미세 산소 공공(Oxygen Vacancy)을 완전히 충진하여 누설 전류를 10^-12 A/cm^2 이하로 낮춥니다.',
          safetyNote: '급랭 시 열 충격 균열을 방지하기 위해 5°C/min 속도로 서냉하십시오.'
        }
      ],
      safetyControls: '고온 수소/산소 분리 공급 라인, 산소 결핍 경보기, 누출 시 자동 질소 퍼지.',
      wasteManagement: '반응 부산물 HCl은 습식 중화 스크러버에서 무해화 염화나트륨으로 전환.',
      scalabilityTRL: 6,
      estimatedCostPerGram: '약 $22 / cm^2',
      theoreticalYieldPercent: 91.5
    },
    quantumCircuitConfig: {
      numQubits: 14,
      depth: 26,
      ansatzType: 'UCCSD',
      parameters: [-0.38, 1.18, 0.92, -1.05, 0.48, 2.05, -0.28, 0.82, -1.35, 0.58, 1.72, -0.88, 0.45, -1.12]
    }
  },
  {
    id: 'semi-high-mobility-insb',
    name: 'Q-HighMobility-InSbAs',
    koreanName: '초저유효질량(0.015m0) 78,000cm²/Vs 테라헤르츠 양자우물 채널',
    archetype: 'high-mobility-fermi',
    formula: 'InSb0.85As0.15',
    smiles: '[In]#[Sb].[In]#[As]',
    description: '실리콘 대비 50배 이상의 전자 이동도(78,000 cm²/V·s)를 실현하여 0.3V 이하의 초저전압에서도 테라헤르츠(THz)급 고속 연산을 수행하는 6G 통신 및 양자 인터페이스 반도체입니다.',
    referenceAnalogy: {
      name: '인듐 안티모나이드 (InSb 징크블렌드)',
      formula: 'InSb',
      smiles: '[In]#[Sb]',
      structuralAnalogyReason: '입방 섬유아연석(Zincblende F-43m) 격자에서 가장 작은 전도대 전자 유효 질량(m* = 0.014 m0)과 높은 페르미 속도를 기준 스캐폴드로 참조함.',
      structuralModifications: [
        '안티몬(Sb) 자리에 비소(As) 15%를 도핑하여 격자 상수를 GaAs 기판과 99.2% 정합되도록 변형',
        'AlInSb 장벽층을 이용한 양자우물(Quantum Well) 구조로 2차원 전자가스(2DEG) 형성',
        '실온 전자 이동도를 78,000 cm²/V·s로 극대화하여 300 GHz 이상 초고주파 통신 실현'
      ],
      homologyScore: 0.89
    },
    bandgapEV: 0.42,
    bandgapType: 'Direct',
    electronMobility: 78500,
    holeMobility: 1250,
    effectiveMassElectron: 0.015,
    breakdownFieldMVcm: 0.25,
    dielectricConstant: 16.8,
    baligaFOM: 140,
    subthresholdSwingMVdec: 56.5,
    onOffRatio: '10^6',
    quantumAdvantageMechanism: '극도로 가벼운 유효 질량(0.015 m0)에 의한 비포논 탄도 전도(Ballistic Transport)로 전자 비행 시간이 100 펨토초(fs) 이하로 단축됨.',
    atoms: [
      { id: 0, symbol: 'In', x: 0.00, y: 0.00, z: 0.00, charge: 0.42, hybridization: 'sp3' },
      { id: 1, symbol: 'Sb', x: 1.62, y: 1.62, z: 1.62, charge: -0.38, hybridization: 'sp3' },
      { id: 2, symbol: 'In', x: 3.24, y: 3.24, z: 0.00, charge: 0.42, hybridization: 'sp3' },
      { id: 3, symbol: 'As', x: 4.86, y: 4.86, z: 1.62, charge: -0.45, hybridization: 'sp3' },
      { id: 4, symbol: 'In', x: 0.00, y: 3.24, z: 3.24, charge: 0.42, hybridization: 'sp3' },
      { id: 5, symbol: 'Sb', x: 1.62, y: 4.86, z: 4.86, charge: -0.38, hybridization: 'sp3' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 1 },
      { atom1: 1, atom2: 4, order: 1 },
      { atom1: 4, atom2: 5, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -3850.12,
      vqeIterations: 45,
      fidelityScore: 0.991,
      homoEnergy: -4.85,
      lumoEnergy: -4.43,
      homoLumoGap: 0.42,
      dipoleMoment: 0.95,
      zeroPointEnergy: 95.2,
      qubitsRequired: 10,
      pauliTermsCount: 312,
      quantumAdvantageMetric: '초저유효질량 준입자 페르미 속도를 10-큐비트 VQE로 정밀 모델링'
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.018,
      generatorFidelity: 0.991,
      valenceValidityRate: 1.0,
      sascore: 3.1,
      qedScore: 0.75,
      logP: -0.22,
      molecularWeight: 348.65
    },
    synthesisProtocol: {
      summary: '초고진공 분자선에피택시(MBE, 10^-11 Torr) 장비에서 GaAs 기판에 격자 완화 AlInSb 계단식 완충층을 형성한 후 15nm 두께의 InSbAs 양자우물을 성장시킵니다.',
      precursorReagents: [
        '초고순도 인듐 고체 소스 [In, 99.99999%]',
        '고순도 안티몬 발할 소스 [Sb, 99.99999%]',
        '열분해 비소 소스 [As4 cracker, 99.99999%]',
        'Al 고체 삼출 셀 [Effusion cell]'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'GaAs 기판 초고진공 탈산소화 및 스텝 버퍼 에피택시',
          temperature: '580°C → 420°C',
          pressure: '10^-10 Torr',
          reagents: ['As 플럭스'],
          duration: '40분',
          description: '기판 산화막을 탈기한 뒤, 14% 격자 불일치를 흡수하는 계단식 AlInSb 변성 완충층(Metamorphic Buffer)을 성장시킵니다.',
          safetyNote: '비소(As) 트랩 냉각수 및 초고진공 안전 센서를 점검하십시오.'
        },
        {
          stepNumber: 2,
          title: '15nm 극저결함 InSbAs 2차원 양자우물 채널 성장',
          temperature: '380°C',
          pressure: '5 x 10^-11 Torr',
          reagents: ['In', 'Sb', 'As'],
          duration: '25분',
          description: '원자적으로 평탄한 계면 거칠기(Ra < 0.2 nm)를 유지하며 양자우물 채널을 원자층 단위로 정밀 적층합니다.',
          safetyNote: 'RHEED(반사고에너지전자회절) 모니터로 실시간 표면 재구성(2x4)을 확인하십시오.'
        },
        {
          stepNumber: 3,
          title: '원격 Si 델타 도핑(Delta-doping) 및 캐핑층 형성',
          temperature: '350°C',
          pressure: '10^-11 Torr',
          reagents: ['Si 원자빔', 'InSb 캐핑'],
          duration: '15분',
          description: '채널과 10nm 떨어진 스페이서 층에 실리콘 원자층을 도핑하여 불순물 산란 없는 고밀도(2DEG = 1.2 x 10^12 cm^-2) 전자를 공급합니다.',
          safetyNote: '초고진공 챔버 개방 금지, 인-시튜 액체질소 셔터 냉각 유지.'
        }
      ],
      safetyControls: '원격 독성 모니터링 시스템, 비소 증착 트랩 분기 배출 차단 밸브.',
      wasteManagement: '고체 비소/안티몬 잔여물 진공 크라이오트랩 전량 수거 및 전문 리사이클링.',
      scalabilityTRL: 6,
      estimatedCostPerGram: '약 $45 / 웨이퍼',
      theoreticalYieldPercent: 89.0
    },
    quantumCircuitConfig: {
      numQubits: 10,
      depth: 20,
      ansatzType: 'RyRz',
      parameters: [-0.55, 1.32, 0.42, -1.65, 0.65, 2.22, -0.35, 0.95, -1.15, 0.48]
    }
  },
  {
    id: 'semi-topological-wte2',
    name: 'Q-Topological-WTe2-QSH',
    koreanName: '위상 절연체 양자 스핀 홀 무손실 탄도 전도 채널',
    archetype: 'topological-spintronic',
    formula: 'WTe2',
    smiles: '[Te]=[W]=[Te]',
    description: '스핀-궤도 결합(SOC)과 위상학적 비자명(Topological Non-trivial) 밴드 반전을 통해 내부(Bulk)는 절연체이면서 모서리(Edge)에서는 줄열(Joule heating) 손실이 0인 무손실 스핀 전도를 구현하는 양자 소자 반도체입니다.',
    referenceAnalogy: {
      name: '텅스텐 디텔루라이드 (Td-WTe2)',
      formula: 'WTe2',
      smiles: '[Te]=[W]=[Te]',
      structuralAnalogyReason: '사방정계(Orthorhombic Pmn2_1, Td상) 층상 구조의 강한 스핀-궤도 상호작용 및 바일 반금속(Weyl Semimetal) 특성을 기준 스캐폴드로 참조함.',
      structuralModifications: [
        '단층 한계에서 밴드 반전(Band Inversion)을 고정하여 상온 양자 스핀 홀(QSH) 절연체 상태 유지',
        '스핀 축퇴가 풀린 헬리컬 엣지 상태(Helical Edge States)로 시간 반전 대칭성 보호',
        '양자컴퓨팅 큐비트 판독 및 초저전력 스핀트로닉스 메모리(SOT-MRAM) 핵심 채널 형성'
      ],
      homologyScore: 0.92
    },
    bandgapEV: 0.12,
    bandgapType: 'Direct',
    electronMobility: 12500,
    holeMobility: 11800,
    effectiveMassElectron: 0.12,
    breakdownFieldMVcm: 1.2,
    dielectricConstant: 22.0,
    baligaFOM: 210,
    subthresholdSwingMVdec: 45.0,
    onOffRatio: '10^7',
    quantumAdvantageMechanism: '스핀-운동량 잠금(Spin-Momentum Locking) 현상으로 불순물에 의한 후방 산란(Back-scattering)이 위상학적으로 100% 금지되어 배선 발열이 99% 이상 감소함.',
    atoms: [
      { id: 0, symbol: 'W', x: 0.00, y: 0.00, z: 0.00, charge: 0.55, hybridization: 'd' },
      { id: 1, symbol: 'Te', x: 1.75, y: 1.25, z: 1.85, charge: -0.28, hybridization: 'p' },
      { id: 2, symbol: 'Te', x: -1.75, y: -1.25, z: 1.85, charge: -0.28, hybridization: 'p' },
      { id: 3, symbol: 'W', x: 3.50, y: 0.00, z: 0.00, charge: 0.55, hybridization: 'd' },
      { id: 4, symbol: 'Te', x: 1.75, y: 1.25, z: -1.85, charge: -0.28, hybridization: 'p' },
      { id: 5, symbol: 'Te', x: -1.75, y: -1.25, z: -1.85, charge: -0.28, hybridization: 'p' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 4, order: 1 },
      { atom1: 0, atom2: 5, order: 1 },
      { atom1: 3, atom2: 1, order: 1 },
      { atom1: 3, atom2: 4, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -5210.65,
      vqeIterations: 48,
      fidelityScore: 0.995,
      homoEnergy: -4.56,
      lumoEnergy: -4.44,
      homoLumoGap: 0.12,
      dipoleMoment: 0.65,
      zeroPointEnergy: 82.5,
      qubitsRequired: 14,
      pauliTermsCount: 485,
      quantumAdvantageMetric: '베리 곡률(Berry Curvature) 적분 및 Z2 불변량을 14-큐비트 VQE로 검증'
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.014,
      generatorFidelity: 0.994,
      valenceValidityRate: 1.0,
      sascore: 3.5,
      qedScore: 0.70,
      logP: -0.35,
      molecularWeight: 439.04
    },
    synthesisProtocol: {
      summary: '플럭스 기법(Flux Method) 및 화학기상수송(CVT)을 통해 Te 풍부 분위기에서 800°C 단결정 성장 후 초박막 캡슐화 박리 공정을 진행합니다.',
      precursorReagents: [
        '텅스텐 파우더 [W, 99.999%]',
        '텔루륨 그래뉼 [Te, 99.9999%]',
        '수송제: 요오드 [I2, 99.99%]',
        '질화붕소 [h-BN 단결정 패시베이션 층]'
      ],
      steps: [
        {
          stepNumber: 1,
          title: '석영 앰플 고진공 밀봉 및 고온 화학수송반응',
          temperature: '850°C (소스) → 750°C (성장단)',
          pressure: '10^-6 Torr 밀봉',
          reagents: ['W', 'Te', 'I2'],
          duration: '120시간 서서히 서냉',
          description: '온도 구배 로(Two-zone furnace)에서 증기상 수송을 통해 결함 밀도가 극히 낮은 센티미터급 Td상 WTe2 단결정 플레이크를 포집합니다.',
          safetyNote: '고온 진공 석영관 파열 방지를 위해 이중 진공 보호관을 설치하십시오.'
        },
        {
          stepNumber: 2,
          title: '불활성 아르곤 분위기 기계적 박리 및 h-BN 샌드위치',
          temperature: '25°C',
          pressure: '1.0 atm (H2O, O2 < 0.1 ppm 아르곤 글로브 박스)',
          reagents: ['h-BN 박막', 'PDMS 스탬프'],
          duration: '2시간',
          description: '공기 중 산화에 민감한 단층 WTe2를 건식 전사(Dry transfer) 기법으로 상하 h-BN 단결정 층 사이에 완벽히 밀봉 캡슐화합니다.',
          safetyNote: '글로브박스 내 산소 농도를 0.1 ppm 이하로 엄격히 관리하십시오.'
        },
        {
          stepNumber: 3,
          title: '원자 스핀 소자 전극 패터닝 및 접촉 저항 최소화',
          temperature: '150°C 어닐링',
          pressure: '10^-7 Torr',
          reagents: ['Ti/Au 1D 엣지 컨택트'],
          duration: '30분',
          description: '엣지 상태와의 양자 터널링 결합을 극대화하기 위해 1차원 접촉(1D Edge Contact) 전극을 제작하여 접촉 저항을 100 Ω·μm 이하로 구현합니다.',
          safetyNote: '전자빔 리소그래피 노광 시 과도한 도즈로 인한 엣지 결함을 방지하십시오.'
        }
      ],
      safetyControls: '텔루륨 증기 활성탄 흡착 트랩, 글로브박스 압력 자동 릴리프 밸브.',
      wasteManagement: '미반응 요오드 및 텔루륨 잔여물 화학 침전 수거 및 100% 재순환.',
      scalabilityTRL: 5,
      estimatedCostPerGram: '약 $55 / cm^2',
      theoreticalYieldPercent: 86.4
    },
    quantumCircuitConfig: {
      numQubits: 14,
      depth: 24,
      ansatzType: 'StronglyEntangling',
      parameters: [-0.48, 1.28, 0.75, -1.42, 0.58, 2.18, -0.32, 0.86, -1.28, 0.62, 1.82, -0.92, 0.38, -1.05]
    }
  }
];
