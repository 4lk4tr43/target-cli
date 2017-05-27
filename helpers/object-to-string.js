/**
 * Created by 4lk4t on 2017-05-27.
 */
const style = require('./style');

exports.render = function (o) {
    const createHeadline = (property, level) => {
        let separator = '';
        for (let i = 0; i < level; i++) {
            separator += '# ';
        }
        return '\n' + style.info(separator + property);
    };

    const convertObjectToStringIter = (o, l) => {
        switch (typeof o) {
            case 'Array':
            case 'object':
                let accumulator = '';
                for (let p in o) {
                    if (!o.hasOwnProperty(p)) continue;

                    accumulator += createHeadline(p, l) + convertObjectToStringIter(o[p], l + 1);
                }
                return accumulator;
                break;
            default:
                return '\n' + o;
                break;
        }
    };

    return convertObjectToStringIter(o, 0);
};