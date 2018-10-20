import React from 'react';
import Component from '../../../framework/route-component';
import { Layout } from 'antd';
import { WebGLViewer, Camera, Scene, Vector3, Mesh, BasicMaterial, ImageMaterial, Rectangle, Line, Shpere, LineBasicMaterial, PluginWorldCamera, Geometry } from '../../../framework/webgl';

import earth_image from './1_earth_8k.jpg';
import tile_image from './2.jpg';


export class WebGL_Earth extends Component {

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
            title: 'WebGL_Earth',
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

        this.scene = new Scene({ color: 0x0 });
        this.camera = new Camera(35, 1, 10000);
        this.camera.setAspect(this.viewer.gl.canvas.width / this.viewer.gl.canvas.height)
        this.viewer.setCamera(this.camera);
        this.viewer.setScene(this.scene);


        this.pluginWorldCamera = new PluginWorldCamera(this.viewer);
        this.pluginWorldCamera.install();

        let width = 5000;
        let height = 5000;
        let geometry = new Rectangle(width, height);
        let material = new BasicMaterial({ color: 0x0, opacity: 0 });
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

        geometry = new Shpere(500);
        material = new ImageMaterial({ src: earth_image });
        material.colors = geometry.colors;
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

        let earthR = 6378137;
        let earthRV = 550;
        let res = 19567.87924099992;
        let level = 3;
        let row = 3;
        let col = 2;
        let tileLength = 256;

        let originX = -2.0037508342787E7;
        let originY = 2.0037508342787E7;

        let minX = originX + tileLength * res * col;
        let maxY = originY - tileLength * res * row;
        let maxX = minX + tileLength * res;
        let minY = maxY - tileLength * res;

        let lonLatLT = this.getLonLat(earthR, minX, maxY);
        let lonLatLB = this.getLonLat(earthR, minX, minY);
        let lonLatRT = this.getLonLat(earthR, maxX, maxY);
        let lonLatRB = this.getLonLat(earthR, maxX, minY);

        let vLT = this.lonLatToVector3(earthRV, lonLatLT.lon, lonLatLT.lat);
        let vLB = this.lonLatToVector3(earthRV, lonLatLB.lon, lonLatLB.lat);
        let vRT = this.lonLatToVector3(earthRV, lonLatRT.lon, lonLatRT.lat);
        let vRB = this.lonLatToVector3(earthRV, lonLatRB.lon, lonLatRB.lat);

        let geoTile = new Geometry();
        geoTile.vertices = [
            vLT.x, vLT.y, vLT.z,
            vLB.x, vLB.y, vLB.z,
            vRB.x, vRB.y, vRB.z,
            vRT.x, vRT.y, vRT.z,
        ];

        geoTile.indices = [
            0, 1, 2,
            0, 2, 3
        ];

        material = new ImageMaterial({ src: tile_image });
        material.colors = [0, 0, 0, 1, 1, 1, 1, 0];
        this.mesh = new Mesh(geoTile, material);
        this.scene.add(this.mesh);
    }

    getLonLat(r, x, y) {

        let lon = x / r;
        let lat = y / r;

        return { lon, lat };
    }

    lonLatToVector3(r, lon, lat) {

        let z = Math.sin(lat) * r;
        let rLon = Math.cos(lat) * r;
        let x = Math.cos(lon) * rLon;
        let y = Math.sin(lon) * rLon;

        return new Vector3(x, y, z);
    }

    resetAspect(w, h) {
        if (this.camera)
            this.camera.setAspect(w / h);
    }

    render() {

        return (
            <Layout style={{ backgroundColor: '#fff' }}>
                <Layout className='layout-v' style={{ backgroundColor: '#fff' }}>
                    <Layout className='fill' style={{ backgroundColor: '#fff' }}>
                        <WebGLViewer ref={c => this.viewer = c} resize={(w, h) => this.resetAspect(w, h)} />
                    </Layout>
                </Layout>
            </Layout >
        );
    }
}
