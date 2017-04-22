/**
 * A module to define the intro UI.
 *
 * @module ui/stage/intro
 * @see module:ui/stage
 */
define(['config/config', 'config/strings', 'ui/stage', 'ui/stage/intro-menu'], function (config, strings, StageUI, IntroUIMenu) {

    /**
     * Creates the intro UI.
     *
     * @constructor
     * @extends StageUI
     * @alias module:ui/stage/intro
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var IntroUI = function (canvas, ctx, game) {
        StageUI.call(this, canvas, ctx, game);

        /**
         * The intro background image.
         *
         * @type {string}
         */
        this.backgroundImage = 'images/intro-bg.jpg';

        /**
         * The intro UI menu.
         *
         * @type {IntroUIMenu}
         */
        this.menu = new IntroUIMenu(this);
    };

    IntroUI.prototype = Object.create(StageUI.prototype);
    IntroUI.prototype.constructor = IntroUI;

    /**
     * Initializes the IntroUI.
     */
    IntroUI.prototype.init = function (dt) {

        // Rendering the UI:
        this.drawBackground();

        this.drawDetachedText(
            strings.gameTitle,
            config.GENERAL_TITLE_FONT,
            'center',
            'black',
            'white',
            this.canvas.width / 2,
            config.GENERAL_TITLE_TOP_Y_POS
        );

        // Updates the menu:
        this.menu.update();

        // Render the game help:
        this.renderHelp(strings.introHelp);

        // Run the super class init method:
        StageUI.prototype.init.call(this);
    };

    return IntroUI;
});
