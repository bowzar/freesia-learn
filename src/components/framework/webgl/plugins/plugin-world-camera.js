import { Vector3, Matrix4 } from 'math.gl';
import Animator from '../utils/animator';
import MathUtils from '../utils/math-utils';
import { Cube, Mesh, BasicMaterial } from '../index';

export default class PluginWorldCamera {

    viewer = null;
    ptStart = null;
    thetaXBk = null;
    thetaZBk = null;
    cameraMatrixBk = null;
    isRotateRight = false;

    rateRotation = 0.007;
    rateMove = 0.25;
    rateZoom = 0.002;
    thetaXMax = 89 * Math.PI / 180;
    thetaXZ0 = 60 * Math.PI / 180;

    cameraLength = 500;
    thetaX = 30;
    thetaZ = 0;
    targetThetaX = 0;
    targetThetaZ = 0;
    target = new Vector3();

    metsh = null;

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
    onKeyDownHandler = null;
    onKeyUpHandler = null;
    onContextmenuHandler = null;

    constructor(viewer, {
        cameraLength = 500,
        thetaX = 35 * Math.PI / 180,
        thetaZ = 0,
        targetThetaX = 0,
        targetThetaZ = 0,
        target = new Vector3(),

    } = {}) {

        this.viewer = viewer;
        this.cameraLength = cameraLength;
        this.thetaX = thetaX;
        this.thetaZ = thetaZ;
        this.targetThetaX = targetThetaX;
        this.targetThetaZ = targetThetaZ;
        this.target = target;
    }

    install() {

        this.animatorCameraLength = new Animator(this)
            .easing(Animator.Easing.Quartic.Out)
            .onUpdate(e => { });

        this.animatorCameraTheta = new Animator(this)
            .easing(Animator.Easing.Quartic.Out)
            .onUpdate(e => { });

        let geometry = new Cube(10, 50, 10);
        let material = new BasicMaterial({ color: 0xb0517c, opacity: 1 });
        this.mesh = new Mesh(geometry, material);
        this.viewer.scene.add(this.mesh);

        const canvas = this.viewer.dom;
        canvas.addEventListener("keydown", this.onKeyDownHandler = this.onKeyDown.bind(this));
        canvas.addEventListener("keyup", this.onKeyUpHandler = this.onKeyUp.bind(this));
        canvas.addEventListener("mousedown", this.onMouseDownHandler = this.onMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.onMouseUpHandler = this.onMouseUp.bind(this));
        canvas.addEventListener("mousemove", this.onMouseMoveHandler = this.onMouseMove.bind(this));
        canvas.addEventListener("mousewheel", this.onMouseWheelHandler = this.onMouseWheel.bind(this));
        canvas.addEventListener("contextmenu", this.onContextmenuHandler = this.onContextmenu.bind(this));

        this.updateCamera();
    }

    uninstall() {

        const canvas = this.viewer.dom;
        canvas.removeEventListener("keydown", this.onKeyDownHandler);
        canvas.removeEventListener("keyup", this.onKeyUpHandler);
        canvas.removeEventListener("mousedown", this.onMouseDownHandler);
        canvas.removeEventListener("mouseup", this.onMouseUpHandler);
        canvas.removeEventListener("mousemove", this.onMouseMoveHandler);
        canvas.removeEventListener("mousewheel", this.onMouseWheelHandler);
        canvas.removeEventListener("contextmenu", this.onContextmenuHandler);
    }

    toJson() {

        let obj = {

            cameraLength: this.cameraLength,
            thetaX: this.thetaX,
            thetaZ: this.thetaZ,
            targetThetaX: this.targetThetaX,
            targetThetaZ: this.targetThetaZ,
            target: {
                x: this.target.x,
                y: this.target.y,
                z: this.target.z,
            },
        };

        return JSON.stringify(obj);
    }

    update() {

        let current = new Date().getTime();
        let vector = new Vector3();
        let z = 0;
        let time;
        let tx = this.targetThetaX;

        if (this.keysStatus.w && this.keysStatus.w.isPress) {
            vector.y += 1;
            time = this.keysStatus.w.time;
            this.keysStatus.w.time = current;
        }
        if (this.keysStatus.s && this.keysStatus.s.isPress) {
            vector.y -= 1;
            time = this.keysStatus.s.time;
            this.keysStatus.s.time = current;
        }
        if (this.keysStatus.a && this.keysStatus.a.isPress) {
            vector.x -= 1;
            time = this.keysStatus.a.time;
            this.keysStatus.a.time = current;
        }
        if (this.keysStatus.d && this.keysStatus.d.isPress) {
            vector.x += 1;
            time = this.keysStatus.d.time;
            this.keysStatus.d.time = current;
        }
        if (this.keysStatus.blank && this.keysStatus.blank.isPress) {
            tx = 0;
            vector.z -= 1;
            z += 1;
            time = this.keysStatus.blank.time;
            this.keysStatus.blank.time = current;
        }

        if (!time)
            time = current;

        let length = (current - time) * this.rateMove;

        let mZ = new Matrix4();
        mZ.rotateZ(this.targetThetaZ);

        let mX = new Matrix4();
        mX.rotateX(tx);

        mZ.multiplyRight(mX);

        MathUtils.vector3MultiplyMatrix4(vector, mZ);
        MathUtils.vector3SetLength(vector, length);

        this.target.x -= vector.x;
        this.target.y -= vector.y;

        if (!z && this.targetThetaX >= -this.thetaXZ0 && this.targetThetaX <= this.thetaXZ0 && Math.abs(this.target.z) < 1)
            this.target.z = 0;
        else
            this.target.z -= vector.z;
        // this.target.z += lengthZ;

        let mt = new Matrix4();
        mt.translate([this.target.x, this.target.y, this.target.z + 6]);
        mt.rotateZ(this.targetThetaZ);
        mt.rotateX(this.target.z === 0 ? 0 : tx);
        mt.translate([0, 30, 0]);
        this.mesh.locator.matrix = mt;

        this.animatorCameraLength.update();
        this.animatorCameraTheta.update();
        this.updateCamera();
    }

