import Locator from '../locator';

export default class Mesh {

    geometry = null;
    material = null;
    locator = new Locator();

    constructor(geometry, material) {
        this.geometry = geometry;
        this.material = material;
    }

    isTransparent() {
        return this.material && this.material.isTransparent ? this.material.isTransparent : false;
    }

    update(viewer, camera, worldMatrix) {
        this.material.update(viewer, camera, this, worldMatrix);
    }

    dispose() {

        if (this.geometry)
            this.geometry.dispose();
        if (this.material)
            this.material.dispose();
    }
}