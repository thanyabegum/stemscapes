import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ROCK from './rock.gltf';
import ROCKS from './rocks.gltf';
import ROCK_SNOW from './rock-snow.gltf';
import ROCK_MOSS from './rock-moss.gltf';
import BOULDER from './boulder.gltf';

class Rock extends Group {
    constructor(position, type, scale) {
        super();

        const loader = new GLTFLoader();

        this.name = "rock";

        let MODEL = ROCK;
        switch (type) {
            case "multiple":
                MODEL = ROCKS;
                break;
            case "snow":
                MODEL = ROCK_SNOW;
                break;
            case "moss":
                MODEL = ROCK_MOSS;
                break;
            case "boulder":
                MODEL = BOULDER;
        }

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.set(scale, scale, scale); 
            if (position !== undefined) gltf.scene.position.copy(position);
            this.add(gltf.scene);
        });
    }
}

export default Rock;
