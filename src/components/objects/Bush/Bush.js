import { Euler, Group, Matrix4, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import BUSH from './bush.gltf';
import BUSH_SNOW from './bush-snow.gltf';
import BUSH_BERRY from './bush-berry.gltf';

class Bush extends Group {
    constructor(position = new Vector3(), type, scaleFactor = 1, euler = new Euler()) {
        super();
        this.name = 'bush';

        // Setup tranformation matrix
        const scale = new Vector3().setScalar(scaleFactor);
        const rotate = new Quaternion().setFromEuler(euler);
        const transform = new Matrix4().compose(position, rotate, scale);

        // Get specific GLTF file based on provided type
        let MODEL = BUSH;
        switch (type) {
            case "berry":
                MODEL = BUSH_BERRY;
                break;
            case "snow":
                MODEL = BUSH_SNOW;
        }

        // Load model
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.applyMatrix4(transform);
            this.add(gltf.scene);
        });
    }
}

export default Bush;