/**
 * A module to define the preload UI.
 *
 * @module ui/preload
 */
define(['config/config', 'config/strings'], function (config, strings) {

    /**
     * Creates the pleload UI.
     *
     * @constructor
     * @extends Element
     * @alias module:ui/stage/returnable/gamewon
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var PreloadUI = function (canvas, ctx, game) {

        /**
         * The game canvas context.
         *
         * @type {object}
         */
        this.canvas = canvas;

        /**
         * The canvas context.
         *
         * @type {object}
         */
        this.ctx = ctx;

        /**
         * The game control object.
         *
         * @type {object}
         */
        this.game = game;

        /**
         * The current loading progress. We start with 1
         * just by convenience.
         *
         * @type {object}
         */
        this.currentLoad = 1;
    };

    /**
     * Callback to run when the UI is closed.
     */
    PreloadUI.prototype.close = function () {};

    /**
     * Initializes a fake preload to load the fonts.
     */
    PreloadUI.prototype.init = function () {

        // Cleaning the screen (with black color):
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();
        this.ctx.closePath();

        // Drawing the loading bar:
        var loadBarWidth = 200,
            loadBarHeight = 20,
            topPosX = this.canvas.width / 2 - loadBarWidth / 2,
            topPosY = this.canvas.height / 2 - loadBarHeight / 2;

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'gold';
        this.ctx.rect(topPosX, topPosY, loadBarWidth, loadBarHeight);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = 'yellow';
        this.ctx.rect(topPosX, topPosY, this.currentLoad, loadBarHeight);
        this.ctx.fill();
        this.ctx.closePath();

        /* Loads all the fonts used in the game. Since they are always the same
         * font it is not necessary to load one by one (just one load can handle
         * the situation. But adding all of them to the following array allow us
         * to change the fonts in the config file and they will also be loaded
         * here. Any font setting added in the future should be added here.
         */
        var fontsToPreload = [
            config.GENERAL_TITLE_FONT,
            config.GENERAL_HELP_FONT,
            config.GENERAL_RETURN_FONT,
            config.INIT_SCREEN_MENU_FONT,
            config.GAME_STATUSBAR_FONT,
            config.GAME_PAUSED_FONT,
            config.CREDITS_SCREEN_SUBHEADINGS_FONT,
            config.CREDITS_SCREEN_TEXT_FONT
        ];

        fontsToPreload.forEach(function (font) {
            this.ctx.font = font;
            this.ctx.fillStyle = 'black';
            this.ctx.fillText('.', 0, 0);
        });

        var self = this;
        var nextPageInterval = setInterval(function () {

            // Implements a fake progress. Needs improvements in real applications:
            self.currentLoad += 10;
            if (self.currentLoad > loadBarWidth) {
                clearInterval(nextPageInterval);
                self.currentLoad = loadBarWidth;
                self.game.currentScene = self.game.scenes.intro;
            }
        }, 150);
    };

    return PreloadUI;
});
