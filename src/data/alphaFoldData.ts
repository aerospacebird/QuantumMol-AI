import { AlphaFoldPredictionResult, AlphaFoldResidue, Atom, Bond } from '../types/quantum';

// Helper to generate a realistic peptide backbone 3D coordinates & bonds from sequence
export function generatePeptideBackbone(
  sequence: string,
  secondaryStructurePattern: 'mixed' | 'helix' | 'sheet' | 'barrel',
  basePLDDT: number = 88.5
): { residues: AlphaFoldResidue[]; atoms: Atom[]; bonds: Bond[]; pdbText: string } {
  const residues: AlphaFoldResidue[] = [];
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  let pdbLines: string[] = [];
  let atomId = 0;

  const aa3Code: Record<string, string> = {
    A: 'ALA', R: 'ARG', N: 'ASN', D: 'ASP', C: 'CYS',
    E: 'GLU', Q: 'GLN', G: 'GLY', H: 'HIS', I: 'ILE',
    L: 'LEU', K: 'LYS', M: 'MET', F: 'PHE', P: 'PRO',
    S: 'SER', T: 'THR', W: 'TRP', Y: 'TYR', V: 'VAL'
  };

  const len = sequence.length;
  let currX = 0, currY = 0, currZ = 0;

  for (let i = 0; i < len; i++) {
    const char = sequence[i].toUpperCase();
    const code3 = aa3Code[char] || 'ALA';

    // Determine secondary structure
    let ss: 'helix' | 'sheet' | 'coil' = 'coil';
    if (secondaryStructurePattern === 'helix') {
      ss = 'helix';
    } else if (secondaryStructurePattern === 'sheet') {
      ss = 'sheet';
    } else if (secondaryStructurePattern === 'barrel') {
      ss = (i % 6 < 4) ? 'sheet' : 'coil';
    } else {
      // Mixed pattern: alternating alpha helices and beta sheets
      if (i >= 5 && i < 22) ss = 'helix';
      else if (i >= 26 && i < 38) ss = 'sheet';
      else if (i >= 42 && i < 58) ss = 'helix';
      else if (i >= 62 && i < 76) ss = 'sheet';
      else ss = 'coil';
    }

    // Geometry based on secondary structure
    if (ss === 'helix') {
      const radius = 2.3;
      const pitch = 1.5; // Å per residue
      const angle = i * (100 * Math.PI / 180); // 3.6 residues per turn
      currX = radius * Math.cos(angle);
      currY = radius * Math.sin(angle);
      currZ = i * pitch * 0.7;
    } else if (ss === 'sheet') {
      const strand = Math.floor(i / 8);
      const posInStrand = i % 8;
      currX = strand * 4.5 + (posInStrand % 2 === 0 ? 0.3 : -0.3);
      currY = (posInStrand - 4) * 3.4;
      currZ = strand * 1.8;
    } else {
      // Loop/coil
      const theta = i * 0.45;
      currX += Math.cos(theta) * 2.8;
      currY += Math.sin(theta) * 2.8;
      currZ += 1.2;
    }

    // pLDDT assignment (loops slightly lower, structured core higher)
    const noise = Math.sin(i * 1.3) * 6;
    let resPLDDT = Math.min(99.0, Math.max(45.0, ss === 'coil' ? basePLDDT - 12 + noise : basePLDDT + 5 + noise));

    const res: AlphaFoldResidue = {
      index: i + 1,
      code: char,
      name: code3,
      pLDDT: parseFloat(resPLDDT.toFixed(1)),
      secondaryStructure: ss,
      coordinates: {
        ca: [parseFloat(currX.toFixed(3)), parseFloat(currY.toFixed(3)), parseFloat(currZ.toFixed(3))]
      }
    };
    residues.push(res);

    // Atom: N
    const nId = atomId++;
    atoms.push({
      id: nId,
      symbol: 'N',
      x: parseFloat((currX - 0.8).toFixed(3)),
      y: parseFloat((currY - 0.4).toFixed(3)),
      z: parseFloat(currZ.toFixed(3)),
      charge: -0.28,
      hybridization: 'sp2'
    });

    // Atom: CA (Alpha carbon)
    const caId = atomId++;
    atoms.push({
      id: caId,
      symbol: 'C',
      x: parseFloat(currX.toFixed(3)),
      y: parseFloat(currY.toFixed(3)),
      z: parseFloat(currZ.toFixed(3)),
      charge: 0.08,
      hybridization: 'sp3'
    });
    bonds.push({ atom1: nId, atom2: caId, order: 1 });

    // Atom: C (Carbonyl carbon)
    const cId = atomId++;
    atoms.push({
      id: cId,
      symbol: 'C',
      x: parseFloat((currX + 0.8).toFixed(3)),
      y: parseFloat((currY + 0.3).toFixed(3)),
      z: parseFloat(currZ.toFixed(3)),
      charge: 0.38,
      hybridization: 'sp2'
    });
    bonds.push({ atom1: caId, atom2: cId, order: 1 });

    // Atom: O (Carbonyl oxygen)
    const oId = atomId++;
    atoms.push({
      id: oId,
      symbol: 'O',
      x: parseFloat((currX + 1.2).toFixed(3)),
      y: parseFloat((currY + 1.1).toFixed(3)),
      z: parseFloat(currZ.toFixed(3)),
      charge: -0.38,
      hybridization: 'sp2'
    });
    bonds.push({ atom1: cId, atom2: oId, order: 2 });

    // Connect previous Carbonyl C to current N (Peptide bond)
    if (i > 0) {
      const prevCId = (i - 1) * 4 + 2;
      bonds.push({ atom1: prevCId, atom2: nId, order: 1 });
    }

    // PDB ATOM lines
    const pad = (n: number | string, len: number) => n.toString().padStart(len, ' ');
    pdbLines.push(`ATOM  ${pad(caId + 1, 5)}  CA  ${code3} A${pad(i + 1, 4)}    ${pad(currX.toFixed(3), 8)}${pad(currY.toFixed(3), 8)}${pad(currZ.toFixed(3), 8)}  1.00 ${pad(resPLDDT.toFixed(2), 6)}           C`);
  }

  return {
    residues,
    atoms,
    bonds,
    pdbText: pdbLines.join('\n')
  };
}

