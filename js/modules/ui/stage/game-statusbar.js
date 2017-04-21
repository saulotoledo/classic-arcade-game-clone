/**
 * A module to define the status bar in the game UI.
 *
 * @module ui/stage/game-statusbar
 * @see module:ui/stage/game
 */
define(['config/config', 'config/strings'], function (config, strings) {

    /**
     * Creates the part of the interface that contains the game
     * current statuses.
     *
     * @constructor
     * @alias module:ui/stage/game-statusbar
     * @param {object} gameStage The game stage.
     */
    var GameUIStatusBar = function (gameStage) {

        /**
         * The game stage.
         *
         * @type {object}
         */
        this.stage = gameStage;

        // TODO: remove the "this.soundIsPrepared" property, it should not be necessary.
        /**
         * Identifies whether the sound behavior has already prepared
         * in order to avoid a repeated record in each drawing event.
         */
        this.soundIsPrepared = false;

        var self = this;

        /**
         * Function to be triggered in the mouseup event.
         * If there is a valid action to be triggered in the stage,
         * runs it.
         *
         * @type {function}
         */
        this.mouseUpListener = function () {
            if (self.stage.currentAction) {
                self.stage.currentAction();
            }
        };

        // Registering the mouseup listener:
        this.stage.canvas.addEventListener('mouseup', this.mouseUpListener);
    };

    /**
     * Callback to run when the stage is closed.
     * It removes the event listeners.
     */
    GameUIStatusBar.prototype.close = function () {
        if (document.removeEventListener) { // For all major browsers, except IE 8 and earlier
            this.stage.canvas.removeEventListener('mouseup', this.mouseUpListener);
        } else if (document.detachEvent) { // For IE 8 and earlier versions
            this.stage.canvas.detachEvent("onmouseup", this.mouseUpListener);
        }
    };

    GameUIStatusBar.prototype.close = function () {

    };

    /**
     * Updates the status bar.
     */
    GameUIStatusBar.prototype.update = function () {
        var miniWidth = 27,
            miniHeight = 45,
            self = this;

        // Drawing the player lifes:
        for (var i = 0; i < this.stage.player.lifes; i++) {
            this.stage.ctx.drawImage(Resources.get('images/heart.png'), i * miniWidth, 0, miniWidth, miniHeight);
        }

        // Drawing the mute/unmute icon:
        var soundImage = 'images/audio_unmuted.png';
        if (this.stage.game.isMute) {
            soundImage = 'images/audio_muted.png';
        }

        var soundIconWidth = 29,
            soundIconHeight = 23,
            soundIconTopMargin = 15,
            soundIconBounds = {
                topLeftX: this.stage.canvas.width - soundIconWidth,
                topLeftY: soundIconTopMargin,
                bottomRightX: this.stage.canvas.width,
                bottomRightY: soundIconTopMargin + soundIconHeight
            };

        this.stage.ctx.drawImage(Resources.get(soundImage), soundIconBounds.topLeftX, soundIconBounds.topLeftY, soundIconWidth, soundIconHeight);

        if (!this.soundIsPrepared) {
            /* Adding the hover event to mute/unmute the sound. The current action
             * to be used in the mouse down event is only available when the mouse
             * is over the mute/unmute icon.
             * */
            this.stage.addHoverElements(
                'sound',
                soundIconBounds,
                // We need to draw the image resized, but this is not supported here,
                // so we draw the image in the update function and use an empty
                // function here. This behavior needs refactoring.
                // TODO: fix the behavior above.
                function () {},
                soundIconBounds.topLeftX,
                soundIconBounds.topLeftY,
                function (key) {
                    self.stage.currentAction = function () {
                        self.stage.toggleAudio();
                    };
                },
                function (key) {
                    self.stage.currentAction = null;
                }
            );

            this.soundIsPrepared = true;
        }

        // Drawing the player score and the current level:
        this.stage.drawDetachedText(
            strings.gameStatusBarScore + this.stage.game.score + ', ' + strings.gameStatusBarLevel + this.stage.game.currentLevel + '/' + config.GAME_MAX_LEVEL,
            config.GAME_STATUSBAR_FONT,
            'center',
            '#262626',
            'white',
            this.stage.canvas.width / 2,
            32,
            true
        );
    };

    return GameUIStatusBar;
});
