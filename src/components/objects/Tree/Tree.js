import { AnimationMixer, Euler, Group, Matrix4, Quaternion, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TREE from './tree.gltf';
import TREE_FALL from './tree-fall.gltf';
import PINE_TREE from './pine-tree.gltf';
import PINE_TREE_FALL from './pine-tree-fall.gltf';
import PINE_TREE_SNOW from './pine-tree-snow.gltf';

class Tree extends Group {
    constructor(parent, position = new Vector3(), type, scaleFactor = 1, euler = new Euler()) {
        super();
        this.name = 'tree';

        // Setup tranformation matrix
        const scale = new Vector3().setScalar(scaleFactor);
        const rotate = new Quaternion().setFromEuler(euler);
        const transform = new Matrix4().compose(position, rotate, scale);

        // Get specific GLTF file based on provided type
        let MODEL = TREE;
        switch (type) {
            case 'fall':
                MODEL = TREE_FALL;
                break;
            case 'pine':
                MODEL = PINE_TREE;
                break;
            case 'pine fall':
                MODEL = PINE_TREE_FALL;
                break;
            case 'pine snow':
                MODEL = PINE_TREE_SNOW;
        }

        // Load model
        const loader = new GLTFLoader();
        loader.load(MODEL, (gltf) => {
            gltf.scene.applyMatrix4(transform);
            this.castShadow = true;
            this.receiveShadow = true;
            this.add(gltf.scene);

            gltf.scene.traverse((child) => {
                if (child.isMesh) child.castShadow = true;
            });

            if (gltf.animations.length != 0) {
                const mixer = new AnimationMixer(gltf.scene);
                mixer.clipAction(gltf.animations[0]).play();
                this.mixer = mixer;
            }
        });

        parent.addToUpdateList(this);
    }

    update(delta) {
        if (this.mixer !== undefined) this.mixer.update(delta);
    }
}

export default Tree;
