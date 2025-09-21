// Authentication functionality
import { 
    auth, 
    db,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    collection,
    addDoc,
    isAdmin
} from './firebase.js';

// Setup authentication forms
export function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('registerSection').style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('registerSection').style.display = 'none';
            document.getElementById('loginSection').style.display = 'block';
        });
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showAlert('Login successful!', 'success');
        
        // Check if admin and redirect accordingly
        if (await isAdmin(email)) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed: ' + error.message, 'error');
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Add user to Firestore
        await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            email: email,
            name: name,
            role: 'customer',
            createdAt: new Date()
        });
        
        showAlert('Registration successful!', 'success');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed: ' + error.message, 'error');
    }
}

// Show alert
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '100px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
