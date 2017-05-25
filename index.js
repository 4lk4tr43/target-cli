#!/usr/bin/env node
const fs = require('fs');
const style = require('./helpers/style');

const command = process.argv[2];
const args = process.argv.slice(3);

try {
    require(__dirname + '/commands/' + command)[process.argv.indexOf('help') > -1 ? 'help' : 'run'](args);
} catch (e) {
    if (/Error:\sCannot\sfind\smodule/.test(e)) {
        console.error(style.error('Error: command not found. Available commands are:'));
        console.log(
            style.standard(
                fs.readdirSync(__dirname + '/commands')
                    .filter((v) => /\.js/.test(v))
                    .join('')
                    .replace(/\.js/g, '\n')
            )
        );
    } else {
        console.error(style.error(e));
    }
}
