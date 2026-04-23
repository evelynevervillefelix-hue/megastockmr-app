// Configuration Firebase
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables globales
let vehicles = [];
let invoices = [];
let currentVehicleId = null;
let customFields = { vehicles: [], invoices: [] };
let dropdownOptions = {};
let suppliers = [];
let accessCodes = [];

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadCustomFields();
    loadDropdownOptions();
    loadSuppliers();
    loadAccessCodes();
    loadVehicles();
    loadInvoices();
    loadVehiclesList();
    updateStats();
    renderAdminPanel();
    
    // Écouter les changements en temps réel
    db.collection('vehicles').onSnapshot(() => {
        loadVehicles();
        loadVehiclesList();
        updateStats();
    });
    
    db.collection('invoices').onSnapshot(() => {
        loadInvoices();
    });
    
    db.collection('customFields').onSnapshot(() => {
        loadCustomFields();
    });
    
    db.collection('dropdownOptions').onSnapshot(() => {
        loadDropdownOptions();
    });
    
    db.collection('suppliers').onSnapshot(() => {
        loadSuppliers();
        renderAdminPanel();
    });
    
    db.collection('accessCodes').onSnapshot(() => {
        loadAccessCodes();
        renderAdminPanel();
    });
});

// ===== GESTION DES ONGLETS =====
function switchTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Rafraîchir le panel admin si on accède à l'onglet admin
    if (tabName === 'admin') {
        renderAdminPanel();
    }
}

// ===== CHARGEMENT DES CHAMPS PERSONNALISÉS =====
async function loadCustomFields() {
    try {
        const doc = await db.collection('customFields').doc('config').get();
        if (doc.exists) {
            customFields = doc.data();
        } else {
            customFields = { vehicles: [], invoices: [] };
        }
    } catch (error) {
        console.error('Erreur lors du chargement des champs personnalisés:', error);
    }
}

// ===== CHARGEMENT DES OPTIONS DÉROULANTES =====
async function loadDropdownOptions() {
    try {
        const doc = await db.collection('dropdownOptions').doc('config').get();
        if (doc.exists) {
            dropdownOptions = doc.data();
        } else {
            dropdownOptions = {
                statuts: ['En stock', 'Vendu', 'En réparation'],
                invoiceTypes: ['Mécanique', 'Carrosserie', 'Pneus', 'Autre']
            };
        }
    } catch (error) {
        console.error('Erreur lors du chargement des options:', error);
    }
}

