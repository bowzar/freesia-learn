import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { Layout, Menu } from 'antd';
import { Home } from './home';

import SvgIconText from '../framework/svg-icon-text';

import './index.less';

const { Header } = Layout;

const pages = [
    {
        name: 'home',
        title: 'Home',
        params: ':name',
        component: Home,
    },
];

class Main extends Component {

    renderLinks(baseUrl) {

        return pages.map((item, index) => {
            return (
                <Menu.Item key={index}>
                    <Link to={`${baseUrl}/${item.name}`}>{item.title}</Link>
                </Menu.Item>
            );
        });
    }

    renderRoutes(baseUrl) {

        return pages.map((item, index) => {
            return (
                <Route key={index} path={`${baseUrl}/${item.name}${item.params ? '/' + item.params : ''}`} component={item.component} ></Route>
            );
        });
    }

    render() {
        const name = this.props.match.params.name;
        const index = pages.findIndex(c => c.name === name);
        const selectedKeys = [];
        selectedKeys.push(index.toString());

        return (
            <Layout className='vstretch'>
                <Header className="layout-header-primary">
                    <div className="logo" ><SvgIconText className='icon' type="#anticon-globe" size='gt' /><span className='title'>Freesia learn</span></div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={selectedKeys}
                        style={{ lineHeight: '64px' }} >
                        {this.renderLinks(this.props.match.path.replace('/:name', ''))}
                    </Menu>
                </Header>
                <Layout>
                    <Switch>
                        <Route exact path={`${this.props.match.path.replace('/:name', '')}/home`} component={Home} ></Route>
                        {this.renderRoutes(this.props.match.path.replace('/:name', ''))}
                    </Switch>
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(Main);