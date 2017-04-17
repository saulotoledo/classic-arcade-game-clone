/**
 * A module to control a Heart in the game.
 *
 * @module model/element/collectible/heart
 * @see module:model/element/collectible
 */
define(['model/element/collectible'], function (Collectible) {

    /**
     * Creates a Heart.
     *
     * @constructor
     * @extends Collectible
     * @alias module:model/element/collectible/heart
     * @param {number} row The row where the heart should be rendered.
     * @param {number} col The column where the heart should be rendered.
     */
    var Heart = function (row, col) {

        var points = 5,
            sprite = 'images/heart.png';

        Collectible.call(this, sprite, row, col, points);
    };

    Heart.prototype = Object.create(Collectible.prototype);
    Heart.prototype.constructor = Heart;

    return Heart;
});
