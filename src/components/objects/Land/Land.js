import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './land.gltf';

class Land extends Mesh {
    constructor() {
        const geometry = new PlaneGeometry(600, 600).rotateX(Math.PI / 2);;
        const material = new MeshBasicMaterial({ color: 0x2b4d19, side: DoubleSide });

        // Call parent Group() constructor
        super(geometry, material);

        // const loader = new GLTFLoader();

        // this.name = 'land';

        // loader.load(MODEL, (gltf) => {
        //     this.add(gltf.scene);
        // });
    }
}

export default Land;