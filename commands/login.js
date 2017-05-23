/**
 * Created by 4lk4t on 2017-05-17.
 */

const inquirer = require('inquirer');
const preferences = require('preferences');
const style = require('../helpers/style');

let accountPreferences = new preferences('target-cli-account-preferences', {
    current: '',
    list: []
});


/*** Question login selection ***/
let loginSelection = 'loginSelection';

const addAccount = 'Add new account...';
const removeAccount = 'Remove account...';

let loginSelectionQuestion = function (account) {

    let defaultIndex = 0;
    let actions = [addAccount];
    if (account.list.length > 0) {
        defaultIndex = -1;
        for (let i = 0; i < account.list.length; i++) {
            if (account.list[i].name === account.current) {
                defaultIndex = i;
                break;
            }
        }
        if (defaultIndex === -1) {
            defaultIndex = account.list.length; // index of the first action
        }

        actions = [new inquirer.Separator(), addAccount, removeAccount];
    }

    return [{
        name: loginSelection,
        type: 'list',
        message: 'Please select the login to use:',
        choices: account.list.concat(actions),
        default: defaultIndex
    }];
};

let loginSelectionResponse = function (answers) {
    switch (answers[loginSelection]) {
        case addAccount:
            inquirer.prompt(loginAddQuestion(accountPreferences)).then(loginAddResponse);
            break;
        case removeAccount:
            inquirer.prompt(loginRemoveQuestion(accountPreferences)).then(loginRemoveResponse);
            break;
        default:
            if (answers[loginSelection] === accountPreferences.current) {
                console.log(style.info('is already set as default account (nothing was saved).'));
            } else {
                accountPreferences.current = answers[loginSelection];
                console.log(style.info('is set as new default account (changes were saved).'));
            }
            break;
    }
};

/*** Question remove login ***/
let loginNameToRemove = 'loginNameToRemove';

let loginRemoveQuestion = function (account) {
    return [{
        name: loginNameToRemove,
        type: 'list',
        message: 'Please select the login to remove:',
        choices: account.list,
        default: 0
    }];
};

let loginRemoveResponse = function (answers) {
    accountPreferences.list = accountPreferences.list.filter((v) => v.name !== answers[loginNameToRemove]);

    console.log(style.info('successfully removed.'));
    if (accountPreferences.list.indexOf(accountPreferences.current) === -1) {
        accountPreferences.current = '';
        console.log(style.warning('No login selected.'));
    }
    inquirer.prompt(loginSelectionQuestion(accountPreferences)).then(loginSelectionResponse);
};

/*** Question add login ***/
let loginNameToAdd = 'loginNameToAdd';
let loginClientSecretToAdd = 'loginClientSecretToAdd';

let loginAddQuestion = function (account) {
    return [{
        name: loginNameToAdd,
        type: 'input',
        message: 'Enter a name for the new login configuration:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Login names must be at least 1 character long.');
            }
            if (account.list.filter((v) => v.name === value).length) {
                return style.warning('Login name does already exist. Please do not use the following names:\n')
                    + style.standard(account.list.map((v) => v.name).join('\n'));
            }
            return true;
        }
    }, {
        name: loginClientSecretToAdd,
        type: 'input',
        message: 'Enter a client secret for the service account to use:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Client secret cannot be empty.');
            }
            return true;
        }
    }];
};

let loginAddResponse = function (answer) {
    accountPreferences.current = answer[loginNameToAdd];
    let newAccount = {
        name: answer[loginNameToAdd],
        clientSecret: answer[loginClientSecretToAdd]
    };
    accountPreferences.list.push(newAccount);
    accountPreferences.list = accountPreferences.list.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    inquirer.prompt(loginSelectionQuestion(accountPreferences)).then(loginSelectionResponse);
};

/*** Module exports ***/
module.exports.run = function () {
    inquirer.prompt(loginSelectionQuestion(accountPreferences)).then(loginSelectionResponse);
};

module.exports.help = function () {
    console.log(style.info("Manage and login into Adobe Service Accounts."));
};
