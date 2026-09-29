import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  FolderGit2, 
  TrendingUp, 
  Download, 
  PieChart, 
  BarChart2, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Building, 
  BookOpen, 
  ArrowRight,
  Filter,
  Sparkles,
  Bot,
  Loader2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  RefreshCw,
  Copy,
  Check,
  X
} from 'lucide-react';
import AIAssistantDrawer from './AIAssistantDrawer';
import { 
  generateAcademicInsights, 
  analyzeFacultyWorkload, 
  recommendFacultyAssignment, 
  analyzeProjectSimilarity 
} from '../services/aiService';

const facultyGuidesList = [
  { id: 'FAC-102', name: 'Dr. A. Sharma (HOD)', dept: 'Computer Science & Engineering', activeProjects: 4, maxProjects: 6 },
  { id: 'FAC-103', name: 'Prof. R. Venkatesh', dept: 'Information Technology', activeProjects: 3, maxProjects: 6 },
  { id: 'FAC-104', name: 'Dr. M. Lakshmi', dept: 'Artificial Intelligence & Data Science', activeProjects: 2, maxProjects: 6 },
  { id: 'FAC-105', name: 'Prof. K. Anand', dept: 'Electronics & Communication', activeProjects: 3, maxProjects: 6 }
];

const AdminDashboard = ({ 
  projectsList = [], 
  onAssignGuide 
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('allocation'); // 'allocation' | 'analytics'

  // AI Assistant Drawer
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');

  // Academic Intelligence State
  const [academicInsights, setAcademicInsights] = useState(null);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  // Faculty Workload AI State
  const [workloadInsights, setWorkloadInsights] = useState(null);
  const [isWorkloadLoading, setIsWorkloadLoading] = useState(false);

  // Faculty Recommendation Modal State
  const [recommendationModalProject, setRecommendationModalProject] = useState(null);
  const [recommendationResult, setRecommendationResult] = useState(null);
  const [isRecommending, setIsRecommending] = useState(false);

  // Similarity Detection Modal State
  const [similarityModalProject, setSimilarityModalProject] = useState(null);
  const [similarityResult, setSimilarityResult] = useState(null);
  const [isCheckingSimilarity, setIsCheckingSimilarity] = useState(false);

  const totalProjects = projectsList.length;
  const activeProjects = projectsList.filter(p => p.status === 'APPROVED' || p.status === 'IN_PROGRESS').length;
  const completedProjects = projectsList.filter(p => p.status === 'COMPLETED').length;
  const underReviewProjects = projectsList.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length;

  const filteredProjects = selectedDeptFilter === 'ALL'
    ? projectsList
    : projectsList.filter(p => p.dept === selectedDeptFilter);

  // Load institutional academic insights
  useEffect(() => {
    loadAcademicIntelligence();
    loadWorkloadAnalysis();
  }, [projectsList.length]);

  const loadAcademicIntelligence = async () => {
    setIsInsightsLoading(true);
    try {
      const res = await generateAcademicInsights(projectsList, facultyGuidesList);
      if (res && res.success) {
        setAcademicInsights(res);
      }
    } catch (err) {
      console.error('Failed to load academic insights:', err);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const loadWorkloadAnalysis = async () => {
    setIsWorkloadLoading(true);
    try {
      const res = await analyzeFacultyWorkload(projectsList, facultyGuidesList);
      if (res && res.success) {
        setWorkloadInsights(res.data || res);
      }
    } catch (err) {
      console.error('Failed to load workload insights:', err);
    } finally {
      setIsWorkloadLoading(false);
    }
  };

  const handleOpenRecommendation = async (project) => {
    setRecommendationModalProject(project);
    setRecommendationResult(null);
    setIsRecommending(true);
    try {
      const res = await recommendFacultyAssignment(project, facultyGuidesList, projectsList);
      if (res && res.success) {
        setRecommendationResult(res.data || res);
      } else {
        alert(res?.error || 'AI service unavailable.');
      }
    } catch (err) {
      console.error('Error recommending faculty:', err);
    } finally {
      setIsRecommending(false);
    }
  };

  const handleOpenSimilarityCheck = async (project) => {
    setSimilarityModalProject(project);
    setSimilarityResult(null);
    setIsCheckingSimilarity(true);
    try {
      const res = await analyzeProjectSimilarity(project, projectsList);
      if (res && res.success) {
        setSimilarityResult(res.data || res);
      } else {
        alert(res?.error || 'AI service unavailable.');
      }
    } catch (err) {
      console.error('Error checking similarity:', err);
    } finally {
      setIsCheckingSimilarity(false);
    }
  };

  const handleGuideSelect = (projectId, guideName) => {
    const selectedGuide = facultyGuidesList.find(g => g.name === guideName);
    if (onAssignGuide) {
      onAssignGuide(projectId, guideName, selectedGuide?.id || 'FAC-102');
    }
  };

  const handleApplyRecommendation = (projectId, guideName, guideId) => {
    if (onAssignGuide) {
      onAssignGuide(projectId, guideName, guideId);
    }
    setRecommendationModalProject(null);
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="page-header-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="hero-pill-badge" style={{ margin: 0, padding: '0.2rem 0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <Shield size={14} /> Department Admin Cell
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Academic Project Administration</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Institutional Administration & Faculty Allocation
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Assign faculty guides with AI assistance, monitor department workload distribution, and track risk intelligence.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn-aesthetic btn-primary-glow btn-sm"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            onClick={() => {
              setAssistantPrompt('');
              setIsAssistantOpen(true);
            }}
          >
            <Bot size={15} />
            <span>Ask Admin AI</span>
          </button>

          <button 
            className="btn-aesthetic btn-glass-secondary btn-sm"
            onClick={() => {
              alert('Exporting Final Capstone Viva Marks & Project Data to CSV...');
            }}
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          ACADEMIC PROJECT INTELLIGENCE (Per Section 29 Requirement)
          ============================================================ */}
      <div className="ai-insight-card" style={{ marginBottom: '1.5rem' }}>
        <div className="ai-card-glow-accent" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="ai-badge-gradient">
              <Sparkles size={13} /> Academic Project Intelligence
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Institutional Risk Overview & Executive Intelligence
            </span>
          </div>

          <button 
            className="ai-pill-action"
            onClick={loadAcademicIntelligence}
            disabled={isInsightsLoading}
          >
            {isInsightsLoading ? (
              <>
                <Loader2 size={13} className="status-text-loading" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Refresh Intelligence</span>
              </>
            )}
          </button>
        </div>

        {/* Real Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--bg-glass)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Projects</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>{totalProjects}</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>Low Risk</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10B981', marginTop: '0.15rem' }}>{academicInsights?.stats?.lowRisk ?? 0}</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase' }}>Medium Risk</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.15rem' }}>{academicInsights?.stats?.mediumRisk ?? 0}</div>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>High Risk</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#EF4444', marginTop: '0.15rem' }}>{academicInsights?.stats?.highRisk ?? 0}</div>
          </div>
        </div>

        {/* AI Executive Summary */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Lightbulb size={14} /> AI Executive Summary
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.55', margin: '0 0 0.6rem 0' }}>
            {academicInsights?.aiInsights?.executiveSummary || 'Institutional capstone projects are progressing through initial phases. Monitor teams with medium risk indicators.'}
          </p>

          {academicInsights?.aiInsights?.keyObservations && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {academicInsights.aiInsights.keyObservations.slice(0, 2).map((obs, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  • {obs}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab Controls */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('allocation')}
          className={`nav-item-link ${activeTab === 'allocation' ? 'active' : ''}`}
          style={{ height: '36px', padding: '0 1.1rem' }}
        >
          <UserCheck size={15} />
          <span>1. Faculty Guide Allocation</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`nav-item-link ${activeTab === 'analytics' ? 'active' : ''}`}
          style={{ height: '36px', padding: '0 1.1rem' }}
        >
          <BarChart2 size={15} />
          <span>2. Department Analytics & Workload</span>
        </button>
      </div>

      {/* TAB 1: FACULTY GUIDE ALLOCATION TABLE WITH AI RECOMMENDATION & SIMILARITY CHECK */}
      {activeTab === 'allocation' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={18} style={{ color: 'var(--primary)' }} />
                Faculty Guide Assignment & Similarity Review Table
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.15rem' }}>
                Use AI to recommend faculty based on domain expertise and check proposals for concept similarity.
              </p>
            </div>

            {/* Department Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={15} style={{ color: 'var(--text-muted)' }} />
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="aesthetic-input"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
              </select>
            </div>
          </div>

          {/* Allocation Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Project ID & Title</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Student Team / Lead</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Department</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>AI Advisory Tools</th>
                  <th style={{ padding: '0.75rem 0.85rem' }}>Assigned Faculty Guide</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{proj.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.15rem' }}>{proj.id}</div>
                    </td>

                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ fontWeight: 600 }}>{proj.leadName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reg: {proj.regNo}</div>
                    </td>

                    <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>
                      {proj.dept}
                    </td>

                    <td style={{ padding: '0.85rem' }}>
                      <span className={`project-status-badge ${
                        proj.status === 'APPROVED' || proj.status === 'IN_PROGRESS' 
                          ? 'status-completed' 
                          : proj.status === 'REVISION_REQUIRED' 
                            ? 'status-revision' 
                            : 'status-under-review'
                      }`} style={{ fontSize: '0.75rem' }}>
                        {proj.status}
                      </span>
                    </td>

                    {/* AI Actions */}
                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button
                          className="ai-pill-action"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                          onClick={() => handleOpenRecommendation(proj)}
                          title="AI Guide Assignment Recommendation"
                        >
                          <Sparkles size={11} />
                          <span>AI Recommend</span>
                        </button>

                        <button
                          className="ai-pill-action"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', color: '#06B6D4', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.1)' }}
                          onClick={() => handleOpenSimilarityCheck(proj)}
                          title="Check Project Similarity"
                        >
                          <Copy size={11} />
                          <span>Similarity</span>
                        </button>
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem' }}>
                      <select
                        value={proj.guideName || 'UNASSIGNED'}
                        onChange={(e) => handleGuideSelect(proj.id, e.target.value)}
                        className="aesthetic-input"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', minWidth: '190px' }}
                      >
                        <option value="UNASSIGNED" disabled>-- Select Faculty Guide --</option>
                        {facultyGuidesList.map((g) => (
                          <option key={g.id} value={g.name}>
                            {g.name} ({g.activeProjects}/{g.maxProjects})
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & WORKLOAD WITH AI WORKLOAD INSIGHTS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Guide Workload with AI Analysis */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart2 size={18} style={{ color: 'var(--primary)' }} /> Faculty Workload Distribution
              </h3>
              <button className="ai-pill-action" onClick={loadWorkloadAnalysis} disabled={isWorkloadLoading}>
                <Sparkles size={12} />
                <span>{isWorkloadLoading ? 'Analyzing...' : 'AI Insights'}</span>
              </button>
            </div>

            {/* AI Workload Summary Banner if available */}
            {workloadInsights?.workloadSummary && (
              <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  AI Workload Observation
                </div>
                <p style={{ fontSize: '0.84rem', margin: 0, color: 'var(--text-main)', lineHeight: '1.45' }}>
                  {workloadInsights.workloadSummary}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {facultyGuidesList.map((g, idx) => (
                <div key={idx} style={{ padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{g.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.dept}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="project-status-badge status-completed" style={{ fontSize: '0.75rem' }}>
                      {g.activeProjects} / {g.maxProjects} Teams
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Domain Breakdown */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} style={{ color: 'var(--primary)' }} /> Project Domain Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { domain: 'Artificial Intelligence & Machine Learning', count: '14 Teams', pct: '44%' },
                { domain: 'Internet of Things & Embedded Systems', count: '8 Teams', pct: '25%' },
                { domain: 'Cybersecurity & Blockchain', count: '6 Teams', pct: '19%' },
                { domain: 'Cloud & DevOps Engineering', count: '4 Teams', pct: '12%' }
              ].map((d, idx) => (
                <div key={idx} style={{ padding: '0.75rem 1rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{d.domain}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.count}</div>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          AI FACULTY RECOMMENDATION MODAL (Per Section 31 Requirement)
          ============================================================ */}
      {recommendationModalProject && (
        <div className="ai-modal-overlay" onClick={() => setRecommendationModalProject(null)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>AI Faculty Assignment Recommendation</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{recommendationModalProject.title}</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setRecommendationModalProject(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isRecommending ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: 'var(--primary)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Matching Faculty Expertise...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing project tech stack, department domain, and current faculty workloads.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-glass)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recommended Faculty</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                      {recommendationResult?.recommendedFacultyName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Workload Status: {recommendationResult?.currentWorkloadStatus || 'Capacity available'}
                    </div>
                  </div>

                  <div className="ai-section-box" style={{ margin: 0 }}>
                    <div className="ai-section-title">Assignment Justification</div>
                    <p style={{ fontSize: '0.86rem', margin: 0, lineHeight: '1.5' }}>
                      {recommendationResult?.reason}
                    </p>
                  </div>

                  {recommendationResult?.relevantExpertise?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Relevant Domain Expertise</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {recommendationResult.relevantExpertise.map((exp, idx) => (
                          <li key={idx}>{exp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
                    * AI provides recommendations only. The Administrator makes the final faculty assignment.
                  </p>
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setRecommendationModalProject(null)}>
                Cancel
              </button>
              {recommendationResult?.recommendedFacultyName && (
                <button 
                  className="btn-aesthetic btn-primary-glow btn-sm"
                  onClick={() => handleApplyRecommendation(
                    recommendationModalProject.id, 
                    recommendationResult.recommendedFacultyName, 
                    recommendationResult.recommendedFacultyId || 'FAC-102'
                  )}
                >
                  <Check size={14} />
                  <span>Assign {recommendationResult.recommendedFacultyName}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          AI PROJECT SIMILARITY MODAL (Per Section 32 & 35 Requirement)
          ============================================================ */}
      {similarityModalProject && (
        <div className="ai-modal-overlay" onClick={() => setSimilarityModalProject(null)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }}>
                  <Copy size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Project Similarity & Redundancy Detection</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{similarityModalProject.title}</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setSimilarityModalProject(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isCheckingSimilarity ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: '#06B6D4' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Comparing with Repository Projects...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Evaluating common concepts, architectures, and thematic overlaps.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-glass)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Similarity</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: (similarityResult?.maxSimilarityPct || 0) > 70 ? '#EF4444' : 'var(--primary)' }}>
                        {similarityResult?.maxSimilarityPct || similarityResult?.similarityScore || 0}%
                      </div>
                    </div>
                    {similarityResult?.mostSimilarProjectTitle && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Closest Repository Match</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{similarityResult.mostSimilarProjectTitle}</div>
                      </div>
                    )}
                  </div>

                  {similarityResult?.commonConcepts?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Common Concepts & Overlaps</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {similarityResult.commonConcepts.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {similarityResult?.keyDifferences?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Key Differentiators / Novelty</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {similarityResult.keyDifferences.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="ai-section-box" style={{ margin: 0, background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                    <div className="ai-section-title" style={{ color: '#818CF8' }}>AI Recommendation</div>
                    <p style={{ fontSize: '0.86rem', margin: 0, lineHeight: '1.5' }}>
                      "{similarityResult?.recommendation || 'Project demonstrates acceptable novelty for capstone progression.'}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setSimilarityModalProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating or Header-connected Admin AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userRole="ADMIN"
        context={{
          totalProjects,
          activeProjects,
          underReviewProjects,
          completedProjects,
          facultyGuides: facultyGuidesList,
          projectsSummary: projectsList.map(p => ({
            id: p.id,
            title: p.title,
            domain: p.domain,
            dept: p.dept,
            status: p.status,
            guideName: p.guideName
          }))
        }}
        initialPrompt={assistantPrompt}
      />
    </div>
  );
};

export default AdminDashboard;
