import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import BUSH from './bush.gltf';
import BUSH_SNOW from './bush-snow.gltf';
import BUSH_BERRY from './bush-berry.gltf';

class Bush extends Group {
    constructor(position, type) {
        super();

        const loader = new GLTFLoader();

        this.name = 'bush';

        let MODEL = BUSH;
        switch (type) {
            case "berry":
                MODEL = BUSH_BERRY;
                break;
            case "snow":
                MODEL = BUSH_SNOW;
        }

        loader.load(MODEL, (gltf) => {
            if (position !== undefined) gltf.scene.position.copy(position);
            this.add(gltf.scene);
        });
    }
}

export default Bush;