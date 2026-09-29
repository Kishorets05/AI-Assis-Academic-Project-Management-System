import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Layers, 
  FileText, 
  Code, 
  Users, 
  CheckCircle2, 
  HelpCircle, 
  Target,
  Send,
  Save
} from 'lucide-react';

const NewProjectModal = ({ isOpen, onClose, onCreateProject, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problemStatement: '',
    objectives: '',
    domain: 'Artificial Intelligence & Machine Learning',
    technologies: '',
    teamMembers: user?.name ? `${user.name}` : ''
  });

  if (!isOpen) return null;

  const handleSubmit = (actionType) => {
    if (!formData.title.trim()) return;

    const membersArray = formData.teamMembers
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const projectPayload = {
      id: `PROJ-${Date.now().toString().slice(-4)}`,
      title: formData.title,
      description: formData.description,
      problemStatement: formData.problemStatement,
      objectives: formData.objectives,
      domain: formData.domain,
      technologies: formData.technologies,
      teamMembers: membersArray.length > 0 ? membersArray : [user?.name || 'Student Lead'],
      status: actionType === 'submit' ? 'UNDER_REVIEW' : 'DRAFT',
      submittedDate: actionType === 'submit' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
      guideName: null,
      guideId: null,
      leadName: user?.name || 'Student Lead',
      regNo: user?.regNo || '913121104001',
      dept: user?.dept || 'Computer Science & Engineering',
      email: user?.email || 'student@vcet.edu.in',
      progress: 0,
      tasks: [],
      weeklyUpdates: [],
      documents: [],
      feedback: []
    };

    onCreateProject(projectPayload, actionType);
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="aesthetic-modal-card" 
        style={{ maxWidth: '640px', maxHeight: 'calc(100vh - 2.5rem)', overflowY: 'auto', padding: '1.75rem' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="brand-icon" style={{ background: 'var(--gradient-primary)' }}>
            <FolderPlus size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Create Project Proposal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
              Define scope, problem statement, objectives, and technology stack.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('submit'); }}>
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Autonomous Vision-Guided Health Monitoring System"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="aesthetic-input"
              style={{ paddingLeft: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Project Domain</label>
              <div className="input-wrapper">
                <Layers className="input-icon" size={15} />
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  className="aesthetic-input"
                >
                  <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                  <option value="Internet of Things & Embedded Systems">IoT & Embedded Systems</option>
                  <option value="Cybersecurity & Blockchain">Cybersecurity & Blockchain</option>
                  <option value="Cloud Computing & DevOps">Cloud & DevOps</option>
                  <option value="Computer Vision & Deep Learning">Computer Vision</option>
                  <option value="Full-Stack Web & Mobile Engineering">Web & Mobile Apps</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technologies & Frameworks</label>
              <div className="input-wrapper">
                <Code className="input-icon" size={15} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, PyTorch, React, Node.js"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="aesthetic-input"
                />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Problem Statement *</label>
            <textarea
              rows="2"
              required
              placeholder="What core real-world engineering challenge or inefficiency does this project solve?"
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
              className="aesthetic-input"
              style={{ padding: '0.6rem 0.85rem', resize: 'vertical' }}
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Key Objectives *</label>
            <textarea
              rows="2"
              required
              placeholder="List main targets (e.g. 1. Build sensor mesh, 2. Train neural network, 3. Deploy web interface)"
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              className="aesthetic-input"
              style={{ padding: '0.6rem 0.85rem', resize: 'vertical' }}
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label className="form-label">Project Abstract / Overview *</label>
            <textarea
              rows="2"
              required
              placeholder="Comprehensive summary of methodology, system architecture, and expected deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="aesthetic-input"
              style={{ padding: '0.6rem 0.85rem', resize: 'vertical' }}
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Team Members (Comma Separated)</label>
            <div className="input-wrapper">
              <Users className="input-icon" size={15} />
              <input
                type="text"
                required
                placeholder="e.g. Kishore T S, Praveen S, Sanjay V"
                value={formData.teamMembers}
                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                className="aesthetic-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn-aesthetic btn-glass-secondary" 
              onClick={() => handleSubmit('draft')}
              style={{ padding: '0.65rem 1.1rem' }}
            >
              <Save size={15} />
              <span>Save as Draft</span>
            </button>

            <button 
              type="submit" 
              className="btn-aesthetic btn-primary-glow"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Send size={15} />
              <span>Submit Proposal for Faculty Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
