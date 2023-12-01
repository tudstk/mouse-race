import { RandomElement } from "./element";
import { FirebaseManager } from "./firebase_manager";

const firebaseConfig = {
    apiKey: "secret",
    authDomain: "mouse-racer.firebaseapp.com",
    projectId: "mouse-racer",
    storageBucket: "mouse-racer.appspot.com",
    messagingSenderId: "206654446823",
    appId: "1:206654446823:web:75582baf9cb82599c29642",
    measurementId: "G-SHFM23W3QL"
  };


export class Game {
  elements: RandomElement[];
  timer: number;
  collectedCount: number;
  failedCount: number;
  isGameOver: boolean;
  finalScore: number;
  firebaseManager:any;

  constructor() {
    this.elements = [];
    this.timer = 0;
    this.collectedCount = 0;
    this.failedCount = 0;
    this.isGameOver = false;
    this.finalScore = 0;
    this.firebaseManager = new FirebaseManager(firebaseConfig);
  }

    start() {
      this.timer = 0;
      this.collectedCount = 0;
      this.failedCount = 0;
      this.generateElements();
      this.displayElements();
      this.startTimer();
      this.hideStartButton();
    }

    getRandomSize(): number {
      return Math.floor(Math.random() * (70 - 10 + 1) + 10);
    }

    generateElements() {
      for (let i = 0; i < 10; i++) {
        this.elements.push(new RandomElement('Collect', 'Green', this.getRandomSize(), this));
        this.elements.push(new RandomElement('Avoid', 'Red', this.getRandomSize(),this));
        const changeElement = new RandomElement('Change', 'Red', this.getRandomSize(),this);
        this.elements.push(changeElement);
        changeElement.changeBehavior()
      }
    }

    endGame() {
        this.isGameOver = true;

        const remainingElements = this.elements.filter(
            (element) => element.type === 'Collect' || element.type === 'Change'
          );
      
          if (remainingElements.length === 0) {
            clearInterval(this.timer); 
            this.finalScore = this.timer;
            this.hideGameElements();
            this.displayInput();
          }

        clearInterval(this.timer);

        this.hideGameElements();
        this.displayInput();

        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerHTML = this.timer + ' seconds';
        }

        this.firebaseManager.displayLeaderboard();
    }

    displayElements() {
        const elementContainer = document.getElementById('elements-container');
        if (elementContainer) {
          elementContainer.innerHTML = '';
        }

        this.elements.forEach((element) => {
          element.render(
            () => this.collectedCount++
          );
        });

        const remainingAvoidElements = this.elements.filter(
          (element) => element.type === 'Avoid'
      );
      if (this.isGameOver && remainingAvoidElements.length > 0) {
          remainingAvoidElements.forEach((element) => {
              if (element.currentElement) {
                  element.currentElement.style.display = 'none';
              }
          });
      }
    }

    startTimer() {
        const intervalId = setInterval(() => {
          this.timer++;
        }, 1000);
    }

    hideGameElements() {
      this.elements.forEach((element) => {
        if (element.currentElement) {
          element.currentElement.style.display = 'none';
        }
      });
    }

    displayInput() {
      const nameInputContainer = document.getElementById('name-input-container');
        if (nameInputContainer) {
          nameInputContainer.style.display = 'block';
        }
    }

    hideStartButton() {
      const startButton = document.querySelector('.start-button') as HTMLElement;
      if (startButton) {
        startButton.style.display = 'none';
      }
    }
  }


