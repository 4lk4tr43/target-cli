/**
 * Created by 4lk4t on 2017-05-17.
 */
const chalk = require('chalk');

exports.standard = function (msg) {
    return chalk.white(msg);
};
exports.error = function (msg) {
    return chalk.red(msg);
};
exports.info = function (msg) {
    return chalk.blue(msg);
};
exports.success = function (msg) {
    return chalk.green(msg);
};
exports.warning = function (msg) {
    return chalk.yellow(msg);
};