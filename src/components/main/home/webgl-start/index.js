import React from 'react';
import Component from '../../../framework/route-component';
import { Layout } from 'antd';

import './index.less';

export class WebGL_Start extends Component {

    state = {
    }

    container = null
    canvas = null

    createRouteDescriptor() {
        return {
            location: this.props.match.path,
            title: 'WebGL-Start',
            group: 'home',
        }
    }

    resizeCanvas() {
        debugger;
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    componentDidMount() {

        this.canvas = document.getElementById('canvas');

        this.container = canvas.parentElement;
        this.container.addEventListener("resize", () => this.resizeCanvas(), false);

        var context = this.canvas.getContext('2d');
        context.font = '15pt Calibri';
        context.fillStyle = 'green';
        context.fillText('Welcome to Yiibai Tutorial', 100, 100);
    }

    componentWillUnmount() {
        this.container.removeEventListener("resize", resizeCanvas);
    }

    render() {

        return (
            <Layout style={{ backgroundColor: '#fff' }}>
                <Layout className='' style={{ backgroundColor: '#fff' }}>
                    <canvas id="canvas" width='1656' height='416' ></canvas>
                </Layout>
            </Layout >
        );
    }
}
