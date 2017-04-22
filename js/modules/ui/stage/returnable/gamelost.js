/**
 * A module to define the game lost UI.
 *
 * @module ui/stage/returnable/gamelost
 * @see module:ui/stage/returnable
 */
define(['config/config', 'config/strings', 'ui/stage/returnable'], function (config, strings, ReturnableUI) {

    /**
     * Creates the game lost UI.
     *
     * @constructor
     * @extends ReturnableUI
     * @alias module:ui/stage/returnable/gamelost
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var GameLostUI = function (canvas, ctx, game) {
        var title = strings.sorry,
            music = 'gameLost';

        ReturnableUI.call(this, canvas, ctx, game, title, music);
    };

    GameLostUI.prototype = Object.create(ReturnableUI.prototype);
    GameLostUI.prototype.constructor = GameLostUI;

    /**
     * Initializes the UI.
     */
    GameLostUI.prototype.init = function () {
        this.drawDetachedText(
            strings.youLost,
            config.GENERAL_TITLE_FONT,
            'center',
            'black',
            'yellow',
            this.canvas.width / 2,
            this.canvas.height / 2 - 10
        );

        this.drawDetachedText(
            strings.tryAgain,
            config.GENERAL_TITLE_FONT,
            'center',
            'black',
            'yellow',
            this.canvas.width / 2,
            this.canvas.height / 2 + 55
        );
    };

    return GameLostUI;
});
