import { Color, Mesh, Vector3, TextureLoader, PlaneBufferGeometry, MeshBasicMaterial, Float32BufferAttribute } from 'three';
import { abs, random, pow } from 'mathjs';
import GROUND_TEXTURE from '../../../../assets/textures/ground.png';

class Land extends Mesh {
    constructor() {

        let width = 600;
        let depth = 600;

        // -----------
        let floorGeometry = new PlaneBufferGeometry(width, depth, 200, 200);
        floorGeometry.rotateX(-Math.PI / 2);

        // vertex displacement

        let position = floorGeometry.attributes.position;

        let vertex = new Vector3();
        for (let i = 0, l = position.count; i < l; i++) {

            vertex.fromBufferAttribute(position, i);

            vertex.y += random();

            position.setXYZ(i, vertex.x, vertex.y, vertex.z);

        }

        floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

        position = floorGeometry.attributes.position;
        let colorsFloor = [];

        let color = new Color();
        for (let i = 0, l = position.count; i < l; i++) {
            let gray = random() / 4 + 0.75;
            color.setRGB(gray, gray, gray);
            colorsFloor.push(color.r, color.g, color.b);

        }

        floorGeometry.setAttribute('color', new Float32BufferAttribute(colorsFloor, 3));
        let texture = new TextureLoader().load(GROUND_TEXTURE);
        const floorMaterial = new MeshBasicMaterial({ vertexColors: true, map: texture });


        super(floorGeometry, floorMaterial);
        // ------------

        this.name = 'terrain';
        this.width = width;
        this.depth = depth;

        // create divot for pond
        for (let i = 0, l = position.count; i < l; i++) {

            vertex.fromBufferAttribute(position, i);

            if (abs(vertex.x) < 10 && abs(vertex.z) < 10) {
                vertex.y = (pow(vertex.x, 2) / 10) + (pow(vertex.z, 2) / 10) - 16;
            }

            position.setXYZ(i, vertex.x, vertex.y, vertex.z);

        }

    }
}

export default Land;