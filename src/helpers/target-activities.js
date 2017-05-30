/**
 * Created by andreaskaufmann on 29.05.17.
 */
const accounts = require('./accounts')
const TargetRequest = require('./target-request').TargetRequest

const targetRequest = new TargetRequest(accounts.current())

exports.ActivityList = class {
  static search (properties) {
    return new Promise((resolve, reject) => {
      targetRequest
        .get('/target/activities', properties)
          .then(resolve)
          .catch(reject)
    })
  }
}

exports.Activity = class {
  static info (properties) {
    return new Promise((resolve, reject) => {
      exports.ActivityList.search(properties)
        .then(v => {
          let promises = []
          v['activities'].forEach(activity => {
            promises.push(
              targetRequest
                .get('/target/activities/' + activity['type'] + '/' + activity['id'])
            )
          })
          Promise.all(promises)
            .then(resolve)
            .catch(reject)
        })
        .catch(reject)
    })
  }
}
