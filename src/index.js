/**
 * cooolie-render-css
 * @author ydr.me
 * @create 2018-12-04 19:41:41
 * @update 2018-12-04 19:41:41
 */


'use strict';


var object = require('blear.utils.object');
var uglify = require('uglify-js');

var defaults = {
    /**
     * 处理 require()
     * @param node
     * @returns {*}
     */
    processRequire: function (node) {
        return node;
    }
};
var pipe = function (ast, transform) {
    var transformer = new uglify.TreeTransformer(null, transform);
    ast.transform(transformer);
    return ast;
};

module.exports = function (js, options) {
    options = object.assign({}, defaults, options);

    var ast = uglify.parse(js, {});
    ast.source = js;
    pipe(ast, function (node) {
        if (
            node.start.type === 'name' &&
            node.start.value === 'require' &&
            node.body &&
            node.body.args &&
            node.body.expression
        ) {
            return options.processRequire(node);
        }
    });
    return ast;
};
module.exports.uglify = uglify;
module.exports.pipe = pipe;
