import React, { Component } from 'react';
import { ProgramCenter } from '../program';

export default class WebGLViewer extends Component {

    dom = null;
    domParent = null;
    gl = null;
    args = { antialias: true };
    programCenter = null;
    camera = null;
    scene = null;

    setCamera(camera) {
        this.camera = camera;
    }

    setScene(scene) {
        this.scene = scene;
    }

    componentDidMount() {
        this.dom = document.getElementById('webgl-canvas');
        this.domParent = this.dom.parentElement;
        this.gl = this.dom.getContext('experimental-webgl');

        this.programCenter = new ProgramCenter(this.gl);

        this.handlerResize = this.resize.bind(this);
        window.addEventListener("resize", this.handlerResize, false);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handlerResize);
    }

    resize() {
        setTimeout(() => {
            this.resetCanvasSize();
        }, 0);
    }

    resetCanvasSize() {
        this.dom.width = this.domParent.clientWidth;
        this.dom.height = this.domParent.clientHeight;

        if (this.props.resize)
            this.props.resize(this.dom.width, this.dom.height);
    }

    update() {
        if (this.scene && this.camera)
            this.scene.update(this, this.camera);
    }

    render() {
        return (
            <canvas id="webgl-canvas" tabIndex="1" />
        );
    }
}