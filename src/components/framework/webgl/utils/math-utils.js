export default class MathUtils {

    static vector3MultiplyMatrix4(vector3, matrix4) {

        let x = vector3.x, y = vector3.y, z = vector3.z;
        let e = matrix4;

        let w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        vector3.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        vector3.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        vector3.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

        return vector3;
    }

    static vector3MultiplyScalar(vector3, scalar) {

        vector3.x *= scalar;
        vector3.y *= scalar;
        vector3.z *= scalar;

        return vector3;
    }

    static vector3DivideScalar(vector3, scalar) {
        return MathUtils.vector3MultiplyScalar(vector3, 1 / scalar);
    }

    static vector3Normalize(vector3) {
        return MathUtils.vector3DivideScalar(vector3, MathUtils.vector3Length(vector3) || 1);
    }

    static vector3Length(vector3) {
        return Math.sqrt(vector3.x * vector3.x + vector3.y * vector3.y + vector3.z * vector3.z);
    }

    static vector3SetLength(vector3, length) {
        return MathUtils.vector3MultiplyScalar(MathUtils.vector3Normalize(vector3), length);
    }
}