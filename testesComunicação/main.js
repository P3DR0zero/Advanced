import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Keys } from './keys.js';

// Cena, câmera e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Grade de referência no chão
const gridHelper = new THREE.GridHelper(30, 30);
scene.add(gridHelper);

// Eixos de referência
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Carregar modelo GLB no lugar do cubo
const loader = new GLTFLoader();
loader.load(
  'modelo/carro2.glb',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.03, 0.03, 0.03);
    model.position.set(0, 0, 0);
    scene.add(model);

    // Iniciar controles e animação com o modelo
    Keys.listen();
    Keys.animate(model, renderer, scene, camera);
  },
  undefined,
  function (error) {
    console.error('Erro ao carregar o modelo:', error);
  }
);