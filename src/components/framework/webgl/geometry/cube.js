import Geometry from './geometry';

export default class CubeGeometry extends Geometry {

    constructor(x = 100, y = 100, z = 100) {
        super();
        this.create(x, y, z);
    }

    create(x, y, z) {

        this.vertices = [
            -x / 2, -y / 2, -z / 2, x / 2, -y / 2, -z / 2, x / 2, y / 2, -z / 2, -x / 2, y / 2, -z / 2,
            -x / 2, -y / 2, z / 2, x / 2, -y / 2, z / 2, x / 2, y / 2, z / 2, -x / 2, y / 2, z / 2,
            -x / 2, -y / 2, -z / 2, -x / 2, y / 2, -z / 2, -x / 2, y / 2, z / 2, -x / 2, -y / 2, z / 2,
            x / 2, -y / 2, -z / 2, x / 2, y / 2, -z / 2, x / 2, y / 2, z / 2, x / 2, -y / 2, z / 2,
            -x / 2, -y / 2, -z / 2, -x / 2, -y / 2, z / 2, x / 2, -y / 2, z / 2, x / 2, -y / 2, -z / 2,
            -x / 2, y / 2, -z / 2, -x / 2, y / 2, z / 2, x / 2, y / 2, z / 2, x / 2, y / 2, -z / 2,
        ];

        this.indices = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23
        ];
    }
}