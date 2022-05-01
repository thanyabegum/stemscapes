import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './mountain.gltf';

class Mountain extends Group {
    constructor(position) {
        super();

        const loader = new GLTFLoader();

        this.name = 'mountain';

        loader.load(MODEL, (gltf) => {
            if (position !== undefined) gltf.scene.position.copy(position);
            this.add(gltf.scene);
        });
    }
}

export default Mountain;