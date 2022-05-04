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
import { init_audio, toggle_mute, play_all, get_sounds, delete_tracks } from './audio';

import * as Dat from 'dat.gui'; //testoresto
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { ResultSetDependencies } from 'mathjs';

// Initialize core ThreeJS components
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1250);
const clock = new Clock();
const scene = new SeedScene();
const renderer = new WebGLRenderer({ antialias: true });
const listener = new THREE.AudioListener();
camera.add( listener ); 

// music stuff
let bass = undefined;
let drums = undefined;
let vocals = undefined;
let other = undefined;
let sustain_bass = false;
let sustain_drums = false;
let sustain_vocals = false;
let sustain_other = false;
let song_name;
let loading = false;
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
    file_name: "royaltyfree1.mp3",
    load: function() {
        play_all();
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
let folder = gui.addFolder('')
let text = gui.add(params, "file_name").name('file name')
gui.add(params, "toggle_sustain").name("sustain (=)");

function load_new_song(value){    
    try {
        loading = true;
        var objReq = new XMLHttpRequest();
        console.log("sending request")
        objReq.open("GET", "http://localhost:8888" + "?filename=" + value, true);
        objReq.onload = function(){
            if(bass && drums && vocals && other){
                bass.pause();
                drums.pause();
                vocals.pause();
                other.pause();
            }
            bass = undefined;
            drums = undefined;
            vocals = undefined;
            other = undefined;
            sustain_bass = false;
            sustain_drums = false;
            sustain_vocals = false;
            sustain_other = false;
            delete_tracks();
            console.log("processed")
            params.play();
            loading=false;
        }
        objReq.onerror = function(e){
            console.log("error", e);
        }
        objReq.send(null);
    }
    catch(error) {
        console.log(error)        
    }
}



let raycaster;

// Set up camera
//camera.position.set(75, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, 0, 0);
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

// Set up controls
const controls = new PointerLockControls( camera, document.body );

window.addEventListener( 'click', function () {

    if (controls.isLocked) controls.unlock();
    else controls.lock();
    if(loading) console.log("LOADING...");
    else{
        if(!bass) params.play();
        else if(!bass.isPlaying) params.play();
    }
    

} );

scene.add( controls.getObject() );

// Bind key strokes with camera movement
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();

const onKeyDown = function ( event ) {
    switch ( event.code ) {        
        case 'ArrowUp':
        case 'KeyW':
            moveForward = (true);
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = (true);
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = (true);
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = (true);
            break;
        case 'Space':
            if (canJump === true) velocity.y += 100;
            canJump = false;
            break;

        case 'Equal':
            if(controls.isLocked && other !== undefined) params.toggle_sustain();
            break;
        case 'Enter':            
            if(text.getValue() != song_name) load_new_song(text.getValue());
            song_name = text.getValue();         
            break;
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

    // music controls
    if(camera.position.x > 0 && camera.position.z > 0) {
        if(bass !== undefined){
            if(bass.gain.gain.value == 0.0) {                
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