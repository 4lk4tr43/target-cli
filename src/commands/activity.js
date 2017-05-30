/**
 * Created by 4lk4t on 2017-05-29.
 */
const minimist = require('minimist')
const Table = require('cli-table2')
const targetActivities = require('../helpers/target-activities')
const ActivityList = targetActivities.ActivityList
const Activity = targetActivities.Activity
const style = require('../helpers/style')

exports.run = function (args) {
  switch (args[0]) {
    case 'search':
      ActivityList.search(minimist(args.slice(1)))
        .then(v => {
          console.log(style.success('\nFound ' + v['total'] + ' activities'))
          const table = new Table({
            head: ['id', 'type', 'name', 'state', 'priority', 'modified']
          })
          v['activities'].forEach((a) => {
            table.push([
              a['id'],
              a['type'],
              a['name'],
              a['state'],
              a['priority'],
              new Date(a['modifiedAt']).toLocaleDateString()])
          })
          console.log(table.toString())
        })
        .catch(v => console.error(style.error('Response did not complete.\n') + JSON.stringify(v)))
      break

    case 'experiences':
      Activity.info(minimist(args.slice(1)))
        .then(v => {
          v.forEach(activity => {
            console.log(style.info(activity['name'] + '\n'))

            activity['experiences'].forEach(experience => {
              console.log(experience['offerLocations'])
              const table = new Table({
                head: ['name', 'offer ID', 'location local ID']
              })
              experience['offerLocations'].forEach(location => {
                table.push([
                  experience['name'],
                  location['offerId'],
                  location['locationLocalId']
                ])
              })

              console.log(table.toString())
            })
          })
        })
      break

    default:
      break
  }
}
exports.help = function () {}
