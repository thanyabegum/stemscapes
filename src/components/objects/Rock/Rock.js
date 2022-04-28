import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ROCK from './rock.gltf';
import ROCKS from './rocks.gltf';
import ROCK_SNOW from './rock-snow.gltf';
import ROCK_MOSS from './rock-moss.gltf';
import BOULDER from './boulder.gltf';

class Rock extends Group {
    constructor(position, model) {
        super();

        const loader = new GLTFLoader();

        this.name = "rock";

        let MODEL = ROCK;
        switch (model) {
            case "rocks":
                MODEL = ROCKS;
                break;
            case "rock-snow":
                MODEL = ROCK_SNOW;
                break;
            case "rock-moss":
                MODEL = ROCK_MOSS;
                break;
            case "boulder":
                MODEL = BOULDER;
        }

        loader.load(MODEL, (gltf) => {
            if (position !== undefined) gltf.scene.position.copy(position);
            this.add(gltf.scene);
        });
    }
}

export default Rock;
