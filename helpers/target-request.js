/**
 * Created by 4lk4t on 2017-05-25.
 */
const https = require('https');
const querystring = require('querystring');
const TargetAccessToken = require('../helpers/target-access-token');

exports.TargetRequest = class {
    constructor(account) {
        this.host = 'mc.adobe.io';
        this.port = '443';
        this.account = account;
    }

    init() {
        this.accessToken = new TargetAccessToken.TargetAccessToken(this.account);

        return new Promise((resolve, reject) => {
            this.accessToken.token
                .then((v) => {
                    if (v.hasOwnProperty('access_token')) {
                        resolve();
                    } else {
                        reject('Could not acquire access token.\n' + v);
                    }
                });
        });
    }

    test() {
        return new Promise((resolve, reject) => {
            this.get('/target/environments').then((v) => {
                const response = JSON.parse(v);
                if (response.hasOwnProperty('error_code')) {
                    reject(response['message']);
                } else {
                    resolve(response);
                }
            }).catch(reject);
        });
    }

    get requestHeaders() {
        return new Promise((resolve, reject) => {
            this.accessToken.token
                .then((v) => {
                    resolve({
                        'Content-Type': 'application/vnd.adobe.target.v1+json',
                        'Authorization': 'Bearer ' + v['access_token'],
                        'X-Api-Key': this.account.apiKey
                    })
                })
                .catch((v) => reject('Failed to retrieve request header access token.\n' + v));
        });
    }

    g() {
        () => {
            return new Promise((resolve, reject) => {
                this.requestHeaders
                    .then((headers) => {
                        const requestPath = '/' + this.account.tenant +
                            ((typeof params === 'undefined' || Object.keys(params).length === 0) ?
                                path : path + '?' + querystring.stringify(params));
                        const options = {
                            host: this.host,
                            port: this.port,
                            path: requestPath,
                            method: 'GET',
                            headers: headers
                        };
                        const req = https.request(options, (res) => {
                            res.setEncoding('utf8');
                            res.on('data', (data) => resolve(data));
                        });
                        req.on('error', reject);
                        req.end();
                    })
                    .catch(reject)
            });
        }
    }

    // TODO remove repetition in methods
    get(path, params) {
        return new Promise((resolve, reject) => {
            this.requestHeaders
                .then((headers) => {
                    const requestPath = '/' + this.account.tenant +
                        ((typeof params === 'undefined' || Object.keys(params).length === 0) ?
                            path : path + '?' + querystring.stringify(params));
                    const options = {
                        host: this.host,
                        port: this.port,
                        path: requestPath,
                        method: 'GET',
                        headers: headers
                    };
                    const req = https.request(options, (res) => {
                        res.setEncoding('utf8');
                        res.on('data', (data) => resolve(data));
                    });
                    req.on('error', reject);
                    req.end();
                })
                .catch(reject)
        });
    }

    post(path, params, data) {
        return new Promise((resolve, reject) => {
            this.requestHeaders
                .then((headers) => {
                    const requestPath = '/' + this.account.tenant +
                        ((typeof params === 'undefined' || Object.keys(params).length === 0) ?
                            path : path + '?' + querystring.stringify(params));
                    const postData = querystring.stringify(data);
                    const options = {
                        host: this.host,
                        port: this.port,
                        path: requestPath,
                        method: 'POST',
                        headers: Object.assign({}, headers, {'Content-Length': Buffer.byteLength(postData)})
                    };
                    const req = https.request(options, (res) => {
                        res.setEncoding('utf8');
                        res.on('data', (data) => resolve(data));
                    });
                    req.on('error', reject);
                    req.write(postData);
                    req.end();
                })
                .catch(reject)
        });
    }

    put(path, params, data) {
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                this.requestHeaders
                    .then((headers) => {
                        const requestPath = '/' + this.account.tenant +
                            ((typeof params === 'undefined' || Object.keys(params).length === 0) ?
                                path : path + '?' + querystring.stringify(params));
                        const postData = querystring.stringify(data);
                        const options = {
                            host: this.host,
                            port: this.port,
                            path: requestPath,
                            method: 'PUT',
                            headers: Object.assign({}, headers, {'Content-Length': Buffer.byteLength(postData)})
                        };
                        const req = https.request(options, (res) => {
                            res.setEncoding('utf8');
                            res.on('data', (data) => resolve(data));
                        });
                        req.on('error', reject);
                        req.write(postData);
                        req.end();
                    })
                    .catch(reject)
            });
        });
    }

    delete(path, params) {
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                this.requestHeaders
                    .then((headers) => {
                        const requestPath = '/' + this.account.tenant +
                            ((typeof params === 'undefined' || Object.keys(params).length === 0) ?
                                path : path + '?' + querystring.stringify(params));
                        const options = {
                            host: this.host,
                            port: this.port,
                            path: requestPath,
                            method: 'GET',
                            headers: headers
                        };
                        const req = https.request(options, (res) => {
                            res.setEncoding('utf8');
                            res.on('data', (data) => resolve(data));
                        });
                        req.on('error', reject);
                        req.end();
                    })
                    .catch(reject)
            });
        });
    }
};