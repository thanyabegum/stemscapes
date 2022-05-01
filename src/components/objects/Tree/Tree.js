import { Group, AnimationMixer, AnimationClip } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import TREE from './tree.gltf';
import TREE_FALL from './tree-fall.gltf';
import PINE_TREE from './pine-tree.gltf';
import PINE_TREE_FALL from './pine-tree-fall.gltf';
import PINE_TREE_SNOW from './pine-tree-snow.gltf';

class Tree extends Group {
    constructor(parent, position, type, scale) {
        super();

        this.state = {
            gui: parent.state.gui,
            sway: true,
        };

        const loader = new GLTFLoader();

        this.name = 'tree';

        let MODEL = TREE;
        switch (type) {
            case "fall":
                MODEL = TREE_FALL;
                break;
            case "pine":
                MODEL = PINE_TREE;
                break;
            case "pine fall":
                MODEL = PINE_TREE_FALL;
                break;
            case "pine snow":
                MODEL = PINE_TREE_SNOW;
        }

        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            // https://discourse.threejs.org/t/how-to-scale-a-gltf-animated-model/29453
            gltf.scene.scale.set(scale, scale * 1.5, scale); 
            if (position !== undefined) model.position.copy(position);
            this.add(model);

            // // get animation
            // this.mixer = new AnimationMixer(model);
            // const clip = gltf.animations[0];
            // // const clip = AnimationClip.findByName(clips, )
            // const action = this.mixer.clipAction(clip);
            // action.timeScale = 0.01;
            // action.play();
        });

                // Add self to parent's update list
        parent.addToUpdateList(this);

        // this.state.gui.add(this.state, 'sway');
    }

    update(timeStamp) {
        if (this.state.sway && this.mixer !== undefined) {
            this.mixer.update(timeStamp / 500);
        }
    }
}

export default Tree;
