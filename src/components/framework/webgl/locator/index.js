import { Matrix4, Vector3 } from 'math.gl';

export default class Locator {

    matrix4 = new Matrix4();
    translation = new Translation();
    rotation = new Rotation();
    scale = new Scale();
    invert = false;

    constructor(invert) {
        this.invert = invert;
    }

    getMatrix4() {

        let m = new Matrix4();
        if (this.invert) {
            m.scale(new Vector3(this.scale.x, this.scale.y, this.scale.z));
            m.rotateXYZ([this.rotation.x, this.rotation.y, this.rotation.z]);
            m.translate(new Vector3(this.translation.x, this.translation.y, this.translation.z))
            
        } else {
            m.translate(new Vector3(this.translation.x, this.translation.y, this.translation.z))
            m.rotateXYZ([this.rotation.x, this.rotation.y, this.rotation.z]);
            m.scale(new Vector3(this.scale.x, this.scale.y, this.scale.z));
        }

        return m;
    }

    lookAt(target, up) {

        let m = this.getMatrix4();
        let position = new Vector3(m[12], m[13], m[14]);

        m = new Matrix4();
        m.lookAt({ eye: position, center: target, up });

        this.matrix4 = m;
    }
}

class Translation {

    x = 0
    y = 0
    z = 0
}

class Rotation {

    x = 0
    y = 0
    z = 0
}

class Scale {

    x = 1
    y = 1
    z = 1
}