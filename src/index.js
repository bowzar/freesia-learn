import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import { LocaleProvider, message } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './reducers';

import App from './app';
import './css/index.less';

require('./fonts/iconfont');

message.config({
  top: 70,
});

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zhCN}>
      <Router>
        <App />
      </Router>
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
);
