import { Game } from './game';
function submitScore() {
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        const playerName = playerNameInput.value;
        game.firebaseManager.saveScoreToLeaderboard(playerName, game.finalScore);
        game.firebaseManager.displayLeaderboard();
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
