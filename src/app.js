/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Clock, AudioListener, Vector3 } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { SeedScene } from 'scenes';
import { init_audio, toggle_mute, play_all } from './audio';
import * as Dat from 'dat.gui'; //testoresto

// Initialize core ThreeJS components
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1250);
const clock = new Clock();
const scene = new SeedScene();
const renderer = new WebGLRenderer({ antialias: true });
const listener = new AudioListener();
camera.add( listener ); 

// testoresto
let bass;
let drums;
let vocals;
let other;
const gui = new Dat.GUI();
init_audio(listener);
var params = {
    play : function() {
        let sounds = play_all()
        if (sounds === undefined) {
            console.log("please wait for audio to load");
            return;
        }
        bass = sounds.bass;
        drums = sounds.drums;
        vocals = sounds.vocals;
        other = sounds.other;
    },
    play_bass: function() {
        toggle_mute(bass);
    },
    play_drums: function() {
        toggle_mute(drums);
    },
    play_vocals: function() {
        toggle_mute(vocals);
    },
    play_other: function() {
        toggle_mute(other);
    },
    file_name: ""

};
gui.add(params, 'play').name('play');
gui.add(params, 'play_bass').name('toggle bass');
gui.add(params, 'play_drums').name('toggle drums');
gui.add(params, 'play_vocals').name('toggle vocals');
gui.add(params, 'play_other').name('toggle other');
gui.add(params, "file_name").name('file name').onFinishChange(function (value) {
    var { exec, spawn } = require('child_process');
    console.log(require('child_process'))
});

// Set up camera initial position
const CAMERA_HEIGHT = 6;
camera.position.y = CAMERA_HEIGHT;

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
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
const velocity = new Vector3();
const direction = new Vector3();

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