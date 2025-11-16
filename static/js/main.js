// API Base URL
const API_URL = '';

// State
let developers = [];
let timesheets = [];
let statistics = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    const filterSelect = document.getElementById('developerFilter');
    filterSelect.addEventListener('change', filterTimesheets);
}

// Load all data
async function loadData() {
    try {
        await Promise.all([
            loadDevelopers(),
            loadTimesheets(),
            loadStatistics()
        ]);
        renderDeveloperCards();
        renderTimesheetsTable();
        renderCharts();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Load developers
async function loadDevelopers() {
    const response = await fetch(`${API_URL}/api/developers`);
    developers = await response.json();
    populateDeveloperFilter();
}

// Load timesheets
async function loadTimesheets() {
    const response = await fetch(`${API_URL}/api/timesheets`);
    timesheets = await response.json();
}

// Load statistics
async function loadStatistics() {
    const response = await fetch(`${API_URL}/api/statistics`);
    statistics = await response.json();
    updateStatisticsCards();
}

// Update statistics cards
function updateStatisticsCards() {
    document.getElementById('totalDevelopers').textContent = statistics.total_developers || 0;
    document.getElementById('totalHours').textContent = statistics.total_hours || 0;
    document.getElementById('totalEntries').textContent = statistics.total_entries || 0;
}

// Populate developer filter
function populateDeveloperFilter() {
    const filterSelect = document.getElementById('developerFilter');
    filterSelect.innerHTML = '<option value="">Todos los desarrolladores</option>';

    developers.forEach(dev => {
        const option = document.createElement('option');
        option.value = dev.id;
        option.textContent = dev.name;
        filterSelect.appendChild(option);
    });
}

// Render developer cards
function renderDeveloperCards() {
    const container = document.getElementById('developersContainer');
    container.innerHTML = '';

    if (developers.length === 0) {
        container.innerHTML = `
            <div class="no-data-message" style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <p>No hay desarrolladores registrados. Ve al panel de administración para agregar desarrolladores.</p>
            </div>
        `;
        return;
    }

    developers.forEach(dev => {
        const devTimesheets = timesheets.filter(ts => ts.developer_id === dev.id);
        const totalHours = devTimesheets.reduce((sum, ts) => sum + ts.hours_worked, 0);
        const totalTasks = devTimesheets.length;

        const initials = dev.name.split(' ').map(n => n[0]).join('').substring(0, 2);

        const card = document.createElement('div');
        card.className = 'developer-card';
        card.innerHTML = `
            <div class="dev-header">
                <div class="dev-avatar">
                    ${dev.avatar_url ? `<img src="${dev.avatar_url}" alt="${dev.name}">` : initials}
                </div>
                <div class="dev-info">
                    <h3>${dev.name}</h3>
                    <p>${dev.position} - ${dev.department}</p>
                </div>
            </div>
            <div class="dev-stats">
                <div class="dev-stat">
                    <div class="dev-stat-value">${totalHours.toFixed(1)}</div>
                    <div class="dev-stat-label">Horas</div>
                </div>
                <div class="dev-stat">
                    <div class="dev-stat-value">${totalTasks}</div>
                    <div class="dev-stat-label">Tareas</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render timesheets table
function renderTimesheetsTable(filteredTimesheets = null) {
    const tbody = document.getElementById('timesheetsTable');
    const dataToRender = filteredTimesheets || timesheets;

    if (dataToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fas fa-clock" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5; display: block;"></i>
                    No hay registros de tiempo disponibles.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = dataToRender.map(ts => `
        <tr>
            <td>${formatDate(ts.date)}</td>
            <td>${ts.developer_name}</td>
            <td>${ts.project_name}</td>
            <td>${truncateText(ts.task_description, 50)}</td>
            <td><span class="type-badge">${ts.task_type}</span></td>
            <td><strong>${ts.hours_worked}h</strong></td>
            <td><span class="status-badge status-${ts.status.toLowerCase().replace(' ', '-')}">${ts.status}</span></td>
        </tr>
    `).join('');
}

// Filter timesheets by developer
function filterTimesheets() {
    const developerId = document.getElementById('developerFilter').value;

    if (!developerId) {
        renderTimesheetsTable();
    } else {
        const filtered = timesheets.filter(ts => ts.developer_id === parseInt(developerId));
        renderTimesheetsTable(filtered);
    }
}

// Render charts
function renderCharts() {
    renderTypeChart();
    renderProjectChart();
}

// Render hours by type chart
function renderTypeChart() {
    const container = document.getElementById('typeChart');
    const data = statistics.hours_by_type || {};

    if (Object.keys(data).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay datos disponibles</p>';
        return;
    }

    const maxValue = Math.max(...Object.values(data));
    const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    container.innerHTML = Object.entries(data).map(([type, hours], index) => {
        const percentage = (hours / maxValue) * 100;
        const color = colors[index % colors.length];
        return `
            <div class="chart-item">
                <div class="chart-label">${type}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${percentage}%; background: ${color};"></div>
                    <span class="chart-value">${hours}h</span>
                </div>
            </div>
        `;
    }).join('');
}

// Render hours by project chart
function renderProjectChart() {
    const container = document.getElementById('projectChart');
    const data = statistics.hours_by_project || {};

    if (Object.keys(data).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No hay datos disponibles</p>';
        return;
    }

    const maxValue = Math.max(...Object.values(data));
    const colors = ['#10b981', '#f59e0b', '#6366f1', '#0ea5e9', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    container.innerHTML = Object.entries(data).map(([project, hours], index) => {
        const percentage = (hours / maxValue) * 100;
        const color = colors[index % colors.length];
        return `
            <div class="chart-item">
                <div class="chart-label">${truncateText(project, 15)}</div>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${percentage}%; background: ${color};"></div>
                    <span class="chart-value">${hours}h</span>
                </div>
            </div>
        `;
    }).join('');
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
