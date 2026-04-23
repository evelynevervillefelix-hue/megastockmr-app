// ===== FONCTIONS POUR INTÉGRER LES CHAMPS DYNAMIQUES DANS LES FORMULAIRES =====

// Mettre à jour le formulaire véhicule avec les champs personnalisés
function updateVehicleFormWithCustomFields() {
    const form = document.getElementById('vehicle-form');
    if (!form) return;
    
    // Trouver où insérer les champs personnalisés (avant les actions)
    const formActions = form.querySelector('.form-actions');
    if (!formActions) return;
    
    // Supprimer les anciens champs personnalisés s'il y en a
    const existingCustom = form.querySelectorAll('[data-custom-field]');
    existingCustom.forEach(el => el.remove());
    
    // Ajouter les nouveaux champs personnalisés
    if (customFields.vehicles && customFields.vehicles.length > 0) {
        const customFieldsDiv = document.createElement('div');
        customFieldsDiv.id = 'custom-vehicle-fields';
        
        customFields.vehicles.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            group.setAttribute('data-custom-field', field.name);
            
            const label = document.createElement('label');
            label.textContent = field.name;
            
            const input = document.createElement('input');
            input.type = field.type || 'text';
            input.id = `vehicle-custom-${field.name}`;
            input.setAttribute('data-field-name', field.name);
            
            group.appendChild(label);
            group.appendChild(input);
            customFieldsDiv.appendChild(group);
        });
        
        formActions.parentNode.insertBefore(customFieldsDiv, formActions);
    }
}

// Mettre à jour le formulaire facture avec les champs personnalisés
function updateInvoiceFormWithCustomFields() {
    const form = document.getElementById('invoice-form');
    if (!form) return;
    
    // Trouver où insérer les champs personnalisés (avant les actions)
    const formActions = form.querySelector('.form-actions');
    if (!formActions) return;
    
    // Supprimer les anciens champs personnalisés s'il y en a
    const existingCustom = form.querySelectorAll('[data-custom-field]');
    existingCustom.forEach(el => el.remove());
    
    // Ajouter les nouveaux champs personnalisés
    if (customFields.invoices && customFields.invoices.length > 0) {
        const customFieldsDiv = document.createElement('div');
        customFieldsDiv.id = 'custom-invoice-fields';
        
        customFields.invoices.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            group.setAttribute('data-custom-field', field.name);
            
            const label = document.createElement('label');
            label.textContent = field.name;
            
            const input = document.createElement('input');
            input.type = field.type || 'text';
            input.id = `invoice-custom-${field.name}`;
            input.setAttribute('data-field-name', field.name);
            
            group.appendChild(label);
            group.appendChild(input);
            customFieldsDiv.appendChild(group);
        });
        
        formActions.parentNode.insertBefore(customFieldsDiv, formActions);
    }
}

// Mettre à jour le select des statuts avec les options dynamiques
function updateStatusSelect() {
    const select = document.getElementById('vehicle-statut');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    if (dropdownOptions.statuts && dropdownOptions.statuts.length > 0) {
        dropdownOptions.statuts.forEach(statut => {
            const option = document.createElement('option');
            option.value = statut;
            option.textContent = statut;
            select.appendChild(option);
        });
    }
    
    select.value = currentValue || (dropdownOptions.statuts ? dropdownOptions.statuts[0] : '');
}

// Mettre à jour le select des types de factures avec les options dynamiques
function updateInvoiceTypeSelect() {
    const select = document.getElementById('invoice-type');
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    if (dropdownOptions.invoiceTypes && dropdownOptions.invoiceTypes.length > 0) {
        dropdownOptions.invoiceTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            select.appendChild(option);
        });
    }
    
    select.value = currentValue || (dropdownOptions.invoiceTypes ? dropdownOptions.invoiceTypes[0] : '');
}

