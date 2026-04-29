import { useEffect, useMemo, useState } from 'react'
import './App.css'

const emptyForm = {
  name: '',
  email: '',
  course: '',
}

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080'
  const apiUrl = useMemo(() => {
    const normalized = apiBase.endsWith('/')
      ? apiBase.slice(0, -1)
      : apiBase
    return `${normalized}/students`
  }, [apiBase])

  const courseCount = useMemo(() => {
    return new Set(students.map((student) => student.course)).size
  }, [students])

  const refreshStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`Failed to load students (${response.status})`)
      }
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      setError(err.message || 'Unable to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshStudents()
  }, [apiUrl])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course.trim(),
    }

    try {
      const response = await fetch(
        editingId ? `${apiUrl}/${editingId}` : apiUrl,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        throw new Error(`Save failed (${response.status})`)
      }

      await refreshStudents()
      resetForm()
    } catch (err) {
      setError(err.message || 'Unable to save student')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (student) => {
    setEditingId(student.id)
    setForm({
      name: student.name || '',
      email: student.email || '',
      course: student.course || '',
    })
  }

  const handleDelete = async (studentId) => {
    const confirmed = globalThis.confirm('Delete this student?')
    if (!confirmed) {
      return
    }

    setSaving(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/${studentId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`Delete failed (${response.status})`)
      }
      await refreshStudents()
    } catch (err) {
      setError(err.message || 'Unable to delete student')
    } finally {
      setSaving(false)
    }
  }

  let submitLabel = 'Add student'
  if (saving) {
    submitLabel = 'Saving...'
  } else if (editingId) {
    submitLabel = 'Update student'
  }

  let rosterContent = null
  if (loading) {
    rosterContent = <div className="state">Loading students...</div>
  } else if (students.length === 0) {
    rosterContent = (
      <div className="state empty">No students yet. Add your first record.</div>
    )
  } else {
    rosterContent = (
      <div className="cards">
        {students.map((student, index) => (
          <article
            key={student.id}
            className="card"
            style={{ '--delay': `${index * 0.04}s` }}
          >
            <div>
              <p className="card-title">{student.name}</p>
              <p className="card-sub">{student.email}</p>
            </div>
            <div className="card-meta">
              <span className="chip">Course</span>
              <span>{student.course}</span>
            </div>
            <div className="card-actions">
              <button type="button" onClick={() => startEdit(student)}>
                Edit
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(student.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="app">
      <header className="top-bar">
        <div>
          <p className="eyebrow">Student Registry</p>
          <h1 className="title">Spring CRUD Control Center</h1>
          <p className="subtitle">
            Manage students with your Spring Boot API and keep the list in sync
            in real time.
          </p>
        </div>
        <div className="status">
          <div className="badge">
            <span className="dot" aria-hidden="true" /> API ready
          </div>
          <div className="metrics">
            <span>{students.length} students</span>
            <span>{courseCount} courses</span>
          </div>
        </div>
      </header>

      <main className="layout">
        <section className="panel form-panel">
          <div className="panel-header">
            <h2>{editingId ? 'Edit student' : 'New student'}</h2>
            {editingId && (
              <button type="button" className="ghost" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </div>
          <form className="student-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Course</span>
              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Data Structures"
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="primary" disabled={saving}>
                {submitLabel}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Reset
              </button>
            </div>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel list-panel">
          <div className="panel-header">
            <h2>Student roster</h2>
            <button type="button" className="ghost" onClick={refreshStudents}>
              Refresh
            </button>
          </div>

          {rosterContent}
        </section>
      </main>
    </div>
  )
}

export default App
