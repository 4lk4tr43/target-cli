/**
 * Created by 4lk4t on 2017-05-29.
 */
const minimist = require('minimist')
const Table = require('cli-table2')
const targetActivities = require('../helpers/target-activities')
const ActivityList = targetActivities.ActivityList
const Activity = targetActivities.Activity
const style = require('../helpers/style')
const Spinner = require('cli-spinner').Spinner

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
      const spinner = new Spinner('Connecting... %s')
      spinner.setSpinnerString(style.defaultSpinner)
      spinner.start()

      Activity.info(minimist(args.slice(1)))
        .then(v => {
          spinner.stop(true)
          v.forEach(activity => {
            console.log('\n' + style.info(activity['name']))
            activity['experiences'].forEach(experience => {
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
        .catch(v => {
          spinner.stop(true)
          console.error(style.error('Response did not complete.\n') + JSON.stringify(v))
        })
      break

    default:
      break
  }
}
exports.help = function () {}
