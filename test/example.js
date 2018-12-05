/**
 * example
 * @author ydr.me
 * @create 2018-12-05 09:43:46
 * @update 2018-12-05 09:43:46
 */


'use strict';

// require('./a')

/* require('./b') */

var a = 'require("c")';

require('d');
require('d');
require('e');
require('e', 'f');
require.async('g', function (g) {
    // ...
});

