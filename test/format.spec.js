var _ = require('../index.js'),
    test = require('tape');

test('format: should apply the parameters with empty markers', function (t) {
    t.plan(1);

    var formatted = _.format('Other {} are {}', 'people', 'good plumbers');
    t.equal(formatted, 'Other people are good plumbers');
});

test('format: should apply the parameters with filled markers', function (t) {
    t.plan(1);

    var formatted = _.format('/categ/{cat}/{isbn}', 'books', '034038204X');
    t.equal(formatted, ('/categ/books/034038204X'));
});

test('format: should allow underscores in marker', function (t) {
    t.plan(1);

    var formatted = _.format('/categ/{my_id}', {my_id: 'books'});
    t.equal(formatted, ('/categ/books'));
});

test('format: should handle template with multiple markers', function (t) {
    t.plan(1);

    var formatted = _.format('/categ/{cat}/{cat}', {cat: 'books'});
    t.equal(formatted, ('/categ/books/books'));
});

test('format: should remove {} if the arguments are not defined', function (t) {
    t.plan(1);

    var formatted = _.format('Other {} are {}');
    t.equal(formatted, ('Other  are '));
});

test('format: should format a string with supplied parameters', function (t) {
    t.plan(1);

    var formatted = _.format('/categ/{cat}/{isbn}', {cat: 'books', isbn: '034038204X'});
    t.equal(formatted, '/categ/books/034038204X');
});

test('format: should remove {} if the arguments are not defined', function (t) {
    t.plan(1);

    var formatted = _.format('/categ/{cat}/{isbn}', {isbn: '034038204X'});
    t.equal(formatted, '/categ//034038204X');
});

test('format: should preserver original string if no params provided', function (t) {
    t.plan(1);

    var formatted = _.format('message without params');
    t.equal(formatted, 'message without params');
});