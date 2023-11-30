import { Game } from './game';

function submitScore() {
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    const timeElement = document.getElementById('timer') as HTMLElement;
    if(timeElement) {
        console.log("FINALTIMEEERRRR", timeElement.textContent);
    }
    if (playerNameInput) {
      const playerName = playerNameInput.value;
      game.saveScoreToLeaderboard(playerName,  game.finalScore);
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