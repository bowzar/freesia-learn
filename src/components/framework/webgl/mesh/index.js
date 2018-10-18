import Locator from '../locator';

export default class Mesh {

    geometry = null;
    material = null;
    locator = new Locator();

    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
    }

    update(viewer, camera) {
        this.material.update(viewer, camera, this);
    }
}