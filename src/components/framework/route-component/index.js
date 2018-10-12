import StoreComponent from '../store-component';

export default class Component extends StoreComponent {

    routeDescriptor = null;

    componentWillMount() {
        super.componentWillMount();

        if (!this.routeDescriptor)
            this.routeDescriptor = this.createRouteDescriptor();

        this.dispatch({
            type: 'routeInstall',
            group: this.routeDescriptor.group,
            item: this.routeDescriptor,
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        if (!this.routeDescriptor)
            this.routeDescriptor = this.createRouteDescriptor();

        this.dispatch({
            type: 'routeUninstall',
            group: this.routeDescriptor.group,
            item: this.routeDescriptor,
        });
    }

    createRouteDescriptor() {
    }
}
