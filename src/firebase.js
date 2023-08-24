import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'
const firebaseConfig = {
  apiKey: 'AIzaSyAuZhnQl09xDEtJm8CPq6CubRGlgGZVOdA',
  authDomain: 'soci-b0d19.firebaseapp.com',
  projectId: 'soci-b0d19',
  storageBucket: 'soci-b0d19.appspot.com',
  messagingSenderId: '804139684333',
  appId: '1:804139684333:web:042b43a52a5fd6452e17e4',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
export const db = getFirestore(app)
