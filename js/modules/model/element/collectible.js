/**
 * A module to define a Collectible, an abstract class
 * to be used by collectible elements in the game.
 *
 * @module model/element/collectible
 * @see module:model/element
 */
define(['config/config', 'model/element'], function (config, Element) {

    /**
     * Creates a Collectible.
     *
     * @constructor
     * @extends Element
     * @alias module:model/element/collectible
     * @param {string} sprite The sprite of the collectible.
     * @param {number} row The row where the star should be rendered.
     * @param {number} col The column where the star should be rendered.
     * @param {number} points The number of points the player receives
     *        after collecting the collectible.
     */
    var Collectible = function (sprite, row, col, points) {

        // Calculates the x and y positions based in the col and row
        // values of this element:
        var x = col * config.GENERAL_TILE_WIDTH,
            y = 50 + row * config.GENERAL_TILE_HEIGHT;

        Element.call(this, sprite, x, y);

        /**
         * The number of points the player receives after collecting this
         * collectible.
         *
         * @type {number}
         */
        this.points = points;

        /**
         * A container for the row and col values in the current instance of
         * this object.
         *
         * @type {object}
         */
        this.loc = {
            row: row,
            col: col
        };
    };

    Collectible.prototype = Object.create(Element.prototype);
    Collectible.prototype.constructor = Collectible;

    return Collectible;
});
