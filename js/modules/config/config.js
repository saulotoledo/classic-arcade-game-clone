define([], function () {

    /**
     * Configuration settings for the game.
     *
     * @exports config/config
     */
    var config = {
        /**
         * The player's horizontal start position.
         * @type {number}
         */
        PLAYER_INIT_COL: 3,

        /**
         * The player's vertical start position.
         * @type {number}
         */
        PLAYER_INIT_ROW: 5,

        /**
         * The size of the player's vertical move.
         * @type {number}
         */
        PLAYER_MAX_LIFES: 6,

        /**
         * The min speed of the enemy.
         * @type {number}
         */
        ENEMY_MIN_SPEED: 50,

        /**
         * The max speed of the enemy.
         * @type {number}
         */
        ENEMY_MAX_SPEED: 100,

        /**
         * The min enemy's horizontal start position.
         * @type {number}
         */
        ENEMY_MIN_STARTING_X: -500,

        /**
         * The max enemy's horizontal start position.
         * @type {number}
         */
        ENEMY_MAX_STARTING_X: -100,

        /**
         * The game's top boundary.
         * @type {number}
         */
        GAME_TOP_BOUNDARY: 0,

        /**
         * The game's right boundary.
         * @type {number}
         */
        GAME_RIGHT_BOUNDARY: 606,

        /**
         * The game's bottom boundary.
         * @type {number}
         */
        GAME_BOTTOM_BOUNDARY: 390,

        /**
         * The game's left boundary.
         * @type {number}
         */
        GAME_LEFT_BOUNDARY: 0,

        /**
         * The game's win limit boundary.
         * @type {number}
         */
        GAME_WIN_LIMIT_BOUNDARY: 50,

        /**
         * The number of enemies at game.
         * @type {number}
         */
        GAME_NUM_ENEMIES: 5,

        /**
         * The width of game elements for collision detection.
         * @type {number}
         */
        GAME_ELEMENT_WIDTH: 50,

        /**
         * The height of game elements for collision detection.
         * @type {number}
         */
        GAME_ELEMENT_HEIGHT: 50,

        /**
         * Initial player lives.
         * @type {number}
         */
        GAME_INITIAL_LIVES: 5,

        /**
         * The game max level.
         * @type {number}
         */
        GAME_MAX_LEVEL: 5,

        /**
         * The max of collectibles that can appear at the same time.
         * @type {number}
         */
        GAME_MAX_COLLECTIBLES: 3,

        /**
         * The max number of rocks that can appear in the game.
         * @type {number}
         */
        GAME_MAX_ROCKS: 4,

        /**
         * The interval between tentatives to generate collectibles.
         * @type {number}
         */
        GAME_COLLECTIBLE_SORT_INTERVAL: 2000,

        /**
         * The probability of generate a collectible in the game.
         * @type {number}
         */
        GAME_COLLECTIBLE_PROBABILITY_PERCENT: 20,

        /**
         * The canvas width.
         * @type {number}
         */
        GENERAL_CANVAS_WIDTH: 707,

        /**
         * The canvas width.
         * @type {number}
         */
        GENERAL_CANVAS_HEIGHT: 606,

        /**
         * The distance between the text and its shadow on the x axis.
         * @type {number}
         */
        GENERAL_TEXT_SHADOW_DIFF_X: 3,

        /**
         * The distance between the text and its shadow on the y axis.
         * @type {number}
         */
        GENERAL_TEXT_SHADOW_DIFF_Y: 5,

        /**
         * The top position of a page title on the y axis.
         * @type {number}
         */
        GENERAL_TITLE_TOP_Y_POS: 100,

        /**
         * The width of a tile in the game.
         * @type {number}
         */
        GENERAL_TILE_WIDTH: 101,

        /**
         * The height of a tile in the game.
         * @type {number}
         */
        GENERAL_TILE_HEIGHT: 83,

        /**
         * The font for page titles.
         * @type {string}
         */
        GENERAL_TITLE_FONT: '40pt BadaBoomBB',

        /**
         * The font for help texts.
         * @type {string}
         */
        GENERAL_HELP_FONT: '15pt BadaBoomBB',

        /**
         * The font for the return text.
         * @type {string}
         */
        GENERAL_RETURN_FONT: '25pt BadaBoomBB',

        /**
         * The top position of the "return to intro"" text on the y axis.
         * @type {number}
         */
        GENERAL_RETURN_Y_POS: 545,

        /**
         * The font for the initial screen menu.
         * @type {string}
         */
        INIT_SCREEN_MENU_FONT: '20pt BadaBoomBB',

        /**
         * The width of the initial screen menu.
         * @type {number}
         */
        INIT_SCREEN_MENU_WIDTH: 200,

        /**
         * The height of the initial screen menu.
         * @type {number}
         */
        INIT_SCREEN_MENU_HEIGHT: 120,

        /**
         * The height of an item in the initial screen menu.
         * @type {number}
         */
        INIT_SCREEN_MENU_ITEM_HEIGHT: 22,

        /**
         * The font for the text that shows the player's life and score.
         * @type {string}
         */
        GAME_STATUSBAR_FONT: '20pt BadaBoomBB',

        /**
         * The font for the pause text when the game is paused.
         * @type {string}
         */
        GAME_PAUSED_FONT: '40pt BadaBoomBB',

        /**
         * The font for the subheadings in the credits page.
         * @type {string}
         */
        CREDITS_SCREEN_SUBHEADINGS_FONT: '20pt BadaBoomBB',

        /**
         * The font for the other texts in the credits page.
         * @type {string}
         */
        CREDITS_SCREEN_TEXT_FONT: '15pt BadaBoomBB',
    };

    return config;
});
