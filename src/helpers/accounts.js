/**
 * Created by 4lk4t on 2017-05-26.
 */
const Preferences = require('preferences')

exports.accountPreferences = new Preferences('target-cli-account-preferences', {
  current: '',
  list: []
})

exports.current = function () {
  let result = exports.accountPreferences.list.filter((v) => v.name === exports.accountPreferences.current)[0]
  return result === undefined ? null : result
}

exports.import = function (jsonList) {
  const importList = JSON.parse(jsonList)
  let errors = ''
  importList.forEach(account => {
    const currentAccountNames = exports.accountPreferences.list.map(account => account.name)

    if (currentAccountNames.indexOf(account.name) > -1) {
      errors += '\nAccount name (' + account.name + ') duplicate. Will not be imported.'
    } else {
      exports.accountPreferences.list.push(account)
    }
  })
  return errors
}

exports.export = function () {
  return JSON.stringify(exports.accountPreferences.list)
}
