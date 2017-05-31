/**
 * Created by andreaskaufmann on 31.05.17.
 */
const minimist = require('minimist')
const accounts = require('../helpers/accounts')
const TargetRequest = require('../helpers/target-request').TargetRequest

exports.run = function (args) {
  const argsJson = minimist(args)

  const path = argsJson._[0]
  const query = argsJson.query ? JSON.parse(argsJson.query) : ''

  new TargetRequest(accounts.current())
    .get(path, query)
      .then(data => process.stdout.write(data))
      .catch(error => process.stderr.write(error))
}
