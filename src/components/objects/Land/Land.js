import {
    Color,
    Mesh,
    Vector3,
    TextureLoader,
    PlaneBufferGeometry,
    Float32BufferAttribute,
    MeshLambertMaterial,
} from 'three';
import GROUND_TEXTURE from '../../../../assets/textures/ground.png';

class Land extends Mesh {
    constructor() {
        const width = 600;
        const depth = 600;

        let floorGeometry = new PlaneBufferGeometry(width, depth, width / 3, depth / 3);
        floorGeometry.rotateX(-Math.PI / 2);

        // vertex displacement
        let position = floorGeometry.attributes.position;
        const vertex = new Vector3();
        for (let i = 0, l = position.count; i < l; i++) {
            vertex.fromBufferAttribute(position, i);
            vertex.y += Math.random();
            position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        // ensure each face has unique vertices
        floorGeometry = floorGeometry.toNonIndexed();

        // color faces
        position = floorGeometry.attributes.position;
        const colorsFloor = [];
        const color = new Color();
        for (let i = 0, l = position.count; i < l; i++) {
            const gray = Math.random() / 4 + 0.75;
            color.setRGB(gray, gray, gray);
            colorsFloor.push(color.r, color.g, color.b);
        }
        floorGeometry.setAttribute('color', new Float32BufferAttribute(colorsFloor, 3));

        // color quadrants using texture map
        const texture = new TextureLoader().load(GROUND_TEXTURE);
        const floorMaterial = new MeshLambertMaterial({ vertexColors: true, map: texture });

        // call parent constructor
        super(floorGeometry, floorMaterial);
        this.name = 'terrain';
        this.width = width;
        this.depth = depth;

        // create divot for pond
        let pondRadius = 40;
        for (let i = 0, l = position.count; i < l; i++) {
            vertex.fromBufferAttribute(position, i);
            if (Math.sqrt(Math.pow(vertex.x, 2) + Math.pow(vertex.z, 2)) <= pondRadius) {
                vertex.y = Math.pow(vertex.x, 2) / pondRadius + Math.pow(vertex.z, 2) / pondRadius - pondRadius;
            }
            position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        this.receiveShadow = true;
    }
}

export default Land;
