import React from 'react';
import Component from '../../../framework/store-component';
import { withRouter } from "react-router-dom";
import { Breadcrumb, Icon } from 'antd';
import _ from 'lodash';

class WebsiteNavigator extends Component {

    unsubscribe = null;
    items = [];

    constructor() {
        super();
        this.state = {
        };
    }

    createStoreListener() {

        return () => {

            const state = this.context.store.getState();
            if (!state)
                return;

            switch (state.action.type) {

                case 'routeInstall':
                    if (state.action.group !== this.props.group)
                        return;

                    this.items.push(state.action.item);
                    this.setState({ items: this.items });
                    return;

                case 'routeUninstall':
                    if (state.action.group !== this.props.group)
                        return;

                    _.remove(this.items, item => item === state.action.item);
                    this.setState({ items: this.items });
                    return;
                default:
                    return;
            }
        };
    }

    render() {

        const renderItem = (items) => {

            if (!items)
                return;

            return items.map((item, index) => {
                return (
                    <Breadcrumb.Item key={index} href={item.location}>
                        <Icon style={{ fontSize: 16 }} type={item.icon} />
                        <span>{item.title}</span>
                    </Breadcrumb.Item>
                );
            });
        };

        return (
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item href={this.props.match.path.replace('/:name', '')}>
                    <Icon style={{ fontSize: 16 }} type="home" />
                    <span>Home</span>
                </Breadcrumb.Item>
                {renderItem(this.state.items)}
            </Breadcrumb>
        );
    }
}

export default withRouter(WebsiteNavigator);