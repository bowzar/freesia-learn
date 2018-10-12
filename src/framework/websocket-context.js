
export default class WebSocketContext {

    onOpen = null;
    onClose = null;
    onMessage = null;
    onError = null;
    onReady = null;

    constructor(url) {
        this.url = url;
        this.id = '';

        this.ws = new WebSocket(url);
        this.ws.onmessage = e => {
            var msg = JSON.parse(e.data);
            if (msg && msg.type === 'identity') {
                this.id = msg.value;
                if (this.onReady)
                    this.onReady(this.id);
            }

            if (this.onMessage)
                this.onMessage(e, msg.type, msg.value);
        };

        this.ws.onclose = e => {
            if (this.onClose)
                this.onClose(e);
        };

        this.ws.onopen = e => {
            if (this.onOpen)
                this.onOpen(e);

            this.sendMessage('identity');
        };

        this.ws.onerror = e => {
            if (this.onError)
                this.onError(e);
        };
    }

    sendMessage(type, value) {
        this.ws.send(JSON.stringify({ type, value }));
    }
}