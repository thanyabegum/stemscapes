import { AudioLoader, Audio } from 'three';

//import demo files
import BASS_1 from "../assets/tmp/demo/royaltyfree1/bass.wav";
import DRUMS_1 from "../assets/tmp/demo/royaltyfree1/drums.wav";
import OTHER_1 from "../assets/tmp/demo/royaltyfree1/other.wav";
import VOCALS_1 from "../assets/tmp/demo/royaltyfree1/vocals.wav";

import BASS_2 from "../assets/tmp/demo/royaltyfree2/bass.wav";
import DRUMS_2 from "../assets/tmp/demo/royaltyfree2/drums.wav";
import OTHER_2 from "../assets/tmp/demo/royaltyfree2/other.wav";
import VOCALS_2 from "../assets/tmp/demo/royaltyfree2/vocals.wav";

import BASS_3 from "../assets/tmp/demo/royaltyfree3/bass.wav";
import DRUMS_3 from "../assets/tmp/demo/royaltyfree3/drums.wav";
import OTHER_3 from "../assets/tmp/demo/royaltyfree3/other.wav";
import VOCALS_3 from "../assets/tmp/demo/royaltyfree3/vocals.wav";

import BASS_4 from "../assets/tmp/demo/royaltyfree4/bass.wav";
import DRUMS_4 from "../assets/tmp/demo/royaltyfree4/drums.wav";
import OTHER_4 from "../assets/tmp/demo/royaltyfree4/other.wav";
import VOCALS_4 from "../assets/tmp/demo/royaltyfree4/vocals.wav";

let demo_files = {
    "royaltyfree1": {
        "bass": BASS_1,
        "drums": DRUMS_1,
        "other": OTHER_1,
        "vocals": VOCALS_1
    },
    "royaltyfree2": {
        "bass": BASS_2,
        "drums": DRUMS_2,
        "other": OTHER_2,
        "vocals": VOCALS_2
    },
    "royaltyfree3": {
        "bass": BASS_3,
        "drums": DRUMS_3,
        "other": OTHER_3,
        "vocals": VOCALS_3
    },
    "royaltyfree4": {
        "bass": BASS_4,
        "drums": DRUMS_4,
        "other": OTHER_4,
        "vocals": VOCALS_4
    }
}
let bass = undefined;
let drums = undefined;
let other = undefined;
let vocals = undefined;

export function init_audio(listener) {
    // load bass and set it as the Audio object's buffer
    const audioLoader_bass = new AudioLoader();
    audioLoader_bass.load("/assets/tmp/music/bass.wav", function( buffer ) {
        // create a audio source BASS
        const sound_bass = new Audio( listener );        
        sound_bass.setBuffer( buffer );
        sound_bass.setLoop( true );
        sound_bass.setVolume( 0.0 ); //change this
        sound_bass.isPlaying = false;   
        bass = sound_bass;
    });    
    
    // load drums and set it as the Audio object's buffer
    const audioLoader_drums = new AudioLoader();
    audioLoader_drums.load("/assets/tmp/music/drums.wav", function( buffer ) {
        // create a audio source DRUMS
        const sound_drums = new Audio( listener );
        sound_drums.setBuffer( buffer );
        sound_drums.setLoop( true );
        sound_drums.setVolume( 0.0 ); //change this
        sound_drums.isPlaying = false;
        drums = sound_drums;    
    });
    
    // load other instruments and set it as the Audio object's buffer
    const audioLoader_other = new AudioLoader();
    audioLoader_other.load("/assets/tmp/music/other.wav", function( buffer ) {
        // create a audio source OTHER INSTRUMENTS
        const sound_other = new Audio( listener );
        sound_other.setBuffer( buffer );
        sound_other.setLoop( true );
        sound_other.setVolume( 0.0 ); //change this
        sound_other.isPlaying = false;
        other = sound_other;
    });

    // load vocals and set it as the Audio object's buffer
    const audioLoader_vocals = new AudioLoader();
    audioLoader_vocals.load("/assets/tmp/music/vocals.wav", function( buffer ) {
        // create a audio source VOCALS
        const sound_vocals = new Audio( listener );
        sound_vocals.setBuffer( buffer );
        sound_vocals.setLoop( true );
        sound_vocals.setVolume( 0.0 ); //change this
        sound_vocals.isPlaying = false;
        vocals = sound_vocals;
    });
}
export function init_audio_demo(listener, name) { 
    // load bass and set it as the Audio object's buffer
    const audioLoader_bass = new AudioLoader();
    audioLoader_bass.load(demo_files[name]["bass"], function( buffer ) {
        // create a audio source BASS
        const sound_bass = new Audio( listener );        
        sound_bass.setBuffer( buffer );
        sound_bass.setLoop( true );
        sound_bass.setVolume( 0.0 ); //change this
        sound_bass.isPlaying = false;   
        bass = sound_bass;
    });    
    
    // load drums and set it as the Audio object's buffer
    const audioLoader_drums = new AudioLoader();
    audioLoader_drums.load(demo_files[name]["drums"], function( buffer ) {
        // create a audio source DRUMS
        const sound_drums = new Audio( listener );
        sound_drums.setBuffer( buffer );
        sound_drums.setLoop( true );
        sound_drums.setVolume( 0.0 ); //change this
        sound_drums.isPlaying = false;
        drums = sound_drums;    
    });
    
    // load other instruments and set it as the Audio object's buffer
    const audioLoader_other = new AudioLoader();
    audioLoader_other.load(demo_files[name]["other"], function( buffer ) {
        // create a audio source OTHER INSTRUMENTS
        const sound_other = new Audio( listener );
        sound_other.setBuffer( buffer );
        sound_other.setLoop( true );
        sound_other.setVolume( 0.0 ); //change this
        sound_other.isPlaying = false;
        other = sound_other;
    });

    // load vocals and set it as the Audio object's buffer
    const audioLoader_vocals = new AudioLoader();
    audioLoader_vocals.load(demo_files[name]["vocals"], function( buffer ) {
        // create a audio source VOCALS
        const sound_vocals = new Audio( listener );
        sound_vocals.setBuffer( buffer );
        sound_vocals.setLoop( true );
        sound_vocals.setVolume( 0.0 ); //change this
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
export function get_sounds() {
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
export function delete_tracks() {
    bass = undefined;
    drums = undefined;
    other = undefined;
    vocals = undefined;
}