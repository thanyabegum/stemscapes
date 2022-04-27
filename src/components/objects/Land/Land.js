import { Mesh, MeshPhongMaterial, Geometry, Vector3, Face3 } from 'three';
import { random } from 'mathjs';

class Land extends Mesh {
    constructor() {
        let new_geo = new Geometry();

        let width = 500;
        let depth = 500;
        let height = 0.65;
        let spacingX = 1;
        let spacingZ = 1;

        // create vertices
        for (let z = 0; z < depth; z++) {
            for (let x = 0; x < width; x++) {
                let vertex = new Vector3(
                    x * spacingX,
                    random() * height,
                    z * spacingZ);
                new_geo.vertices.push(vertex);
            }
        }

        // create faces
        for (let z = 0; z < depth - 1; z++) {
            for (let x = 0; x < width - 1; x++) {
                let a = x + z * width;
                let b = (x + 1) + (z * width);
                let c = x + ((z + 1) * width);
                let d = (x + 1) + ((z + 1) * width);
                let face1 = new Face3(b, a, c);
                let face2 = new Face3(c, d, b);
                new_geo.faces.push(face1);
                new_geo.faces.push(face2);
            }
        }

        new_geo.computeFaceNormals();
        const new_mat = new MeshPhongMaterial({ color: 0x2b4d19 });
        new_mat.flatShading = true;
        // new_mat.shininess = 0;

        // Call parent Mesh() constructor
        super(new_geo, new_mat);

        this.translateX(-width / 1.5);
        this.translateZ(-depth / 4);
        this.name = 'terrain';
        this.width = width;
        this.depth = depth;
    }
}

export default Land;