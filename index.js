#!/usr/bin/env node

const style = require('./helpers/style');

switch(process.argv[2]) {

    case 'login':
        require('./commands/login').run();
        break;
    case 'init':
        break;

    case 'version':
        require('./commands/version').run();
        break;

    default:
        console.log(style.error('Error: command not found.'));
}
