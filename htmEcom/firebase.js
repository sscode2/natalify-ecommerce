// Firebase Configuration
// Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyC91llcT7Vj-Id24g0y0TqCqa3Wj3eJi50",
    authDomain: "rxfy-c42d2.firebaseapp.com",
    databaseURL: "https://rxfy-c42d2-default-rtdb.firebaseio.com",
    projectId: "rxfy-c42d2",
    storageBucket: "rxfy-c42d2.firebasestorage.app",
    messagingSenderId: "987347327014",
    appId: "1:987347327014:web:1f9567cf270cc2d4b02ee7",
    measurementId: "G-9H8M4E5RYT"
  };

// For production, you can also use environment-based config
// const firebaseConfig = {
//     apiKey: window.location.hostname === 'localhost' ? 'dev-api-key' : 'prod-api-key',
//     authDomain: "natalify-ecommerce.firebaseapp.com",
//     projectId: "natalify-ecommerce",
//     storageBucket: "natalify-ecommerce.appspot.com",
//     messagingSenderId: "123456789",
//     appId: "1:123456789:web:abcdef123456"
// };

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Export Firebase functions for use in other files
export {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
};

// Admin email (change this to your admin email)
export const ADMIN_EMAIL = 'admin@natalify.com';

// Initialize admin user if not exists
export const initializeAdmin = async () => {
    try {
        // Check if admin exists
        const adminQuery = query(collection(db, 'users'), where('email', '==', ADMIN_EMAIL));
        const adminSnapshot = await getDocs(adminQuery);
        
        if (adminSnapshot.empty) {
            // Create admin user document
            await addDoc(collection(db, 'users'), {
                email: ADMIN_EMAIL,
                role: 'admin',
                name: 'Admin',
                createdAt: new Date()
            });
            console.log('Admin user initialized');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};

// Check if user is admin
export const isAdmin = async (userEmail) => {
    try {
        const adminQuery = query(collection(db, 'users'), where('email', '==', userEmail), where('role', '==', 'admin'));
        const adminSnapshot = await getDocs(adminQuery);
        return !adminSnapshot.empty;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};
