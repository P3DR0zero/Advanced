import * as THREE from 'three';

export class Keys {
  static pressed = {}; // Teclas pressionadas

  static listen() {
    document.addEventListener('keydown', (event) => {
      Keys.pressed[event.key.toLowerCase()] = true;
    });

    document.addEventListener('keyup', (event) => {
      Keys.pressed[event.key.toLowerCase()] = false;
    });
  }

  static animate(cube, renderer, scene, camera) {
    const moveSpeed = 0.1;
    const rotationSpeed = 0.05;
    let rotationY = 0;

    function loop() {
      requestAnimationFrame(loop);

      // Rotação (a = esquerda, d = direita)
      if (Keys.pressed['a']) rotationY += rotationSpeed;
      if (Keys.pressed['d']) rotationY -= rotationSpeed;
      cube.rotation.y = rotationY;

      // Movimento (w = frente, s = trás)
      if (Keys.pressed['w'] || Keys.pressed['s']) {
        const direction = Keys.pressed['s'] ? 1 : -1;
        const moveX = Math.sin(rotationY) * moveSpeed * direction;
        const moveZ = Math.cos(rotationY) * moveSpeed * direction;
        cube.position.x += moveX;
        cube.position.z += moveZ;
      }

      // Atualizar câmera para seguir o cubo
      const cameraOffset = new THREE.Vector3(0, 3, 6);
      const rotatedOffset = cameraOffset.clone().applyAxisAngle(
        new THREE.Vector3(0, 1, 0), rotationY
      );
      camera.position.copy(cube.position.clone().add(rotatedOffset));
      camera.lookAt(cube.position);

      renderer.render(scene, camera);
    }

    loop();
  }
}
  