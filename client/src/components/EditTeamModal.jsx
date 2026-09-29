import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, CheckCircle2, Layers, BookOpen, Users, Code, Building, Target } from 'lucide-react';

const EditTeamModal = ({ isOpen, onClose, team, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    dept: 'Computer Science & Engineering',
    domain: 'Artificial Intelligence & Machine Learning',
    problemStatement: '',
    objectives: '',
    abstract: '',
    technologies: '',
    teamMembers: ''
  });

  useEffect(() => {
    if (team) {
      setFormData({
        title: team.title || '',
        dept: team.dept || 'Computer Science & Engineering',
        domain: team.domain || 'Artificial Intelligence & Machine Learning',
        problemStatement: team.problemStatement || '',
        objectives: team.objectives || '',
        abstract: team.abstract || team.description || '',
        technologies: team.technologies || team.techStack || '',
        teamMembers: Array.isArray(team.teamMembers) 
          ? team.teamMembers.join(', ') 
          : (Array.isArray(team.members) ? team.members.join(', ') : (team.teamMembers || team.members || ''))
      });
    }
  }, [team]);

  if (!isOpen || !team) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMembers = formData.teamMembers
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    onSave({
      ...team,
      title: formData.title,
      dept: formData.dept,
      domain: formData.domain,
      problemStatement: formData.problemStatement,
      objectives: formData.objectives,
      abstract: formData.abstract,
      description: formData.abstract,
      technologies: formData.technologies,
      techStack: formData.technologies,
      teamMembers: updatedMembers.length > 0 ? updatedMembers : team.teamMembers,
      members: updatedMembers.length > 0 ? updatedMembers : team.members,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="aesthetic-modal-card" 
        style={{ maxWidth: '620px', maxHeight: 'calc(100vh - 2.5rem)', overflowY: 'auto', padding: '1.75rem' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="brand-icon" style={{ background: 'var(--gradient-primary)' }}>
            <Edit3 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Update Project Proposal Details</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Alterations will immediately sync to the faculty guide and department portal.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Project Title *</label>
            <div className="input-wrapper">
              <BookOpen className="input-icon" size={16} />
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="aesthetic-input"
                placeholder="Enter project title"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={16} />
                <select
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  className="aesthetic-input"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Electrical & Electronics">EEE</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Domain</label>
              <div className="input-wrapper">
                <Layers className="input-icon" size={16} />
                <input
                  type="text"
                  required
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="aesthetic-input"
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Technologies & Frameworks</label>
            <div className="input-wrapper">
              <Code className="input-icon" size={16} />
              <input
                type="text"
                required
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="aesthetic-input"
                placeholder="e.g. React, Node.js, Express, MongoDB"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Problem Statement</label>
            <textarea
              rows="2"
              required
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              className="aesthetic-input"
              style={{ padding: '0.55rem 0.85rem', resize: 'vertical' }}
              placeholder="What core problem is solved?"
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Key Objectives</label>
            <textarea
              rows="2"
              required
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              className="aesthetic-input"
              style={{ padding: '0.55rem 0.85rem', resize: 'vertical' }}
              placeholder="List project objectives..."
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Team Members (Comma Separated)</label>
            <div className="input-wrapper">
              <Users className="input-icon" size={16} />
              <input
                type="text"
                required
                value={formData.teamMembers}
                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                className="aesthetic-input"
                placeholder="e.g. Kishore T S, Praveen S, Sanjay V"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Abstract / Project Summary</label>
            <textarea
              rows="2"
              required
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              className="aesthetic-input"
              style={{ padding: '0.55rem 0.85rem', resize: 'vertical' }}
              placeholder="Describe methodology and deliverables..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-aesthetic btn-primary-glow"
            style={{ width: '100%', padding: '0.7rem' }}
          >
            <Save size={16} />
            <span>Save & Reflect Alterations</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTeamModal;
