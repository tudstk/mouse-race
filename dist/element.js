"use strict";
var RandomElement = /** @class */ (function () {
    function RandomElement(type, color, size) {
        this.type = type;
        this.color = color;
        this.size = size;
        this.currentElement = null;
    }
    RandomElement.prototype.disappear = function (collectedCallback, failedCallback) {
        if (this.currentElement) {
            this.currentElement.style.display = 'none';
            if (this.type === 'Collect') {
                collectedCallback();
            }
            else if (this.type === 'Avoid') {
                failedCallback();
            }
        }
    };
    RandomElement.prototype.changeBehavior = function (collectedCallback, failedCallback, isGameOver // Callback to check if the game is over
    ) {
        var _this = this;
        console.log("changing behavior");
        var intervalId = setInterval(function () {
            if (isGameOver()) {
                console.log("is game over? " + isGameOver());
                clearInterval(intervalId); // Stop the interval if the game is over
                return;
            }
            if (_this.type === 'Collect') {
                _this.type = 'Avoid';
                _this.color = 'Red';
            }
            else {
                _this.type = 'Collect';
                _this.color = 'Green';
            }
            if (_this.currentElement) {
                _this.render(collectedCallback, failedCallback);
            }
        }, 2000);
    };
    RandomElement.prototype.render = function (collectedCallback, failedCallback) {
        var _this = this;
        var elementContainer = document.body;
        if (elementContainer) {
            if (!this.currentElement) {
                var elementDiv = document.createElement('div');
                elementDiv.className = 'game-element';
                elementDiv.style.width = this.size + 'px';
                elementDiv.style.height = this.size + 'px';
                elementDiv.style.borderRadius = this.type === 'Collect' ? '50%' : '0%';
                if (this.type === 'Change') {
                    elementDiv.style.height = '60px';
                }
                elementDiv.addEventListener('click', function () {
                    _this.disappear(collectedCallback, failedCallback);
                });
                elementContainer.appendChild(elementDiv);
                this.currentElement = elementDiv;
            }
            this.currentElement.style.display = 'block';
            this.currentElement.style.backgroundColor = this.color;
            var randomTop = Math.floor(Math.random() * (document.body.offsetHeight - this.size));
            var randomLeft = Math.floor(Math.random() * (document.body.offsetWidth - this.size));
            this.currentElement.style.top = randomTop + 'px';
            this.currentElement.style.left = randomLeft + 'px';
        }
    };
    return RandomElement;
}());
