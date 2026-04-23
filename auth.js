// ===== SYSTÈME D'AUTHENTIFICATION PAR CODE D'ACCÈS =====

const firebaseConfig = {
  apiKey: "AIzaSyAWHRnVQhAsbb_H_e-H45zt3WnFNxAGs3I",
  authDomain: "mrmega-461f4.firebaseapp.com",
  projectId: "mrmega-461f4",
  storageBucket: "mrmega-461f4.firebasestorage.app",
  messagingSenderId: "639847002047",
  appId: "1:639847002047:web:6f672e21a4f900f1b6bb0a",
  measurementId: "G-7190PC461Y"
};

// Initialiser Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Vérifier si l'utilisateur est authentifié
function checkAuthentication() {
    const accessToken = localStorage.getItem('stockmr_access_token');
    
    if (!accessToken) {
        showLoginPage();
        return false;
    }
    
    // Vérifier que le token est valide
    verifyAccessToken(accessToken);
    return true;
}

// Afficher la page de connexion
function showLoginPage() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(120deg, #23272b 0%, #b71c1c 100%);
            font-family: 'Segoe UI', Arial, sans-serif;
        ">
            <div style="
                background: white;
                padding: 3em;
                border-radius: 16px;
                box-shadow: 0 12px 48px rgba(183, 28, 28, 0.3);
                max-width: 400px;
                width: 90%;
                text-align: center;
            ">
                <h1 style="color: #b71c1c; margin-bottom: 0.5em;">🚗 Stock MR</h1>
                <p style="color: #666; margin-bottom: 2em;">Gestion du stock et des factures</p>
                
                <div style="margin-bottom: 1.5em;">
                    <label style="display: block; text-align: left; margin-bottom: 0.5em; font-weight: 500;">Code d'accès</label>
                    <input 
                        type="text" 
                        id="access-code-input" 
                        placeholder="Entrez votre code d'accès"
                        style="
                            width: 100%;
                            padding: 0.8em;
                            border: 2px solid #b71c1c;
                            border-radius: 8px;
                            font-size: 1em;
                            box-sizing: border-box;
                        "
                        onkeypress="if(event.key === 'Enter') validateAccessCode()"
                    >
                </div>
                
                <button 
                    onclick="validateAccessCode()"
                    style="
                        width: 100%;
                        padding: 0.8em;
                        background: #b71c1c;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 1em;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.2s;
                    "
                    onmouseover="this.style.background = '#d32f2f'"
                    onmouseout="this.style.background = '#b71c1c'"
                >
                    Accéder à l'application
                </button>
                
                <div id="error-message" style="
                    margin-top: 1em;
                    color: #e74c3c;
                    font-size: 0.9em;
                    display: none;
                "></div>
                
                <p style="
                    margin-top: 2em;
                    font-size: 0.85em;
                    color: #999;
                ">
                    Si vous n'avez pas de code d'accès, contactez l'administrateur.
                </p>
            </div>
        </div>
    `;
    
    // Focus sur le champ de saisie
    setTimeout(() => {
        const input = document.getElementById('access-code-input');
        if (input) input.focus();
    }, 100);
}

// Valider le code d'accès
async function validateAccessCode() {
    const code = document.getElementById('access-code-input').value.trim();
    const errorDiv = document.getElementById('error-message');
    
    if (!code) {
        errorDiv.textContent = 'Veuillez entrer un code d\'accès';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const snapshot = await db.collection('accessCodes').where('code', '==', code).get();
        
        if (snapshot.empty) {
            errorDiv.textContent = 'Code d\'accès invalide';
            errorDiv.style.display = 'block';
            return;
        }
        
        const accessCodeDoc = snapshot.docs[0];
        
        // Marquer le code comme utilisé
        await db.collection('accessCodes').doc(accessCodeDoc.id).update({
            used: true,
            usedAt: new Date()
        });
        
        // Stocker le token
        const token = 'token_' + Math.random().toString(36).substr(2, 20);
        localStorage.setItem('stockmr_access_token', token);
        localStorage.setItem('stockmr_access_code', code);
        
        // Rediriger vers l'application
        location.reload();
        
    } catch (error) {
        console.error('Erreur lors de la validation:', error);
        errorDiv.textContent = 'Erreur lors de la vérification. Veuillez réessayer.';
        errorDiv.style.display = 'block';
    }
}

// Vérifier si le token est valide
async function verifyAccessToken(token) {
    // Cette fonction peut être améliorée pour vérifier le token dans Firestore
    // Pour l'instant, on fait confiance au localStorage
    return true;
}

// Déconnexion
function logout() {
    localStorage.removeItem('stockmr_access_token');
    localStorage.removeItem('stockmr_access_code');
    location.reload();
}

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que Firebase soit initialisé
    setTimeout(() => {
        if (!checkAuthentication()) {
            // Empêcher le chargement du reste de l'application
            document.body.style.display = 'none';
        }
    }, 500);
});
