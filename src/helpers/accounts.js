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
