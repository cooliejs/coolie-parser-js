/**
 * mocha 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var expect = require('chai-jasmine').expect;
var parser = require('../src/index.js');
var fs = require('fs');
var path = require('path');
var uglify = require('uglify-js');

describe('coolie-parser-js', function () {

    it('processRequire sync', function () {
        var ast = parser('require("a")', {
            processRequire: function (node) {
                var arg0 = node.body.args[0];
                var prop = node.body.expression.property;
                expect(prop).toBe(undefined);
                expect(node.body.args.length).toBe(1);
                expect(arg0.value).toBe('a');
                expect(arg0.quote).toBe('"');
                node.body.args[0].value = 'A';
                return node;
            }
        });
        var example2 = ast.print_to_string({beautify: true, comments: 'all'});
        expect(example2).toEqual('require("A");');
    });

    it('processRequire pipeline', function () {
        var ast = parser('require("a", \'b\')', {
            processRequire: function (node) {
                var arg0 = node.body.args[0];
                var prop = node.body.expression.property;
                expect(prop).toBe(undefined);
                expect(node.body.args.length).toBe(2);
                expect(arg0.value).toBe('a');
                expect(arg0.quote).toBe('"');
                node.body.args[0].value = 'A';
                node.body.args[1].value = 'B';
                return node;
            }
        });
        var example2 = ast.print_to_string({beautify: true, comments: 'all'});
        expect(example2).toEqual('require("A", "B");');
    });

    it('processRequire async', function () {
        var ast = parser('require.async("a")', {
            processRequire: function (node) {
                var arg0 = node.body.args[0];
                var prop = node.body.expression.property;
                expect(prop).toBe('async');
                expect(node.body.args.length).toBe(1);
                expect(arg0.value).toBe('a');
                expect(arg0.quote).toBe('"');
                node.body.args[0].value = 'A';
                return node;
            }
        });
        var example2 = ast.print_to_string({beautify: true, comments: 'all'});
        expect(example2).toEqual('require.async("A");');
    });

    it('processRequire ref', function () {
        var ast = parser('var a = 1; require(a, "b");', {
            processRequire: function (node) {
                var arg0 = node.body.args[0];
                var prop = node.body.expression.property;
                expect(arg0.TYPE).not.toEqual('String');
                return node;
            }
        });
        var example2 = ast.print_to_string({beautify: true, comments: 'all'});
        expect(example2).toEqual('var a = 1;\n\nrequire(a, "b");');
    });

    it('pipe method', function () {
        var example = fs.readFileSync(path.join(__dirname, 'example.js'), 'utf8');
        var ast = parser(example);
        parser.pipe(ast, function (node) {
            if (
                node.start.type === 'name' &&
                node.start.value === 'require' &&
                node.body &&
                node.body.args &&
                node.body.expression
            ) {
                var arg0 = node.body.args[0];
                var prop = node.body.expression;
                node.body.args[0].value = '<<' + arg0.value + '>>';
            }

            return node;
        });
        var example2 = ast.print_to_string({beautify: true, comments: 'all'});
        expect(example2).toMatch(/<<d>>/);
        expect(example2).toMatch(/<<e>>/);
        expect(example2).toMatch(/<<g>>/);
    });

});


