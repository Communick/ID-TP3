AFRAME.registerComponent('player-controls', {
  init: function () {
    const el = this.el;
    const speed = 5;       // movement speed
    const jumpForce = 5;   // jump strength
    let canJump = false;

    // Track which keys are pressed
    this.keys = {};
    window.addEventListener('keydown', e => this.keys[e.code] = true);
    window.addEventListener('keyup', e => this.keys[e.code] = false);

    // Physics body setup
    el.addEventListener('body-loaded', () => {
      el.body.fixedRotation = true;          // lock rotation
      el.body.updateMassProperties();
      el.body.linearDamping = 0.9;           // smooth slowdown when keys are released
    });

    // Ground detection
    el.addEventListener('collide', (e) => {
      if (e.detail.body.el.tagName === 'A-PLANE') {
        canJump = true;
      }
    });

    this.canJump = () => canJump;
    this.resetJump = () => { canJump = false; };
    this.speed = speed;
    this.jumpForce = jumpForce;
  },

  tick: function () {
    const el = this.el;
    const body = el.body;
    const keys = this.keys;
    if (!body) return;

    // Movement direction
    let moveX = 0;
    let moveZ = 0;

    if (keys["KeyW"]) moveZ -= 1;
    if (keys["KeyS"]) moveZ += 1;
    if (keys["KeyA"]) moveX -= 1;
    if (keys["KeyD"]) moveX += 1;

    // Normalize diagonal movement
    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len;
      moveZ /= len;
    }

    // Apply smooth velocity
    body.velocity.x = moveX * this.speed;
    body.velocity.z = moveZ * this.speed;

    // Jump
    if (keys["Space"] && this.canJump()) {
      body.velocity.y = this.jumpForce;
      this.resetJump();
    }
  }
});
document.querySelector('#player').setAttribute('player-controls', '');