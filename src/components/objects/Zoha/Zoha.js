import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './zoha.gltf';

class Zoha extends Group {
    constructor(position) {
        super();

        const loader = new GLTFLoader();

        this.name = 'zoha';

        loader.load(MODEL, (gltf) => {
            if (position !== undefined) gltf.scene.position.copy(position);
            this.add(gltf.scene);
        });
    }
}

export default Zoha;
