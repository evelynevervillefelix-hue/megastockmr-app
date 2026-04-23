// ===== CONFIGURATION VISUELLE ET PERSONNALISATION =====

// Configuration de l'application
let appConfig = {
    companyName: 'Stock MR',
    logoUrl: 'mr_auto_logo.svg',
    primaryColor: '#b71c1c',
    secondaryColor: '#23272b',
    currency: 'CAD'
};

// Charger la configuration depuis Firestore
async function loadAppConfig() {
    try {
        const doc = await db.collection('config').doc('app').get();
        if (doc.exists) {
            appConfig = { ...appConfig, ...doc.data() };
            applyConfigToUI();
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
    }
}

// Appliquer la configuration à l'interface
function applyConfigToUI() {
    // Mettre à jour le titre
    document.title = `${appConfig.companyName} - Gestion de Véhicules`;
    
    // Mettre à jour le logo
    const logoImg = document.querySelector('.fiat-logo');
    if (logoImg && appConfig.logoUrl) {
        logoImg.src = appConfig.logoUrl;
    }
    
    // Mettre à jour les couleurs CSS
    const root = document.documentElement;
    root.style.setProperty('--primary-color', appConfig.primaryColor);
    root.style.setProperty('--secondary-color', appConfig.secondaryColor);
    
    // Mettre à jour le nom de l'entreprise dans l'en-tête
    const h1 = document.querySelector('header h1');
    if (h1) {
        h1.textContent = `🚗 ${appConfig.companyName}`;
    }
}

// Sauvegarder la configuration
async function saveAppConfig(config) {
    try {
        await db.collection('config').doc('app').set(config);
        appConfig = config;
        applyConfigToUI();
        alert('Configuration sauvegardée avec succès!');
    } catch (error) {
        alert('Erreur lors de la sauvegarde: ' + error.message);
    }
}

// Ajouter une section de configuration visuelle au panel admin
function renderConfigurationVisuelle() {
    const content = document.getElementById('admin-config-section');
    if (!content) {
        // Créer la section si elle n'existe pas
        const adminPanel = document.getElementById('admin');
        if (!adminPanel) return;
        
        const section = document.createElement('div');
        section.className = 'admin-block';
        section.id = 'admin-config-section';
        section.innerHTML = '<h3>🎨 Configuration Visuelle</h3><div id="config-content"></div>';
        adminPanel.appendChild(section);
    }
    
    const configContent = document.getElementById('config-content');
    if (!configContent) return;
    
    let html = `
        <div style="display: flex; flex-direction: column; gap: 1em;">
            <div>
                <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">Nom de l'entreprise</label>
                <input type="text" id="config-company-name" value="${appConfig.companyName}" style="width: 100%; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
            </div>
            
            <div>
                <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">URL du logo</label>
                <input type="text" id="config-logo-url" value="${appConfig.logoUrl}" style="width: 100%; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
                <small style="color: #666;">Chemin du fichier logo (ex: mr_auto_logo.jpg)</small>
            </div>
            
            <div>
                <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">Couleur primaire</label>
                <div style="display: flex; gap: 0.5em;">
                    <input type="color" id="config-primary-color" value="${appConfig.primaryColor}" style="width: 60px; height: 40px; border: 2px solid #ddd; border-radius: 4px; cursor: pointer;">
                    <input type="text" id="config-primary-color-text" value="${appConfig.primaryColor}" style="flex: 1; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px; font-family: monospace;">
                </div>
            </div>
            
            <div>
                <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">Couleur secondaire</label>
                <div style="display: flex; gap: 0.5em;">
                    <input type="color" id="config-secondary-color" value="${appConfig.secondaryColor}" style="width: 60px; height: 40px; border: 2px solid #ddd; border-radius: 4px; cursor: pointer;">
                    <input type="text" id="config-secondary-color-text" value="${appConfig.secondaryColor}" style="flex: 1; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px; font-family: monospace;">
                </div>
            </div>
            
            <div>
                <label style="display: block; margin-bottom: 0.3em; font-weight: 500;">Devise</label>
                <select id="config-currency" style="width: 100%; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
                    <option value="CAD" ${appConfig.currency === 'CAD' ? 'selected' : ''}>CAD (Dollar Canadien)</option>
                    <option value="USD" ${appConfig.currency === 'USD' ? 'selected' : ''}>USD (Dollar Américain)</option>
                    <option value="EUR" ${appConfig.currency === 'EUR' ? 'selected' : ''}>EUR (Euro)</option>
                </select>
            </div>
            
            <button class="btn btn-primary" onclick="saveConfigurationVisuelle()" style="width: 100%; margin-top: 1em;">💾 Enregistrer la configuration</button>
        </div>
    `;
    
    configContent.innerHTML = html;
    
    // Ajouter les event listeners pour la synchronisation des couleurs
    const primaryColorInput = document.getElementById('config-primary-color');
    const primaryColorText = document.getElementById('config-primary-color-text');
    const secondaryColorInput = document.getElementById('config-secondary-color');
    const secondaryColorText = document.getElementById('config-secondary-color-text');
    
    if (primaryColorInput && primaryColorText) {
        primaryColorInput.addEventListener('input', (e) => {
            primaryColorText.value = e.target.value;
        });
        primaryColorText.addEventListener('input', (e) => {
            primaryColorInput.value = e.target.value;
        });
    }
    
    if (secondaryColorInput && secondaryColorText) {
        secondaryColorInput.addEventListener('input', (e) => {
            secondaryColorText.value = e.target.value;
        });
        secondaryColorText.addEventListener('input', (e) => {
            secondaryColorInput.value = e.target.value;
        });
    }
}

// Sauvegarder la configuration visuelle
async function saveConfigurationVisuelle() {
    const newConfig = {
        companyName: document.getElementById('config-company-name').value,
        logoUrl: document.getElementById('config-logo-url').value,
        primaryColor: document.getElementById('config-primary-color').value,
        secondaryColor: document.getElementById('config-secondary-color').value,
        currency: document.getElementById('config-currency').value
    };
    
    await saveAppConfig(newConfig);
}

// Charger la configuration au démarrage
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadAppConfig();
    }, 1000);
});
