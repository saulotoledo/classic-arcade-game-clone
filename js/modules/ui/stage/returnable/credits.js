/**
 * A module to define the credits UI.
 *
 * @module ui/stage/returnable/credits
 * @see module:ui/stage/returnable
 */
define(['config/config', 'config/strings', 'ui/stage/returnable'], function (config, strings, ReturnableUI) {

    /**
     * Creates the credits UI.
     *
     * @constructor
     * @extends ReturnableUI
     * @alias module:ui/stage/returnable/credits
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var CreditsUI = function (canvas, ctx, game) {
        var title = strings.creditsTitle;
        ReturnableUI.call(this, canvas, ctx, game, title);
    };

    CreditsUI.prototype = Object.create(ReturnableUI.prototype);
    CreditsUI.prototype.constructor = CreditsUI;

    /**
     * Initializes the UI.
     */
    CreditsUI.prototype.init = function () {

        var xPos = config.GENERAL_TILE_WIDTH,
            yPos = 1.45 * config.GENERAL_TITLE_TOP_Y_POS;

        strings.credits.forEach(function (creditsLine) {
            var textFont = config.CREDITS_SCREEN_TEXT_FONT,
                textColor = 'white',
                extraSpace = 0;

            if (creditsLine.indexOf(':') > -1) {
                textFont = config.CREDITS_SCREEN_SUBHEADINGS_FONT;
                textColor = 'gold';
                extraSpace = 15;
            }

            this.drawDetachedText(
                creditsLine,
                textFont,
                'center',
                '#262626',
                textColor,
                this.canvas.width / 2,
                yPos + extraSpace,
                true
            );

            yPos += 30 + extraSpace;
        }, this);
    };

    return CreditsUI;
});
