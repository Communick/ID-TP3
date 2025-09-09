import * as THREE from 'three';

// Wait for A-Frame to load
AFRAME.registerComponent('player-movement', {
  init: function () {

const player = document.querySelector('#player');
    const speed = 5;       // movement speed
    const jumpStrength = 5; // jump velocity
    let canJump = false;

    // Detect when player touches the ground
    player.addEventListener('collide', (e) => {
      if (e.detail.body.el.tagName === 'A-PLANE') {
        canJump = true;
      }
    });

    document.addEventListener('keydown', (e) => {
      const body = player.body; // cannon.js body
      if (!body) return;

      if (e.code === 'KeyW') body.velocity.z = -speed;
      if (e.code === 'KeyS') body.velocity.z = speed;
      if (e.code === 'KeyA') body.velocity.x = -speed;
      if (e.code === 'KeyD') body.velocity.x = speed;

      if (e.code === 'Space' && canJump) {
        body.velocity.y = jumpStrength;
        canJump = false;
      }
    });

    document.addEventListener('keyup', (e) => {
      const body = player.body;
      if (!body) return;

      if (['KeyW','KeyS'].includes(e.code)) body.velocity.z = 0;
      if (['KeyA','KeyD'].includes(e.code)) body.velocity.x = 0;
    });
}});