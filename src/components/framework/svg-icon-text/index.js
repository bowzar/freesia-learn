import React, { Component } from 'react';


export default class SvgIcon extends Component {

    render() {

        return (
            <div className={`layout-h center ${this.props.className}`} style={this.props.style}>
                <svg className={`icon-svg ${this.props.size ? this.props.size : ''}`} aria-hidden="true">
                    <use href={this.props.type}></use>
                </svg>
                <span
                    className={`sp-left-${this.props.spacing ? this.props.spacing : ''} fill`}
                    style={{ display: this.props.text ? 'inherit' : 'none' }}>
                    {this.props.text}
                </span>
            </div>
        );
    }
}
