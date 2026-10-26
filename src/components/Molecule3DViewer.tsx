import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Molecule, Atom, ATOM_COLORS, ATOM_RADII } from '../types/quantum';
import { 
  RotateCw, 
  Play, 
  Pause, 
  Camera, 
  Eye, 
  Ruler, 
  Info,
  Activity,
  Sliders,
  X,
  Flame,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';
import { PERIODIC_ELEMENTS } from '../data/periodicTableData';

interface Molecule3DViewerProps {
  molecule: Molecule;
  onSelectAtom?: (atom: Atom | null) => void;
  selectedAtom?: Atom | null;
  onSelectMoleculeById?: (id: string) => void;
}

type ViewMode = 'ball-stick' | 'space-filling' | 'wireframe' | 'orbital-density';

// 3D Canvas Billboard Sprite Generator for Atom Symbols
function createAtomLabelSprite(symbol: string, colorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Glow circular background badge
  ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
  ctx.strokeStyle = colorHex || '#38bdf8';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(64, 64, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Atom symbol text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture, 
    depthTest: false,
    transparent: true
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.65, 0.65, 1);
  return sprite;
}

export const Molecule3DViewer: React.FC<Molecule3DViewerProps> = ({
  molecule,
  onSelectAtom,
  selectedAtom,
  onSelectMoleculeById
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const moleculeGroupRef = useRef<THREE.Group | null>(null);
  const orbitalGroupRef = useRef<THREE.Group | null>(null);
  const surfaceGroupRef = useRef<THREE.Group | null>(null);
  const labelGroupRef = useRef<THREE.Group | null>(null);
  const measureLineRef = useRef<THREE.Line | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('ball-stick');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isVibrating, setIsVibrating] = useState<boolean>(false);
  const [showAtomLabels, setShowAtomLabels] = useState<boolean>(true);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [pickedAtoms, setPickedAtoms] = useState<Atom[]>([]);
  const [measurementResult, setMeasurementResult] = useState<string | null>(null);
  const [hoveredAtom, setHoveredAtom] = useState<Atom | null>(null);

  // Electrostatic Potential (ESP) & Electron Density Surface Heatmap Overlay States
  const [showSurfaceOverlay, setShowSurfaceOverlay] = useState<boolean>(false);
  const [surfaceProperty, setSurfaceProperty] = useState<'esp' | 'density'>('esp');
  const [surfaceOpacity, setSurfaceOpacity] = useState<number>(0.65);
  const [surfaceWireframe, setSurfaceWireframe] = useState<boolean>(false);
  const [surfaceIsoRadius, setSurfaceIsoRadius] = useState<number>(1.45);
  const [isSurfacePanelMinimized, setIsSurfacePanelMinimized] = useState<boolean>(false);

  // References for drag interaction
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const basePositionsRef = useRef<Map<number, THREE.Vector3>>(new Map());

  // Setup Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712); // slate-950

    // Add quantum coordinate grid helper on bottom
    const grid = new THREE.GridHelper(16, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -3.5;
    scene.add(grid);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    containerRef.current.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.4); // sky blue
    dirLight1.position.set(10, 15, 12);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.9); // purple rim
    dirLight2.position.set(-10, -10, -8);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.7, 30);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    const moleculeGroup = new THREE.Group();
    moleculeGroupRef.current = moleculeGroup;
    scene.add(moleculeGroup);

    const orbitalGroup = new THREE.Group();
    orbitalGroupRef.current = orbitalGroup;
    scene.add(orbitalGroup);

    const surfaceGroup = new THREE.Group();
    surfaceGroupRef.current = surfaceGroup;
    scene.add(surfaceGroup);

    const labelGroup = new THREE.Group();
    labelGroupRef.current = labelGroup;
    scene.add(labelGroup);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isRotating && !isDraggingRef.current && moleculeGroupRef.current) {
        moleculeGroupRef.current.rotation.y += 0.005;
        if (orbitalGroupRef.current) {
          orbitalGroupRef.current.rotation.y = moleculeGroupRef.current.rotation.y;
        }
        if (surfaceGroupRef.current) {
          surfaceGroupRef.current.rotation.y = moleculeGroupRef.current.rotation.y;
        }
        if (labelGroupRef.current) {
          labelGroupRef.current.rotation.y = moleculeGroupRef.current.rotation.y;
        }
      }

      // Harmonic vibration simulation
      if (isVibrating && moleculeGroupRef.current) {
        moleculeGroupRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.userData?.atom) {
            const atom: Atom = child.userData.atom;
            const base = basePositionsRef.current.get(atom.id);
            if (base) {
              const freq = 4.0 + (atom.id % 3) * 1.5;
              const amp = 0.08 * (atom.symbol === 'H' ? 1.8 : 0.8);
              child.position.x = base.x + Math.sin(elapsedTime * freq + atom.id) * amp;
              child.position.y = base.y + Math.cos(elapsedTime * freq * 1.2 + atom.id) * amp;
              child.position.z = base.z + Math.sin(elapsedTime * freq * 0.8 + atom.id) * amp;
            }
          }
        });

        if (labelGroupRef.current) {
          labelGroupRef.current.children.forEach((child) => {
            if (child instanceof THREE.Sprite && child.userData?.atom) {
              const atom: Atom = child.userData.atom;
              const base = basePositionsRef.current.get(atom.id);
              if (base) {
                const freq = 4.0 + (atom.id % 3) * 1.5;
                const amp = 0.08 * (atom.symbol === 'H' ? 1.8 : 0.8);
                const yOffset = child.userData.yOffset || 0.45;
                child.position.x = base.x + Math.sin(elapsedTime * freq + atom.id) * amp;
                child.position.y = base.y + yOffset + Math.cos(elapsedTime * freq * 1.2 + atom.id) * amp;
                child.position.z = base.z + Math.sin(elapsedTime * freq * 0.8 + atom.id) * amp;
              }
            }
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Re-build 3D Molecular Mesh whenever molecule or viewMode changes
  useEffect(() => {
    if (!moleculeGroupRef.current || !sceneRef.current || !orbitalGroupRef.current) return;
    const group = moleculeGroupRef.current;
    const orbitalGroup = orbitalGroupRef.current;

    // Clear previous objects
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }
    while (orbitalGroup.children.length > 0) {
      const obj = orbitalGroup.children[0];
      orbitalGroup.remove(obj);
    }

    basePositionsRef.current.clear();

    // Calculate center of geometry to center molecule
    let sumX = 0, sumY = 0, sumZ = 0;
    molecule.atoms.forEach((a) => {
      sumX += a.x;
      sumY += a.y;
      sumZ += a.z;
    });
    const centerX = sumX / (molecule.atoms.length || 1);
    const centerY = sumY / (molecule.atoms.length || 1);
    const centerZ = sumZ / (molecule.atoms.length || 1);

    const atomMeshMap = new Map<number, THREE.Vector3>();

    // 1. Create Atom Meshes
    molecule.atoms.forEach((atom) => {
      const colorHex = ATOM_COLORS[atom.symbol] || ATOM_COLORS.default;
      let radius = ATOM_RADII[atom.symbol] || ATOM_RADII.default;

      if (viewMode === 'space-filling') {
        radius *= 1.8;
      } else if (viewMode === 'wireframe') {
        radius *= 0.45;
      }

      const geom = new THREE.SphereGeometry(radius, 32, 32);
      const isSelected = selectedAtom?.id === atom.id;

      const mat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x38bdf8 : new THREE.Color(colorHex),
        roughness: 0.25,
        metalness: 0.15,
        emissive: isSelected ? 0x0284c7 : new THREE.Color(0x000000),
        emissiveIntensity: isSelected ? 0.6 : 0,
      });

      const mesh = new THREE.Mesh(geom, mat);
      const pos = new THREE.Vector3(atom.x - centerX, atom.y - centerY, atom.z - centerZ);
      mesh.position.copy(pos);
      mesh.userData = { atom, isAtom: true };

      group.add(mesh);
      atomMeshMap.set(atom.id, pos);
      basePositionsRef.current.set(atom.id, pos.clone());
    });

    // 2. Create Bond Cylinders
    if (viewMode !== 'space-filling') {
      molecule.bonds.forEach((bond) => {
        const p1 = atomMeshMap.get(bond.atom1);
        const p2 = atomMeshMap.get(bond.atom2);
        if (!p1 || !p2) return;

        const distance = p1.distanceTo(p2);
        const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
        const midPoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const bondRadius = viewMode === 'wireframe' ? 0.04 : 0.12;

        if (bond.order === 2 && viewMode === 'ball-stick') {
          // Double bond: Two parallel cylinders
          const perp = new THREE.Vector3(0, 0, 1).cross(direction).normalize().multiplyScalar(0.12);
          if (perp.length() === 0) perp.set(1, 0, 0).cross(direction).normalize().multiplyScalar(0.12);

          [-1, 1].forEach((sign) => {
            const shift = perp.clone().multiplyScalar(sign);
            const bGeom = new THREE.CylinderGeometry(bondRadius * 0.75, bondRadius * 0.75, distance, 16);
            const bMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.1 });
            const bMesh = new THREE.Mesh(bGeom, bMat);

            bMesh.position.copy(midPoint).add(shift);
            bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
            group.add(bMesh);
          });
        } else {
          // Single or aromatic bond
          const bGeom = new THREE.CylinderGeometry(bondRadius, bondRadius, distance, 16);
          const bMat = new THREE.MeshStandardMaterial({
            color: bond.order === 1.5 ? 0x06b6d4 : 0x94a3b8, // cyan accent for aromatic
            roughness: 0.3,
            metalness: 0.1,
          });
          const bMesh = new THREE.Mesh(bGeom, bMat);
          bMesh.position.copy(midPoint);
          bMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
          group.add(bMesh);
        }
      });
    }

    // 3. Orbital Density Mode (HOMO / LUMO Isosurface visual lobes)
    if (viewMode === 'orbital-density') {
      molecule.atoms.forEach((atom) => {
        if (atom.symbol === 'C' || atom.symbol === 'N' || atom.symbol === 'O') {
          const pos = atomMeshMap.get(atom.id);
          if (!pos) return;

          // Positive phase orbital lobe (+) in cyan
          const lobeGeom = new THREE.SphereGeometry(0.85, 24, 24);
          const lobeMatPos = new THREE.MeshPhysicalMaterial({
            color: 0x06b6d4, // Cyan
            transparent: true,
            opacity: 0.42,
            roughness: 0.1,
            transmission: 0.6,
            ior: 1.2,
            depthWrite: false,
          });
          const posLobe = new THREE.Mesh(lobeGeom, lobeMatPos);
          posLobe.position.set(pos.x, pos.y + 0.55, pos.z + 0.35);
          orbitalGroup.add(posLobe);

          // Negative phase orbital lobe (-) in magenta
          const lobeMatNeg = new THREE.MeshPhysicalMaterial({
            color: 0xec4899, // Magenta/pink
            transparent: true,
            opacity: 0.42,
            roughness: 0.1,
            transmission: 0.6,
            ior: 1.2,
            depthWrite: false,
          });
          const negLobe = new THREE.Mesh(lobeGeom, lobeMatNeg);
          negLobe.position.set(pos.x, pos.y - 0.55, pos.z - 0.35);
          orbitalGroup.add(negLobe);
        }
      });
    }

    // 3. Create 3D Atom Element Billboard Labels
    if (labelGroupRef.current) {
      while (labelGroupRef.current.children.length > 0) {
        const obj = labelGroupRef.current.children[0];
        labelGroupRef.current.remove(obj);
        if (obj instanceof THREE.Sprite) {
          obj.material.dispose();
        }
      }

      if (showAtomLabels) {
        molecule.atoms.forEach((atom) => {
          const colorHex = ATOM_COLORS[atom.symbol] || ATOM_COLORS.default;
          let radius = ATOM_RADII[atom.symbol] || ATOM_RADII.default;
          if (viewMode === 'space-filling') radius *= 1.8;
          else if (viewMode === 'wireframe') radius *= 0.45;

          const sprite = createAtomLabelSprite(atom.symbol, colorHex);
          const yOffset = radius + 0.38;
          const pos = new THREE.Vector3(atom.x - centerX, atom.y - centerY + yOffset, atom.z - centerZ);
          sprite.position.copy(pos);
          sprite.userData = { atom, yOffset };
          labelGroupRef.current?.add(sprite);
        });
      }
    }

  }, [molecule, viewMode, selectedAtom, showAtomLabels]);

  // Dedicated Effect: Re-build Electrostatic Potential (ESP) & Electron Density Molecular Surface Heatmap
  useEffect(() => {
    if (!surfaceGroupRef.current) return;
    const sGroup = surfaceGroupRef.current;

    // Clear previous surface meshes
    while (sGroup.children.length > 0) {
      const obj = sGroup.children[0];
      sGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    if (!showSurfaceOverlay) return;

    // Calculate center of geometry
    let sumX = 0, sumY = 0, sumZ = 0;
    molecule.atoms.forEach((a) => {
      sumX += a.x;
      sumY += a.y;
      sumZ += a.z;
    });
    const centerX = sumX / (molecule.atoms.length || 1);
    const centerY = sumY / (molecule.atoms.length || 1);
    const centerZ = sumZ / (molecule.atoms.length || 1);

    // Atomic number map for electron density calculation
    const atomicZMap: Record<string, number> = {
      H: 1, Li: 3, B: 5, C: 6, N: 7, O: 8, F: 9, Na: 11, Mg: 12,
      Al: 13, Si: 14, P: 15, S: 16, Cl: 17, K: 19, Ca: 20, Fe: 26,
      Ni: 28, Cu: 29, Zn: 30, Ga: 31, Ge: 32, As: 33, Se: 34, Br: 35,
      Pd: 46, In: 49, Sn: 50, Sb: 51, Te: 52, I: 53, W: 74
    };

    molecule.atoms.forEach((atom) => {
      const baseRadius = ATOM_RADII[atom.symbol] || ATOM_RADII.default;
      const probeRadius = baseRadius * surfaceIsoRadius;
      const geom = new THREE.SphereGeometry(probeRadius, 28, 28);
      const posAttr = geom.attributes.position;
      const count = posAttr.count;
      const colors = new Float32Array(count * 3);

      const atomX = atom.x - centerX;
      const atomY = atom.y - centerY;
      const atomZ = atom.z - centerZ;

      for (let i = 0; i < count; i++) {
        const vx = posAttr.getX(i) + atomX;
        const vy = posAttr.getY(i) + atomY;
        const vz = posAttr.getZ(i) + atomZ;

        let r = 0, g = 0, b = 0;
        if (surfaceProperty === 'esp') {
          // Local Electrostatic Potential: V(r) = sum_j (q_j / ||r - R_j||)
          let vTotal = 0;
          for (const other of molecule.atoms) {
            const ox = other.x - centerX;
            const oy = other.y - centerY;
            const oz = other.z - centerZ;
            const dist = Math.sqrt((vx - ox) ** 2 + (vy - oy) ** 2 + (vz - oz) ** 2) + 0.18;
            vTotal += (other.charge || 0) / dist;
          }

          // Color scale:
          // vTotal < 0: Red (Electron-rich / nucleophilic δ-)
          // vTotal ~ 0: Green (Neutral / hydrophobic)
          // vTotal > 0: Blue (Electron-poor / electrophilic δ+)
          const norm = Math.max(-1, Math.min(1, vTotal / 0.12));
          if (norm < 0) {
            const t = -norm; // 0 (neutral green) to 1 (pure red)
            r = 0.15 + t * 0.85;
            g = 0.85 * (1 - t * 0.7);
            b = 0.2 * (1 - t);
          } else {
            const t = norm; // 0 (neutral green) to 1 (cyan/deep blue)
            r = 0.15 * (1 - t);
            g = 0.85 * (1 - t * 0.55);
            b = 0.2 + t * 0.8;
          }
        } else {
          // Electron Density rho(r) = sum_j Z_j * exp(-dist^2 / (2 * sigma^2))
          let rhoTotal = 0;
          for (const other of molecule.atoms) {
            const ox = other.x - centerX;
            const oy = other.y - centerY;
            const oz = other.z - centerZ;
            const distSq = (vx - ox) ** 2 + (vy - oy) ** 2 + (vz - oz) ** 2;
            const zVal = atomicZMap[other.symbol] || 6;
            rhoTotal += zVal * Math.exp(-distSq / (2 * (0.85 ** 2)));
          }

          // Color gradient: Low (Deep Purple) -> Med (Cyan/Emerald) -> High (Amber/Crimson)
          const t = Math.max(0, Math.min(1, rhoTotal / 5.2));
          if (t < 0.33) {
            const u = t / 0.33;
            r = 0.28 * (1 - u);
            g = 0.08 + u * 0.7;
            b = 0.6 + u * 0.4;
          } else if (t < 0.66) {
            const u = (t - 0.33) / 0.33;
            r = u * 0.95;
            g = 0.78 + u * 0.2;
            b = 1.0 * (1 - u);
          } else {
            const u = (t - 0.66) / 0.34;
            r = 0.95 + u * 0.05;
            g = 0.98 * (1 - u * 0.8);
            b = 0.02 * (1 - u);
          }
        }

        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }

      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        transparent: true,
        opacity: surfaceOpacity,
        roughness: 0.35,
        metalness: 0.06,
        wireframe: surfaceWireframe,
        depthWrite: false,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(atomX, atomY, atomZ);
      sGroup.add(mesh);
    });
  }, [molecule, showSurfaceOverlay, surfaceProperty, surfaceOpacity, surfaceWireframe, surfaceIsoRadius]);

  // Raycasting & Mouse Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingRef.current && moleculeGroupRef.current) {
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      moleculeGroupRef.current.rotation.y += deltaX * 0.008;
      moleculeGroupRef.current.rotation.x += deltaY * 0.008;

      if (orbitalGroupRef.current) {
        orbitalGroupRef.current.rotation.y = moleculeGroupRef.current.rotation.y;
        orbitalGroupRef.current.rotation.x = moleculeGroupRef.current.rotation.x;
      }
      if (surfaceGroupRef.current) {
        surfaceGroupRef.current.rotation.y = moleculeGroupRef.current.rotation.y;
        surfaceGroupRef.current.rotation.x = moleculeGroupRef.current.rotation.x;
      }
      if (labelGroupRef.current) {
        labelGroupRef.current.rotation.y = moleculeGroupRef.current.rotation.y;
        labelGroupRef.current.rotation.x = moleculeGroupRef.current.rotation.x;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Raycast on hover
    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    if (moleculeGroupRef.current) {
      const intersects = raycaster.intersectObjects(moleculeGroupRef.current.children);
      const atomHit = intersects.find((i) => i.object.userData?.isAtom);
      if (atomHit) {
        setHoveredAtom(atomHit.object.userData.atom);
      } else {
        setHoveredAtom(null);
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(5, Math.min(30, cameraRef.current.position.z + e.deltaY * 0.015));
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !cameraRef.current || !moleculeGroupRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const intersects = raycaster.intersectObjects(moleculeGroupRef.current.children);
    const atomHit = intersects.find((i) => i.object.userData?.isAtom);

    if (atomHit) {
      const clickedAtom: Atom = atomHit.object.userData.atom;

      if (measureMode) {
        const next = [...pickedAtoms, clickedAtom];
        if (next.length === 2) {
          // Calculate distance
          const d = Math.sqrt(
            Math.pow(next[0].x - next[1].x, 2) +
            Math.pow(next[0].y - next[1].y, 2) +
            Math.pow(next[0].z - next[1].z, 2)
          );
          setMeasurementResult(`결합 거리 ${next[0].symbol}${next[0].id} - ${next[1].symbol}${next[1].id}: ${d.toFixed(3)} Å`);
          setPickedAtoms(next);
        } else if (next.length === 3) {
          // Calculate angle
          const v1 = new THREE.Vector3(next[0].x - next[1].x, next[0].y - next[1].y, next[0].z - next[1].z);
          const v2 = new THREE.Vector3(next[2].x - next[1].x, next[2].y - next[1].y, next[2].z - next[1].z);
          const angleDeg = (v1.angleTo(v2) * 180) / Math.PI;
          setMeasurementResult(`결합각 ${next[0].symbol}-${next[1].symbol}-${next[2].symbol}: ${angleDeg.toFixed(1)}°`);
          setPickedAtoms(next);
        } else {
          setPickedAtoms([clickedAtom]);
          setMeasurementResult(`${clickedAtom.symbol}${clickedAtom.id} 선택됨. 다음 원자를 클릭하세요.`);
        }
      } else {
        onSelectAtom?.(clickedAtom);
      }
    } else {
      if (!measureMode) {
        onSelectAtom?.(null);
      }
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && moleculeGroupRef.current) {
      cameraRef.current.position.set(0, 0, 14);
      moleculeGroupRef.current.rotation.set(0, 0, 0);
      if (orbitalGroupRef.current) orbitalGroupRef.current.rotation.set(0, 0, 0);
      if (surfaceGroupRef.current) surfaceGroupRef.current.rotation.set(0, 0, 0);
      if (labelGroupRef.current) labelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const handleCaptureScreenshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${molecule.name.replace(/\s+/g, '_')}_3D_Quantum.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-2.5 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-slate-100 tracking-wide">{molecule.name}</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">[{molecule.formula}]</span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">· {molecule.atoms.length} Atoms · {molecule.bonds.length} Bonds</span>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('ball-stick')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'ball-stick' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            볼-앤-스틱
          </button>
          <button
            onClick={() => setViewMode('space-filling')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'space-filling' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            CPK 공간채움
          </button>
          <button
            onClick={() => setViewMode('orbital-density')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'orbital-density' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            오비탈/전자밀도
          </button>
          <button
            onClick={() => setViewMode('wireframe')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${viewMode === 'wireframe' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            양자 와이어
          </button>
        </div>
      </div>

      {/* Periodic Element Navigation Sub-Bar (If current molecule is a periodic table element) */}
      {molecule.id.startsWith('elem-') && (() => {
        const parts = molecule.id.split('-');
        const currentElemNum = parseInt(parts[1], 10) || 1;
        const currentEl = PERIODIC_ELEMENTS.find(e => e.number === currentElemNum);
        const prevElemNum = currentElemNum <= 1 ? 118 : currentElemNum - 1;
        const nextElemNum = currentElemNum >= 118 ? 1 : currentElemNum + 1;
        const prevEl = PERIODIC_ELEMENTS.find(e => e.number === prevElemNum);
        const nextEl = PERIODIC_ELEMENTS.find(e => e.number === nextElemNum);

        return (
          <div className="absolute top-11 inset-x-0 z-10 flex items-center justify-between px-4 py-1 bg-emerald-950/85 backdrop-blur-md border-b border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                원소 #{currentElemNum} {currentEl?.symbol}
              </span>
              <span className="text-slate-300 font-medium">
                {currentEl?.koreanName} ({currentEl?.crystalStructure})
              </span>
              <span className="text-slate-500 hidden sm:inline">|</span>
              <span className="text-slate-400 hidden sm:inline">{currentEl?.electronConfiguration}</span>
            </div>

            {onSelectMoleculeById && (
              <div className="flex items-center gap-1.5 font-mono">
                <button
                  onClick={() => prevEl && onSelectMoleculeById(`elem-${prevEl.number}-${prevEl.symbol.toLowerCase()}`)}
                  className="px-2 py-0.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 flex items-center gap-1 text-[10px] transition-colors"
                  title={`이전 원소 #${prevElemNum} ${prevEl?.symbol} (${prevEl?.koreanName}) 로드`}
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>#{prevElemNum} {prevEl?.symbol}</span>
                </button>

                <select
                  value={currentElemNum}
                  onChange={(e) => {
                    const el = PERIODIC_ELEMENTS.find(item => item.number === Number(e.target.value));
                    if (el) onSelectMoleculeById(`elem-${el.number}-${el.symbol.toLowerCase()}`);
                  }}
                  className="bg-slate-900/90 border border-slate-700 text-emerald-300 rounded px-2 py-0.5 text-[10px] outline-none"
                >
                  {PERIODIC_ELEMENTS.map(el => (
                    <option key={el.number} value={el.number}>
                      #{el.number} {el.symbol} - {el.koreanName}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => nextEl && onSelectMoleculeById(`elem-${nextEl.number}-${nextEl.symbol.toLowerCase()}`)}
                  className="px-2 py-0.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 flex items-center gap-1 text-[10px] transition-colors"
                  title={`다음 원소 #${nextElemNum} ${nextEl?.symbol} (${nextEl?.koreanName}) 로드`}
                >
                  <span>#{nextElemNum} {nextEl?.symbol}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Generated Cosmic Molecule Constituent Elements Sub-Bar */}
      {molecule.isGenerated && (
        <div className="absolute top-11 inset-x-0 z-10 flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 bg-gradient-to-r from-indigo-950/95 via-slate-950/95 to-cyan-950/95 backdrop-blur-md border-b border-cyan-500/40 text-xs shadow-md">
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
              선택 원소 100% 3D 합성 시현
            </span>
            <span className="text-slate-200 font-semibold">{molecule.commonName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-400 text-[10px] hidden sm:inline">반영 원소 클러스터:</span>
            {Array.from(new Set(molecule.atoms.map(a => a.symbol))).map(sym => (
              <span
                key={sym}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 font-bold text-slate-100 flex items-center gap-1.5 shadow-sm"
              >
                <span
                  className="w-2 h-2 rounded-full inline-block shrink-0 shadow-sm"
                  style={{ backgroundColor: ATOM_COLORS[sym] || '#94A3B8' }}
                />
                <span>{sym}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main 3D Canvas Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Hover Info Tooltip */}
      {hoveredAtom && (
        <div className="absolute top-14 left-4 z-20 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 rounded-lg p-3 text-xs shadow-xl min-w-44">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-cyan-300 text-sm">{hoveredAtom.symbol} (ID: #{hoveredAtom.id})</span>
            <span className="text-slate-400 font-mono">{hoveredAtom.hybridization}</span>
          </div>
          <div className="space-y-1 text-slate-300 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">부분 전하:</span>
              <span className={hoveredAtom.charge < 0 ? 'text-red-400' : 'text-blue-400'}>
                {hoveredAtom.charge > 0 ? `+${hoveredAtom.charge.toFixed(2)}` : hoveredAtom.charge.toFixed(2)} e
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">좌표 (x,y,z):</span>
              <span>{hoveredAtom.x.toFixed(2)}, {hoveredAtom.y.toFixed(2)}, {hoveredAtom.z.toFixed(2)} Å</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Electrostatic Potential (ESP) & Electron Density Surface Heatmap Panel */}
      {showSurfaceOverlay && (
        <div className="absolute top-14 right-4 z-20 w-80 bg-slate-950/95 backdrop-blur-md border border-cyan-500/50 rounded-xl p-3.5 shadow-2xl text-xs space-y-2.5 pointer-events-auto animate-in fade-in slide-in-from-top-2">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-100">양자 표면 히트맵 오버레이</span>
            </div>
            <button
              onClick={() => setShowSurfaceOverlay(false)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Selector Tab */}
          <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => setSurfaceProperty('esp')}
              className={`py-1 rounded-md transition-colors ${
                surfaceProperty === 'esp'
                  ? 'bg-gradient-to-r from-red-600/40 via-emerald-600/40 to-blue-600/40 text-cyan-200 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              정전기 포텐셜 (ESP)
            </button>
            <button
              onClick={() => setSurfaceProperty('density')}
              className={`py-1 rounded-md transition-colors ${
                surfaceProperty === 'density'
                  ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전자 밀도 (ρ(r))
            </button>
          </div>

          {/* Continuous Heatmap Gradient Legend */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>히트맵 스케일 범례:</span>
              <span className="font-mono text-cyan-300 font-bold">
                {surfaceProperty === 'esp' ? 'V(r) [-0.15 ~ +0.15 a.u.]' : 'ρ(r) [0.0 ~ 0.35 e/Å³]'}
              </span>
            </div>

            {surfaceProperty === 'esp' ? (
              <div className="space-y-1">
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-red-500 via-emerald-400 to-blue-600 border border-slate-700 shadow-inner" />
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span className="text-red-400 font-bold">-0.15 a.u. (친핵성 δ⁻)</span>
                  <span className="text-emerald-400 font-bold">0.0 (중성)</span>
                  <span className="text-blue-400 font-bold">+0.15 a.u. (친전자성 δ⁺)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="w-full h-3 rounded-full bg-gradient-to-r from-indigo-950 via-cyan-400 via-amber-400 to-rose-600 border border-slate-700 shadow-inner" />
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span className="text-indigo-400 font-bold">0.02 e/Å³ (외곽)</span>
                  <span className="text-emerald-400 font-bold">0.12 (가전자 구름)</span>
                  <span className="text-rose-400 font-bold">0.35 e/Å³ (결합 코어)</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls: Opacity & Iso-Radius & Wireframe */}
          <div className="space-y-2 pt-1 border-t border-slate-800 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">표면 투명도 (Opacity):</span>
              <span className="font-mono text-cyan-300 font-bold">{Math.round(surfaceOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={0.95}
              step={0.05}
              value={surfaceOpacity}
              onChange={(e) => setSurfaceOpacity(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <span className="text-slate-400">등표면 프로브 반경 (Iso-Radius):</span>
              <span className="font-mono text-cyan-300 font-bold">{surfaceIsoRadius.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={1.15}
              max={1.95}
              step={0.05}
              value={surfaceIsoRadius}
              onChange={(e) => setSurfaceIsoRadius(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={surfaceWireframe}
                  onChange={(e) => setSurfaceWireframe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>와이어프레임 메쉬 격자 모드</span>
              </label>
            </div>
          </div>

          {/* Physical explanation footnote */}
          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 leading-tight">
            {surfaceProperty === 'esp' ? (
              <p>
                <strong className="text-slate-300">ESP 물리 의미:</strong> 붉은색(음전위) 영역은 친전자체 공격 및 수소결합 수용체 자리이며, 푸른색(양전위) 영역은 친핵체 공격 및 수소결합 공여체 자리입니다.
              </p>
            ) : (
              <p>
                <strong className="text-slate-300">밀도 물리 의미:</strong> 슈뢰딩거 파동함수의 전자 발견 확률 밀도 |ψ(r)|²를 나타내며 원자핵과 공유결합 축 주변에서 최대값을 가집니다.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Measurement HUD banner */}
      {measureMode && measurementResult && (
        <div className="absolute top-14 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-amber-500/40 rounded-lg px-3.5 py-2 text-xs text-amber-300 shadow-xl font-mono flex items-center gap-2">
          <Ruler className="w-3.5 h-3.5 text-amber-400" />
          <span>{measurementResult}</span>
          {pickedAtoms.length > 0 && (
            <button
              onClick={() => {
                setPickedAtoms([]);
                setMeasurementResult("측정할 원자를 클릭하세요 (2개: 거리, 3개: 결합각)");
              }}
              className="ml-2 text-[10px] text-slate-400 hover:text-slate-200 underline"
            >
              초기화
            </button>
          )}
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 inset-x-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Dynamic Legend of Elements Present in the Molecule */}
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-lg pointer-events-auto text-[11px] text-slate-300 font-mono shadow-lg max-w-sm sm:max-w-md">
          <span className="text-[10px] text-slate-500 font-sans font-medium">구성 원소:</span>
          {Array.from(new Set(molecule.atoms.map(a => a.symbol))).map((sym) => {
            const colorHex = ATOM_COLORS[sym] || ATOM_COLORS.default;
            return (
              <span key={sym} className="flex items-center gap-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: colorHex }} />
                <strong className="text-slate-100">{sym}</strong>
              </span>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/85 backdrop-blur-md border border-slate-800/80 rounded-lg pointer-events-auto shadow-lg">
          {/* Atom Label Toggle Button */}
          <button
            onClick={() => setShowAtomLabels(!showAtomLabels)}
            title="3D 공간 상에 각 원자의 화학 원소 기호(W, Ta, B, C 등) 3D 라벨 표시 토글"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              showAtomLabels
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-400/80 shadow-md ring-1 ring-indigo-400/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">원소 라벨</span>
            <span className="text-[10px] font-mono font-bold text-indigo-300">{showAtomLabels ? 'ON' : 'OFF'}</span>
          </button>

          {/* Electrostatic Potential (ESP) & Density Surface Overlay Toggle */}
          <button
            onClick={() => setShowSurfaceOverlay(!showSurfaceOverlay)}
            title="양자 표면 정전기 포텐셜(ESP) 및 전자밀도 히트맵 표면 오버레이 토글"
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
              showSurfaceOverlay
                ? 'bg-gradient-to-r from-red-600/30 via-emerald-600/30 to-blue-600/30 text-cyan-200 border border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">ESP/전자밀도 표면</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            title={isRotating ? "자동 회전 일시정지" : "자동 회전 시작"}
            className={`p-2 rounded-md transition-colors ${isRotating ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsVibrating(!isVibrating)}
            title={isVibrating ? "진동 시뮬레이션 중지" : "양자 영점 진동(Harmonic Vibration) 시작"}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${isVibrating ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isVibrating ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            양자 진동
          </button>

          <button
            onClick={() => {
              setMeasureMode(!measureMode);
              setPickedAtoms([]);
              setMeasurementResult(measureMode ? null : "원자 2개를 선택해 결합 거리를 측정하세요");
            }}
            title="결합 거리 및 각도 측정"
            className={`p-2 rounded-md transition-colors ${measureMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
          >
            <Ruler className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetCamera}
            title="카메라 위치 초기화"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCaptureScreenshot}
            title="고해상도 캡처 저장"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