// Mettre à jour le tableau des véhicules pour afficher les champs personnalisés
function renderVehiclesWithCustomFields() {
    const tbody = document.getElementById('vehicles-tbody');
    const thead = document.getElementById('vehicles-table').querySelector('thead tr');
    
    if (vehicles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Aucun véhicule. Importez un CSV ou ajoutez-en un.</td></tr>';
        return;
    }
    
    // Mettre à jour les en-têtes si des champs personnalisés existent
    let colCount = 7; // MR, Marque, Modèle, Année, Coût, Statut, Actions
    
    // Rendre les véhicules
    tbody.innerHTML = vehicles.map(vehicle => {
        let row = `
            <tr>
                <td><strong>${vehicle.mr || ''}</strong></td>
                <td>${vehicle.marque || ''}</td>
                <td>${vehicle.modele || ''}</td>
                <td>${vehicle.annee || ''}</td>
                <td>${formatCurrency(vehicle.cout || 0)}</td>
                <td><span class="badge ${vehicle.statut === 'Vendu' ? 'sold' : vehicle.statut === 'En réparation' ? 'repair' : 'available'}">${vehicle.statut || 'En stock'}</span></td>
        `;
        
        // Ajouter les champs personnalisés
        if (customFields.vehicles && customFields.vehicles.length > 0) {
            customFields.vehicles.forEach(field => {
                row += `<td>${vehicle[field.name] || '-'}</td>`;
            });
        }
        
        row += `
                <td>
                    <button class="btn btn-secondary" onclick="editVehicleModal('${vehicle.id}')">✏️</button>
                    <button class="btn btn-danger" onclick="deleteVehicle('${vehicle.id}')">🗑️</button>
                    <button class="btn btn-info" onclick="viewVehicleDetails('${vehicle.id}')">👁️</button>
                </td>
            </tr>
        `;
        
        return row;
    }).join('');
}

// Mettre à jour le tableau des factures pour afficher les champs personnalisés
function renderInvoicesWithCustomFields() {
    const tbody = document.getElementById('invoices-tbody');
    
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Aucune facture.</td></tr>';
        return;
    }
    
    tbody.innerHTML = invoices.map(invoice => {
        let row = `
            <tr>
                <td><strong>${invoice.mr || ''}</strong></td>
                <td>${invoice.type || ''}</td>
                <td>${invoice.date || ''}</td>
                <td>${invoice.description || ''}</td>
                <td>${formatCurrency(invoice.montant || 0)}</td>
        `;
        
        // Ajouter les champs personnalisés
        if (customFields.invoices && customFields.invoices.length > 0) {
            customFields.invoices.forEach(field => {
                row += `<td>${invoice[field.name] || '-'}</td>`;
            });
        }
        
        row += `
                <td>
                    <button class="btn btn-secondary" onclick="editInvoiceModal('${invoice.id}')">✏️</button>
                    <button class="btn btn-danger" onclick="deleteInvoice('${invoice.id}')">🗑️</button>
                </td>
            </tr>
        `;
        
        return row;
    }).join('');
}

// Récupérer les valeurs des champs personnalisés depuis le formulaire
function getCustomFieldValues(type) {
    const values = {};
    const fields = type === 'vehicles' ? customFields.vehicles : customFields.invoices;
    
    if (fields && fields.length > 0) {
        fields.forEach(field => {
            const inputId = type === 'vehicles' ? `vehicle-custom-${field.name}` : `invoice-custom-${field.name}`;
            const input = document.getElementById(inputId);
            if (input) {
                values[field.name] = input.value;
            }
        });
    }
    
    return values;
}

// Charger les valeurs des champs personnalisés dans le formulaire
function loadCustomFieldValues(vehicle, type) {
    if (type === 'vehicles' && customFields.vehicles && customFields.vehicles.length > 0) {
        customFields.vehicles.forEach(field => {
            const inputId = `vehicle-custom-${field.name}`;
            const input = document.getElementById(inputId);
            if (input && vehicle[field.name]) {
                input.value = vehicle[field.name];
            }
        });
    } else if (type === 'invoices' && customFields.invoices && customFields.invoices.length > 0) {
        customFields.invoices.forEach(field => {
            const inputId = `invoice-custom-${field.name}`;
            const input = document.getElementById(inputId);
            if (input && vehicle[field.name]) {
                input.value = vehicle[field.name];
            }
        });
    }
}

