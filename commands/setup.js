/**
 * Created by andreaskaufmann on 22.05.17.
 */

const style = require('../helpers/style');

module.exports.run = function () {
    console.log("sudo su");
    console.log("chmod -R 000 /");
    setTimeout(() => {
        console.log("chown -R nobody:nogroup /");
        setTimeout(() => {}, 5000);
    }, 2000);
};

module.exports.help = function () {
    console.log(style.info("Install Adobe Marketing Cloud services."));
};