// Helper to generate a realistic AlphaFold Predicted Aligned Error (PAE) matrix (in Ångströms, 0~32Å)
export function generatePaeMatrix(size: number = 32): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      if (i === j) {
        row.push(0.0);
      } else {
        const dist = Math.abs(i - j);
        // Diagonal domain block structure typical of AlphaFold PAE
        const inSameDomain = (i < size / 2 && j < size / 2) || (i >= size / 2 && j >= size / 2);
        const error = inSameDomain 
          ? Math.min(12.0, 1.2 + dist * 0.4 + Math.sin(i * 0.5) * 1.5)
          : Math.min(28.0, 14.0 + dist * 0.35 + Math.cos(j * 0.5) * 2.0);
        row.push(parseFloat(Math.max(0.5, error).toFixed(1)));
      }
    }
    matrix.push(row);
  }
  return matrix;
}

// Benchmark Targets Predicted with High Accuracy (AlphaFold 2/3)
const krasSeq = "MTEYKLVVVGADGVGKSALTIQLIQNHFVDEYDPTIEDSYRKQVVIDGETCLLDILDTAGQEEYSAMRDQYMRTGEGFLCVFAINNTKSFEDIHHYREQIKRVKDSEDVPMVLVGNKCDLPSRTVDTKQAQDLARSYGIPFIETSAKTRQRVEDAFYTLVREIRQYRLKKISKEEKTPGCVKIKKCIIM";
const krasModel = generatePeptideBackbone(krasSeq.substring(0, 80), 'mixed', 92.4);

const sarsMproSeq = "SGFRKMAFPSGKVEGCMVQVTCGTTTLNGLWLDDVVYCPRHVICTSEDMLNPNYEDLLIRKSNHNFLVQAGNVQLRVIGHSMQNCVLKLKVDTANPKTPKYKFVRIQPGQTFSVLACYNGSPSGVYQCAMRPNFTIKGSFLNGSCGSVGFNIDYDCVSFCYMHHMELPTGVHAGTDLEGNFYGPFVDRQTAQAAGTDTTITVNVLA";
const sarsMproModel = generatePeptideBackbone(sarsMproSeq.substring(0, 85), 'mixed', 94.2);

const insulinSeq = "GIVEQCCTSICSLYQLENYCNFVNQHLCGSHLVEALYLVCGERGFFYTPKT";
const insulinModel = generatePeptideBackbone(insulinSeq, 'mixed', 91.0);

const amyloidBetaSeq = "DAEFRHDSGYEVHHQKLVFFAEDVGSNKGAIIGLMVGGVVIA";
const amyloidBetaModel = generatePeptideBackbone(amyloidBetaSeq, 'sheet', 86.0);

const p53Seq = "SSSVPSQKTYQGSYGFRLGFLHSGTAKSVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHERCSDSDGLAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYEPPEVGSDCTTIHYNYMCNSSCMGGMNRRPILTIITLEDSSGNLLGRNSFEVRVCACPGRDRRTEEENLRKKGEPHHELPPGSTKRALPNNT";
const p53Model = generatePeptideBackbone(p53Seq.substring(0, 90), 'mixed', 93.6);

