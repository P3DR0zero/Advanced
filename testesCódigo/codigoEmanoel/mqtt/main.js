import * as THREE from 'ws://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

    const client = mqtt.connect('ws://mqtt.ect.ufrn.br', {
      clientId: 'testeMQTT',
      username: 'mqtt',
      password: 'lar_mqtt'
    });

client.on('connect', () => {
  console.log('✅ Conectado ao Mosquitto');
  client.subscribe('pico/joystick');
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('📦 Recebido:', data);
    updateJoystick(data.x, data.y);
  } catch (e) {
    console.error('Erro ao interpretar JSON:', e);
  }
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function updateJoystick(x, y) {
  cube.position.x = (x - 50) / 10;
  cube.position.y = -(y - 50) / 10;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
