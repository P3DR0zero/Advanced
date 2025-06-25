import * as THREE from 'three';
import { Keys } from './keys.js';

// Cria cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cria um cubo
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Posição da câmera
camera.position.z = 5;

// Inicializa controles de teclado e animação
Keys.move(); // Começa a escutar teclas
Keys.animate(cube, renderer, scene, camera); // Inicia o loop de animação