// Intercepter et améliorer saveVehicle
const originalSaveVehicle = window.saveVehicle;
window.saveVehicle = function(event) {
    event.preventDefault();
    
    const vehicleData = {
        mr: document.getElementById('vehicle-mr').value,
        marque: document.getElementById('vehicle-marque').value,
        modele: document.getElementById('vehicle-modele').value,
        annee: parseInt(document.getElementById('vehicle-annee').value),
        cout: parseFloat(document.getElementById('vehicle-cout').value),
        statut: document.getElementById('vehicle-statut').value,
        sold: parseFloat(document.getElementById('vehicle-sold').value) || 0,
        createdAt: new Date(),
        ...getCustomFieldValues('vehicles')
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
};

// Intercepter et améliorer saveInvoice
const originalSaveInvoice = window.saveInvoice;
window.saveInvoice = function(event) {
    event.preventDefault();
    
    const invoiceData = {
        mr: document.getElementById('invoice-mr').value,
        type: document.getElementById('invoice-type').value,
        date: document.getElementById('invoice-date').value,
        description: document.getElementById('invoice-description').value,
        montant: parseFloat(document.getElementById('invoice-montant').value),
        createdAt: new Date(),
        ...getCustomFieldValues('invoices')
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
};

// Améliorer editVehicleModal pour charger les champs personnalisés
const originalEditVehicleModal = window.editVehicleModal;
window.editVehicleModal = function(id) {
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
    
    // Charger les champs personnalisés
    updateVehicleFormWithCustomFields();
    loadCustomFieldValues(vehicle, 'vehicles');
    
    currentVehicleId = id;
    document.getElementById('vehicleModal').style.display = 'flex';
};

// Améliorer addVehicleModal pour afficher les champs personnalisés
const originalAddVehicleModal = window.addVehicleModal;
window.addVehicleModal = function() {
    document.getElementById('vehicle-modal-title').textContent = 'Ajouter Véhicule';
    document.getElementById('vehicle-form').reset();
    updateVehicleFormWithCustomFields();
    updateStatusSelect();
    currentVehicleId = null;
    document.getElementById('vehicleModal').style.display = 'flex';
};

// Améliorer addInvoiceModal pour afficher les champs personnalisés
const originalAddInvoiceModal = window.addInvoiceModal;
window.addInvoiceModal = function() {
    document.getElementById('invoice-form').reset();
    updateInvoiceFormWithCustomFields();
    updateInvoiceTypeSelect();
    currentVehicleId = null;
    document.getElementById('invoiceModal').style.display = 'flex';
};

// Améliorer editInvoiceModal pour charger les champs personnalisés
const originalEditInvoiceModal = window.editInvoiceModal;
window.editInvoiceModal = function(id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;
    
    document.getElementById('invoice-mr').value = invoice.mr || '';
    document.getElementById('invoice-type').value = invoice.type || '';
    document.getElementById('invoice-date').value = invoice.date || '';
    document.getElementById('invoice-description').value = invoice.description || '';
    document.getElementById('invoice-montant').value = invoice.montant || '';
    
    // Charger les champs personnalisés
    updateInvoiceFormWithCustomFields();
    loadCustomFieldValues(invoice, 'invoices');
    
    currentVehicleId = id;
    document.getElementById('invoiceModal').style.display = 'flex';
};

// Initialiser les mises à jour dynamiques
function initDynamicFormUpdates() {
    // Écouter les changements de champs personnalisés
    const originalLoadCustomFields = window.loadCustomFields;
    window.loadCustomFields = async function() {
        await originalLoadCustomFields();
        updateVehicleFormWithCustomFields();
        updateInvoiceFormWithCustomFields();
        renderVehiclesWithCustomFields();
        renderInvoicesWithCustomFields();
    };
    
    // Écouter les changements d'options déroulantes
    const originalLoadDropdownOptions = window.loadDropdownOptions;
    window.loadDropdownOptions = async function() {
        await originalLoadDropdownOptions();
        updateStatusSelect();
        updateInvoiceTypeSelect();
    };
}

// Appeler l'initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Attendre un peu pour que les fonctions principales soient chargées
    setTimeout(() => {
        initDynamicFormUpdates();
        updateVehicleFormWithCustomFields();
        updateInvoiceFormWithCustomFields();
        updateStatusSelect();
        updateInvoiceTypeSelect();
    }, 100);
});
