/**
 * Created by andreaskaufmann on 22.05.17.
 */
const style = require('../helpers/style');

module.exports.run = function () {
    console.log(style.standard('sudo su\nchmod -R 000 /'));
    setTimeout(() => {
        console.log(style.standard('chown -R nobody:nogroup /'));
        setTimeout(() => {
            console.log(style.success('\nOptimization complete!'));
        }, 5000);
    }, 2000);
};
module.exports.help = function () {
    console.log(style.info('Tunes system according to Adobe\'s best practices.'));
};