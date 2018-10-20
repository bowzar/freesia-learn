import { Matrix4 as GLMatrix4 } from 'math.gl';
import { Vector3 } from '../index';

export default class Matrix4 extends GLMatrix4 {

    getPosition() {
        return new Vector3(this[12], this[13], this[14]);
    }

    setPosition(vec) {
        this[12] = vec.x;
        this[13] = vec.y;
        this[14] = vec.z;
        return this;
    }

    getVectorX() {
        return new Vector3(this[0], this[1], this[2]);
    }

    setVectorY(vec) {
        this[4] = vec.x;
        this[5] = vec.y;
        this[6] = vec.z;
        return this;
    }

    getVectorY() {
        return new Vector3(this[4], this[5], this[6]);
    }

    setVectorZ(vec) {
        this[8] = vec.x;
        this[9] = vec.y;
        this[10] = vec.z;
        return this;
    }

    getVectorZ() {
        return new Vector3(this[8], this[9], this[10]);
    }

    multiplyColumn(c) {
        var valid = c.length === 4;
        if (!valid) {
            throw new Error("invalid c");
        }
        var values1 = this;
        var values2 = c;
        var m11 = values1[0] * values2[0] + values1[4] * values2[1] + values1[8] * values2[2] + values1[12] * values2[3];
        var m21 = values1[1] * values2[0] + values1[5] * values2[1] + values1[9] * values2[2] + values1[13] * values2[3];
        var m31 = values1[2] * values2[0] + values1[6] * values2[1] + values1[10] * values2[2] + values1[14] * values2[3];
        var m41 = values1[3] * values2[0] + values1[7] * values2[1] + values1[11] * values2[2] + values1[15] * values2[3];
        return [m11, m21, m31, m41];
    }

    multiplyMatrix(otherMatrix) {
        var values1 = this;
        var values2 = otherMatrix;
        var m11 = values1[0] * values2[0] + values1[4] * values2[1] + values1[8] * values2[2] + values1[12] * values2[3];
        var m12 = values1[0] * values2[4] + values1[4] * values2[5] + values1[8] * values2[6] + values1[12] * values2[7];
        var m13 = values1[0] * values2[8] + values1[4] * values2[9] + values1[8] * values2[10] + values1[12] * values2[11];
        var m14 = values1[0] * values2[12] + values1[4] * values2[13] + values1[8] * values2[14] + values1[12] * values2[15];
        var m21 = values1[1] * values2[0] + values1[5] * values2[1] + values1[9] * values2[2] + values1[13] * values2[3];
        var m22 = values1[1] * values2[4] + values1[5] * values2[5] + values1[9] * values2[6] + values1[13] * values2[7];
        var m23 = values1[1] * values2[8] + values1[5] * values2[9] + values1[9] * values2[10] + values1[13] * values2[11];
        var m24 = values1[1] * values2[12] + values1[5] * values2[13] + values1[9] * values2[14] + values1[13] * values2[15];
        var m31 = values1[2] * values2[0] + values1[6] * values2[1] + values1[10] * values2[2] + values1[14] * values2[3];
        var m32 = values1[2] * values2[4] + values1[6] * values2[5] + values1[10] * values2[6] + values1[14] * values2[7];
        var m33 = values1[2] * values2[8] + values1[6] * values2[9] + values1[10] * values2[10] + values1[14] * values2[11];
        var m34 = values1[2] * values2[12] + values1[6] * values2[13] + values1[10] * values2[14] + values1[14] * values2[15];
        var m41 = values1[3] * values2[0] + values1[7] * values2[1] + values1[11] * values2[2] + values1[15] * values2[3];
        var m42 = values1[3] * values2[4] + values1[7] * values2[5] + values1[11] * values2[6] + values1[15] * values2[7];
        var m43 = values1[3] * values2[8] + values1[7] * values2[9] + values1[11] * values2[10] + values1[15] * values2[11];
        var m44 = values1[3] * values2[12] + values1[7] * values2[13] + values1[11] * values2[14] + values1[15] * values2[15];
        return new Matrix4([m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44]);
    }

    getInverseMatrix() {
        var a = this;
        var result = new Matrix4();
        var b = result;
        var c = a[0],
            d = a[1],
            e = a[2],
            g = a[3],
            f = a[4],
            h = a[5],
            i = a[6],
            j = a[7],
            k = a[8],
            l = a[9],
            n = a[10],
            o = a[11],
            m = a[12],
            p = a[13],
            r = a[14],
            s = a[15];
        var A = c * h - d * f;
        var B = c * i - e * f;
        var t = c * j - g * f;
        var u = d * i - e * h;
        var v = d * j - g * h;
        var w = e * j - g * i;
        var x = k * p - l * m;
        var y = k * r - n * m;
        var z = k * s - o * m;
        var C = l * r - n * p;
        var D = l * s - o * p;
        var E = n * s - o * r;
        var q = A * E - B * D + t * C + u * z - v * y + w * x;
        if (!q) {
            console.log("can't get inverse matrix");
            return null
        }
        q = 1 / q;
        b[0] = (h * E - i * D + j * C) * q;
        b[1] = (-d * E + e * D - g * C) * q;
        b[2] = (p * w - r * v + s * u) * q;
        b[3] = (-l * w + n * v - o * u) * q;
        b[4] = (-f * E + i * z - j * y) * q;
        b[5] = (c * E - e * z + g * y) * q;
        b[6] = (-m * w + r * t - s * B) * q;
        b[7] = (k * w - n * t + o * B) * q;
        b[8] = (f * D - h * z + j * x) * q;
        b[9] = (-c * D + d * z - g * x) * q;
        b[10] = (m * v - p * t + s * A) * q;
        b[11] = (-k * v + l * t - o * A) * q;
        b[12] = (-f * C + h * y - i * x) * q;
        b[13] = (c * C - d * y + e * x) * q;
        b[14] = (-m * u + p * B - r * A) * q;
        b[15] = (k * u - l * B + n * A) * q;
        return result;
    }