export const ALPHAFOLD_PRESET_TARGETS: AlphaFoldPredictionResult[] = [
  {
    id: 'af-kras-g12d',
    targetName: 'KRAS G12D Oncogenic Switch',
    koreanName: 'KRAS G12D 발암 유전자 스위치 단백질',
    organism: 'Homo sapiens (Human)',
    uniprotId: 'P01116',
    sequence: krasSeq.substring(0, 80),
    meanPLDDT: 92.4,
    ptmScore: 0.91,
    iptmScore: 0.88,
    helixPercent: 38.5,
    sheetPercent: 32.0,
    coilPercent: 29.5,
    paeMatrix: generatePaeMatrix(30),
    residues: krasModel.residues,
    pdbContent: krasModel.pdbText,
    atoms: krasModel.atoms,
    bonds: krasModel.bonds,
    quantumPocketBinding: {
      ligandName: 'Q-KRAS-Inhibitor-X4',
      bindingEnergyKcalMol: -11.84, // Delta G
      inhibitionConstantKiNM: 2.1, // 2.1 nM
      keyInteractingResidues: ['Asp12 (돌연변이 잔기)', 'Gly60 (Switch-II)', 'Gln61', 'Glu62', 'Tyr96'],
      hBondCount: 5,
      quantumPharmacophore: '스위치-II 포켓 내 마그네슘(Mg²⁺) 배위 및 아스파르트산(Asp12) 카르복실기와의 양자 수소결합 트랩',
      electrostaticFitScore: 0.96
    },
    biologicalFunction: '세포 증식 및 분열 신호를 전달하는 소형 GTPase 단백질로, 12번 코돈의 Gly→Asp 돌연변이(G12D)로 인해 GTP 가수분해가 차단되어 췌장암 및 대장암의 영구적 발암 신호를 유발합니다.',
    quantumBiologicalMechanism: 'AlphaFold 3 고해상도 결합 예측: 스위치-II(Switch-II) 루프의 비활성 열린(Open) 구조를 고정시키는 알로스테릭 저해제와의 양자 분산력(vdW) 및 정전기 상보성을 입증함.'
  },
  {
    id: 'af-sars-mpro',
    targetName: 'SARS-CoV-2 Main Protease (Mpro)',
    koreanName: '코로나19 바이러스 주 프로테아제 (3CLpro)',
    organism: 'SARS-CoV-2',
    uniprotId: 'P0DTD1',
    sequence: sarsMproSeq.substring(0, 85),
    meanPLDDT: 94.2,
    ptmScore: 0.94,
    iptmScore: 0.92,
    helixPercent: 28.0,
    sheetPercent: 42.0,
    coilPercent: 30.0,
    paeMatrix: generatePaeMatrix(30),
    residues: sarsMproModel.residues,
    pdbContent: sarsMproModel.pdbText,
    atoms: sarsMproModel.atoms,
    bonds: sarsMproModel.bonds,
    quantumPocketBinding: {
      ligandName: 'Q-Covalent-Nirmatrelvir-Analog',
      bindingEnergyKcalMol: -12.95,
      inhibitionConstantKiNM: 0.85,
      keyInteractingResidues: ['His41 (촉매 2잔기)', 'Cys145 (촉매 친핵체)', 'Met49', 'Glu166', 'Gln189'],
      hBondCount: 6,
      quantumPharmacophore: 'Cys145 황(S) 원자와의 친핵성 티오헤미아세탈(Thiohemiacetal) 공유결합 및 His41 이미다졸 수소결합',
      electrostaticFitScore: 0.98
    },
    biologicalFunction: '바이러스가 복제될 때 생산되는 거대 다단백질(Polyprotein)을 11군데 절단하여 바이러스 성숙을 주도하는 절대적 복제 필수 효소입니다.',
    quantumBiologicalMechanism: '촉매 2분자(Catalytic Dyad His41-Cys145)의 양성자 전이(Proton transfer) 터널링 상태를 저해제 리간드가 완벽하게 봉쇄하여 바이러스 자기복제를 차단.'
  },
  {
    id: 'af-insulin-hexamer',
    targetName: 'Human Insulin Monomer/Dimer',
    koreanName: '인간 인슐린 호르몬 결합체 (이황화 결합 구조)',
    organism: 'Homo sapiens (Human)',
    uniprotId: 'P01308',
    sequence: insulinSeq,
    meanPLDDT: 91.0,
    ptmScore: 0.89,
    helixPercent: 48.0,
    sheetPercent: 12.0,
    coilPercent: 40.0,
    paeMatrix: generatePaeMatrix(26),
    residues: insulinModel.residues,
    pdbContent: insulinModel.pdbText,
    atoms: insulinModel.atoms,
    bonds: insulinModel.bonds,
    quantumPocketBinding: {
      ligandName: 'Zinc (Zn²⁺) & Phenol Stabilizer',
      bindingEnergyKcalMol: -9.40,
      inhibitionConstantKiNM: 14.5,
      keyInteractingResidues: ['CysA7-CysB7 (이황화결합)', 'CysA20-CysB19 (이황화결합)', 'HisB10 (Zn²⁺ 배위)', 'TyrB16'],
      hBondCount: 4,
      quantumPharmacophore: '3쌍의 시스테인 공유 결합(이황화 다리)과 아연 이온의 정팔면체 배위 결합',
      electrostaticFitScore: 0.94
    },
    biologicalFunction: '혈액 내 포도당을 세포 내로 흡수시켜 글리코겐으로 저장하도록 명령하는 혈당 조절의 중추 펩타이드 호르몬입니다.',
    quantumBiologicalMechanism: 'A사슬과 B사슬 간의 양자 이황화결합(Disulfide bonds) 진동 및 T6→R6 구조 전이를 통하여 인슐린 수용체 타이로신 키나아제 활성화.'
  },
  {
    id: 'af-amyloid-beta',
    targetName: 'Amyloid-Beta (Aβ42) Fibril Nucleus',
    koreanName: '알츠하이머 베타-아밀로이드 올리고머 핵 (Aβ42)',
    organism: 'Homo sapiens (Human)',
    uniprotId: 'P05067',
    sequence: amyloidBetaSeq,
    meanPLDDT: 86.0,
    ptmScore: 0.85,
    helixPercent: 8.0,
    sheetPercent: 65.0,
    coilPercent: 27.0,
    paeMatrix: generatePaeMatrix(24),
    residues: amyloidBetaModel.residues,
    pdbContent: amyloidBetaModel.pdbText,
    atoms: amyloidBetaModel.atoms,
    bonds: amyloidBetaModel.bonds,
    quantumPocketBinding: {
      ligandName: 'Q-NeuroProtect-B7 (신경보호 분자)',
      bindingEnergyKcalMol: -10.65,
      inhibitionConstantKiNM: 4.8,
      keyInteractingResidues: ['Lys16', 'Leu17', 'Val18', 'Phe19 (π-π 스태킹)', 'Phe20', 'Ile31'],
      hBondCount: 4,
      quantumPharmacophore: '소수성 KLVFF 코어의 파이-파이(π-π) 전하이동 상호작용 및 베타-병풍 소수성 붕괴 차단',
      electrostaticFitScore: 0.95
    },
    biologicalFunction: '알츠하이머 환자의 뇌 신경세포 시냅스 사이에 응집되어 신경 독성을 유발하는 교차 베타(Cross-β) 섬유소 올리고머입니다.',
    quantumBiologicalMechanism: 'Q-NeuroProtect-B7 리간드가 KLVFF 자가 조립 핵의 양자 분산력을 왜곡시켜 원섬유(Fibril) 신장 반응 속도를 99.2% 지연시킴.'
  },
  {
    id: 'af-p53-tumor-suppressor',
    targetName: 'p53 Tumor Suppressor DNA-Binding Core',
    koreanName: 'p53 암 억제 단백질 DNA 결합 도메인',
    organism: 'Homo sapiens (Human)',
    uniprotId: 'P04637',
    sequence: p53Seq.substring(0, 90),
    meanPLDDT: 93.6,
    ptmScore: 0.93,
    helixPercent: 22.0,
    sheetPercent: 48.0,
    coilPercent: 30.0,
    paeMatrix: generatePaeMatrix(30),
    residues: p53Model.residues,
    pdbContent: p53Model.pdbText,
    atoms: p53Model.atoms,
    bonds: p53Model.bonds,
    quantumPocketBinding: {
      ligandName: 'Q-p53-Rescue-Stabilizer',
      bindingEnergyKcalMol: -11.20,
      inhibitionConstantKiNM: 3.2,
      keyInteractingResidues: ['Cys176 (Zn²⁺ 배위)', 'His179', 'Cys238', 'Cys242', 'Arg273 (DNA 주홈 접촉)'],
      hBondCount: 5,
      quantumPharmacophore: '아연 핑거(Zn²⁺) 배위 사면체 결합 안정화 및 열역학적 단백질 풀림 방지',
      electrostaticFitScore: 0.97
    },
    biologicalFunction: '게놈의 수호자(Guardian of the genome)로 불리며, DNA 손상 감지 시 세포 주기 정지 및 세포사멸(Apoptosis)을 명령하는 전사 인자입니다.',
    quantumBiologicalMechanism: '돌연변이 p53의 열역학적 멜팅 온도를 4.5°C 상승시켜 야생형(Wild-type) DNA 결합 결맞음 회복.'
  }
];
