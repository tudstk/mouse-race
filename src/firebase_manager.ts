import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';

export class FirebaseManager {
  firebaseApp:any;
  firestore:any;

  constructor(firebaseConfig:any) {
    this.firebaseApp = initializeApp(firebaseConfig);
    this.firestore = getFirestore(this.firebaseApp);
  }

  saveScoreToLeaderboard(name: string, score: number) {
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

  async displayLeaderboard() {
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
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const name = doc.data().name;
          const score = doc.data().score;
          const listItem = document.createElement('li');
          listItem.textContent = `${name}: ${score}`;
          leaderboardContainer.appendChild(listItem);
        });
      } catch (error) {
        console.error('Error getting leaderboard: ', error);
      }
    }
  }

}
