import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three';

class Land extends Mesh {
    constructor() {
        const geometry = new PlaneGeometry(600, 600).rotateX(Math.PI / 2);;
        const material = new MeshBasicMaterial({ color: 0x2b4d19, side: DoubleSide });

        // Call parent Group() constructor
        super(geometry, material);
    }
}

export default Land;