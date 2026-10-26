import { CandidateLigandInfo, DockingSimulationResult, DockingPose, Atom, Bond } from '../types/quantum';

export const CANDIDATE_DRUG_LIGANDS: CandidateLigandInfo[] = [
  {
    id: 'lig-kras-x4',
    name: 'Q-KRAS-Inhibitor-X4 (MRTX1133 Analog)',
    koreanName: 'KRAS G12D 선택적 비공유 소분자 저해제',
    formula: 'C32H35Cl2FN6O2',
    molecularWeight: 625.56,
    logP: 3.15,
    hBondDonors: 2,
    hBondAcceptors: 6,
    rotatableBonds: 6,
    smiles: 'CC1=CC2=C(C=C1)N(C(=O)N2C3CCN(CC3)C4=NC=C(C=C4)Cl)C5=C(C=CC(=C5)F)Cl',
    targetMechanism: 'KRAS G12D의 12번 아스파르트산(Asp12) 음전하와 이온성 결합 및 스위치-II 포켓 잠금'
  },
  {
    id: 'lig-neuro-b7',
    name: 'Q-NeuroProtect-B7',
    koreanName: '양자 딥러닝 다중표적 신경보호 분자',
    formula: 'C11H12FN3O',
    molecularWeight: 221.23,
    logP: 1.82,
    hBondDonors: 2,
    hBondAcceptors: 3,
    rotatableBonds: 3,
    smiles: 'CC1=CC(=NN1C2=CC=C(C=C2)F)C(=O)N',
    targetMechanism: '베타-아밀로이드 올리고머 KLVFF 코어의 소수성 파이-파이(π-π) 스태킹 붕괴'
  },
  {
    id: 'lig-nirmatrelvir',
    name: 'Q-Covalent-Nirmatrelvir-Core',
    koreanName: '코로나19 Mpro 3CLpro 촉매 억제제',
    formula: 'C23H32F3N5O4',
    molecularWeight: 499.53,
    logP: 1.54,
    hBondDonors: 3,
    hBondAcceptors: 5,
    rotatableBonds: 7,
    smiles: 'CC1(C2C1C(N(C2)C(=O)C(C(C)(C)C)NC(=O)C(F)(F)F)C(=O)NC(CC3CCNC3=O)C#N)C',
    targetMechanism: 'Cys145 황(S) 원자와의 친핵성 티오헤미아세탈 상호작용 및 His41 수소결합 트랩'
  },
  {
    id: 'lig-donepezil',
    name: 'Donepezil-Q-Core',
    koreanName: '알츠하이머 타우/아밀로이드 이중 안정화제',
    formula: 'C24H29NO3',
    molecularWeight: 379.49,
    logP: 3.84,
    hBondDonors: 0,
    hBondAcceptors: 4,
    rotatableBonds: 6,
    smiles: 'COC1=C(C=C2C(=C1)CC(C2=O)CC3CCN(CC3)CC4=CC=CC=C4)OC',
    targetMechanism: '방향족 인돌/페닐 고리를 통한 단백질 소수성 틈새 고정'
  },
  {
    id: 'lig-p53-rescue',
    name: 'p53-Rescue-Stabilizer',
    koreanName: 'p53 암억제 단백질 열역학적 구조 회복제',
    formula: 'C16H16N2O2S',
    molecularWeight: 300.38,
    logP: 2.12,
    hBondDonors: 1,
    hBondAcceptors: 4,
    rotatableBonds: 4,
    smiles: 'CC1=CC=C(C=C1)S(=O)(=O)NC2=CC=C(C=C2)C(=O)N',
    targetMechanism: '돌연변이 p53 코어 도메인의 아연 핑거 인접 포켓 안정화'
  }
];

