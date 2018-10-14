import React from 'react';
import Component from '../../../framework/route-component';
import { Layout } from 'antd';
import RenderCanvas from '../../../framework/render-canvas';
import img from './1.jpg';

export class WebGL_Texture extends Component {

    state = {
    }

    canvas = null

    createRouteDescriptor() {
        return {
            location: this.props.match.path,
            title: 'WebGL-Texture',
            group: 'home',
        }
    }

    init(canvas) {
        return canvas.getContext('webgl');
    }

    onRender(gl) {



        var vertices = [
            -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
            -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
            -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1,
            1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
            -1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1,
            -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
        ];

        var colors = [
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        ];

        var indices = [
            0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
        ];

        // Create and store data into vertex buffer
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Create and store data into color buffer
        var color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // Create and store data into index buffer
        var index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        /*=================== SHADERS =================== */

        var vertCode = 'attribute vec3 position;' +
            'uniform mat4 Pmatrix;' +
            'uniform mat4 Vmatrix;' +
            'uniform mat4 Mmatrix;' +
            "attribute vec2 a_TextCoord;" + // 接受纹理坐标
            "varying vec2 v_TexCoord;" +    // 传递纹理坐标
            'void main(void) { ' +//pre-built function
            'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
            "v_TexCoord = a_TextCoord; " +  // 设置纹理坐标
            '}';

        var fragCode = 'precision mediump float;' +
            "uniform sampler2D u_Sampler;" + // 取样器
            "varying vec2 v_TexCoord;" +  // 接受纹理坐标
            'void main(void) {' +
            "gl_FragColor = texture2D(u_Sampler, v_TexCoord);" +  // 设置颜色
            '}';

        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertCode);
        gl.compileShader(vertShader);

        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragCode);
        gl.compileShader(fragShader);

        var shaderprogram = gl.createProgram();
        gl.attachShader(shaderprogram, vertShader);
        gl.attachShader(shaderprogram, fragShader);
        gl.linkProgram(shaderprogram);

        /*======== Associating attributes to vertex shader =====*/
        var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
        var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
        var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        var _position = gl.getAttribLocation(shaderprogram, "position");
        gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(_position);

        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        var a_TextCoord = gl.getAttribLocation(shaderprogram, "a_TextCoord");
        gl.vertexAttribPointer(a_TextCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_TextCoord);

        //创建纹理对象
        var texture = gl.createTexture();
        //获取u_Sampler的存储位置
        var u_Sampler = gl.getUniformLocation(shaderprogram, 'u_Sampler');

        //创建image对象
        var image = new Image();
        //加载纹理
        image.onload = function () { loadTexture(gl, texture, u_Sampler, image); };
        // 浏览器开始加载图片 注意：一定是2^mx2^n尺寸的图片
        image.src = img;


        gl.useProgram(shaderprogram);


        let installed = false;

        function loadTexture(gl, texture, u_Sampler, image) {

            debugger;
            //1.对纹理图像进行Y轴反转
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            //2.开启0号纹理单元
            gl.activeTexture(gl.TEXTURE0);
            //3.向target绑定纹理对象
            gl.bindTexture(gl.TEXTURE_2D, texture);

            //4.配置纹理参数
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            //5.配置纹理图像
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

            //6.将0号纹理图像传递给着色器
            gl.uniform1i(u_Sampler, 0);
            installed = true;
        }





        /*==================== MATRIX ====================== */

        function get_projection(angle, a, zMin, zMax) {
            var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
            return [
                0.5 / ang, 0, 0, 0,
                0, 0.5 * a / ang, 0, 0,
                0, 0, -(zMax + zMin) / (zMax - zMin), -1,
                0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
            ];
        }

        var proj_matrix = get_projection(40, gl.canvas.width / gl.canvas.height, 1, 100);
        var mo_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        view_matrix[14] = view_matrix[14] - 6;

        /*================= Mouse events ======================*/

        var AMORTIZATION = 0.95;
        var drag = false;
        var old_x, old_y;
        var dX = 0, dY = 0;

        var mouseDown = function (e) {
            drag = true;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
            return false;
        };

        var mouseUp = function (e) {
            drag = false;
        };

        var mouseMove = function (e) {
            if (!drag) return false;
            dX = (e.pageX - old_x) * 2 * Math.PI / gl.canvas.width,
                dY = (e.pageY - old_y) * 2 * Math.PI / gl.canvas.height;
            THETA += dX;
            PHI += dY;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
        };

        gl.canvas.addEventListener("mousedown", mouseDown, false);
        gl.canvas.addEventListener("mouseup", mouseUp, false);
        gl.canvas.addEventListener("mouseout", mouseUp, false);
        gl.canvas.addEventListener("mousemove", mouseMove, false);

        /*=========================rotation================*/

        function rotateX(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv1 = m[1], mv5 = m[5], mv9 = m[9];

            m[1] = m[1] * c - m[2] * s;
            m[5] = m[5] * c - m[6] * s;
            m[9] = m[9] * c - m[10] * s;

            m[2] = m[2] * c + mv1 * s;
            m[6] = m[6] * c + mv5 * s;
            m[10] = m[10] * c + mv9 * s;
        }

        function rotateY(m, angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var mv0 = m[0], mv4 = m[4], mv8 = m[8];

            m[0] = c * m[0] + s * m[2];
            m[4] = c * m[4] + s * m[6];
            m[8] = c * m[8] + s * m[10];

            m[2] = c * m[2] - s * mv0;
            m[6] = c * m[6] - s * mv4;
            m[10] = c * m[10] - s * mv8;
        }

        /*=================== Drawing =================== */

        var THETA = 0,
            PHI = 0;
        var time_old = 0;

        var animate = function (time) {
            var dt = time - time_old;

            if (!drag) {
                dX *= AMORTIZATION, dY *= AMORTIZATION;
                THETA += dX, PHI += dY;
            }

            //set model matrix to I4

            mo_matrix[0] = 1, mo_matrix[1] = 0, mo_matrix[2] = 0,
                mo_matrix[3] = 0,

                mo_matrix[4] = 0, mo_matrix[5] = 1, mo_matrix[6] = 0,
                mo_matrix[7] = 0,

                mo_matrix[8] = 0, mo_matrix[9] = 0, mo_matrix[10] = 1,
                mo_matrix[11] = 0,

                mo_matrix[12] = 0, mo_matrix[13] = 0, mo_matrix[14] = 0,
                mo_matrix[15] = 1;

            rotateY(mo_matrix, THETA);
            rotateX(mo_matrix, PHI);

            time_old = time;
            gl.enable(gl.DEPTH_TEST);

            // gl.depthFunc(gl.LEQUAL);

            // if (installed) {

                gl.clearColor(0, 0, 0, 1);
                gl.clearDepth(1.0);
                gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
                gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
                gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
                gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
            // }

            window.requestAnimationFrame(animate);
        }

        animate(0);
    }

    componentDidMount() {
        this.canvas.resize();
    }

    render() {

        return (
            <Layout style={{ backgroundColor: '#fff' }}>
                <Layout className='' style={{ backgroundColor: '#fff' }}>
                    <RenderCanvas ref={c => this.canvas = c} init={c => this.init(c)} render={c => this.onRender(c)} />
                </Layout>
            </Layout >
        );
    }
}
