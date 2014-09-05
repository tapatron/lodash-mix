(function () {
    var isNode = typeof module !== 'undefined' &&
            typeof module.exports !== 'undefined',
        _;
    if (isNode) {
        _ = require('lodash');
    }
    else {
        // browser environment
        _ = window._;
    }

    var mixins = (function () {
        var extendWith = {};

        /**
         * _.immutableMerge
         *
         * Merges two objects without mutating the two objects
         * Usage:
         *    var src = {a: 1, b: 2};
         *    var dest = {c: 3, d: 4};
         *    var merged = _.immutableMerge(src, dest);
         * Produces:
         *    src -> { a: 1, b: 2 }
         *    dest -> { c: 3, d: 4 }
         *    merged -> { a: 1, b: 2, c: 3, d: 4 }
         *
         * @param {Object} src - the source object
         * @param {Object} dest - the destination object
         * @returns {Object} a new object constructed from properties of src and dest
         */
        extendWith.immutableMerge = function (src, dest) {
            return _.merge(_.cloneDeep(src), dest);
        };

        /**
         * _.upsert
         *
         * Replaces the element with the new element if it exists (given the matcher)
         * Inserts the element if the match fails
         *
         * Usage:
         *    var base = [{id: 1, data: 2}, {id: 2, data: 3}, {id: 3, data: {nested: 4}}];
         *    var matcher = {id: 3, data: {nested: 4}}
         *    var newElement = {id: 3, data: 5}
         *    _.upsert(base, matcher, newElement);
         * Produces:
         *    [{id: 1, data: 5}, {id: 2, data: 3}, {id: 3, data: 5}]
         *
         * @param {Object} base - the base object to act upon
         * @param {Object} match - the object to search for in base
         * @param {Object} replacement - the object to replace the match
         *    with if match is truthy, else push the object to base (which
         *    increases the length by one)
         * @returns {Object} the new replaced object
         */
        extendWith.upsert = function (base, match, replacement) {
            var removed = _.reject(base, match);
            removed.push(replacement);
            return removed;
        };

        /**
         * _.format
         *
         * Formats a string with given parameters.
         * Usage:
         *    _.format('Other {} are {}', 'people', 'good plumbers')
         * Produces:
         *    'Other people are good plumbers'
         *
         * Usage:
         *    _.format('/{categ}/{isbn}', 'books', '034038204X')
         * Produces:
         *    '/books/034038204X'
         *
         * Usage:
         *    _.format('/{categ}/{isbn}', {categ: 'books', isbn: '034038204X'})
         * Produces:
         *    '/books/034038204X'
         *
         * @param {String} template - the template to format
         * @param {Object} params - the replacement parameters
         * @returns {String} the formatted string
         */
        extendWith.format = function (template, params) {
            var i = 1,
                args = arguments;
            return template.replace(/{[a-zA-Z_$]?[0-9a-zA-Z_$]*}/g, function (match) {
                if (_.isObject(params)) {
                    var paramName = match.slice(1, match.length - 1);
                    var paramVal = params[paramName];
                    return typeof paramVal !== 'undefined' ? paramVal : '';
                } else {
                    return typeof args[i] !== 'undefined' ? args[i++] : '';
                }
            });
        };

        /**
         * _.ordinal
         *
         * Usage:
         *    _.ordinal(142)
         * Produces:
         *    'nd'
         *
         * Returns the English ordinal suffix of a number
         * @param {Number} number - the number under test
         * @returns {String} the ordinal suffix
         */
        extendWith.ordinal = function (number) {
            number = Math.floor(number);
            var hundredRem = number % 100,
                tenRem = number % 10;
            if (hundredRem - tenRem === 10) {
                return 'th';
            }
            switch(tenRem) {
                case 1:
                    return 'st';
                case 2:
                    return 'nd';
                case 3:
                    return 'rd';
                default:
                    return 'th';
            }
        };

        /**
         * _.uuid
         *
         * Usage:
         *    _.uuid()
         * Produces:
         *    '9716498c-45df-47d2-8099-3f678446d776'
         *
         * Generates an RFC 4122 version 4 uuid
         * @returns {String} the generated uuid
         */
        extendWith.uuid = function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
                .replace(/[xy]/g, function(match) {
                    var value = match === 'x'
                                ? _.random(0, 15)
                                : _.random(8, 11);
                    return value.toString(16);
            });
        };

        /**
         * _.isUuid
         *
         * Usage:
         *    _.isUuid(_.uuid())
         * Produces:
         *    true|false
         *
         * Validates a version 4 uuid string
         * @param {String} uuid - the uuid under test
         * @returns {Boolean} true if the uuid under test is a valid uuid
         **/
        extendWith.isUuid = function(uuid) {
            var re = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            return re.test(uuid);
        };

        /**
         * _.pluck
         *
         * Usage:
         *    var base = [{p: {c: 1}}, {p: {c: 2}}]
         *    _.pluck(base, 'p.c')
         * Produces:
         *    [1, 2]
         *
         * Adds nested property support to _.pluck (wraps _.pluck)
         * @returns {Array} the plucked values
         **/
        extendWith.pluck = _.wrap(_.pluck, function(pluck, coll, propStr) {
            if (_.contains(propStr, '.')) {
                var props = propStr.split('.');
                var elements = coll;
                _.forEach(props, function (prop) {
                    elements = pluck(elements, prop);
                });
                return elements;
            } else {
                return pluck(coll, propStr);
            }
        });

        return extendWith;
    })();

    /**
     * bootstrap mixins for node and the browser
     * For the browser: lodash must be explicitly included above
     *    this library
     * For node: this library will wrap lodash so there is no
     *    need to include lodash
     */
    if (isNode) {
        _.mixin(mixins, {'chain': true});
        module.exports = _;
    }
    else {
        // browser environment
        if (typeof _ === 'function') {
            _.mixin(mixins, {'chain': true});
        }
        else {
            throw new Error('lodash must be included before lodash-extensions.');
        }
    }
})();
