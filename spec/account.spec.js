/**
 * Created by 4lk4t on 2017-05-28.
 */
const account = require('../src/helpers/accounts')

describe('It should export account preferences', () => {
  it('accountPreferences variable exists', () => expect(account.accountPreferences).not.toBeUndefined())
  it('accountPreferences.list is an array', () => expect(account.accountPreferences.list.constructor.name).toEqual('Array'))
  it('accountPreferences.current is a string', () => expect(typeof account.accountPreferences.current).toEqual('string'))
})
