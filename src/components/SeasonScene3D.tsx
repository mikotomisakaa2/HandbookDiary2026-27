import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SeasonId } from '../types/diary';

interface SeasonScene3DProps {
  season: SeasonId;
}

interface ParticleConfig {
  count: number;
  colors: number[];
  size: number;
  fallSpeed: number;
  driftX: number;
  spin: number;
  shape: 'flake' | 'petal' | 'mote' | 'rain' | 'ember';
  lightColor: number;
}

const SEASON_3D_CONFIG: Record<SeasonId, ParticleConfig> = {
  winter: {
    count: 110,
    colors: [0xfff6e5, 0xdceefb, 0xffd79a],
    size: 0.24,
    fallSpeed: 0.015,
    driftX: 0.008,
    spin: 0.012,
    shape: 'flake',
    lightColor: 0xffcfa0,
  },
  spring: {
    count: 95,
    colors: [0xf7a1b5, 0xffccd5, 0xffd166, 0xf28482],
    size: 0.34,
    fallSpeed: 0.018,
    driftX: 0.016,
    spin: 0.025,
    shape: 'petal',
    lightColor: 0xffe5b8,
  },
  summer: {
    count: 85,
    colors: [0xffd15c, 0xffe89e, 0xffae42],
    size: 0.2,
    fallSpeed: -0.006, // gently rising sunlit pollen/fireflies
    driftX: 0.01,
    spin: 0.01,
    shape: 'mote',
    lightColor: 0xffe49e,
  },
  monsoon: {
    count: 180,
    colors: [0xa9d6e5, 0x89c2d9, 0xc9e4de],
    size: 0.38,
    fallSpeed: 0.14,
    driftX: -0.025,
    spin: 0,
    shape: 'rain',
    lightColor: 0x99d6c8,
  },
  autumn: {
    count: 105,
    colors: [0xff9f1c, 0xffbf69, 0xe76f51, 0xffd166],
    size: 0.32,
    fallSpeed: 0.02,
    driftX: 0.014,
    spin: 0.028,
    shape: 'ember',
    lightColor: 0xffb35c,
  },
};

export const SeasonScene3D: React.FC<SeasonScene3DProps> = ({ season }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const cfg = SEASON_3D_CONFIG[season];

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 16;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm seasonal 3D lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(cfg.lightColor, 1.1);
    dirLight.position.set(8, 12, 10);
    scene.add(dirLight);

    // Subtle 3D wooden desk bokeh orbs / seasonal meshes
    const group = new THREE.Group();
    scene.add(group);

    let geometry: THREE.BufferGeometry;
    if (cfg.shape === 'rain') {
      geometry = new THREE.CylinderGeometry(0.018, 0.018, 0.9, 5);
    } else if (cfg.shape === 'petal' || cfg.shape === 'ember') {
      geometry = new THREE.CircleGeometry(cfg.size, 6);
    } else if (cfg.shape === 'flake') {
      geometry = new THREE.OctahedronGeometry(cfg.size * 0.65, 0);
    } else {
      geometry = new THREE.SphereGeometry(cfg.size * 0.6, 8, 8);
    }

    interface ParticleMeta {
      mesh: THREE.Mesh;
      vy: number;
      vx: number;
      phase: number;
      spinX: number;
      spinY: number;
    }

    const particles: ParticleMeta[] = [];

    for (let i = 0; i < cfg.count; i++) {
      const color = cfg.colors[i % cfg.colors.length];
      const mat = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: cfg.shape === 'rain' ? 0.45 : 0.72,
        roughness: 0.45,
        metalness: 0.1,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 32,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12
      );
      if (cfg.shape === 'rain') {
        mesh.rotation.z = 0.18;
      } else {
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
      }

      const scale = 0.6 + Math.random() * 0.9;
      mesh.scale.setScalar(scale);
      group.add(mesh);

      particles.push({
        mesh,
        vy: cfg.fallSpeed * (0.7 + Math.random() * 0.7),
        vx: cfg.driftX * (0.6 + Math.random() * 0.8),
        phase: Math.random() * Math.PI * 2,
        spinX: (Math.random() - 0.5) * cfg.spin * 2,
        spinY: (Math.random() - 0.5) * cfg.spin * 2,
      });
    }

    // Subtle pointer parallax for 3D depth feel
    let targetCamX = 0;
    let targetCamY = 0;
    const onPointerMove = (e: PointerEvent) => {
      targetCamX = (e.clientX / window.innerWidth - 0.5) * 1.4;
      targetCamY = -(e.clientY / window.innerHeight - 0.5) * 0.9;
    };
    window.addEventListener('pointermove', onPointerMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x += (targetCamX - camera.position.x) * 0.03;
      camera.position.y += (targetCamY - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      for (const p of particles) {
        p.mesh.position.y -= p.vy;
        p.mesh.position.x += p.vx + Math.sin(t * 0.9 + p.phase) * 0.006;

        if (cfg.spin > 0) {
          p.mesh.rotation.x += p.spinX;
          p.mesh.rotation.y += p.spinY;
        }

        if (p.mesh.position.y < -11) {
          p.mesh.position.y = 11;
          p.mesh.position.x = (Math.random() - 0.5) * 32;
        } else if (p.mesh.position.y > 11.5) {
          p.mesh.position.y = -10.5;
          p.mesh.position.x = (Math.random() - 0.5) * 32;
        }

        if (p.mesh.position.x > 17) p.mesh.position.x = -17;
        if (p.mesh.position.x < -17) p.mesh.position.x = 17;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      for (const p of particles) {
        (p.mesh.material as THREE.Material).dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [season]);

  return <div ref={mountRef} className="season-3d-canvas" aria-hidden="true" />;
};
