class Game {
  elements: RandomElement[];
  timer: number;
  collectedCount: number;
  failedCount: number;
  gameOver: boolean;

  constructor() {
    this.elements = [];
    this.timer = 0;
    this.collectedCount = 0;
    this.failedCount = 0;
    this.gameOver = false;
  }

  start() {
    this.timer = 0;
    this.collectedCount = 0;
    this.failedCount = 0;
    this.generateElements();
    this.displayElements();
    this.startTimer();
    this.hideStartButton();
    console.log("salut");
  }

  generateElements() {
    for (let i = 0; i < 15; i++) {
      this.elements.push(new RandomElement('Collect', 'Green', this.getRandomSize()));
      this.elements.push(new RandomElement('Avoid', 'Red', this.getRandomSize()));
      const changeElement = new RandomElement('Change', 'Red', this.getRandomSize());
      this.elements.push(changeElement);
  
      changeElement.changeBehavior(
        () => {
          this.collectedCount++;
          this.updateCollectedCount();
        },
        () => {
          this.failedCount++;
          this.updateFailedCount();
        },
        () => this.gameOver
      );
    }
    setTimeout(() => {
      this.gameOver = true;
    }, 30000);
  }
  
  getRandomSize(): number {
    return Math.floor(Math.random() * (40 - 10 + 1) + 10);
  }
  displayElements() {
    const elementContainer = document.getElementById('elements-container');
    if (elementContainer) {
      elementContainer.innerHTML = '';
    }

    this.elements.forEach((element) => {
      element.render(
        () => {
          this.collectedCount++;
          this.updateCollectedCount();
        },
        () => {
          this.failedCount++;
          this.updateFailedCount();
        }
      );
    });

    console.log("Elements displayed on the screen");
  }

  updateCollectedCount() {
    const collectedElement = document.getElementById('collected');
    if (collectedElement) {
      collectedElement.innerHTML = `COLLECTED: ${this.collectedCount}`;
    }
  }

  updateFailedCount() {
    const failedElement = document.getElementById('failed');
    if (failedElement) {
      failedElement.innerHTML = `FAILED: ${this.failedCount}`;
    }
  }

  startTimer() {
      const intervalId = setInterval(() => {
        this.timer++;
        console.log("Time elapsed: " + this.timer );
        let timerElement = document.getElementById('timer');
  
        if (this.timer >= 30) {
          clearInterval(intervalId);
  
          this.hideGameElements();
          this.displayCounts();

          if (timerElement) {
            timerElement.innerHTML = "Finished";
          }
        } else {
          if (timerElement) {
            timerElement.innerHTML = this.timer.toString();
          }
        }
      }, 1000);
    }
  
    hideGameElements() {
      this.elements.forEach((element) => {
        if (element.currentElement) {
          element.currentElement.style.display = 'none';
        }
      });
    }
  
    displayCounts() {
      const collectedElement = document.getElementById('collected');
      const failedElement = document.getElementById('failed');
  
      if (collectedElement && failedElement) {
        collectedElement.style.display = 'block';
        failedElement.style.display = 'block';
  
        collectedElement.innerHTML = `COLLECTED: ${this.collectedCount}`;
        failedElement.innerHTML = `FAILED: ${this.failedCount}`;
      }
    }

  hideStartButton() {
    const startButton = document.querySelector('.start-button') as HTMLElement;
    if (startButton) {
      startButton.style.display = 'none';
    }
  }
}