import * as Dat from 'dat.gui';
import { Scene, Color, Fog, Vector3 } from 'three';
import { Flower, Land, Tree, Rock, Bush, Cloud } from 'objects';
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
        const tree1 = new Tree(this, new Vector3(-5, 0, 1), "fall");
        const tree2 = new Tree(this, new Vector3(0, 0, 5), "pine snow");
        const trees = [tree1, tree2];

        // Add rocks
        const rock1 = new Rock(new Vector3(3, 0, 0));
        const rock2 = new Rock(new Vector3(5, 0, 0), "boulder");
        const rocks = [rock1, rock2];

        // Add cloud
        const cloud = new Cloud(new Vector3(0, 15, 0));

        // Add bushes
        const bush1 = new Bush(new Vector3(0, 0, 3));
        const bush2 = new Bush(new Vector3(5, 0, 3), "berry");
        const bush3 = new Bush(new Vector3(8, 0, 5), "snow");
        const bushes = [bush1, bush2, bush3];

        this.add(land, flower, lights, ...trees, ...rocks, ...bushes, cloud);

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