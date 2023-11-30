import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
import './dotenv'; 

  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "mouse-racer.firebaseapp.com",
    projectId: "mouse-racer",
    storageBucket: "mouse-racer.appspot.com",
    messagingSenderId: "206654446823",
    appId: "1:206654446823:web:75582baf9cb82599c29642",
    measurementId: "G-SHFM23W3QL"
  };


  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);
  const database = getDatabase(firebaseApp);

  class RandomElement {
    type: string;
    color: string;
    size: number;
    currentElement: HTMLElement | null;
    
  
    constructor(type: string, color: string, size: number) {
      this.type = type;
      this.color = color;
      this.size = size;
      this.currentElement = null;
    }
  
    disappear(collectedCallback: () => void, failedCallback: () => void) {
      if (this.currentElement) {
        this.currentElement.style.display = 'none';
        if (this.type === 'Collect') {
          collectedCallback();
        } else if (this.type === 'Avoid') {
          failedCallback();
        }
      }
    }
  
    changeBehavior(
      collectedCallback: () => void,
      failedCallback: () => void,
      isGameOver: () => boolean
    ) {
      console.log("I'M CHANGING!!");
      const intervalId = setInterval(() => {
        if (isGameOver()) {
          console.log("is game over? " + isGameOver());
          clearInterval(intervalId);
          return;
        }
  
        if (this.type === 'Collect') {
          this.type = 'Avoid';
          this.color = 'Red';
        } else {
          this.type = 'Collect';
          this.color = 'Green';
        }
  
        if (this.currentElement) {
          this.render(collectedCallback, failedCallback);
        }
      }, 2000);
    }
    
  
    render(collectedCallback: () => void, failedCallback: () => void) {
      const elementContainer = document.body;
      if (elementContainer) {
        if (!this.currentElement) {
          const elementDiv = document.createElement('div');
          elementDiv.className = 'game-element';
          elementDiv.style.width = this.size + 'px';
          elementDiv.style.height = this.size + 'px';
    
          elementDiv.style.borderRadius = this.type === 'Collect' ? '50%' : '0%';
  
          if(this.type === 'Change') {
            elementDiv.style.height = '60px';
          }
    
          elementDiv.addEventListener('click', () => {
            this.disappear(collectedCallback, failedCallback);
          });
    
          elementContainer.appendChild(elementDiv);
          this.currentElement = elementDiv;
        }
    
        this.currentElement.style.display = 'block';
        this.currentElement.style.backgroundColor = this.color;
    
        const randomTop = Math.floor(Math.random() * (document.body.offsetHeight - this.size));
        const randomLeft = Math.floor(Math.random() * (document.body.offsetWidth - this.size));
    
        this.currentElement.style.top = randomTop + 'px';
        this.currentElement.style.left = randomLeft + 'px';
      }
    }
    
  }

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
      }, 5000);
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
        collectedElement.innerHTML = `Green Elements: ${this.collectedCount}`;
      }
    }
  
    updateFailedCount() {
      const failedElement = document.getElementById('failed');
      if (failedElement) {
        failedElement.innerHTML = `Red Elements: ${this.failedCount}`;
      }
    }
  
    startTimer() {
        const intervalId = setInterval(() => {
          this.timer++;
          console.log("Time elapsed: " + this.timer );
          let timerElement = document.getElementById('timer');
    
          if (this.timer >= 5) {
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
        const totalScoreElement = document.getElementById('total-score');
  
        if (collectedElement && failedElement &&  totalScoreElement) {
          collectedElement.style.display = 'block';
          failedElement.style.display = 'block';
          totalScoreElement.style.display = 'block';
    
          collectedElement.innerHTML = `Green elements: ${this.collectedCount}`;
          failedElement.innerHTML = `Red elements: ${this.failedCount}`;
          totalScoreElement.innerHTML = `Total Score: ${(this.collectedCount - this.failedCount) * 1000}`;
          const nameInputContainer = document.getElementById('name-input-container');
          if (nameInputContainer) {
            nameInputContainer.style.display = 'block';
          }
        }
        
      }
  
    hideStartButton() {
      const startButton = document.querySelector('.start-button') as HTMLElement;
      if (startButton) {
        startButton.style.display = 'none';
      }
    }

    saveScoreToLeaderboard(name: string, score: number) {
      const leaderboardRef = collection(firestore, 'leaderboard');
      const statusElement = document.getElementById('status-message');
      addDoc(leaderboardRef, { name, score })
        .then((docRef) => {
          if (statusElement) {
            statusElement.textContent = 'Score submitted!';
          }
          console.log('Document written with ID: ', docRef.id);
        })
        .catch((error) => {
          if (statusElement) {
            statusElement.textContent = 'Error submitting score!';
          }
          console.error('Error adding document: ', error);
        });
    }

    async displayLeaderboard() {
      const leaderboardContainer = document.getElementById('leaderboard-list');
      const leaderboardHeading = document.getElementById('leaderboard-heading');
      if (leaderboardHeading) {
        leaderboardHeading.style.display = 'block';
      }

      if (leaderboardContainer) {
        leaderboardContainer.innerHTML = '';
  
        const leaderboardRef = collection(firestore, 'leaderboard');
        const q = query(leaderboardRef, orderBy('score', 'desc'), limit(3));
        
     
        try {
          const querySnapshot = await getDocs(q);
  
          querySnapshot.forEach((doc) => {
            const name = doc.data().name;
            console.log("name: " + name);
            const score = doc.data().score;
            console.log("score: " + score);
            const listItem = document.createElement('li');
            listItem.textContent = `${name}: ${score}`;
            leaderboardContainer.appendChild(listItem);
          });
        } catch (error) {
          console.error('Error getting leaderboard: ', error);
        }
      }
      else {
        console.log("leaderboard container not found");
      }
    }
  }

  function submitScore() {
    const playerNameInput = document.getElementById('player-name') as HTMLInputElement;
    if (playerNameInput) {
      const playerName = playerNameInput.value;
      game.saveScoreToLeaderboard(playerName, (game.collectedCount - game.failedCount) * 1000);
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
  