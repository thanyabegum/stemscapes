/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, ColorKeyframeTrack, Audio } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import { init_audio, toggle_mute, play_all } from './audio';

import * as THREE from 'three'
import * as Dat from 'dat.gui'; //testoresto

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const listener = new THREE.AudioListener();
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
    file_name: "frank.mp3",
    load: function() {
        init_audio(listener);
    }

};
gui.add(params, 'play').name('play');
gui.add(params, 'play_bass').name('toggle bass');
gui.add(params, 'play_drums').name('toggle drums');
gui.add(params, 'play_vocals').name('toggle vocals');
gui.add(params, 'play_other').name('toggle other');
gui.add(params, "file_name").name('file name').onFinishChange(function (value) {
    var objReq = new XMLHttpRequest();
    objReq.open("GET", "http://localhost:8888" + "?filename=" + value, false);
    objReq.send(null);
});
gui.add(params, "load");

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
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
