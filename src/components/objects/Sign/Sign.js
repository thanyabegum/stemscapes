import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './sign.gltf';

class Sign extends Group {
    constructor(position) {
        super();

        const loader = new GLTFLoader();

        this.name = 'sign';

        loader.load(MODEL, (gltf) => {
            if (position !== undefined) gltf.scene.position.copy(position);
            this.add(gltf.scene);
        });
    }
}

export default Sign;
