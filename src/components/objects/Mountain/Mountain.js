import { Euler, Group, Matrix4, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './mountain.gltf';

class Mountain extends Group {
    constructor(position = new Vector3(), scaleFactor = 1, euler = new Euler()) {
        super();
        this.name = 'mountain';

        // Setup tranformation matrix
        const scale = new Vector3().setScalar(scaleFactor);
        const rotate = new Quaternion().setFromEuler(euler);
        const transform = new Matrix4().compose(position, rotate, scale);

        // Load model
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.applyMatrix4(transform);
            this.add(gltf.scene);
        });
    }
}

export default Mountain;