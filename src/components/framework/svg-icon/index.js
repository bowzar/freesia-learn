import React, { Component } from 'react';


export default class SvgIconText extends Component {

    render() {

        return (
            <svg className={`icon-svg ${this.props.size && ''}`} aria-hidden="true">
                <use href={this.props.type && ''}></use>
            </svg>
        );
    }
}
