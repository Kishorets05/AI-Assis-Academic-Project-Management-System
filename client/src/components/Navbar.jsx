import React from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  LogIn, 
  UserPlus,
  Home, 
  LogOut, 
  LayoutDashboard
} from 'lucide-react';

const Navbar = ({ 
  activeView, 
  setActiveView, 
  theme, 
  toggleTheme, 
  user, 
  onOpenLogin, 
  onOpenRegister,
  onLogout 
}) => {
  return (
    <header className="floating-navbar-wrapper">
      <nav className="floating-navbar">
        {/* Left: Brand Logo */}
        <div className="brand-logo-container">
          <div 
            className="brand-logo" 
            onClick={() => setActiveView(user ? 'dashboard' : 'landing')}
            role="button"
            tabIndex={0}
          >
            <div className="brand-icon">
              <Sparkles size={17} />
            </div>
            <span className="brand-text">ProjIntel</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <div className="nav-links-container">
          <ul className="nav-links-group">
            {!user ? (
              /* Unauthenticated Visitor Links */
              <li>
                <button
                  className={`nav-item-link ${activeView === 'landing' ? 'active' : ''}`}
                  onClick={() => setActiveView('landing')}
                >
                  <Home size={15} />
                  <span>Home</span>
                </button>
              </li>
            ) : (
              /* Authenticated Role Links */
              <li>
                <button
                  className={`nav-item-link ${activeView === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveView('dashboard')}
                >
                  <LayoutDashboard size={15} />
                  <span>
                    {user.role === 'Student' ? 'My Project' : user.role === 'Faculty' ? 'Faculty Portal' : 'Admin Cell'}
                  </span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Right: Nav Actions */}
        <div className="nav-actions">
          {/* User Auth Controls */}
          {user ? (
            <div className="user-profile-nav-group">
              <div className="user-profile-chip" title={`${user.name} (${user.role})`}>
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-profile-name">
                  {user.name}
                </span>
                <span className={`user-role-tag role-tag-${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>

              <button 
                className="nav-logout-btn" 
                onClick={onLogout}
                title="Sign Out of Session"
                aria-label="Sign Out"
              >
                <LogOut size={15} />
                <span className="logout-text">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button 
                className="btn-aesthetic btn-glass-secondary btn-sm btn-pill" 
                onClick={onOpenRegister}
                title="Register New Account"
              >
                <UserPlus size={14} />
                <span>Register</span>
              </button>
              <button 
                className="btn-aesthetic btn-primary-glow btn-pill btn-sm" 
                onClick={onOpenLogin}
                title="Sign In"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Theme Switcher Toggle */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
