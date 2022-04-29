import { Audio } from "three";
import * as THREE from 'three'
let bass;
let drums;
let other;
let vocals;
export function init_audio(listener) { 
    // load bass and set it as the Audio object's buffer
    const audioLoader_bass = new THREE.AudioLoader();
    audioLoader_bass.load( 'assets/tmp/music/bass.wav', function( buffer ) {
        // create a audio source BASS
        const sound_bass = new THREE.Audio( listener );        
        sound_bass.setBuffer( buffer );
        sound_bass.setLoop( true );
        sound_bass.setVolume( 0.5 ); //change this
        sound_bass.isPlaying = false;   
        bass = sound_bass;
    });    
    
    // load drums and set it as the Audio object's buffer
    const audioLoader_drums = new THREE.AudioLoader();
    audioLoader_drums.load( 'assets/tmp/music/drums.wav', function( buffer ) {
        // create a audio source DRUMS
        const sound_drums = new THREE.Audio( listener );
        sound_drums.setBuffer( buffer );
        sound_drums.setLoop( true );
        sound_drums.setVolume( 0.5 ); //change this
        sound_drums.isPlaying = false;
        drums = sound_drums;    
    });
    
    // load other instruments and set it as the Audio object's buffer
    const audioLoader_other = new THREE.AudioLoader();
    audioLoader_other.load( 'assets/tmp/music/other.wav', function( buffer ) {
        // create a audio source OTHER INSTRUMENTS
        const sound_other = new THREE.Audio( listener );
        sound_other.setBuffer( buffer );
        sound_other.setLoop( true );
        sound_other.setVolume( 0.5 ); //change this
        sound_other.isPlaying = false;
        other = sound_other;
    });

    // load vocals and set it as the Audio object's buffer
    const audioLoader_vocals = new THREE.AudioLoader();
    audioLoader_vocals.load( 'assets/tmp/music/vocals.wav', function( buffer ) {
        // create a audio source VOCALS
        const sound_vocals = new THREE.Audio( listener );
        sound_vocals.setBuffer( buffer );
        sound_vocals.setLoop( true );
        sound_vocals.setVolume( 0.5 ); //change this
        sound_vocals.isPlaying = false;
        vocals = sound_vocals;
    });
}
export function play_all() {
    if(bass === undefined || drums === undefined || other === undefined || vocals === undefined) return undefined;
    if(!vocals.isPlaying) {        
        bass.play();
        drums.play();
        other.play();
        vocals.play();
    }
    else {        
        bass.pause();
        drums.pause();
        other.pause();
        vocals.pause();
    }
    let sounds = {
        'bass': bass,
        'drums': drums,
        'other': other,
        'vocals': vocals
    };
    return sounds;
}
export function toggle_mute(sound) {
    if(sound === undefined) return undefined;
    if(sound.gain.gain.value == 0.0) {
        sound.setVolume( 0.5 );
    }
    else sound.setVolume( 0.0 );
}