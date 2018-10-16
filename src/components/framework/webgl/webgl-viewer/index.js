import React, { Component } from 'react';

export default class WebGLViewer extends Component {

    dom = null;
    domParent = null;
    gl = null;
    args = { antialias: true };

    componentDidMount() {
        this.dom = document.getElementById('webgl-canvas');
        this.domParent = this.dom.parentElement;
        this.gl = this.dom.getContext('webgl', this.args);

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

    update(scene, camera) {
        scene.update(this.gl, camera);
    }

    render() {
        return (
            <canvas id="webgl-canvas" />
        );
    }
}