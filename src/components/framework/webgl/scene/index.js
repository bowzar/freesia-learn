import Mesh from '../mesh';

export default class Scene {

    children = []

    add(item) {
        this.children.push(item);
    }

    remove(item) {
        let index = this.children.indexOf(item);
        this.children.splice(index, 1);
    }

    update(gl, camera) {

        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1.0);
        gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.children.forEach(c => c.update(gl, camera));
    }
}