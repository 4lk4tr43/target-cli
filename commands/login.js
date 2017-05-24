/**
 * Created by 4lk4t on 2017-05-17.
 */
const fs = require('fs');
const inquirer = require('inquirer');
const preferences = require('preferences');
const https = require('https');
const jwt = require('jwt-simple');
const querystring = require('querystring');
const style = require('../helpers/style');

let accountPreferences = new preferences('target-cli-account-preferences', {
    current: '',
    list: []
});

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


/*** Module exports ***/
exports.run = function (args) {
    if (args.indexOf('info') > -1) {
        let currentAccount = getCurrentAccount();
        for (let p in currentAccount) {
            if (currentAccount.hasOwnProperty(p)) {
                console.log(style.info(p) + '\n' + style.standard(currentAccount[p]));
            }
        }
    } else if (args.indexOf('check') > -1) {
        checkLogin()
            .then(() => console.log(style.success('Connection successfully established.')))
            .catch(() => console.error(style.error('Connection failed.')));
    } else {
        inquirer.prompt(loginSelectionQuestion(accountPreferences)).then(loginSelectionResponse);
    }
};
exports.help = function () {
    console.log(style.info('Manage and login into Adobe Service Accounts.'));
};

/*** Private Functions & Members ***/
let currentAccessToken;

const issueNewAccessToken = function() {
    return new Promise(function (resolve, reject) {
        const config = getConfig();
        const jwtToken = getJwtToken(config).toString('base64');

        const postData = querystring.stringify({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            jwt_token: jwtToken
        });

        const postOptions = {
            host: 'ims-na1.adobelogin.com',
            port: '443',
            path: '/ims/exchange/jwt/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        let req = https.request(postOptions, (res) => {
            res.setEncoding('utf8');
            res.on('data', (accessToken) => {
                resolve(accessToken);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.write(postData);
        req.end();
    });
};

const getAccessToken = function () {
    return new Promise(function(resolve, reject) {
        if (typeof currentAccessToken === 'undefined' || isTokenExpired()) {
            issueNewAccessToken().then((v) => {
                currentAccessToken.token = v;
                currentAccessToken.expirationDate = new Date(Date.now() + v['expires_in']);
                resolve(v);
            }).catch((e) => reject(e));
        } else {
            resolve(currentAccessToken.token);
        }
    });
};

const checkLogin = function () {
    return new Promise(function (resolve, reject) {
        getAccessToken().then(() => {
            resolve();
        }).catch(() => reject(style.error('Could not quire access token.')));
    });
};

const getCurrentAccount = function () {
    return accountPreferences.list.filter((v) => v.name === accountPreferences.current)[0];
};

const getConfig = function () {
    const currentAccount = getCurrentAccount();
    return {
        payload: {
            'exp': Math.round(87000 + Date.now()/1000),
            'iss': currentAccount.iss,
            'sub': currentAccount.sub,
            'aud': currentAccount.aud,
            'https://ims-na1.adobelogin.com/s/ent_marketing_sdk' : true
        },
        clientId: currentAccount.apiKey,
        clientSecret: currentAccount.clientSecret,
        pem: currentAccount.pem,
        algorithm: 'RS256'
    };
};

const getJwtToken = function (config) {
    return jwt.encode(config.payload, config.pem, config.algorithm);
};

const isTokenExpired = function() {
    return currentAccessToken.expirationDate - 30000 < Date.now();
};