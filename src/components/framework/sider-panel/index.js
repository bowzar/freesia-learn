import React, { Component } from 'react';


export default class SiderPanel extends Component {

    render() {

        return (
            <div className='layout-v sider-panel'>
                <span className='sider-title'>{this.props.title}</span>
                {this.props.children}
            </div>
        );
    }
}
