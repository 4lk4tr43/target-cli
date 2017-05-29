/**
 * Created by 4lk4t on 2017-05-28.
 */

const account = require('../src/helpers/accounts')

describe('It should export account preferences', () => {
  const accountPreferences = account.accountPreferences

  it('account variable exists', () => expect(accountPreferences).not.toBeUndefined())
  it('account.list is an array', () => expect(accountPreferences.list.constructor.name).toEqual('Array'))
  it('account.current is a string', () => expect(typeof accountPreferences.current).toEqual('string'))
})

describe('', () => {
  it('', () => expect(1).toBe(1))
})
