export default class ResponseData {

    constructor(status, message, data) {

        this.status = status;
        this.message = message;
        this.data = data;
    }

    static fromError(err) {
        return new ResponseData(500, err.message, err);
    }

    static fromResponse(res) {
        return new ResponseData(res.status, res.statusText, res);
    }

    static from(obj) {

        if (obj instanceof Error)
            return this.fromError(obj);
        else if (obj instanceof Response)
            return this.fromResponse(obj);

        return new ResponseData(obj.status, obj.message, obj);
    }
}