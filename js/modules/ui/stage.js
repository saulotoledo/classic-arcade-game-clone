/**
 * A module to define the main stage UI.
 *
 * @module ui/stage
 */
define(['config/config', 'config/strings'], function (config, strings) {

    /**
     * Creates the main stage UI. It nust be extended by the other game UIs.
     *
     * @constructor
     * @alias module:ui/stage
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var StageUI = function (canvas, ctx, game) {

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

        this.hoverBoundActions = [];

        // Identify the elements the mouse is over.
        this.mouseOverElements = [];

        //this.mouseMoveCallbacks = {};

        this.mouseIsPressed = false;
        this.enterIsPressed = false;

        var self = this;
        this.mouseMoveListener = function (evt) {

            var mousePos = self.getMousePos(evt),
                previousActionName;

            if (self.mouseOverElements.length > 0) {
                self.canvas.style.cursor = "pointer";
            } else {
                self.canvas.style.cursor = "initial";
            }

            self.hoverBoundActions.forEach(function (hoverBoundAction) {
                var bounds = hoverBoundAction.bounds;

                if (mousePos.x >= bounds.topLeftX &&
                    mousePos.x <= bounds.bottomRightX &&
                    mousePos.y >= bounds.topLeftY &&
                    mousePos.y <= bounds.bottomRightY) {

                    if (self.mouseOverElements.indexOf(hoverBoundAction.name) == -1) {
                        self.game.audioControl.playSound('selectionChange');
                        self.mouseOverElements.push(hoverBoundAction.name);
                    }
                    hoverBoundAction.mouseOverCallback(hoverBoundAction.name);
                } else {
                    var index = self.mouseOverElements.indexOf(hoverBoundAction.name);
                    if (index > -1) {
                        self.mouseOverElements.splice(index, 1);
                    }
                    hoverBoundAction.mouseOutCallback(hoverBoundAction.name);
                }

                previousActionName = hoverBoundAction.name;
            });
        };

        this.canvas.addEventListener('mousemove', this.mouseMoveListener);
        this.canvas.dispatchEvent(new MouseEvent('mousemove'));

        this.canvas.addEventListener('mousedown', function (evt) {
            self.mouseIsPressed = true;
        });

        this.canvas.addEventListener('mouseup', function (evt) {
            self.mouseIsPressed = false;
        });

        document.addEventListener('keydown', function (evt) {
            var allowedKeys = {
                    13: 'enter',
                    77: 'M',
                    109: 'm',
                },
                key = allowedKeys[evt.keyCode];

            if (key === 'enter') {
                self.enterIsPressed = true;
            } else if (key === 'm' || key === 'M') {
                self.toggleAudio();
            }
        });

        document.addEventListener('keyup', function (evt) {
            if (evt.keyCode === 13) { //enter
                self.enterIsPressed = false;
            }
        });
    };

    StageUI.prototype.close = function () {
        this.hoverBoundActions = [];
    };

    StageUI.prototype.toggleAudio = function () {
        this.game.isMute = !this.game.isMute;
    };

    StageUI.prototype.addHoverBoundActions = function (name, bounds, mouseOverCallback, mouseOutCallback) {
        this.hoverBoundActions.push({
            name: name,
            bounds: bounds,
            mouseOverCallback: mouseOverCallback,
            mouseOutCallback: mouseOutCallback
        });
    };

    StageUI.prototype.drawDetachedText = function (text, font, textAlign, strokeStyle, fillStyle, posX, posY, pressed) {

        if (typeof pressed === 'undefined') {
            pressed = false;
        }

        var offsetX = 0,
            offsetY = 0;

        if (pressed) {
            offsetX = 1;
            offsetY = 2;
        }

        this.ctx.beginPath();
        this.ctx.font = font;
        this.ctx.textAlign = textAlign;
        this.ctx.strokeStyle = strokeStyle;

        this.ctx.fillStyle = strokeStyle;
        this.ctx.fillText(text, posX + config.GENERAL_TEXT_SHADOW_DIFF_X, posY + config.GENERAL_TEXT_SHADOW_DIFF_Y);

        this.ctx.fillStyle = fillStyle;
        this.ctx.fillText(text, posX + offsetX, posY + offsetY);
        this.ctx.strokeText(text, posX + offsetX, posY + offsetY);
        this.ctx.closePath();
    };

    StageUI.prototype.drawBackground = function () {
        if (this.backgroundImage !== null) {
            var bgImage = Resources.get(this.backgroundImage);

            this.ctx.drawImage(
                bgImage,
                this.canvas.width / 2 - bgImage.width / 2,
                this.canvas.height / 2 - bgImage.height / 2
            );
        }
    };

    StageUI.prototype.getMousePos = function (evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };

    StageUI.prototype.renderHelp = function (helpLines, rightMargin, topMargin, strokeStyle, fillStyle) {
        var line = 0,
            self = this;

        if (typeof rightMargin === 'undefined') {
            rightMargin = 20;
        }

        if (typeof topMargin === 'undefined') {
            topMargin = 80;
        }

        if (typeof strokeStyle === 'undefined') {
            strokeStyle = 'black';
        }

        if (typeof fillStyle === 'undefined') {
            fillStyle = 'white';
        }

        helpLines.forEach(function (helpLine) {
            self.drawDetachedText(
                helpLine,
                config.GENERAL_HELP_FONT,
                'right',
                strokeStyle,
                fillStyle,
                self.canvas.width - rightMargin,
                self.canvas.height - topMargin + line,
                true
            );
            line += 30;
        });
    };

    return StageUI;
});
