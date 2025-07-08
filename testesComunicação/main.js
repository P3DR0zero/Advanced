import * as THREE from 'three';
import mqtt from 'mqtt';

// Configuração da cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cubo (personagem)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Grade e eixos
scene.add(new THREE.GridHelper(30, 30));
scene.add(new THREE.AxesHelper(5));

// Posição da câmera atrás do cubo
camera.position.set(0, 3, 6);
camera.lookAt(cube.position);

// Rotação alvo (do sensor) e rotação atual (no cubo) no eixo Y
let targetY = 0;
let currentY = 0;

// Conecta ao broker MQTT
const client = mqtt.connect("ws://mqtt.ect.ufrn.br:1884/mqtt", {
  username: "mqtt",
  password: "lar_mqtt",
  clientId: "CodigoNossoQueEstasEmC",
  clean: true,
});

client.on("connect", () => {
  console.log("✅ Conectado ao MQTT");
  client.subscribe("R/IOT/CTRL");
});

client.on("message", (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const toRad = deg => deg * Math.PI / 180;
    targetY = toRad(parseFloat(data.z) || 0);
  } catch (err) {
    console.error("Erro ao processar MQTT:", err);
  }
});

// Loop de animação com suavização
function animate() {
  requestAnimationFrame(animate);

  // Suaviza a rotação (efeito mola)
  const lerpFactor = 0.1;
  currentY += (targetY - currentY) * lerpFactor;
  cube.rotation.y = currentY;

  // Atualiza a câmera para olhar onde o cubo aponta
  const cameraOffset = new THREE.Vector3(0, 3, 6);
  const rotatedOffset = cameraOffset.clone().applyAxisAngle(
    new THREE.Vector3(0, 1, 0), currentY
  );
  camera.position.copy(cube.position.clone().add(rotatedOffset));
  camera.lookAt(cube.position);

  renderer.render(scene, camera);
}

animate();
