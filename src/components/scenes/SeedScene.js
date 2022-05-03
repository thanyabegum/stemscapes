import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, Fog, Euler } from 'three';
import { Land, Water, Tree, Rock, Bush, Cloud, Mountain } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        super();
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

        // for use by camera and music
        // width and depth of land plane
        let width = land.width;
        let depth = land.depth;

        // Constants
        const NUM_OF_TREES = 75; // per quadrant
        const NUM_OF_ROCKS = 15; // per quadrant
        const NUM_OF_CLOUDS = 125;
        const NUM_OF_BUSHES = 25; // per quadrant
        const QMAX = (width / 2) - 50; // max extent of a quadrant
        const DMAX = (depth / 2) - 50; // max depth of a quadrant
        const CHEIGHT = 120; // cloud height
        const RHEIGHT = 1; // rock height
        const BHEIGHT = 1; // bush height
        const MBUFFER = 130; // how far the mountains are from the pond
        const MGAP = 100; // gap between mountain instances

        // Helper function for getting random number within [min, max)
        function rand(min, max) { return Math.random() * (max - min) + min }

        // Helper function for getting random Euler rotation along y-axis
        function randYRot() { return new Euler(0, rand(0, Math.PI * 2)) }

        // Add trees
        let trees = [];
        for (let i = 0; i < NUM_OF_TREES; i++) {
            const summerPos = new Vector3(rand(25, QMAX), 0, rand(25, DMAX));
            const fallPos = new Vector3(-rand(25, QMAX), 0, rand(25, DMAX));
            const springPos = new Vector3(rand(25, QMAX), 0, -rand(25, DMAX));
            const winterPos = new Vector3(-rand(25, QMAX), 0, -rand(25, DMAX));

            if (i < NUM_OF_TREES / 3) {
                trees.push(new Tree(this, summerPos, "pine", rand(2, 8), randYRot()));
                trees.push(new Tree(this, fallPos, "pine fall", rand(2, 8), randYRot()));
                trees.push(new Tree(this, springPos, "pine", rand(2, 8), randYRot()));
                trees.push(new Tree(this, winterPos, "tree", rand(2, 8), randYRot()));
            } else {
                trees.push(new Tree(this, summerPos, "tree", rand(2, 8), randYRot()));
                trees.push(new Tree(this, fallPos, "fall", rand(2, 8), randYRot()));
                trees.push(new Tree(this, springPos, "tree", rand(2, 8), randYRot()));
                trees.push(new Tree(this, winterPos, "pine snow", rand(2, 8), randYRot()));
            }
        }

        // Add rocks
        let rocks = [];
        for (let i = 0; i < Math.round(NUM_OF_ROCKS * 5 / 3); i++) {
            let summerPos = new Vector3(rand(25, QMAX), RHEIGHT, rand(25, DMAX));
            let springPos = new Vector3(rand(25, QMAX), RHEIGHT, -rand(25, DMAX));
            let winterPos = new Vector3(-rand(25, QMAX), RHEIGHT, -rand(25, DMAX));
            let fallPos = new Vector3(-rand(25, QMAX), RHEIGHT, rand(25, DMAX));

            rocks.push(new Rock(summerPos, "multiple", rand(2, 6), randYRot()));
            rocks.push(new Rock(springPos, "multiple", rand(2, 6), randYRot()));
            rocks.push(new Rock(winterPos, "multiple", rand(2, 6), randYRot()));
            rocks.push(new Rock(fallPos, "multiple", rand(2, 6), randYRot()));

            if (i < NUM_OF_ROCKS) {
                summerPos = new Vector3(rand(25, QMAX), RHEIGHT, rand(25, DMAX));
                winterPos = new Vector3(-rand(25, QMAX), RHEIGHT, -rand(25, DMAX));
                fallPos = new Vector3(-rand(25, QMAX), RHEIGHT, rand(25, DMAX));
                springPos = new Vector3(rand(25, QMAX), RHEIGHT, -rand(25, DMAX));
    
                rocks.push(new Rock(summerPos, "moss", rand(2, 6), randYRot()));
                rocks.push(new Rock(winterPos, "snow", rand(2, 6), randYRot()));
                rocks.push(new Rock(fallPos, "boulder", rand(2, 6), randYRot()));
                rocks.push(new Rock(springPos, "rock", rand(2, 6), randYRot()));
            }
        }

        // Add clouds
        const clouds = [];
        for (let i = 0; i < NUM_OF_CLOUDS; i++) {
            const x = rand(-width / 2, width / 2);
            const y = rand(CHEIGHT - 10, CHEIGHT + 10);
            const z = rand(-depth / 2, depth / 2);
            clouds.push(new Cloud(this, new Vector3(x, y, z), rand(0, 4)));
        }
        
        // Add bushes
        const bushes = [];
        for (let i = 0; i < NUM_OF_BUSHES; i++) {
            const springPos = new Vector3(rand(25, QMAX), BHEIGHT, -rand(25, DMAX));
            const winterPos = new Vector3(-rand(25, QMAX), BHEIGHT, -rand(25, DMAX));
            const summerPos = new Vector3(rand(25, QMAX), BHEIGHT, rand(25, DMAX));

            bushes.push(new Bush(springPos, "berry", rand(2, 6), randYRot()));
            bushes.push(new Bush(winterPos, "snow", rand(2, 6), randYRot()));
            bushes.push(new Bush(summerPos, "bush", rand(2, 6), randYRot()));
        }

        // Add mountains 
        const mountains = [];
        for (let i = -width / 2 - MBUFFER; i <= width / 2 + MBUFFER; i += MGAP) {
            mountains.push(new Mountain(new Vector3(i, rand(-75, 25), depth / 2 + MBUFFER)));
            mountains.push(new Mountain(new Vector3(i, rand(-75, 25), -depth / 2 - MBUFFER)));
        }
        for (let i = -depth / 2 + MBUFFER; i <= depth / 2 - MBUFFER; i += MGAP) {
            mountains.push(new Mountain(new Vector3(width / 2 + MBUFFER, rand(-75, 25), i)));
            mountains.push(new Mountain(new Vector3(-width / 2 - MBUFFER, rand(-75, 25), i)));
        }

        this.add(lights, land, water, ...trees, ...rocks, ...bushes, ...clouds, ...mountains);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }
}

export default SeedScene;