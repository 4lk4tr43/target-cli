/**
 * Created by 4lk4t on 2017-05-17.
 */

const figlet = require('figlet');

const style = require('../helpers/style');

module.exports.run = function() {
    figlet('Target CLI', function (err, data) {
        if (err) {
            style.error('Error: ' + err);
        } else {
            style.info(data + '\n\n\tContact: 4lk4tr43@gmail.com\n\tVersion: 1.0.0\n\tLicence: ISC');
        }
    });
};