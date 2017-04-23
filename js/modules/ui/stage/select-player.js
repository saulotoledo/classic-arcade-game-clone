/**
 * A module to define the select player UI.
 *
 * @module ui/stage/select-player
 * @see module:ui/stage
 */
define(['config/config', 'config/strings', 'ui/stage'], function (config, strings, StageUI) {

    /**
     * Creates the select player UI.
     *
     * @constructor
     * @extends StageUI
     * @alias module:ui/stage/select-player
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var SelectPlayerUI = function (canvas, ctx, game) {
        StageUI.call(this, canvas, ctx, game);

        /**
         * The player avatars.
         * 
         * @type {Array}
         */
        this.playerImages = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];

        /**
         * The index of the selected player image.
         */
        this.selectedIndex = 0;

        var self = this;

        /**
         * A listener that should be used in the keyup event to handle the
         * allowed keys.
         * 
         * @param {KeyboardEvent} evt The keyboard event.
         * @type {function}
         * @private
         */
        var _keyUpListener = function (evt) {
            var allowedKeys = {
                    13: 'enter',
                    37: 'left',
                    39: 'right'
                },
                key = allowedKeys[evt.keyCode];

            if (key === 'right' || key === 'left') {

                self.game.audioControl.playSound('selectionChange');

                if (key === 'right') {
                    if (self.selectedIndex < self.playerImages.length - 1) {
                        self.selectedIndex++;
                    } else {
                        self.selectedIndex = 0;
                    }
                } else if (key === 'left') {
                    if (self.selectedIndex > 0) {
                        self.selectedIndex--;
                    } else {
                        self.selectedIndex = self.playerImages.length - 1;
                    }
                }
            } else if (key === 'enter') {
                self.startGame();
            }
        };

        /**
         * A listener that should be used in the mouseup event to handle the
         * mouse actions.
         * 
         * @param {MouseEvent} evt The mouse event.
         * @type {function}
         * @private
         */
        var _mouseUpListener = function () {
            if (self.mouseOverElements.length > 0) {
                self.startGame();
            }
        };

        // Registering the events:
        this.registerListener('keyup', _keyUpListener);
        this.registerListener('mouseup', _mouseUpListener);

        // Preparing the hoverables:
        this.prepareHoverables();
    };

    SelectPlayerUI.prototype = Object.create(StageUI.prototype);
    SelectPlayerUI.prototype.constructor = SelectPlayerUI;

    /**
     * Prepare the hoverable elements.
     */
    SelectPlayerUI.prototype.prepareHoverables = function () {

        var xPos = config.GENERAL_TILE_WIDTH,
            yPos = 2 * config.GENERAL_TITLE_TOP_Y_POS,
            mouseOverCallback = function (itemIndex) {
                self.selectedIndex = itemIndex;
            },
            mouseOutCallback = function (itemIndex) {},
            self = this;

        for (var i = 0; i < this.playerImages.length; i++) {
            var totalXPos = (i + 1) * xPos;

            var itemBounds = {
                topLeftX: totalXPos,
                topLeftY: yPos,
                bottomRightX: totalXPos + config.GENERAL_TILE_WIDTH,
                bottomRightY: yPos + config.GENERAL_TILE_HEIGHT * 2
            };

            this.addHoverable(
                i,
                itemBounds,
                this.playerImages[i],
                totalXPos,
                yPos,
                mouseOverCallback,
                mouseOutCallback
            );
        }
    };

    /**
     * Start the game by setting the player image and changing to the game scene.
     */
    SelectPlayerUI.prototype.startGame = function () {
        this.game.audioControl.playSound('selectionAccept');
        this.game.playerSprite = this.playerImages[this.selectedIndex];
        this.game.currentScene = this.game.scenes.game;
    };

    /**
     * Initializes the UI.
     */
    SelectPlayerUI.prototype.init = function (dt) {

        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        this.drawDetachedText(
            strings.selectPlayerTitle,
            config.GENERAL_TITLE_FONT,
            'center',
            'white',
            'black',
            this.canvas.width / 2,
            config.GENERAL_TITLE_TOP_Y_POS
        );

        var xPos = config.GENERAL_TILE_WIDTH,
            yPos = 2 * config.GENERAL_TITLE_TOP_Y_POS;

        this.ctx.drawImage(Resources.get('images/selector.png'), (this.selectedIndex + 1) * xPos, yPos);

        this.renderHelp(strings.selectPlayerHelp);

        // Run the super class init method:
        StageUI.prototype.init.call(this);
    };

    return SelectPlayerUI;
});