// ===== CHARGEMENT DES FOURNISSEURS =====
async function loadSuppliers() {
    try {
        const snapshot = await db.collection('suppliers').get();
        suppliers = [];
        snapshot.forEach(doc => {
            suppliers.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error('Erreur lors du chargement des fournisseurs:', error);
    }
}

// ===== CHARGEMENT DES CODES D'ACCÈS =====
async function loadAccessCodes() {
    try {
        const snapshot = await db.collection('accessCodes').get();
        accessCodes = [];
        snapshot.forEach(doc => {
            accessCodes.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error('Erreur lors du chargement des codes d\'accès:', error);
    }
}

// ===== CHARGEMENT DES VÉHICULES =====
async function loadVehicles() {
    try {
        const snapshot = await db.collection('vehicles').get();
        vehicles = [];
        snapshot.forEach(doc => {
            vehicles.push({ id: doc.id, ...doc.data() });
        });
        renderVehicles();
    } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error);
    }
}

// ===== AFFICHAGE DES VÉHICULES =====
function renderVehicles() {
    const tbody = document.getElementById('vehicles-tbody');
    
    if (vehicles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Aucun véhicule. Importez un CSV ou ajoutez-en un.</td></tr>';
        return;
    }
    
    tbody.innerHTML = vehicles.map(vehicle => `
        <tr>
            <td><strong>${vehicle.mr || ''}</strong></td>
            <td>${vehicle.marque || ''}</td>
            <td>${vehicle.modele || ''}</td>
            <td>${vehicle.annee || ''}</td>
            <td>${formatCurrency(vehicle.cout || 0)}</td>
            <td><span class="badge ${vehicle.statut === 'Vendu' ? 'sold' : vehicle.statut === 'En réparation' ? 'repair' : 'available'}">${vehicle.statut || 'En stock'}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="editVehicleModal('${vehicle.id}')">✏️</button>
                <button class="btn btn-danger" onclick="deleteVehicle('${vehicle.id}')">🗑️</button>
                <button class="btn btn-info" onclick="viewVehicleDetails('${vehicle.id}')">👁️</button>
            </td>
        </tr>
    `).join('');
}

// ===== CHARGEMENT DES FACTURES =====
async function loadInvoices() {
    try {
        const snapshot = await db.collection('invoices').get();
        invoices = [];
        snapshot.forEach(doc => {
            invoices.push({ id: doc.id, ...doc.data() });
        });
        renderInvoices();
    } catch (error) {
        console.error('Erreur lors du chargement des factures:', error);
    }
}

// ===== AFFICHAGE DES FACTURES =====
function renderInvoices() {
    const tbody = document.getElementById('invoices-tbody');
    
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Aucune facture.</td></tr>';
        return;
    }
    
    tbody.innerHTML = invoices.map(invoice => `
        <tr>
            <td><strong>${invoice.mr || ''}</strong></td>
            <td>${invoice.type || ''}</td>
            <td>${invoice.date || ''}</td>
            <td>${invoice.description || ''}</td>
            <td>${formatCurrency(invoice.montant || 0)}</td>
            <td>
                <button class="btn btn-secondary" onclick="editInvoiceModal('${invoice.id}')">✏️</button>
                <button class="btn btn-danger" onclick="deleteInvoice('${invoice.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ===== MODAL VÉHICULE =====
function addVehicleModal() {
    document.getElementById('vehicle-modal-title').textContent = 'Ajouter Véhicule';
    document.getElementById('vehicle-form').reset();
    currentVehicleId = null;
    document.getElementById('vehicleModal').style.display = 'flex';
}

function editVehicleModal(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    
    document.getElementById('vehicle-modal-title').textContent = 'Modifier Véhicule';
    document.getElementById('vehicle-mr').value = vehicle.mr || '';
    document.getElementById('vehicle-marque').value = vehicle.marque || '';
    document.getElementById('vehicle-modele').value = vehicle.modele || '';
    document.getElementById('vehicle-annee').value = vehicle.annee || '';
    document.getElementById('vehicle-cout').value = vehicle.cout || '';
    document.getElementById('vehicle-statut').value = vehicle.statut || 'En stock';
    document.getElementById('vehicle-sold').value = vehicle.sold || '';
    
    currentVehicleId = id;
    document.getElementById('vehicleModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('vehicleModal').style.display = 'none';
    currentVehicleId = null;
}

function saveVehicle(event) {
    event.preventDefault();
    
    const vehicleData = {
        mr: document.getElementById('vehicle-mr').value,
        marque: document.getElementById('vehicle-marque').value,
        modele: document.getElementById('vehicle-modele').value,
        annee: parseInt(document.getElementById('vehicle-annee').value),
        cout: parseFloat(document.getElementById('vehicle-cout').value),
        statut: document.getElementById('vehicle-statut').value,
        sold: parseFloat(document.getElementById('vehicle-sold').value) || 0,
        createdAt: new Date()
    };
    
    if (currentVehicleId) {
        // Modifier
        db.collection('vehicles').doc(currentVehicleId).update(vehicleData)
            .then(() => {
                closeModal();
                alert('Véhicule modifié avec succès!');
            })
            .catch(error => alert('Erreur: ' + error.message));
    } else {
        // Ajouter
        db.collection('vehicles').add(vehicleData)
            .then(() => {
                closeModal();
                alert('Véhicule ajouté avec succès!');
            })
            .catch(error => alert('Erreur: ' + error.message));
    }
}

function deleteVehicle(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule?')) {
        db.collection('vehicles').doc(id).delete()
            .then(() => alert('Véhicule supprimé!'))
            .catch(error => alert('Erreur: ' + error.message));
    }
}

// ===== MODAL FACTURE =====
function addInvoiceModal() {
    document.getElementById('invoice-form').reset();
    currentVehicleId = null;
    document.getElementById('invoiceModal').style.display = 'flex';
}

function editInvoiceModal(id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;
    
    document.getElementById('invoice-mr').value = invoice.mr || '';
    document.getElementById('invoice-type').value = invoice.type || '';
    document.getElementById('invoice-date').value = invoice.date || '';
    document.getElementById('invoice-description').value = invoice.description || '';
    document.getElementById('invoice-montant').value = invoice.montant || '';
    
    currentVehicleId = id;
    document.getElementById('invoiceModal').style.display = 'flex';
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'none';
    currentVehicleId = null;
}

function saveInvoice(event) {
    event.preventDefault();
    
    const invoiceData = {
        mr: document.getElementById('invoice-mr').value,
        type: document.getElementById('invoice-type').value,
        date: document.getElementById('invoice-date').value,
        description: document.getElementById('invoice-description').value,
        montant: parseFloat(document.getElementById('invoice-montant').value),
        createdAt: new Date()
    };
    
    if (currentVehicleId) {
        // Modifier
        db.collection('invoices').doc(currentVehicleId).update(invoiceData)
            .then(() => {
                closeInvoiceModal();
                alert('Facture modifiée avec succès!');
            })
            .catch(error => alert('Erreur: ' + error.message));
    } else {
        // Ajouter
        db.collection('invoices').add(invoiceData)
            .then(() => {
                closeInvoiceModal();
                alert('Facture ajoutée avec succès!');
            })
            .catch(error => alert('Erreur: ' + error.message));
    }
}

function deleteInvoice(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture?')) {
        db.collection('invoices').doc(id).delete()
            .then(() => alert('Facture supprimée!'))
            .catch(error => alert('Erreur: ' + error.message));
    }
}

// ===== DÉTAILS VÉHICULE =====
function viewVehicleDetails(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    
    const vehicleInvoices = invoices.filter(i => i.mr === vehicle.mr);
    const totalInvoices = vehicleInvoices.reduce((sum, inv) => sum + (inv.montant || 0), 0);
    const totalCost = (vehicle.cout || 0) + totalInvoices;
    const profit = (vehicle.sold || 0) - totalCost;
    
    let html = `
        <h2>Détails du Véhicule</h2>
        <div class="vehicle-details">
            <p><strong>MR:</strong> ${vehicle.mr}</p>
            <p><strong>Marque:</strong> ${vehicle.marque}</p>
            <p><strong>Modèle:</strong> ${vehicle.modele}</p>
            <p><strong>Année:</strong> ${vehicle.annee}</p>
            <p><strong>Coût d'achat:</strong> ${formatCurrency(vehicle.cout || 0)}</p>
            <p><strong>Statut:</strong> ${vehicle.statut}</p>
            <hr>
            <h3>Factures Associées</h3>
    `;
    
    if (vehicleInvoices.length === 0) {
        html += '<p><em>Aucune facture liée à ce véhicule</em></p>';
    } else {
        html += '<table style="width:100%; border-collapse: collapse;">';
        html += '<tr style="background: #f0f0f0;"><th>Type</th><th>Date</th><th>Description</th><th>Montant</th></tr>';
        vehicleInvoices.forEach(inv => {
            html += `<tr style="border-bottom: 1px solid #ddd;">
                <td>${inv.type}</td>
                <td>${inv.date}</td>
                <td>${inv.description}</td>
                <td>${formatCurrency(inv.montant)}</td>
            </tr>`;
        });
        html += '</table>';
    }
    
    html += `
        <hr>
        <h3>Résumé Financier</h3>
        <p><strong>Coût d'achat:</strong> ${formatCurrency(vehicle.cout || 0)}</p>
        <p><strong>Total factures:</strong> ${formatCurrency(totalInvoices)}</p>
        <p><strong>Coût total:</strong> ${formatCurrency(totalCost)}</p>
        <p><strong>Prix de vente:</strong> ${formatCurrency(vehicle.sold || 0)}</p>
        <p style="color: ${profit >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">
            <strong>Profit/Perte:</strong> ${formatCurrency(profit)}
        </p>
    `;
    
    document.getElementById('vehicle-details').innerHTML = html;
    document.getElementById('detailsModal').style.display = 'flex';
}

function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// ===== IMPORT CSV =====
async function importVehiclesCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const data = results.data;
            let count = 0;
            
            for (const row of data) {
                if (row.MR || row.mr) {
                    try {
                        await db.collection('vehicles').add({
                            mr: row.MR || row.mr || '',
                            marque: row.Marque || row.marque || '',
                            modele: row['Modèle'] || row.modele || '',
                            annee: parseInt(row.Année || row.annee) || 0,
                            cout: parseFloat(row.Coût || row.cout) || 0,
                            statut: row.Statut || row.statut || 'En stock',
                            sold: parseFloat(row['Prix de vente'] || row.sold) || 0,
                            createdAt: new Date()
                        });
                        count++;
                    } catch (error) {
                        console.error('Erreur lors de l\'import:', error);
                    }
                }
            }
            
            alert(`${count} véhicule(s) importé(s) avec succès!`);
            event.target.value = '';
        }
    });
}

async function importInvoicesCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const data = results.data;
            let count = 0;
            
            for (const row of data) {
                if (row.MR || row.mr) {
                    try {
                        await db.collection('invoices').add({
                            mr: row.MR || row.mr || '',
                            type: row.Type || row.type || '',
                            date: row.Date || row.date || '',
                            description: row.Description || row.description || '',
                            montant: parseFloat(row.Montant || row.montant) || 0,
                            createdAt: new Date()
                        });
                        count++;
                    } catch (error) {
                        console.error('Erreur lors de l\'import:', error);
                    }
                }
            }
            
            alert(`${count} facture(s) importée(s) avec succès!`);
            event.target.value = '';
        }
    });
}

// ===== LISTE DES VÉHICULES POUR FACTURES =====
async function loadVehiclesList() {
    const select = document.getElementById('invoice-mr');
    select.innerHTML = '<option value="">-- Sélectionner un véhicule --</option>';
    
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.mr;
        option.textContent = `${vehicle.mr} - ${vehicle.marque} ${vehicle.modele}`;
        select.appendChild(option);
    });
}

// ===== STATISTIQUES =====
function updateStats() {
    const total = vehicles.length;
    const sold = vehicles.filter(v => v.statut === 'Vendu').length;
    const stock = vehicles.filter(v => v.statut === 'En stock').length;
    
    document.getElementById('total-vehicles').textContent = total;
    document.getElementById('sold-vehicles').textContent = sold;
    document.getElementById('stock-vehicles').textContent = stock;
    
    // Stats Admin
    const totalValue = vehicles.reduce((sum, v) => sum + (v.cout || 0), 0);
    const totalInvoicesValue = invoices.reduce((sum, i) => sum + (i.montant || 0), 0);
    const totalSold = vehicles.reduce((sum, v) => sum + (v.sold || 0), 0);
    
    document.getElementById('admin-stats').innerHTML = `
        <p><strong>Total véhicules:</strong> ${total}</p>
        <p><strong>Véhicules vendus:</strong> ${sold}</p>
        <p><strong>Véhicules en stock:</strong> ${stock}</p>
        <p><strong>Valeur totale d'achat:</strong> ${formatCurrency(totalValue)}</p>
        <p><strong>Total factures:</strong> ${formatCurrency(totalInvoicesValue)}</p>
        <p><strong>Total ventes:</strong> ${formatCurrency(totalSold)}</p>
    `;
}

// ===== PANEL ADMIN =====
function renderAdminPanel() {
    const adminPanel = document.getElementById('admin');
    if (!adminPanel) return;
    
    // Vérifier si les sections existent déjà
    let fieldsSection = document.getElementById('admin-fields-section');
    let dropdownSection = document.getElementById('admin-dropdown-section');
    let suppliersSection = document.getElementById('admin-suppliers-section');
    let accessSection = document.getElementById('admin-access-section');
    
    // Créer les sections s'il n'existent pas
    if (!fieldsSection) {
        const html = `
            <div class="admin-block" id="admin-fields-section">
                <h3>📋 Gestion des Champs Personnalisés</h3>
                <div id="fields-content"></div>
            </div>
            
            <div class="admin-block" id="admin-dropdown-section">
                <h3>📑 Gestion des Listes Déroulantes</h3>
                <div id="dropdown-content"></div>
            </div>
            
            <div class="admin-block" id="admin-suppliers-section">
                <h3>🏢 Gestion des Fournisseurs</h3>
                <div id="suppliers-content"></div>
            </div>
            
            <div class="admin-block" id="admin-access-section">
                <h3>🔐 Gestion des Accès</h3>
                <div id="access-content"></div>
            </div>
            
            <div class="admin-block" id="admin-config-section">
                <h3>🎨 Configuration Visuelle</h3>
                <div id="config-content"></div>
            </div>
        `;
        
        // Insérer après les stats
        const statsBlock = adminPanel.querySelector('.admin-block');
        if (statsBlock) {
            statsBlock.insertAdjacentHTML('afterend', html);
        }
        
        fieldsSection = document.getElementById('admin-fields-section');
        dropdownSection = document.getElementById('admin-dropdown-section');
        suppliersSection = document.getElementById('admin-suppliers-section');
        accessSection = document.getElementById('admin-access-section');
    }
    
    // Remplir les sections
    renderFieldsManagement();
    renderDropdownManagement();
    renderSuppliersManagement();
    renderAccessManagement();
    renderConfigurationVisuelle();
}

// ===== GESTION DES CHAMPS =====
function renderFieldsManagement() {
    const content = document.getElementById('fields-content');
    if (!content) return;
    
    let html = `
        <h4>Champs des Véhicules</h4>
        <div id="vehicle-fields-list" style="margin-bottom: 1.5em;">
    `;
    
    if (customFields.vehicles && customFields.vehicles.length > 0) {
        customFields.vehicles.forEach((field, idx) => {
            html += `
                <div style="display: flex; gap: 0.5em; margin-bottom: 0.5em; align-items: center;">
                    <input type="text" value="${field.name}" readonly style="flex: 1; padding: 0.5em; border: 1px solid #ddd; border-radius: 4px;">
                    <button class="btn btn-danger" onclick="deleteCustomField('vehicles', ${idx})" style="padding: 0.5em 1em;">🗑️</button>
                </div>
            `;
        });
    } else {
        html += '<p><em>Aucun champ personnalisé</em></p>';
    }
    
    html += `
        </div>
        <div style="display: flex; gap: 0.5em; margin-bottom: 2em;">
            <input type="text" id="new-vehicle-field" placeholder="Nom du nouveau champ" style="flex: 1; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
            <button class="btn btn-primary" onclick="addCustomField('vehicles')">➕ Ajouter</button>
        </div>
        
        <h4>Champs des Factures</h4>
        <div id="invoice-fields-list" style="margin-bottom: 1.5em;">
    `;
    
    if (customFields.invoices && customFields.invoices.length > 0) {
        customFields.invoices.forEach((field, idx) => {
            html += `
                <div style="display: flex; gap: 0.5em; margin-bottom: 0.5em; align-items: center;">
                    <input type="text" value="${field.name}" readonly style="flex: 1; padding: 0.5em; border: 1px solid #ddd; border-radius: 4px;">
                    <button class="btn btn-danger" onclick="deleteCustomField('invoices', ${idx})" style="padding: 0.5em 1em;">🗑️</button>
                </div>
            `;
        });
    } else {
        html += '<p><em>Aucun champ personnalisé</em></p>';
    }
    
    html += `
        </div>
        <div style="display: flex; gap: 0.5em;">
            <input type="text" id="new-invoice-field" placeholder="Nom du nouveau champ" style="flex: 1; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
            <button class="btn btn-primary" onclick="addCustomField('invoices')">➕ Ajouter</button>
        </div>
    `;
    
    content.innerHTML = html;
}

function addCustomField(type) {
    const inputId = type === 'vehicles' ? 'new-vehicle-field' : 'new-invoice-field';
    const fieldName = document.getElementById(inputId).value.trim();
    
    if (!fieldName) {
        alert('Veuillez entrer un nom de champ');
        return;
    }
    
    if (!customFields[type]) {
        customFields[type] = [];
    }
    
    customFields[type].push({ name: fieldName, type: 'text' });
    
    db.collection('customFields').doc('config').set(customFields)
        .then(() => {
            document.getElementById(inputId).value = '';
            alert('Champ ajouté avec succès!');
        })
        .catch(error => alert('Erreur: ' + error.message));
}

function deleteCustomField(type, index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce champ?')) {
        customFields[type].splice(index, 1);
        
        db.collection('customFields').doc('config').set(customFields)
            .then(() => alert('Champ supprimé!'))
            .catch(error => alert('Erreur: ' + error.message));
    }
}

// ===== GESTION DES LISTES DÉROULANTES =====
function renderDropdownManagement() {
    const content = document.getElementById('dropdown-content');
    if (!content) return;
    
    let html = `
        <h4>Statuts des Véhicules</h4>
        <div id="statuts-list" style="margin-bottom: 1.5em;">
    `;
    
    if (dropdownOptions.statuts && dropdownOptions.statuts.length > 0) {
        dropdownOptions.statuts.forEach((statut, idx) => {
            html += `
                <div style="display: flex; gap: 0.5em; margin-bottom: 0.5em; align-items: center;">
                    <input type="text" value="${statut}" readonly style="flex: 1; padding: 0.5em; border: 1px solid #ddd; border-radius: 4px;">
                    <button class="btn btn-danger" onclick="deleteDropdownOption('statuts', ${idx})" style="padding: 0.5em 1em;">🗑️</button>
                </div>
            `;
        });
    }
    
    html += `
        </div>
        <div style="display: flex; gap: 0.5em; margin-bottom: 2em;">
            <input type="text" id="new-statut" placeholder="Nouveau statut" style="flex: 1; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
            <button class="btn btn-primary" onclick="addDropdownOption('statuts')">➕ Ajouter</button>
        </div>
        
        <h4>Types de Factures</h4>
        <div id="invoice-types-list" style="margin-bottom: 1.5em;">
    `;
    
    if (dropdownOptions.invoiceTypes && dropdownOptions.invoiceTypes.length > 0) {
        dropdownOptions.invoiceTypes.forEach((type, idx) => {
            html += `
                <div style="display: flex; gap: 0.5em; margin-bottom: 0.5em; align-items: center;">
                    <input type="text" value="${type}" readonly style="flex: 1; padding: 0.5em; border: 1px solid #ddd; border-radius: 4px;">
                    <button class="btn btn-danger" onclick="deleteDropdownOption('invoiceTypes', ${idx})" style="padding: 0.5em 1em;">🗑️</button>
                </div>
            `;
        });
    }
    
    html += `
        </div>
        <div style="display: flex; gap: 0.5em;">
            <input type="text" id="new-invoice-type" placeholder="Nouveau type de facture" style="flex: 1; padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
            <button class="btn btn-primary" onclick="addDropdownOption('invoiceTypes')">➕ Ajouter</button>
        </div>
    `;
    
    content.innerHTML = html;
}

function addDropdownOption(type) {
    const inputId = type === 'statuts' ? 'new-statut' : 'new-invoice-type';
    const optionValue = document.getElementById(inputId).value.trim();
    
    if (!optionValue) {
        alert('Veuillez entrer une valeur');
        return;
    }
    
    if (!dropdownOptions[type]) {
        dropdownOptions[type] = [];
    }
    
    dropdownOptions[type].push(optionValue);
    
    db.collection('dropdownOptions').doc('config').set(dropdownOptions)
        .then(() => {
            document.getElementById(inputId).value = '';
            alert('Option ajoutée avec succès!');
        })
        .catch(error => alert('Erreur: ' + error.message));
}

function deleteDropdownOption(type, index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette option?')) {
        dropdownOptions[type].splice(index, 1);
        
        db.collection('dropdownOptions').doc('config').set(dropdownOptions)
            .then(() => alert('Option supprimée!'))
            .catch(error => alert('Erreur: ' + error.message));
    }
}

// ===== GESTION DES FOURNISSEURS =====
function renderSuppliersManagement() {
    const content = document.getElementById('suppliers-content');
    if (!content) return;
    
    let html = '<div style="margin-bottom: 1.5em;">';
    
    if (suppliers && suppliers.length > 0) {
        suppliers.forEach((supplier) => {
            html += `
                <div style="display: flex; gap: 0.5em; margin-bottom: 0.5em; align-items: center; background: #f5f5f5; padding: 0.7em; border-radius: 4px;">
                    <div style="flex: 1;">
                        <strong>${supplier.name}</strong><br>
                        <small>${supplier.contact || 'Aucun contact'}</small>
                    </div>
                    <button class="btn btn-danger" onclick="deleteSupplier('${supplier.id}')" style="padding: 0.5em 1em;">🗑️</button>
                </div>
            `;
        });
    } else {
        html += '<p><em>Aucun fournisseur</em></p>';
    }
    
    html += `
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.7em;">
            <input type="text" id="new-supplier-name" placeholder="Nom du fournisseur" style="padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
            <input type="text" id="new-supplier-contact" placeholder="Contact (téléphone, email)" style="padding: 0.7em; border: 2px solid #b71c1c; border-radius: 4px;">
            <button class="btn btn-primary" onclick="addSupplier()">➕ Ajouter Fournisseur</button>
        </div>
    `;
    
    content.innerHTML = html;
}

function addSupplier() {
    const name = document.getElementById('new-supplier-name').value.trim();
    const contact = document.getElementById('new-supplier-contact').value.trim();
    
    if (!name) {
        alert('Veuillez entrer le nom du fournisseur');
        return;
    }
    
    db.collection('suppliers').add({
        name: name,
        contact: contact,
        createdAt: new Date()
    })
        .then(() => {
            document.getElementById('new-supplier-name').value = '';
            document.getElementById('new-supplier-contact').value = '';
            alert('Fournisseur ajouté avec succès!');
        })
        .catch(error => alert('Erreur: ' + error.message));
}

function deleteSupplier(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur?')) {
        db.collection('suppliers').doc(id).delete()
            .then(() => alert('Fournisseur supprimé!'))
            .catch(error => alert('Erreur: ' + error.message));
    }
}

// ===== GESTION DES ACCÈS =====
function renderAccessManagement() {
    const content = document.getElementById('access-content');
    if (!content) return;
    
    let html = `
        <h4>Codes d'Accès Actifs</h4>
        <div style="margin-bottom: 1.5em;">
    `;
    
    if (accessCodes && accessCodes.length > 0) {
        accessCodes.forEach((code) => {
            const createdDate = code.createdAt ? new Date(code.createdAt.seconds * 1000).toLocaleDateString('fr-CA') : 'N/A';
            const status = code.used ? '✓ Utilisé' : '⏳ Actif';
            html += `
                <div style="display: flex; gap: 0.5em; margin-bottom: 0.5em; align-items: center; background: #f5f5f5; padding: 0.7em; border-radius: 4px;">
                    <div style="flex: 1;">
                        <strong style="font-family: monospace; font-size: 1.1em;">${code.code}</strong><br>
                        <small>Créé: ${createdDate} | ${status}</small>
                    </div>
                    <button class="btn btn-danger" onclick="deleteAccessCode('${code.id}')" style="padding: 0.5em 1em;">🗑️</button>
                </div>
            `;
        });
    } else {
        html += '<p><em>Aucun code d\'accès</em></p>';
    }
    
    html += `
        </div>
        <button class="btn btn-primary" onclick="generateAccessCode()" style="width: 100%;">🔑 Générer un Nouveau Code</button>
        <p style="font-size: 0.9em; color: #666; margin-top: 1em;">
            <strong>Comment ça marche:</strong> Générez un code d'accès unique et partagez-le avec quelqu'un. 
            Cette personne pourra l'utiliser pour accéder à l'application.
        </p>
    `;
    
    content.innerHTML = html;
}

function generateAccessCode() {
    const code = 'MR' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    db.collection('accessCodes').add({
        code: code,
        used: false,
        createdAt: new Date()
    })
        .then(() => {
            alert(`Code généré: ${code}\n\nPartagez ce code avec l'utilisateur.`);
        })
        .catch(error => alert('Erreur: ' + error.message));
}

