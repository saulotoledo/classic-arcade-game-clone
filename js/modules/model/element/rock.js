/**
 * A module to define a Rock, an element that blocks the player
 * movement.
 *
 * @module model/element/rock
 * @see module:model/element
 */
define(['config/config', 'model/element'], function (config, Element) {

    /**
     * Creates a Rock.
     *
     * @constructor
     * @extends Element
     * @alias module:model/element/rock
     * @param {number} row The row where the rock should be rendered.
     * @param {number} col The column where the rock should be rendered.
     */
    var Rock = function (row, col) {
        var sprite = 'images/rock.png',

            // Calculates the x and y positions based in the col and row
            // values of this element:
            x = col * config.GENERAL_TILE_WIDTH,
            y = 50 + row * config.GENERAL_TILE_HEIGHT;

        Element.call(this, sprite, x, y);

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

    Rock.prototype = Object.create(Element.prototype);
    Rock.prototype.constructor = Rock;

    return Rock;
});
