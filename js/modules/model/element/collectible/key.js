/**
 * A module to control a Key in the game.
 *
 * @module model/element/collectible/key
 * @see module:model/element/collectible
 */
define(['model/element/collectible'], function (Collectible) {

    /**
     * Creates a Key.
     *
     * @constructor
     * @extends Collectible
     * @alias module:model/element/collectible/key
     * @param {number} row The row where the key should be rendered.
     * @param {number} col The column where the key should be rendered.
     */
    var Key = function (row, col) {

        var points = 70,
            sprite = 'images/key.png';

        Collectible.call(this, sprite, row, col, points);
    };

    Key.prototype = Object.create(Collectible.prototype);
    Key.prototype.constructor = Key;

    return Key;
});
