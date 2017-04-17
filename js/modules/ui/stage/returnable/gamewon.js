/**
 * A module to define the game won UI.
 *
 * @module ui/stage/returnable/gamewon
 * @see module:ui/stage/returnable
 */
define(['config/config', 'config/strings', 'ui/stage/returnable'], function (config, strings, ReturnableUI) {

    /**
     * Creates the game won UI.
     *
     * @constructor
     * @extends ReturnableUI
     * @alias module:ui/stage/returnable/gamewon
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var GameWonUI = function (canvas, ctx, game) {
        var title = strings.congrats,
            music = 'gameWon';

        ReturnableUI.call(this, canvas, ctx, game, title, music);
    };

    GameWonUI.prototype = Object.create(ReturnableUI.prototype);
    GameWonUI.prototype.constructor = GameWonUI;

    /**
     * Initializes the UI.
     */
    GameWonUI.prototype.init = function () {

        this.drawDetachedText(
            strings.youWon,
            config.GENERAL_TITLE_FONT,
            'center',
            'black',
            'yellow',
            this.canvas.width / 2,
            this.canvas.height / 2 + 40
        );
    };

    return GameWonUI;
});
