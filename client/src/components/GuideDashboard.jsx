import React, { useState } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileCheck, 
  Star, 
  MessageSquare, 
  ChevronRight, 
  BookOpen, 
  Send, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  FileText, 
  Edit3, 
  TrendingUp, 
  X, 
  Plus, 
  ListTodo, 
  CheckSquare, 
  Bot, 
  Loader2, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert, 
  Check, 
  RotateCcw,
  Award,
  Download,
  FileArchive,
  Presentation
} from 'lucide-react';
import AIAssistantDrawer from './AIAssistantDrawer';
import GuideReviewSection from './GuideReviewSection';
import { 
  analyzeProposal, 
  analyzeFeasibility, 
  explainProjectRisk, 
  analyzeWeeklyReport, 
  generateFacultyFeedback 
} from '../services/aiService';

const GuideDashboard = ({ 
  projectsList = [], 
  reviews = [],
  currentGuideName = 'Dr. A. Sharma (HOD)', 
  currentGuideId = 'FAC-102',
  onApproveProposal, 
  onRequestRevision, 
  onRejectProposal, 
  onGradeWeeklyProgress, 
  onUpdateProject,
  onScheduleReview,
  onSaveOfficialEvaluation
}) => {
  const [activeTab, setActiveTab] = useState('evaluations'); // 'reviews' | 'evaluations' | 'assigned' | 'weekly' | 'documents'
  const [revisionModalProject, setRevisionModalProject] = useState(null);
  const [revisionNotesText, setRevisionNotesText] = useState('');
  
  const [feedbackInputs, setFeedbackInputs] = useState({});
  const [scoreInputs, setScoreInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // AI Assistant Drawer State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');

  // AI Proposal Analysis Modal
  const [proposalModalProject, setProposalModalProject] = useState(null);
  const [proposalAnalysisData, setProposalAnalysisData] = useState(null);
  const [isAnalyzingProposal, setIsAnalyzingProposal] = useState(false);

  // AI Feasibility Modal
  const [feasibilityModalProject, setFeasibilityModalProject] = useState(null);
  const [feasibilityData, setFeasibilityData] = useState(null);
  const [isAnalyzingFeasibility, setIsAnalyzingFeasibility] = useState(false);

  // AI Risk Explanation Modal
  const [riskModalProject, setRiskModalProject] = useState(null);
  const [riskExplanationData, setRiskExplanationData] = useState(null);
  const [isExplainingRisk, setIsExplainingRisk] = useState(false);

  // AI Weekly Report Analysis Modal
  const [reportModalData, setReportModalData] = useState(null);
  const [reportAnalysisData, setReportAnalysisData] = useState(null);
  const [isAnalyzingReport, setIsAnalyzingReport] = useState(false);

  // AI Feedback Generator State
  const [generatingFeedbackFor, setGeneratingFeedbackFor] = useState(null);
  const [generatedFeedbackResult, setGeneratedFeedbackResult] = useState(null);

  // Categorize projects based on Details.md lifecycle states
  const pendingReviews = projectsList.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW');
  const assignedProjects = projectsList.filter(p => 
    (p.status === 'APPROVED' || p.status === 'IN_PROGRESS' || p.status === 'COMPLETED') &&
    (p.guideName === currentGuideName || !p.guideName || p.guideId === currentGuideId)
  );

  const handleApprove = (projectId) => {
    if (onApproveProposal) {
      onApproveProposal(projectId, currentGuideName, currentGuideId);
    }
  };

  const handleOpenRevisionModal = (proj) => {
    setRevisionModalProject(proj);
    setRevisionNotesText('');
  };

  const handleConfirmRevision = (e) => {
    e.preventDefault();
    if (!revisionModalProject || !revisionNotesText.trim()) return;

    if (onRequestRevision) {
      onRequestRevision(revisionModalProject.id, revisionNotesText);
    }
    setRevisionModalProject(null);
    setRevisionNotesText('');
  };

  const handleReject = (projectId) => {
    if (onRejectProposal) {
      onRejectProposal(projectId, 'Proposal does not meet academic department rigor criteria.');
    }
  };

  // AI Trigger: Analyze Proposal
  const handleOpenProposalAI = async (proj) => {
    setProposalModalProject(proj);
    setProposalAnalysisData(null);
    setIsAnalyzingProposal(true);
    try {
      const res = await analyzeProposal(proj);
      if (res && res.success) {
        setProposalAnalysisData(res.data || res);
      } else {
        alert(res?.error || 'AI service unavailable.');
      }
    } catch (err) {
      console.error('Error analyzing proposal:', err);
    } finally {
      setIsAnalyzingProposal(false);
    }
  };

  // AI Trigger: Analyze Feasibility
  const handleOpenFeasibilityAI = async (proj) => {
    setFeasibilityModalProject(proj);
    setFeasibilityData(null);
    setIsAnalyzingFeasibility(true);
    try {
      const res = await analyzeFeasibility(proj);
      if (res && res.success) {
        setFeasibilityData(res.data || res);
      } else {
        alert(res?.error || 'AI service unavailable.');
      }
    } catch (err) {
      console.error('Error analyzing feasibility:', err);
    } finally {
      setIsAnalyzingFeasibility(false);
    }
  };

  // AI Trigger: Explain Risk
  const handleOpenRiskAI = async (proj) => {
    setRiskModalProject(proj);
    setRiskExplanationData(null);
    setIsExplainingRisk(true);
    try {
      const res = await explainProjectRisk(proj);
      if (res && res.success) {
        setRiskExplanationData(res);
      }
    } catch (err) {
      console.error('Error explaining risk:', err);
    } finally {
      setIsExplainingRisk(false);
    }
  };

  // AI Trigger: Analyze Weekly Report
  const handleOpenReportAI = async (w, proj) => {
    setReportModalData({ ...w, projectTitle: proj.title });
    setReportAnalysisData(null);
    setIsAnalyzingReport(true);
    try {
      const res = await analyzeWeeklyReport(w, proj);
      if (res && res.success) {
        setReportAnalysisData(res.data || res);
      }
    } catch (err) {
      console.error('Error analyzing report:', err);
    } finally {
      setIsAnalyzingReport(false);
    }
  };

  // AI Trigger: Generate Feedback
  const handleGenerateFeedbackAI = async (w) => {
    const rawNotes = feedbackInputs[w.id] || 'Good progress, ensure all API endpoints are documented.';
    setGeneratingFeedbackFor(w.id);
    try {
      const res = await generateFacultyFeedback(rawNotes, {
        projectTitle: w.projectTitle,
        studentLead: w.leadName,
        weekNumber: w.weekNumber,
        score: scoreInputs[w.id] || w.facultyScore || 90
      });

      if (res && res.success && res.data) {
        setGeneratedFeedbackResult({ weekId: w.id, ...res.data });
      } else {
        alert(res?.error || 'Feedback generator unavailable.');
      }
    } catch (err) {
      console.error('Error generating feedback:', err);
    } finally {
      setGeneratingFeedbackFor(null);
    }
  };

  const handleApplyGeneratedFeedback = (weekId, text) => {
    setFeedbackInputs(prev => ({ ...prev, [weekId]: text }));
    setGeneratedFeedbackResult(null);
  };

  const handleSaveWeeklyEvaluation = (projectId, weekId) => {
    const score = scoreInputs[weekId] !== undefined ? parseInt(scoreInputs[weekId]) : 90;
    const feedback = feedbackInputs[weekId] || 'Good progress this week. Continue to adhere to the milestone schedule.';

    if (onGradeWeeklyProgress) {
      onGradeWeeklyProgress(projectId, weekId, score, feedback);
    }
  };

  const handleSendComment = (e, projectId) => {
    e.preventDefault();
    const text = commentInputs[projectId];
    if (!text || !text.trim()) return;

    const project = projectsList.find(p => p.id === projectId);
    if (!project) return;

    const newComment = {
      id: Date.now(),
      author: `${currentGuideName} (Faculty Guide)`,
      text: text,
      time: 'Just now',
      isGuide: true
    };

    const updatedComments = [...(project.comments || []), newComment];
    if (onUpdateProject) {
      onUpdateProject({ ...project, comments: updatedComments });
    }
    setCommentInputs({ ...commentInputs, [project.id]: '' });
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="page-header-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="hero-pill-badge" style={{ margin: 0, padding: '0.2rem 0.65rem', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
              <UserCheck size={14} /> Faculty Guide Portal
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentGuideName}</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            Faculty Project Review & Progress Evaluation
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Review submitted proposals with AI, grade weekly milestone progress, and provide constructive academic feedback.
          </p>
        </div>

        {/* Action Controls & AI Assistant Trigger */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            className="btn-aesthetic btn-primary-glow btn-sm"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            onClick={() => {
              setAssistantPrompt('');
              setIsAssistantOpen(true);
            }}
          >
            <Bot size={15} />
            <span>Ask AI Assistant</span>
          </button>

          <div className="metric-card" style={{ padding: '0.5rem 1rem' }}>
            <div className="metric-info">
              <h3 style={{ fontSize: '0.75rem' }}>Pending Reviews</h3>
              <div className="metric-value" style={{ fontSize: '1.2rem', color: pendingReviews.length > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
                {pendingReviews.length}
              </div>
            </div>
          </div>

          <div className="metric-card" style={{ padding: '0.5rem 1rem' }}>
            <div className="metric-info">
              <h3 style={{ fontSize: '0.75rem' }}>Assigned Projects</h3>
              <div className="metric-value" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                {assignedProjects.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`nav-item-link ${activeTab === 'reviews' ? 'active' : ''}`}
          style={{ height: '36px', padding: '0 1.1rem', position: 'relative' }}
        >
          <Clock size={15} className={pendingReviews.length > 0 ? 'status-text-loading' : ''} />
          <span>1. Proposal Reviews ({pendingReviews.length})</span>
          {pendingReviews.length > 0 && (
            <span style={{ background: '#EF4444', color: '#fff', fontSize: '0.7rem', fontWeight: 800, borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.2rem' }}>
              {pendingReviews.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('evaluations')}
          className={`nav-item-link ${activeTab === 'evaluations' ? 'active' : ''}`}
          style={{ height: '36px', padding: '0 1.1rem' }}
        >
          <Award size={15} />
          <span>2. Defense Reviews & Evaluations ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assigned')}
          className={`nav-item-link ${activeTab === 'assigned' ? 'active' : ''}`}
          style={{ height: '36px', padding: '0 1.1rem' }}
        >
          <UserCheck size={15} />
          <span>3. Assigned Projects ({assignedProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('weekly')}
          className={`nav-item-link ${activeTab === 'weekly' ? 'active' : ''}`}
          style={{ height: '36px', padding: '0 1.1rem' }}
        >
          <TrendingUp size={15} />
          <span>4. Weekly Reports & Grading</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`nav-item-link ${activeTab === 'documents' ? 'active' : ''}`}
          style={{ height: '36px', padding: '0 1.1rem' }}
        >
          <FileText size={15} />
          <span>5. Document Repository</span>
        </button>
      </div>

      {/* TAB 1: PROPOSAL REVIEWS (Approve / Request Revision / Reject / AI Analyze) */}
      {activeTab === 'reviews' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} style={{ color: 'var(--warning)' }} />
              Submitted Project Proposals Awaiting Faculty Review
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Review student project scope, problem statement, objectives, and technology stack. Use AI analysis to evaluate rigor.
            </p>
          </div>

          {pendingReviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pendingReviews.map((proj) => (
                <div 
                  key={proj.id}
                  style={{ 
                    background: 'var(--bg-glass)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span className="project-domain-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
                          {proj.dept}
                        </span>
                        <span className="project-domain-badge">{proj.domain}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Submitted: {proj.submittedDate || 'Today'}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        {proj.title}
                      </h4>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Project ID: <strong>{proj.id}</strong> | Lead: <strong>{proj.leadName}</strong> ({proj.regNo}) | Members: {Array.isArray(proj.teamMembers) ? proj.teamMembers.join(', ') : (proj.members ? proj.members.join(', ') : proj.leadName)}
                      </div>
                    </div>

                    {/* Action Buttons: AI Analyze / Feasibility / Approve / Request Revision / Reject */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        className="ai-pill-action"
                        onClick={() => handleOpenProposalAI(proj)}
                      >
                        <Sparkles size={13} />
                        <span>AI Analyze Proposal</span>
                      </button>

                      <button 
                        className="ai-pill-action"
                        style={{ color: '#06B6D4', borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.1)' }}
                        onClick={() => handleOpenFeasibilityAI(proj)}
                      >
                        <Sparkles size={13} />
                        <span>AI Feasibility</span>
                      </button>

                      <button 
                        className="btn-aesthetic btn-primary-glow btn-sm"
                        onClick={() => handleApprove(proj.id)}
                      >
                        <CheckCircle2 size={15} />
                        <span>Approve</span>
                      </button>

                      <button 
                        className="btn-aesthetic btn-glass-secondary btn-sm"
                        onClick={() => handleOpenRevisionModal(proj)}
                        style={{ color: 'var(--warning)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                      >
                        <Edit3 size={15} />
                        <span>Request Revision</span>
                      </button>

                      <button 
                        className="btn-aesthetic btn-glass-secondary btn-sm"
                        onClick={() => handleReject(proj.id)}
                        style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      >
                        <XCircle size={15} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Proposal Deep-Dive Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Problem Statement
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                        {proj.problemStatement || 'Problem statement defined by student team.'}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Key Objectives
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                        {proj.objectives || 'Objectives specified for prototype development.'}
                      </p>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Tech Stack & Abstract
                      </div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.3rem' }}>
                        {proj.technologies || proj.techStack || 'React, Node.js, Express, MongoDB'}
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                        {proj.abstract || proj.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)' }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 0.75rem', color: 'var(--success)', opacity: 0.8 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Review Queue is Clear</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                All submitted project proposals have been reviewed and processed.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DEFENSE REVIEWS & EVALUATION SYSTEM */}
      {activeTab === 'evaluations' && (
        <GuideReviewSection
          reviews={reviews}
          projectsList={projectsList}
          currentGuideId={currentGuideId}
          currentGuideName={currentGuideName}
          onScheduleReview={onScheduleReview}
          onSaveOfficialEvaluation={onSaveOfficialEvaluation}
        />
      )}

      {/* TAB 3: ASSIGNED PROJECTS & MILESTONE MONITORING WITH RISK INTELLIGENCE */}
      {activeTab === 'assigned' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {assignedProjects.length > 0 ? (
            assignedProjects.map((project) => (
              <div 
                key={project.id}
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '1.65rem' 
                }}
              >
                {/* Project Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="project-domain-badge">{project.dept}</span>
                      <span className="project-domain-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                        Guide: {project.guideName || currentGuideName}
                      </span>
                      <span className="project-status-badge status-completed">
                        {project.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.2rem 0' }}>
                      {project.title}
                    </h3>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Lead: <strong>{project.leadName}</strong> ({project.regNo}) | Members: {Array.isArray(project.teamMembers) ? project.teamMembers.join(', ') : (project.members ? project.members.join(', ') : project.leadName)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button 
                      className="ai-pill-action"
                      onClick={() => handleOpenRiskAI(project)}
                    >
                      <Sparkles size={13} />
                      <span>AI Project Health</span>
                    </button>
                  </div>
                </div>

                {/* Milestones & Tasks Summary */}
                <div style={{ marginBottom: '1.35rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} style={{ color: 'var(--primary)' }} />
                    8-Stage Milestone Status & Tasks
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
                    {(project.milestones || []).map((m) => (
                      <div key={m.id || m.number} style={{ padding: '0.6rem 0.75rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontWeight: 700 }}>M{m.number}: {m.title}</span>
                          <span style={{ color: m.status === 'COMPLETED' ? 'var(--success)' : m.status === 'IN_PROGRESS' ? 'var(--primary)' : 'var(--text-dim)' }}>
                            {m.status === 'COMPLETED' ? '✓' : `${m.progress}%`}
                          </span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.08)', height: '3px', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${m.progress}%`, height: '100%', background: m.status === 'COMPLETED' ? 'var(--success)' : 'var(--primary)' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Discussion & Guidance Feed */}
                <div style={{ background: 'rgba(0, 0, 0, 0.15)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare size={14} style={{ color: 'var(--primary)' }} />
                    Direct Team Guidance & Feedback Feed
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '160px', overflowY: 'auto', marginBottom: '0.75rem' }}>
                    {(project.comments || []).map((c) => (
                      <div 
                        key={c.id} 
                        style={{ 
                          padding: '0.55rem 0.85rem', 
                          borderRadius: 'var(--radius-sm)', 
                          background: c.isGuide ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                          border: c.isGuide ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
                          fontSize: '0.825rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                          <strong style={{ color: c.isGuide ? 'var(--primary)' : 'var(--text-main)' }}>{c.author}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.time}</span>
                        </div>
                        <div>{c.text}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={(e) => handleSendComment(e, project.id)} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder={`Send guidance instruction to ${project.leadName}'s team...`}
                      value={commentInputs[project.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [project.id]: e.target.value })}
                      className="aesthetic-input"
                      style={{ flex: 1, fontSize: '0.825rem', padding: '0.45rem 0.75rem' }}
                    />
                    <button type="submit" className="btn-aesthetic btn-primary-glow btn-sm">
                      <Send size={13} />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
              <UserCheck size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No Assigned Projects Yet</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Go to the "Proposal Reviews" tab to review and approve submitted student projects.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WEEKLY REPORTS & GRADING WITH AI REPORT ANALYZER & FEEDBACK GENERATOR */}
      {activeTab === 'weekly' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
            Student Weekly Progress Reports & Marks Evaluation
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {assignedProjects.flatMap(proj => (proj.weeklyUpdates || []).map(w => ({ ...w, projectId: proj.id, projectTitle: proj.title, leadName: proj.leadName, fullProject: proj }))).length > 0 ? (
              assignedProjects.flatMap(proj => (proj.weeklyUpdates || []).map(w => ({ ...w, projectId: proj.id, projectTitle: proj.title, leadName: proj.leadName, fullProject: proj }))).map((w) => (
                <div 
                  key={w.id}
                  style={{ 
                    padding: '1.2rem', 
                    background: 'var(--bg-glass)', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {w.projectTitle}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        Week #{w.weekNumber} Progress Report • <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Lead: {w.leadName}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <button
                        className="ai-pill-action"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                        onClick={() => handleOpenReportAI(w, w.fullProject)}
                      >
                        <Sparkles size={12} />
                        <span>AI Analyze Report</span>
                      </button>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {w.date}</span>
                      <span className="project-domain-badge">Progress: {w.progressPct}%</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Work Completed
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {w.workCompleted}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Problems / Roadblocks
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {w.problemsFaced || 'None'}
                      </p>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Next Week Plan
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {w.nextWeekPlan}
                      </p>
                    </div>
                  </div>

                  {/* Grading & AI Feedback Section */}
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Score:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder={w.facultyScore !== null && w.facultyScore !== undefined ? w.facultyScore : '90'}
                          value={scoreInputs[w.id] !== undefined ? scoreInputs[w.id] : (w.facultyScore || '')}
                          onChange={(e) => setScoreInputs({ ...scoreInputs, [w.id]: e.target.value })}
                          className="aesthetic-input"
                          style={{ width: '65px', padding: '0.3rem 0.4rem', fontSize: '0.85rem', textAlign: 'center' }}
                        />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>/100</span>
                      </div>

                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <input
                          type="text"
                          placeholder={w.facultyFeedback || 'Type faculty notes or click Generate AI Feedback...'}
                          value={feedbackInputs[w.id] !== undefined ? feedbackInputs[w.id] : (w.facultyFeedback || '')}
                          onChange={(e) => setFeedbackInputs({ ...feedbackInputs, [w.id]: e.target.value })}
                          className="aesthetic-input"
                          style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}
                        />
                      </div>

                      <button
                        className="btn-aesthetic btn-glass-secondary btn-sm"
                        onClick={() => handleGenerateFeedbackAI(w)}
                        disabled={generatingFeedbackFor === w.id}
                      >
                        {generatingFeedbackFor === w.id ? (
                          <Loader2 size={13} className="status-text-loading" />
                        ) : (
                          <Sparkles size={13} style={{ color: 'var(--primary)' }} />
                        )}
                        <span>Generate AI Feedback</span>
                      </button>

                      <button
                        className="btn-aesthetic btn-primary-glow btn-sm"
                        onClick={() => handleSaveWeeklyEvaluation(w.projectId, w.id)}
                      >
                        <CheckCircle2 size={14} />
                        <span>Save Evaluation</span>
                      </button>
                    </div>

                    {/* AI Feedback Preview Dropdown if generated */}
                    {generatedFeedbackResult && generatedFeedbackResult.weekId === w.id && (
                      <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.35)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginTop: '0.4rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818CF8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          AI Generated Polish:
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 0.5rem 0', lineHeight: '1.45' }}>
                          "{generatedFeedbackResult.polishedFeedback}"
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-aesthetic btn-primary-glow btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                            onClick={() => handleApplyGeneratedFeedback(w.id, generatedFeedbackResult.polishedFeedback)}
                          >
                            <Check size={12} />
                            <span>Use Feedback</span>
                          </button>
                          <button
                            className="btn-aesthetic btn-glass-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                            onClick={() => handleGenerateFeedbackAI(w)}
                          >
                            <RotateCcw size={12} />
                            <span>Regenerate</span>
                          </button>
                          <button
                            className="btn-aesthetic btn-glass-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
                            onClick={() => setGeneratedFeedbackResult(null)}
                          >
                            <span>Dismiss</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <TrendingUp size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem' }}>No weekly reports submitted by assigned teams yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENT REPOSITORY */}
      {activeTab === 'documents' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <FileText size={20} style={{ color: 'var(--primary)' }} />
              Assigned Projects Document Repository
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.2rem', marginBottom: 0 }}>
              Inspect and download student deliverables across all assigned capstone projects.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {assignedProjects.flatMap(proj => (proj.documents || []).map(d => ({ ...d, projectTitle: proj.title, leadName: proj.leadName }))).length > 0 ? (
              assignedProjects.flatMap(proj => (proj.documents || []).map(d => ({ ...d, projectTitle: proj.title, leadName: proj.leadName }))).map((doc) => {
                const ext = (doc.fileName || '').split('.').pop()?.toLowerCase();
                const isPdf = ext === 'pdf';
                const isPpt = ['ppt', 'pptx'].includes(ext);
                const isZip = ['zip', 'rar', 'tar', 'gz'].includes(ext);

                const fileDownloadUrl = doc.filePath?.startsWith('http') || doc.filePath?.startsWith('blob:')
                  ? doc.filePath 
                  : `http://localhost:5000${doc.filePath || ''}`;

                return (
                  <div 
                    key={doc.id || doc._id} 
                    style={{ 
                      padding: '0.95rem 1.15rem', 
                      background: 'var(--bg-glass)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ 
                        width: 38, 
                        height: 38, 
                        borderRadius: '10px', 
                        background: isPdf ? 'rgba(239, 68, 68, 0.15)' : isPpt ? 'rgba(245, 158, 11, 0.15)' : isZip ? 'rgba(139, 92, 246, 0.15)' : 'rgba(99, 102, 241, 0.15)', 
                        color: isPdf ? '#EF4444' : isPpt ? '#F59E0B' : isZip ? '#8B5CF6' : 'var(--primary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        {isPdf ? <FileText size={20} /> : isPpt ? <Presentation size={20} /> : isZip ? <FileArchive size={20} /> : <FileText size={20} />}
                      </div>

                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>{doc.projectTitle}</span>
                          <span style={{ color: 'var(--text-muted)' }}>• Lead: {doc.leadName}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', marginTop: '0.15rem' }}>
                          {doc.fileName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                          <span>Type: <strong>{doc.docType || 'Document'}</strong></span>
                          <span>Version: <strong>v{doc.version || '1.0'}</strong></span>
                          <span>Uploaded: <strong>{doc.uploadDate || 'Recent'}</strong></span>
                          <span>Size: <strong>{doc.fileSize || '1.5 MB'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span className="project-domain-badge">{doc.docType || 'Document'}</span>

                      <a
                        href={fileDownloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={doc.fileName}
                        className="btn-aesthetic btn-glass-secondary btn-sm"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem' }}>No documents uploaded by assigned teams yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DEFENSE REVIEWS & EVALUATIONS */}
      {activeTab === 'evaluations' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <GuideReviewSection
            reviews={reviews}
            assignedProjects={assignedProjects}
            currentGuideId={currentGuideId}
            currentGuideName={currentGuideName}
            onScheduleReview={onScheduleReview}
            onSaveOfficialEvaluation={onSaveOfficialEvaluation}
          />
        </div>
      )}

      {/* ============================================================
          AI PROPOSAL ANALYSIS MODAL (Per Section 21 Requirement)
          ============================================================ */}
      {proposalModalProject && (
        <div className="ai-modal-overlay" onClick={() => setProposalModalProject(null)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>AI Proposal Analysis</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{proposalModalProject.title}</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setProposalModalProject(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isAnalyzingProposal ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: 'var(--primary)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Analyzing Proposal with Groq...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Evaluating problem definition, scope, and technical complexity.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="ai-section-box">
                    <div className="ai-section-title">Proposal Summary</div>
                    <p style={{ fontSize: '0.875rem', lineHeight: '1.5', margin: 0 }}>
                      {proposalAnalysisData?.summary || 'Project proposal evaluates real-time monitoring workflows.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Problem Definition</div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {proposalAnalysisData?.problemDefinition || 'Clearly Defined'}
                      </span>
                    </div>

                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Scope & Complexity</div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {proposalAnalysisData?.scopeAnalysis || 'Medium Scope'} • {proposalAnalysisData?.technicalComplexity || 'Moderate'}
                      </span>
                    </div>
                  </div>

                  {proposalAnalysisData?.potentialConcerns?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0, borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
                      <div className="ai-section-title" style={{ color: '#F59E0B' }}>Potential Concerns</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {proposalAnalysisData.potentialConcerns.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {proposalAnalysisData?.recommendations?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0, borderColor: 'rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.05)' }}>
                      <div className="ai-section-title" style={{ color: '#818CF8' }}>Faculty Recommendations</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {proposalAnalysisData.recommendations.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setProposalModalProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          AI FEASIBILITY ANALYSIS MODAL (Per Section 22 Requirement)
          ============================================================ */}
      {feasibilityModalProject && (
        <div className="ai-modal-overlay" onClick={() => setFeasibilityModalProject(null)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>AI Feasibility Evaluation</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{feasibilityModalProject.title}</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setFeasibilityModalProject(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isAnalyzingFeasibility ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: '#06B6D4' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Evaluating Feasibility...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Assessing technical readiness, semester timeline, and tech compatibility.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Technical Feasibility</div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success)' }}>
                        {feasibilityData?.technicalFeasibility || 'High'}
                      </span>
                    </div>

                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Timeline Feasibility</div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {feasibilityData?.timelineFeasibility || 'Moderate / Achievable'}
                      </span>
                    </div>
                  </div>

                  <div className="ai-section-box" style={{ margin: 0 }}>
                    <div className="ai-section-title">Technology Compatibility</div>
                    <p style={{ fontSize: '0.86rem', margin: 0, lineHeight: '1.5' }}>
                      {feasibilityData?.technologyCompatibility || 'Fully compatible with standard institutional stack.'}
                    </p>
                  </div>

                  {feasibilityData?.potentialRisks?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0, borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                      <div className="ai-section-title" style={{ color: '#EF4444' }}>Potential Risks</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {feasibilityData.potentialRisks.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feasibilityData?.recommendations?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0, borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.05)' }}>
                      <div className="ai-section-title" style={{ color: '#06B6D4' }}>Advisory Guidance</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {feasibilityData.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setFeasibilityModalProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          AI RISK EXPLANATION MODAL (Per Section 23 Requirement)
          ============================================================ */}
      {riskModalProject && (
        <div className="ai-modal-overlay" onClick={() => setRiskModalProject(null)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}>
                  <ShieldAlert size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Project Risk Health & AI Explanation</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{riskModalProject.title}</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setRiskModalProject(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isExplainingRisk ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: 'var(--warning)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Calculating Deterministic Risk & Explaining...</h4>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-glass)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Level</div>
                      <span className={`project-status-badge ${riskExplanationData?.riskLevel === 'HIGH' ? 'status-revision' : 'status-in-progress'}`} style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem' }}>
                        {riskExplanationData?.riskLevel} RISK
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deterministic Score</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{riskExplanationData?.riskScore}/100</div>
                    </div>
                  </div>

                  <div className="ai-section-box" style={{ margin: 0 }}>
                    <div className="ai-section-title">Measurable Risk Factors</div>
                    <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                      {(riskExplanationData?.riskFactors || []).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="ai-section-box" style={{ margin: 0, background: 'rgba(99, 102, 241, 0.08)', borderColor: 'rgba(99, 102, 241, 0.3)' }}>
                    <div className="ai-section-title" style={{ color: '#818CF8' }}>AI Contextual Explanation</div>
                    <p style={{ fontSize: '0.86rem', lineHeight: '1.5', margin: 0 }}>
                      "{riskExplanationData?.aiExplanation}"
                    </p>
                  </div>

                  {riskExplanationData?.recommendedAttention && (
                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Recommended Faculty Action</div>
                      <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: '1.5', color: 'var(--text-main)' }}>
                        {riskExplanationData.recommendedAttention}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setRiskModalProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          AI WEEKLY REPORT ANALYSIS MODAL (Per Section 25 Requirement)
          ============================================================ */}
      {reportModalData && (
        <div className="ai-modal-overlay" onClick={() => setReportModalData(null)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>AI Weekly Report Analysis</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{reportModalData.projectTitle} • Week #{reportModalData.weekNumber}</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setReportModalData(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isAnalyzingReport ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: 'var(--primary)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Analyzing Weekly Submission...</h4>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="ai-section-box">
                    <div className="ai-section-title">Report Summary</div>
                    <p style={{ fontSize: '0.86rem', margin: 0, lineHeight: '1.5' }}>
                      {reportAnalysisData?.summary}
                    </p>
                  </div>

                  {reportAnalysisData?.detectedBlockers?.length > 0 && (
                    <div className="ai-section-box" style={{ margin: 0, borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                      <div className="ai-section-title" style={{ color: '#EF4444' }}>Detected Issues & Blockers</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.84rem', lineHeight: '1.45' }}>
                        {reportAnalysisData.detectedBlockers.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {reportAnalysisData?.suggestedFacultyAttention && (
                    <div className="ai-section-box" style={{ margin: 0, borderColor: 'rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.05)' }}>
                      <div className="ai-section-title" style={{ color: '#818CF8' }}>Suggested Faculty Focus</div>
                      <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                        {reportAnalysisData.suggestedFacultyAttention}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setReportModalData(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST REVISION MODAL */}
      {revisionModalProject && (
        <div className="modal-backdrop-overlay" onClick={() => setRevisionModalProject(null)}>
          <div className="aesthetic-modal-card" style={{ maxWidth: '520px', padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setRevisionModalProject(null)}>
              <X size={16} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Edit3 size={18} style={{ color: 'var(--warning)' }} />
              Request Project Proposal Revision
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              For: <strong>{revisionModalProject.title}</strong> (Lead: {revisionModalProject.leadName})
            </p>

            <form onSubmit={handleConfirmRevision}>
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label">Revision Instructions & Feedback *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Specify required corrections (e.g. clarify problem scope, specify exact machine learning architecture, expand testing methodology)..."
                  value={revisionNotesText}
                  onChange={(e) => setRevisionNotesText(e.target.value)}
                  className="aesthetic-input"
                  style={{ padding: '0.6rem 0.85rem', resize: 'vertical' }}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn-aesthetic btn-glass-secondary"
                  onClick={() => setRevisionModalProject(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-aesthetic btn-primary-glow"
                  style={{ background: 'var(--warning)', borderColor: 'var(--warning)' }}
                >
                  <Send size={15} />
                  <span>Send Revision Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating or Header-connected Faculty AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userRole="FACULTY"
        context={{
          guideName: currentGuideName,
          assignedProjects: assignedProjects.map(p => ({
            id: p.id,
            title: p.title,
            domain: p.domain,
            dept: p.dept,
            leadName: p.leadName,
            status: p.status,
            milestones: p.milestones,
            tasks: p.tasks,
            weeklyUpdates: p.weeklyUpdates
          }))
        }}
        initialPrompt={assistantPrompt}
      />
    </div>
  );
};

export default GuideDashboard;
