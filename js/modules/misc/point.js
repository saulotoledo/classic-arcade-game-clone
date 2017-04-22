/**
 * A module to define a point.
 *
 * @module misc/point
 */
define([], function () {

    /**
     * Creates a point.
     *
     * @constructor
     * @alias misc/point
     * @param {object} x The x position.
     * @param {object} y The y position.
     */
    var Point = function (x, y) {

        /**
         * The x position.
         * 
         * @type {number}
         */
        this.x = x;

        /**
         * The y position.
         * 
         * @type {number}
         */
        this.y = y;
    }

    return Point;
});
