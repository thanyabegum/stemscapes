import * as Dat from 'dat.gui';
import { Scene, Color, Fog, Vector3 } from 'three';
import { Flower, Land, Tree, Rock } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        //// Add meshes to scene
        const lights = new BasicLights();
        const land = new Land();
        const flower = new Flower(this);

        // Add trees
        const tree1 = new Tree(this, new Vector3(-5, 0, 1));
        const tree2 = new Tree(this, new Vector3(0, 0, 5), "pine-tree");
        const trees = [tree1, tree2];

        // Add rocks
        const rock1 = new Rock(new Vector3(3, 0, 0));
        const rock2 = new Rock(new Vector3(5, 0, 0), "boulder");
        const rocks = [rock1, rock2];

        this.add(land, flower, lights, ...trees, ...rocks);

        this.fog = new Fog(0xcccccc, 50, 200);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = 0;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;