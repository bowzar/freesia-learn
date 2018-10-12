import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Layout } from 'antd';
import Component from './components/framework/store-component';
import Main from './components/main';

class App extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <Layout className='vstretch'>
                <Switch>
                    <Redirect exact path='/' to='/main/home' />
                    <Redirect exact path='/main' to='/main/home' />
                    <Route path='/main/:name' component={Main}></Route>
                </Switch>
            </Layout>
        );
    }
}

export default App;
