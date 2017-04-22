/**
 * A module to control the game state.
 *
 * @module game
 */
define(['config/config', 'misc/audio-control'], function (config, AudioControl) {

    /**
     * Creates the object that controls the game state.
     *
     * @constructor
     * @alias module:game
     */
    var Game = function () {

        /**
         * The game scenes.
         *
         * @type {Object.<string, string>}
         */
        this.scenes = {
            preload: 'preload',
            intro: 'intro',
            credits: 'credits',
            selectPlayer: 'selectPlayer',
            game: 'game',
            gameWon: 'gameWon',
            gameLost: 'gameLost'
        };

        /**
         * An object to control the audio system.
         *
         *@type {AudioControl}
         */
        this.audioControl = new AudioControl(this);

        /**
         * The current game scene. It begins at the preload scene.
         *
         * @type {string}
         */
        this.currentScene = this.scenes.preload;

        /**
         * The player sprite.
         *
         * @type {string}
         */
        this.playerSprite = 'images/char-boy.png';

        /**
         * Control the paused state of the game.
         *
         * @type {boolean}
         */
        this.isPaused = false;

        /**
         * Control the sound state of the game.
         *
         * @type {boolean}
         */
        this.isMute = false;

        /**
         * The score of the player in the game. It starts at zero.
         *
         * @type {number}
         */
        this.score = 0;

        /**
         * The game current level. It starts at one.
         *
         * @type {number}
         */
        this.currentLevel = 1;

        /**
         * The game max level.
         *
         * @type {number}
         */
        this.maxLevel = config.GAME_MAX_LEVEL;
    };

    return Game;
});
