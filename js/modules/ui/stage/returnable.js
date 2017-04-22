/**
 * A module to create a returnable page. Must be extended by other UIs.
 *
 * @module ui/stage/returnable
 * @see module:ui/stage
 */
define(['config/config', 'config/strings', 'ui/stage'], function (config, strings, StageUI) {

    /**
     * Creates the returnable UI, i.e. an UI with a background, a title
     * and a text in the bottom with instructions about how to back to
     * the intro page. It also handles the sounds, mouse and key events
     * to execute that basic actions.
     *
     * @constructor
     * @extends StageUI
     * @alias module:ui/stage/returnable
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     * @param {string} stageTitle The stage title.
     * @param {string} music The music to be played when the stage opens.
     */
    var ReturnableUI = function (canvas, ctx, game, stageTitle, music) {
        StageUI.call(this, canvas, ctx, game);

        /**
         * The stage title.
         *
         * @type {string}
         */
        this.stageTitle = stageTitle;

        /**
         * The music to be played when the stage opens.
         *
         * @type {string}
         */
        this.music = music;

        /**
         * The background image.
         *
         * @type {string}
         */
        this.backgroundImage = 'images/intro-bg.jpg';

        var self = this;

        /**
         * A listener that should be used in the keyup event to handle the
         * allowed keys.
         * 
         * @param {KeyboardEvent} evt The keyboard event.
         * @type {function}
         */
        this.keyUpEvent = function (evt) {
            if (evt.keyCode === 13) { // Enter
                self.returnToTintro();
            }
        };

        /**
         * A listener that should be used in the mousedown event to handle the
         * mouse actions.
         * 
         * @param {MouseEvent} evt The mouse event.
         * @type {function}
         */
        this.mouseDownListener = function () {
            self.returnToTintro();
        };

        // Registering the events:
        document.addEventListener('keyup', this.keyUpEvent);
        this.canvas.addEventListener('mousedown', this.mouseDownListener);

        // Drawing the basic stage:
        this.drawBasicStage();
    };

    ReturnableUI.prototype = Object.create(StageUI.prototype);
    ReturnableUI.prototype.constructor = ReturnableUI;

    /**
     * Draw a stage with a background, a title and a text in the bottom
     * with instructions about how to back to the intro page. It also
     * plays a music in the first time the stage is drawn.
     */
    ReturnableUI.prototype.drawBasicStage = function () {

        if (typeof this.music !== 'undefined' && this.music !== null) {
            this.game.audioControl.playSound(this.music);
        }

        this.drawBackground();

        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fill();

        this.drawDetachedText(
            this.stageTitle,
            config.GENERAL_TITLE_FONT,
            'center',
            'white',
            'black',
            this.canvas.width / 2,
            config.GENERAL_TITLE_TOP_Y_POS
        );

        this.drawDetachedText(
            strings.generalReturnText,
            config.GENERAL_RETURN_FONT,
            'center',
            'orange',
            'black',
            this.canvas.width / 2,
            config.GENERAL_RETURN_Y_POS,
            true
        );
    };

    /**
     * Callback to run when the stage is closed.
     * It removes the event listeners created by the constructor and calls 
     * the parent constructor.
     */
    ReturnableUI.prototype.close = function () {
        StageUI.prototype.close.call(this);

        if (document.removeEventListener) { // For all major browsers, except IE 8 and earlier
            document.removeEventListener('keyup', this.keyUpEvent);
            this.canvas.removeEventListener('mousedown', this.mouseDownListener);
        } else if (document.detachEvent) { // For IE 8 and earlier versions
            document.detachEvent("onkeyup", this.keyUpEvent);
            this.canvas.detachEvent("onmousedown", this.mouseDownListener);
        }
    };

    /**
     * Run the action that returns to the intro page.
     */
    ReturnableUI.prototype.returnToTintro = function () {
        this.game.audioControl.playSound('backToIntro');
        this.game.currentScene = this.game.scenes.intro;
    };

    return ReturnableUI;
});
