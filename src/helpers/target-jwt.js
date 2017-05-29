/**
 * Created by 4lk4t on 2017-05-25.
 */
const jwt = require('jwt-simple')

const getConfig = function (account) {
  return {
    payload: {
      'exp': Math.round(87000 + Date.now() / 1000),
      'iss': account.iss,
      'sub': account.sub,
      'aud': account.aud,
      'https://ims-na1.adobelogin.com/s/ent_marketing_sdk': true
    },

    clientId: account.apiKey,
    clientSecret: account.clientSecret,
    pem: account.pem,
    algorithm: 'RS256'
  }
}

exports.getToken = function (account) {
  const config = getConfig(account)
  return jwt.encode(config.payload, config.pem, config.algorithm)
}
