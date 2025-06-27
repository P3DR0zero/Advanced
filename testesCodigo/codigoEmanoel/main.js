import * as THREE from 'three';
import { Keys } from './keys.js';

// Cena, câmera e renderizador
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Fundo branco

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Função para criar o carro primitivo (retângulo + cilindros)
function createCar() {
  const car = new THREE.Group();  // Agrupa as partes do carro

  // Corpo do carro (vermelho)
  const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
  const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Vermelho
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.rotation.y = Math.PI / 2; // Corrige direção do corpo
  car.add(body);

  // Rodas (cilindros pretos)
  const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32);
  const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Preto

  const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontLeftWheel.rotation.x = Math.PI / 2;
  frontLeftWheel.position.set(-1.5, -0.5, 1);
  car.add(frontLeftWheel);

  const frontRightWheel = frontLeftWheel.clone();
  frontRightWheel.position.set(1.5, -0.5, 1);
  car.add(frontRightWheel);

  const rearLeftWheel = frontLeftWheel.clone();
  rearLeftWheel.position.set(-1.5, -0.5, -1);
  car.add(rearLeftWheel);

  const rearRightWheel = frontRightWheel.clone();
  rearRightWheel.position.set(1.5, -0.5, -1);
  car.add(rearRightWheel);

  return car;
}

// Criar o carro e adicionar à cena
const car = createCar();
car.position.y = 0.25; // Eleva o carro para as rodas ficarem visíveis
scene.add(car);

// Plano de chão branco
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.75;
scene.add(floor);

// Grade de referência no chão (preta)
const gridHelper = new THREE.GridHelper(30, 30, 0x000000, 0x000000);
scene.add(gridHelper);

// Eixos de referência
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Iniciar controle de teclas e animação
Keys.listen(); // Escuta teclas
Keys.animate(car, renderer, scene, camera); // Loop de animação
