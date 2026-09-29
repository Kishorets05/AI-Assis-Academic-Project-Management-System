import React from 'react';
import { 
  Sparkles, 
  GraduationCap, 
  UserCheck, 
  Shield, 
  ArrowRight, 
  UserPlus,
  CheckCircle2
} from 'lucide-react';

const LandingPage = ({ onOpenLogin, onOpenRegister }) => {
  return (
    <div className="landing-container">
      {/* Clean Hero Section */}
      <div className="hero-banner">
        <div className="hero-pill-badge">
          <Sparkles size={15} />
          <span>Academic Project Tracking & Management System</span>
        </div>

        <h1 className="hero-heading">
          PROJINTEL
        </h1>

        <p className="hero-subheading">
          Streamlined Capstone & Final-Year Project Lifecycle Management
        </p>

        <p className="hero-description">
          A centralized, role-based platform connecting students, faculty guides, and academic administrators for proposal approvals, milestone tracking, task management, weekly updates, and evaluation.
        </p>

        <div className="hero-cta-group">
          <button className="btn-aesthetic btn-glass-secondary btn-lg" onClick={onOpenRegister}>
            <UserPlus size={18} />
            <span>Create Account</span>
          </button>
          <button className="btn-aesthetic btn-primary-glow btn-lg" onClick={onOpenLogin}>
            <span>Portal Sign In</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Role-Based Overview Cards */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className="role-cards-section-title">
          <h2>Institutional Portals & Roles</h2>
          <p>Comprehensive role-based workspaces tailored for students, faculty guides, and academic administrators.</p>
        </div>

        <div className="role-preview-grid">
          {/* Student Card */}
          <div className="role-preview-card">
            <div>
              <div className="role-card-badge" style={{ background: 'var(--gradient-primary)' }}>
                <GraduationCap size={22} />
              </div>
              <h3 className="role-card-title">Student Workspace</h3>
              <p className="role-card-desc">
                Submit project proposals, manage milestone tasks, submit weekly progress reports, and upload documentation.
              </p>
              <ul className="role-features-list">
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Proposal submission & revisions</li>
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> 8 Standard milestone trackers & tasks</li>
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Weekly progress submissions & feedback</li>
              </ul>
            </div>
          </div>

          {/* Faculty Guide Card */}
          <div className="role-preview-card">
            <div>
              <div className="role-card-badge" style={{ background: 'var(--gradient-accent)' }}>
                <UserCheck size={22} />
              </div>
              <h3 className="role-card-title">Faculty Guide Portal</h3>
              <p className="role-card-desc">
                Review submitted proposals, approve or request revisions, evaluate weekly progress updates, and grade deliverables.
              </p>
              <ul className="role-features-list">
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Proposal review (Approve/Revise/Reject)</li>
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Weekly update grading & feedback</li>
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Document inspection & guidance feed</li>
              </ul>
            </div>
          </div>

          {/* Admin Card */}
          <div className="role-preview-card">
            <div>
              <div className="role-card-badge" style={{ background: 'var(--gradient-emerald)' }}>
                <Shield size={22} />
              </div>
              <h3 className="role-card-title">Academic Admin Cell</h3>
              <p className="role-card-desc">
                Oversee department batches, assign faculty guides to projects, monitor progress statistics, and export marks.
              </p>
              <ul className="role-features-list">
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Faculty guide assignment to projects</li>
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Department-wide KPI statistics</li>
                <li><CheckCircle2 size={15} style={{ color: 'var(--success)' }} /> Student & faculty project rosters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
