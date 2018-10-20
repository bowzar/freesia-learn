import React from 'react';
import Component from '../../../framework/route-component';
import { Layout, Button, Divider } from 'antd';
import { WebGLViewer, Camera, Scene, Vector3, Mesh, BasicMaterial, Cube, Rectangle, Line, LineBasicMaterial, PluginWorldCamera } from '../../../framework/webgl';

export class WebGL_Scene extends Component {

    shutdown = false;
    viewer = null
    camera = null;
    scene = null;
    mesh = null;

    pluginWorldCamera = null;

    state = {
    }

    createRouteDescriptor() {
        return {
            location: this.props.match.path,
            title: 'WebGL-Scene',
            group: 'home',
        }
    }

    componentDidMount() {

        this.viewer.resize();

        setTimeout(() => {
            this.createWebGLObjects();
        }, 100);

        let render = () => {

            if (this.shutdown)
                return;

            if (this.viewer)
                this.viewer.update();
            if (this.pluginWorldCamera)
                this.pluginWorldCamera.update();

            window.requestAnimationFrame(render);
        };

        render();
    }

    componentWillUnmount() {
        this.shutdown = true;

        this.pluginWorldCamera.uninstall();
        localStorage.pluginWorldCamera = this.pluginWorldCamera.toJson();
    }

    createWebGLObjects() {

        this.scene = new Scene({ color: 0xffffff });
        this.camera = new Camera(35, 1, 10000);
        this.camera.setAspect(this.viewer.gl.canvas.width / this.viewer.gl.canvas.height)
        this.viewer.setCamera(this.camera);
        this.viewer.setScene(this.scene);

        let opts = {};
        try {
            opts = JSON.parse(localStorage.pluginWorldCamera);
        }
        catch (error) {
        }

        this.pluginWorldCamera = new PluginWorldCamera(this.viewer, opts);
        this.pluginWorldCamera.install();

        let width = 5000;
        let height = 5000;
        let geometry = new Rectangle(width, height);
        let material = new BasicMaterial({ color: 0x0, opacity: .5 });
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

        let step = 50;
        for (let x = -width / 2; x <= width / 2; x += step) {

            geometry = new Line(new Vector3(x, -height / 2, 0), new Vector3(x, height / 2, 0));
            material = new LineBasicMaterial({ color: 0xdddddd, opacity: 1 });
            let line = new Mesh(geometry, material);
            line.locator.translation.z = 1;
            line.locator.refreshMatrix();
            this.scene.add(line);

            geometry = new Line(new Vector3(-height / 2, x, 0), new Vector3(height / 2, x, 0));
            material = new LineBasicMaterial({ color: 0xdddddd, opacity: 1 });
            line = new Mesh(geometry, material);
            line.locator.translation.z = 1;
            line.locator.refreshMatrix();
            this.scene.add(line);
        }

        geometry = new Cube(50, 50, 50);
        material = new BasicMaterial({ color: 0x0000ff, opacity: 1 });
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

        geometry = new Cube(50, 50, 50);
        material = new BasicMaterial({ color: 0xff0000, opacity: 1 });
        let mesh = new Mesh(geometry, material);
        mesh.locator.translation.x = -100;
        mesh.locator.translation.y = -100;
        mesh.locator.translation.z = 26;
        mesh.locator.refreshMatrix();
        this.scene.add(mesh);

        geometry = new Cube(50, 50, 50);
        material = new BasicMaterial({ color: 0x00ff00, opacity: 1 });
        mesh = new Mesh(geometry, material);
        mesh.locator.translation.x = 100;
        mesh.locator.translation.y = -100;
        mesh.locator.translation.z = 26;
        mesh.locator.refreshMatrix();
        this.scene.add(mesh);
    }

    resetAspect(w, h) {
        if (this.camera)
            this.camera.setAspect(w / h);
    }

    render() {

        return (
            <Layout style={{ backgroundColor: '#fff' }}>
                <Layout className='layout-v' style={{ backgroundColor: '#fff' }}>
                    <div className='toolbar layout-h center'>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.matrix.localScale(1.1, 1.1, 1.1)}>物体放大</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.matrix.localScale(.9, .9, .9)}>物体缩小</Button>
                        <Divider type="vertical" />
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => { this.mesh.locator.matrix.localTranslate(5, 0, 0); }}>物体位移 X</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => { this.mesh.locator.matrix.localTranslate(0, 5, 0); }}>物体位移 Y</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => { this.mesh.locator.matrix.localTranslate(0, 0, 5); }}>物体位移 Z</Button>
                        <Divider type="vertical" />
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => { this.mesh.locator.matrix.localRotateX(10 * Math.PI / 180); }}>物体旋转 X</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => { this.mesh.locator.matrix.localRotateY(10 * Math.PI / 180); }}>物体旋转 Y</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => { this.mesh.locator.matrix.localRotateZ(10 * Math.PI / 180); }}>物体旋转 Z</Button>
                    </div>
                    <Layout className='fill' style={{ backgroundColor: '#fff' }}>
                        <WebGLViewer ref={c => this.viewer = c} resize={(w, h) => this.resetAspect(w, h)} />
                    </Layout>
                </Layout>
            </Layout >
        );
    }
}
