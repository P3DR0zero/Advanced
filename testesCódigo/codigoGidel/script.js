import * as THREE from 'three';

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 6); // posição inicial, será atualizada pela função

// Eixos de referência
scene.add(new THREE.AxesHelper(5));

// Cubo vermelho (personagem)
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.y = 0.9;
scene.add(box);

// Plano (chão)
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Grid do chão
scene.add(new THREE.GridHelper(30, 30));

// Luzes
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Controle de teclas
const keysPressed = {};
document.addEventListener('keydown', (event) => {
  keysPressed[event.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false;
});

// Lógica de movimento
let boxRotationY = 0;

function updateMovement() {
  const rotationSpeed = 0.05;
  const moveSpeed = 0.1;

  // Rotacionar personagem
  if (keysPressed['a']) boxRotationY += rotationSpeed;
  if (keysPressed['d']) boxRotationY -= rotationSpeed;

  box.rotation.y = boxRotationY;

  // Mover personagem na direção em que está olhando
  if (keysPressed['w'] || keysPressed['s']) {
    const direction = keysPressed['s'] ? 1 : -1;
    const moveX = Math.sin(boxRotationY) * moveSpeed * direction;
    const moveZ = Math.cos(boxRotationY) * moveSpeed * direction;
    box.position.x += moveX;
    box.position.z += moveZ;
  }
}

// Atualiza a câmera para seguir o personagem
function updateCamera() {
  const cameraOffset = new THREE.Vector3(0, 3, 6); // cima e atrás do cubo
  const rotatedOffset = cameraOffset
    .clone()
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), boxRotationY);

  camera.position.copy(box.position.clone().add(rotatedOffset));
  camera.lookAt(box.position);
}

// Loop de animação
function animate() {
  requestAnimationFrame(animate);
  updateMovement();
  updateCamera();
  renderer.render(scene, camera);
}
animate();
