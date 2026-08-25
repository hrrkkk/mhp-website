import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Culinary3DViewer - Realistic 3D Ghee Karam Dosa & Chutney Showcase (Three.js)
 *
 * Renders a physical 3D culinary presentation featuring:
 * 1. Multi-layered organic Ghee Karam Dosa (overlapping crepe folds with thin crisp edges)
 * 2. Two 3D Ceramic Chutney Bowls (Coconut Chutney & Karam Chutney) sitting on the plate
 * 3. 3D Ceramic Serving Platter with recessed well and copper rim
 * 4. Multi-tiered dark showcase pedestal with copper accent bezel
 * 5. Cinematic 3/4 camera angle, PCF soft shadow hierarchy, and smooth physical emergence
 */
const Culinary3DViewer = () => {
  const mountRef = useRef(null);
  const [isEmerged, setIsEmerged] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const height = container.clientHeight || 540;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();

    // 2. CINEMATIC 3/4 PERSPECTIVE CAMERA
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 4.5);
    camera.lookAt(0, 0.2, 0);

    // 3. RENDERER WITH PCF SOFT SHADOWS & ACES FILMIC TONE MAPPING
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 4. CINEMATIC RESTAURANT LIGHTING
    const ambientLight = new THREE.AmbientLight(0x2a181a, 1.1);
    scene.add(ambientLight);

    // Key Light: Soft Directional Warm Spotlight
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.7);
    keyLight.position.set(4.5, 8.5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 3;
    scene.add(keyLight);

    // Fill Light: Soft Burgundy Ambient Fill
    const fillLight = new THREE.DirectionalLight(0x6f3027, 0.85);
    fillLight.position.set(-4.5, 3, -2);
    scene.add(fillLight);

    // Rim Light: Warm Gold Backlight for Depth Separation
    const rimLight = new THREE.DirectionalLight(0xd8a04d, 1.9);
    rimLight.position.set(0, 5.5, -4);
    scene.add(rimLight);

    // 5. HIGH-RES PROCEDURAL TEXTURE GENERATOR FOR GHEE KARAM DOSA
    const createDosaTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Golden Roasted Base
      const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
      grad.addColorStop(0, '#ecc16d');
      grad.addColorStop(0.35, '#d88b35');
      grad.addColorStop(0.7, '#b8611b');
      grad.addColorStop(1, '#8c3b0d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Porous Crepe Micro-bubbles
      for (let i = 0; i < 950; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 8 + 1.5;
        ctx.fillStyle = Math.random() > 0.45 ? 'rgba(95, 30, 8, 0.4)' : 'rgba(255, 220, 150, 0.35)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Red Karam Podi Spice Specks
      for (let i = 0; i < 380; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 4 + 1.5;
        ctx.fillStyle = 'rgba(185, 28, 8, 0.82)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ghee Glaze Highlights
      for (let i = 0; i < 65; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const r = Math.random() * 22 + 5;
        ctx.fillStyle = 'rgba(255, 248, 200, 0.28)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const dosaTexture = createDosaTexture();

    // 6. MASTER 3D DISPLAY ASSEMBLY GROUP
    const showcaseGroup = new THREE.Group();
    scene.add(showcaseGroup);

    // ---------------- A. 3D PEDESTAL SHOWCASE STAGE ----------------
    const pedestalGroup = new THREE.Group();

    // Pedestal Top Surface
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x120a0b,
      roughness: 0.65,
      metalness: 0.2
    });
    const pedGeo = new THREE.CylinderGeometry(3.1, 3.6, 0.45, 64);
    const pedestalMesh = new THREE.Mesh(pedGeo, pedMat);
    pedestalMesh.position.y = -0.38;
    pedestalMesh.receiveShadow = true;
    pedestalGroup.add(pedestalMesh);

    // Pedestal Metallic Copper Accent Bezel Ring
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd77a4d,
      metalness: 0.85,
      roughness: 0.25
    });
    const ringGeo = new THREE.TorusGeometry(3.12, 0.05, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, copperMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -0.16;
    pedestalGroup.add(ringMesh);

    showcaseGroup.add(pedestalGroup);

    // ---------------- B. 3D CERAMIC SERVING PLATE ----------------
    const plateGroup = new THREE.Group();

    // Plate Base Body
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x180e0f,
      roughness: 0.28,
      metalness: 0.15
    });
    const plateGeo = new THREE.CylinderGeometry(2.4, 2.1, 0.16, 64);
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    plateMesh.position.y = -0.08;
    plateMesh.castShadow = true;
    plateMesh.receiveShadow = true;
    plateGroup.add(plateMesh);

    // Plate Outer Rim Lip
    const plateRimMat = new THREE.MeshStandardMaterial({
      color: 0x8e4228,
      metalness: 0.55,
      roughness: 0.3
    });
    const plateRimGeo = new THREE.TorusGeometry(2.38, 0.09, 16, 64);
    const plateRimMesh = new THREE.Mesh(plateRimGeo, plateRimMat);
    plateRimMesh.rotation.x = Math.PI / 2;
    plateRimMesh.position.y = -0.01;
    plateRimMesh.castShadow = true;
    plateGroup.add(plateRimMesh);

    // Plate Inner Recessed Well
    const wellMat = new THREE.MeshStandardMaterial({
      color: 0x100809,
      roughness: 0.4
    });
    const wellGeo = new THREE.CylinderGeometry(2.2, 1.9, 0.04, 64);
    const wellMesh = new THREE.Mesh(wellGeo, wellMat);
    wellMesh.position.y = 0.0;
    wellMesh.receiveShadow = true;
    plateGroup.add(wellMesh);

    // ---------------- C. 3D CERAMIC CHUTNEY BOWLS (SITTING ON PLATE) ----------------
    const katoriMat = new THREE.MeshStandardMaterial({
      color: 0x221315,
      roughness: 0.35,
      metalness: 0.2
    });

    // 1. Coconut Chutney Bowl (Left)
    const bowl1Geo = new THREE.CylinderGeometry(0.38, 0.28, 0.26, 32);
    const bowl1Mesh = new THREE.Mesh(bowl1Geo, katoriMat);
    bowl1Mesh.position.set(-1.1, 0.14, 0.7);
    bowl1Mesh.castShadow = true;
    bowl1Mesh.receiveShadow = true;

    // Coconut Chutney Filling
    const coconutMat = new THREE.MeshStandardMaterial({
      color: 0xf4efe6,
      roughness: 0.75
    });
    const cocoFillGeo = new THREE.CylinderGeometry(0.34, 0.32, 0.06, 32);
    const cocoFillMesh = new THREE.Mesh(cocoFillGeo, coconutMat);
    cocoFillMesh.position.set(-1.1, 0.24, 0.7);
    cocoFillMesh.castShadow = true;
    plateGroup.add(bowl1Mesh);
    plateGroup.add(cocoFillMesh);

    // 2. Karam Chutney / Sambar Bowl (Right)
    const bowl2Mesh = new THREE.Mesh(bowl1Geo, katoriMat);
    bowl2Mesh.position.set(1.1, 0.14, 0.7);
    bowl2Mesh.castShadow = true;
    bowl2Mesh.receiveShadow = true;

    // Karam Chutney Filling
    const karamFillMat = new THREE.MeshStandardMaterial({
      color: 0xc83818,
      roughness: 0.38,
      metalness: 0.1
    });
    const karamFillGeo = new THREE.CylinderGeometry(0.34, 0.32, 0.06, 32);
    const karamFillMesh = new THREE.Mesh(karamFillGeo, karamFillMat);
    karamFillMesh.position.set(1.1, 0.24, 0.7);
    karamFillMesh.castShadow = true;
    plateGroup.add(bowl2Mesh);
    plateGroup.add(karamFillMesh);

    showcaseGroup.add(plateGroup);

    // ---------------- D. MULTI-LAYERED ORGANIC 3D GHEE KARAM DOSA ----------------
    const dosaGroup = new THREE.Group();

    const dosaMaterial = new THREE.MeshStandardMaterial({
      map: dosaTexture,
      roughness: 0.42,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Layer 1: Bottom Crepe Base Fold
    const createFoldLayer = (w, d, bend) => {
      const shape = new THREE.Shape();
      shape.moveTo(-w / 2, -d / 2);
      shape.quadraticCurveTo(-w / 2 - 0.1, 0, -w / 2 + 0.1, d / 2);
      shape.quadraticCurveTo(0, d / 2 + bend, w / 2 - 0.1, d / 2);
      shape.quadraticCurveTo(w / 2 + 0.1, 0, w / 2, -d / 2);
      shape.quadraticCurveTo(0, -d / 2 - bend * 0.5, -w / 2, -d / 2);

      const extrudeSettings = {
        steps: 16,
        depth: 0.06,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 4
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geo.center();

      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const noise = Math.sin(x * 4 + y * 3) * 0.025;
        pos.setZ(i, z + noise);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Bottom Fold Layer
    const layer1Geo = createFoldLayer(2.8, 1.8, 0.4);
    const layer1Mesh = new THREE.Mesh(layer1Geo, dosaMaterial);
    layer1Mesh.rotation.x = Math.PI / 2 - 0.15;
    layer1Mesh.position.set(0, 0.1, -0.1);
    layer1Mesh.castShadow = true;
    layer1Mesh.receiveShadow = true;
    dosaGroup.add(layer1Mesh);

    // Middle Fold Layer (Visible Overlap)
    const layer2Geo = createFoldLayer(2.5, 1.5, 0.35);
    const layer2Mesh = new THREE.Mesh(layer2Geo, dosaMaterial);
    layer2Mesh.rotation.x = Math.PI / 2 - 0.1;
    layer2Mesh.position.set(0, 0.18, -0.05);
    layer2Mesh.castShadow = true;
    layer2Mesh.receiveShadow = true;
    dosaGroup.add(layer2Mesh);

    // Top Rolled Flap Overlap
    const layer3Geo = createFoldLayer(2.2, 1.2, 0.3);
    const layer3Mesh = new THREE.Mesh(layer3Geo, dosaMaterial);
    layer3Mesh.rotation.x = Math.PI / 2 - 0.05;
    layer3Mesh.position.set(0, 0.26, 0.0);
    layer3Mesh.castShadow = true;
    dosaGroup.add(layer3Mesh);

    // 3D Volumetric Ghee Melt Drops & Karam Podi Morsels
    const gheeMat = new THREE.MeshStandardMaterial({
      color: 0xffeb9f,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88
    });

    for (let i = 0; i < 8; i++) {
      const gheeGeo = new THREE.SphereGeometry(0.045 + Math.random() * 0.03, 12, 12);
      const gheeMesh = new THREE.Mesh(gheeGeo, gheeMat);
      gheeMesh.position.set((Math.random() - 0.5) * 1.6, 0.32 + Math.random() * 0.04, (Math.random() - 0.5) * 0.4);
      gheeMesh.scale.y = 0.4;
      gheeMesh.castShadow = true;
      dosaGroup.add(gheeMesh);
    }

    const karamMat = new THREE.MeshStandardMaterial({
      color: 0xb8220c,
      roughness: 0.85
    });

    for (let i = 0; i < 24; i++) {
      const karamGeo = new THREE.DodecahedronGeometry(0.02 + Math.random() * 0.025);
      const karamMesh = new THREE.Mesh(karamGeo, karamMat);
      karamMesh.position.set((Math.random() - 0.5) * 1.8, 0.3 + Math.random() * 0.05, (Math.random() - 0.5) * 0.5);
      karamMesh.castShadow = true;
      dosaGroup.add(karamMesh);
    }

    showcaseGroup.add(dosaGroup);

    // ---------------- 7. MOUSE PARALLAX HOVER LISTENERS ----------------
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: 0, y: 0 };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // ---------------- 8. ANIMATION LOOP & SMOOTH TWEENING ----------------
    let animationFrameId;
    let targetY = 0;
    let targetZ = 0;
    let targetScale = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const emerged = container.getAttribute('data-emerged') === 'true';

      if (emerged) {
        targetY = 0.48;
        targetZ = 0.72;
        targetScale = 1.08;
      } else {
        targetY = 0;
        targetZ = 0;
        targetScale = 1;
      }

      // Smooth Lerp Emergence of Entire Dish Assembly
      dosaGroup.position.y += (targetY - dosaGroup.position.y) * 0.08;
      dosaGroup.position.z += (targetZ - dosaGroup.position.z) * 0.08;

      const currScale = dosaGroup.scale.x;
      const nxtScale = currScale + (targetScale - currScale) * 0.08;
      dosaGroup.scale.set(nxtScale, nxtScale, nxtScale);

      // Subtle Cursor Parallax Response
      const mx = mousePosRef.current.x;
      const my = mousePosRef.current.y;
      showcaseGroup.rotation.y = mx * 0.18 + Math.sin(Date.now() * 0.0008) * 0.05;
      showcaseGroup.rotation.x = -my * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const toggleEmergence = () => {
    setIsEmerged(prev => !prev);
  };

  return (
    <div
      ref={mountRef}
      data-emerged={isEmerged}
      onClick={toggleEmergence}
      className="w-full h-[420px] sm:h-[520px] cursor-pointer preserve-3d select-none relative flex items-center justify-center"
      title="Tap 3D Dosa presentation for physical emergence reveal"
    />
  );
};

export default Culinary3DViewer;
