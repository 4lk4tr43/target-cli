/**
 * Created by 4lk4t on 2017-05-29.
 */
const minimist = require('minimist')
const Table = require('cli-table2')
const accounts = require('../helpers/accounts')
const style = require('../helpers/style')
const TargetRequest = require('../helpers/target-request').TargetRequest

exports.run = function (args) {
  switch (args[0]) {
    case 'search':
      new TargetRequest(accounts.current())
        .get('/target/activities', minimist(args.slice(1)))
        .then((v) => {
          try {
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
          } catch (e) {
            console.error(
              style.error('Response did not complete. Use --[property]=[value] to filter results.'))
          }
        })
        .catch((v) => console.error(v))
      break

    default:
      break
  }
}
exports.help = function () {}
