export class Keys {
    static pressed = {}; // Armazena quais teclas estão pressionadas
  
    static move() {
      document.addEventListener('keydown', (event) => {
        Keys.pressed[event.code] = true;
      });
  
      document.addEventListener('keyup', (event) => {
        Keys.pressed[event.code] = false;
      });
    }
  
    static animate(cube, renderer, scene, camera) {
      const moveSpeed = 0.1; // Velocidade de movimento
  
      function loop() {
        requestAnimationFrame(loop); // Loop de animação
  
        // Move o cubo com base nas teclas pressionadas
        if (Keys.pressed['ArrowUp']) cube.position.z -= moveSpeed;
        if (Keys.pressed['ArrowDown']) cube.position.z += moveSpeed;
        if (Keys.pressed['ArrowLeft']) cube.position.x -= moveSpeed;
        if (Keys.pressed['ArrowRight']) cube.position.x += moveSpeed;
        const cameraOffset = new THREE.Vector3(0, 3, 6); // cima e atrás do cubo
        const rotatedOffset = cameraOffset
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), boxRotationY);
      
        camera.position.copy(box.position.clone().add(rotatedOffset));
        camera.lookAt(box.position);
  
        renderer.render(scene, camera); // Renderiza a cena
      }
  
      loop(); // Inicia a animação
    }
  }
  