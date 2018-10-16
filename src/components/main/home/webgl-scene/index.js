import React from 'react';
import Component from '../../../framework/route-component';
import { Layout, Button, Divider } from 'antd';
import { WebGLViewer, Camera, Scene, Mesh, BasicMaterial, Cube } from '../../../framework/webgl';

export class WebGL_Scene extends Component {

    shutdown = false;
    viewer = null
    camera = null;
    scene = null;
    mesh = null;

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

            if (this.viewer && this.scene && this.camera)
                this.viewer.update(this.scene, this.camera);

            window.requestAnimationFrame(render);
        };

        render();
    }

    componentWillUnmount() {
        this.shutdown = true;
    }

    createWebGLObjects() {

        this.scene = new Scene();
        this.camera = new Camera(35, 1, 1000);
        this.camera.setAspect(this.viewer.gl.canvas.width / this.viewer.gl.canvas.height)
        this.camera.locator.translation.z = 400;
        this.camera.locator.translation.y = 100;
        this.camera.locator.lookAt([0, 0, 0], [0, 1, 0]);

        let geometry = new Cube(50, 50, 50);
        let material = new BasicMaterial();
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

        geometry = new Cube(50, 50, 50);
        material = new BasicMaterial();
        let mesh = new Mesh(geometry, material);
        mesh.locator.translation.x = -100;
        mesh.locator.translation.z = -100;
        this.scene.add(mesh);

        geometry = new Cube(50, 50, 50);
        material = new BasicMaterial();
        mesh = new Mesh(geometry, material);
        mesh.locator.translation.x = 100;
        mesh.locator.translation.z = -100;
        this.scene.add(mesh);
    }

    resetAspect(w, h) {
        if (this.camera)
            this.camera.setAspect(w / h);
    }

    cameraRotateX() {
        this.camera.locator.rotation.x += 10 * Math.PI / 180;
        this.camera.locator.lookAt([0, 0, 0], [0, 1, 0]);
    }

    cameraRotateY() {
        this.camera.locator.rotation.y += 10 * Math.PI / 180;
        this.camera.locator.lookAt([0, 0, 0], [0, 1, 0]);
    }

    cameraRotateZ() {
        this.camera.locator.rotation.z += 10 * Math.PI / 180;
        this.camera.locator.lookAt([0, 0, 0], [0, 1, 0]);
    }

    meshScaleOut() {
        this.mesh.locator.scale.x += 0.1;
        this.mesh.locator.scale.y += 0.1;
        this.mesh.locator.scale.z += 0.1;
    }

    meshScaleIn() {
        this.mesh.locator.scale.x -= 0.1;
        this.mesh.locator.scale.y -= 0.1;
        this.mesh.locator.scale.z -= 0.1;
    }

    render() {

        return (
            <Layout style={{ backgroundColor: '#fff' }}>
                <Layout className='layout-v' style={{ backgroundColor: '#fff' }}>
                    <div className='toolbar layout-h center'>
                        <Button
                            loading={this.state.isBusyService}
                            onClick={() => this.cameraRotateX()}>摄像机旋转 X 轴</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.cameraRotateY()}>摄像机旋转 Y 轴</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.cameraRotateZ()}>摄像机旋转 Z 轴</Button>
                        <Divider type="vertical" />
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.meshScaleOut()}>物体放大</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.meshScaleIn()}>物体缩小</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.translation.x += 5}>物体位移 X</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.translation.y += 5}>物体位移 Y</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.translation.z += 5}>物体位移 Z</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.rotation.x += 5}>物体旋转 X</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.rotation.y += 5}>物体旋转 Y</Button>
                        <Button
                            className='sp-left'
                            loading={this.state.isBusyService}
                            onClick={() => this.mesh.locator.rotation.z += 5}>物体旋转 Z</Button>
                    </div>
                    <Layout className='fill' style={{ backgroundColor: '#fff' }}>
                        <WebGLViewer ref={c => this.viewer = c} resize={(w, h) => this.resetAspect(w, h)} />
                    </Layout>
                </Layout>
            </Layout >
        );
    }
}
