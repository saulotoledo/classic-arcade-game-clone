define(['config/config', 'config/strings', 'ui/stage'], function (config, strings, StageUI) {

    /**
     * Handle the Credits UI.
     */
    var ReturnableUI = function (canvas, ctx, game, stageTitle, music) {
        StageUI.call(this, canvas, ctx, game);

        this.stageTitle = stageTitle;

        this.music = music;

        this.backgroundImage = 'images/intro-bg.jpg';

        var self = this;
        this.keyUpEvent = function (evt) {
            if (evt.keyCode === 13) { // Enter
                self.returnToTintro();
            }
        };

        this.mouseDownListener = function () {
            self.returnToTintro();
        };

        document.addEventListener('keyup', this.keyUpEvent);

        this.canvas.addEventListener('mousedown', this.mouseDownListener);

        this.drawBasicStage();
    };

    ReturnableUI.prototype = Object.create(StageUI.prototype);
    ReturnableUI.prototype.constructor = ReturnableUI;

    ReturnableUI.prototype.drawBasicStage = function () {

        if (typeof this.music !== 'undefined' && this.music !== null) {
            this.game.audioControl.playSound(this.music);
        }

        this.drawBackground();

        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fill();

        this.drawDetachedText(
            this.stageTitle,
            config.GENERAL_TITLE_FONT,
            'center',
            'white',
            'black',
            this.canvas.width / 2,
            config.GENERAL_TITLE_TOP_Y_POS
        );

        this.drawDetachedText(
            strings.generalReturnText,
            config.GENERAL_RETURN_FONT,
            'center',
            'orange',
            'black',
            this.canvas.width / 2,
            config.GENERAL_RETURN_Y_POS,
            true
        );
    };

    ReturnableUI.prototype.close = function () {
        StageUI.prototype.close.call(this);

        if (document.removeEventListener) { // For all major browsers, except IE 8 and earlier
            document.removeEventListener('keyup', this.keyUpEvent);
            this.canvas.removeEventListener('mousedown', this.mouseDownListener);
        } else if (document.detachEvent) { // For IE 8 and earlier versions
            document.detachEvent("onkeyup", this.keyUpEvent);
            this.canvas.detachEvent("onmousedown", this.mouseDownListener);
        }
    };

    ReturnableUI.prototype.returnToTintro = function () {
        this.game.audioControl.playSound('backToIntro');
        this.game.currentScene = this.game.scenes.intro;
    };

    return ReturnableUI;
});
