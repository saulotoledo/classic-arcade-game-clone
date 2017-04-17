define(['config/config', 'misc/audio-control'], function (config, AudioControl) {

    /**
     * Controls the game.
     */
    var Game = function () {

        this.scenes = {
            preload: 'preload',
            intro: 'intro',
            credits: 'credits',
            selectPlayer: 'selectPlayer',
            game: 'game',
            gameWon: 'gameWon',
            gameLost: 'gameLost'
        };

        this.audioControl = new AudioControl(this);

        /**
         * 
         */
        this.currentScene = this.scenes.preload;

        /**
         * The player sprite.
         */
        this.playerSprite = 'images/char-boy.png';

        /**
         * 
         */
        this.isPaused = false;

        /**
         * 
         */
        this.isMute = false;

        /**
         * The score of the player in the game.
         */
        this.score = 0;

        /**
         * The game current level.
         */
        this.currentLevel = 1;

        /**
         * The game max level.
         */
        this.maxLevel = config.GAME_MAX_LEVEL;
    };

    return Game;
});
