import { Mesh, MeshPhongMaterial, Geometry, Vector3, Face3 } from 'three';

class Water extends Mesh {
    constructor(parent) {
        let new_geo = new Geometry();

        let width = 30;
        let depth = 30;
        let wave_scale = 4;
        let height_adj = 0.5;
        let wave_freq = 2;
        let spacingX = 1;
        let spacingZ = 1;

        // create vertices
        for (let z = 0; z < depth; z++) {
            for (let x = 0; x < width; x++) {
                let vertex = new Vector3(
                    x * spacingX,
                    (Math.cos(x * wave_freq) + Math.cos(z * wave_freq)) / wave_scale - height_adj,
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
        new_geo.dynamic = true;
        let new_mat = new MeshPhongMaterial({ color: 0x75AEDC });
        new_mat.flatShading = true;

        super(new_geo, new_mat);
        this.translateX(-width / 2);
        this.translateZ(-depth / 2);
        this.name = 'pond';
        this.wave_scale = wave_scale;
        this.height_adj = height_adj;
        this.wave_freq = wave_freq;

        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        timeStamp /= 500;
        let n = this.geometry.vertices.length;
        for (let i = 0; i < n; i++) {
            let vec = this.geometry.vertices[i];
            let x_corr = Math.cos((vec.x + timeStamp) * this.wave_freq);
            let z_corr = Math.cos((vec.z + timeStamp) * this.wave_freq);
            vec.setY((x_corr + z_corr) / this.wave_scale - this.height_adj);
            this.geometry.__dirtyVertices = true;
            this.geometry.verticesNeedUpdate = true;
        }
    }
}

export default Water;