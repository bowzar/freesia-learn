import Animator from '../utils/animator';
import { Vector3 } from '../index';

export default class PluginGlobalCameraZoom {

    viewer = null;
    ptStart = null;
    thetaXBk = null;
    thetaZBk = null;
    cameraMatrixBk = null;
    isRotateRight = false;

    rateRotation = 0.007;
    rateMove = 0.25;
    rateZoom = 0.001;
    thetaXMax = 89 * Math.PI / 180;
    thetaXZ0 = 60 * Math.PI / 180;

    globalR = 100;
    cameraLength = 500;
    thetaX = 30;
    thetaZ = 0;
    targetThetaX = 0;
    targetThetaZ = 0;
    target = new Vector3();

    // targetMatrix = new Matrix4();
    keysStatus = {};

    animatorCameraLength = null;
    animatorCameraLengthTarget = { cameraLength: 500 };

    animatorCameraTheta = null;
    animatorCameraThetaTarget = { thetaX: 30, thetaZ: 0 };

    onMouseDownHandler = null;
    onMouseUpHandler = null;
    onMouseMoveHandler = null;
    onMouseWheelHandler = null;
    onContextmenuHandler = null;

    constructor(viewer, {
        cameraLength = 500,
        globalR = 100,
        // thetaX = 0,
        // thetaZ = 0,
        // targetThetaX = 0,
        // targetThetaZ = 0,
        // target = new Vector3(),

    } = {}) {

        this.viewer = viewer;
        this.globalR = globalR;
        this.cameraLength = cameraLength;
        this.animatorCameraLengthTarget.cameraLength = cameraLength;
        // this.thetaX = thetaX;
        // this.thetaZ = thetaZ;
        // this.animatorCameraThetaTarget.thetaX = thetaX;
        // this.animatorCameraThetaTarget.thetaZ = thetaZ;
        // this.targetThetaX = targetThetaX;
        // this.targetThetaZ = targetThetaZ;
        //   this.target = target;
    }

    install() {

        this.animatorCameraLength = new Animator(this)
            .easing(Animator.Easing.Quartic.Out)
            .onUpdate(e => { });

        this.animatorCameraTheta = new Animator(this)
            .easing(Animator.Easing.Quartic.Out)
            .onUpdate(e => { });

        const canvas = this.viewer.dom;
        // canvas.addEventListener("mousedown", this.onMouseDownHandler = this.onMouseDown.bind(this));
        // canvas.addEventListener("mouseup", this.onMouseUpHandler = this.onMouseUp.bind(this));
        // canvas.addEventListener("mousemove", this.onMouseMoveHandler = this.onMouseMove.bind(this));
        canvas.addEventListener("mousewheel", this.onMouseWheelHandler = this.onMouseWheel.bind(this));
        // canvas.addEventListener("contextmenu", this.onContextmenuHandler = this.onContextmenu.bind(this));

        this.updateCamera();
    }

    uninstall() {

        const canvas = this.viewer.dom;
        // canvas.removeEventListener("mousedown", this.onMouseDownHandler);
        // canvas.removeEventListener("mouseup", this.onMouseUpHandler);
        // canvas.removeEventListener("mousemove", this.onMouseMoveHandler);
        canvas.removeEventListener("mousewheel", this.onMouseWheelHandler);
        // canvas.removeEventListener("contextmenu", this.onContextmenuHandler);
    }

    toJson() {

        let obj = {

            cameraLength: this.cameraLength,
            // thetaX: this.thetaX,
            // thetaZ: this.thetaZ,
            // targetThetaX: this.targetThetaX,
            // targetThetaZ: this.targetThetaZ,
            // target: {
            //     x: this.target.x,
            //     y: this.target.y,
            //     z: this.target.z,
            // },
        };

        return JSON.stringify(obj);
    }

    update() {
        this.animatorCameraLength.update();
        // this.animatorCameraTheta.update();
        this.updateCamera();
    }

    updateCamera() {

        // let mZ = new Matrix4();
        // mZ.rotateZ(this.thetaZ);

        // let mX = new Matrix4();
        // mX.rotateY(this.thetaX);

        // mZ.multiplyRight(mX);

        let v = new Vector3(0, 0, -1);
        // v.applyMatrix4(mZ);
        v.setLength(this.cameraLength);

        this.viewer.camera.locator.translation.x = this.target.x + v.x;
        this.viewer.camera.locator.translation.y = this.target.y + v.y;
        this.viewer.camera.locator.translation.z = this.target.z + v.z;
        this.viewer.camera.locator.refreshMatrix();
        this.viewer.camera.locator.lookAt([this.target.x, this.target.y, this.target.z], [0, 1, 0]);
    }

    onMouseWheel(e) {

        let length = (this.animatorCameraLengthTarget.cameraLength - this.globalR);
        if (e.wheelDelta > 0)
            length /= 2;
        else
            length *= 2;

        length += this.globalR;

        if (length < this.globalR + 1)
            length = this.globalR + 1;
        if (length >= 8 * this.globalR)
            length = 8 * this.globalR;

        this.animatorCameraLengthTarget.cameraLength = length;
        this.animatorCameraLength.to(this.animatorCameraLengthTarget, 2000);
    }
}