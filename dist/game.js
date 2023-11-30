"use strict";
var Game = /** @class */ (function () {
    function Game() {
        this.elements = [];
        this.timer = 0;
        this.collectedCount = 0;
        this.failedCount = 0;
        this.gameOver = false;
    }
    Game.prototype.start = function () {
        this.timer = 0;
        this.collectedCount = 0;
        this.failedCount = 0;
        this.generateElements();
        this.displayElements();
        this.startTimer();
        this.hideStartButton();
        console.log("salut");
    };
    Game.prototype.generateElements = function () {
        var _this = this;
        for (var i = 0; i < 15; i++) {
            this.elements.push(new RandomElement('Collect', 'Green', this.getRandomSize()));
            this.elements.push(new RandomElement('Avoid', 'Red', this.getRandomSize()));
            var changeElement = new RandomElement('Change', 'Red', this.getRandomSize());
            this.elements.push(changeElement);
            changeElement.changeBehavior(function () {
                _this.collectedCount++;
                _this.updateCollectedCount();
            }, function () {
                _this.failedCount++;
                _this.updateFailedCount();
            }, function () { return _this.gameOver; });
        }
        setTimeout(function () {
            _this.gameOver = true;
        }, 30000);
    };
    Game.prototype.getRandomSize = function () {
        return Math.floor(Math.random() * (40 - 10 + 1) + 10);
    };
    Game.prototype.displayElements = function () {
        var _this = this;
        var elementContainer = document.getElementById('elements-container');
        if (elementContainer) {
            elementContainer.innerHTML = '';
        }
        this.elements.forEach(function (element) {
            element.render(function () {
                _this.collectedCount++;
                _this.updateCollectedCount();
            }, function () {
                _this.failedCount++;
                _this.updateFailedCount();
            });
        });
        console.log("Elements displayed on the screen");
    };
    Game.prototype.updateCollectedCount = function () {
        var collectedElement = document.getElementById('collected');
        if (collectedElement) {
            collectedElement.innerHTML = "COLLECTED: ".concat(this.collectedCount);
        }
    };
    Game.prototype.updateFailedCount = function () {
        var failedElement = document.getElementById('failed');
        if (failedElement) {
            failedElement.innerHTML = "FAILED: ".concat(this.failedCount);
        }
    };
    Game.prototype.startTimer = function () {
        var _this = this;
        var intervalId = setInterval(function () {
            _this.timer++;
            console.log("Time elapsed: " + _this.timer);
            var timerElement = document.getElementById('timer');
            if (_this.timer >= 30) {
                clearInterval(intervalId);
                _this.hideGameElements();
                _this.displayCounts();
                if (timerElement) {
                    timerElement.innerHTML = "Finished";
                }
            }
            else {
                if (timerElement) {
                    timerElement.innerHTML = _this.timer.toString();
                }
            }
        }, 1000);
    };
    Game.prototype.hideGameElements = function () {
        this.elements.forEach(function (element) {
            if (element.currentElement) {
                element.currentElement.style.display = 'none';
            }
        });
    };
    Game.prototype.displayCounts = function () {
        var collectedElement = document.getElementById('collected');
        var failedElement = document.getElementById('failed');
        if (collectedElement && failedElement) {
            collectedElement.style.display = 'block';
            failedElement.style.display = 'block';
            collectedElement.innerHTML = "COLLECTED: ".concat(this.collectedCount);
            failedElement.innerHTML = "FAILED: ".concat(this.failedCount);
        }
    };
    Game.prototype.hideStartButton = function () {
        var startButton = document.querySelector('.start-button');
        if (startButton) {
            startButton.style.display = 'none';
        }
    };
    return Game;
}());
