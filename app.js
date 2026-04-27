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

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadVehicles();
    loadInvoices();
    loadVehiclesList();
    updateStats();
    
    // Écouter les changements en temps réel
    db.collection('vehicles').onSnapshot(() => {
        loadVehicles();
        loadVehiclesList();
        updateStats();
    });
    
    db.collection('invoices').onSnapshot(() => {
        loadInvoices();
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
