/**
 * Created by andreaskaufmann on 29.05.17.
 */
const activities = require('../src/helpers/activities')

describe('It should list all activities matching a regex', () => {
  it('will return null when no activity matches', () =>
    expect(activities.ActivityList.search({ name: /this_will_not_match/ })).toBeNull())
  /* it('will return an array of object when multiple match', () => {
    expect(activities.ActivityList.search({name: /this_is_contained_2_times/}).length).toEqual(1)
   }) */
})
