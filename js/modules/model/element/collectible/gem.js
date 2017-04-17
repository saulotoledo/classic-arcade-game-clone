/**
 * A module to control a Gem in the game.
 *
 * @module model/element/collectible/gem
 * @see module:model/element/collectible
 */
define(['model/element/collectible'], function (Collectible) {

    /**
     * Creates a Gem.
     *
     * @constructor
     * @extends Collectible
     * @alias module:model/element/collectible/gem
     * @param {number} row The row where the gem should be rendered.
     * @param {number} col The column where the gem should be rendered.
     * @param {number} gemType The type of the gem as defined in
     *        {@link element/collectible/gem#gemTypes}.
     */
    var Gem = function (row, col, gemType) {

        /**
         * The gem types enum (1 is blue, 2 is green and 3 is orange).
         * Each gem type also has a different number of points.
         */
        this.gemTypes = {
            GEM_TYPE_BLUE: 1,
            GEM_TYPE_GREEN: 2,
            GEM_TYPE_ORANGE: 3
        };

        var points,
            sprite;

        // Defining the sprite and points according to the gem type:
        switch (gemType) {
            case this.gemTypes.GEM_TYPE_BLUE:
                points = 20;
                sprite = 'images/gem-blue.png';
                break;

            case this.gemTypes.GEM_TYPE_GREEN:
                points = 15;
                sprite = 'images/gem-green.png';
                break;

            default:
            case this.gemTypes.GEM_TYPE_ORANGE:
                points = 10;
                sprite = 'images/gem-orange.png';
                break;
        }

        Collectible.call(this, sprite, row, col, points);
    };

    Gem.prototype = Object.create(Collectible.prototype);
    Gem.prototype.constructor = Gem;

    return Gem;
});
