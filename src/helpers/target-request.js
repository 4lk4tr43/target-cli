/**
 * Created by 4lk4t on 2017-05-25.
 */
const https = require('https')
const queryString = require('querystring')
const TargetAccessToken = require('../helpers/target-access-token')

exports.TargetRequest = class {
  constructor (account) {
    this.host = 'mc.adobe.io'
    this.port = '443'
    this.account = account

    this.accessToken = new TargetAccessToken.TargetAccessToken(this.account)

    this.get = this.createRequestMethod('GET')
    this.post = this.createRequestMethod('POST')
    this.put = this.createRequestMethod('PUT')
    this.delete = this.createRequestMethod('DELETE')
  }

  test () {
    return new Promise((resolve, reject) => {
      this.get('/target/environments').then((v) => {
        if (v.hasOwnProperty('error_code')) {
          reject(v['message'])
        } else {
          resolve(v)
        }
      }).catch(reject)
    })
  }

  get requestHeaders () {
    return new Promise((resolve, reject) => {
      this.accessToken.token
                .then((v) => {
                  resolve({
                    'Content-Type': 'application/vnd.adobe.target.v1+json',
                    'Authorization': 'Bearer ' + v['access_token'],
                    'X-Api-Key': this.account.apiKey
                  })
                })
                .catch((v) => reject(new Error('Failed to retrieve request access token.\n' + v)))
    })
  }

  createRequestMethod (method) {
    const hasBody = method === 'POST' || method === 'PUT'

    const generateRequestPath = (account, path, params) => {
      return '/' + this.account.tenant +
                ((typeof params === 'undefined' || Object.keys(params).length === 0)
                    ? path : path + '?' + queryString.stringify(params))
    }

    const options = {
      host: this.host,
      port: this.port,
      method: method
    }

    const request = (headers, path, params, resolve, reject) => {
      const req = https.request(
        Object.assign({}, options, {
          headers: headers,
          path: generateRequestPath(this.account, path, params)
        }),
        (res) => {
          res.setEncoding('utf8')
          res.on('data', (data) => resolve(JSON.parse(data)))
        })
      req.on('error', reject)
      return req
    }

    if (hasBody) {
      return (path, params, data) => {
        return new Promise((resolve, reject) => {
          this.requestHeaders
                        .then((headers) => {
                          const bodyData = queryString.stringify(data)
                          const req = request(
                                Object.assign(
                                    {}, headers,
                                    {'Content-Length': Buffer.byteLength(bodyData)}
                                ),
                                path, params, resolve, reject
                            )
                          req.write(bodyData)
                          req.end()
                        })
                        .catch(reject)
        })
      }
    } else {
      return (path, params) => {
        return new Promise((resolve, reject) => {
          this.requestHeaders
                        .then((headers) => request(headers, path, params, resolve, reject).end())
                        .catch(reject)
        })
      }
    }
  }
}
