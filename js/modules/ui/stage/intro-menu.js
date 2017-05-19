/**
 * A module to define the menu in the intro UI.
 *
 * @module ui/stage/intro-menu
 * @see module:ui/stage/intro
 */
define(['config/config', 'config/strings'], function (config, strings) {

    /**
     * Creates the part of the interface that contains the game menu.
     *
     * @constructor
     * @alias module:ui/stage/intro-menu
     * @param {object} introStage The intro UI stage.
     */
    var IntroUIMenu = function (introStage) {

        /**
         * The stage.
         *
         * @type {object}
         */
        this.stage = introStage;

        /**
         * A menu item.
         *
         * @typedef {object} menuitem
         * @property {boolean} selected Indicates whether the menu item is selected.
         * @property {function} action The action to run of the menu is used.
         */

        /**
         * The menu items.
         *
         * @type {Object.<string, menuitem>}
         */
        this.menuItems = {
            menuNewGame: {
                selected: false,
                action: function () {
                    self.stage.game.currentScene = self.stage.game.scenes.selectPlayer;
                }
            },
            menuCredits: {
                selected: false,
                action: function () {
                    self.stage.game.currentScene = self.stage.game.scenes.credits;
                }
            }
        };

        /**
         * The current action to run when the user click the mouse or use a particular
         * key. It is usually updated when the user has the mouse over an item that
         * triggers an event or is allowed to do that with the keyboard.
         *
         * @type {?function}
         */
        this.currentAction = null;

        // initializes the current selected menu item:
        this.setMenuItemSelectionStatus(Object.keys(this.menuItems)[0], true);

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
                    38: 'up',
                    40: 'down'
                },
                key = allowedKeys[evt.keyCode],
                menuItemsKeys = Object.keys(self.menuItems),
                selectedIndex = 0;

            for (var i = 0; i < menuItemsKeys.length; i++) {
                if (self.menuItems[menuItemsKeys[i]].selected) {
                    selectedIndex = i;
                }
            }

            if (key === 'up' || key === 'down') {
                if (key === 'up') {
                    if (selectedIndex < menuItemsKeys.length - 1) {
                        selectedIndex++;
                    } else {
                        selectedIndex = 0;
                    }
                } else if (key === 'down') {
                    if (selectedIndex > 0) {
                        selectedIndex--;
                    } else {
                        selectedIndex = menuItemsKeys.length - 1;
                    }
                }

                self.stage.game.audioControl.playSound('selectionChange');
                self.setMenuItemSelectionStatus(menuItemsKeys[selectedIndex], true);

            } else if (key === 'enter') {
                self.runCurrentAction();
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
            if (typeof self.currentAction == 'function' && self.stage.mouseOverElements.length > 0) {
                self.runCurrentAction();
            }
        };

        // Registering the events:
        this.stage.registerListener('keyup', _keyUpListener);
        this.stage.registerListener('mouseup', _mouseUpListener);

        // Preparing the hover actions:
        this.prepareMenuHoverActions();
    };

    /**
     * Return the menu graphical constraints.
     * 
     * @returns {object} The menu x, y, width and height properties.
     */
    IntroUIMenu.prototype.getMenuPos = function () {
        var menuPos = {
            x: this.stage.canvas.width / 2 - config.INIT_SCREEN_MENU_WIDTH / 2,
            y: this.stage.canvas.height / 2 + config.INIT_SCREEN_MENU_ITEM_HEIGHT,
            width: config.INIT_SCREEN_MENU_WIDTH,
            height: config.INIT_SCREEN_MENU_HEIGHT
        };

        return menuPos;
    };

    /**
     * Draw a menu item.
     * 
     * @param {string} menuItemKey The menu item key.
     * @param {number} x The x position for the menu item.
     * @param {number} y The y position for the menu item.
     */
    IntroUIMenu.prototype.drawMenuItem = function (menuItemKey, x, y) {

        var menuItem = this.menuItems[menuItemKey],
            canvas = this.stage.canvas,
            ctx = this.stage.ctx,
            color = 'white',
            pressed = false,
            textValue = strings[menuItemKey],
            textFont = config.INIT_SCREEN_MENU_FONT;

        if (menuItem.selected) {
            color = 'yellow';
            if (
                (this.stage.mouseIsPressed && this.stage.mouseOverElements.indexOf(menuItemKey) > -1) ||
                this.stage.enterIsPressed) {

                color = 'coral';
                pressed = true;
            }
        }

        ctx.font = config.INIT_SCREEN_MENU_FONT;
        ctx.textAlign = 'center';

        this.stage.drawDetachedText(
            textValue,
            textFont,
            'center',
            'black',
            color,
            x,
            y,
            pressed
        );
    };

    /**
     * Prepare the hover actions by adding a hoverable element for each menu item.
     */
    IntroUIMenu.prototype.prepareMenuHoverActions = function () {
        var self = this,
            menuPos = this.getMenuPos(),
            menuItemTop = this.getNextMenuItemTop(),
            menuItemMouseOver = function (menuItemKey) {
                self.setMenuItemSelectionStatus(menuItemKey, true);
            },
            menuItemMouseOut = function (menuItemKey) {},
            hoverableDrawFunction = function (hoverable) {
                self.drawMenuItem(hoverable.identifier, hoverable.renderXPos, hoverable.renderYPos);
            };

        Object.keys(this.menuItems).forEach(function (menuItemKey) {
            this.stage.ctx.font = config.INIT_SCREEN_MENU_FONT;
            var textValue = strings[menuItemKey],
                textWidth = this.stage.ctx.measureText(textValue).width,
                menuItemBounds = {
                    topLeftX: this.stage.canvas.width / 2 - textWidth / 2,
                    topLeftY: menuPos.y + menuItemTop - config.INIT_SCREEN_MENU_ITEM_HEIGHT,
                    bottomRightX: this.stage.canvas.width / 2 + textWidth / 2 + config.GENERAL_TEXT_SHADOW_DIFF_X,
                    bottomRightY: menuPos.y + menuItemTop + config.GENERAL_TEXT_SHADOW_DIFF_Y
                };

            this.stage.addHoverable(
                menuItemKey,
                menuItemBounds,
                hoverableDrawFunction,
                this.stage.canvas.width / 2,
                menuPos.y + menuItemTop,
                menuItemMouseOver,
                menuItemMouseOut
            );

            menuItemTop = this.getNextMenuItemTop(menuItemTop);
        }, this);
    };

    /**
     * Run the current menu action.
     */
    IntroUIMenu.prototype.runCurrentAction = function () {
        if (this.currentAction) {
            this.stage.game.audioControl.playSound('selectionAccept');
            this.currentAction();
        }
    };

    /**
     * Set the selection status of a menu.
     * 
     * @param {string} menuItemKeyToSet The menu item key.
     * @param {boolean} value The menu selection status.
     */
    IntroUIMenu.prototype.setMenuItemSelectionStatus = function (menuItemKeyToSet, value) {
        Object.keys(this.menuItems).forEach(function (menuItemKey) {

            if (menuItemKey === menuItemKeyToSet) {
                this.menuItems[menuItemKey].selected = value;

                if (value === true) {
                    this.currentAction = this.menuItems[menuItemKey].action;
                }
            } else {
                // Only one item should be selected at a time:
                if (value === true) {
                    this.menuItems[menuItemKey].selected = false;
                }
            }
        }, this);
    };

    /**
     * Return the top position of the mext menu item considering the position of
     * the previous item.
     * 
     * @param {number} previousMenuItemTop The previous menu item top position.
     * @returns {number} The top position of the next menu item.
     */
    IntroUIMenu.prototype.getNextMenuItemTop = function (previousMenuItemTop) {
        var menuItemTopMargin = 45,
            textHeight = config.INIT_SCREEN_MENU_ITEM_HEIGHT;

        if (!previousMenuItemTop) {
            return menuItemTopMargin;
        }

        return previousMenuItemTop + textHeight + menuItemTopMargin / 2;
    };

    /**
     * Updates the menu (except for the hoverable part, that is accomplished by the stage).
     */
    IntroUIMenu.prototype.update = function () {
        var menuPos = this.getMenuPos();
        this.stage.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.stage.ctx.fillRect(menuPos.x, menuPos.y, menuPos.width, menuPos.height);
    };

    return IntroUIMenu;
});
