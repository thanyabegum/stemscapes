import { Euler, Group, Matrix4, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ROCK from './rock.gltf';
import ROCKS from './rocks.gltf';
import ROCK_SNOW from './rock-snow.gltf';
import ROCK_MOSS from './rock-moss.gltf';
import BOULDER from './boulder.gltf';

class Rock extends Group {
    constructor(position = new Vector3(), type, scaleFactor = 1, euler = new Euler()) {
        super();
        this.name = "rock";

        // Setup tranformation matrix
        const scale = new Vector3().setScalar(scaleFactor);
        const rotate = new Quaternion().setFromEuler(euler);
        const transform = new Matrix4().compose(position, rotate, scale);

        // Get specific GLTF file based on provided type
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

        // Load model
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.applyMatrix4(transform);
            this.add(gltf.scene);
        });
    }
}

export default Rock;
