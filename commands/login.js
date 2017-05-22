/**
 * Created by 4lk4t on 2017-05-17.
 */

const inquirer = require('inquirer');
const preferences = require('preferences');

const style = require('../helpers/style');

let accountPreferences = {
    current: '2', // TODO read from preferences
    list: ['1','2'] // TODO read from preferences
};

const addAccount = 'Add new account...';
const removeAccount = 'Remove account...';

let actions = [addAccount];
let defaultIndex  = 0;

if (accountPreferences.list.length > 0) {
    actions = [new inquirer.Separator(), addAccount, removeAccount];
    defaultIndex = accountPreferences.list.indexOf(accountPreferences.current);
    if (defaultIndex === -1) {
        defaultIndex = accountPreferences.list.length; // index of the first action
    }
}

let loginSelectionQuestion = {
    name: 'selectedLogin',
    type: 'list',
    message: 'Please select the login to use:',
    choices: accountPreferences.list.concat(actions),
    default: defaultIndex
};

module.exports.run = function () {
    inquirer.prompt([loginSelectionQuestion]).then(function (answers) {
        switch (answers) {
            case addAccount:
                // TODO
                console.log('add');
                break;
            case removeAccount:
                // TODO
                console.log('remove');
                break;
            default:
                if (answers['selectedLogin'] === accountPreferences.current) {
                    console.log(style.info('is set as default account (nothing was saved).'));
                }
                break;
        }
    });
};

module.exports.help = function () {
    console.log(style.info("Manage and login into Adobe Service Accounts."));
};
