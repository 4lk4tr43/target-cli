/**
 * Created by 4lk4t on 2017-05-27.
 */
const style = require('./style');

exports.render = function (o) {
    const createHeadline = (property, level) => {
        let prefix = '';
        for (let i = 0; i < level; i++) {
            prefix += '# ';
        }
        return '\n' + style.info(prefix + property);
    };

    const renderRecursive = (o, l) => {
        switch (typeof o) {
            case 'Array':
            case 'object':
                let fringe = '';
                for (let p in o) {
                    if (!o.hasOwnProperty(p)) continue;

                    fringe += createHeadline(p, l) + renderRecursive(o[p], l + 1);
                }
                return fringe;
                break;
            default:
                return '\n' + o;
                break;
        }
    };

    return renderRecursive(o, 0);
};