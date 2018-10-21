import { Matrix4 } from 'math.gl';
import Locator from '../locator';

export default class Camera {

    fovy = null
    near = null
    far = null
    aspect = null
    matrixProjection = null;
    locator = new Locator(true);

    constructor(fovy, near, far) {
        this.fovy = fovy * Math.PI / 180;
        this.near = near;
        this.far = far;
    }

    setAspect(aspect) {
        this.aspect = aspect;
        this.matrixProjection = new Matrix4();
        this.matrixProjection.perspective({ fovy: this.fovy, aspect, near: this.near, far: this.far });
    }
}