export function runSimulatedDocking(
  proteinName: string,
  proteinKoreanName: string,
  ligand: CandidateLigandInfo,
  exhaustiveness: number = 16,
  pocketCenter: [number, number, number] = [0.0, 0.0, 5.0]
): DockingSimulationResult {
  // Base affinity calculation based on target protein + ligand pairing complementarity
  let baseDeltaG = -9.2;
  if (proteinName.includes('KRAS') && ligand.id.includes('kras')) {
    baseDeltaG = -12.4;
  } else if (proteinName.includes('SARS') && ligand.id.includes('nirmatrelvir')) {
    baseDeltaG = -13.1;
  } else if (proteinName.includes('Amyloid') && ligand.id.includes('neuro')) {
    baseDeltaG = -11.2;
  } else if (proteinName.includes('p53') && ligand.id.includes('p53')) {
    baseDeltaG = -11.6;
  } else {
    // General small molecule docking energy calculation (Vina-like heuristic)
    const heavyAtoms = Math.round(ligand.molecularWeight / 14);
    const rotPenalty = ligand.rotatableBonds * 0.12;
    const hBondBonus = (ligand.hBondDonors + ligand.hBondAcceptors) * 0.35;
    const lipoBonus = Math.min(3.5, Math.max(0.5, ligand.logP * 0.7));
    baseDeltaG = -(3.5 + heavyAtoms * 0.15 + hBondBonus + lipoBonus - rotPenalty);
  }

  // Adjust precision with exhaustiveness
  const precisionBonus = (exhaustiveness >= 32 ? -0.4 : exhaustiveness >= 16 ? -0.2 : 0.0);
  const bestDeltaG = parseFloat((baseDeltaG + precisionBonus).toFixed(2));
  
  // Calculate Ki = exp(DeltaG / (R * T)) where R = 1.9872e-3 kcal/(mol K), T = 298.15 K -> R*T = 0.59248 kcal/mol
  const kiMolar = Math.exp((bestDeltaG) / 0.59248);
  const bestKiNM = parseFloat((kiMolar * 1e9).toFixed(2));

  // Generate 5 distinct binding poses with incremental RMSD and energy
  const poses: DockingPose[] = [];
  const poseCount = 5;

  for (let i = 0; i < poseCount; i++) {
    const poseIndex = i + 1;
    const deltaG = i === 0 ? bestDeltaG : parseFloat((bestDeltaG + (i * 0.75 + Math.random() * 0.3)).toFixed(2));
    const ki = parseFloat((Math.exp(deltaG / 0.59248) * 1e9).toFixed(2));
    const rmsdUb = i === 0 ? 0.0 : parseFloat((1.2 + i * 0.65).toFixed(2));
    const rmsdLb = i === 0 ? 0.0 : parseFloat((0.8 + i * 0.45).toFixed(2));
    const heavyAtoms = Math.max(10, Math.round(ligand.molecularWeight / 13));
    const ligandEfficiency = parseFloat((-deltaG / heavyAtoms).toFixed(3));

    // Realistic Energy Breakdown (vdW, Electrostatic, H-bonds, Desolvation, Torsional)
    const vdw = parseFloat((deltaG * 0.48).toFixed(2));
    const elec = parseFloat((deltaG * 0.28).toFixed(2));
    const hbond = parseFloat((deltaG * 0.22).toFixed(2));
    const desolv = parseFloat((Math.abs(deltaG) * 0.15).toFixed(2));
    const tors = parseFloat((ligand.rotatableBonds * 0.28).toFixed(2));

    // Interactions
    const interactions = [];
    if (proteinName.includes('KRAS')) {
      interactions.push({ type: 'salt_bridge' as const, residueName: 'Asp12', atomPair: 'COO⁻ ··· NH⁺', distanceAngstrom: 2.74, energyKcalMol: -2.8 });
      interactions.push({ type: 'hydrogen_bond' as const, residueName: 'Gly60', atomPair: 'Backbone NH ··· O=C', distanceAngstrom: 2.12, energyKcalMol: -1.9 });
      interactions.push({ type: 'pi_pi' as const, residueName: 'Tyr96', atomPair: 'Aromatic ··· Aromatic', distanceAngstrom: 3.58, energyKcalMol: -2.2 });
      interactions.push({ type: 'hydrophobic' as const, residueName: 'Val9', atomPair: 'CH₃ ··· CH₃', distanceAngstrom: 3.82, energyKcalMol: -1.1 });
    } else if (proteinName.includes('SARS')) {
      interactions.push({ type: 'hydrogen_bond' as const, residueName: 'Cys145', atomPair: 'Thiol SH ··· C=O', distanceAngstrom: 2.35, energyKcalMol: -2.5 });
      interactions.push({ type: 'hydrogen_bond' as const, residueName: 'His41', atomPair: 'Imidazole N ··· OH', distanceAngstrom: 2.18, energyKcalMol: -2.1 });
      interactions.push({ type: 'hydrogen_bond' as const, residueName: 'Glu166', atomPair: 'Carboxylate ··· NH', distanceAngstrom: 2.05, energyKcalMol: -2.4 });
      interactions.push({ type: 'hydrophobic' as const, residueName: 'Met49', atomPair: 'Aliphatic ··· Ring', distanceAngstrom: 3.65, energyKcalMol: -1.3 });
    } else if (proteinName.includes('Amyloid')) {
      interactions.push({ type: 'pi_pi' as const, residueName: 'Phe19', atomPair: 'π ··· π Face-to-Face', distanceAngstrom: 3.42, energyKcalMol: -2.6 });
      interactions.push({ type: 'pi_pi' as const, residueName: 'Phe20', atomPair: 'π ··· π T-Shaped', distanceAngstrom: 3.68, energyKcalMol: -2.2 });
      interactions.push({ type: 'hydrophobic' as const, residueName: 'Leu17', atomPair: 'Alkyl ··· Alkyl', distanceAngstrom: 3.75, energyKcalMol: -1.2 });
      interactions.push({ type: 'hydrogen_bond' as const, residueName: 'Lys16', atomPair: 'NH₃⁺ ··· C=O', distanceAngstrom: 2.25, energyKcalMol: -2.0 });
    } else {
      interactions.push({ type: 'hydrogen_bond' as const, residueName: 'Arg248', atomPair: 'Guanidinium ··· O=C', distanceAngstrom: 2.22, energyKcalMol: -2.3 });
      interactions.push({ type: 'hydrophobic' as const, residueName: 'Ile255', atomPair: 'Aliphatic ··· Ring', distanceAngstrom: 3.60, energyKcalMol: -1.4 });
      interactions.push({ type: 'pi_pi' as const, residueName: 'Trp146', atomPair: 'Indole ··· Aromatic', distanceAngstrom: 3.52, energyKcalMol: -2.1 });
    }

    // Coordinates of ligand pose (positioned near pocket center)
    const poseCoords = [];
    const numAtoms = 14;
    for (let a = 0; a < numAtoms; a++) {
      const angle = a * 0.45 + i * 0.3;
      poseCoords.push({
        x: parseFloat((pocketCenter[0] + Math.cos(angle) * 2.2 + (Math.random() - 0.5) * 0.4).toFixed(3)),
        y: parseFloat((pocketCenter[1] + Math.sin(angle) * 2.2 + (Math.random() - 0.5) * 0.4).toFixed(3)),
        z: parseFloat((pocketCenter[2] + (a * 0.3 - 2.0) + (Math.random() - 0.5) * 0.4).toFixed(3))
      });
    }

    poses.push({
      poseIndex,
      affinityKcalMol: deltaG,
      inhibitionConstantKiNM: ki,
      rmsdLowerBound: rmsdLb,
      rmsdUpperBound: rmsdUb,
      ligandEfficiency,
      energyBreakdown: {
        vdwEnergy: vdw,
        electrostaticEnergy: elec,
        hBondEnergy: hbond,
        desolvationPenalty: desolv,
        torsionalEntropyLoss: tors
      },
      interactions,
      coordinates: poseCoords
    });
  }

  return {
    targetProtein: proteinName,
    targetKoreanName: proteinKoreanName,
    ligand,
    exhaustiveness,
    gridBox: {
      center: pocketCenter,
      size: [18.0, 18.0, 18.0]
    },
    bestAffinityKcalMol: bestDeltaG,
    bestKiNM: bestKiNM,
    poses
  };
}

