/**
 * A module to define a Character, an abstract class
 * to be used by character elements in the game.
 *
 * @module model/element/character
 * @see module:model/element
 */
define(['model/element'], function (Element) {

    /**
     * Creates a Character.
     *
     * @constructor
     * @extends Element
     * @alias module:model/element/character
     * @param {string} sprite The sprite of the character.
     * @param {number} x The x position of the character.
     * @param {number} y The y position of the character.
     */
    var Character = function (sprite, x, y) {
        Element.call(this, sprite, x, y);

        /**
         * The character's initial X position. Used to
         * reset it when needed.
         */
        this.initialX = x;

        /**
         * The character's initial Y position. Used to
         * reset it when needed.
         */
        this.initialY = y;

        // Resets this element's properties:
        this.reset();
    };

    Character.prototype = Object.create(Element.prototype);
    Character.prototype.constructor = Character;

    /**
     * Reset the character's position.
     */
    Character.prototype.reset = function () {
        this.x = this.initialX;
        this.y = this.initialY;
    };

    return Character;
});
