import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Developer, Timesheet, Statistics } from '@/types/database'

export default function Home() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    total_developers: 0,
    total_hours: 0,
    total_entries: 0,
    hours_by_type: {},
    hours_by_project: {}
  })
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [devsRes, tsRes, statsRes] = await Promise.all([
        fetch('/api/developers'),
        fetch('/api/timesheets'),
        fetch('/api/statistics')
      ])

      const devsData = await devsRes.json()
      const tsData = await tsRes.json()
      const statsData = await statsRes.json()

      setDevelopers(devsData)
      setTimesheets(tsData)
      setStatistics(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
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

  const filteredTimesheets = selectedDeveloper
    ? timesheets.filter(ts => ts.developer_id === parseInt(selectedDeveloper))
    : timesheets

  const getStatusClass = (status: string) => {
    return `status-${status.toLowerCase().replace(' ', '-')}`
  }

  const renderTypeChart = () => {
    const data = statistics.hours_by_type
    if (Object.keys(data).length === 0) {
      return <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No hay datos disponibles</p>
    }

    const maxValue = Math.max(...Object.values(data))
    const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

    return Object.entries(data).map(([type, hours], index) => {
      const percentage = (hours / maxValue) * 100
      const color = colors[index % colors.length]
      return (
        <div className="chart-item" key={type}>
          <div className="chart-label">{type}</div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{ width: `${percentage}%`, background: color }}></div>
            <span className="chart-value">{hours}h</span>
          </div>
        </div>
      )
    })
  }

  const renderProjectChart = () => {
    const data = statistics.hours_by_project
    if (Object.keys(data).length === 0) {
      return <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No hay datos disponibles</p>
    }

    const maxValue = Math.max(...Object.values(data))
    const colors = ['#10b981', '#f59e0b', '#6366f1', '#0ea5e9', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

    return Object.entries(data).map(([project, hours], index) => {
      const percentage = (hours / maxValue) * 100
      const color = colors[index % colors.length]
      return (
        <div className="chart-item" key={project}>
          <div className="chart-label">{truncateText(project, 15)}</div>
          <div className="chart-bar-container">
            <div className="chart-bar" style={{ width: `${percentage}%`, background: color }}></div>
            <span className="chart-value">{hours}h</span>
          </div>
        </div>
      )
    })
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
        <title>Developer Timesheet - Vista</title>
      </Head>

      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <i className="fas fa-clock"></i>
            <span>DevTimesheet</span>
          </div>
          <div className="nav-links">
            <Link href="/" className="active">Vista</Link>
            <Link href="/admin">Admin Panel</Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="page-header">
          <h1>Hojas de Trabajo de Desarrolladores</h1>
          <p>Visualiza el registro de actividades y horas trabajadas</p>
        </header>

        {/* Statistics Cards */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{statistics.total_developers}</h3>
                <p>Desarrolladores</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <h3>{statistics.total_hours}</h3>
                <p>Horas Totales</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-tasks"></i>
              </div>
              <div className="stat-info">
                <h3>{statistics.total_entries}</h3>
                <p>Registros</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <div className="filter-group">
            <label htmlFor="developerFilter">Filtrar por Desarrollador:</label>
            <select
              id="developerFilter"
              value={selectedDeveloper}
              onChange={(e) => setSelectedDeveloper(e.target.value)}
            >
              <option value="">Todos los desarrolladores</option>
              {developers.map(dev => (
                <option key={dev.id} value={dev.id}>{dev.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Developer Cards */}
        <section className="developers-section">
          {developers.length === 0 ? (
            <div className="no-data-message">
              <i className="fas fa-users"></i>
              <p>No hay desarrolladores registrados. Ve al panel de administración para agregar desarrolladores.</p>
            </div>
          ) : (
            developers.map(dev => {
              const devTimesheets = timesheets.filter(ts => ts.developer_id === dev.id)
              const totalHours = devTimesheets.reduce((sum, ts) => sum + ts.hours_worked, 0)
              const totalTasks = devTimesheets.length
              const initials = dev.name.split(' ').map(n => n[0]).join('').substring(0, 2)

              return (
                <div className="developer-card" key={dev.id}>
                  <div className="dev-header">
                    <div className="dev-avatar">
                      {dev.avatar_url ? (
                        <img src={dev.avatar_url} alt={dev.name} />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="dev-info">
                      <h3>{dev.name}</h3>
                      <p>{dev.position} - {dev.department}</p>
                    </div>
                  </div>
                  <div className="dev-stats">
                    <div className="dev-stat">
                      <div className="dev-stat-value">{totalHours.toFixed(1)}</div>
                      <div className="dev-stat-label">Horas</div>
                    </div>
                    <div className="dev-stat">
                      <div className="dev-stat-value">{totalTasks}</div>
                      <div className="dev-stat-label">Tareas</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </section>

        {/* Timesheets Table */}
        <section className="timesheets-section">
          <div className="section-header">
            <h2><i className="fas fa-table"></i> Registros de Tiempo</h2>
          </div>
          <div className="table-container">
            <table className="elegant-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Desarrollador</th>
                  <th>Proyecto</th>
                  <th>Tarea</th>
                  <th>Tipo</th>
                  <th>Horas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimesheets.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <i className="fas fa-clock" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5, display: 'block' }}></i>
                      No hay registros de tiempo disponibles.
                    </td>
                  </tr>
                ) : (
                  filteredTimesheets.map(ts => (
                    <tr key={ts.id}>
                      <td>{formatDate(ts.date)}</td>
                      <td>{ts.developer_name}</td>
                      <td>{ts.project_name}</td>
                      <td>{truncateText(ts.task_description, 50)}</td>
                      <td><span className="type-badge">{ts.task_type}</span></td>
                      <td><strong>{ts.hours_worked}h</strong></td>
                      <td><span className={`status-badge ${getStatusClass(ts.status)}`}>{ts.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <div className="chart-card">
            <h3><i className="fas fa-chart-pie"></i> Horas por Tipo de Tarea</h3>
            <div className="chart-container">
              {renderTypeChart()}
            </div>
          </div>
          <div className="chart-card">
            <h3><i className="fas fa-chart-bar"></i> Horas por Proyecto</h3>
            <div className="chart-container">
              {renderProjectChart()}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 DevTimesheet - Sistema de Gestión de Hojas de Trabajo</p>
      </footer>
    </>
  )
}
