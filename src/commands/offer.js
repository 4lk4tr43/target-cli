/**
 * Created by 4lk4t on 2017-05-27.
 */

exports.run = function (args) {
    switch (args[0]) {
        case 'push':
            const filePath = args[1];
            const offerId = args[2];
            break;

        default:
            break;
    }
};

exports.help = function () {
    console.log(style.info('Manage and login into Adobe Service Accounts.'));
};