import Geometry from './geometry';

export default class Line extends Geometry {

    constructor(start, end) {
        super();
        this.create(start, end);
    }


    create(start, end) {

        this.vertices = [
            start.x, start.y, start.z,
            end.x, end.y, end.z,
        ];

        this.indices = [];
    }
}