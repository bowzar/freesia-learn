import { Matrix4 } from '../index';
import { Material } from './index';

export default class LineBasicMaterial extends Material {

    vertCode =
        'attribute vec4 position;' +
        'uniform mat4 matrix;' +
        'void main(void) { ' +
        'gl_Position = matrix * position;' +
        '}';

    fragCode = null;

    matrix = null
    position = null

    constructor({
        color = 0xffffff,
        opacity = 1,
    } = {}) {
        super();

        this.fragCode = `void main(void) { gl_FragColor = vec4(${((color >> 16) & 0x0000ff) / 255}, ${((color >> 8) & 0x0000ff) / 255}, ${(color & 0x0000ff) / 255}, ${opacity}); }`;
        this.isTransparent = opacity < 1;
    }

    install(gl, program) {

        if (this.matrix)
            return;

        this.matrix = gl.getUniformLocation(program, "matrix");
        this.position = gl.getAttribLocation(program, "position");
    }

    update(viewer, camera, mesh, worldMatrix) {

        const gl = viewer.gl;
        const p = viewer.programCenter.use(this.vertCode, this.fragCode);

        this.install(gl, p.program);
        mesh.geometry.install(gl);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.geometry.vertex_buffer);
        gl.vertexAttribPointer(this.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.position);

        let m = this.createViewMatrix(camera, mesh, worldMatrix);
        gl.uniformMatrix4fv(this.matrix, false, m);
        gl.drawArrays(gl.LINES, 0, mesh.geometry.vertices.length / 3);
    }
}