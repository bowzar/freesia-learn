import Geometry from './geometry';

export default class Rectangle extends Geometry {

    constructor(width = 100, height = 100) {
        super();
        this.create(width, height);
    }

    create(width, height) {

        this.vertices = [
            -width / 2, -height / 2, 0, width / 2, -height / 2, 0,
            width / 2, height / 2, 0, -width / 2, height / 2, 0,
        ];

        this.indices = [
            0, 1, 2,
            0, 2, 3,
        ];
    }
}