// Generate merged 3D atoms & bonds for protein + docked ligand for visualization
export function generateDockedComplexModel(
  proteinAtoms: Atom[],
  proteinBonds: Bond[],
  dockingPose: DockingPose
): { atoms: Atom[]; bonds: Bond[] } {
  const mergedAtoms: Atom[] = [...proteinAtoms];
  const mergedBonds: Bond[] = [...proteinBonds];
  const startId = proteinAtoms.length;

  dockingPose.coordinates.forEach((coord, idx) => {
    // Fluorescent colored ligand atoms (e.g. C, N, O, F)
    const symbols = ['C', 'C', 'N', 'C', 'O', 'C', 'C', 'F', 'C', 'N', 'C', 'O', 'C', 'C'];
    const sym = symbols[idx % symbols.length];
    mergedAtoms.push({
      id: startId + idx,
      symbol: sym,
      x: coord.x,
      y: coord.y,
      z: coord.z,
      charge: sym === 'O' ? -0.35 : sym === 'N' ? -0.25 : sym === 'F' ? -0.2 : 0.1,
      hybridization: sym === 'C' ? 'sp2' : 'sp3'
    });

    if (idx > 0) {
      mergedBonds.push({
        atom1: startId + idx - 1,
        atom2: startId + idx,
        order: (idx % 3 === 0) ? 2 : 1
      });
    }
  });

  return {
    atoms: mergedAtoms,
    bonds: mergedBonds
  };
}
