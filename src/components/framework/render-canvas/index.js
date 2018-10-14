import React, { Component } from 'react';

export default class RenderCanvas extends Component {

    container = null
    canvas = null
    canvasContext = null
    handler = null

    componentDidMount() {
        this.handler = this.resize.bind(this);
        this.canvas = document.getElementById('canvas');
        this.container = this.canvas.parentElement;
        window.addEventListener("resize", this.handler, false);

        if (this.props.init)
            this.canvasContext = this.props.init(this.canvas);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handler);
    }

    resize() {
        setTimeout(() => {
            this.resetCanvasSize();
        }, 0);
    }

    resetCanvasSize() {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;

        if (this.props.render)
            this.props.render(this.canvasContext);
    }

    render() {

        return (
            <canvas id="canvas" />
        );
    }
}
