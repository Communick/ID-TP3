import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';

// Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Grass ground
  const textureLoader = new THREE.TextureLoader();
  const grassTexture = textureLoader.load("./grass.jpg");
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);

  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshPhongMaterial({map: grassTexture});
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2; // horizontal
  scene.add(plane);

  // Skybox
  const skyTexture = textureLoader.load("./horn-koppe_spring_4k.png");
  const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
  const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 5);
  scene.add(light);

  // Camera position
  camera.position.set(0, 5, 10);


const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add(cube);

cube.position.y += (cube.geometry.parameters.height * cube.scale.y) / 2;

const cubeBB = new THREE.Box3().setFromObject(cube);
const planeBB = new THREE.Box3().setFromObject(plane);

let keys = {};
let targetPos = cube.position.clone();
const xSpeed = 0.1;
const zSpeed = 0.1;
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup",   (e) => { keys[e.code] = false; });

let velocityY = 0;
const gravity = -0.02; 
const jumpStrength = 0.5;
var isOnGround = false;

  // Animate
  function animate() {
    const cubeBB = new THREE.Box3().setFromObject(cube);
    const planeBB = new THREE.Box3().setFromObject(plane);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (isOnGround == false) {
        setTimeout(() => {
            velocityY += gravity;
            }, 100);
        
    }
    cube.position.y += velocityY;

    const groundY = (cube.geometry.parameters.height * cube.scale.y) / 2;

    if (cube.position.y <= groundY) {
        cube.position.y = groundY;
        velocityY = 0;          // stop falling
        isOnGround = true;
    } else {
        isOnGround = false;
    }
    if (cubeBB.intersectsBox(planeBB)) {
    // Simple collision resolution: put cube back on top of plane
        if (keys["Space"] && isOnGround) {
            velocityY = jumpStrength; 
            isOnGround = false;
        }
    }
    if (keys["KeyW"]) targetPos.z -= zSpeed;
    if (keys["KeyS"]) targetPos.z += zSpeed;
    if (keys["KeyA"]) targetPos.x -= xSpeed;
    if (keys["KeyD"]) targetPos.x += xSpeed;
    cube.position.lerp(targetPos, 0.05);
}


animate();