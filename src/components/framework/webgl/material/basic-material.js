import { Matrix4, Vector3 } from 'math.gl';

import Material from './material';

export default class BasicMaterial extends Material {

    vertCode =
        'attribute vec4 position;' +
        'uniform mat4 matrix;' +
        'void main(void) { ' +
        'gl_Position = matrix * position;' +
        '}';

    fragCode =
        'void main(void) {' +
        'gl_FragColor = vec4(1., 1., 1., 1.);' +
        '}';

    vertShader = null
    fragShader = null
    program = null
    matrix = null
    position = null

    install(gl) {

        if (this.program)
            return;

        this.vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.vertShader, this.vertCode);
        gl.compileShader(this.vertShader);

        this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.fragShader, this.fragCode);
        gl.compileShader(this.fragShader);

        this.program = gl.createProgram();
        gl.attachShader(this.program, this.vertShader);
        gl.attachShader(this.program, this.fragShader);
        gl.linkProgram(this.program);

        this.matrix = gl.getUniformLocation(this.program, "matrix");
        this.position = gl.getAttribLocation(this.program, "position");
    }

    update(gl, camera, mesh) {

        this.install(gl);
        mesh.geometry.install(gl);

        gl.useProgram(this.program);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.geometry.vertex_buffer);
        gl.vertexAttribPointer(this.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.position);

        let m = this.createViewMatrix(camera, mesh);
        gl.uniformMatrix4fv(this.matrix, false, m);
        gl.drawElements(gl.TRIANGLES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    createViewMatrix(camera, mesh) {

        let mProjection = camera.matrixProjection;
        let mMesh = mesh.locator.getMatrix4();
        let mView = new Matrix4(camera.locator.matrix4);
        // mView.invert();

        // let m = new Matrix4(mMesh);
        // m.multiplyRight(mView);
        // m.multiplyRight(mProjection);     

        let m = new Matrix4(mProjection);
        m.multiplyRight(mView);
        m.multiplyRight(mMesh);

        return m;
    }
}