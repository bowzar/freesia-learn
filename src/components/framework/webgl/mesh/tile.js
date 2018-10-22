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
}