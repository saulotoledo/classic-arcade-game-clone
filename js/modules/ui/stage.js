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

        /**
         * Define an object that contains the coordinates used to verify
         * collisions.
         *
         * @typedef {object} bounds
         * @property {number} topLeftX The top left x position.
         * @property {number} bottomRightX The bottom right x position.
         * @property {number} topLeftY The top left y position.
         * @property {number} bottomRightY The bottom right y position.
         */

        /**
         * This callback is used to handle mouse over events.
         * 
         * @callback mouseOverCallbackType
         * @param {identifier} identifier The name (identifier) of the hover area (see {@link hoverElement}).
         */

        /**
         * This callback is used to handle mouse out events.
         * 
         * @callback mouseOutCallbackType
         * @param {identifier} identifier The identifier of the hover area (see {@link hoverElement}).
         */

        /**
         * Define an object that contains the data used to identify the mouse hover
         * areas in the stage.
         *
         * @typedef {object} hoverElement
         * @property {string} identifier An identifier for that hover area.
         * @property {bounds} bounds The hover bounds.
         * @property {string|function} content The image path a function that renders the element.
         * @property {number} renderXPos The x position to render the element.
         * @property {number} renderYPos The y position to render the element.
         * @property {mouseOverCallbackType} mouseOverCallback
         * @property {mouseOutCallbackType} mouseOutCallback
         */

        /**
         * An array of {@link hoverElement} objects.
         *
         * @type {hoverElement[]}
         */
        this.hoverElements = [];

        /**
         * Identify the elements the mouse is over. Each value must contain the identifier
         * found at {@link StageUI#hoverElements}.
         * 
         * @type {string[]}
         */
        this.mouseOverElements = [];

        /**
         * Identify if the mouse left button is pressed.
         * 
         * @type {boolean}
         */
        this.mouseIsPressed = false;

        /**
         * Identify if the enter key is pressed.
         * 
         * @type {boolean}
         */
        this.enterIsPressed = false;

        var self = this;

        /**
         * A listener that should be used in the mousemove event to update
         * the mouse cursor in hover areas, and handle the hover areas,
         * updating the proper variables.
         * 
         * @param {MouseEvent} evt The mouse event.
         */
        this.mouseMoveListener = function (evt) {
            var mousePos = self.getMousePos(evt);

            // Updating the mouse cursor on hover areas:
            if (self.mouseOverElements.length > 0) {
                self.canvas.style.cursor = "pointer";
            } else {
                self.canvas.style.cursor = "initial";
            }

            // Check if the mouse is in a hover area:
            self.hoverElements.forEach(function (hoverElement) {
                var bounds = hoverElement.bounds;

                // Check if the mouse is inside the hover area bounds:
                if (mousePos.x >= bounds.topLeftX &&
                    mousePos.x <= bounds.bottomRightX &&
                    mousePos.y >= bounds.topLeftY &&
                    mousePos.y <= bounds.bottomRightY) {

                    // If the hover area is not registered in the {@link StageUI#mouseOverElements}
                    // list, i.e. this hover has not happened yet, play a "selection change" sound
                    // and register the hover event:
                    if (self.mouseOverElements.indexOf(hoverElement.identifier) === -1) {
                        self.game.audioControl.playSound('selectionChange');
                        self.mouseOverElements.push(hoverElement.identifier);
                    }

                    // Trigger the equivalent mouseover event:
                    hoverElement.mouseOverCallback(hoverElement.identifier);
                } else {
                    // If the mouse is not above a hover area, it should be removed from the
                    // {@link StageUI#mouseOverElements} list:
                    var index = self.mouseOverElements.indexOf(hoverElement.identifier);
                    if (index > -1) {
                        self.mouseOverElements.splice(index, 1);
                    }

                    // Trigger the equivalent mouseout event:
                    hoverElement.mouseOutCallback(hoverElement.identifier);
                }
            });
        };

        // Registering the mousemove event:
        this.canvas.addEventListener('mousemove', this.mouseMoveListener);

        // Registering the mousedown event to identify when the mouse is pressed:
        this.canvas.addEventListener('mousedown', function (evt) {
            self.mouseIsPressed = true;
        });

        // Registering the mousedown event to identify when the mouse is not pressed:
        this.canvas.addEventListener('mouseup', function (evt) {
            self.mouseIsPressed = false;
        });

        // Registering the keydown event to identify when the supported keys and when
        // the enter key is pressed:
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

        // Registering the keydown event to identify when the enter key is not pressed:
        document.addEventListener('keyup', function (evt) {
            if (evt.keyCode === 13) { //enter
                self.enterIsPressed = false;
            }
        });
    };

    StageUI.prototype.init = function () {
        // Render the hoverables:
        this.renderHoverables();
    };

    StageUI.prototype.close = function () {
        this.hoverElements = [];

        if (document.removeEventListener) { // For all major browsers, except IE 8 and earlier
            document.removeEventListener('keyup', this.keyUpEvent);
            document.removeEventListener('keydown', this.keyDownEvent);
            this.canvas.removeEventListener('mouseup', this.mouseUpListener);
            this.canvas.removeEventListener('mousedown', this.mousDownListener);
            this.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        } else if (document.detachEvent) { // For IE 8 and earlier versions
            document.detachEvent("onkeyup", this.keyUpEvent);
            document.detachEvent("onkeydown", this.keyDownEvent);
            this.canvas.detachEvent("onmmouseup", this.mouseUpListener);
            this.canvas.detachEvent("onmousedown", this.mousDownListener);
            this.canvas.detachEvent("onmousemove", this.mouseMoveListener);
        }
    };

    StageUI.prototype.toggleAudio = function () {
        this.game.isMute = !this.game.isMute;
    };

    StageUI.prototype.renderHoverables = function () {
        var self = this;
        this.hoverElements.forEach(function (element) {
            if (typeof element.content === 'function') {
                element.content(element);
            } else {
                self.ctx.drawImage(Resources.get(element.content), element.renderXPos, element.renderYPos);
            }
        });
    };

    StageUI.prototype.addHoverElements = function (identifier, bounds, content, renderXPos, renderYPos, mouseOverCallback, mouseOutCallback) {
        this.hoverElements.push({
            identifier: identifier,
            bounds: bounds,
            content: content,
            renderXPos: renderXPos,
            renderYPos: renderYPos,
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
