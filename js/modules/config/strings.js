define([], function () {

    /**
     * The game translation strings.
     *
     * @exports config/strings
     */
    var strings = {
        gameTitle: 'Udacity\'s  Frogger  Clone',
        menuNewGame: 'New Game',
        menuCredits: 'Credits',
        introHelp: [
            'M - mute/unmute game',
            'Up/Down keys or Mouse - select menu',
            'Enter or Mouse click - open menu'
        ],
        selectPlayerTitle: 'Select your player',
        selectPlayerHelp: [
            'M - mute/unmute game',
            'Left/Right keys or Mouse - select player',
            'Enter or Mouse click - choose player'
        ],
        gameHelp: [
            'M or Mouse click - mute/unmute game',
            'P - pause/unpause game',
            'Arrow keys - move player'
        ],
        gameStatusBarScore: 'Score: ',
        gameStatusBarLevel: 'Level: ',
        gamePaused: 'Game Paused',
        creditsTitle: 'Credits',
        credits: [
            'Programming:',
            'Saulo Toledo',

            'Game engine:',
            'Front-end Web Developer Nanodegree by Udacity (adapted by Saulo Toledo)',

            'Design:',
            'Front-end Web Developer Nanodegree by Udacity',
            'Intro Wallpaper downloaded from dws4.me',

            'Music and Sound FX:',
            'ViRiX (David Mckee) (adapted by Saulo Toledo)',
            'Game music by joshuaempyre (freesound.org)'
        ],
        generalReturnText: 'Press Enter or click to continue',
        congrats: 'Congratulations!',
        sorry: 'Sorry!',
        youWon: 'You won the game!',
        youLost: 'It was not this time :(',
        tryAgain: 'Let\'s try again?'
    };

    return strings;
});
