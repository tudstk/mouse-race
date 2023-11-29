  const game = new Game();
  const startButton = document.querySelector('.start-button');
  
  if (startButton) {
    startButton.addEventListener('click', () => {
      game.start();
    });
  }
  