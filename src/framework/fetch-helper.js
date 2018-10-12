import ResponseData from './response-data';

export default class FetchHelper {

    static request(url, opts) {

        return new Promise((resolve, reject) => {

            fetch(url, opts)
                .then(res => {
                    if (res.ok)
                        resolve(res);
                    else
                        reject(res);
                })
                .catch(err => {
                    reject(ResponseData.from(err));
                });
        });
    }

    static requestJson(url, opts) {

        return new Promise((resolve, reject) => {

            this.request(url, opts)
                .then(res => {
                    res.json()
                        .then(data => {
                            resolve(data);
                        })
                        .catch(err => {
                            reject(ResponseData.from(err));
                        });
                })
                .catch(err => {
                    if (!(err instanceof Response)) {
                        reject(ResponseData.from(err));
                        return;
                    }

                    err.json()
                        .then(data => {
                            reject(ResponseData.from(data));
                        })
                        .catch(() => {
                            reject(ResponseData.from(err));
                        });
                });
        });
    }

    static getJson(url, body) {

        const opts = {
            method: 'GET',
            body: body && JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        }

        return this.requestJson(url, opts);
    }

    static postJson(url, body) {

        const opts = {
            method: 'POST',
            body: body && JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
            },
        }

        return this.requestJson(url, opts);
    }

    static putJson(url, body) {

        const opts = {
            method: 'PUT',
            body: body && JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        }

        return this.requestJson(url, opts);
    }

    static deleteJson(url, body) {

        const opts = {
            method: 'DELETE',
            body: body && JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        }

        return this.requestJson(url, opts);
    }
}