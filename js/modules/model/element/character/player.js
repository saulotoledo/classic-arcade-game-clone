/**
 * A module to control the player.
 *
 * @module model/element/character/player
 * @see module:model/element/character
 */
define(['config/config', 'model/element/character'], function (config, Character) {

    /**
     * Creates a player.
     *
     * @constructor
     * @extends Character
     * @alias module:model/element/character/player
     * @param {string} sprite The sprite of the player.
     * @param {number} x The x position of the player.
     * @param {number} y The y position of the player.
     */
    var Player = function (sprite, x, y) {
        Character.call(this, sprite, x, y);

        /**
         * The player lifes. Default to 3.
         *
         * @type {number}
         */
        this.lifes = 3;
    };

    Player.prototype = Object.create(Character.prototype);
    Player.prototype.constructor = Player;

    /**
     * Add a life to the player (if the player do not have
     * more than {@link config/config#PLAYER_MAX_LIFES}.
     */
    Player.prototype.addLife = function () {
        if (this.lifes < config.PLAYER_MAX_LIFES) {
            this.lifes++;
        }
    };

    /**
     * Remove a life from the player.
     */
    Player.prototype.removeLife = function () {
        if (this.lifes > 0) {
            this.lifes--;
        }
    };

    /**
     * Callback to update the player's position on the canvas.
     */
    Player.prototype.update = function () {

    };

    /**
     * Player collision.
     */
    Player.prototype.hit = function () {
        this.removeLife();
        if (this.lifes > 0) {
            this.reset();
        }
    };

    /**
     * Handle the keyboard input.
     *
     * @param {string} key The name of the key to handle.
     */
    Player.prototype.handleInput = function (key) {
        if (key === 'up' && this.position.y > config.GAME_TOP_BOUNDARY) {
            this.position.y -= config.GENERAL_TILE_HEIGHT;
        } else if (key === 'right' && this.position.x < config.GAME_RIGHT_BOUNDARY) {
            this.position.x += config.GENERAL_TILE_WIDTH;
        } else if (key === 'down' && this.position.y < config.GAME_BOTTOM_BOUNDARY) {
            this.position.y += config.GENERAL_TILE_HEIGHT;
        } else if (key === 'left' && this.position.x > config.GAME_LEFT_BOUNDARY) {
            this.position.x -= config.GENERAL_TILE_WIDTH;
        }
    };

    return Player;
});
