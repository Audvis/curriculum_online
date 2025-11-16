import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Developer, Timesheet } from '@/types/database'

export default function Admin() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [activeTab, setActiveTab] = useState<'developers' | 'timesheets'>('developers')
  const [loading, setLoading] = useState(true)

  // Developer Modal State
  const [showDeveloperModal, setShowDeveloperModal] = useState(false)
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null)
  const [developerForm, setDeveloperForm] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    avatar_url: ''
  })

  // Timesheet Modal State
  const [showTimesheetModal, setShowTimesheetModal] = useState(false)
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(null)
  const [timesheetForm, setTimesheetForm] = useState({
    developer_id: '',
    date: new Date().toISOString().split('T')[0],
    project_name: '',
    task_description: '',
    hours_worked: '',
    task_type: '',
    status: 'Completed',
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [devsRes, tsRes] = await Promise.all([
        fetch('/api/developers'),
        fetch('/api/timesheets')
      ])

      const devsData = await devsRes.json()
      const tsData = await tsRes.json()

      setDevelopers(devsData)
      setTimesheets(tsData)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getStatusClass = (status: string) => {
    return `status-${status.toLowerCase().replace(' ', '-')}`
  }

  // Developer CRUD
  const openDeveloperModal = (developer?: Developer) => {
    if (developer) {
      setEditingDeveloper(developer)
      setDeveloperForm({
        name: developer.name,
        email: developer.email,
        position: developer.position,
        department: developer.department,
        avatar_url: developer.avatar_url || ''
      })
    } else {
      setEditingDeveloper(null)
      setDeveloperForm({
        name: '',
        email: '',
        position: '',
        department: '',
        avatar_url: ''
      })
    }
    setShowDeveloperModal(true)
  }

  const closeDeveloperModal = () => {
    setShowDeveloperModal(false)
    setEditingDeveloper(null)
  }

  const saveDeveloper = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingDeveloper
        ? `/api/developers/${editingDeveloper.id}`
        : '/api/developers'
      const method = editingDeveloper ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(developerForm)
      })

      if (response.ok) {
        closeDeveloperModal()
        await loadData()
        alert(editingDeveloper ? 'Desarrollador actualizado exitosamente' : 'Desarrollador creado exitosamente')
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'No se pudo guardar'))
      }
    } catch (error) {
      console.error('Error saving developer:', error)
      alert('Error al guardar el desarrollador')
    }
  }

  const deleteDeveloper = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este desarrollador? Se eliminarán también todos sus registros de tiempo.')) {
      return
    }

    try {
      const response = await fetch(`/api/developers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadData()
        alert('Desarrollador eliminado exitosamente')
      } else {
        alert('Error al eliminar el desarrollador')
      }
    } catch (error) {
      console.error('Error deleting developer:', error)
      alert('Error al eliminar el desarrollador')
    }
  }

  // Timesheet CRUD
  const openTimesheetModal = (timesheet?: Timesheet) => {
    if (developers.length === 0) {
      alert('Primero debes agregar al menos un desarrollador')
      return
    }

    if (timesheet) {
      setEditingTimesheet(timesheet)
      setTimesheetForm({
        developer_id: timesheet.developer_id.toString(),
        date: timesheet.date,
        project_name: timesheet.project_name,
        task_description: timesheet.task_description,
        hours_worked: timesheet.hours_worked.toString(),
        task_type: timesheet.task_type,
        status: timesheet.status,
        notes: timesheet.notes || ''
      })
    } else {
      setEditingTimesheet(null)
      setTimesheetForm({
        developer_id: '',
        date: new Date().toISOString().split('T')[0],
        project_name: '',
        task_description: '',
        hours_worked: '',
        task_type: '',
        status: 'Completed',
        notes: ''
      })
    }
    setShowTimesheetModal(true)
  }

  const closeTimesheetModal = () => {
    setShowTimesheetModal(false)
    setEditingTimesheet(null)
  }

  const saveTimesheet = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTimesheet
        ? `/api/timesheets/${editingTimesheet.id}`
        : '/api/timesheets'
      const method = editingTimesheet ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...timesheetForm,
          developer_id: parseInt(timesheetForm.developer_id),
          hours_worked: parseFloat(timesheetForm.hours_worked)
        })
      })

      if (response.ok) {
        closeTimesheetModal()
        await loadData()
        alert(editingTimesheet ? 'Registro actualizado exitosamente' : 'Registro creado exitosamente')
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'No se pudo guardar'))
      }
    } catch (error) {
      console.error('Error saving timesheet:', error)
      alert('Error al guardar el registro')
    }
  }

  const deleteTimesheet = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este registro de tiempo?')) {
      return
    }

    try {
      const response = await fetch(`/api/timesheets/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadData()
        alert('Registro eliminado exitosamente')
      } else {
        alert('Error al eliminar el registro')
      }
    } catch (error) {
      console.error('Error deleting timesheet:', error)
      alert('Error al eliminar el registro')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Developer Timesheet - Panel de Administración</title>
      </Head>

      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <i className="fas fa-clock"></i>
            <span>DevTimesheet</span>
          </div>
          <div className="nav-links">
            <Link href="/">Vista</Link>
            <Link href="/admin" className="active">Admin Panel</Link>
          </div>
        </div>
      </nav>

      <main className="main-content admin-panel">
        <header className="page-header">
          <h1>Panel de Administración</h1>
          <p>Gestiona desarrolladores y registros de tiempo</p>
        </header>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'developers' ? 'active' : ''}`}
            onClick={() => setActiveTab('developers')}
          >
            <i className="fas fa-users"></i> Desarrolladores
          </button>
          <button
            className={`tab-btn ${activeTab === 'timesheets' ? 'active' : ''}`}
            onClick={() => setActiveTab('timesheets')}
          >
            <i className="fas fa-clock"></i> Registros de Tiempo
          </button>
        </div>

        {/* Developers Tab */}
        <section className={`tab-content ${activeTab === 'developers' ? 'active' : ''}`}>
          <div className="section-header">
            <h2>Gestión de Desarrolladores</h2>
            <button className="btn btn-primary" onClick={() => openDeveloperModal()}>
              <i className="fas fa-plus"></i> Nuevo Desarrollador
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Posición</th>
                  <th>Departamento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {developers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No hay desarrolladores registrados
                    </td>
                  </tr>
                ) : (
                  developers.map(dev => (
                    <tr key={dev.id}>
                      <td>{dev.id}</td>
                      <td><strong>{dev.name}</strong></td>
                      <td>{dev.email}</td>
                      <td>{dev.position}</td>
                      <td>{dev.department}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-icon btn-edit"
                            onClick={() => openDeveloperModal(dev)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-icon btn-delete"
                            onClick={() => deleteDeveloper(dev.id)}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Timesheets Tab */}
        <section className={`tab-content ${activeTab === 'timesheets' ? 'active' : ''}`}>
          <div className="section-header">
            <h2>Gestión de Registros de Tiempo</h2>
            <button className="btn btn-primary" onClick={() => openTimesheetModal()}>
              <i className="fas fa-plus"></i> Nuevo Registro
            </button>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Desarrollador</th>
                  <th>Proyecto</th>
                  <th>Tipo</th>
                  <th>Horas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No hay registros de tiempo
                    </td>
                  </tr>
                ) : (
                  timesheets.map(ts => (
                    <tr key={ts.id}>
                      <td>{ts.id}</td>
                      <td>{formatDate(ts.date)}</td>
                      <td>{ts.developer_name}</td>
                      <td>{truncateText(ts.project_name, 20)}</td>
                      <td><span className="type-badge">{ts.task_type}</span></td>
                      <td><strong>{ts.hours_worked}h</strong></td>
                      <td><span className={`status-badge ${getStatusClass(ts.status)}`}>{ts.status}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-icon btn-edit"
                            onClick={() => openTimesheetModal(ts)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-icon btn-delete"
                            onClick={() => deleteTimesheet(ts.id)}
                            title="Eliminar"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Developer Modal */}
      <div className={`modal ${showDeveloperModal ? 'active' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) closeDeveloperModal()
      }}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>{editingDeveloper ? 'Editar Desarrollador' : 'Nuevo Desarrollador'}</h3>
            <button className="close-btn" onClick={closeDeveloperModal}>&times;</button>
          </div>
          <form onSubmit={saveDeveloper} className="form-container">
            <div className="form-group">
              <label htmlFor="devName">Nombre Completo</label>
              <input
                type="text"
                id="devName"
                required
                placeholder="Ej: Juan Pérez"
                value={developerForm.name}
                onChange={(e) => setDeveloperForm({ ...developerForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="devEmail">Email</label>
              <input
                type="email"
                id="devEmail"
                required
                placeholder="Ej: juan@empresa.com"
                value={developerForm.email}
                onChange={(e) => setDeveloperForm({ ...developerForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="devPosition">Posición</label>
              <input
                type="text"
                id="devPosition"
                required
                placeholder="Ej: Senior Developer"
                value={developerForm.position}
                onChange={(e) => setDeveloperForm({ ...developerForm, position: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="devDepartment">Departamento</label>
              <input
                type="text"
                id="devDepartment"
                required
                placeholder="Ej: Desarrollo Backend"
                value={developerForm.department}
                onChange={(e) => setDeveloperForm({ ...developerForm, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="devAvatar">URL Avatar (opcional)</label>
              <input
                type="url"
                id="devAvatar"
                placeholder="https://..."
                value={developerForm.avatar_url}
                onChange={(e) => setDeveloperForm({ ...developerForm, avatar_url: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeDeveloperModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      {/* Timesheet Modal */}
      <div className={`modal ${showTimesheetModal ? 'active' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) closeTimesheetModal()
      }}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>{editingTimesheet ? 'Editar Registro de Tiempo' : 'Nuevo Registro de Tiempo'}</h3>
            <button className="close-btn" onClick={closeTimesheetModal}>&times;</button>
          </div>
          <form onSubmit={saveTimesheet} className="form-container">
            <div className="form-group">
              <label htmlFor="tsDeveloper">Desarrollador</label>
              <select
                id="tsDeveloper"
                required
                value={timesheetForm.developer_id}
                onChange={(e) => setTimesheetForm({ ...timesheetForm, developer_id: e.target.value })}
              >
                <option value="">Seleccionar desarrollador</option>
                {developers.map(dev => (
                  <option key={dev.id} value={dev.id}>{dev.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tsDate">Fecha</label>
              <input
                type="date"
                id="tsDate"
                required
                value={timesheetForm.date}
                onChange={(e) => setTimesheetForm({ ...timesheetForm, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tsProject">Nombre del Proyecto</label>
              <input
                type="text"
                id="tsProject"
                required
                placeholder="Ej: Sistema de Inventario"
                value={timesheetForm.project_name}
                onChange={(e) => setTimesheetForm({ ...timesheetForm, project_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tsDescription">Descripción de la Tarea</label>
              <textarea
                id="tsDescription"
                required
                rows={3}
                placeholder="Describe la tarea realizada..."
                value={timesheetForm.task_description}
                onChange={(e) => setTimesheetForm({ ...timesheetForm, task_description: e.target.value })}
              ></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tsHours">Horas Trabajadas</label>
                <input
                  type="number"
                  id="tsHours"
                  required
                  min="0.5"
                  max="24"
                  step="0.5"
                  placeholder="Ej: 8"
                  value={timesheetForm.hours_worked}
                  onChange={(e) => setTimesheetForm({ ...timesheetForm, hours_worked: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tsType">Tipo de Tarea</label>
                <select
                  id="tsType"
                  required
                  value={timesheetForm.task_type}
                  onChange={(e) => setTimesheetForm({ ...timesheetForm, task_type: e.target.value })}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Development">Desarrollo</option>
                  <option value="Testing">Testing</option>
                  <option value="Code Review">Code Review</option>
                  <option value="Meeting">Reunión</option>
                  <option value="Documentation">Documentación</option>
                  <option value="Bug Fix">Corrección de Bugs</option>
                  <option value="Planning">Planificación</option>
                  <option value="Research">Investigación</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="tsStatus">Estado</label>
              <select
                id="tsStatus"
                required
                value={timesheetForm.status}
                onChange={(e) => setTimesheetForm({ ...timesheetForm, status: e.target.value })}
              >
                <option value="Completed">Completado</option>
                <option value="In Progress">En Progreso</option>
                <option value="Blocked">Bloqueado</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tsNotes">Notas (opcional)</label>
              <textarea
                id="tsNotes"
                rows={2}
                placeholder="Notas adicionales..."
                value={timesheetForm.notes}
                onChange={(e) => setTimesheetForm({ ...timesheetForm, notes: e.target.value })}
              ></textarea>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={closeTimesheetModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2024 DevTimesheet - Sistema de Gestión de Hojas de Trabajo</p>
      </footer>
    </>
  )
}
