import { Group, SpotLight, HemisphereLight, AmbientLight, DirectionalLight, DirectionalLightHelper } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        // Hemisphere light illuminates the ground
        const hemi = new HemisphereLight(0xa1a1a1, 0xffeed9, 0.35);
        hemi.position.set(0, 50, 0);
        this.add(hemi);

        // Spotlight illuminates a target area
        const spot = new SpotLight(0xffffff, 1, 30, 0.8, 1, 1);
        spot.position.set(-100, 100, -100);
        spot.target.position.set(-100, 0, -100);
        this.add(spot);

        // Ambient light equally illuminates all objects
        const ambi = new AmbientLight(0x404040);
        this.add(ambi);

        // Directional light mimics the sun
        const dir = new DirectionalLight(0xffffff, 0.9);
        dir.color.setHSL(0.1, 1, 0.95);
        dir.position.set(100, 300, 100);
        this.add(dir);

        // Directional light shadow map
        dir.castShadow = true;
        dir.shadow.mapSize.width = 2048;
        dir.shadow.mapSize.height = 2048;

        const d = 600;
        dir.shadow.camera.left = -d;
        dir.shadow.camera.right = d;
        dir.shadow.camera.top = d;
        dir.shadow.camera.bottom = -d;
        dir.shadow.camera.far = 3500;
        dir.shadow.bias = -0.0001;
    }
}

export default BasicLights;