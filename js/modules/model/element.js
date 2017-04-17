/**
 * A module to define an Element, an abstract class
 * to be used by several elements in the game.
 *
 * @module model/element
 */
define(['config/config'], function (config) {

    /**
     * Creates an Element.
     * 
     * @constructor
     * @alias module:model/element
     * @param {string} sprite The sprite of the element.
     * @param {number} x The x position of the element.
     * @param {number} y The y position of the element.
     */
    var Element = function (sprite, x, y) {

        /**
         * The image/sprite for the element.
         */
        this.sprite = sprite;

        /**
         * The elements's X position.
         */
        this.x = x;

        /**
         * The elements's Y position.
         */
        this.y = y;

        /**
         * The element's width.
         */
        this.width = config.GAME_ELEMENT_WIDTH;

        /**
         * The element's height.
         */
        this.height = config.GAME_ELEMENT_HEIGHT;
    };

    /**
     * Callback that runs when the element is updated on the screen.
     */
    Element.prototype.update = function () {};

    /**
     * Draw the element on the screen.
     */
    Element.prototype.render = function (ctx) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    return Element;
});
