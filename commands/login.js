/**
 * Created by 4lk4t on 2017-05-17.
 */
const fs = require('fs');
const inquirer = require('inquirer');
const preferences = require('preferences');
const style = require('../helpers/style');
const TargetAccessToken = require('../helpers/target-access-token');


let accountPreferences = new preferences('target-cli-account-preferences', {
    current: '',
    list: []
});

const getCurrentAccount = function () {
    return accountPreferences.list.filter((v) => v.name === accountPreferences.current)[0];
};


/** Questions **/

/*** Question login selection ***/
const loginSelection = 'loginSelection';
const addAccount = 'Add new account...';
const removeAccount = 'Remove account...';

const loginSelectionQuestion = function (account) {

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

const loginSelectionResponse = function (answers) {
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
const loginNameToRemove = 'loginNameToRemove';

const loginRemoveQuestion = function (account) {
    return [{
        name: loginNameToRemove,
        type: 'list',
        message: 'Please select the login to remove:',
        choices: account.list,
        default: 0
    }];
};

const loginRemoveResponse = function (answers) {
    accountPreferences.list = accountPreferences.list.filter((v) => v.name !== answers[loginNameToRemove]);

    console.log(style.info('successfully removed.'));
    if (accountPreferences.list.indexOf(accountPreferences.current) === -1) {
        accountPreferences.current = '';
        console.log(style.warning('No login selected.'));
    }
    inquirer.prompt(loginSelectionQuestion(accountPreferences)).then(loginSelectionResponse);
};

/*** Question add login ***/
const loginNameToAdd = 'loginNameToAdd';
const loginTenantToAdd = 'loginTenantToAdd';
const loginApiKeyToAdd = 'loginApiKeyToAdd';
const loginClientSecretToAdd = 'loginClientSecretToAdd';
const loginJwtIssToAdd = 'loginJwtIssToAdd';
const loginJwtSubToAdd = 'loginJwtSubToAdd';
const loginJwtAudToAdd = 'loginJwtAudToAdd';
const loginJwtPemToAdd = 'loginJwtPemToAdd';

const loginAddQuestion = function (account) {
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
    },{
        name: loginTenantToAdd,
        type: 'input',
        message: 'Enter a tenant for the new login configuration:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Login tenant must be at least 1 character long.');
            }
            return true;
        }
    }, {
        name: loginApiKeyToAdd,
        type: 'input',
        message: 'Enter a api key for the service account to use:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Api key cannot be empty.');
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
    }, {
        name: loginJwtIssToAdd,
        type: 'input',
        message: 'Enter a jwt iss for the service account to use:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Jwt iss cannot be empty.');
            }
            if (!/@AdobeOrg$/.test(value)) {
                return style.warning('Jwt iss must end with @AdobeOrg.');
            }
            return true;
        }
    }, {
        name: loginJwtSubToAdd,
        type: 'input',
        message: 'Enter a jwt sub for the service account to use:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Jwt sub cannot be empty.');
            }
            if (!/@techacct\.adobe\.com$/.test(value)) {
                return style.warning('Jwt sub must end with @techacct.adobe.com.');
            }
            return true;
        }
    }, {
        name: loginJwtAudToAdd,
        type: 'input',
        message: 'Enter a jwt aud for the service account to use:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Jwt aud cannot be empty.');
            }
            if (!/^https:\/\/ims-na1\.adobelogin\.com\/c/.test(value)) {
                return style.warning('Jwt aud must begin with https://ims-na1.adobelogin.com/c/.');
            }
            return true;
        }
    }, {
        name: loginJwtPemToAdd,
        type: 'input',
        message: 'Enter path to pem file used to create service account to use:',
        validate: function (value) {
            if (!value.length) {
                return style.warning('Path cannot be empty.');
            }
            if (!fs.existsSync(value)) {
                return style.warning('Invalid path, file could not be found.');
            }
            return true;
        }
    }];
};

const loginAddResponse = function (answer) {
    accountPreferences.current = answer[loginNameToAdd];
    let newAccount = {
        name: answer[loginNameToAdd],
        tenant: answer[loginTenantToAdd],
        apiKey: answer[loginApiKeyToAdd],
        clientSecret: answer[loginClientSecretToAdd],
        iss: answer[loginJwtIssToAdd],
        sub: answer[loginJwtSubToAdd],
        aud: answer[loginJwtAudToAdd],
        pem: fs.readFileSync(answer[loginJwtPemToAdd]).toString('ascii')
    };
    accountPreferences.list.push(newAccount);
    accountPreferences.list = accountPreferences.list.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    inquirer.prompt(loginSelectionQuestion(accountPreferences)).then(loginSelectionResponse);
};

/** Module exports **/
exports.run = function (args) {
    if (args.indexOf('info') > -1) {
        const currentAccount = getCurrentAccount();
        for (let p in currentAccount) {
            if (currentAccount.hasOwnProperty(p)) {
                console.log(style.info(p) + '\n' + style.standard(currentAccount[p]));
            }
        }
    } else if (args.indexOf('check') > -1) {
        new TargetAccessToken.TargetAccessToken(getCurrentAccount()).token
            .then((v) => {
                const response = JSON.parse(v);
                if (response.hasOwnProperty('access_token')) {
                    console.log(style.success('Successfully acquired access token.\n') + response['access_token']);
                } else {
                    console.error(style.error('Could not acquire access token.\n') + v);
                }
            })
            .catch((e) => console.error(style.error('Connection could not be established.\n') + e))
    } else {
        inquirer.prompt(loginSelectionQuestion(accountPreferences)).then(loginSelectionResponse);
    }
};
exports.help = function () {
    console.log(style.info('Manage and login into Adobe Service Accounts.'));
};


