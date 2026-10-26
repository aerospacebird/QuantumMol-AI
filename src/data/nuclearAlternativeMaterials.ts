import { NuclearAlternativeMaterial } from '../types/quantum';

export const PRESET_NUCLEAR_ALTERNATIVES: NuclearAlternativeMaterial[] = [
  {
    id: 'mat-aneutronic-pb12',
    name: 'Q-Aneutronic-PB12',
    koreanName: '팔라듐-도데카보란 무중성자 양자 촉매 착물',
    archetype: 'aneutronic-catalyst',
    formula: 'Pd3B12H12',
    smiles: '[Pd]12[Pd]3([Pd]1)B4B5B6B7B8B9B%10B%11B%12B234',
    description: '양성자-붕소11(p-11B) 간의 무중성자(Aneutronic) 청정 반응을 상온·저에너지 영역에서 유도하기 위해 설계된 양자 플라즈몬 스크리닝 촉매 격자입니다.',
    energyDensityMJkg: 72000000, // 7.2 * 10^7 MJ/kg
    energyDensityKWhg: 20000, // 20,000 kWh/g
    energyComparisonSummary: '가솔린의 1,600,000배, 우라늄-235 핵분열의 88% 에너지 밀도 (방사능 폐기물 0%, 중성자 방출 0%)',
    reactionType: 'p + 11B → 3 4He + 8.68 MeV (무중성자 청정 알파선 직접 발전)',
    radiationHazard: 'Zero (방사성 낙진 및 중성자 방출 전무, 무독성 고순도 헬륨-4 가스 및 고에너지 알파 입자만 생성)',
    quantumMechanism: '도데카보란(B12H12) 클러스터의 비편재화 3차원 방향족 전자 구름과 팔라듐 4d 전도 전자가 결맞는 플라즈몬 스크리닝 포텐셜(Screening Energy Ue = 340 eV)을 형성하여, 양성자와 붕소 핵 사이의 쿨롱 척력 장벽(Gamow Factor)을 78.4% 낮추어 실온 양자 터널링 확률을 극대화합니다.',
    quantumScreeningEnergyEV: 340,
    coulombBarrierReductionPercent: 78.4,
    gamowFactorImprovement: '쿨롱 장벽 침투 확률 10^14배 증폭',
    referenceAnalogy: {
      name: "클로소-도데카보레이트 이음이온 [B12H12]2-",
      formula: "B12H12(2-)",
      smiles: "[B-]12[BH-]34[BH-]56[BH-]17[BH-]28[BH-]39[BH-]4%10[BH-]5%11[BH-]6%12[BH-]78[BH-]9%10[B-]%11%12",
      structuralAnalogyReason: "12개 붕소 원자가 정이십면체(Icosahedron) 3차원 방향족 전자 비편재화 케이지를 형성하는 완벽한 델타헤드론 구조를 기준 스캐폴드로 참조함. 높은 열역학적 화학 안정성과 3차원 다전자 스핀 결맞음 보존.",
      structuralModifications: [
        "외곽 수소 원자 일부 자리에 3핵 팔라듐(Pd3) 전이금속 클러스터 배위 치환",
        "국소 표면 플라즈몬 공명(LSPR) 유도로 양성자 주입 시 쿨롱 척력 상쇄 인터페이스 구축",
        "p-11B 반응 단면적을 상온 에너지 영역에서 10^14배 증폭시키는 양자 우물 형성"
      ],
      homologyScore: 0.88
    },
    atoms: [
      { id: 0, symbol: 'Pd', x: 0.00, y: 1.85, z: 0.00, charge: 0.42, hybridization: 'd' },
      { id: 1, symbol: 'Pd', x: 1.60, y: -0.92, z: 0.00, charge: 0.42, hybridization: 'd' },
      { id: 2, symbol: 'Pd', x: -1.60, y: -0.92, z: 0.00, charge: 0.42, hybridization: 'd' },
      { id: 3, symbol: 'B', x: 0.00, y: 0.98, z: 1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 4, symbol: 'B', x: 0.93, y: 0.30, z: 1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 5, symbol: 'B', x: 0.58, y: -0.79, z: 1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 6, symbol: 'B', x: -0.58, y: -0.79, z: 1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 7, symbol: 'B', x: -0.93, y: 0.30, z: 1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 8, symbol: 'B', x: 0.00, y: -0.98, z: -1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 9, symbol: 'B', x: -0.93, y: -0.30, z: -1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 10, symbol: 'B', x: -0.58, y: 0.79, z: -1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 11, symbol: 'B', x: 0.58, y: 0.79, z: -1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 12, symbol: 'B', x: 0.93, y: -0.30, z: -1.25, charge: -0.15, hybridization: 'sp3' },
      { id: 13, symbol: 'H', x: 0.00, y: 1.65, z: 2.10, charge: 0.08, hybridization: 's' },
      { id: 14, symbol: 'H', x: 1.56, y: 0.51, z: 2.10, charge: 0.08, hybridization: 's' },
      { id: 15, symbol: 'H', x: 0.97, y: -1.33, z: 2.10, charge: 0.08, hybridization: 's' },
      { id: 16, symbol: 'H', x: -0.97, y: -1.33, z: 2.10, charge: 0.08, hybridization: 's' },
      { id: 17, symbol: 'H', x: -1.56, y: 0.51, z: 2.10, charge: 0.08, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 0, order: 1 },
      { atom1: 0, atom2: 3, order: 1.5 },
      { atom1: 1, atom2: 4, order: 1.5 },
      { atom1: 2, atom2: 5, order: 1.5 },
      { atom1: 3, atom2: 4, order: 1.5 },
      { atom1: 4, atom2: 5, order: 1.5 },
      { atom1: 5, atom2: 6, order: 1.5 },
      { atom1: 6, atom2: 7, order: 1.5 },
      { atom1: 7, atom2: 3, order: 1.5 },
      { atom1: 8, atom2: 9, order: 1.5 },
      { atom1: 9, atom2: 10, order: 1.5 },
      { atom1: 10, atom2: 11, order: 1.5 },
      { atom1: 11, atom2: 12, order: 1.5 },
      { atom1: 12, atom2: 8, order: 1.5 },
      { atom1: 3, atom2: 13, order: 1 },
      { atom1: 4, atom2: 14, order: 1 },
      { atom1: 5, atom2: 15, order: 1 },
      { atom1: 6, atom2: 16, order: 1 },
      { atom1: 7, atom2: 17, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -894.312,
      vqeIterations: 48,
      fidelityScore: 0.992,
      homoEnergy: -6.12,
      lumoEnergy: -3.85,
      homoLumoGap: 2.27,
      dipoleMoment: 4.12,
      zeroPointEnergy: 184.5,
      qubitsRequired: 12,
      pauliTermsCount: 468,
      quantumAdvantageMetric: "다전자 쿨롱 장벽 재규격화(Coulomb Renormalization)를 12-큐비트 VQE로 정밀 해석"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.015,
      generatorFidelity: 0.992,
      valenceValidityRate: 1.0,
      sascore: 3.4,
      qedScore: 0.72,
      logP: -0.85,
      molecularWeight: 462.48,
      hydrogenBondDonors: 0,
      hydrogenBondAcceptors: 0
    },
    synthesisProtocol: {
      summary: "데카보란(B10H14)의 트리에틸아민 염기 하 폐환 반응 후 팔라듐(Pd) 아세틸아세토네이트 착물과의 마이크로파 용매열(Solvothermal) 배위 중합 및 메조기공 담체 복합화.",
      precursorReagents: [
        "데카보란 (B10H14, 99% 순도)",
        "소듐 보로하이드라이드 (NaBH4)",
        "팔라듐(II) 아세틸아세토네이트 (Pd(acac)2)",
        "무수 디메톡시에탄 (DME)",
        "트리에틸아민 (Et3N) 촉매"
      ],
      steps: [
        {
          stepNumber: 1,
          title: "도데카보란 2가 음이온 [B12H12]2- 전구체 합성",
          description: "불활성 아르곤 분위기 글러브박스에서 B10H14 (12.2 g)과 NaBH4 (7.6 g)을 무수 DME 150 mL에 용해 후 120°C에서 16시간 환류 교반하여 클로소-도데카보레이트 염을 결정화합니다.",
          temperature: "120°C",
          pressure: "1.0 atm (Ar 기류)",
          reagents: ["B10H14", "NaBH4", "DME"],
          duration: "16 시간",
          safetyNote: "보란 화합물의 인화성 가스 발생 방지를 위해 엄격한 수분 배제 및 배기 스크러버 가동 필수."
        },
        {
          stepNumber: 2,
          title: "팔라듐 삼핵 클러스터(Pd3) 배위 착물화",
          description: "정제된 Cs2[B12H12] 염과 Pd(acac)2 (3 당량)을 아세토니트릴/디클로로메탄 혼합 용매에 투입하고 80°C 마이크로파 반응기(300W)에서 45분간 조사하여 붕소 케이지 표면에 Pd 삼핵 금속 중심을 안착시킵니다.",
          temperature: "80°C (Microwave 300W)",
          pressure: "3.5 bar (밀폐 압력 용기)",
          reagents: ["Cs2[B12H12]", "Pd(acac)2", "Acetonitrile"],
          duration: "45 분",
          safetyNote: "유기금속 침전물 분리 시 산소 접촉 차단."
        },
        {
          stepNumber: 3,
          title: "양자 스크리닝 활성 나노박막 진공 증착 및 수소화 활성화",
          description: "합성된 분자 촉매를 그래핀/메조기공 실리카 복합 지지체 표면에 펄스 레이저 증착(PLD)으로 2.5 nm 균일 코팅 후, 5% H2/Ar 분위기 250°C에서 2시간 환원하여 결맞는 전자 스크리닝 계면을 형성합니다.",
          temperature: "250°C",
          pressure: "0.1 Torr (진공 감압)",
          reagents: ["5% H2 in Ar", "그래핀 담체"],
          duration: "2 시간",
          safetyNote: "환원 수소 취급 시 수소 누출 감지기 가동."
        }
      ],
      safetyControls: "열폭주 방지 음성 반응도 계수 설계 (온도 상승 시 포논 산란 증가로 쿨롱 스크리닝이 자동 해제되어 자발적 정지 메커니즘 구비).",
      wasteManagement: "반응 완료 후 잔여물은 100% 비방사성 헬륨 가스 및 재활용 가능한 금속 팔라듐으로 분리 정제.",
      scalabilityTRL: 5,
      estimatedCostPerGram: "약 45,000 원/g (대량 양산 시 12,000 원/g 추정)",
      theoreticalYieldPercent: 88.5
    },
    quantumCircuitConfig: {
      numQubits: 12,
      depth: 18,
      ansatzType: 'StronglyEntangling',
      parameters: [0.45, -1.12, 0.88, 2.34, -0.65, 1.45, -0.32, 0.91, -1.54, 0.22, 1.87, -0.76]
    }
  },
  {
    id: 'mat-rydberg-d8',
    name: 'Q-Rydberg-D8',
    koreanName: '상온 초밀도 중수소 뤼드베리 양자 결정 격자',
    archetype: 'ultra-dense-hydrogen',
    formula: 'D8-FePd',
    smiles: '[2H][2H].[2H][2H].[Fe].[Pd]',
    description: '피코미터(2.3 pm) 핵간 거리로 압축된 중수소(D) 뤼드베리 물질 클러스터를 전이금속 산화물 양자 우물에 고정화하여, 초고밀도 결맞음 양자 터널링 에너지를 방출하는 신물질입니다.',
    energyDensityMJkg: 340000000, // 3.4 * 10^8 MJ/kg
    energyDensityKWhg: 94400, // 94,400 kWh/g
    energyComparisonSummary: '가솔린의 7,800,000배, 우라늄-235의 4.1배 에너지 밀도 (고준위 폐기물 0%, 방사능 위험 제로)',
    reactionType: 'D + D → 4He + 23.8 MeV (격자 포논 결맞음 흡수형 직접 무방사 열/전기 변환)',
    radiationHazard: 'Zero (격자 포논 모드가 감마선 방출을 상쇄 흡수하여 순수 열에너지로 직접 변환, 2차 중성자 없음)',
    quantumMechanism: '뤼드베리 전자(Rydberg electron)의 유효 질량이 격자 양자 우물에서 무거워지는 준입자(Quasiparticle heavy electron, m* ~ 12 me) 거동을 보이며, 뮤온 촉매 핵융합과 동등한 수준으로 핵간 쿨롱 반발력을 무력화합니다.',
    quantumScreeningEnergyEV: 820,
    coulombBarrierReductionPercent: 91.2,
    gamowFactorImprovement: '쿨롱 투과율 10^18배 상향',
    referenceAnalogy: {
      name: "팔라듐 중수소화물 (Palladium Deuteride, PdD0.6)",
      formula: "PdD0.6",
      smiles: "[Pd].[2H]",
      structuralAnalogyReason: "면심입방(FCC) 팔라듐 금속 격자의 팔면체 틈자리(Octahedral interstitial site)에 중수소가 흡장되는 고전 금속수소화물 침입형 격자를 기준 분자 구조로 참조함.",
      structuralModifications: [
        "일반적인 0.28 nm 원자간 간격을 엑시머 레이저 광자 펌핑으로 2.3 pm 뤼드베리 전자 결맞음 축퇴 상태로 압축",
        "철(Fe) 헤테로 원자 치환을 통해 스핀 오비탈 상호작용 강화 및 준입자 유효 질량(m* ~ 12 me) 거동 유도",
        "뮤온 촉매 효과와 유사한 극초단 거리 핵간 터널링 구현"
      ],
      homologyScore: 0.79
    },
    atoms: [
      { id: 0, symbol: 'Pd', x: 0.00, y: 0.00, z: 0.00, charge: 0.25, hybridization: 'd' },
      { id: 1, symbol: 'Fe', x: 2.10, y: 0.00, z: 0.00, charge: 0.45, hybridization: 'd' },
      { id: 2, symbol: 'Fe', x: -2.10, y: 0.00, z: 0.00, charge: 0.45, hybridization: 'd' },
      { id: 3, symbol: 'H', x: 0.00, y: 0.45, z: 0.25, charge: -0.15, hybridization: 's' },
      { id: 4, symbol: 'H', x: 0.00, y: 0.45, z: -0.25, charge: -0.15, hybridization: 's' },
      { id: 5, symbol: 'H', x: 0.00, y: -0.45, z: 0.25, charge: -0.15, hybridization: 's' },
      { id: 6, symbol: 'H', x: 0.00, y: -0.45, z: -0.25, charge: -0.15, hybridization: 's' },
      { id: 7, symbol: 'H', x: 1.05, y: 0.00, z: 0.35, charge: -0.12, hybridization: 's' },
      { id: 8, symbol: 'H', x: 1.05, y: 0.00, z: -0.35, charge: -0.12, hybridization: 's' },
      { id: 9, symbol: 'H', x: -1.05, y: 0.00, z: 0.35, charge: -0.12, hybridization: 's' },
      { id: 10, symbol: 'H', x: -1.05, y: 0.00, z: -0.35, charge: -0.12, hybridization: 's' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 0, atom2: 2, order: 1 },
      { atom1: 0, atom2: 3, order: 1 },
      { atom1: 0, atom2: 4, order: 1 },
      { atom1: 0, atom2: 5, order: 1 },
      { atom1: 0, atom2: 6, order: 1 },
      { atom1: 3, atom2: 4, order: 1 },
      { atom1: 5, atom2: 6, order: 1 },
      { atom1: 1, atom2: 7, order: 1 },
      { atom1: 1, atom2: 8, order: 1 },
      { atom1: 2, atom2: 9, order: 1 },
      { atom1: 2, atom2: 10, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -1240.85,
      vqeIterations: 42,
      fidelityScore: 0.995,
      homoEnergy: -8.45,
      lumoEnergy: -4.12,
      homoLumoGap: 4.33,
      dipoleMoment: 0.85,
      zeroPointEnergy: 320.0,
      qubitsRequired: 14,
      pauliTermsCount: 520,
      quantumAdvantageMetric: "다체 섭동 초밀도 상태벡터 수렴 연산 속도 1,200배 향상"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.011,
      generatorFidelity: 0.995,
      valenceValidityRate: 1.0,
      sascore: 4.1,
      qedScore: 0.65,
      logP: -0.12,
      molecularWeight: 234.12,
      hydrogenBondDonors: 0,
      hydrogenBondAcceptors: 0
    },
    synthesisProtocol: {
      summary: "메조다공성 Fe2O3-Pd 헤테로 초격자 기판에 고주파 극자외선(EUV) 엑시머 레이저를 조사하며 120 bar 고순도 중수소 가스를 펄스 주입하는 계면 뤼드베리 응집 합성법.",
      precursorReagents: [
        "고순도 중수소 가스 (D2, 99.99% isotopic purity)",
        "팔라듐-철 나노합금 에어로겔 지지체",
        "무수 에탄올 및 초임계 이산화탄소 (scCO2)"
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Fe-Pd 초격자 양자 우물 기판 제작",
          description: "원자층 증착(ALD) 공정으로 기판 상에 Pd (0.8 nm)와 Fe2O3 (1.2 nm) 교번 다층막을 적층하여 2차원 양자 포획 포텐셜 우물을 형성합니다.",
          temperature: "200°C",
          pressure: "10^-6 Torr",
          reagents: ["Pd 전구체", "Fe 전구체"],
          duration: "4 시간",
          safetyNote: "초고진공 챔버 오염 방지."
        },
        {
          stepNumber: 2,
          title: "고압 중수소 초임계 주입 및 레이저 뤼드베리 여기",
          description: "고압 오토클레이브에 기판을 장착하고 120 bar D2 가스를 주입한 상태에서 파장 248 nm KrF 엑시머 레이저(펄스폭 20 ns)를 조사하여 d 오비탈 계면에 D 원자를 초밀도로 응축시킵니다.",
          temperature: "65°C",
          pressure: "120 bar",
          reagents: ["D2 가스"],
          duration: "30 분",
          safetyNote: "고압 기체 누설 모니터링 필수."
        },
        {
          stepNumber: 3,
          title: "결맞음 위상 잠금 및 극저온 안정화",
          description: "레이저 펄스 종료 직후 급속 냉각(Liquid N2 켄칭)을 통해 피코미터 스케일의 D-D 결합 클러스터를 결정학적으로 고정화(Phase-locking)합니다.",
          temperature: "-196°C → 25°C 서서히 승온",
          pressure: "1.0 atm",
          reagents: ["액체 질소"],
          duration: "1 시간",
          safetyNote: "동상 방지 안전 장비 착용."
        }
      ],
      safetyControls: "중수소 주입 압력 밸브 차단 시 반응이 즉각 정지되는 자기 제어성 본질 안전성(Fail-Safe Passive Safety) 확보.",
      wasteManagement: "사용 후 기체는 무해한 순수 헬륨 가스로 포집되어 전량 산업용으로 회수.",
      scalabilityTRL: 4,
      estimatedCostPerGram: "약 28,000 원/g",
      theoreticalYieldPercent: 91.0
    },
    quantumCircuitConfig: {
      numQubits: 14,
      depth: 22,
      ansatzType: 'UCCSD',
      parameters: [-0.92, 1.45, -0.42, 2.11, -1.33, 0.65, 0.88, -0.19, 1.72, -0.84, 0.35, -1.05, 0.44, 0.98]
    }
  },
  {
    id: 'mat-octaazacubane-n8',
    name: 'Q-Octaazacubane-N8',
    koreanName: '준안정 고에너지 비핵 질소 큐베인 케이지',
    archetype: 'polymeric-nitrogen-cage',
    formula: 'N8',
    smiles: 'N12N3N4N1N5N2N3N45',
    description: '8개의 질소 원자가 순수한 단일 N-N 결합으로 정육면체(Cubane) 케이지를 이루는 초고밀도 화학적 양자 에너지 저장 분자입니다.',
    energyDensityMJkg: 33500000, // 33.5 MJ/kg (chemically pure, zero carbon)
    energyDensityKWhg: 9.3, // 9.3 kWh/g (TNT의 8배 이상, 리튬 배터리의 35배)
    energyComparisonSummary: 'TNT의 8.2배, 고성능 리튬 배터리의 35배 화학적 양자 결합 에너지 밀도 (탄소 0%, 방사능 0%, 순수 N2 기체 방출)',
    reactionType: 'N8 (입방체) → 4 N2 (삼중결합 가스) + 2.29 eV/N (엄청난 체적 팽창 및 무탄소 청정 에너지 방출)',
    radiationHazard: 'Zero (완전 무공해, 100% 무해한 대기 주성분 질소 N2 기체만 생성)',
    quantumMechanism: 'N-N 단일 결합 에너지(160 kJ/mol) 대비 질소 분자의 N≡N 삼중 결합 에너지(945 kJ/mol) 간의 거대한 양자 오비탈 재배치 결합 엔탈피 차이(ΔH = -800 kJ/mol per pair)를 이용합니다.',
    quantumScreeningEnergyEV: 120,
    coulombBarrierReductionPercent: 45.0,
    gamowFactorImprovement: '준안정 붕괴 활성화 장벽 1.85 eV로 상온 보관 안정성 확보',
    referenceAnalogy: {
      name: "큐베인 (Cubane, C8H8)",
      formula: "C8H8",
      smiles: "C12C3C4C1C5C2C3C45",
      structuralAnalogyReason: "정육면체의 90도 결합각 고리 장력(Strain energy ~ 166 kcal/mol)을 갖는 완전 대칭 입방체 탄화수소 골격을 기준 분자 구조로 참조함.",
      structuralModifications: [
        "8개의 탄소-수소(C-H) 골격을 비공유 전자쌍을 가진 8개의 삼배위 질소(:N) 원자로 등전자성(Isosteric) 전면 치환",
        "N-N 단일 결합만을 유지하여 4개의 N2 분자 해리 시 순수 질소 기체와 거대한 화학적 엔탈피 방출 유도",
        "단일벽 탄소나노튜브(SWCNT) 내 포접 캡슐화를 통해 상온 상압에서의 반응 역치(1.85 eV) 보호"
      ],
      homologyScore: 0.92
    },
    atoms: [
      { id: 0, symbol: 'N', x: 0.72, y: 0.72, z: 0.72, charge: 0.00, hybridization: 'sp3' },
      { id: 1, symbol: 'N', x: -0.72, y: 0.72, z: 0.72, charge: 0.00, hybridization: 'sp3' },
      { id: 2, symbol: 'N', x: -0.72, y: -0.72, z: 0.72, charge: 0.00, hybridization: 'sp3' },
      { id: 3, symbol: 'N', x: 0.72, y: -0.72, z: 0.72, charge: 0.00, hybridization: 'sp3' },
      { id: 4, symbol: 'N', x: 0.72, y: 0.72, z: -0.72, charge: 0.00, hybridization: 'sp3' },
      { id: 5, symbol: 'N', x: -0.72, y: 0.72, z: -0.72, charge: 0.00, hybridization: 'sp3' },
      { id: 6, symbol: 'N', x: -0.72, y: -0.72, z: -0.72, charge: 0.00, hybridization: 'sp3' },
      { id: 7, symbol: 'N', x: 0.72, y: -0.72, z: -0.72, charge: 0.00, hybridization: 'sp3' }
    ],
    bonds: [
      { atom1: 0, atom2: 1, order: 1 },
      { atom1: 1, atom2: 2, order: 1 },
      { atom1: 2, atom2: 3, order: 1 },
      { atom1: 3, atom2: 0, order: 1 },
      { atom1: 4, atom2: 5, order: 1 },
      { atom1: 5, atom2: 6, order: 1 },
      { atom1: 6, atom2: 7, order: 1 },
      { atom1: 7, atom2: 4, order: 1 },
      { atom1: 0, atom2: 4, order: 1 },
      { atom1: 1, atom2: 5, order: 1 },
      { atom1: 2, atom2: 6, order: 1 },
      { atom1: 3, atom2: 7, order: 1 }
    ],
    quantumProperties: {
      groundStateEnergy: -438.12,
      vqeIterations: 32,
      fidelityScore: 0.998,
      homoEnergy: -8.92,
      lumoEnergy: -0.45,
      homoLumoGap: 8.47,
      dipoleMoment: 0.00,
      zeroPointEnergy: 58.2,
      qubitsRequired: 8,
      pauliTermsCount: 180,
      quantumAdvantageMetric: "Oh 점군 완전 대칭성을 활용한 양자 오비탈 활성 공간 압축"
    },
    deepLearningMetrics: {
      qganDiscriminatorLoss: 0.022,
      generatorFidelity: 0.985,
      valenceValidityRate: 1.0,
      sascore: 5.8,
      qedScore: 0.42,
      logP: 0.35,
      molecularWeight: 112.06,
      hydrogenBondDonors: 0,
      hydrogenBondAcceptors: 8
    },
    synthesisProtocol: {
      summary: "아자이드 다이아조 전구체의 극저온 광분해 후 고압 레이저 가열 다이아몬드 앤빌 셀(DAC, 35 GPa)을 이용한 올리고머화 고리화 중합.",
      precursorReagents: [
        "1,4-다이아지도테트라졸 또는 고순도 액체 질소",
        "크립톤(Kr) 압력 전달 매질",
        "다이아몬드 앤빌 셀(DAC) 장치"
      ],
      steps: [
        {
          stepNumber: 1,
          title: "아자이드 전구체 다이아몬드 앤빌 셀 로딩",
          description: "순도 99.999% 액체 질소 및 비활성 가스 매질을 다이아몬드 큐렛 직경 300 μm 앤빌 셀 챔버에 봉입합니다.",
          temperature: "-196°C",
          pressure: "1.5 GPa 초기 가압",
          reagents: ["고순도 N2", "Kr 매질"],
          duration: "1 시간",
          safetyNote: "고압 셀 정렬 시 안전 고글 및 보호 쉴드 필수."
        },
        {
          stepNumber: 2,
          title: "초고압 유도(35 GPa) 및 적외선 레이저 열 활성화",
          description: "앤빌 셀 압력을 35 GPa까지 상승시킨 후 연속파 Nd:YAG 레이저(1064 nm)를 1800 K로 펄스 조사하여 분자 결합을 재구성하고 입방체 N8 구조를 자가조립합니다.",
          temperature: "1800 K (레이저 순간 가열)",
          pressure: "35 GPa (초고압)",
          reagents: ["Nd:YAG 레이저 빔"],
          duration: "15 분",
          safetyNote: "다이아몬드 파손 방지 압력 센서 연동."
        },
        {
          stepNumber: 3,
          title: "탄소 나노튜브(CNT) 내부 나노밀봉 및 감압 회수",
          description: "합성된 N8 케이지를 단일벽 탄소나노튜브(SWCNT) 내부에 포접시켜 상압 상온에서도 열역학적 준안정성을 유지하도록 보호 캡슐화합니다.",
          temperature: "25°C",
          pressure: "1.0 atm (상압 회수)",
          reagents: ["SWCNT 나노튜브"],
          duration: "30 분",
          safetyNote: "급격한 충격이나 정전기 방전 차단."
        }
      ],
      safetyControls: "CNT 나노캡슐화로 화학적 충격 감도 제어 (분자 당 에너지 해리 장벽 1.85 eV로 상온 불활성 유지).",
      wasteManagement: "에너지 방출 시 순수 대기 성분(N2)으로 완전 전환되므로 오염 물질 발생 제로.",
      scalabilityTRL: 3,
      estimatedCostPerGram: "약 85,000 원/g",
      theoreticalYieldPercent: 74.0
    },
    quantumCircuitConfig: {
      numQubits: 8,
      depth: 12,
      ansatzType: 'RyRz',
      parameters: [0.65, -0.88, 1.25, -0.42, 0.95, -1.15, 0.44, -0.72]
    }
  }
];
