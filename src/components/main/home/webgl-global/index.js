import React from 'react';
import Component from '../../../framework/route-component';
import { Layout } from 'antd';
import RenderCanvas from '../../../framework/render-canvas';
import img from './1.jpg';

export class WebGL_Global extends Component {

    state = {
    }

    canvas = null

    createRouteDescriptor() {
        return {
            location: this.props.match.path,
            title: 'WebGL-Global',
            group: 'home',
        }
    }

    init(canvas) {
        return canvas.getContext('webgl');
    }

    createOther(gl) {


        var vertices = [];
        var colors = [];
        var indices = [];

        var latitudeBands = 50;//纬度带
        var longitudeBands = 50;//经度带

        for (var latNum = 0; latNum <= latitudeBands; latNum++) {
            var lat = latNum * Math.PI / latitudeBands - Math.PI / 2;//纬度范围从-π/2到π/2
            var sinLat = Math.sin(lat);
            var cosLat = Math.cos(lat);

            for (var longNum = 0; longNum <= longitudeBands; longNum++) {
                var lon = longNum * 2 * Math.PI / longitudeBands - Math.PI;//经度范围从-π到π
                var sinLon = Math.sin(lon);
                var cosLon = Math.cos(lon);

                var x = cosLat * cosLon;
                var y = cosLat * sinLon;
                var z = sinLat;
                // var u = (longNum / longitudeBands);
                // var v = (latNum / latitudeBands);

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);
                colors.push(x);
                colors.push(y);
                colors.push(z);

                // textureCoordData.push(u);
                // textureCoordData.push(v);

            }
        }

        for (var latNum = 0; latNum < latitudeBands; latNum++) {
            for (var longNum = 0; longNum < longitudeBands; longNum++) {
                var first = latNum * (longitudeBands + 1) + longNum;
                var second = first + longitudeBands + 1;

                indices.push(first);
                indices.push(first + 1);
                indices.push(second);

                indices.push(second);
                indices.push(second + 1);
                indices.push(first + 1);
            }
        }



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
            'attribute vec3 color;' +//the color of the point
            'varying vec3 vColor;' +
            'void main(void) { ' +//pre-built function
            'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
            'vColor = color;' +
            '}';

        var fragCode = 'precision mediump float;' +
            'varying vec3 vColor;' +
            'void main(void) {' +
            'gl_FragColor = vec4(vColor, 0.5);' +
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

        var _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
        var _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
        var _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");

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
        var mo_matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1];
        var view_matrix = [
            .9, 0, 0, 0,
            0, .9, 0, 0,
            0, 0, .9, 0,
            0, 0, 0, 1];

        view_matrix[14] = view_matrix[14] - 6;


        return () => {
            gl.useProgram(shaderprogram);

            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            var _position = gl.getAttribLocation(shaderprogram, "position");
            gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(_position);

            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            var color = gl.getAttribLocation(shaderprogram, "color");
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(color);

            gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
            gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
            gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);


            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
            // gl.drawArrays(gl.LINES, 0, vertices.length / 3);

        };
    }

    onRender(gl) {




        var vertices = [];
        var colors = [];
        var indices = [];

        var latitudeBands = 50;//纬度带
        var longitudeBands = 50;//经度带

        for (var latNum = 0; latNum <= latitudeBands; latNum++) {
            var lat = latNum * Math.PI / latitudeBands - Math.PI / 2;//纬度范围从-π/2到π/2
            var sinLat = Math.sin(lat);
            var cosLat = Math.cos(lat);

            for (var longNum = 0; longNum <= longitudeBands; longNum++) {
                var lon = longNum * 2 * Math.PI / longitudeBands - Math.PI;//经度范围从-π到π
                var sinLon = Math.sin(lon);
                var cosLon = Math.cos(lon);

                var x = cosLat * cosLon;
                var y = cosLat * sinLon;
                var z = sinLat;
                // var u = (longNum / longitudeBands);
                // var v = (latNum / latitudeBands);

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);
                colors.push(x);
                colors.push(y);
                colors.push(z);

                // textureCoordData.push(u);
                // textureCoordData.push(v);

            }
        }

        for (var latNum = 0; latNum < latitudeBands; latNum++) {
            for (var longNum = 0; longNum < longitudeBands; longNum++) {
                var first = latNum * (longitudeBands + 1) + longNum;
                var second = first + longitudeBands + 1;

                indices.push(first);
                indices.push(first + 1);
                indices.push(second);

                indices.push(second);
                indices.push(second + 1);
                indices.push(first + 1);
            }
        }



        // Create and store data into vertex buffer
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Create and store data into color buffer
        var color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // Create and store data into index buffer
        // var index_buffer = gl.createBuffer();
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
        // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        /*=================== SHADERS =================== */

        var vertCode = 'attribute vec3 position;' +
            'uniform mat4 Pmatrix;' +
            'uniform mat4 Vmatrix;' +
            'uniform mat4 Mmatrix;' +
            'attribute vec3 color;' +//the color of the point
            'varying vec3 vColor;' +
            'void main(void) { ' +//pre-built function
            'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
            'vColor = color;' +
            '}';

        var fragCode = 'precision mediump float;' +
            'varying vec3 vColor;' +
            'void main(void) {' +
            'gl_FragColor = vec4(vColor, 1.);' +
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


        const renderOther = this.createOther(gl);


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

            gl.depthFunc(gl.LEQUAL);

            gl.clearColor(0, 0, 0, 1);
            gl.clearDepth(1.0);
            gl.viewport(0.0, 0.0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



            gl.useProgram(shaderprogram);

            gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
            var _position = gl.getAttribLocation(shaderprogram, "position");
            gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(_position);

            gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
            var color = gl.getAttribLocation(shaderprogram, "color");
            gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(color);

            gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
            gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
            gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);

            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
            // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
            gl.drawArrays(gl.LINES, 0, vertices.length / 3);

            renderOther();


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
