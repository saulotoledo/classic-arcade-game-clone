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
         * @private
         */
        var _mouseUpListener = function () {
            if (self.stage.currentAction) {
                self.stage.currentAction();
            }
        };

        // Registering the mouseup listener:
        this.stage.registerListener('mouseup', _mouseUpListener);
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

        var soundIconWidth = 29,
            soundIconHeight = 23,
            soundIconTopMargin = 15,
            soundIconBounds = {
                topLeftX: this.stage.canvas.width - soundIconWidth,
                topLeftY: soundIconTopMargin,
                bottomRightX: this.stage.canvas.width,
                bottomRightY: soundIconTopMargin + soundIconHeight
            };

        if (!this.soundIsPrepared) {
            /* Adding the hover event to mute/unmute the sound. The current action
             * to be used in the mouse down event is only available when the mouse
             * is over the mute/unmute icon.
             * */
            this.stage.addHoverable(
                'sound',
                soundIconBounds,
                // We need to draw a resized image, but this is not directly supported
                // and we need a custom function to do it:
                function () {
                    // Drawing the mute/unmute icon:
                    var soundImage;
                    if (self.stage.game.isMute) {
                        soundImage = 'images/audio_muted.png';
                    } else {
                        soundImage = 'images/audio_unmuted.png';
                    }

                    self.stage.ctx.drawImage(Resources.get(soundImage), soundIconBounds.topLeftX, soundIconBounds.topLeftY, soundIconWidth, soundIconHeight);
                },
                soundIconBounds.topLeftX,
                soundIconBounds.topLeftY,
                function (itemkey) {
                    self.stage.currentAction = function () {
                        self.stage.toggleAudio();
                    };
                },
                function (itemkey) {
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
