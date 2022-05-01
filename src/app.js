/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Clock } from 'three';
import * as THREE from 'three';
import { SeedScene } from 'scenes';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Initialize core ThreeJS components
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1250);
const clock = new Clock();
const scene = new SeedScene();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera initial position
const CAMERA_HEIGHT = 6;
camera.position.y = CAMERA_HEIGHT;

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

//// Set up controls
const controls = new PointerLockControls(camera, document.body);
window.addEventListener('click', () => {
    if (controls.isLocked) controls.unlock();
    else controls.lock();
});
scene.add(controls.getObject());

// Bind key strokes with camera movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

const onKeyDown = function(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if (canJump === true) velocity.y += 100;
            canJump = false;
    }
};

const onKeyUp = function (event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Resize Handler
const onWindowResize = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
onWindowResize();
window.addEventListener('resize', onWindowResize, false);

// Render loop
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const animate = (timeStamp) => {
    requestAnimationFrame(animate);

    // Get change in time from last frame
    const delta = clock.getDelta();

    // Call update for each object in the updateList
    for (const obj of scene.state.updateList) {
        // Some animations rely on the current time (timeStamp)
        if (obj.name === "pond" || obj.name === "flower") obj.update(timeStamp);
        else obj.update(delta); // others rely on the change in time (delta)
    }

    // Update camera position
    if (controls.isLocked) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 50.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < CAMERA_HEIGHT) {
            velocity.y = 0;
            controls.getObject().position.y = CAMERA_HEIGHT;
            canJump = true;
        }
    }

    renderer.render(scene, camera);
};
animate();