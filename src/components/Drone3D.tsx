'use client';

import { useEffect, useRef, useState } from 'react';
import type * as THREE_NS from 'three';

/**
 * Drone DJI Mini 2 em 3D (three.js), portado do HTML de referência "secao-drone.html".
 * A câmera orbita o drone conforme a rolagem dentro de `alvo`; hélices giram com rastro de velocidade
 * e aceleram quando a pessoa rola. three.js e o .glb só carregam quando o palco chega perto da tela.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sm3 = (t: number) => t * t * (3 - 2 * t);

// Keyframes da câmera: progresso, ângulo (graus), raio, altura, alvo x/y/z, fov
const K = [
  [0, 35, 24, 9, 0, 0, 0, 38],
  [0.12, 8, 10, 1.2, 0, -0.3, 2.2, 40],
  [0.32, -38, 9, 5.5, -3.3, 0.6, 2.3, 38],
  [0.52, -130, 10, 7, 0, 0, 0, 40],
  [0.72, -205, 10, -3.2, 0, 0.3, 0, 44],
  [0.9, -270, 13, 3, 0, 0, 0, 42],
  [1, -310, 17, 5, 0, 0, 0, 40],
];
function caminho(p: number) {
  let i = 0;
  while (i < K.length - 2 && p > K[i + 1][0]) i++;
  const a = K[i];
  const b = K[i + 1];
  const t = sm3(clamp((p - a[0]) / (b[0] - a[0]), 0, 1));
  return a.map((v, j) => lerp(v, b[j], t));
}

// Pares de pás de cada motor e o sentido de giro
const HELICES: [string, string, number][] = [
  ['polySurface58_10', 'polySurface61_11', 1],
  ['polySurface80_18', 'polySurface81_19', -1],
  ['polySurface84_20', 'polySurface89_23', -1],
  ['polySurface95_29', 'polySurface102_34', 1],
];

export function Drone3D({ alvoId, aoProgresso, aoCarregar }: { alvoId: string; aoProgresso?: (p: number) => void; /** avisa quando o carregamento termina (com ou sem sucesso) */ aoCarregar?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pronto, setPronto] = useState(false);
  const progressoRef = useRef(aoProgresso);
  progressoRef.current = aoProgresso;
  const carregarRef = useRef(aoCarregar);
  carregarRef.current = aoCarregar;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelado = false;
    let limpar = () => {};

    const iniciar = async () => {
      const [THREE, { GLTFLoader }, { MeshoptDecoder }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/libs/meshopt_decoder.module.js'),
      ]);
      if (cancelado) return;
      const leve = window.innerWidth < 700;

      let renderer: THREE_NS.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        carregarRef.current?.();
        return; // sem WebGL: a seção segue só com os textos
      }
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 500);

      // Céu só para os reflexos
      const pm = new THREE.PMREMGenerator(renderer);
      const ceu = new THREE.Scene();
      ceu.add(
        new THREE.Mesh(
          new THREE.SphereGeometry(50, 32, 16),
          new THREE.ShaderMaterial({
            side: THREE.BackSide,
            vertexShader: 'varying vec3 v;void main(){v=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
            fragmentShader:
              'varying vec3 v;void main(){float h=v.y;vec3 c=mix(vec3(.55,.75,.95),vec3(.25,.45,.9),smoothstep(-.1,.7,h));c=mix(vec3(.12,.12,.14),c,smoothstep(-.15,.02,h));float s=pow(max(dot(v,normalize(vec3(.7,.35,.5))),0.),60.);c+=vec3(1.,.95,.85)*s*14.;gl_FragColor=vec4(c,1.);}',
          }),
        ),
      );
      scene.environment = pm.fromScene(ceu, 0.02).texture;

      scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x3a2a20, 0.06));
      const rim = new THREE.DirectionalLight(0x7fa6ff, 0.45);
      rim.position.set(-8, 5, -8);
      const preenche = new THREE.DirectionalLight(0x9fb8ff, 0.3);
      preenche.position.set(2, -8, 4);
      const sol = new THREE.DirectionalLight(0xffe2b8, 1.9);
      sol.position.set(9, 14, 8);
      sol.castShadow = true;
      const sm = leve ? 1024 : 2048;
      sol.shadow.mapSize.set(sm, sm);
      sol.shadow.bias = -0.0004;
      sol.shadow.normalBias = 0.03;
      Object.assign(sol.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 60 });
      scene.add(rim, preenche, sol);

      const chao = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.ShadowMaterial({ opacity: 0.6 }));
      chao.rotation.x = -Math.PI / 2;
      chao.position.y = -6;
      chao.receiveShadow = true;
      scene.add(chao);

      const palco = canvas.parentElement!;
      const ajustar = () => {
        const w = palco.clientWidth;
        const h = palco.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, leve ? 1.5 : 2));
        renderer.setSize(w, h, false);
        cam.aspect = w / h;
        // No desktop o drone fica um pouco à direita, deixando espaço para os textos
        if (w > 900) cam.setViewOffset(w, h, -w * 0.1, 0, w, h);
        else cam.clearViewOffset();
        cam.updateProjectionMatrix();
      };
      ajustar();
      window.addEventListener('resize', ajustar);

      const pivo = new THREE.Group();
      scene.add(pivo);
      const helices: { grp: THREE_NS.Group; dir: number }[] = [];
      let pronto3d = false;

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader
        .loadAsync('/3d/drone.glb')
        .then((g) => {
          if (cancelado) return;
          const m = g.scene;
          scene.add(m);
          m.updateMatrixWorld(true);

          // Hélices: as 2 pás de cada motor vão para um grupo com pivô no centro do motor
          HELICES.forEach(([a, b, dir]) => {
            const A = m.getObjectByName(a);
            const B = m.getObjectByName(b);
            if (!A || !B) return;
            const bb = new THREE.Box3().setFromObject(A).union(new THREE.Box3().setFromObject(B));
            const c = bb.getCenter(new THREE.Vector3());
            const sz = bb.getSize(new THREE.Vector3());
            const grp = new THREE.Group();
            grp.position.copy(c);
            m.add(grp);
            m.updateMatrixWorld(true);
            grp.attach(A);
            grp.attach(B);
            const r = Math.max(sz.x, sz.z) / 2;
            // Rastro de velocidade: arco que some atrás de cada pá
            [A, B].forEach((pa) => {
              const q = new THREE.Box3().setFromObject(pa).getCenter(new THREE.Vector3());
              grp.worldToLocal(q);
              const al = Math.atan2(q.z, q.x);
              const N = 14;
              const r0 = r * 0.3;
              const vs: number[] = [];
              const cs: number[] = [];
              const ix: number[] = [];
              for (let i = 0; i <= N; i++) {
                const f = i / N;
                const an = al + (dir > 0 ? 1 : -1) * f * 1.5;
                const op = 0.55 * Math.pow(1 - f, 1.6);
                vs.push(Math.cos(an) * r0, 0, Math.sin(an) * r0, Math.cos(an) * r, 0, Math.sin(an) * r);
                cs.push(0.85, 0.92, 1, op * 0.5, 0.85, 0.92, 1, op);
                if (i < N) {
                  const k = i * 2;
                  ix.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
                }
              }
              const gm = new THREE.BufferGeometry();
              gm.setAttribute('position', new THREE.Float32BufferAttribute(vs, 3));
              gm.setAttribute('color', new THREE.Float32BufferAttribute(cs, 4));
              gm.setIndex(ix);
              grp.add(new THREE.Mesh(gm, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide })));
            });
            helices.push({ grp, dir });
          });

          m.traverse((o) => {
            const mesh = o as THREE_NS.Mesh;
            if (!mesh.isMesh) return;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mesh.castShadow = !mats[0].transparent;
            mesh.receiveShadow = true;
            mats.forEach((mat) => {
              const M = mat as THREE_NS.MeshStandardMaterial;
              if (M.metalness !== undefined) M.envMapIntensity = 0.9;
              M.needsUpdate = true;
            });
          });

          const caixa = new THREE.Box3().setFromObject(m);
          const c = caixa.getCenter(new THREE.Vector3());
          const s = caixa.getSize(new THREE.Vector3());
          const k = 10 / Math.max(s.x, s.y, s.z);
          pivo.add(m);
          m.scale.setScalar(k);
          m.position.set(-c.x * k, -c.y * k, -c.z * k);
          pronto3d = true;
          setPronto(true);
          carregarRef.current?.();
        })
        .catch((erro) => {
          console.error('Drone 3D: falha ao carregar o modelo', erro);
          carregarRef.current?.();
        });

      const alvo = document.getElementById(alvoId);
      const progresso = () => {
        if (!alvo) return 0;
        const r = alvo.getBoundingClientRect();
        return clamp(-r.top / (r.height - window.innerHeight), 0, 1);
      };

      let p = progresso();
      let ultimo = performance.now();
      let giro = 0;
      let visivel = true;
      const obs = new IntersectionObserver(([e]) => (visivel = e.isIntersecting));
      obs.observe(palco);
      let raf = 0;
      const quadro = (agora: number) => {
        raf = requestAnimationFrame(quadro);
        const dt = Math.min((agora - ultimo) / 1000, 0.05);
        ultimo = agora;
        if (!visivel || !pronto3d) return;
        const dp = progresso() - p;
        p += dp * 0.07;
        const k = caminho(p);
        const a = (k[1] * Math.PI) / 180;
        cam.position.set(Math.sin(a) * k[2], k[3], Math.cos(a) * k[2]);
        cam.lookAt(k[4], k[5], k[6]);
        if (Math.abs(cam.fov - k[7]) > 0.01) {
          cam.fov = k[7];
          cam.updateProjectionMatrix();
        }
        // Drone pairando + hélices (aceleram com a rolagem)
        const T = agora / 1000;
        pivo.position.y = Math.sin(T * 1.6) * 0.12;
        pivo.rotation.z = Math.sin(T * 1.1) * 0.025;
        pivo.rotation.x = Math.sin(T * 0.9 + 1) * 0.02;
        giro += dt * (95 + Math.abs(dp) * 1500);
        helices.forEach((h) => (h.grp.rotation.y = giro * h.dir));
        renderer.render(scene, cam);
        progressoRef.current?.(p);
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

    // Carregamento sob demanda (para o PageSpeed): só quando o palco chega perto da tela.
    let iniciado = false;
    const gatilho = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || iniciado) return;
      iniciado = true;
      gatilho.disconnect();
      iniciar();
    }, { rootMargin: '300px' });
    gatilho.observe(canvas);

    return () => {
      cancelado = true;
      gatilho.disconnect();
      limpar();
    };
  }, [alvoId]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 size-full transition-opacity duration-1000 ${pronto ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
