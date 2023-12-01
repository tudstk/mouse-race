var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, limit, } from 'firebase/firestore';
export class FirebaseManager {
    constructor(firebaseConfig) {
        this.firebaseApp = initializeApp(firebaseConfig);
        this.firestore = getFirestore(this.firebaseApp);
    }
    saveScoreToLeaderboard(name, score) {
        const leaderboardRef = collection(this.firestore, 'leaderboard-time');
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
                const leaderboardRef = collection(this.firestore, 'leaderboard-time');
                const q = query(leaderboardRef, orderBy('score', 'asc'), limit(3));
                try {
                    const querySnapshot = yield getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const name = doc.data().name;
                        const score = doc.data().score;
                        const listItem = document.createElement('li');
                        listItem.textContent = `${name}: ${score}`;
                        leaderboardContainer.appendChild(listItem);
                    });
                }
                catch (error) {
                    console.error('Error getting leaderboard: ', error);
                }
            }
        });
    }
}
