/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */


define(['config/config', 'ui/preload', 'ui/stage/intro', 'ui/stage/returnable/credits', 'ui/stage/returnable/gamewon', 'ui/stage/returnable/gamelost', 'ui/stage/select-player', 'ui/stage/game', 'game'], function (config, PreloadUI, IntroUI, CreditsUI, GameWonUI, GameLostUI, SelectPlayerUI, GameUI, Game) {

    var Engine = function (global) {
        /* Predefine the variables we'll be using within this scope,
         * create the canvas element, grab the 2D context for that canvas
         * set the canvas elements height/width and add it to the DOM.
         */
        var doc = global.document,
            win = global.window,
            canvas = doc.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            game = new Game(),
            currentUI = new PreloadUI(canvas, ctx, game),
            previousScene = game.scenes.preload,
            lastTime;

        canvas.width = config.GENERAL_CANVAS_WIDTH;
        canvas.height = config.GENERAL_CANVAS_HEIGHT;
        doc.body.appendChild(canvas);

        /* This function serves as the kickoff point for the game loop itself
         * and handles properly calling the update and render methods.
         */
        function main() {
            /* Get our time delta information which is required if your game
             * requires smooth animation. Because everyone's computer processes
             * instructions at different speeds we need a constant value that
             * would be the same for everyone (regardless of how fast their
             * computer is) - hurray time!
             */
            var now = Date.now(),
                milliseconds = 1000.0,
                dt = (now - lastTime) / milliseconds;

            if (game.currentScene !== previousScene) {
                currentUI.close();

                switch (game.currentScene) {
                    case game.scenes.gameLost:
                        currentUI = new GameLostUI(canvas, ctx, game);
                        break;

                    case game.scenes.gameWon:
                        currentUI = new GameWonUI(canvas, ctx, game);
                        break;

                    case game.scenes.game:
                        currentUI = new GameUI(canvas, ctx, game);
                        break;

                    case game.scenes.credits:
                        currentUI = new CreditsUI(canvas, ctx, game);
                        break;

                    case game.scenes.selectPlayer:
                        currentUI = new SelectPlayerUI(canvas, ctx, game);
                        break;

                    case game.scenes.intro:
                        currentUI = new IntroUI(canvas, ctx, game);
                        break;

                    default:
                    case game.scenes.preload:
                        currentUI = new PreloadUI(canvas, ctx, game);
                        break;
                }
            }

            /* In the next loop we need to know the previous scene in order to detect
             * when the player changed scene, ans we can change the scene object.
             */
            previousScene = game.currentScene;

            /* Call our update/render functions, pass along the time delta to
             * our update function since it may be used for smooth animation.
             */
            currentUI.init(dt);

            /* Set our lastTime variable which is used to determine the time delta
             * for the next time this function is called.
             */
            lastTime = now;

            /* Use the browser's requestAnimationFrame function to call this
             * function again as soon as the browser is able to draw another frame.
             */
            win.requestAnimationFrame(main);
        }

        /* This function does some initial setup that should only occur once,
         * particularly setting the lastTime variable that is required for the
         * game loop.
         */
        function init() {
            reset();
            lastTime = Date.now();
            main();
        }

        /* This function does nothing but it could have been a good place to
         * handle game reset states - maybe a new game menu or a game over screen
         * those sorts of things. It's only called once by the init() method.
         */
        function reset() {
            // noop
        }

        /* Go ahead and load all of the images we know we're going to need to
         * draw our game level. Then set init as the callback method, so that when
         * all of these images are properly loaded our game will start.
         */
        Resources.load([
            'images/intro-bg.jpg',
            'images/stone-block.png',
            'images/water-block.png',
            'images/grass-block.png',
            'images/enemy-bug.png',

            'images/selector.png',
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png',

            'images/gem-blue.png',
            'images/gem-green.png',
            'images/gem-orange.png',
            'images/key.png',
            'images/heart.png',
            'images/rock.png',
            'images/star.png',

            'images/audio_unmuted.png',
            'images/audio_muted.png'
        ]);
        Resources.onReady(init);

        /* Assign the canvas' context object to the global variable (the window
         * object when run in a browser) so that developers can use it more easily
         * from within their app.js files.
         */
        global.ctx = ctx;
    };

    return Engine;
});
