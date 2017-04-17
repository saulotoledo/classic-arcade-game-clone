/**
 * A module to control the audio system.
 *
 * @module misc/audio-control
 */
define(['config/config'], function (config) {

    /**
     * Creates a new instance of the game audio control object,
     * defiining two audio channels for the game, one for
     * background music, in loop by default, and another for
     * general and faster sounds.
     *
     * @constructor
     * @alias module:misc/audio-control
     * @param {Game} game The game control object.
     */
    var AudioControl = function (game) {

        /**
         * The game control object.
         *
         * @type {Game}
         */
        this.game = game;

        /**
         * The game audio list. Points to real audio files.
         *
         * @type {object}
         */
        this.audioList = {
            selectionChange: 'audio/menu_pick_alt.wav',
            selectionAccept: 'audio/menu_a_select.wav',
            playerLostLife: 'audio/alert_error.wav',
            playerReachesWater: 'audio/menu_a_select.wav',
            pickItem: 'audio/etra.wav',
            backToIntro: 'audio/menu_a_back.wav',
            gameWon: 'audio/message_b_accept.wav',
            gameLost: 'audio/message_b_decline.wav',
            mainMusic: 'audio/arcade_music_loop.wav'
        };

        /**
         * An audio channel for game sounds.
         *
         * @type {?Audio}
         */
        this.audioChannel1 = null;

        /**
         * An audio channel for background music. It plays on
         * loop by default.
         *
         * @type {?Audio}
         */
        this.audioChannel2 = null;

        /**
         * Stores the current background music forplay/pause/stop control
         * in several stages.
         *
         * @type {?string}
         */
        this.currentBackgroundMusic = null;

        /**
         * The ID of a timeout used to control the tentatives to replace an
         * audio in a channel. An attempt may be made to change an audio in
         * a channel before the previous one begins to execute, throwing the
         * error "Uncaught (in promise) DOMException: The play() request was
         * interrupted by a call to pause().". A timeout is used to control
         * the interval between the tentatives, reducing the chances of the
         * error occurs. Only one timeout to do this task should exists, and
         * it is controlled by this variable.
         *
         * @type {?number}
         */
        this.audioTimeout = null;

        var self = this;

        /**
         * The ID of an interval used to control the state of the music, pausing
         * or stopping it if the user pause or mute the game.
         *
         * @type {number}
         */
        this.bgMusicCheckerInterval = setInterval(function () {
            if (self.game.isMute) {
                self.stopBackgroundMusic();
            } else {
                if (self.game.isPaused) {
                    self.pauseBackgroundMusic();
                } else {
                    if (self.audioChannel2) {
                        self.continueBackgroundMusic();
                    } else if (self.currentBackgroundMusic) {
                        self.playBackgroundMusic(self.currentBackgroundMusic);
                    }
                }
            }
        }, 200);
    };

    /**
     * Play a sound (on channel 1) if the game is not muded.
     * 
     * @param {string} audioId One of the keys of AudioControl#audioList.
     */
    AudioControl.prototype.playSound = function (audioId) {
        this.play(audioId, 1);
    };

    /**
     * Play a sound as a background music (a sound on channel 2 in loop
     * by default) if the game is not muded.
     * 
     * @param {string} audioId One of the keys of AudioControl#audioList.
     */
    AudioControl.prototype.playBackgroundMusic = function (audioId) {
        this.currentBackgroundMusic = audioId;
        this.play(audioId, 2, true);
    };

    /**
     * Pauses the background music.
     */
    AudioControl.prototype.pauseBackgroundMusic = function () {
        if (this.audioChannel2) {
            this.audioChannel2.pause();
        }
    };

    /**
     * Continues a paused background music, if exists.
     * If the music was not played before, it is started.
     */
    AudioControl.prototype.continueBackgroundMusic = function () {
        if (this.audioChannel2) {
            this.audioChannel2.play();
        }
    };

    /**
     * Stops the background music if the game is not muded.
     */
    AudioControl.prototype.stopBackgroundMusic = function () {
        if (this.audioChannel2) {
            this.audioChannel2.pause();
            this.audioChannel2.currentTime = 0;
            this.audioChannel2 = null;
        }
    };

    /**
     * Play a sound on a channel if the game is not muded. Should not be used
     * directly.
     * 
     * @param {string} audioId One of the keys of AudioControl#audioList.
     * @param {integer} [channel=1] The number of the channel. Should be 1 or 2.
     *        Any value less than zero or invalid will be treated as 1, and
     *        any value greater than 2 will be treated as 2.
     * @param {boolean} [loop=false] Defines if the audio should be played on loop.
     * @see AudioControl.playSound
     * @see AudioControl.playBackgroundMusic
     */
    AudioControl.prototype.play = function (audioId, channel, loop) {

        if (!channel || channel < 0) {
            channel = 1;
        }

        if (channel > 2) {
            channel = 2;
        }

        if (!loop) {
            loop = false;
        }

        if (!this.game.isMute) {

            var self = this;

            var _playAudio = function () {
                self['audioChannel' + channel] = new Audio(self.audioList[audioId]);
                self['audioChannel' + channel].loop = loop;
                self['audioChannel' + channel].play();
            };

            var _replaceAudio = function () {
                // Stopping the old audio:
                self['audioChannel' + channel].pause();
                self['audioChannel' + channel].currentTime = 0;
                self['audioChannel' + channel] = null;

                // Playing the new audio:
                _playAudio();
            };

            // If the audio channel is busy
            if (self['audioChannel' + channel] !== null) {

                // if the previous audio already ended, we can replace it:
                if (self['audioChannel' + channel].ended) {
                    _replaceAudio();

                } else { // If the audio has not ended

                    // we need to check the "readyState" of the object to prevent the error
                    // "Uncaught (in promise) DOMException: The play() request was interrupted by a call to pause()." 
                    if (self['audioChannel' + channel].readyState == 4) { // 4 = HAVE_ENOUGH_DATA

                        // in order to do that, we need to have only one timeout to prevent
                        // multiple audio executions and freeze the browser:
                        if (self.audioTimeout === null) {
                            self.audioTimeout = setTimeout(function () {
                                _replaceAudio();
                                clearTimeout(self.audioTimeout);
                                self.audioTimeout = null;
                            }, 150);
                        }
                    }
                }

            } else { // If the audio channel is free, we cna play the audio:
                _playAudio();
            }
        }

    };

    return AudioControl;
});
