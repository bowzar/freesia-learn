import Mesh from './index';

export default class Tile extends Mesh {

    level = null;
    row = null;
    col = null;

    constructor(geometry, material, { level, row, col } = {}) {
        super(geometry, material);
        this.level = level;
        this.row = row;
        this.col = col;
    }

    update(viewer, camera, worldMatrix) {

        // let d = 1 / 20;

        // viewer.gl.depthRange(d * this.level, d * (this.level + 1));
        super.update(viewer, camera, worldMatrix);
        // viewer.gl.depthRange(d * this.level, d * (this.level + 1));
    }

}