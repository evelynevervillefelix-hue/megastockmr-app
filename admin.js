import { firebaseApp, db } from './app.js'; // Import db from app.js

// --- Admin Authentication --- //
let adminToken = localStorage.getItem("adminToken");

export const isAdminLoggedIn = () => {
    return !!adminToken;
};

export const loginWithCode = async (code) => {
    try {
        const adminCodesRef = db.collection("adminCodes");
        const q = adminCodesRef.where("code", "==", code).where("used", "==", false);
        const querySnapshot = await q.get();

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            adminToken = "simulated_admin_token_" + code; 
            localStorage.setItem("adminToken", adminToken);
            await docSnap.ref.update({ used: true });
            alert("Connexion administrateur réussie!");
            window.location.reload();
        } else {
            alert("Code d'accès invalide ou déjà utilisé.");
        }
    } catch (error) {
        console.error("Erreur de connexion admin : ", error);
        alert("Erreur de connexion : " + error.message);
    }
};

export const logout = () => {
    adminToken = null;
    localStorage.removeItem("adminToken");
    alert("Déconnexion réussie.");
    window.location.reload();
};

// --- Dynamic Fields Management --- //
export const getDynamicFields = async (type) => {
    const docRef = db.collection("configurations").doc("dynamicFields");
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return docSnap.data()[type] || [];
    } else {
        return [];
    }
};

export const saveDynamicFields = async (type, fields) => {
    const docRef = db.collection("configurations").doc("dynamicFields");
    await docRef.set({ [type]: fields }, { merge: true });
};

// --- Dropdown Options Management --- //
export const getDropdownOptions = async (category) => {
    const docRef = db.collection("configurations").doc("dropdownOptions");
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return docSnap.data()[category] || [];
    } else {
        return [];
    }
};

export const saveDropdownOptions = async (category, options) => {
    const docRef = db.collection("configurations").doc("dropdownOptions");
    await docRef.set({ [category]: options }, { merge: true });
};

// --- Suppliers Management --- //
export const getSuppliers = async () => {
    const snapshot = await db.collection("suppliers").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSupplier = async (name) => {
    await db.collection("suppliers").add({ name });
};

export const deleteSupplier = async (id) => {
    await db.collection("suppliers").doc(id).delete();
};

// --- Access Codes Management --- //
export const getAccessCodes = async () => {
    const snapshot = await db.collection("adminCodes").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const generateAccessCode = async () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    await db.collection("adminCodes").add({ code, used: false, createdAt: new Date() });
    return code;
};

export const revokeAccessCode = async (id) => {
    await db.collection("adminCodes").doc(id).delete();
};

// --- Visual Configuration --- //
export const getConfig = async () => {
    const docRef = db.collection("configurations").doc("visualConfig");
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return docSnap.data();
    } else {
        // Default config
        return { primaryColor: "#dc3545", secondaryColor: "#6c757d", logoUrl: "mr_auto_logo.jpg", currencySymbol: "$" };
    }
};

export const saveConfig = async (newConfig) => {
    const docRef = db.collection("configurations").doc("visualConfig");
    await docRef.set(newConfig, { merge: true });
};

export const applyConfig = (config) => {
    document.documentElement.style.setProperty("--primary-color", config.primaryColor);
    document.documentElement.style.setProperty("--secondary-color", config.secondaryColor);
    const logoElement = document.querySelector(".fiat-logo");
    if (logoElement) {
        logoElement.src = config.logoUrl;
    }
    window.currentConfig = config; // Store config globally for app.js
};