    worldRotateByVector(radian, vec) {
        var x = vec.x;
        var y = vec.y;
        var z = vec.z;

        var length, s, c;
        var xx, yy, zz, xy, yz, zx, xs, ys, zs, one_c;

        s = Math.sin(radian);
        c = Math.cos(radian);

        length = Math.sqrt(x * x + y * y + z * z);

        // Rotation matrix is normalized
        x /= length;
        y /= length;
        z /= length;

        xx = x * x;
        yy = y * y;
        zz = z * z;
        xy = x * y;
        yz = y * z;
        zx = z * x;
        xs = x * s;
        ys = y * s;
        zs = z * s;
        one_c = 1.0 - c;

        var m11 = (one_c * xx) + c; //M(0,0)
        var m12 = (one_c * xy) - zs; //M(0,1)
        var m13 = (one_c * zx) + ys; //M(0,2)
        var m14 = 0.0; //M(0,3) 表示平移X

        var m21 = (one_c * xy) + zs; //M(1,0)
        var m22 = (one_c * yy) + c; //M(1,1)
        var m23 = (one_c * yz) - xs; //M(1,2)
        var m24 = 0.0; //M(1,3)  表示平移Y

        var m31 = (one_c * zx) - ys; //M(2,0)
        var m32 = (one_c * yz) + xs; //M(2,1)
        var m33 = (one_c * zz) + c; //M(2,2)
        var m34 = 0.0; //M(2,3)  表示平移Z

        var m41 = 0.0; //M(3,0)
        var m42 = 0.0; //M(3,1)
        var m43 = 0.0; //M(3,2)
        var m44 = 1.0; //M(3,3)

        var mat = new Matrix4([
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44]);
        var result = mat.multiplyRight(this);
        this.copy(result);
        return this;
    }

    localRotateX(radian) {
        var transVertice = this.getPosition();
        this.setPosition(new Vector3(0, 0, 0));
        var columnX = this.getVectorX();
        this.worldRotateByVector(radian, columnX);
        this.setPosition(transVertice);
        return this;
    }

    localRotateY(radian) {
        var transVertice = this.getPosition();
        this.setPosition(new Vector3(0, 0, 0));
        var columnY = this.getVectorY();
        this.worldRotateByVector(radian, columnY);
        this.setPosition(transVertice);
        return this;
    }

    localRotateZ(radian) {
        var transVertice = this.getPosition();
        this.setPosition(new Vector3(0, 0, 0));
        var columnZ = this.getVectorZ();
        this.worldRotateByVector(radian, columnZ);
        this.setPosition(transVertice);
        return this;
    }

    worldRotateX(radian) {
        var c = Math.cos(radian);
        var s = Math.sin(radian);
        var m = new Matrix4([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1]);
        var result = m.multiplyRight(this);
        this.copy(result);
        return this;
    }

    worldRotateY(radian) {
        var c = Math.cos(radian);
        var s = Math.sin(radian);
        var m = new Matrix4([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1]);
        var result = m.multiplyRight(this);
        this.copy(result);
        return this;
    }

    worldRotateZ(radian) {
        var c = Math.cos(radian);
        var s = Math.sin(radian);
        var m = new Matrix4([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);
        var result = m.multiplyRight(this);
        this.copy(result);
        return this;
    }


    worldScale(scaleX, scaleY, scaleZ) {
        scaleX = (scaleX !== undefined) ? scaleX : 1;
        scaleY = (scaleY !== undefined) ? scaleY : 1;
        scaleZ = (scaleZ !== undefined) ? scaleZ : 1;
        var m = new Matrix4([
            scaleX, 0, 0, 0,
            0, scaleY, 0, 0,
            0, 0, scaleZ, 0,
            0, 0, 0, 1]);
        var result = m.multiplyRight(this);
        this.copy(result);
        return this;
    }

    worldTranslate(x, y, z) {
        this[12] += x;
        this[13] += y;
        this[14] += z;
        return this;
    }

    localTranslate(x, y, z) {
        var localColumn = [x, y, z, 1];
        var worldColumn = this.multiplyColumn(localColumn);
        var origin = this.getPosition();
        this.worldTranslate(worldColumn[0] - origin.x, worldColumn[1] - origin.y, worldColumn[2] - origin.z);
        return this;
    }

    localScale(scaleX, scaleY, scaleZ) {
        var transVertice = this.getPosition();
        this.setPosition(new Vector3(0, 0, 0));
        this.worldScale(scaleX, scaleY, scaleZ);
        this.setPosition(transVertice);
        return this;
    }
}