    updateCamera() {

        let mZ = new Matrix4();
        mZ.rotateZ(this.thetaZ);

        let mX = new Matrix4();
        mX.rotateX(this.thetaX);

        mZ.multiplyRight(mX);

        let v = new Vector3(0, 1, 0);
        MathUtils.vector3MultiplyMatrix4(v, mZ);
        MathUtils.vector3SetLength(v, this.cameraLength);

        this.viewer.camera.locator.translation.x = this.target.x + v.x;
        this.viewer.camera.locator.translation.y = this.target.y + v.y;
        this.viewer.camera.locator.translation.z = this.target.z + v.z;
        this.viewer.camera.locator.refreshMatrix();
        this.viewer.camera.locator.lookAt([this.target.x, this.target.y, this.target.z + 6], [0, 0, 1]);
    }

    onMouseDown(e) {

        this.viewer.dom.focus();
        if (this.ptStart)
            return;
        if (e.button !== 2 && e.button !== 0)
            return;

        this.isRotateRight = e.button === 2;
        this.ptStart = { x: e.offsetX, y: e.offsetY };
        this.thetaXBk = this.thetaX;
        this.thetaZBk = this.thetaZ;
        this.cameraMatrixBk = new Matrix4(this.viewer.camera.locator.matrix);

        e.preventDefault();
    }

    onContextmenu(e) {
        e.preventDefault();
    }

    onMouseUp(e) {

        this.ptStart = null;
        e.preventDefault();
    }

    onMouseMove(e) {

        if (!this.ptStart)
            return;

        let x = e.offsetX;
        let y = e.offsetY;

        let dx = x - this.ptStart.x;
        let dThetaZ = -dx * this.rateRotation;
        this.animatorCameraThetaTarget.thetaZ = this.thetaZBk + dThetaZ;

        let dy = y - this.ptStart.y;
        let dThetaX = dy * this.rateRotation;
        this.animatorCameraThetaTarget.thetaX = this.thetaXBk + dThetaX;

        if (this.animatorCameraThetaTarget.thetaX > this.thetaXMax)
            this.animatorCameraThetaTarget.thetaX = this.thetaXMax;
        if (this.animatorCameraThetaTarget.thetaX < - this.thetaXMax)
            this.animatorCameraThetaTarget.thetaX = - this.thetaXMax;

        if (this.isRotateRight) {
            this.targetThetaX = this.animatorCameraThetaTarget.thetaX;
            this.targetThetaZ = this.animatorCameraThetaTarget.thetaZ;
        }

        this.animatorCameraTheta.to(this.animatorCameraThetaTarget, 100);

        e.preventDefault();
    }

    onMouseWheel(e, delta) {

        var length = this.animatorCameraLengthTarget.cameraLength - e.wheelDelta * this.animatorCameraLengthTarget.cameraLength * this.rateZoom;
        if (length <= 0)
            length = .1;

        this.animatorCameraLengthTarget.cameraLength = length;
        this.animatorCameraLength.to(this.animatorCameraLengthTarget, 1000);
    }

    onKeyDown(e) {

        if (e.key === "w" || e.key === "s" || e.key === "a" || e.key === "d") {

            if (!this.keysStatus[e.key])
                this.keysStatus[e.key] = {};

            if (this.keysStatus[e.key].isPress)
                return;

            this.keysStatus[e.key] = {
                isPress: true,
                time: new Date().getTime()
            };
        }
        else if (e.key === " ") {

            let key = "blank";
            if (!this.keysStatus[key])
                this.keysStatus[key] = {};

            if (this.keysStatus[key].isPress)
                return;

            this.keysStatus[key] = {
                isPress: true,
                time: new Date().getTime()
            };
        }
    }

    onKeyUp(e) {

        if (e.key === "w" || e.key === "s" || e.key === "a" || e.key === "d") {
            this.keysStatus[e.key] = {
                isPress: false,
                time: new Date().getTime()
            };
        }
        else if (e.key === " ") {

            let key = "blank";
            this.keysStatus[key] = {
                isPress: false,
                time: new Date().getTime()
            };
        }
    }
}