// --- Admin Panel Rendering --- //
export const renderAdminPanel = async () => {
    const adminContent = document.getElementById("admin-content");
    if (!adminContent) return;

    adminContent.innerHTML = `
        <div class="admin-block">
            <h3>⚙️ Gestion des Accès</h3>
            <button class="btn btn-primary" id="generateAdminCodeBtn">Générer Nouveau Code</button>
            <ul id="adminCodeList"></ul>
        </div>

        <div class="admin-block">
            <h3>➕ Champs Personnalisés Véhicules</h3>
            <input type="text" id="newVehicleFieldName" placeholder="Nom du champ (ex: kilometrage)" />
            <input type="text" id="newVehicleFieldLabel" placeholder="Libellé du champ (ex: Kilométrage)" />
            <select id="newVehicleFieldType">
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="date">Date</option>
                <option value="select">Liste déroulante</option>
                <option value="checkbox">Case à cocher</option>
            </select>
            <button class="btn btn-primary" id="addVehicleFieldBtn">Ajouter Champ</button>
            <ul id="vehicleFieldsList"></ul>
        </div>

        <div class="admin-block">
            <h3>➕ Champs Personnalisés Factures</h3>
            <input type="text" id="newInvoiceFieldName" placeholder="Nom du champ (ex: reference)" />
            <input type="text" id="newInvoiceFieldLabel" placeholder="Libellé du champ (ex: Référence)" />
            <select id="newInvoiceFieldType">
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="date">Date</option>
                <option value="select">Liste déroulante</option>
                <option value="checkbox">Case à cocher</option>
            </select>
            <button class="btn btn-primary" id="addInvoiceFieldBtn">Ajouter Champ</button>
            <ul id="invoiceFieldsList"></ul>
        </div>

        <div class="admin-block">
            <h3>📋 Options Listes Déroulantes</h3>
            <h4>Statuts Véhicule</h4>
            <input type="text" id="newVehicleStatusOption" placeholder="Nouvelle option de statut" />
            <button class="btn btn-primary" id="addVehicleStatusOptionBtn">Ajouter Option</button>
            <ul id="vehicleStatusOptionsList"></ul>

            <h4>Types Facture</h4>
            <input type="text" id="newInvoiceTypeOption" placeholder="Nouvelle option de type de facture" />
            <button class="btn btn-primary" id="addInvoiceTypeOptionBtn">Ajouter Option</button>
            <ul id="invoiceTypeOptionsList"></ul>
        </div>

        <div class="admin-block">
            <h3>🚚 Gestion des Fournisseurs</h3>
            <input type="text" id="newSupplierName" placeholder="Nom du fournisseur" />
            <button class="btn btn-primary" id="addSupplierBtn">Ajouter Fournisseur</button>
            <ul id="supplierList"></ul>
        </div>

        <div class="admin-block">
            <h3>🎨 Configuration Visuelle</h3>
            <label for="primaryColorInput">Couleur Primaire:</label>
            <input type="color" id="primaryColorInput" />
            <label for="secondaryColorInput">Couleur Secondaire:</label>
            <input type="color" id="secondaryColorInput" />
            <label for="logoUrlInput">URL du Logo:</label>
            <input type="text" id="logoUrlInput" placeholder="URL de l'image du logo" />
            <label for="currencySymbolInput">Symbole Monétaire:</label>
            <input type="text" id="currencySymbolInput" placeholder="$" />
            <button class="btn btn-primary" id="saveVisualConfigBtn">Enregistrer Configuration</button>
        </div>
    `;

    // Load and setup event listeners for each admin section
    await loadAccessCodes();
    document.getElementById("generateAdminCodeBtn").addEventListener("click", async () => {
        await generateAccessCode();
        await loadAccessCodes();
    });
    document.getElementById("adminCodeList").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            await revokeAccessCode(e.target.dataset.id);
            await loadAccessCodes();
        }
    });

    await loadCustomFields("vehicle");
    document.getElementById("addVehicleFieldBtn").addEventListener("click", async () => {
        const name = document.getElementById("newVehicleFieldName").value;
        const label = document.getElementById("newVehicleFieldLabel").value;
        const fieldType = document.getElementById("newVehicleFieldType").value;
        if (name && label) {
            const currentFields = await getDynamicFields("vehicle");
            await saveDynamicFields("vehicle", [...currentFields, { name, label, fieldType }]);
            document.getElementById("newVehicleFieldName").value = "";
            document.getElementById("newVehicleFieldLabel").value = "";
            await loadCustomFields("vehicle");
        }
    });
    document.getElementById("vehicleFieldsList").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const fieldName = e.target.dataset.name;
            const currentFields = await getDynamicFields("vehicle");
            const updatedFields = currentFields.filter(field => field.name !== fieldName);
            await saveDynamicFields("vehicle", updatedFields);
            await loadCustomFields("vehicle");
        }
    });

    await loadCustomFields("invoice");
    document.getElementById("addInvoiceFieldBtn").addEventListener("click", async () => {
        const name = document.getElementById("newInvoiceFieldName").value;
        const label = document.getElementById("newInvoiceFieldLabel").value;
        const fieldType = document.getElementById("newInvoiceFieldType").value;
        if (name && label) {
            const currentFields = await getDynamicFields("invoice");
            await saveDynamicFields("invoice", [...currentFields, { name, label, fieldType }]);
            document.getElementById("newInvoiceFieldName").value = "";
            document.getElementById("newInvoiceFieldLabel").value = "";
            await loadCustomFields("invoice");
        }
    });
    document.getElementById("invoiceFieldsList").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const fieldName = e.target.dataset.name;
            const currentFields = await getDynamicFields("invoice");
            const updatedFields = currentFields.filter(field => field.name !== fieldName);
            await saveDynamicFields("invoice", updatedFields);
            await loadCustomFields("invoice");
        }
    });

    await loadDropdownOptions("vehicleStatus");
    document.getElementById("addVehicleStatusOptionBtn").addEventListener("click", async () => {
        const option = document.getElementById("newVehicleStatusOption").value;
        if (option) {
            const currentOptions = await getDropdownOptions("vehicleStatus");
            await saveDropdownOptions("vehicleStatus", [...currentOptions, option]);
            document.getElementById("newVehicleStatusOption").value = "";
            await loadDropdownOptions("vehicleStatus");
        }
    });
    document.getElementById("vehicleStatusOptionsList").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const option = e.target.dataset.option;
            const currentOptions = await getDropdownOptions("vehicleStatus");
            const updatedOptions = currentOptions.filter(opt => opt !== option);
            await saveDropdownOptions("vehicleStatus", updatedOptions);
            await loadDropdownOptions("vehicleStatus");
        }
    });

    await loadDropdownOptions("invoiceType");
    document.getElementById("addInvoiceTypeOptionBtn").addEventListener("click", async () => {
        const option = document.getElementById("newInvoiceTypeOption").value;
        if (option) {
            const currentOptions = await getDropdownOptions("invoiceType");
            await saveDropdownOptions("invoiceType", [...currentOptions, option]);
            document.getElementById("newInvoiceTypeOption").value = "";
            await loadDropdownOptions("invoiceType");
        }
    });
    document.getElementById("invoiceTypeOptionsList").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const option = e.target.dataset.option;
            const currentOptions = await getDropdownOptions("invoiceType");
            const updatedOptions = currentOptions.filter(opt => opt !== option);
            await saveDropdownOptions("invoiceType", updatedOptions);
            await loadDropdownOptions("invoiceType");
        }
    });

    await loadSuppliers();
    document.getElementById("addSupplierBtn").addEventListener("click", async () => {
        const name = document.getElementById("newSupplierName").value;
        if (name) {
            await addSupplier(name);
            document.getElementById("newSupplierName").value = "";
            await loadSuppliers();
        }
    });
    document.getElementById("supplierList").addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-btn")) {
            await deleteSupplier(e.target.dataset.id);
            await loadSuppliers();
        }
    });

    const currentConfig = await getConfig();
    document.getElementById("primaryColorInput").value = currentConfig.primaryColor;
    document.getElementById("secondaryColorInput").value = currentConfig.secondaryColor;
    document.getElementById("logoUrlInput").value = currentConfig.logoUrl;
    document.getElementById("currencySymbolInput").value = currentConfig.currencySymbol;

    document.getElementById("saveVisualConfigBtn").addEventListener("click", async () => {
        const newConfig = {
            primaryColor: document.getElementById("primaryColorInput").value,
            secondaryColor: document.getElementById("secondaryColorInput").value,
            logoUrl: document.getElementById("logoUrlInput").value,
            currencySymbol: document.getElementById("currencySymbolInput").value,
        };
        await saveConfig(newConfig);
        applyConfig(newConfig);
        alert("Configuration visuelle enregistrée et appliquée!");
    });
};

