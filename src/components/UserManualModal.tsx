/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  FlaskConical, 
  Brain, 
  Activity, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Atom, 
  Flame, 
  GitCompare, 
  Dna, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  Compass,
  FileText
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tabKey: string) => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const [selectedMenuId, setSelectedMenuId] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const MANUAL_SECTIONS = [
    {
      id: 'intro',
      title: '플랫폼 소개 및 전체 아키텍처',
      icon: Sparkles,
      tag: '시스템 개요',
      content: {
        title: 'QuantumMol AI v2.4 QML-Studio 통합 플랫폼 개요',
        summary: 'QuantumMol AI는 초전도·이온트랩 양자 프로세서(QPU)의 양자 알고리즘(VQE, PQC)과 최신 생성형 딥러닝(QGAN, QVAE, VQC-Diffusion)을 융합하여, 주기율표 118종 전원소 기반의 우주 극한 신물질, 차세대 반도체, 청정 무중성자 핵에너지 물질, 표적 신약을 3D로 정밀 설계·시뮬레이션하는 차세대 분자 공학 플랫폼입니다.',
        highlights: [
          '주기율표 118종 모든 원소(1번 H부터 118번 Og까지)의 3D 분자 및 결정 격자 구조 100% 탑재',
          'VQE 바닥상태 에너지 수렴 및 실제 QPU 게이트 오류·디코히런스(T1, T2) 노이즈 분석 도구',
          '우주의 광활한 영역(성간운, 외계행성 대기, 3000°C 초내열 우주선)에 대응하는 118 전원소 딥러닝 합성',
          'Google Colab + Streamlit + Cloudflare Tunnel 연동을 통한 완전 무료 1분 웹 배포 지원'
        ],
        workflow: [
          '1단계 [원소 탐색/합성]: 주기율표 & 원소합성 엔진 또는 118종 전원소 라이브러리에서 원소와 결합 탐색',
          '2단계 [양자 딥러닝 생성]: 118개 원소를 조합하여 우주/지구 극한 도메인 맞춤 신규 분자 AI 생성',
          '3단계 [양자 물성 검증]: VQE 양자 시뮬레이터 및 QPU 노이즈 분석으로 바닥상태 에너지 정밀 측정',
          '4단계 [동역학 및 환경 최적화]: 반응 역학 실험실(Reaction Kinetics Lab)에서 고온·고압 반응성 및 최적 온도 도출',
          '5단계 [생산 공정 도출 & 배포]: 6대 산업 도메인 생산 공정 리포트 복사 및 Google Colab 웹 배포'
        ]
      }
    },
    {
      id: 'viewer',
      title: '1. 3D 분자 뷰어 & 전자밀도 표면',
      icon: FlaskConical,
      tag: '가시화 엔진',
      content: {
        title: '3D 양자 분자 뷰어 및 표면 오버레이 조작 가이드',
        summary: 'Three.js WebGL 가속 기반의 3D 뷰어로, 원자 좌표와 결합을 볼-앤-스틱, 공간채움(CPK), 양자 와이어, 정전기 포텐셜(ESP) 및 전자밀도 등표면(Iso-surface)으로 입체 가시화합니다.',
        controls: [
          { name: '마우스 좌클릭 드래그', desc: '분자 3D 회전 (Orbit Rotation)' },
          { name: '마우스 휠 스크롤', desc: '뷰포트 확대 / 축소 (Zoom In/Out)' },
          { name: '마우스 우클릭 드래그', desc: '시점 이동 (Pan)' },
          { name: '원자 클릭', desc: '개별 원자의 부분 전하(e), 3D 좌표(x,y,z), 궤도함수(Hybridization) 검사' },
          { name: 'ESP/전자밀도 표면 버튼', desc: '정전기 포텐셜 히트맵(-0.15~+0.15 a.u.) 및 전자 발견 확률 밀도 오버레이' },
          { name: '양자 진동 (Vibration)', desc: '영점 진동 에너지(ZPE)에 의한 조화 진동 실시간 애니메이션' },
          { name: '거리/각도 측정기 (Ruler)', desc: '원자 2개 선택 시 결합 길이(Å), 3개 선택 시 결합각(°) 정밀 측정' },
          { name: '118 전원소 네비게이터', desc: '상단 바의 [◀ 이전] [드롭다운] [다음 ▶]으로 118개 원소를 3D 뷰어에서 즉시 전환' }
        ],
        physicsTip: 'ESP 표면에서 붉은색(음전위)은 친전자체 결합 부위이며, 푸른색(양전위)은 친핵체 결합 수용체 자리입니다.'
      }
    },
    {
      id: 'generator',
      title: '2. 양자 딥러닝 분자 생성기',
      icon: Brain,
      tag: 'QML 역설계',
      content: {
        title: '우주 신물질 & 118 전원소 기반 양자 생성 AI 사용법',
        summary: '매개변수화 양자 회로(PQC)의 힐베르트 잠재 공간과 VQC-Diffusion/QGAN 신경망을 결합하여, 주기율표 118종 전원소를 구성 원자로 포함하는 화학적으로 타당한 신규 분자를 추론합니다.',
        controls: [
          { name: '기본 구성 원소 선택', desc: '118종 전원소 선택기에서 W, Ta, Ti, B, Bi 등 원하는 원소를 자유롭게 추가' },
          { name: '우주 영역 패키지 클릭', desc: '3000°C 초내열 우주선 차폐, 성간 분자운 촉매, 외계 행성 외피 등 원클릭 설정' },
          { name: '목표 도메인 선택', desc: '우주 초합금, 방사선 차폐, 외계 극한 대기 내식성, 지상 의약 신약 등 9개 도메인 지원' },
          { name: '프롬프트 입력', desc: '물질에 요구되는 기계적·열적·양자역학적 특성을 자연어로 자유롭게 기술' },
          { name: '양자 Ansatz 및 큐비트 설정', desc: 'StronglyEntangling/UCCSD/RyRz 구조 및 4~16 큐비트 예산 지정' },
          { name: 'HOMO-LUMO 슬라이더', desc: '1.5 ~ 9.0 eV 범위에서 목표 밴드갭 설정 (전도성 vs 열역학적 안정성)' }
        ],
        physicsTip: '5d 전이금속(W, Ta)과 붕소(B)를 조합하면 초고온(3000°C)에서도 결합이 분해되지 않는 초고밀도 다심 결합 격자가 형성됩니다.'
      }
    },
    {
      id: 'vqe',
      title: '3. VQE 시뮬레이터 & 양자 노이즈 분석 도구',
      icon: Activity,
      tag: 'QPU 알고리즘',
      content: {
        title: 'VQE 바닥상태 에너지 계산 및 실제 QPU 노이즈 분석 도구 가이드',
        summary: '변분 양자 고유값 해석기(Variational Quantum Eigensolver)로 분자 해밀토니안의 바닥상태 에너지를 계산하고, 실제 양자 컴퓨터(QPU)의 게이트 오류 및 디코히런스가 계산 정확도에 미치는 영향을 비교 분석합니다.',
        controls: [
          { name: '최적화 알고리즘 선택', desc: 'COBYLA (노이즈 강인), SPSA (경사도 근사), Adam, SLSQP 중 선택' },
          { name: 'Ansatz 구조 지정', desc: 'UCCSD (화학적 정확도 최고), Hardware-Efficient, Strongly Entangling' },
          { name: '양자 노이즈 분석기 토글', desc: '실제 양자 프로세서(QPU) 노이즈 시뮬레이션 패널 활성화' },
          { name: 'QPU 하드웨어 프리셋', desc: '초전도 트랜스몬(IBM Heron/Google Sycamore), 이온 트랩(IonQ Forte), 무잡음 상태 선택' },
          { name: '게이트 오류율 슬라이더', desc: '1-Qubit 및 2-Qubit CX 게이트 오차율(0.01% ~ 5.0%) 조절' },
          { name: '디코히런스 시간(T1, T2)', desc: '에너지 이완 시간 T1 및 위상 완화 시간 T2 조절에 따른 오차 추적' },
          { name: '오차 완화(ZNE) 적용', desc: '영점 잡음 외삽법(Zero-Noise Extrapolation)으로 QPU 노이즈 보정' }
        ],
        physicsTip: '화학적 정확도 기준(Chemical Accuracy)인 1.6 mHa 이내에 도달해야 실제 분자의 열역학적 반응 경로를 신뢰성 있게 예측할 수 있습니다.'
      }
    },
    {
      id: 'circuit',
      title: '4. 양자 회로 (PQC) & Bloch 구 투영',
      icon: Cpu,
      tag: '회로 설계',
      content: {
        title: '매개변수화 양자 회로(PQC) 및 단일 큐비트 Bloch 구 분석',
        summary: '분자 전자 오비탈을 Jordan-Wigner 변환으로 큐비트에 매핑한 PQC 회로 깊이와 CNOT 얽힘 게이트를 시각화하고, 상태벡터의 3차원 Bloch 구 좌표 [X, Y, Z]를 실시간 모니터링합니다.',
        controls: [
          { name: '회로 각도 θ 매개변수 조절', desc: '각 큐비트 회전 게이트(Rx, Ry, Rz)의 회전각 슬라이더 실시간 변경' },
          { name: '얽힘 결합도 확인', desc: '이웃 큐비트 간 얽힘 상태 텐서 가시화' },
          { name: 'Bloch 구 회전 궤적', desc: '순수 상태 |0⟩, |1⟩ 및 중첩 상태 (|+⟩, |-⟩)의 위상 벡터 추적' },
          { name: '파울리 연산자 측정 항', desc: 'Z, X, Y 연산자 기대값 및 수렴 통계 확인' }
        ],
        physicsTip: '회로 깊이(Depth)가 얕을수록 실제 NISQ 양자 하드웨어에서 게이트 오류의 축적을 효과적으로 방지할 수 있습니다.'
      }
    },
    {
      id: 'properties',
      title: '5. 분자 물성 리포트 & 화학 합성 레시피',
      icon: Layers,
      tag: '물성 분석',
      content: {
        title: '양자 물리화학 지표 및 3단계 전구체 합성 프로토콜',
        summary: 'HOMO-LUMO 에너지 갭, 쌍극자 모멘트, 분자량, logP, SAScore(합성 용이성), QED(의약 적합성) 및 3단계 화학 합성 경로를 상세 제공합니다.',
        controls: [
          { name: '전자 궤도 에너지 준위', desc: '최고 점유 분자궤도(HOMO)와 최저 비점유 분자궤도(LUMO) 에너지 분석' },
          { name: 'SAScore (합성 난이도)', desc: '1.0(매우 쉬움) ~ 10.0(합성 극도로 어려움) 척도로 화학 합성 가능성 진단' },
          { name: '3단계 합성 프로토콜 확인', desc: '출발 전구체 시약, 반응 조건(온도, 압력, 용매, 촉매), 분리/정제 단계 열람' },
          { name: '원클릭 리포트 복사', desc: '클립보드로 전체 물성 및 합성 경로 텍스트 복사' }
        ],
        physicsTip: 'logP가 0~3 범위일 때 세포막 및 혈뇌장벽 투과율이 가장 우수하며, 우주 재료에서는 SAScore 2.5 이하가 양산에 유리합니다.'
      }
    },
    {
      id: 'nuclear',
      title: '6. 소형모듈원전(SMR) & 핵에너지 대체 양자물질',
      icon: ShieldCheck,
      tag: '청정에너지',
      content: {
        title: '무중성자 청정 에너지 & 격자 가둠 양자 쿨롱 차폐 시뮬레이션',
        summary: '고준위 방사성 폐기물이 발생하지 않는 양성자-붕소(p-¹¹B) 및 중수소-헬륨3(D-³He) 반응을 위해, 금속 수소화물 격자 내에서 쿨롱 장벽을 양자 터널링으로 낮추는 대체 양자 소재를 연구합니다.',
        controls: [
          { name: '핵연료 대체 물질 선택', desc: 'Pd-D 격자, ErD3 초수소화물, TiD2 나노복합체 등 선택' },
          { name: '쿨롱 차폐 에너지(Ue) 조절', desc: '전자 차폐 효과로 인한 투과 확률 증폭 인자 계산' },
          { name: '온도 스윕 시뮬레이션', desc: '과열 시 자발적으로 격자가 팽창하여 반응을 중단시키는 Fail-Safe 안전성 검증' },
          { name: '방사선 차폐도 비교', desc: '전통 우라늄 SMR 대비 감마선/중성자 방출량 99.9% 억제 지표 확인' }
        ],
        physicsTip: 'p-¹¹B 무중성자 반응은 고에너지 알파 입자(He) 3개만 방출하므로 증기 터빈 없이 직접 MHD 전력 변환이 가능합니다.'
      }
    },
    {
      id: 'semiconductor',
      title: '7. 차세대 반도체 양자 랩 (Band Structure & Radar)',
      icon: Cpu,
      tag: '초미세 반도체',
      content: {
        title: 'Sub-1nm 2D 반도체, 에너지 밴드 구조 및 레이더 차트 비교',
        summary: '실리콘(Si)의 물리적 한계를 돌파하기 위한 MoS₂, WSe₂, GaN, β-Ga₂O₃ 및 위상 스핀 반도체를 설계하고, 전자 대역 구조(Band Structure: Γ-M-K-Γ)와 실리콘 대비 성능을 레이더 차트로 직접 비교합니다.',
        controls: [
          { name: '반도체 소재 선택', desc: '2D TMD, 초광대역 산화갈륨, 페르미 고이동도 물질 등 6대 프리셋 선택' },
          { name: '전자 밴드 구조(Band Structure)', desc: '제1 브릴루앙 영역(Brillouin Zone) 고대칭점(Γ, M, K)을 따라 전도대/가전자대 도식화' },
          { name: '직접/간접 전이 판정', desc: 'Direct Bandgap 여부 확인으로 광학 발광 소자 적합성 판정' },
          { name: '다차원 레이더 차트 (Radar)', desc: 'Si, GaN과 선택 물질의 전자 이동도, 밴드갭, 절연파괴전계, SS, 발리가 성능지수 직접 비교' }
        ],
        physicsTip: '서브볼츠만 스윙(Subthreshold Swing)이 60 mV/dec 이하인 음성 정전용량(NCFET) 채널은 초저전력 모바일 AI 칩의 핵심입니다.'
      }
    },
    {
      id: 'periodic',
      title: '8. 주기율표 & 원소합성 도가니 엔진',
      icon: Atom,
      tag: '신소재 합성',
      content: {
        title: '원소 합성 도가니(Crucible) 및 6대 산업 도메인 생산 공정 도출',
        summary: '주기율표의 원소를 도가니에 담아 몰비(Stoichiometry)를 조정하고 원소 간 결합 예측 알고리즘으로 신합금을 합성하며, 우주항공·반도체·배터리 등 6대 도메인 생산 공정을 자동 도출합니다.',
        controls: [
          { name: '주기율표 원소 클릭', desc: '원소 상세 물성(원자량, 전기음성도, 산화수, 결정계) 확인 및 도가니 추가' },
          { name: '도가니 화학량론(+/-)', desc: '각 원소의 조성비(예: Nb₂TiAl) 증감 조절' },
          { name: '목표 응용 도메인 지정', desc: '우주항공 초내열 터빈, 초광대역 전력반도체, 전고체 전해질 등 선택' },
          { name: '원소 합성 가동 버튼', desc: '원소 간 전기음성도 차(Δχ) 기반 결합 유형(금속간, 공유, 이온) 및 3D 결정 모델링' },
          { name: '6대 도메인 생산 리포트 복사', desc: '선정된 도메인별 공정 장비, 원료 전구체, 소결 온도, 안전 기준 리포트 복사' },
          { name: '반응 역학 실험실 전송', desc: '합성된 신소재를 고온·고압 환경 반응 챔버로 원클릭 전달' }
        ],
        physicsTip: '전기음성도 차이 Δχ < 0.4이면 균일한 금속간 화합물(Intermetallic) 초격자가 형성되어 고온 크립 저항성이 극대화됩니다.'
      }
    },
    {
      id: 'elements-library',
      title: '9. 원소 118 분자 라이브러리 & 3D 갤러리',
      icon: Layers,
      tag: '전원소 100%',
      content: {
        title: '주기율표 118종 전원소 3D 분자 및 결정 격자 구조 전체 갤러리',
        summary: '1번 수소(H)부터 118번 오가네손(Og)까지 주기율표의 모든 단체 원소 및 결정 격자 클러스터 구조가 100% 구축되어 있으며, 자동 순환 시현과 물성 매트릭스를 제공합니다.',
        controls: [
          { name: '원소 갤러리 그리드 클릭', desc: '118개 원소 중 하나를 선택하면 우측 3D 뷰어에 분자/결정 격자 실시간 렌더링' },
          { name: '전주기(1P~7P) 필터', desc: '1주기 경원소부터 7주기 악티늄·초중원소까지 단계별 탐색' },
          { name: '결정계 필터링', desc: '이원자(H₂, N₂), 체심입방(BCC), 면심입방(FCC), 조밀육방(HCP), 다이아몬드, 고리형(S₈), 사면체(P₄), 20면체(B₁₂) 필터' },
          { name: '전원소 3D 자동 순환 (Auto-Tour)', desc: '클릭 시 118개 원소가 설정된 시간(1.5초~4.0초)마다 자동으로 연속 회전·전환' },
          { name: '메인 3D 뷰어 로드 버튼', desc: '선택된 원소를 메인 3D 뷰어로 전송하여 ESP 표면 및 진동 모드 검사' },
          { name: '원자 좌표표 (Coordinates)', desc: '원소별 3D x, y, z 좌표 및 STO-3G 기저함수 오비탈 확인' }
        ],
        physicsTip: '비활성 기체(He, Ne, Ar, Kr, Xe, Rn, Og)도 극저온 고체 상태에서는 면심입방(FCC) 및 8면체 배위 격자를 형성합니다.'
      }
    },
    {
      id: 'kinetics',
      title: '10. 반응 역학 실험실 & 환경 최적화 추천',
      icon: Flame,
      tag: '극한 환경',
      content: {
        title: '반응 역학 실험실(Reaction Kinetics Lab) 및 산업 도메인 최적 조건 추천',
        summary: '주기율표에서 합성된 신소재가 극저온~2500K 고온 및 0.01~100 atm 고압, 5대 반응 분위기에서 열역학적으로 어떻게 반응하고 열화되는지 Eyring-Polanyi 이론으로 계산하고, 반도체 및 에너지 산업 최적 온도를 추천합니다.',
        controls: [
          { name: '온도/압력 슬라이더', desc: '환경 온도(100K~2500K) 및 챔버 압력(0.01~100 atm) 실시간 제어' },
          { name: '5대 챔버 분위기 선택', desc: '고농도 산소(산화), 수소 환원, 초고진공(UHV), 수열 수증기, 부식성 황' },
          { name: '반응 상태 3D 전환 버튼', desc: '초기 반응물(Reactant) → 전이상태(Transition State) → 최종 분해물(Product) 입체 관찰' },
          { name: '시간 경과 에너지 그래프', desc: '피코초(ps) 단위 반응물 잔류 분율 및 깁스 자유에너지(ΔG) 수렴 궤적' },
          { name: '환경 최적화 추천 패널', desc: '반도체 공정(계면 결함 억제 최적온도) 및 에너지 배터리(ΔG 안정화 안전온도) 원클릭 적용' }
        ],
        physicsTip: '아이링-폴라니 공식 $k = \\frac{k_B T}{h} e^{-\\Delta G^\\ddagger / RT}$을 통해 활성화 장벽을 넘는 반응 속도 상수를 정확히 도출합니다.'
      }
    },
    {
      id: 'isotope',
      title: '11. 동위원소 양자비교 랩 (Li·LiD / H₂·D₂·T₂)',
      icon: GitCompare,
      tag: '동위원소 효과',
      content: {
        title: '질량 수 변화에 따른 영점에너지(ZPE) 및 우벨로데 격자 수축 연구',
        summary: '동일한 원자 번호를 갖지만 중성자 수가 다른 동위원소(경수소 ¹H, 중수소 ²D, 삼중수소 ³T 및 ⁶Li, ⁷Li)의 양자 영점 진동(Zero-Point Energy)과 화학 반응 속도론(KIE)을 비교합니다.',
        controls: [
          { name: '동위원소 분자쌍 선택', desc: 'H₂ vs D₂ vs T₂ 및 ⁶LiH vs ⁷LiH vs ⁶LiD vs ⁷LiD 비교' },
          { name: '환산질량(μ) 계산', desc: '질량 증가에 따른 진동수(ν = 1/2π √(k/μ)) 감소 비율 확인' },
          { name: '우벨로데 격자 수축 효과', desc: '중수소 치환 시 파동함수 국소화로 인한 격자 상수 미세 수축 관측' },
          { name: '동위원소 열전도율 차이', desc: '질량 무질서도 감소로 인한 동위원소 정제 소재의 30% 이상 열전도도 향상 확인' }
        ],
        physicsTip: '삼중수소화물(T₂)은 수소(H₂) 대비 진동수가 1/√3으로 감소하여 화학 결합 해리 에너지가 크게 증가합니다.'
      }
    },
    {
      id: 'alphafold',
      title: '12. DeepMind AlphaFold 단백질 접힘 & 도킹',
      icon: Dna,
      tag: '바이오 양자',
      content: {
        title: 'AlphaFold 3D 단백질 3차 구조 예측 및 저분자 리간드 결합 친화도',
        summary: 'Evoformer 아키텍처 기반 pLDDT 잔기 신뢰도 점수 및 PAE 오차 행렬을 시각화하고, 양자 생성된 약물 후보 물질이 표적 질환 단백질 결합 포켓에 결합하는 깁스 자유에너지(ΔG)를 도킹 시뮬레이션합니다.',
        controls: [
          { name: '표적 단백질 선택', desc: 'SARS-CoV-2 메인 프로테아제, 알츠하이머 BACE1, KRAS G12D 종양 유전자 등 선택' },
          { name: 'pLDDT 색상 히트맵', desc: '진청색(>90 매우 높음), 하늘색(70~90 신뢰), 황색(50~70 낮음), 주황색(<50 무질서) 잔기 검사' },
          { name: '분자 도킹 실행 버튼', desc: '소분자 리간드가 단백질 포켓과 형성하는 반데르발스, 수소결합, 정전기 인력 에너지 계산' },
          { name: '결합 친화도(ΔG) 및 해리상수(Kd)', desc: '나노몰(nM) 단위 해리상수 확인으로 신약 유효물질 판정' }
        ],
        physicsTip: '도킹 친화도 ΔG가 -9.0 kcal/mol 이하이면 강력한 나노몰 단위 결합 저해제로 간주됩니다.'
      }
    },
    {
      id: 'crazy-graphene',
      title: '13. CRAZY AI & Robotics Graphene (그래핀 신물질 AI 스크리닝)',
      icon: Sparkles,
      tag: 'Graphene V5',
      content: {
        title: 'CRAZY AI Graphene Materials Transformer V5 및 PPT·Colab·결과물 통합 가이드',
        summary: 'Materials Project 32,534개 무기 결정체 데이터와 CrystalNN 기하학적 이웃 추출, Geometric Attention Bias Transformer(ComFormer 4-Layer Pre-LN)를 결합하여 그래핀형 2차원 후보 물질을 초고속 스크리닝하고, 7단계 DFT 검증 체크리스트와 PPT 웹 발표 및 Colab 노트북을 제공합니다.',
        controls: [
          { name: '그래핀 후보 랭킹 (Top 50)', desc: '1위 Ag₂CO₃, 2위 Al₂(CN₂)₃, AlCr₂C 등 50종 후보의 형성 에너지, 밴드갭, 3배위 분율 필터링 및 검사' },
          { name: '[3D 시뮬레이터에 로드] 버튼', desc: '선택된 후보의 3D 입체 나노격자 원자 좌표와 결합 구조를 메인 뷰어에 즉시 합성 반영' },
          { name: 'PPT Web 인터랙티브 슬라이드', desc: '12개 슬라이드 전체화면 재생 및 슬라이드별 한국어 12분 정밀 발표 대본 실시간 확인' },
          { name: 'Colab 노트북 (.ipynb) 다운로드', desc: 'Google Colab T4 GPU에서 즉시 실행 가능한 PyTorch + CrystalNN 전체 파이프라인 노트북 제공' },
          { name: '학습 곡선 & PCA 임베딩 분석', desc: '25~40 에폭 MSE 수렴 그래프 및 128차원 잠재 공간 PCA 2차원 투영 산점도 시각화' },
          { name: 'DFT 7단계 정밀 검증 프로토콜', desc: 'Dirac Cone, 포논 동적 안정성, 2D Cleavage Energy, Convex Hull 상안정성 등 체크리스트 트래커' }
        ],
        physicsTip: 'graphene_score는 sp² 3배위 분율과 1.42Å 결합길이, 120° 결합각 편차를 가중 결합한 휴리스틱 순위이므로, 실제 Dirac cone과 2D 층간 박리성은 DFT 정밀 계산으로 최종 검증해야 합니다.'
      }
    },
    {
      id: 'colab',
      title: '14. Google Colab 웹 배포 & 다운로드 가이드',
      icon: Download,
      tag: '원클릭 배포',
      content: {
        title: 'Google Colab + Streamlit + Cloudflare Tunnel 100% 무료 배포',
        summary: 'QuantumMol AI의 모든 기능이 포함된 Python Streamlit 코드를 Google Colab의 무료 GPU/CPU 런타임에서 실행하여, 포트포워딩 없이 외부 공용 HTTPS 링크로 웹 배포하는 방법입니다.',
        controls: [
          { name: '노트북(.ipynb) 다운로드', desc: 'Google Colab에서 바로 열 수 있는 Jupyter Notebook 파일 저장' },
          { name: 'app.py 단독 다운로드', desc: '로컬 PC 또는 서버에서 streamlit run app.py로 즉시 구동 가능한 Python 코드 저장' },
          { name: '단일 셀 원클릭 복사', desc: 'Colab 새 노트북에 복사 후 Shift+Enter만 누르면 되는 올인원 Bash/Python 스크립트 복사' },
          { name: 'trycloudflare.com 링크 접속', desc: 'Colab 셀 실행 1분 후 출력되는 보안 HTTPS 웹 링크로 모바일 및 PC 접속' }
        ],
        physicsTip: 'Cloudflare Tunnel을 사용하므로 개인정보 입력이나 방화벽 포트 개방 없이 안전한 종단간 TLS 암호화 연결이 생성됩니다.'
      }
    }
  ];

  const filteredSections = MANUAL_SECTIONS.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.title.toLowerCase().includes(q) ||
      s.tag.toLowerCase().includes(q) ||
      s.content.summary.toLowerCase().includes(q)
    );
  });

  const activeSection = MANUAL_SECTIONS.find(s => s.id === selectedMenuId) || MANUAL_SECTIONS[0];

  const handleCopySection = () => {
    const fullText = `[QuantumMol AI 매뉴얼 - ${activeSection.title}]\n\n${activeSection.content.summary}\n\n` +
      (activeSection.content.controls ? activeSection.content.controls.map(c => `• ${c.name}: ${c.desc}`).join('\n') : '') +
      `\n\n[전문 물리 해석]: ${activeSection.content.physicsTip || ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                QuantumMol AI 정밀 사용설명서 &amp; 전 메뉴 종합 매뉴얼
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v2.4 User Manual
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                13대 핵심 모듈 조작법, 양자 물리·화학 지표 해석 및 산업/우주 도메인 실전 활용 가이드
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySection}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="현재 섹션 매뉴얼 텍스트 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? '복사됨' : '섹션 복사'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="매뉴얼 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Sidebar (Menu List) + Right Content View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Menu List (32% width) */}
          <div className="w-[32%] border-r border-slate-800 flex flex-col bg-slate-950/70 shrink-0">
            {/* Search Box */}
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="메뉴, 기능, 물리 파라미터 검색..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filteredSections.map((sec) => {
                const IconComp = sec.icon;
                const isSelected = sec.id === selectedMenuId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedMenuId(sec.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs group ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border-cyan-500/60 text-cyan-200 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${
                        isSelected 
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                          : 'bg-slate-800/80 text-slate-400 border-slate-700/60 group-hover:text-cyan-400'
                      }`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="font-semibold block truncate leading-tight">{sec.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{sec.tag}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Bottom Quick Jump Footer */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>총 13개 전체 모듈 수록</span>
              <span className="text-emerald-400 font-bold">100% 한글 정밀 설명</span>
            </div>
          </div>

          {/* Right Content Panel (68% width) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950 scrollbar-thin">
            {/* Section Header Card */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">
                  {activeSection.tag}
                </span>
                <span>매뉴얼 ID: {activeSection.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                {activeSection.content.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                {activeSection.content.summary}
              </p>
            </div>

            {/* Highlights (Intro Section) */}
            {activeSection.content.highlights && (
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  플랫폼 핵심 기능 요약 (Core Highlights)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeSection.content.highlights.map((hl, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Workflow (Intro Section) */}
            {activeSection.content.workflow && (
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  표준 연구 및 시뮬레이션 파이프라인 (5-Step Pipeline)
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  {activeSection.content.workflow.map((wf, idx) => (
                    <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
                      {wf}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls & Operation Guide */}
            {activeSection.content.controls && (
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  상세 컨트롤 조작법 및 기능별 설명서
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {activeSection.content.controls.map((ctrl, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <strong className="text-cyan-300 font-mono text-[11px] sm:w-1/3 shrink-0">
                        {ctrl.name}
                      </strong>
                      <span className="text-slate-300 text-xs sm:w-2/3 leading-normal">
                        {ctrl.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physics & Scientific Tip Box */}
            {activeSection.content.physicsTip && (
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/40 rounded-xl text-xs space-y-1">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  양자 물리 &amp; 화학 해석 심화 가이드 (Scientific Insight)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeSection.content.physicsTip}
                </p>
              </div>
            )}

            {/* Quick Action Navigation Button to Go to that Tab */}
            {onNavigateTab && activeSection.id !== 'intro' && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    const tabMap: Record<string, string> = {
                      viewer: '3d-sim',
                      generator: 'generator',
                      vqe: 'vqe',
                      circuit: 'circuit',
                      properties: 'properties',
                      nuclear: 'nuclear-alt',
                      semiconductor: 'semiconductor',
                      periodic: 'periodic-table',
                      'elements-library': 'periodic-library',
                      kinetics: 'reaction-kinetics',
                      isotope: 'isotope-lab',
                      alphafold: 'alphafold',
                      'crazy-graphene': 'crazy-graphene'
                    };
                    const target = tabMap[activeSection.id];
                    if (target) {
                      onNavigateTab(target);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <span>현재 설명된 '{activeSection.title.split('. ')[1] || activeSection.title}' 탭으로 바로 이동</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
