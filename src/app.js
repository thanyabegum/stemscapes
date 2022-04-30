/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, ColorKeyframeTrack, Audio, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import { init_audio, toggle_mute, play_all, get_sounds } from './audio';

import * as THREE from 'three'
import * as Dat from 'dat.gui'; //testoresto
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { ResultSetDependencies } from 'mathjs';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000 );
const renderer = new WebGLRenderer({ antialias: true });
const listener = new THREE.AudioListener();
camera.add( listener ); 

// music stuff
let bass;
let drums;
let vocals;
let other;
let sustain_bass = false;
let sustain_drums = false;
let sustain_vocals = false;
let sustain_other = false;
const gui = new Dat.GUI();

function wait_init_and_play(){
    let s = get_sounds();
    if(s.bass !== undefined && s.drums !== undefined && s.other !== undefined && s.vocals !== undefined) {
        console.log("sounds loaded");
        if(!s.other.isPlaying) {
            let sounds = play_all();
            if (sounds === undefined) {
                console.log("please wait for audio to load");
                return undefined;
            }
            bass = sounds.bass;
            drums = sounds.drums;
            vocals = sounds.vocals;
            other = sounds.other;
            }
        return;
    }
    else {
        setTimeout(wait_init_and_play, 250);
    }
}

let params = {
    play : function() {
        if(bass === undefined) {
            init_audio(listener);
        }        
        wait_init_and_play();
        return "success"
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
    file_name: "frank.mp3",
    load: function() {
        init_audio(listener);
        wait_init_and_play();
    },
    toggle_sustain: function() {
        if(camera.position.x > 0 && camera.position.z > 0) {
            sustain_bass = !sustain_bass
            console.log(sustain_bass);
        }
        if(camera.position.x > 0 && camera.position.z < 0) {
            sustain_drums = !sustain_drums
            console.log(sustain_drums);
        }
        if(camera.position.x < 0 && camera.position.z > 0) {
            sustain_other = !sustain_other
            console.log(sustain_other);
        }
        if(camera.position.x < 0 && camera.position.z < 0) {
            sustain_vocals = !sustain_vocals
            console.log(sustain_vocals);
        }
    }

};

gui.add(params, 'play').name('play');
// gui.add(params, 'play_bass').name('toggle bass');
// gui.add(params, 'play_drums').name('toggle drums');
// gui.add(params, 'play_vocals').name('toggle vocals');
// gui.add(params, 'play_other').name('toggle other');
gui.add(params, "file_name").name('file name').onFinishChange(function (value) {
    var objReq = new XMLHttpRequest();
    console.log("sending request")
    objReq.open("GET", "http://localhost:8888" + "?filename=" + value, false);
    objReq.send(null);
});
// gui.add(params, "load");
gui.add(params, "toggle_sustain").name("toggle sustain (p)");

let raycaster;

// Set up camera
//camera.position.set(75, window.innerWidth / window.innerHeight, 1, 1000 );
//camera.position.set(0, 0, 0);
camera.position.y = 1;

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new PointerLockControls( camera, document.body );

window.addEventListener( 'click', function () {

    controls.lock();
    params.play();

} );

scene.add( controls.getObject() );

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const onKeyDown = function ( event ) {
    console.log(event.code)
    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = (true && vocals !== undefined);
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = (true && vocals !== undefined);
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = (true && vocals !== undefined);
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = (true && vocals !== undefined);
            break;

        case 'Space':
            if ( canJump === true && vocals !== undefined) velocity.y += 350;
            canJump = false;
            break;

        case 'KeyP':
            params.toggle_sustain();
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

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
            break;

    }

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );


// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);

    if(camera.position.x > 0 && camera.position.z > 0) {
        if(bass !== undefined){
            if(bass.gain.gain.value == 0.0) {
                console.log("bass")
                params.play_bass();
            }
        }

    }
    else if (!sustain_bass) {
        if(bass !== undefined){
            if(bass.gain.gain.value != 0.0) {                
                params.play_bass();
            }
        }
    }
    if(camera.position.x > 0 && camera.position.z < 0) {
        if(drums !== undefined){
            if(drums.gain.gain.value == 0.0) {
                console.log("drums")
                params.play_drums();
            }
        }

    }
    else if (!sustain_drums) {
        if(drums !== undefined){
            if(drums.gain.gain.value != 0.0) {                
                params.play_drums();
            }
        }
    }
    if(camera.position.x < 0 && camera.position.z > 0) {
        if(other !== undefined){
            if(other.gain.gain.value == 0.0) {
                console.log("other")
                params.play_other();
            } 
        }       
    }
    else if (!sustain_other) {
        if(other !== undefined){
            if(other.gain.gain.value != 0.0) {                
                params.play_other();
            } 
        }       
    }
    if(camera.position.x < 0 && camera.position.z < 0) {
        if(vocals !== undefined){
            if(vocals.gain.gain.value == 0.0) {
                console.log("vocals")
                params.play_vocals();
            }  
        }
    }
    else if (!sustain_vocals) {
        if(vocals !== undefined){
            if(vocals.gain.gain.value != 0.0) {
                params.play_vocals();
            }  
        }
    }

    const time = performance.now();
    if ( controls.isLocked === true ) {

        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );
        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

        controls.moveRight( - velocity.x * delta );
        controls.moveForward( - velocity.z * delta );

        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if ( controls.getObject().position.y < 10 ) {

            velocity.y = 0;
            controls.getObject().position.y = 10;

            canJump = true;

        }
    }
    prevTime = time;

    renderer.render(scene, camera);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);