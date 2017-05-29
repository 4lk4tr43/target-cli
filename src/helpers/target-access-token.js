/**
 * Created by 4lk4t on 2017-05-25.
 */
const https = require('https')
const queryString = require('querystring')
const targetJwt = require('./target-jwt')

exports.TargetAccessToken = class {
  constructor (account) {
    this.account = account
  }

  get newToken () {
    return new Promise((resolve, reject) => {
      const postData = queryString.stringify({
        client_id: this.account.apiKey,
        client_secret: this.account.clientSecret,
        jwt_token: targetJwt.getToken(this.account).toString('base64')
      })

      const postOptions = {
        host: 'ims-na1.adobelogin.com',
        port: '443',
        path: '/ims/exchange/jwt/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      }

      const req = https.request(postOptions, (res) => {
        res.setEncoding('utf8')
        res.on('data', (accessToken) => resolve(JSON.parse(accessToken)))
      })
      req.on('error', reject)

      req.write(postData)
      req.end()
    })
  }

  get isExpired () {
    return typeof this.account.accessToken === 'undefined' ||
            this.account.accessToken.token === '' ||
            new Date(this.account.accessToken.expirationDate) - new Date(30000) < Date.now()
  }

  get token () {
    return new Promise((resolve, reject) => {
      if (this.isExpired) {
        this.newToken.then((v) => {
          this.account.accessToken = {
            token: v,
            expirationDate: new Date(Date.now() + v['expires_in'])
          }
          resolve(v)
        }).catch(reject)
      } else {
        resolve(this.account.accessToken.token)
      }
    })
  }
}
