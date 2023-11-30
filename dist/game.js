var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RandomElement } from "./element";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAJV3VIxPK2yz2foZK7Hw4yUtN87wPvlFU",
    authDomain: "mouse-racer.firebaseapp.com",
    projectId: "mouse-racer",
    storageBucket: "mouse-racer.appspot.com",
    messagingSenderId: "206654446823",
    appId: "1:206654446823:web:75582baf9cb82599c29642",
    measurementId: "G-SHFM23W3QL"
};
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
export class Game {
    constructor() {
        this.elements = [];
        this.timer = 0;
        this.collectedCount = 0;
        this.failedCount = 0;
        this.collectedGreenChangeables = 0;
        this.collectedRedChangeables = 0;
        this.isGameOver = false;
        this.finalScore = 0;
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
    getRandomSize() {
        return Math.floor(Math.random() * (70 - 10 + 1) + 10);
    }
    generateElements() {
        for (let i = 0; i < 5; i++) {
            this.elements.push(new RandomElement('Collect', 'Green', this.getRandomSize(), this));
            this.elements.push(new RandomElement('Avoid', 'Red', this.getRandomSize(), this));
            const changeElement = new RandomElement('Change', 'Red', this.getRandomSize(), this);
            this.elements.push(changeElement);
            changeElement.changeBehavior(() => {
                this.collectedCount++;
                this.updateCollectedCount();
            }, () => {
                this.failedCount++;
                this.updateFailedCount();
            });
        }
    }
    endGame() {
        this.isGameOver = true;
        const remainingElements = this.elements.filter((element) => element.type === 'Collect' || element.type === 'Change');
        console.log("REMAINING ELEMENTS: " + remainingElements);
        if (remainingElements.length === 0) {
            console.log("SALUUUUT");
            clearInterval(this.timer);
            this.finalScore = this.timer;
            this.hideGameElements();
            this.displayCounts();
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.innerHTML = 'Victory!';
            }
        }
        clearInterval(this.timer);
        this.hideGameElements();
        this.displayCounts();
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerHTML = this.timer + ' seconds';
        }
        this.displayLeaderboard();
    }
    displayElements() {
        const elementContainer = document.getElementById('elements-container');
        if (elementContainer) {
            elementContainer.innerHTML = '';
        }
        this.elements.forEach((element) => {
            element.render(() => {
                this.collectedCount++;
                this.updateCollectedCount();
            }, () => {
                console.log("smths");
            });
        });
        console.log("Elements displayed on the screen");
        const remainingAvoidElements = this.elements.filter((element) => element.type === 'Avoid');
        if (this.isGameOver && remainingAvoidElements.length > 0) {
            remainingAvoidElements.forEach((element) => {
                if (element.currentElement) {
                    element.currentElement.style.display = 'none';
                }
            });
        }
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
            console.log("Time elapsed: " + this.timer + " seconds");
            let timerElement = document.getElementById('timer');
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
        const nameInputContainer = document.getElementById('name-input-container');
        if (nameInputContainer) {
            nameInputContainer.style.display = 'block';
        }
    }
    hideStartButton() {
        const startButton = document.querySelector('.start-button');
        if (startButton) {
            startButton.style.display = 'none';
        }
    }
    saveScoreToLeaderboard(name, score) {
        const leaderboardRef = collection(firestore, 'leaderboard-time');
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
    displayLeaderboard() {
        return __awaiter(this, void 0, void 0, function* () {
            const leaderboardContainer = document.getElementById('leaderboard-list');
            const leaderboardHeading = document.getElementById('leaderboard-heading');
            if (leaderboardHeading) {
                leaderboardHeading.style.display = 'block';
            }
            if (leaderboardContainer) {
                leaderboardContainer.innerHTML = '';
                const leaderboardRef = collection(firestore, 'leaderboard-time');
                const q = query(leaderboardRef, orderBy('score', 'asc'), limit(3));
                try {
                    const querySnapshot = yield getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const name = doc.data().name;
                        console.log("name: " + name);
                        const score = doc.data().score;
                        console.log("score: " + score);
                        const listItem = document.createElement('li');
                        listItem.textContent = `${name}: ${score}`;
                        leaderboardContainer.appendChild(listItem);
                    });
                }
                catch (error) {
                    console.error('Error getting leaderboard: ', error);
                }
            }
            else {
                console.log("leaderboard container not found");
            }
        });
    }
}
