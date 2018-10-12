import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon } from 'antd';
import WebsiteNavigator from './website-navigator';

import { WebGL_Start } from './webgl-start';

const { SubMenu } = Menu;
const { Sider } = Layout;

const samples = [
    {
        name: 'services',
        title: 'Start',
        icon: 'file-text',
        component: WebGL_Start,
    }
];


export class Home extends Component {

    static contextTypes = {
        store: PropTypes.object,
    };

    renderMenu(baseUrl) {

        return samples.map((item, index) => {
            return (
                <Menu.Item key={index}>
                    <Link to={`${baseUrl}/${item.name}`}>{<span><Icon type={item.icon} />{item.title}</span>}</Link>
                </Menu.Item>);
        });
    }

    renderRouter(baseUrl) {

        return samples.map((item, index) => {
            return (
                <Route key={index} path={`${baseUrl}/${item.name}`} component={item.component}></Route>
            );
        });
    }

    render() {

        const name = this.props.match.params.name;
        let selectedKeys = [];
        var index = samples.findIndex(c => c.name === name);
        selectedKeys.push(index.toString());

        return (
            <Layout style={{ padding: '0 32px 32px 32px' }}>
                <WebsiteNavigator group='home'>
                </WebsiteNavigator>
                <Layout style={{ padding: '0', background: '#fff' }}>
                    <Sider width={200} style={{ background: '#fff', overflowY: 'auto' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={selectedKeys}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', padding: '24px 0' }}>
                            <SubMenu key="sub1" title={<span><Icon type="profile" />WebGL</span>}>
                                {this.renderMenu(this.props.match.path.replace('/:name', ''))}
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout style={{ background: '#fff' }}>
                        <Switch>
                            {this.renderRouter(this.props.match.path.replace('/:name', ''))}
                        </Switch>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
