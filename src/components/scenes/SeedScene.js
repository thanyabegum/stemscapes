import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, Fog } from 'three';
import { Land, Tree, Rock, Bush, Cloud, Water } from 'objects';
import { BasicLights } from 'lights';
import { random } from 'mathjs';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [],
        };

        // set background and fog color to same color
        let fogColor = 0xb3ebff;
        this.background = new Color(fogColor);
        this.fog = new Fog(fogColor, 75, 400);

        //// Add meshes to scene
        const lights = new BasicLights();
        const land = new Land();
        const water = new Water(this);
        this.add(lights, water, land);

        // for use by camera and music
        // width and depth of land plane
        let width = land.width;
        let depth = land.depth;

        function getScale(factor, constant) {
            return random() * factor + constant;
        }

        function getX() {
            return (random() * (width / 2 - 50)) + 25;
        }

        function getZ() {
            return (random() * (width / 2 - 50)) + 25;
        }

        // tree scaling variables 
        let factor = 6;
        let constant = 2;

        // Add summer trees
        let trees = [];
        for (let i = 0; i < 75; i++) {
            let position = new Vector3(getX(), 0, getZ());
            let type;
            if (i < 25) type = "pine";
            else type = "tree";

            let tree = new Tree(this, position, type, getScale(factor, constant));

            tree.castShadow = true;
            tree.receiveShadow = true;
            trees.push(tree);
        }

        // add fall trees
        for (let i = 0; i < 75; i++) {
            let position = new Vector3(-getX(), 0, getZ());
            let type;
            if (i < 25) type = "pine fall";
            else type = "fall";

            let tree = new Tree(this, position, type, getScale(factor, constant));

            tree.castShadow = true;
            tree.receiveShadow = true;
            trees.push(tree);
        }

        // add spring trees
        for (let i = 0; i < 75; i++) {
            let position = new Vector3(getX(), 0, -getZ());
            let type;
            if (i < 25) type = "pine";
            else type = "tree";

            let tree = new Tree(this, position, type, getScale(factor, constant));

            tree.castShadow = true;
            tree.receiveShadow = true;
            trees.push(tree);
        }

        // add winter trees
        for (let i = 0; i < 75; i++) {
            let position = new Vector3(-getX(), 0, -getZ());
            let type;
            if (i < 25) type = "tree";
            else type = "pine snow";

            let tree = new Tree(this, position, type, getScale(factor, constant));

            tree.castShadow = true;
            tree.receiveShadow = true;
            trees.push(tree);
        }

        // Add rocks
        const rock1 = new Rock(new Vector3(3, 0, 0));
        const rock2 = new Rock(new Vector3(5, 0, 0), "boulder");
        const rocks = [rock1, rock2];

        // Add clouds
        let cloudHeight = 100;
        factor = 4;
        constant = 0;
        const clouds = [];
        for (let i = 0; i < 175; i++) {
            let x = (random() * width) - (width / 2);
            let z = (random() * depth) - (depth / 2);
            let y = cloudHeight + (random() * 20 - 10); // cloud height range of [90, 110]

            let cloud = new Cloud(this, new Vector3(x, y, z), getScale(factor, constant));
            clouds.push(cloud);
        }
        
        // Add bushes
        const bush1 = new Bush(new Vector3(0, 0, 3));
        const bush2 = new Bush(new Vector3(5, 0, 3), "berry");
        const bush3 = new Bush(new Vector3(8, 0, 5), "snow");
        const bushes = [bush1, bush2, bush3];

        this.add(...trees, ...rocks, ...bushes, ...clouds);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }
}

export default SeedScene;