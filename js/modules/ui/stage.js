/**
 * A module to define the main stage UI.
 *
 * @module ui/stage
 */
define(['config/config', 'config/strings', 'misc/point'], function (config, strings, Point) {

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
         * @param {identifier} identifier The name (identifier) of the hover area (see {@link hoverable}).
         */

        /**
         * This callback is used to handle mouse out events.
         * 
         * @callback mouseOutCallbackType
         * @param {identifier} identifier The identifier of the hover area (see {@link hoverable}).
         */

        /**
         * Define an object that contains the data used to identify the mouse hover
         * areas in the stage.
         *
         * @typedef {object} hoverable
         * @property {string} identifier An identifier for that hover area.
         * @property {bounds} bounds The hover bounds.
         * @property {string|function} content The image path a function that renders the element.
         * @property {number} renderXPos The x position to render the element.
         * @property {number} renderYPos The y position to render the element.
         * @property {mouseOverCallbackType} mouseOverCallback A callback to run when the mouse is over.
         * @property {mouseOutCallbackType} mouseOutCallback A callback to run when the mouse is out.
         */

        /**
         * An array of {@link hoverable} objects.
         *
         * @type {hoverable[]}
         */
        this.hoverables = [];

        /**
         * Identify the elements the mouse is over. Each value must contain the identifier
         * found at {@link StageUI#hoverables}.
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
         * @type {function}
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
            self.hoverables.forEach(function (hoverable) {
                var bounds = hoverable.bounds;

                // Check if the mouse is inside the hover area bounds:
                if (mousePos.x >= bounds.topLeftX &&
                    mousePos.x <= bounds.bottomRightX &&
                    mousePos.y >= bounds.topLeftY &&
                    mousePos.y <= bounds.bottomRightY) {

                    // If the hover area is not registered in the {@link StageUI#mouseOverElements}
                    // list, i.e. this hover has not happened yet, play a "selection change" sound
                    // and register the hover event:
                    if (self.mouseOverElements.indexOf(hoverable.identifier) === -1) {
                        self.game.audioControl.playSound('selectionChange');
                        self.mouseOverElements.push(hoverable.identifier);
                    }

                    // Trigger the equivalent mouseover event:
                    hoverable.mouseOverCallback(hoverable.identifier);
                } else {
                    // If the mouse is not above a hover area, it should be removed from the
                    // {@link StageUI#mouseOverElements} list:
                    var index = self.mouseOverElements.indexOf(hoverable.identifier);
                    if (index > -1) {
                        self.mouseOverElements.splice(index, 1);
                    }

                    // Trigger the equivalent mouseout event:
                    hoverable.mouseOutCallback(hoverable.identifier);
                }
            });
        };

        /**
         * A listener that should be used in the mousedown event to set
         * {@link StageUI#mouseIsPressed} to true.
         * 
         * @param {MouseEvent} evt The mouse event.
         * @type {function}
         */
        this.mouseIsPressedListener = function (evt) {
            self.mouseIsPressed = true;
        };

        /**
         * A listener that should be used in the mouseup event to set
         * {@link StageUI#mouseIsPressed} to false.
         * 
         * @param {MouseEvent} evt The mouse event.
         * @type {function}
         */
        this.mouseIsNotPressedListener = function (evt) {
            self.mouseIsPressed = false;
        };

        /**
         * A listener that should be used in the keydown event to handle the
         * allowed keys and set {@link StageUI#enterIsPressed} to true when
         * applicable.
         * 
         * @param {KeyboardEvent} evt The keyboard event.
         * @type {function}
         */
        this.handleKeysListener = function (evt) {
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
        };

        /**
         * A listener that should be used in the keyup event to set
         * {@link StageUI#enterIsPressed} to false when applicable.
         * 
         * @param {KeyboardEvent} evt The keyboard event.
         * @type {function}
         */
        this.enterIsNotPressedListener = function (evt) {
            if (evt.keyCode === 13) { //enter
                self.enterIsPressed = false;
            }
        };

        // Registering the mousemove event:
        this.canvas.addEventListener('mousemove', this.mouseMoveListener);

        // Registering the mousedown event to identify when the mouse is pressed:
        this.canvas.addEventListener('mousedown', this.mouseIsPressedListener);

        // Registering the mousedown event to identify when the mouse is not pressed:
        this.canvas.addEventListener('mouseup', this.mouseIsNotPressedListener);

        // Registering the keydown event to identify when the supported keys and when
        // the enter key is pressed:
        document.addEventListener('keydown', this.handleKeysListener);

        // Registering the keydown event to identify when the enter key is not pressed:
        document.addEventListener('keyup', this.enterIsNotPressedListener);
    };

    /**
     * Initialize the stage.
     */
    StageUI.prototype.init = function () {
        // Render the hoverables:
        this.renderHoverables();
    };

    /**
     * Callback to run when the stage is closed.
     * It removes the event listeners created by the constructor and resets 
     * the hover elements.
     */
    StageUI.prototype.close = function () {
        this.hoverables = [];

        if (document.removeEventListener) { // For all major browsers, except IE 8 and earlier
            document.removeEventListener('keyup', this.enterIsNotPressedListener);
            document.removeEventListener('keydown', this.handleKeysListener);
            this.canvas.removeEventListener('mouseup', this.mouseIsNotPressedListener);
            this.canvas.removeEventListener('mousedown', this.mouseIsPressedListener);
            this.canvas.removeEventListener('mousemove', this.mouseMoveListener);
        } else if (document.detachEvent) { // For IE 8 and earlier versions
            document.detachEvent("onkeyup", this.enterIsNotPressedListener);
            document.detachEvent("onkeydown", this.handleKeysListener);
            this.canvas.detachEvent("onmmouseup", this.mouseIsNotPressedListener);
            this.canvas.detachEvent("onmousedown", this.mouseIsPressedListener);
            this.canvas.detachEvent("onmousemove", this.mouseMoveListener);
        }
    };

    /**
     * Toggle the audio state.
     */
    StageUI.prototype.toggleAudio = function () {
        this.game.isMute = !this.game.isMute;
    };

    /**
     * Render the elements that can receive a mouse hover in the game.
     */
    StageUI.prototype.renderHoverables = function () {
        var self = this;
        this.hoverables.forEach(function (element) {
            if (typeof element.content === 'function') {
                // Some elements, such as text, need a number of particular settings
                // that must be performed by a function and cannot be directly rendered
                // as images:
                element.content(element);
            } else {
                // others are rendered as images in their original size:
                self.ctx.drawImage(Resources.get(element.content), element.renderXPos, element.renderYPos);
            }
        });
    };

    /**
     * Add a hoverable element to the stage.
     * 
     * @param {string} identifier An identifier for the hover area.
     * @param {bounds} bounds The hover bounds.
     * @param {string|function} content The image path a function that renders the element.
     * @param {number} renderXPos The x position to render the element.
     * @param {number} renderYPos The y position to render the element.
     * @param {mouseOverCallbackType} mouseOverCallback A callback to run when the mouse is over.
     * @param {mouseOutCallbackType} mouseOutCallback A callback to run when the mouse is out.
     */
    StageUI.prototype.addHoverable = function (identifier, bounds, content, renderXPos, renderYPos, mouseOverCallback, mouseOutCallback) {
        this.hoverables.push({
            identifier: identifier,
            bounds: bounds,
            content: content,
            renderXPos: renderXPos,
            renderYPos: renderYPos,
            mouseOverCallback: mouseOverCallback,
            mouseOutCallback: mouseOutCallback
        });
    };

    /**
     * Draw a text with a shadow, giving an impression of being detached from the stage.
     * 
     * @param {string} text The text to be drawn.
     * @param {string} font The font of the text.
     * @param {string} textAlign The text align in the canvas.
     * @param {string} strokeStyle The stroke text style that will be applied in the canvas.
     * @param {string} fillStyle The fill style of the text in the canvas.
     * @param {number} posX The x position of the text in the canvas.
     * @param {number} posY The y position of the text in the canvas.
     * @param {boolean} [pressed=false] Informs if the text is pressed, i.e. closer to the shadow.
     */
    StageUI.prototype.drawDetachedText = function (text, font, textAlign, strokeStyle, fillStyle, posX, posY, pressed) {

        if (typeof pressed === 'undefined') {
            pressed = false;
        }

        var offsetX = 0,
            offsetY = 0;

        // If the text is "pressed", apply a minor offset to give that impression:
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

    /**
     * Draw the background image defined in {@link StageUI#backgroundImage} on the stage.
     */
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

    /**
     * Get the mouse position from a mouse event.
     * 
     * @param {MouseEvent} evt The mouse event from where to extract the position.
     * @returns {Point} The mouse position.
     */
    StageUI.prototype.getMousePos = function (evt) {
        var rect = this.canvas.getBoundingClientRect(),
            mousePos = new Point(evt.clientX - rect.left, evt.clientY - rect.top);

        return mousePos;
    };

    /**
     * Render the help message aligned to the right side of the stage.
     * 
     * @param {string[]} helpLines An array of strings to be rendered.
     * @param {number} [rightMargin=20] The right margin with respect to the stage.
     * @param {number} [topMargin=80] The top margin with respect to the stage.
     * @param {string} [strokeStyle=black] The *strokeStyle* used by the canvas to render the text.
     * @param {string} [fillStyle=white] The *fillStyle* used by the canvas to render the text.
     */
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
