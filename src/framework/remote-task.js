
export default class RemoteTask {

    onStarted = null;
    onEnded = null;
    onCompleted = null;
    onTerminated = null;
    onStopped = null;
    onProgressChanged = null;
    onAlert = null;

    onClosed = null;

    constructor(webSocketContext) {

        this.context = webSocketContext;
        this.context.onClosed = e => {
            if (this.onClosed)
                this.onClosed(e);
        };

        this.context.onMessage = (e, type, value) => {

            switch (type) {
                case 'taskStarted':
                    if (this.onStarted)
                        this.onStarted(value);
                    break;
                case 'taskEnded':
                    if (this.onEnded)
                        this.onEnded(value);
                    break;
                case 'taskCompleted':
                    if (this.onCompleted)
                        this.onCompleted(value);
                    break;
                case 'taskTerminated':
                    if (this.onTerminated)
                        this.onTerminated(value);
                    break;
                case 'taskStopped':
                    if (this.onStopped)
                        this.onStopped(value);
                    break;
                case 'taskProgressChanged':
                    if (this.onProgressChanged)
                        this.onProgressChanged(value);
                    break;
                case 'taskAlert':
                    if (this.onAlert)
                        this.onAlert(value);
                    break;
                default:
                    break;
            }
        };
    }
}