function deleteAccessCode(id) {
    if (confirm('Êtes-vous sûr de vouloir révoquer cet accès?')) {
        db.collection('accessCodes').doc(id).delete()
            .then(() => alert('Code d\'accès révoqué!'))
            .catch(error => alert('Erreur: ' + error.message));
    }
}

// ===== UTILITAIRES =====
function formatCurrency(value) {
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD'
    }).format(value);
}

function refreshData() {
    loadVehicles();
    loadInvoices();
    alert('Données rafraîchies!');
}

function clearAllData() {
    // Supprimer tous les véhicules
    db.collection('vehicles').get().then(snapshot => {
        snapshot.forEach(doc => {
            db.collection('vehicles').doc(doc.id).delete();
        });
    });
    
    // Supprimer toutes les factures
    db.collection('invoices').get().then(snapshot => {
        snapshot.forEach(doc => {
            db.collection('invoices').doc(doc.id).delete();
        });
    });
    
    alert('Toutes les données ont été supprimées!');
}

// Fermer les modales en cliquant en dehors
window.onclick = function(event) {
    const vehicleModal = document.getElementById('vehicleModal');
    const invoiceModal = document.getElementById('invoiceModal');
    const detailsModal = document.getElementById('detailsModal');
    
    if (event.target === vehicleModal) {
        vehicleModal.style.display = 'none';
    }
    if (event.target === invoiceModal) {
        invoiceModal.style.display = 'none';
    }
    if (event.target === detailsModal) {
        detailsModal.style.display = 'none';
    }
}
