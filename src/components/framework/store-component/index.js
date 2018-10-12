import React from 'react';
import PropTypes from 'prop-types';

export default class Component extends React.Component {

    static contextTypes = {
        store: PropTypes.object,
    };

    storeUnsubscribeCallback = null;

    componentWillMount() {
        const listener = this.createStoreListener();
        if (!listener)
            return;

        this.storeUnsubscribeCallback = this.context.store.subscribe(listener);
    }

    componentWillUnmount() {
        if (!this.storeUnsubscribeCallback)
            return;

        this.storeUnsubscribeCallback();
    }

    createStoreListener() {
    }

    dispatch(msg) {
        this.context.store.dispatch(msg);
    }

    getStore() {
        return this.context.store;
    }
}
