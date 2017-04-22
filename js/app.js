// RequireJS configuration:
requirejs.config({
    baseUrl: 'js/modules'
});

// Start the main app:
requirejs(['engine'], function (Engine) {

    /**
     * Return a random integer between min and max values.
     *
     * @param {number} min - The min value.
     * @param {number} max - The max value.
     */
    Math.randomInt = function (min, max) {
        return this.floor(this.random() * (max - min + 1) + min);
    };

    /**
     * Remove an element from the array.
     *
     * @author By John Resig <jeresig@gmail.com>
     * @license MIT
     * @see http://ejohn.org/blog/javascript-array-remove/
     * @param {number} from The starting element.
     * @param {number} to The end element.
     * @returns The result for apply.
     */
    Array.prototype.remove = function (from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };

    /**
     * Shuffles the current array.
     *
     * @returns {Array} The modified array.
     */
    Array.prototype.shuffle = function () {
        var currentIndex = this.length,
            temporaryValue,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = this[currentIndex];
            this[currentIndex] = this[randomIndex];
            this[randomIndex] = temporaryValue;
        }

        return this;
    };

    // Some browsers already support the fill() method. We use
    // a polyfill if it is not supported:
    if (!Array.prototype.fill) {

        /**
         * Polyfill for the ES6 Array.fill(). It fills all the elements
         * of the current array from a start index to an end index
         * with a static value.
         *
         * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
         * @param {any} value Value to fill an array.
         * @param {number} [start=0] Start index, defaults to 0.
         * @param {number} [end=this.length] End index, defaults to `this.length`.
         * @returns {Array} The modified array.
         */
        Array.prototype.fill = function (value) {

            // Steps 1-2.
            if (this === null) {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ?
                len : end >> 0;

            // Step 11.
            var final = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            // Step 12.
            while (k < final) {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        };
    }

    // Starts the engine:
    Engine(window);
});