// Helper functions for admin panel rendering
const loadAccessCodes = async () => {
    const codes = await getAccessCodes();
    const ul = document.getElementById("adminCodeList");
    ul.innerHTML = codes.map(code => `<li>${code.code} (Utilisé: ${code.used ? 'Oui' : 'Non'}) <button class="btn btn-danger delete-btn" data-id="${code.id}">Supprimer</button></li>`).join('');
};

const loadCustomFields = async (type) => {
    const fields = await getDynamicFields(type);
    const ul = document.getElementById(`${type}FieldsList`);
    ul.innerHTML = fields.map(field => `<li>${field.label} (${field.name}, ${field.fieldType}) <button class="btn btn-danger delete-btn" data-name="${field.name}">Supprimer</button></li>`).join('');
};

const loadDropdownOptions = async (category) => {
    const options = await getDropdownOptions(category);
    const ul = document.getElementById(`${category}OptionsList`);
    ul.innerHTML = options.map(option => `<li>${option} <button class="btn btn-danger delete-btn" data-option="${option}">Supprimer</button></li>`).join('');
};

const loadSuppliers = async () => {
    const suppliers = await getSuppliers();
    const ul = document.getElementById("supplierList");
    ul.innerHTML = suppliers.map(supplier => `<li>${supplier.name} <button class="btn btn-danger delete-btn" data-id="${supplier.id}">Supprimer</button></li>`).join('');
};
