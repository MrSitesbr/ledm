'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE_NS from 'three';

/**
 * Maquete virtual do Residencial Apolo (three.js), baseada no HTML de referência "Parallax 3D".
 * - modo "secao": a câmera orbita o prédio conforme a rolagem dentro de `alvo` (seção alta com palco fixo).
 * - modo "fundo": órbita lenta ligada à rolagem do topo da página, para usar atrás do hero.
 * three.js só é carregado quando o componente aparece na tela.
 */

let modeloCache: Promise<THREE_NS.Group> | null = null;

async function carregarModelo(THREE: typeof THREE_NS) {
  if (!modeloCache) {
    modeloCache = (async () => {
      const [{ GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/libs/meshopt_decoder.module.js'),
      ]);
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync('/3d/residencial-apolo.glb');
      return gltf.scene;
    })();
  }
  const original = await modeloCache;
  void THREE;
  return original.clone(true);
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function Maquete3D({
  modo,
  alvoId,
  aoProgresso,
  className = '',
}: {
  modo: 'secao' | 'fundo';
  /** id do elemento cuja rolagem controla a órbita */
  alvoId: string;
  aoProgresso?: (p: number) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pronto, setPronto] = useState(false);
  const progressoRef = useRef(aoProgresso);
  progressoRef.current = aoProgresso;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelado = false;
    let limpar = () => {};

    const iniciar = async () => {
      const THREE = await import('three');
      if (cancelado) return;
      const leve = window.innerWidth < 700 || modo === 'fundo';

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: !leve, alpha: true });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
      renderer.shadowMap.enabled = !leve;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x2b4a7c, 60, 260);
      const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);

      // Céu de entardecer só para os reflexos (mesmo shader da referência)
      const pm = new THREE.PMREMGenerator(renderer);
      const ceu = new THREE.Scene();
      ceu.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(50, 32, 16),
          new THREE.ShaderMaterial({
            side: THREE.BackSide,
            vertexShader: 'varying vec3 v;void main(){v=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
            fragmentShader:
              'varying vec3 v;void main(){float h=v.y;vec3 c=mix(vec3(.95,.62,.38),vec3(.35,.55,.95),smoothstep(-.1,.7,h));c=mix(vec3(.12,.12,.14),c,smoothstep(-.15,.02,h));float s=pow(max(dot(v,normalize(vec3(.7,.35,.5))),0.),60.);c+=vec3(1.,.8,.55)*s*14.;gl_FragColor=vec4(c,1.);}',
          }),
        ),
      );
      scene.environment = pm.fromScene(ceu, 0.02).texture;

      scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x3a2a20, 0.06));
      const rim = new THREE.DirectionalLight(0x7fa6ff, 0.35);
      rim.position.set(-80, 60, -60);
      scene.add(rim);
      const sol = new THREE.DirectionalLight(0xffd9a0, 3.4);
      sol.castShadow = !leve;
      sol.shadow.mapSize.set(2048, 2048);
      sol.shadow.bias = -0.0004;
      sol.shadow.normalBias = 0.06;
      scene.add(sol, sol.target);

      const chao = new THREE.Mesh(
        new THREE.CircleGeometry(400, 64),
        new THREE.MeshStandardMaterial({ color: 0x1b1e24, roughness: 0.7, metalness: 0, envMapIntensity: 0.25 }),
      );
      chao.rotation.x = -Math.PI / 2;
      chao.receiveShadow = true;
      scene.add(chao);

      const palco = canvas.parentElement!;
      const ajustar = () => {
        const w = palco.clientWidth;
        const h = palco.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, leve ? 1.5 : 2));
        renderer.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };
      ajustar();
      window.addEventListener('resize', ajustar);

      let R = 60;
      let H = 60;
      let pronto3d = false;
      carregarModelo(THREE).then((m) => {
        if (cancelado) return;
        scene.add(m);
        m.traverse((o) => {
          const mesh = o as THREE_NS.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = !leve;
          mesh.receiveShadow = !leve;
          (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((mat) => {
            const M = mat as THREE_NS.MeshStandardMaterial;
            if (M.transparent || M.opacity < 1) {
              M.roughness = 0.08;
              M.metalness = 0.7;
              M.envMapIntensity = 1.4;
              M.depthWrite = false;
              M.side = THREE.DoubleSide;
              mesh.castShadow = false;
            } else M.envMapIntensity = 0.3;
            M.needsUpdate = true;
          });
        });
        let caixa = new THREE.Box3().setFromObject(m);
        const centro = caixa.getCenter(new THREE.Vector3());
        m.position.set(-centro.x, -caixa.min.y, -centro.z);
        caixa = new THREE.Box3().setFromObject(m);
        const tam = caixa.getSize(new THREE.Vector3());
        H = tam.y;
        R = Math.max(tam.x, tam.z, tam.y * 0.5);
        sol.position.set(R * 1.2, H * 1.4, R * 0.8);
        sol.target.position.set(0, H * 0.4, 0);
        const e = Math.max(R, H) * 1.2;
        Object.assign(sol.shadow.camera, { left: -e, right: e, top: e, bottom: -e, far: e * 5 });
        sol.shadow.camera.updateProjectionMatrix();
        pronto3d = true;
        setPronto(true);
      });

      const alvo = document.getElementById(alvoId);
      const progresso = () => {
        if (!alvo) return 0;
        const r = alvo.getBoundingClientRect();
        if (modo === 'secao') return clamp(-r.top / (r.height - window.innerHeight), 0, 1);
        // fundo: 0 com o hero no topo, 1 quando ele sai da tela
        return clamp(-r.top / r.height, 0, 1);
      };

      let p = progresso();
      let visivel = true;
      const obs = new IntersectionObserver(([e]) => (visivel = e.isIntersecting));
      obs.observe(palco);
      let raf = 0;
      const quadro = (t: number) => {
        raf = requestAnimationFrame(quadro);
        if (!visivel || !pronto3d) return;
        const alvoP = progresso();
        p += (alvoP - p) * 0.07;
        if (modo === 'secao') {
          const k = ease(p);
          const ang = -0.5 + k * Math.PI * 2.1;
          const rad = lerp(R * 1.55, R * 0.85, Math.sin(p * Math.PI) * 0.7 + 0.3 * k) + Math.sin(p * 9) * R * 0.05;
          const y = lerp(H * 0.85, H * 0.06, Math.pow(k, 0.85));
          cam.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
          cam.lookAt(0, lerp(H * 0.42, H * 0.14, k), 0);
          cam.fov = lerp(44, 58, k);
          progressoRef.current?.(p);
        } else {
          // Fundo do hero: giro lento contínuo + a rolagem aproxima e desce a câmera
          const ang = 0.6 + t * 0.00004 + p * 1.2;
          const rad = lerp(R * 1.3, R * 0.95, p);
          cam.position.set(Math.cos(ang) * rad, lerp(H * 0.7, H * 0.35, p), Math.sin(ang) * rad);
          cam.lookAt(0, H * 0.45, 0);
          cam.fov = 40;
        }
        cam.updateProjectionMatrix();
        renderer.render(scene, cam);
      };
      raf = requestAnimationFrame(quadro);

      limpar = () => {
        cancelAnimationFrame(raf);
        obs.disconnect();
        window.removeEventListener('resize', ajustar);
        renderer.dispose();
        pm.dispose();
      };
    };

    // Só carrega o 3D quando o palco chega perto da tela
    const gatilho = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          gatilho.disconnect();
          iniciar();
        }
      },
      { rootMargin: '300px' },
    );
    gatilho.observe(canvas);

    return () => {
      cancelado = true;
      gatilho.disconnect();
      limpar();
    };
  }, [modo, alvoId]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 size-full transition-opacity duration-1000 ${pronto ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}
