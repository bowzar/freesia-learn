import { Matrix4 } from '../index';
import { Material } from './index';

export default class ImageMaterial extends Material {

    vertCode =
        'attribute vec4 position;' +
        'uniform mat4 matrix;' +
        "attribute vec2 a_TextCoord;" +
        "varying vec2 v_TexCoord;" +
        'void main(void) { ' +
        'gl_Position = matrix * position;' +
        "v_TexCoord = a_TextCoord; " +
        '}';

    fragCode =
        'precision highp  float;' +
        "uniform sampler2D u_Sampler;" +
        "varying vec2 v_TexCoord;" +
        'void main(void) {' +
        "gl_FragColor = texture2D(u_Sampler, v_TexCoord);" +
        '}';

    gl = null;
    program = null
    matrix = null
    position = null
    a_TextCoord = null
    image = null;
    imageSrc = null
    imageLoaded = false
    colors = []
    color_buffer = null
    texture = null
    u_Sampler = null

    disposed = false;


    constructor({
        src = '',
    } = {}) {
        super();

        this.imageSrc = src;
    }

    install(viewer, program) {

        if (this.matrix)
            return;

        this.gl = viewer.gl;
        const gl = this.gl;

        this.color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

        this.matrix = gl.getUniformLocation(program, "matrix");
        this.position = gl.getAttribLocation(program, "position");

        this.a_TextCoord = gl.getAttribLocation(program, "a_TextCoord");
        this.texture = gl.createTexture();
        this.u_Sampler = gl.getUniformLocation(program, 'u_Sampler');

        this.image = new Image();
        this.image.onload = () => this.loadTexture(viewer);
        this.image.crossOrigin = 'anonymous';
        this.image.src = this.imageSrc;

        this.disposed = false;
    }

    dispose() {

        this.disposed = true;
        if (!this.gl)
            return;

        this.gl.deleteTexture(this.texture);
        this.gl = null;
        this.texture = null;
    }

    loadTexture(viewer) {

        if (this.disposed)
            return;

        const gl = viewer.gl;
        this.program = viewer.programCenter.use(this.vertCode, this.fragCode);
        // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        // gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);// 纹理水平填充方式
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);// 纹理垂直填充方式

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);

        gl.uniform1i(this.u_Sampler, 0);

        this.imageLoaded = true;
    }

    update(viewer, camera, mesh, worldMatrix) {

        const gl = viewer.gl;
        this.program = viewer.programCenter.use(this.vertCode, this.fragCode);

        this.install(viewer, this.program.program);
        mesh.geometry.install(gl);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.geometry.vertex_buffer);
        gl.vertexAttribPointer(this.position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.position);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        gl.vertexAttribPointer(this.a_TextCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.a_TextCoord);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.geometry.index_buffer);

        let m = this.createViewMatrix(camera, mesh, worldMatrix);
        gl.uniformMatrix4fv(this.matrix, false, m);

        if (this.imageLoaded) {
            // gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);

            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);// 纹理水平填充方式
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);// 纹理垂直填充方式
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.image);

            // gl.uniform1i(this.u_Sampler, 0);

            // gl.depthFunc(gl.ALWAYS);
            gl.drawElements(gl.TRIANGLES, mesh.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
            // gl.depthFunc(gl.LEQUAL);

        }
    }
}