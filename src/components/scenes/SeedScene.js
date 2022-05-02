import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, Fog } from 'three';
import { Land, Tree, Rock, Bush, Cloud, Water, Mountain } from 'objects';
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
            return (random() * (width / 2 - 75) + 25);
        }

        function getZ() {
            return (random() * (depth / 2 - 75) + 25);
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
        let rocks = [];
        let rockHeight = 1;
        factor = 4;
        constant = 2;
        for (let i = 0; i < 25; i++) {
            let position1 = new Vector3(getX(), rockHeight, getZ());
            let position2 = new Vector3(getX(), rockHeight, -getZ());
            let position3 = new Vector3(-getX(), rockHeight, -getZ());
            let position4 = new Vector3(-getX(), rockHeight, getZ());

            let type = "multiple";
            let rock1 = new Rock(position1, type, getScale(factor, constant));
            let rock2 = new Rock(position2, type, getScale(factor, constant));
            let rock3 = new Rock(position3, type, getScale(factor, constant));
            let rock4 = new Rock(position4, type, getScale(factor, constant));

            rocks.push(rock1, rock2, rock3, rock4);
        }
        for (let i = 0; i < 15; i++) {
            let position = new Vector3(getX(), rockHeight, getZ());
            let type = "moss";
            let rock = new Rock(position, type, getScale(factor, constant));

            rocks.push(rock);
        }
        for (let i = 0; i < 15; i++) {
            let position = new Vector3(-getX(), rockHeight, -getZ());
            let type = "snow";
            let rock = new Rock(position, type, getScale(factor, constant));

            rocks.push(rock);
        }
        for (let i = 0; i < 15; i++) {
            let position = new Vector3(-getX(), rockHeight, getZ());
            let type = "boulder";
            let rock = new Rock(position, type, getScale(factor, constant));

            rocks.push(rock);
        }
        for (let i = 0; i < 15; i++) {
            let position = new Vector3(getX(), rockHeight, -getZ());
            let type = "rock";
            let rock = new Rock(position, type, getScale(factor, constant));

            rocks.push(rock);
        }

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
        let bushes = [];
        let bushHeight = 1;
        factor = 4;
        constant = 2;
        for (let i = 0; i < 25; i++) {
            let position = new Vector3(getX(), bushHeight, -getZ());
            let type = "berry";
            let bush = new Bush(position, type, getScale(factor, constant));
            bushes.push(bush)
        }
        for (let i = 0; i < 25; i++) {
            let position = new Vector3(-getX(), bushHeight, -getZ());
            let type = "snow";
            let bush = new Bush(position, type, getScale(factor, constant));
            bushes.push(bush)
        }
        for (let i = 0; i < 25; i++) {
            let position = new Vector3(getX(), bushHeight, getZ());
            let type = "bush";
            let bush = new Bush(position, type, getScale(factor, constant));
            bushes.push(bush)
        }

        // add mountains 
        let mountains = [];
        let buffer = 150;
        let hFactor = 100;
        let hConst = -75;
        function randHeight(hFactor, hConst) {
            return random() * hFactor + hConst;
        }
        
        for (let i = -width / 2 - buffer; i <= width / 2 + buffer; i += 150) {
            mountains.push(new Mountain(new Vector3(i, randHeight(hFactor, hConst), depth / 2 + buffer)));
            mountains.push(new Mountain(new Vector3(i, randHeight(hFactor, hConst), -depth / 2 - buffer)));
        }
        for (let i = -depth / 2 + buffer; i <= depth / 2 - buffer; i += 150) {
            mountains.push(new Mountain(new Vector3(width / 2 + buffer, randHeight(hFactor, hConst), i)));
            mountains.push(new Mountain(new Vector3(-width / 2 - buffer, randHeight(hFactor, hConst), i)));
        }

        this.add(land, lights, ...trees, ...rocks, ...bushes, ...clouds, ...mountains, water);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }
}

export default SeedScene;