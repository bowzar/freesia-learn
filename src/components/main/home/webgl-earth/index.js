import React from 'react';
import Component from '../../../framework/route-component';
import { Layout } from 'antd';
import { WebGLViewer, MathUtils, Camera, Scene, Vector3, Mesh, BasicMaterial, ImageMaterial, Rectangle, Line, Shpere, LineBasicMaterial, PluginWorldCamera, Geometry, TileSurface, PluginGlobalCamera, CamberedSurface } from '../../../framework/webgl';

import earth_image from './1_earth_8k.jpg';
import tile_image from './2.jpg';


export class WebGL_Earth extends Component {

    shutdown = false;
    viewer = null
    camera = null;
    scene = null;
    mesh = null;


    earthR = 6378137;
    earthRV = 1000;
    // res = 0.087890625;
    res = 9783.93962049996;
    tileLength = 256;

    // originX = -180.0;
    // originY = 90.0;
    originX = -2.0037508342787E7;
    originY = 2.0037508342787E7;

    pluginCamera = null;

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
            if (this.pluginCamera)
                this.pluginCamera.update();

            window.requestAnimationFrame(render);
        };

        render();
    }

    componentWillUnmount() {
        this.shutdown = true;

        this.pluginCamera.uninstall();
    }

    createWebGLObjects() {

        this.scene = new Scene({ color: 0x0 });
        this.camera = new Camera(35, 1, 20000);
        this.camera.setAspect(this.viewer.gl.canvas.width / this.viewer.gl.canvas.height)
        this.viewer.setCamera(this.camera);
        this.viewer.setScene(this.scene);


        this.pluginCamera = new PluginGlobalCamera(this.viewer, { globalR: this.earthRV, cameraLength: this.earthRV * 5 });
        this.pluginCamera.install();

        let width = 5000;
        let height = 5000;
        let geometry = new Rectangle(width, height);
        let material = new BasicMaterial({ color: 0x0, opacity: 0 });
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);

        let step = 200;
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

        geometry = new Shpere(1000);
        material = new BasicMaterial({ color: 0xffffff });
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);


        // for (let i = 0; i < 16; i++) {
        //     for (let j = 0; j < 16; j++) {
        //         this.createEarthTile(4, i, j);
        //     }
        // }       

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                this.createEarthTile(4, i, j);
            }
        }

        // this.createEarthTile(2, 0, 1);
        // this.createEarthTile(2, 1, 1);
        // this.createEarthTile(1, 0, 1);
        // this.createEarthTile(1, 0, 2);
        // this.createEarthTile(1, 0, 3);
        // this.createEarthTile(1, 1, 0);
        // this.createEarthTile(1, 1, 1);
        // this.createEarthTile(1, 1, 2);
        // this.createEarthTile(1, 1, 3);
        // this.createEarthTile(3, 0, 1);
        // this.createEarthTile(3, 0, 2);
        // this.createEarthTile(3, 0, 3);
        // this.createEarthTile(3, 2, 1);
        // this.createEarthTile(3, 2, 2);
        // this.createEarthTile(3, 3, 0);
        // this.createEarthTile(3, 3, 1);
        // this.createEarthTile(3, 3, 2);
        // this.createEarthTile(3, 3, 3);
    }

    createEarthTile(level, row, col) {

        let grid = MathUtils.getTileWebMercatorEnvelopeByGrid(level, row, col, this.earthRV);

        // let minX = this.originX + this.tileLength * this.res * col;
        // let maxY = this.originY - this.tileLength * this.res * row;
        // let maxX = minX + this.tileLength * this.res;
        // let minY = maxY - this.tileLength * this.res;

        // let lonLatLT = this.getLonLat(this.earthR, minX, maxY);
        // let lonLatRB = this.getLonLat(this.earthR, maxX, minY);

        let geoTile = new TileSurface(this.earthRV, grid.maxLat, grid.minLon, grid.minLat, grid.maxLon);

        // let material = new ImageMaterial({ src: `http://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer/tile/${level}/${row}/${col}` });
        // let material = new ImageMaterial({ src: `http://server.arcgisonline.com/arcgis/rest/services/ESRI_StreetMap_World_2D/MapServer/tile/${level}/${row}/${col}` });
        // let material = new ImageMaterial({ src: `https://mt0.google.cn/maps/vt?lyrs=y&hl=zh-CN&gl=CN&&x=${col}&y=${row}&z=${level}&scale=2` });
        let material = new ImageMaterial({ src: `http://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/${level}/${row}/${col}` });
        // let material = new ImageMaterial({ src: `http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/${level}/${row}/${col}` });
        material.colors = geoTile.colors;
        let mesh = new Mesh(geoTile, material);
        this.scene.add(mesh);
    }

    getLonLat(r, x, y) {

        let lon = MathUtils.webMercatorXToRadianLon(x, r);
        let lat = MathUtils.webMercatorYToRadianLat(y, r);

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
