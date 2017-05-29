/**
 * Created by andreaskaufmann on 29.05.17.
 */

const activities = require('../src/helpers/activities')

describe('It should list all activities matching a regex', () => {
  it('Will return null when no activity matches', () => {
    expect(activities.ActivityList.search({ name: /this_will_not_match/ })).toBeNull()
  })
})
