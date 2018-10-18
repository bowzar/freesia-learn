import Mesh from '../mesh';

export default class Scene {

    children = []

    colorR = null
    colorG = null
    colorB = null

    constructor({
        color = 0x0,
    } = {}) {

        this.colorR = ((color >> 16) & 0x0000ff) / 255;
        this.colorG = ((color >> 8) & 0x0000ff) / 255;
        this.colorB = (color & 0x0000ff) / 255;
    }

    add(item) {
        this.children.push(item);
    }

    remove(item) {
        let index = this.children.indexOf(item);
        this.children.splice(index, 1);
    }

    update(viewer, camera) {

        const gl = viewer.gl;

        gl.clearColor(this.colorR, this.colorG, this.colorB, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);

        this.children.forEach(c => {
            if (!c.material.isTransparent)
                c.update(viewer, camera);
        });

        gl.depthMask(false);

        let meshes = this.getTransparentMeshes();
        meshes.forEach(c => {
            c.update(viewer, camera);
        });

        gl.depthMask(true);
    }

    getTransparentMeshes() {

        let meshes = [];
        this.children.forEach(c => {
            if (c.material.isTransparent)
                meshes.push(c);
        });

        return meshes;
    }
}