/**
 * Created by 4lk4t on 2017-05-17.
 */
const chalk = require('chalk');

module.exports.standard = function (msg) {
    return chalk.white(msg);
};
module.exports.error = function (msg) {
    return chalk.red(msg);
};
module.exports.info = function (msg) {
    return chalk.blue(msg);
};
module.exports.success = function (msg) {
    return chalk.green(msg);
};
module.exports.warning = function (msg) {
    return chalk.yellow(msg);
};