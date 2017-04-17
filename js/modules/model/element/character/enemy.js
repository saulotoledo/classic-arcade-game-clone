/**
 * A module to control the enemies in the game.
 *
 * @module model/element/character/enemy
 * @see module:model/element/character
 */
define(['config/config', 'model/element/character'], function (config, Character) {

    /**
     * Creates a new enemy.
     *
     * @constructor
     * @extends Character
     * @alias module:model/element/character/enemy
     * @param {number} enemyLevel The level of the enemy (it affects it speed).
     */
    var Enemy = function (enemyLevel) {
        var sprite = 'images/enemy-bug.png';
        Character.call(this, sprite, -200, -200);

        /**
         * The level of the enemy. It affects its speed.
         *
         * @type {number}
         */
        this.enemyLevel = enemyLevel;

        this.reset();
    };

    Enemy.prototype = Object.create(Character.prototype);
    Enemy.prototype.constructor = Enemy;

    /**
     * Resets the enemy's position and speed in the game.
     */
    Enemy.prototype.reset = function () {
        this.x = Math.randomInt(config.ENEMY_MIN_STARTING_X, config.ENEMY_MAX_STARTING_X);
        this.y = 60 + (config.GENERAL_TILE_HEIGHT * Math.randomInt(0, 2));
        this.speed = Math.randomInt(config.ENEMY_MIN_SPEED, config.ENEMY_MAX_SPEED) * this.enemyLevel;
    };

    /**
     * Update the enemy's position.
     *
     * @param {number} dt - A time delta between ticks.
     */
    Enemy.prototype.update = function (dt) {
        // Multiply the movement by the dt parameter,
        // ensuring that the game runs at the same speed for
        // all computers:
        this.x += this.speed * dt;

        // Resets the enemy position if he goes off the canvas:
        if (this.x > config.GAME_RIGHT_BOUNDARY + 100) {
            this.reset();
        }
    };

    return Enemy;
});
