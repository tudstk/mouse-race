import { Game } from './game';
function submitScore() {
    const playerNameInput = document.getElementById('player-name');
    const timeElement = document.getElementById('timer');
    if (timeElement) {
        console.log("FINALTIMEEERRRR", timeElement.textContent);
    }
    if (playerNameInput) {
        const playerName = playerNameInput.value;
        game.saveScoreToLeaderboard(playerName, game.finalScore);
        game.displayLeaderboard();
    }
}
const submitButtonElement = document.getElementById("submit-score");
if (submitButtonElement) {
    submitButtonElement.addEventListener('click', () => {
        submitScore();
    });
}
const game = new Game();
const startButton = document.querySelector('.start-button');
if (startButton) {
    startButton.addEventListener('click', () => {
        game.start();
    });
}
