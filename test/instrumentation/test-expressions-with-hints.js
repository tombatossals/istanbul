/*jslint nomen: true */
var helper = require('../helper'),
    code,
    verifier;

/*jshint maxlen: 500 */
module.exports = {
    "with a simple expression": {
        setUp: function (cb) {
            code = [
                'var x = /* istanbul ignore hint1 */ args[0] > 0 && /* istanbul ignore hint2 */ args[0] < 5;',
                'output = x;'
            ];
            cb();
        },

        "should cover line and one branch": function (test) {
            code[0] = code[0].replace(/hint2/, 'condition');
            verifier = helper.verifier(__filename, code);
            verifier.verify(test, [ -1 ], false, { lines: { 1: 1, 2: 1 }, branches: { 1: [ 1, 0 ]}, functions: {}, statements: { '1': 1, '2': 1 } });
            verifier.verifySkips(test, [], [], ["1:1"]);
            test.done();
        },
        "should cover line, both branches but return false": function (test) {
            code[0] = code[0].replace(/hint1/, 'condition');
            verifier = helper.verifier(__filename, code);
            verifier.verify(test, [ 10 ], false, { lines: { 1: 1, 2: 1 }, branches: { 1: [ 1, 1 ]}, functions: {}, statements:  { '1': 1, '2': 1 } });
            verifier.verifySkips(test, [], [], ["1:0", "1:1"]); //note: this counter-intuitive from user's perspective, comment attached too early to LogExpression and propagated - needs FIXING
            test.done();
        }
    },
    "with a complex expression": {
        setUp: function (cb) {
            code = [
                'var x = args[0] > 0 && /* istanbul ignore hint1 */ (args[0] < 5 || /* istanbul ignore hint2 */ args[0] > 10);',
                'output = x;'
            ];
            cb();
        },

        "should cover line and one branch": function (test) {
            code[0] = code[0].replace(/hint1/, 'condition');
            verifier = helper.verifier(__filename, code);
            verifier.verify(test, [ -1 ], false, { lines: { 1: 1, 2: 1 }, branches: { 1: [ 1, 0, 0 ]}, functions: {}, statements: { '1': 1, '2': 1 } });
            verifier.verifySkips(test, [], [], ["1:1", "1:2"]);
            test.done();
        },
        "should cover line, both branches but return false": function (test) {
            code[0] = code[0].replace(/hint2/, 'condition');
            verifier = helper.verifier(__filename, code);
            verifier.verify(test, [ 9 ], false, { lines: { 1: 1, 2: 1 }, branches: { 1: [ 1, 1, 1 ]}, functions: {}, statements: { '1': 1, '2': 1 } });
            verifier.verifySkips(test, [], [], ["1:2"]);
            test.done();
        }
    }
};

