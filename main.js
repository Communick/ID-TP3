import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;   // smooth movement
controls.enablePan = false;      // no panning

// Constraints
controls.minDistance = 5;   // min zoom distance
controls.maxDistance = 10;  // max zoom distance
controls.minPolarAngle = Math.PI / 6; // 30° from vertical
controls.maxPolarAngle = Math.PI / 2; // 90° (horizontal view)*/
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Grass ground
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load("./grass.jpg");
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(200, 200);

const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
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
controls.target.copy(cube.position); // orbit around the cube

let keys = {};
let targetPos = cube.position.clone();
const xSpeed = 0.1;
const zSpeed = 0.1;
let zoomOffset = 10;
document.addEventListener("keydown", (e) => { keys[e.code] = true; });
document.addEventListener("keyup",   (e) => { keys[e.code] = false; });
document.addEventListener( 'mousewheel', (event) => {
    zoomOffset +=event.deltaY*0.01;
    zoomOffset = Math.max(6, Math.min(25, zoomOffset));
});


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
    // Compute camera-forward and camera-right on horizontal plane
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir); // points where camera is looking
    camDir.y = 0; // flatten to horizontal plane
    camDir.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, new THREE.Vector3(0,1,0)).normalize();

    // Move cube relative to camera
    if (keys["KeyS"]) targetPos.add(camDir.clone().multiplyScalar(xSpeed));
    if (keys["KeyW"]) targetPos.add(camDir.clone().multiplyScalar(-xSpeed));
    if (keys["KeyA"]) targetPos.add(camRight.clone().multiplyScalar(-zSpeed));
    if (keys["KeyD"]) targetPos.add(camRight.clone().multiplyScalar(zSpeed));
    cube.position.lerp(targetPos, 0.05);

    controls.target.copy(cube.position);

    controls.update();
}


animate();