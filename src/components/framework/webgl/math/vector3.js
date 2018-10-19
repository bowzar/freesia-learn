import { Vector3 as GLVector3 } from 'math.gl';

export default class Vector3 extends GLVector3 {

    constructor(x = 0, y = 0, z = 0) {
        super(x, y, z);
    }

    applyMatrix4(matrix4) {

        let x = this.x, y = this.y, z = this.z;
        let e = matrix4;

        let w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

        return this;
    }

    multiplyScalar(scalar) {

        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    }

    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }

    setLength(length) {
        return this.normalize().multiplyScalar(length);
    }
}

