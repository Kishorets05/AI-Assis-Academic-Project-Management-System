import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Shield,
  ArrowRight, 
  ArrowLeft,
  Eye, 
  EyeOff, 
  KeyRound, 
  UserPlus, 
  UserCheck, 
  GraduationCap,
  Building,
  User,
  Hash,
  Sparkles
} from 'lucide-react';

const LoginModal = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  onRegisterUser,
  initialMode = 'login' // 'login' | 'register'
}) => {
  const [authMode, setAuthMode] = useState(initialMode); // 'login' | 'register'
  const [loginStep, setLoginStep] = useState('select_role'); // 'select_role' | 'login_form'
  const [role, setRole] = useState('Student'); // 'Student' | 'Faculty' | 'Admin'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('student@vcet.edu.in');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    identifier: '', // Reg No for Student, Staff ID for Faculty
    dept: 'Computer Science & Engineering',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode || 'login');
      setLoginStep('select_role');
      setRegisterError(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'Student') {
      setLoginEmail('student@vcet.edu.in');
      setLoginPassword('password123');
    } else if (selectedRole === 'Faculty') {
      setLoginEmail('guide@vcet.edu.in');
      setLoginPassword('password123');
    } else {
      setLoginEmail('admin@vcet.edu.in');
      setLoginPassword('admin123');
    }
    setLoginStep('login_form');
  };

  const handleRoleSelectForRegister = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      let userData = {
        email: loginEmail,
        role: role
      };

      if (role === 'Student') {
        if (loginEmail.includes('rohan')) {
          userData.name = 'Rohan S';
          userData.regNo = '913121104042';
          userData.dept = 'Artificial Intelligence & Data Science';
          userData.projectId = 'PROJ-03';
        } else if (loginEmail.includes('meena')) {
          userData.name = 'Meena K';
          userData.regNo = '913121105018';
          userData.dept = 'Information Technology';
          userData.projectId = 'PROJ-04';
        } else {
          userData.name = 'Kishore T S';
          userData.regNo = '913121104001';
          userData.dept = 'Computer Science & Engineering';
          userData.projectId = 'PROJ-01';
        }
      } else if (role === 'Faculty') {
        userData.name = 'Dr. A. Sharma (HOD)';
        userData.staffId = 'FAC-102';
        userData.dept = 'Computer Science & Engineering';
      } else {
        userData.name = 'Academic Administration Cell';
        userData.staffId = 'ADM-001';
        userData.dept = 'Dean Academic Office';
      }

      onLoginSuccess(userData);
      onClose();
    }, 300);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterError(null);

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match. Please verify.');
      return;
    }

    if (registerData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        name: registerData.name,
        identifier: registerData.identifier,
        regNo: role === 'Student' ? registerData.identifier : undefined,
        staffId: role === 'Faculty' ? registerData.identifier : undefined,
        dept: registerData.dept,
        email: registerData.email,
        role: role,
        isNewUser: true,
        projectId: null // New registered user does not have a project yet
      };

      if (onRegisterUser) {
        onRegisterUser(newUser);
      }

      onLoginSuccess(newUser);
      onClose();
    }, 400);
  };

  const handleQuickDemoLogin = (targetRole, customEmail, customProjId, customName, customReg) => {
    setRole(targetRole);
    let userData = {
      email: customEmail || (targetRole === 'Student' ? 'student@vcet.edu.in' : targetRole === 'Faculty' ? 'guide@vcet.edu.in' : 'admin@vcet.edu.in'),
      role: targetRole
    };

    if (targetRole === 'Student') {
      userData.name = customName || 'Kishore T S';
      userData.regNo = customReg || '913121104001';
      userData.projectId = customProjId || 'PROJ-01';
      userData.dept = customProjId === 'PROJ-03' ? 'Artificial Intelligence & Data Science' : customProjId === 'PROJ-04' ? 'Information Technology' : 'Computer Science & Engineering';
    } else if (targetRole === 'Faculty') {
      userData.name = 'Dr. A. Sharma (HOD)';
      userData.staffId = 'FAC-102';
      userData.dept = 'Computer Science & Engineering';
    } else {
      userData.name = 'Academic Administration Cell';
      userData.staffId = 'ADM-001';
      userData.dept = 'Dean Academic Office';
    }

    onLoginSuccess(userData);
    onClose();
  };

  // Determine modal max width depending on mode & step
  const modalMaxWidth = authMode === 'register' 
    ? '500px' 
    : loginStep === 'select_role' 
      ? '680px' 
      : '440px';

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div 
        className="aesthetic-modal-card" 
        style={{ 
          maxWidth: modalMaxWidth, 
          maxHeight: 'calc(100vh - 2.5rem)',
          overflowY: 'auto',
          padding: '1.75rem', 
          transition: 'all 0.25s ease' 
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={16} />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: SIGN IN - STEP 1: ROLE SELECTION SCREEN              */}
        {/* ------------------------------------------------------------- */}
        {authMode === 'login' && loginStep === 'select_role' && (
          <div className="role-selection-wrapper">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div className="brand-icon" style={{ margin: '0 auto 0.6rem', width: 42, height: 42 }}>
                <Sparkles size={20} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Sign In</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                Select your role to continue.
              </p>
            </div>

            {/* 3 Role Selection Cards */}
            <div className="role-select-grid">
              {/* Role 1: Student */}
              <div 
                className="role-select-card role-select-card-student"
                onClick={() => handleRoleSelection('Student')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRoleSelection('Student'); }}
              >
                <div>
                  <div className="role-select-badge" style={{ background: 'var(--gradient-primary)' }}>
                    <GraduationCap size={22} />
                  </div>
                  <h3 className="role-select-title">Student</h3>
                  <p className="role-select-desc">
                    Access project workspace, tasks, milestones, submissions and progress.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-aesthetic btn-primary-glow role-select-action-btn"
                  onClick={(e) => { e.stopPropagation(); handleRoleSelection('Student'); }}
                >
                  <span>Continue as Student</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Role 2: Faculty */}
              <div 
                className="role-select-card role-select-card-faculty"
                onClick={() => handleRoleSelection('Faculty')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRoleSelection('Faculty'); }}
              >
                <div>
                  <div className="role-select-badge" style={{ background: 'var(--gradient-accent)' }}>
                    <UserCheck size={22} />
                  </div>
                  <h3 className="role-select-title">Faculty</h3>
                  <p className="role-select-desc">
                    Review projects, monitor progress, provide feedback and manage supervised projects.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-aesthetic btn-accent role-select-action-btn"
                  onClick={(e) => { e.stopPropagation(); handleRoleSelection('Faculty'); }}
                >
                  <span>Continue as Faculty</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Role 3: Admin */}
              <div 
                className="role-select-card role-select-card-admin"
                onClick={() => handleRoleSelection('Admin')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRoleSelection('Admin'); }}
              >
                <div>
                  <div className="role-select-badge" style={{ background: 'var(--gradient-emerald)' }}>
                    <Shield size={22} />
                  </div>
                  <h3 className="role-select-title">Admin</h3>
                  <p className="role-select-desc">
                    Manage academic projects, users, assignments, batches and institutional monitoring.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-aesthetic btn-emerald role-select-action-btn"
                  onClick={(e) => { e.stopPropagation(); handleRoleSelection('Admin'); }}
                >
                  <span>Continue as Admin</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Footer switcher to Register */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Don't have an institutional account?{' '}
              </span>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setRegisterError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Register here
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: SIGN IN - STEP 2: ROLE LOGIN FORM                    */}
        {/* ------------------------------------------------------------- */}
        {authMode === 'login' && loginStep === 'login_form' && (
          <div>
            {/* Top Navigation: Back to Role Selection */}
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="role-back-nav-btn"
                onClick={() => setLoginStep('select_role')}
                title="Return to role selection"
              >
                <ArrowLeft size={14} />
                <span>Change Role</span>
              </button>
              <span className={`user-role-tag role-tag-${role.toLowerCase()}`}>
                {role} Portal
              </span>
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div 
                className="role-card-badge" 
                style={{ 
                  margin: '0 auto 0.5rem', 
                  width: 40, 
                  height: 40,
                  background: role === 'Student' ? 'var(--gradient-primary)' : role === 'Faculty' ? 'var(--gradient-accent)' : 'var(--gradient-emerald)'
                }}
              >
                {role === 'Student' ? <GraduationCap size={20} /> : role === 'Faculty' ? <UserCheck size={20} /> : <ShieldCheck size={20} />}
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {role === 'Student' ? 'Student Workspace' : role === 'Faculty' ? 'Faculty Guide Portal' : 'Academic Admin Cell'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                Enter your institutional credentials to sign in
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '0.9rem' }}>
                <label className="form-label">Institutional Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={16} />
                  <input
                    type="email"
                    required
                    placeholder={role === 'Student' ? 'student@vcet.edu.in' : role === 'Faculty' ? 'faculty@vcet.edu.in' : 'admin@vcet.edu.in'}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="aesthetic-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="aesthetic-input"
                  />
                  <span
                    className="input-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-aesthetic btn-primary-glow"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
              >
                {isLoading ? 'Signing in...' : `Sign In as ${role}`}
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Demo Presets */}
            <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <KeyRound size={13} />
                <span>DEMO ONE-CLICK LOGIN PRESETS:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="demo-pill" 
                  onClick={() => handleQuickDemoLogin('Student', 'student@vcet.edu.in', 'PROJ-01', 'Kishore T S', '913121104001')}
                >
                  Student (Approved)
                </button>
                <button 
                  type="button" 
                  className="demo-pill" 
                  onClick={() => handleQuickDemoLogin('Student', 'rohan@vcet.edu.in', 'PROJ-03', 'Rohan S', '913121104042')}
                >
                  Student (Under Review)
                </button>
                <button 
                  type="button" 
                  className="demo-pill" 
                  onClick={() => handleQuickDemoLogin('Student', 'meena@vcet.edu.in', 'PROJ-04', 'Meena K', '913121105018')}
                >
                  Student (Revision Req)
                </button>
                <button 
                  type="button" 
                  className="demo-pill" 
                  onClick={() => handleQuickDemoLogin('Faculty', 'guide@vcet.edu.in')}
                >
                  Faculty Guide
                </button>
                <button 
                  type="button" 
                  className="demo-pill" 
                  onClick={() => handleQuickDemoLogin('Admin', 'admin@vcet.edu.in')}
                >
                  Admin Cell
                </button>
              </div>
            </div>

            {/* Switcher to Register */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Don't have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setRegisterError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: REGISTER MODE                                         */}
        {/* ------------------------------------------------------------- */}
        {authMode === 'register' && (
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div className="brand-icon" style={{ margin: '0 auto 0.5rem', width: 38, height: 38 }}>
                <UserPlus size={20} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Create Account</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
                Register an institutional account to get started
              </p>
            </div>

            {/* Role Switcher Tabs for Register (Student vs Faculty) */}
            <div className="role-tab-selector" style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                className={`role-tab-btn ${role === 'Student' ? 'active' : ''}`}
                onClick={() => handleRoleSelectForRegister('Student')}
                style={{ fontSize: '0.775rem', padding: '0.45rem' }}
              >
                <GraduationCap size={15} />
                <span>Student Account</span>
              </button>
              <button
                type="button"
                className={`role-tab-btn ${role === 'Faculty' ? 'active' : ''}`}
                onClick={() => handleRoleSelectForRegister('Faculty')}
                style={{ fontSize: '0.775rem', padding: '0.45rem' }}
              >
                <UserCheck size={15} />
                <span>Faculty Account</span>
              </button>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegisterSubmit}>
              {registerError && (
                <div style={{ 
                  padding: '0.65rem 0.85rem', 
                  background: 'rgba(239, 68, 68, 0.15)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  borderRadius: 'var(--radius-md)', 
                  color: '#EF4444', 
                  fontSize: '0.8rem', 
                  marginBottom: '1rem' 
                }}>
                  {registerError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={15} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Varun R"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="aesthetic-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{role === 'Student' ? 'Register Number' : 'Faculty Staff ID'}</label>
                  <div className="input-wrapper">
                    <Hash className="input-icon" size={15} />
                    <input
                      type="text"
                      required
                      placeholder={role === 'Student' ? 'e.g. 913121104088' : 'e.g. FAC-108'}
                      value={registerData.identifier}
                      onChange={(e) => setRegisterData({ ...registerData, identifier: e.target.value })}
                      className="aesthetic-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Department</label>
                <div className="input-wrapper">
                  <Building className="input-icon" size={15} />
                  <select
                    value={registerData.dept}
                    onChange={(e) => setRegisterData({ ...registerData, dept: e.target.value })}
                    className="aesthetic-input"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label className="form-label">Institutional Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={15} />
                  <input
                    type="email"
                    required
                    placeholder={role === 'Student' ? 'student.name@vcet.edu.in' : 'faculty.name@vcet.edu.in'}
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="aesthetic-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={15} />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 chars"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="aesthetic-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={15} />
                    <input
                      type="password"
                      required
                      placeholder="Confirm password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      className="aesthetic-input"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-aesthetic btn-primary-glow"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
              >
                {isLoading ? 'Creating Account...' : `Register ${role} Account`}
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Switcher to Sign In */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setLoginStep('select_role'); setRegisterError(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
