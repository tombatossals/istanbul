/*jslint nomen: true */
var helper = require('../helper'),
    code,
    verifier;

/*jshint maxlen: 500 */
module.exports = {
    "with a simple ternary": {
        setUp: function (cb) {
            code = [
                'var x = args[0] > 5 ? /* istanbul ignore hint1 */ args[0] : /* istanbul ignore hint2 */ "undef";',
                'output = x;'
            ];
            cb();
        },

        "should cover line and one branch": function (test) {
            code[0] = code[0].replace(/hint2/, 'condition');
            verifier = helper.verifier(__filename, code);
            verifier.verify(test, [ 10 ], 10, { lines: { 1: 1, 2: 1 }, branches: { 1: [1, 0 ]}, functions: {}, statements: { 1: 1, 2: 1 } });
            verifier.verifySkips(test, [], [], [ "1:1" ]);
            test.done();
        },
        "should cover line and other branch": function (test) {
            code[0] = code[0].replace(/hint1/, 'condition');
            verifier = helper.verifier(__filename, code);
            verifier.verify(test, [ 1 ], "undef", { lines: { 1: 1, 2: 1 }, branches: { 1: [ 0, 1 ]}, functions: {}, statements: { 1: 1, 2: 1 } });
            verifier.verifySkips(test, [], [], [ "1:0" ]);
            test.done();
        }
    }
};

