/**
 * A module to define the game UI.
 *
 * @module ui/stage/game
 * @see module:ui/stage
 */
define(['config/config', 'config/strings', 'model/element/character/player', 'model/element/character/enemy', 'model/element/rock', 'model/element/collectible/gem', 'model/element/collectible/star', 'model/element/collectible/key', 'model/element/collectible/heart', 'ui/stage', 'ui/stage/game-statusbar'], function (config, strings, Player, Enemy, Rock, Gem, Star, Key, Heart, StageUI, GameUIStatusBar) {

    /**
     * Creates the game UI.
     *
     * @constructor
     * @extends Stage
     * @alias module:ui/stage/game
     * @param {object} canvas The game canvas.
     * @param {object} ctx The game canvas context.
     * @param {Game} game The game control object.
     */
    var GameUI = function (canvas, ctx, game) {
        StageUI.call(this, canvas, ctx, game);

        /**
         * Part of the interface that contains the game current statuses.
         *
         * @type {GameUIStatusBar}
         */
        this.statusBar = new GameUIStatusBar(this);

        /**
         * All game enemies.
         *
         * @type {Enemy[]}
         */
        this.allEnemies = [];

        /**
         * Game rocks.
         *
         * @type {Rock[]}
         */
        this.rocks = [];

        /**
         * Game collectibles.
         *
         * @type {Collectible[]}
         */
        this.collectibles = [];

        /**
         * An array of objects in the form `{ row: row, col: col }` used to prevent
         * collectibles to appear one above another.
         *
         * @type {Object[]}
         */
        this.collectibleInvalidLocations = [];

        /**
         * An array of objects in the form `{ row: row, col: col }` used to control
         * the positions that are blocked by rocks.
         *
         * @type {Object[]}
         */
        this.blockedLocations = [];

        /**
         * Defines if a level is already ready to be processed. It is used to ensure that
         * the rendering of the game will not happen before the function that prepares
         * the next level is completed.
         *
         * @type {boolean}
         */
        this.levelIsReady = true;

        /**
         * Generates a shuffled array with several collectibles. Some of these elements
         * appear more frequently in the array, and others with less frequency. The idea
         * here is to use this array to sort the collectible that will appear in the stage
         * just by random sorting a position in this array. Elements that appear less
         * often in the array are more difficult to appear.
         *
         * @type {function[]}
         */
        this.collectiblesSortHelperList = Array(1000).fill(Gem)
            .concat(Array(150).fill(Star))
            .concat(Array(70).fill(Key))
            .concat(Array(70).fill(Heart))
            .shuffle();

        /**
         * The game player.
         */
        this.player = new Player(
            this.game.playerSprite,
            config.PLAYER_INIT_COL * config.GENERAL_TILE_WIDTH,
            config.PLAYER_INIT_ROW * config.GENERAL_TILE_HEIGHT
        );

        var self = this;

        // This listens for key presses and sends the keys to your
        // Player.handleInput() method.
        this.keyUpEvent = document.addEventListener('keyup', function (e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down',
                80: 'P',
                112: 'p'
            };

            var key = allowedKeys[e.keyCode];

            if (key === 'P' || key === 'p') {
                self.togglePause();
            } else if (!self.game.isPaused && self.isValidMove(key)) {
                self.player.handleInput(allowedKeys[e.keyCode]);
            }
        });

        // An interval to ramdomly create collectibles.
        this.collectiblesCreatorInterval = setInterval(function () {
            self.sortCollectibleCreation();
        }, config.GAME_COLLECTIBLE_SORT_INTERVAL);

        // Prepares the UI:
        this.prepare();
    };

    GameUI.prototype = Object.create(StageUI.prototype);
    GameUI.prototype.constructor = GameUI;

    /**
     * Toggle the game pause state.
     */
    GameUI.prototype.togglePause = function () {
        this.game.isPaused = !this.game.isPaused;
    };

    /**
     * Return if the movement that should be done with the player is valid,
     * i.e., is not blocked (by a rock).
     */
    GameUI.prototype.isValidMove = function (key) {
        var playerLoc = {
            row: this.player.y / config.GENERAL_TILE_HEIGHT - 1,
            col: this.player.x / config.GENERAL_TILE_WIDTH
        };

        switch (key) {
            case 'left':
                playerLoc.col--;
                break;

            case 'up':
                playerLoc.row--;
                break;

            case 'right':
                playerLoc.col++;
                break;

            case 'down':
                playerLoc.row++;
                break;

            default:
                return false;
        }

        if (this.isBlockedLocation(playerLoc.row, playerLoc.col)) {
            return false;
        }
        return true;
    };

    /**
     * Add a location that should be blocked based in the game tile dimensions.
     * 
     * @param {number} row The row position.
     * @param {number} col The col position.
     */
    GameUI.prototype.addBlockedLocation = function (row, col) {
        this.blockedLocations.push({
            row: row,
            col: col
        });
    };

    /**
     * Remove a blocked location based in the game tile dimensions.
     * 
     * @param {number} row The row position.
     * @param {number} col The col position.
     */
    GameUI.prototype.removeBlockedLocation = function (row, col) {
        this.blockedLocations.splice({
            row: row,
            col: col
        }, 1);
    };

    /**
     * Return if a location is blocked based in the game tile dimensions.
     * 
     * @param {number} row The row position.
     * @param {number} col The col position.
     * @returns {boolean} true if blocked, false otherwise.
     */
    GameUI.prototype.isBlockedLocation = function (row, col) {
        for (var i = 0; i < this.blockedLocations.length; i++) {
            if (this.blockedLocations[i].row === row && this.blockedLocations[i].col === col) {
                return true;
            }
        }
        return false;
    };

    /**
     * Add a collectible valid location that should be blocked based in the
     * game tile dimensions.
     * 
     * @param {number} row The row position.
     * @param {number} col The col position.
     */
    GameUI.prototype.addCollectibleInvalidLocation = function (row, col) {
        this.collectibleInvalidLocations.push({
            row: row,
            col: col
        });
    };

    /**
     * Remove a collectible valid location based in the game tile dimensions.
     * 
     * @param {number} row The row position.
     * @param {number} col The col position.
     */
    GameUI.prototype.removeCollectibleInvalidLocation = function (row, col) {
        this.collectibleInvalidLocations.splice({
            row: row,
            col: col
        }, 1);
    };

    /**
     * Return if a location is invalid based in the game tile dimensions.
     * A blocked location is also invalid.
     * 
     * @param {number} row The row position.
     * @param {number} col The col position.
     * @returns {boolean} true if invalid, false otherwise.
     */
    GameUI.prototype.isCollectibleInvalidLocation = function (row, col) {
        for (var i = 0; i < this.collectibleInvalidLocations.length; i++) {
            if (this.collectibleInvalidLocations[i].row === row && this.collectibleInvalidLocations[i].col === col) {
                return true;
            }
        }
        return this.isBlockedLocation(row, col);
    };

    /**
     * Randomly creates a collectible element in the game.
     */
    GameUI.prototype.sortCollectibleCreation = function () {

        // Checking if we already have reached the limit of collectibles in the game:
        if (this.collectibles.length < config.GAME_MAX_COLLECTIBLES) {
            var sortedValue = Math.randomInt(1, 100),
                compareValue = config.GAME_COLLECTIBLE_PROBABILITY_PERCENT;

            // The chance decreases for multiple collectibles:
            if (this.collectibles.length > 0) {
                compareValue /= this.collectibles.length;
            }

            // A naive approach for caloculate a probability of having a colletible created:
            if (sortedValue <= compareValue) {

                // Sort the position of the collectible:
                var row = Math.randomInt(0, 2),
                    col = Math.randomInt(0, 6);

                // Only creates the collectible if there is not another one in that position:
                if (!this.isCollectibleInvalidLocation(row, col)) {

                    // Sort the collectible type by using {@link ui/stage/game#collectiblesSortHelperList}:
                    var sortedCollectible = Math.randomInt(0, this.collectiblesSortHelperList.length - 1),
                        collectible;

                    // The gems have an extra parameter: their type
                    if (this.collectiblesSortHelperList[sortedCollectible] == Gem) {
                        var gemType = Math.randomInt(1, 3);
                        collectible = new this.collectiblesSortHelperList[sortedCollectible](row, col, gemType);
                    } else {
                        collectible = new this.collectiblesSortHelperList[sortedCollectible](row, col);
                    }

                    // Register the created collectible location as occupied:
                    this.addCollectibleInvalidLocation(row, col);

                    // Add the collectible to the collectibles list:
                    this.collectibles.push(collectible);
                }
            }
        }
    };

    /**
     * Callback to run when the stage is closed.
     * It stops the music, removes the intervals and event listeners.
     */
    GameUI.prototype.close = function () {
        StageUI.prototype.close.call(this);

        this.statusBar.close();
        this.game.audioControl.stopBackgroundMusic();
        this.game.audioControl.currentBackgroundMusic = null;
        clearInterval(this.collectiblesCreatorInterval);

        if (document.removeEventListener) { // For all major browsers, except IE 8 and earlier
            document.removeEventListener('keyup', this.keyUpEvent);
            this.canvas.removeEventListener('mousedown', this.mouseDownListener);
        } else if (document.detachEvent) { // For IE 8 and earlier versions
            document.detachEvent("onkeyup", this.keyUpEvent);
            this.canvas.detachEvent("onmousedown", this.mouseDownListener);
        }
    };

    /**
     * Prepare the UI.
     */
    GameUI.prototype.prepare = function () {
        this.player.reset();
        this.allEnemies = [];
        this.game.score = 0;
        this.game.currentLevel = 1;
        this.game.lives = config.GAME_INITIAL_LIVES;
        this.game.audioControl.playBackgroundMusic('mainMusic');

        var numEnemies = config.GAME_NUM_ENEMIES + this.game.currentLevel - 1;
        for (var i = 0; i < numEnemies; i++) {
            var newEnemy = new Enemy(this.game.currentLevel);
            this.allEnemies.push(newEnemy);
        }
    };

    /**
     * Reset the UI.
     */
    GameUI.prototype.reset = function () {
        this.prepare();
    };

    /**
     * Check if the player won the game.
     */
    GameUI.prototype.checkWinner = function () {
        if (this.player.y < config.GAME_WIN_LIMIT_BOUNDARY) {

            this.game.audioControl.playSound('playerReachesWater');

            if (this.game.currentLevel >= config.GAME_MAX_LEVEL) {
                this.game.currentScene = this.game.scenes.gameWon;
            } else {
                this.nextLevel();
                this.player.reset();
            }
        }
    };

    /**
     * Send the player to the next game level.
     */
    GameUI.prototype.nextLevel = function () {
        this.levelIsReady = false;
        this.game.currentLevel++;

        // A new enemy is added:
        var newEnemy = new Enemy(this.game.currentLevel);
        this.allEnemies.push(newEnemy);

        // The number of rocks is based on the game level:
        var numRocks = Math.min(this.game.currentLevel - 1, config.GAME_MAX_ROCKS);

        this.blockedLocations = [];
        this.rocks = [];

        // Create each rock:
        while (this.rocks.length < numRocks) {
            var row = Math.randomInt(0, 2),
                col = Math.randomInt(0, 6);

            if (!this.isCollectibleInvalidLocation(row, col)) { // <- It also checks the blocked locations
                var rock = new Rock(row, col);
                this.addBlockedLocation(row, col);
                this.rocks.push(rock);
            }
        }
        this.levelIsReady = true;
    };

    /**
     * This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities.
     */
    GameUI.prototype.renderEntities = function () {

        if (this.levelIsReady) {
            this.collectibles.forEach(function (collectible) {
                collectible.render(this.ctx);
            });

            this.player.render(this.ctx);

            this.rocks.forEach(function (rock) {
                rock.render(this.ctx);
            });

            /* Loop through all of the objects within the allEnemies array and call
             * the render function you have defined.
             */
            this.allEnemies.forEach(function (enemy) {
                enemy.render(this.ctx);
            });
        }
    };

    /**
     * Check game collisions.
     */
    GameUI.prototype.checkCollisions = function () {
        var self = this,
            _hasCollision = function (player, element) {
                return player.x < (element.x + element.width) &&
                    player.y < (element.y + element.height) &&
                    element.x < (player.x + player.width) &&
                    element.y < (player.y + player.height);
            };

        // Checking the collisions with enemies:
        this.allEnemies.forEach(function (enemy) {
            if (_hasCollision(self.player, enemy)) {
                self.game.audioControl.playSound('playerLostLife');
                self.player.hit();
            }
        });

        // Checking the collisions with collectibles:
        for (var i = 0; i < this.collectibles.length; i++) {
            var collectible = this.collectibles[i];
            if (_hasCollision(this.player, collectible)) {
                this.game.audioControl.playSound('pickItem');
                this.game.score += collectible.points;

                if (collectible.constructor === Heart) {
                    this.player.addLife();
                }

                this.removeCollectibleInvalidLocation(collectible.loc.row, collectible.loc.col);
                this.collectibles.remove(i);
            }
        }
    };

    /**
     * This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     *
     * @param {number} dt Delta time between ticks.
     */
    GameUI.prototype.update = function (dt) {
        this.statusBar.update();

        if (!this.game.isPaused) {
            this.updateEntities(dt);
            this.checkCollisions();

            if (this.player.lifes <= 0) {
                this.game.currentScene = this.game.scenes.gameLost;
            }
        }
    };

    /**
     * This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     *
     * @param {number} dt Delta time between ticks.
     */
    GameUI.prototype.updateEntities = function (dt) {
        this.allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        this.player.update();
        this.checkWinner();
    };

    /**
     * Render the pause information on the stage.
     */
    GameUI.prototype.renderPauseInfo = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 180, this.canvas.width, this.canvas.height - 400);
        this.ctx.closePath();

        this.drawDetachedText(
            strings.gamePaused,
            config.GAME_PAUSED_FONT,
            'center',
            'black',
            'white',
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    };

    /**
     * This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    GameUI.prototype.renderGame = function () {

        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png', // Top row is water
                'images/stone-block.png', // Row 1 of 3 of stone
                'images/stone-block.png', // Row 2 of 3 of stone
                'images/stone-block.png', // Row 3 of 3 of stone
                'images/grass-block.png', // Row 1 of 2 of grass
                'images/grass-block.png' // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 9,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                this.ctx.drawImage(Resources.get(rowImages[row]), col * config.GENERAL_TILE_WIDTH, row * config.GENERAL_TILE_HEIGHT);
            }
        }

        this.renderEntities();
    };

    /**
     * Initializes the UI.
     *
     * @param {number} dt Delta time between ticks.
     */
    GameUI.prototype.init = function (dt) {
        // Clean the canvas (black color):
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fill();

        // Update the game:
        this.update(dt);

        // Render the game:
        this.renderGame();
        this.renderHelp(strings.gameHelp, 20, 100, 'rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0.7)');

        // If the game is paused, render the pause:
        if (this.game.isPaused) {
            this.renderPauseInfo();
        }

        // Run the super class init method:
        StageUI.prototype.init.call(this);
    };

    return GameUI;
});
