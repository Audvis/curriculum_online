// API Base URL
const API_URL = '';

// State
let developers = [];
let timesheets = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupTabs();
});

// Setup tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
}

// Load all data
async function loadData() {
    try {
        await Promise.all([
            loadDevelopers(),
            loadTimesheets()
        ]);
        renderDevelopersTable();
        renderTimesheetsTable();
        populateDeveloperSelect();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error al cargar los datos');
    }
}

// Load developers
async function loadDevelopers() {
    const response = await fetch(`${API_URL}/api/developers`);
    developers = await response.json();
}

// Load timesheets
async function loadTimesheets() {
    const response = await fetch(`${API_URL}/api/timesheets`);
    timesheets = await response.json();
}

// Render developers table
function renderDevelopersTable() {
    const tbody = document.getElementById('developersAdminTable');

    if (developers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    No hay desarrolladores registrados
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = developers.map(dev => `
        <tr>
            <td>${dev.id}</td>
            <td><strong>${dev.name}</strong></td>
            <td>${dev.email}</td>
            <td>${dev.position}</td>
            <td>${dev.department}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-icon btn-edit" onclick="editDeveloper(${dev.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-delete" onclick="deleteDeveloper(${dev.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render timesheets table
function renderTimesheetsTable() {
    const tbody = document.getElementById('timesheetsAdminTable');

    if (timesheets.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    No hay registros de tiempo
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = timesheets.map(ts => `
        <tr>
            <td>${ts.id}</td>
            <td>${formatDate(ts.date)}</td>
            <td>${ts.developer_name}</td>
            <td>${truncateText(ts.project_name, 20)}</td>
            <td><span class="type-badge">${ts.task_type}</span></td>
            <td><strong>${ts.hours_worked}h</strong></td>
            <td><span class="status-badge status-${ts.status.toLowerCase().replace(' ', '-')}">${ts.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-icon btn-edit" onclick="editTimesheet(${ts.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-delete" onclick="deleteTimesheet(${ts.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Populate developer select in timesheet form
function populateDeveloperSelect() {
    const select = document.getElementById('tsDeveloper');
    select.innerHTML = '<option value="">Seleccionar desarrollador</option>';

    developers.forEach(dev => {
        const option = document.createElement('option');
        option.value = dev.id;
        option.textContent = dev.name;
        select.appendChild(option);
    });
}

// Developer Modal Functions
function openDeveloperModal() {
    document.getElementById('developerModalTitle').textContent = 'Nuevo Desarrollador';
    document.getElementById('developerForm').reset();
    document.getElementById('developerId').value = '';
    document.getElementById('developerModal').classList.add('active');
}

function closeDeveloperModal() {
    document.getElementById('developerModal').classList.remove('active');
}

function editDeveloper(id) {
    const developer = developers.find(d => d.id === id);
    if (!developer) return;

    document.getElementById('developerModalTitle').textContent = 'Editar Desarrollador';
    document.getElementById('developerId').value = developer.id;
    document.getElementById('devName').value = developer.name;
    document.getElementById('devEmail').value = developer.email;
    document.getElementById('devPosition').value = developer.position;
    document.getElementById('devDepartment').value = developer.department;
    document.getElementById('devAvatar').value = developer.avatar_url || '';

    document.getElementById('developerModal').classList.add('active');
}

async function saveDeveloper(event) {
    event.preventDefault();

    const id = document.getElementById('developerId').value;
    const data = {
        name: document.getElementById('devName').value,
        email: document.getElementById('devEmail').value,
        position: document.getElementById('devPosition').value,
        department: document.getElementById('devDepartment').value,
        avatar_url: document.getElementById('devAvatar').value
    };

    try {
        let response;
        if (id) {
            // Update existing
            response = await fetch(`${API_URL}/api/developers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create new
            response = await fetch(`${API_URL}/api/developers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            closeDeveloperModal();
            await loadDevelopers();
            renderDevelopersTable();
            populateDeveloperSelect();
            alert(id ? 'Desarrollador actualizado exitosamente' : 'Desarrollador creado exitosamente');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'No se pudo guardar'));
        }
    } catch (error) {
        console.error('Error saving developer:', error);
        alert('Error al guardar el desarrollador');
    }
}

async function deleteDeveloper(id) {
    if (!confirm('¿Estás seguro de eliminar este desarrollador? Se eliminarán también todos sus registros de tiempo.')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/developers/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadData();
            alert('Desarrollador eliminado exitosamente');
        } else {
            alert('Error al eliminar el desarrollador');
        }
    } catch (error) {
        console.error('Error deleting developer:', error);
        alert('Error al eliminar el desarrollador');
    }
}

// Timesheet Modal Functions
function openTimesheetModal() {
    if (developers.length === 0) {
        alert('Primero debes agregar al menos un desarrollador');
        return;
    }

    document.getElementById('timesheetModalTitle').textContent = 'Nuevo Registro de Tiempo';
    document.getElementById('timesheetForm').reset();
    document.getElementById('timesheetId').value = '';
    document.getElementById('tsDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('timesheetModal').classList.add('active');
}

function closeTimesheetModal() {
    document.getElementById('timesheetModal').classList.remove('active');
}

function editTimesheet(id) {
    const timesheet = timesheets.find(t => t.id === id);
    if (!timesheet) return;

    document.getElementById('timesheetModalTitle').textContent = 'Editar Registro de Tiempo';
    document.getElementById('timesheetId').value = timesheet.id;
    document.getElementById('tsDeveloper').value = timesheet.developer_id;
    document.getElementById('tsDate').value = timesheet.date;
    document.getElementById('tsProject').value = timesheet.project_name;
    document.getElementById('tsDescription').value = timesheet.task_description;
    document.getElementById('tsHours').value = timesheet.hours_worked;
    document.getElementById('tsType').value = timesheet.task_type;
    document.getElementById('tsStatus').value = timesheet.status;
    document.getElementById('tsNotes').value = timesheet.notes || '';

    document.getElementById('timesheetModal').classList.add('active');
}

async function saveTimesheet(event) {
    event.preventDefault();

    const id = document.getElementById('timesheetId').value;
    const data = {
        developer_id: parseInt(document.getElementById('tsDeveloper').value),
        date: document.getElementById('tsDate').value,
        project_name: document.getElementById('tsProject').value,
        task_description: document.getElementById('tsDescription').value,
        hours_worked: parseFloat(document.getElementById('tsHours').value),
        task_type: document.getElementById('tsType').value,
        status: document.getElementById('tsStatus').value,
        notes: document.getElementById('tsNotes').value
    };

    try {
        let response;
        if (id) {
            // Update existing
            response = await fetch(`${API_URL}/api/timesheets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create new
            response = await fetch(`${API_URL}/api/timesheets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            closeTimesheetModal();
            await loadTimesheets();
            renderTimesheetsTable();
            alert(id ? 'Registro actualizado exitosamente' : 'Registro creado exitosamente');
        } else {
            const error = await response.json();
            alert('Error: ' + (error.message || 'No se pudo guardar'));
        }
    } catch (error) {
        console.error('Error saving timesheet:', error);
        alert('Error al guardar el registro');
    }
}

async function deleteTimesheet(id) {
    if (!confirm('¿Estás seguro de eliminar este registro de tiempo?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/timesheets/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadTimesheets();
            renderTimesheetsTable();
            alert('Registro eliminado exitosamente');
        } else {
            alert('Error al eliminar el registro');
        }
    } catch (error) {
        console.error('Error deleting timesheet:', error);
        alert('Error al eliminar el registro');
    }
}

// Utility functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDeveloperModal();
        closeTimesheetModal();
    }
});
