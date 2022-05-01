import { Euler, Group, Matrix4, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cloud.gltf';

class Cloud extends Group {
    constructor(parent, position = new Vector3(), scaleFactor = 1, euler = new Euler()) {
        super();

        const loader = new GLTFLoader();

        this.name = 'cloud';

        // Setup tranformation matrix
        const scale = new Vector3().setScalar(scaleFactor);
        const rotate = new Quaternion().setFromEuler(euler);
        const transform = new Matrix4().compose(position, rotate, scale);

        // Load object
        loader.load(MODEL, (gltf) => {
            gltf.scene.applyMatrix4(transform);
            this.add(gltf.scene);
        });

        parent.addToUpdateList(this);
    }

    update(delta) {
        const cloud = this.getObjectByName("Cloud");
        if (cloud !== undefined) {
            // Check if cloud is outside the bounds of the world
            const worldPos = new Vector3();
            cloud.getWorldPosition(worldPos);
            if (worldPos.x > 1200) cloud.position.setX(-300); // wraparound
            else cloud.translateX(delta);
        }
    }
}

export default Cloud;