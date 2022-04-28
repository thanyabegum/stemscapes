import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './cloud.gltf';

class Cloud extends Group {
    constructor(position) {
        super();

        const loader = new GLTFLoader();

        this.name = 'cloud';

        loader.load(MODEL, (gltf) => {
            if (position !== undefined) gltf.scene.position.copy(position);
            this.add(gltf.scene);
        });
    }
}

export default Cloud;