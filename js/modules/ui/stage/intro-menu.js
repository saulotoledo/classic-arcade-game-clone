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

        var self = this;

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

        this.mouseUpListener = function () {
            if (typeof self.currentAction == 'function' && self.stage.mouseOverElements.length > 0) {
                self.runCurrentAction();
            }
        };

        this.keyUpEvent = function (evt) {
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

        document.addEventListener('keyup', this.keyUpEvent);

        this.stage.canvas.addEventListener('mouseup', this.mouseUpListener);
        this.prepareMenuHoverActions();
    };

    IntroUIMenu.prototype.getMenuPos = function () {
        var menuPos = {
            x: this.stage.canvas.width / 2 - config.INIT_SCREEN_MENU_WIDTH / 2,
            y: this.stage.canvas.height / 2 + config.INIT_SCREEN_MENU_ITEM_HEIGHT,
            width: config.INIT_SCREEN_MENU_WIDTH,
            height: config.INIT_SCREEN_MENU_HEIGHT
        };

        return menuPos;
    };

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

    IntroUIMenu.prototype.prepareMenuHoverActions = function () {
        var self = this,
            menuPos = this.getMenuPos(),
            menuItemTop = self.getNextMenuItemTop(),
            menuItemMouseOver = function (menuItemKey) {
                self.setMenuItemSelectionStatus(menuItemKey, true);
            },
            menuItemMouseOut = function (menuItemKey) {},
            hoverableDrawFunction = function (hoverable) {
                self.drawMenuItem(hoverable.identifier, hoverable.renderXPos, hoverable.renderYPos);
            };

        Object.keys(this.menuItems).forEach(function (menuItemKey) {
            self.stage.ctx.font = config.INIT_SCREEN_MENU_FONT;
            var textValue = strings[menuItemKey],
                textWidth = self.stage.ctx.measureText(textValue).width,
                menuItemBounds = {
                    topLeftX: self.stage.canvas.width / 2 - textWidth / 2,
                    topLeftY: menuPos.y + menuItemTop - config.INIT_SCREEN_MENU_ITEM_HEIGHT,
                    bottomRightX: self.stage.canvas.width / 2 + textWidth / 2 + config.GENERAL_TEXT_SHADOW_DIFF_X,
                    bottomRightY: menuPos.y + menuItemTop + config.GENERAL_TEXT_SHADOW_DIFF_Y
                };

            self.stage.addHoverable(
                menuItemKey,
                menuItemBounds,
                hoverableDrawFunction,
                self.stage.canvas.width / 2,
                menuPos.y + menuItemTop,
                menuItemMouseOver,
                menuItemMouseOut
            );

            menuItemTop = self.getNextMenuItemTop(menuItemTop);
        });
    };

    IntroUIMenu.prototype.runCurrentAction = function () {
        this.stage.game.audioControl.playSound('selectionAccept');
        this.currentAction();
    };

    IntroUIMenu.prototype.close = function () {
        if (document.removeEventListener) { // For all major browsers, except IE 8 and earlier
            document.removeEventListener('keyup', this.keyUpEvent);
            this.stage.canvas.removeEventListener('mouseup', this.mouseUpListener);
        } else if (document.detachEvent) { // For IE 8 and earlier versions
            document.detachEvent("onkeyup", this.keyUpEvent);
            this.stage.canvas.detachEvent("onmouseup", this.mouseUpListener);
        }
    };

    IntroUIMenu.prototype.setMenuItemSelectionStatus = function (menuItemKeyToSet, value) {
        var self = this,
            keys = Object.keys(self.menuItems);

        keys.forEach(function (menuItemKey) {

            if (menuItemKey === menuItemKeyToSet) {
                self.menuItems[menuItemKey].selected = value;

                if (value === true) {
                    self.currentAction = self.menuItems[menuItemKey].action;
                }
            } else {
                // Only one item should be selected at a time:
                if (value === true) {
                    self.menuItems[menuItemKey].selected = false;
                }
            }
        });
    };

    IntroUIMenu.prototype.getNextMenuItemTop = function (previousMenuItemTop) {
        var menuItemTopMargin = 45,
            textHeight = config.INIT_SCREEN_MENU_ITEM_HEIGHT;

        if (!previousMenuItemTop) {
            return menuItemTopMargin;
        }

        return previousMenuItemTop + textHeight + menuItemTopMargin / 2;
    };

    IntroUIMenu.prototype.update = function () {
        var menuPos = this.getMenuPos();
        this.stage.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.stage.ctx.fillRect(menuPos.x, menuPos.y, menuPos.width, menuPos.height);
    };

    return IntroUIMenu;
});
