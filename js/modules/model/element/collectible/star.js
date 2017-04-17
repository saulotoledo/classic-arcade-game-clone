/**
 * A module to control a Star in the game.
 *
 * @module model/element/collectible/star
 * @see module:model/element/collectible
 */
define(['model/element/collectible'], function (Collectible) {

    /**
     * Creates a Star.
     *
     * @constructor
     * @extends Collectible
     * @alias module:model/element/collectible/star
     * @param {number} row The row where the star should be rendered.
     * @param {number} col The column where the star should be rendered.
     */
    var Star = function (row, col) {

        var points = 70,
            sprite = 'images/star.png';

        Collectible.call(this, sprite, row, col, points);
    };

    Star.prototype = Object.create(Collectible.prototype);
    Star.prototype.constructor = Star;

    return Star;
});
