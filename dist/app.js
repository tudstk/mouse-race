"use strict";
var game = new Game();
var startButton = document.querySelector('.start-button');
if (startButton) {
    startButton.addEventListener('click', function () {
        game.start();
    });
}
