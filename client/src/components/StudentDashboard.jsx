import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  Upload, 
  FileText, 
  Send, 
  UserCheck, 
  AlertCircle, 
  Edit3, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Plus, 
  Calendar, 
  CheckSquare, 
  ListTodo, 
  TrendingUp, 
  FileCheck, 
  MessageSquare, 
  X, 
  FileCode, 
  Tag, 
  ArrowRight, 
  Bot, 
  Loader2, 
  RefreshCw, 
  HelpCircle, 
  Flame, 
  Lightbulb, 
  Check,
  Award,
  Download,
  ExternalLink,
  Trash2,
  FileArchive,
  Presentation
} from 'lucide-react';
import EditTeamModal from './EditTeamModal';
import AIAssistantDrawer from './AIAssistantDrawer';
import StudentReviewSection from './StudentReviewSection';
import DocumentUploadModal from './DocumentUploadModal';
import { deleteProjectDocument } from '../services/documentService';
import { 
  calculateProjectRisk, 
  explainProjectRisk, 
  prioritizeTasks, 
  generateProjectSummary, 
  analyzeWeeklyReport 
} from '../services/aiService';

const StudentDashboard = ({ 
  project, 
  user,
  reviews = [],
  onUpdateProject, 
  onSubmitProposal, 
  onOpenNewProject,
  onAddTask,
  onUpdateTaskStatus,
  onSubmitWeeklyProgress,
  onUploadDocument,
  onSubmitReviewDeliverable
}) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'milestones' | 'weekly' | 'documents' | 'feedback'
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  // AI State
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState('');

  // AI Project Health & Risk
  const [riskData, setRiskData] = useState(null);
  const [isRiskLoading, setIsRiskLoading] = useState(false);

  // AI Task Prioritization Modal
  const [isPrioritizerOpen, setIsPrioritizerOpen] = useState(false);
  const [prioritizationData, setPrioritizationData] = useState(null);
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  // AI Project Summary Modal
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // AI Weekly Report Analysis in Modal
  const [weeklyAnalysis, setWeeklyAnalysis] = useState(null);
  const [isAnalyzingWeekly, setIsAnalyzingWeekly] = useState(false);

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    milestoneId: 'm4',
    priority: 'MEDIUM',
    dueDate: ''
  });

  // Weekly progress form state
  const [weeklyForm, setWeeklyForm] = useState({
    weekNumber: 3,
    workCompleted: '',
    problemsFaced: '',
    nextWeekPlan: '',
    progressPct: 40
  });

  // Document upload form state
  const [docForm, setDocForm] = useState({
    fileName: '',
    docType: 'SRS',
    version: '1.0'
  });

  // Calculate project progress percentage
  const calcProjectProgress = () => {
    if (!project || !project.milestones || project.milestones.length === 0) return 0;
    const sum = project.milestones.reduce((acc, m) => acc + (m.progress || 0), 0);
    return Math.round(sum / project.milestones.length);
  };

  // Load project risk analysis on mount or project update
  useEffect(() => {
    if (project) {
      loadRiskInsights();
    }
  }, [project?.id, project?.status]);

  const loadRiskInsights = async () => {
    if (!project) return;
    setIsRiskLoading(true);
    try {
      const res = await explainProjectRisk(project);
      if (res && res.success) {
        setRiskData(res);
      }
    } catch (err) {
      console.error('Failed to load risk insights:', err);
    } finally {
      setIsRiskLoading(false);
    }
  };

  const handleRunPrioritization = async () => {
    setIsPrioritizerOpen(true);
    setIsPrioritizing(true);
    try {
      const res = await prioritizeTasks(project);
      if (res && res.success) {
        setPrioritizationData(res);
      }
    } catch (err) {
      console.error('Failed to prioritize tasks:', err);
    } finally {
      setIsPrioritizing(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsSummaryOpen(true);
    setIsSummaryLoading(true);
    try {
      const res = await generateProjectSummary(project);
      if (res && res.success) {
        setSummaryData(res.data || res);
      }
    } catch (err) {
      console.error('Failed to generate project summary:', err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleAnalyzeWeeklyDraft = async () => {
    if (!weeklyForm.workCompleted.trim()) {
      alert('Please enter your work completed before running AI analysis.');
      return;
    }
    setIsAnalyzingWeekly(true);
    try {
      const res = await analyzeWeeklyReport(weeklyForm, project);
      if (res && res.success) {
        setWeeklyAnalysis(res.data || res);
      } else {
        alert(res?.error || 'AI analysis unavailable.');
      }
    } catch (err) {
      console.error('Failed to analyze weekly draft:', err);
    } finally {
      setIsAnalyzingWeekly(false);
    }
  };

  if (!project) {
    return (
      <div className="page-container">
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '3.5rem 2rem', 
          textAlign: 'center',
          maxWidth: '680px',
          margin: '2rem auto'
        }}>
          <div className="brand-icon" style={{ margin: '0 auto 1.25rem', width: 54, height: 54 }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.6rem' }}>
            No Active Project Proposal Found
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
            You have registered successfully! To begin your capstone project workflow, create a project proposal with your problem statement, objectives, and technology stack.
          </p>
          <button 
            className="btn-aesthetic btn-primary-glow btn-lg"
            onClick={onOpenNewProject}
          >
            <Plus size={18} />
            <span>Create New Project Proposal</span>
          </button>
        </div>
      </div>
    );
  }

  const isDraft = project.status === 'DRAFT';
  const isUnderReview = project.status === 'SUBMITTED' || project.status === 'UNDER_REVIEW';
  const isRevisionRequired = project.status === 'REVISION_REQUIRED';
  const isApproved = project.status === 'APPROVED' || project.status === 'IN_PROGRESS' || project.status === 'COMPLETED';

  // Handlers
  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      milestoneId: taskForm.milestoneId,
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      dueDate: taskForm.dueDate || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'TODO'
    };

    if (onAddTask) {
      onAddTask(project.id, newTask);
    } else {
      const updatedTasks = [...(project.tasks || []), newTask];
      onUpdateProject({ ...project, tasks: updatedTasks });
    }

    setTaskForm({ title: '', description: '', milestoneId: 'm4', priority: 'MEDIUM', dueDate: '' });
    setIsTaskModalOpen(false);
  };

  const handleWeeklySubmit = (e) => {
    e.preventDefault();
    if (!weeklyForm.workCompleted.trim()) return;

    const newWeekly = {
      id: `w-${Date.now()}`,
      weekNumber: parseInt(weeklyForm.weekNumber) || 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      workCompleted: weeklyForm.workCompleted,
      problemsFaced: weeklyForm.problemsFaced || 'None',
      nextWeekPlan: weeklyForm.nextWeekPlan,
      progressPct: parseInt(weeklyForm.progressPct) || 0,
      facultyFeedback: null,
      facultyScore: null
    };

    if (onSubmitWeeklyProgress) {
      onSubmitWeeklyProgress(project.id, newWeekly);
    } else {
      const updatedWeekly = [newWeekly, ...(project.weeklyUpdates || [])];
      onUpdateProject({ ...project, weeklyUpdates: updatedWeekly });
    }

    setWeeklyForm({ weekNumber: (project.weeklyUpdates?.length || 0) + 2, workCompleted: '', problemsFaced: '', nextWeekPlan: '', progressPct: 50 });
    setWeeklyAnalysis(null);
    setIsWeeklyModalOpen(false);
  };

  const [docFilter, setDocFilter] = useState('ALL');

  const handleDocUploadSuccess = (newDoc) => {
    const docPayload = {
      ...newDoc,
      id: newDoc.id || newDoc._id || `doc-${Date.now()}`,
      uploadDate: newDoc.uploadDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    if (onUploadDocument) {
      onUploadDocument(project.id || project._id, docPayload);
    } else {
      const updatedDocs = [docPayload, ...(project.documents || [])];
      onUpdateProject({ ...project, documents: updatedDocs });
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document from the project repository?')) return;
    
    try {
      await deleteProjectDocument(docId);
    } catch (err) {
      console.warn('Backend delete failed, removing locally:', err);
    }

    const updatedDocs = (project.documents || []).filter(d => d.id !== docId && d._id !== docId);
    if (onUpdateProject) {
      onUpdateProject({ ...project, documents: updatedDocs });
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: `${project.leadName || 'Student'} (Team Lead)`,
      text: commentText,
      time: 'Just now',
      isGuide: false
    };

    const updatedComments = [...(project.comments || []), newComment];
    onUpdateProject({ ...project, comments: updatedComments });
    setCommentText('');
  };

  const riskBadgeColor = {
    LOW: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
    MEDIUM: { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
    HIGH: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' }
  }[riskData?.riskLevel || 'LOW'];

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="page-header-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span className="hero-pill-badge" style={{ margin: 0, padding: '0.2rem 0.65rem' }}>
              <GraduationCap size={14} /> Student Workspace
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reg No: {project.regNo || '913121104001'}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {project.dept}</span>
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.2rem 0' }}>
            {project.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            {/* Status Badges */}
            {isDraft && (
              <span className="project-status-badge" style={{ background: 'rgba(156, 163, 175, 0.15)', color: '#9CA3AF', border: '1px solid rgba(156, 163, 175, 0.3)' }}>
                Draft (Not Submitted)
              </span>
            )}
            {isUnderReview && (
              <span className="project-status-badge status-under-review" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={13} className="status-text-loading" />
                <span>Proposal Submitted & Under Faculty Review</span>
              </span>
            )}
            {isRevisionRequired && (
              <span className="project-status-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertCircle size={13} />
                <span>Revision Requested by Faculty</span>
              </span>
            )}
            {isApproved && (
              <span className="project-status-badge status-completed" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={14} />
                <span>Assigned Guide: <strong>{project.guideName || 'Dr. A. Sharma (HOD)'}</strong></span>
              </span>
            )}

            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Team: <strong>{Array.isArray(project.teamMembers) ? project.teamMembers.join(', ') : (project.members ? project.members.join(', ') : project.leadName)}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Ask AI Trigger Button */}
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

          {(isDraft || isRevisionRequired) && (
            <button 
              className="btn-aesthetic btn-primary-glow btn-sm"
              onClick={() => {
                if (onSubmitProposal) onSubmitProposal(project.id);
                else onUpdateProject({ ...project, status: 'UNDER_REVIEW', submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
              }}
            >
              <Send size={14} />
              <span>{isRevisionRequired ? 'Resubmit Revised Proposal' : 'Submit Proposal to Faculty'}</span>
            </button>
          )}

          <button 
            className="btn-aesthetic btn-glass-secondary btn-sm" 
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit3 size={14} />
            <span>Edit Proposal Details</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          AI PROJECT INSIGHTS BANNER (Per Section 15 Requirement)
          ============================================================ */}
      <div className="ai-insight-card" style={{ marginBottom: '1.5rem' }}>
        <div className="ai-card-glow-accent" />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="ai-badge-gradient">
              <Sparkles size={13} /> AI Project Insights
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Deterministic Risk Engine + Groq Intelligence
            </span>
          </div>

          <button 
            className="ai-pill-action"
            onClick={loadRiskInsights}
            disabled={isRiskLoading}
          >
            {isRiskLoading ? (
              <>
                <Loader2 size={13} className="status-text-loading" />
                <span>Calculating Risk...</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Refresh AI Health</span>
              </>
            )}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          {/* Health & Risk Level */}
          <div style={{ background: 'var(--bg-glass)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Project Health & Risk Level
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span 
                style={{ 
                  background: riskBadgeColor.bg, 
                  color: riskBadgeColor.text, 
                  border: `1px solid ${riskBadgeColor.border}`,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {riskData?.riskLevel === 'HIGH' ? <AlertTriangle size={14} /> : riskData?.riskLevel === 'MEDIUM' ? <Clock size={14} /> : <CheckCircle2 size={14} />}
                {riskData?.riskLevel ? `${riskData.riskLevel} RISK` : 'EVALUATING...'}
              </span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Score: {riskData?.riskScore ?? '--'}/100
              </span>
            </div>
          </div>

          {/* Project Progress */}
          <div style={{ background: 'var(--bg-glass)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Milestone Progress
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                {calcProjectProgress()}%
              </span>
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${calcProjectProgress()}%`, height: '100%', background: 'var(--gradient-primary)' }} />
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div style={{ background: 'var(--bg-glass)', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', gridColumn: 'span 1' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Detected Risk Factors
            </div>
            {riskData?.riskFactors && riskData.riskFactors.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                {riskData.riskFactors.slice(0, 2).map((factor, idx) => (
                  <li key={idx} style={{ marginBottom: '0.15rem' }}>{factor}</li>
                ))}
              </ul>
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>• All active milestones progressing normally</span>
            )}
          </div>
        </div>

        {/* AI Natural Language Recommendation */}
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '0.9rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <Lightbulb size={18} style={{ color: '#818CF8', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              AI Advisory Recommendation
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
              "{riskData?.aiExplanation || 'Focus on closing open tasks in the current milestone and resolving any blocking dependencies before starting downstream modules.'}"
            </p>
          </div>
        </div>
      </div>

      {/* REVISION REQUIRED NOTICE BANNER */}
      {isRevisionRequired && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={24} style={{ color: '#EF4444', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#EF4444', marginBottom: '0.25rem' }}>
              Faculty Guide Requested Project Revisions
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5', marginBottom: '0.6rem' }}>
              {project.revisionNotes || 'Please refine the problem statement scope, provide a detailed hardware/software component list, and clarify the expected testing methodology before resubmitting.'}
            </p>
            <button 
              className="btn-aesthetic btn-primary-glow btn-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Edit3 size={13} />
              <span>Edit Proposal & Address Feedback</span>
            </button>
          </div>
        </div>
      )}

      {/* UNDER REVIEW NOTICE BANNER */}
      {isUnderReview && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <Clock size={24} className="status-text-loading" style={{ color: 'var(--warning)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--warning)', marginBottom: '0.25rem' }}>
              Proposal In Review Queue
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              Your project proposal has been submitted on <strong>{project.submittedDate || 'Today'}</strong> and is currently waiting for faculty guide approval. You will receive real-time notifications once reviewed.
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`nav-item-link ${activeTab === 'overview' ? 'active' : ''}`}
            style={{ height: '36px', padding: '0 1rem' }}
          >
            <BookOpen size={15} />
            <span>1. Proposal Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`nav-item-link ${activeTab === 'milestones' ? 'active' : ''}`}
            style={{ height: '36px', padding: '0 1rem' }}
          >
            <Sparkles size={15} />
            <span>2. 8 Milestones & Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`nav-item-link ${activeTab === 'weekly' ? 'active' : ''}`}
            style={{ height: '36px', padding: '0 1rem' }}
          >
            <TrendingUp size={15} />
            <span>3. Weekly Progress ({project.weeklyUpdates?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`nav-item-link ${activeTab === 'documents' ? 'active' : ''}`}
            style={{ height: '36px', padding: '0 1rem' }}
          >
            <FileText size={15} />
            <span>4. Documents ({project.documents?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`nav-item-link ${activeTab === 'feedback' ? 'active' : ''}`}
            style={{ height: '36px', padding: '0 1rem' }}
          >
            <MessageSquare size={15} />
            <span>5. Guide Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`nav-item-link ${activeTab === 'reviews' ? 'active' : ''}`}
            style={{ height: '36px', padding: '0 1rem' }}
          >
            <Award size={15} />
            <span>6. Reviews & Defense ({reviews.length})</span>
          </button>
        </div>

        {/* Tab-Level AI Action */}
        {activeTab === 'overview' && (
          <button 
            className="ai-pill-action"
            onClick={handleGenerateSummary}
            disabled={isSummaryLoading}
          >
            <Sparkles size={13} />
            <span>Generate AI Summary</span>
          </button>
        )}

        {activeTab === 'milestones' && (
          <button 
            className="ai-pill-action"
            onClick={handleRunPrioritization}
            disabled={isPrioritizing}
          >
            <Sparkles size={13} />
            <span>AI Prioritize Tasks</span>
          </button>
        )}
      </div>

      {/* TAB 1: PROPOSAL OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookOpen size={18} style={{ color: 'var(--primary)' }} />
              Scope & Problem Statement
            </h3>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Problem Statement
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.55', color: 'var(--text-main)', margin: 0 }}>
                {project.problemStatement || 'Manual tracking of final year academic projects causes delays, fragmented feedback, and lack of visibility between students, guides, and departments.'}
              </p>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Key Objectives
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.55', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-line' }}>
                {project.objectives || '1. Centralize proposal review and digital approval.\n2. Enable 8-stage milestone and task management.\n3. Track weekly progress and marks evaluation.'}
              </p>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Abstract / Description
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.55', color: 'var(--text-main)', margin: 0 }}>
                {project.abstract || project.description || 'A unified web application for managing academic final-year projects between students, faculty guides, and administrators.'}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} style={{ color: 'var(--primary)' }} />
              Metadata & Roster
            </h3>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Department & Domain
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                {project.dept} • <span style={{ color: 'var(--primary)' }}>{project.domain}</span>
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Technology Stack
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                {project.technologies || project.techStack || 'React, Node.js, Express, MongoDB'}
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Team Members & Lead
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                Lead: {project.leadName} ({project.regNo})
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Members: {Array.isArray(project.teamMembers) ? project.teamMembers.join(', ') : (project.members ? project.members.join(', ') : project.leadName)}
              </div>
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Faculty Guide Status
              </div>
              {project.guideName ? (
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <UserCheck size={16} />
                  <span>{project.guideName}</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={15} className="status-text-loading" />
                  <span>Guide will be assigned upon faculty review</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 8 MILESTONES & TASKS */}
      {activeTab === 'milestones' && (
        <div>
          {/* 8 Milestones Stepper Header */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              8-Stage Capstone Project Milestones
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
              {(project.milestones || []).map((m) => (
                <div 
                  key={m.id || m.number} 
                  className={`stepper-card ${m.status === 'COMPLETED' ? 'completed' : m.status === 'IN_PROGRESS' ? 'current' : ''}`}
                  style={{ padding: '0.85rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span className="step-num" style={{ color: m.status === 'COMPLETED' ? 'var(--success)' : m.status === 'IN_PROGRESS' ? 'var(--primary)' : 'var(--text-dim)' }}>
                      Stage {m.number} {m.status === 'COMPLETED' ? '✓' : ''}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>{m.dueDate}</span>
                  </div>
                  <div className="step-title" style={{ fontSize: '0.875rem' }}>{m.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{m.description || 'Milestone deliverable'}</div>
                  <div style={{ background: 'var(--bg-glass)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${m.progress}%`, height: '100%', background: m.status === 'COMPLETED' ? 'var(--success)' : 'var(--primary)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Management Section */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ListTodo size={18} style={{ color: 'var(--primary)' }} />
                  Milestone Task Manager
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.15rem' }}>
                  Create and manage actionable tasks nested under specific milestone stages.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button 
                  className="btn-aesthetic btn-glass-secondary btn-sm"
                  onClick={handleRunPrioritization}
                  disabled={isPrioritizing}
                >
                  <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                  <span>{isPrioritizing ? 'Prioritizing...' : 'AI Prioritize Tasks'}</span>
                </button>

                <button 
                  className="btn-aesthetic btn-primary-glow btn-sm"
                  onClick={() => setIsTaskModalOpen(true)}
                >
                  <Plus size={15} />
                  <span>Add New Task</span>
                </button>
              </div>
            </div>

            {project.tasks && project.tasks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {project.tasks.map((task) => (
                  <div 
                    key={task.id}
                    style={{ 
                      padding: '0.9rem 1.15rem', 
                      background: 'var(--bg-glass)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                      <button
                        onClick={() => {
                          const nextStatus = task.status === 'COMPLETED' ? 'TODO' : task.status === 'TODO' ? 'IN_PROGRESS' : 'COMPLETED';
                          if (onUpdateTaskStatus) onUpdateTaskStatus(project.id, task.id, nextStatus);
                          else {
                            const updated = (project.tasks || []).map(t => t.id === task.id ? { ...t, status: nextStatus } : t);
                            onUpdateProject({ ...project, tasks: updated });
                          }
                        }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '2px' }}
                        title="Toggle task status"
                      >
                        {task.status === 'COMPLETED' ? (
                          <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                        ) : task.status === 'IN_PROGRESS' ? (
                          <Clock size={18} style={{ color: 'var(--primary)' }} />
                        ) : (
                          <div style={{ width: 16, height: 16, borderRadius: '4px', border: '2px solid var(--text-dim)' }}></div>
                        )}
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                          <span className={`project-status-badge ${task.priority === 'HIGH' ? 'status-revision' : task.priority === 'LOW' ? '' : 'status-in-progress'}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem' }}>
                            {task.priority}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {task.dueDate}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none', opacity: task.status === 'COMPLETED' ? 0.7 : 1 }}>
                          {task.title}
                        </div>
                        {task.description && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {task.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select
                        value={task.status}
                        onChange={(e) => {
                          if (onUpdateTaskStatus) onUpdateTaskStatus(project.id, task.id, e.target.value);
                          else {
                            const updated = (project.tasks || []).map(t => t.id === task.id ? { ...t, status: e.target.value } : t);
                            onUpdateProject({ ...project, tasks: updated });
                          }
                        }}
                        className="aesthetic-input"
                        style={{ fontSize: '0.78rem', padding: '0.25rem 0.55rem', width: 'auto' }}
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="OVERDUE">OVERDUE</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <ListTodo size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ fontSize: '0.875rem' }}>No milestone tasks created yet. Click "+ Add New Task" to begin breakdown.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WEEKLY PROGRESS SUBMISSIONS */}
      {activeTab === 'weekly' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                Weekly Progress Reports
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.15rem' }}>
                Log work completed, roadblocks, and next week's targets for faculty evaluation.
              </p>
            </div>

            <button 
              className="btn-aesthetic btn-primary-glow btn-sm"
              onClick={() => setIsWeeklyModalOpen(true)}
            >
              <Plus size={15} />
              <span>Submit Weekly Progress</span>
            </button>
          </div>

          {project.weeklyUpdates && project.weeklyUpdates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {project.weeklyUpdates.map((w) => (
                <div 
                  key={w.id}
                  style={{ 
                    padding: '1.15rem', 
                    background: 'var(--bg-glass)', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-color)' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="project-domain-badge" style={{ background: 'var(--primary)', color: 'white' }}>
                        Week #{w.weekNumber}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date: {w.date}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>Progress: {w.progressPct}%</span>
                    </div>

                    {w.facultyScore !== null && w.facultyScore !== undefined ? (
                      <span className="project-status-badge status-completed" style={{ fontSize: '0.78rem' }}>
                        Score: {w.facultyScore}/100
                      </span>
                    ) : (
                      <span className="project-status-badge status-under-review" style={{ fontSize: '0.75rem' }}>
                        Awaiting Faculty Review
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '0.75rem' }}>
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
                        Problems / Obstacles
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {w.problemsFaced || 'None encountered'}
                      </p>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Next Week's Plan
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                        {w.nextWeekPlan}
                      </p>
                    </div>
                  </div>

                  {w.facultyFeedback && (
                    <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(99, 102, 241, 0.12)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.15rem' }}>
                        Faculty Guide Feedback:
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-main)' }}>
                        {w.facultyFeedback}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <TrendingUp size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.875rem' }}>No weekly updates submitted yet. Click "+ Submit Weekly Progress" to add Week 1.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DOCUMENTS & FILES */}
      {activeTab === 'documents' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                Project Document Repository
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '0.2rem', marginBottom: 0 }}>
                Upload, download, and manage your project deliverables, SRS, diagrams, and presentations.
              </p>
            </div>

            <button 
              className="btn-aesthetic btn-primary-glow btn-sm"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload size={15} />
              <span>Upload Document</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {['ALL', 'Synopsis', 'SRS', 'Design Document', 'Source Code', 'Test Report', 'Presentation', 'Final Report'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setDocFilter(cat)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: docFilter === cat ? 'var(--primary)' : 'var(--border-color)',
                  background: docFilter === cat ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-glass)',
                  color: docFilter === cat ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat === 'ALL' ? `All Documents (${project.documents?.length || 0})` : cat}
              </button>
            ))}
          </div>

          {project.documents && project.documents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(docFilter === 'ALL' ? project.documents : project.documents.filter(d => d.docType === docFilter || d.documentType === docFilter)).map((doc) => {
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
                      padding: '0.9rem 1.15rem', 
                      background: 'var(--bg-glass)', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
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
                        {isPdf ? <FileText size={20} /> : isPpt ? <Presentation size={20} /> : isZip ? <FileArchive size={20} /> : <FileCode size={20} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>{doc.fileName}</span>
                          <span className="project-domain-badge" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                            {doc.docType || 'Document'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                          <span>Format: <strong>{doc.documentType || ext?.toUpperCase() || 'PDF'}</strong></span>
                          <span>Version: <strong>v{doc.version || '1.0'}</strong></span>
                          <span>Uploaded: <strong>{doc.uploadDate || 'Recent'}</strong></span>
                          <span>Size: <strong>{doc.fileSize || '1.5 MB'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

                      <button
                        type="button"
                        onClick={() => handleDeleteDoc(doc.id || doc._id)}
                        className="btn-aesthetic btn-glass-secondary btn-sm"
                        style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '0.35rem 0.6rem' }}
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.875rem' }}>No documents found matching the filter. Click "+ Upload Document" to upload a deliverable.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: FACULTY FEEDBACK & DISCUSSION */}
      {activeTab === 'feedback' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
            Guide Feedback & Live Guidance Discussion
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
            {(project.comments || []).map((c) => (
              <div 
                key={c.id} 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: c.isGuide ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-glass)',
                  border: c.isGuide ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
                  marginLeft: c.isGuide ? '0' : '2rem',
                  marginRight: c.isGuide ? '2rem' : '0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: c.isGuide ? 'var(--primary)' : 'var(--text-main)' }}>
                    {c.author}
                  </span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{c.time}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '0.65rem' }}>
            <input
              type="text"
              placeholder={`Send message to faculty guide (${project.guideName || 'Assigned Guide'})...`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="aesthetic-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-aesthetic btn-primary-glow btn-sm">
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: REVIEWS & DEFENSE EVALUATION */}
      {activeTab === 'reviews' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <StudentReviewSection
            reviews={reviews}
            project={project}
            studentUser={user}
            onSubmitReviewDeliverable={onSubmitReviewDeliverable}
          />
        </div>
      )}

      {/* ============================================================
          AI TASK PRIORITIZATION MODAL (Per Section 16 Requirement)
          ============================================================ */}
      {isPrioritizerOpen && (
        <div className="ai-modal-overlay" onClick={() => setIsPrioritizerOpen(false)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>AI Task Prioritization Engine</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Schedule & dependency optimization</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setIsPrioritizerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isPrioritizing ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: 'var(--primary)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Prioritizing Tasks with AI...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Evaluating deadlines, milestones, and blocking dependencies.</p>
                </div>
              ) : (
                <>
                  {prioritizationData?.summary && (
                    <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        Strategic Guidance
                      </div>
                      <p style={{ fontSize: '0.86rem', margin: 0, color: 'var(--text-main)', lineHeight: '1.5' }}>
                        {prioritizationData.summary}
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(prioritizationData?.prioritizedTasks || []).map((t, idx) => (
                      <div 
                        key={idx}
                        style={{
                          padding: '1rem',
                          background: 'var(--bg-glass)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>#{t.rank || idx + 1}</span> {t.title}
                          </span>
                          <span 
                            className={`project-status-badge ${t.recommendedPriority === 'CRITICAL' || t.recommendedPriority === 'HIGH' ? 'status-revision' : 'status-in-progress'}`}
                            style={{ fontSize: '0.75rem', padding: '0.15rem 0.55rem' }}
                          >
                            Recommended: {t.recommendedPriority}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.45' }}>
                          <strong>Reason:</strong> {t.reason}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                          <button
                            className="btn-aesthetic btn-glass-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                            onClick={() => {
                              // Human in the loop: student clicks to update priority
                              const matchedTask = (project.tasks || []).find(pt => pt.title === t.title || pt.id === t.taskId);
                              if (matchedTask) {
                                const newP = t.recommendedPriority === 'CRITICAL' ? 'HIGH' : t.recommendedPriority;
                                const updatedTasks = (project.tasks || []).map(pt => pt.id === matchedTask.id ? { ...pt, priority: newP } : pt);
                                onUpdateProject({ ...project, tasks: updatedTasks });
                                alert(`Updated priority for "${t.title}" to ${newP}.`);
                              }
                            }}
                          >
                            <Check size={12} />
                            <span>Apply Recommended Priority</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                    * AI recommendations are advisory. Click "Apply Recommended Priority" to adopt suggestions.
                  </p>
                </>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setIsPrioritizerOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          AI PROJECT SUMMARY MODAL (Per Section 17 Requirement)
          ============================================================ */}
      {isSummaryOpen && (
        <div className="ai-modal-overlay" onClick={() => setIsSummaryOpen(false)}>
          <div className="ai-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="brand-icon" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Executive AI Project Summary</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>Verified milestone & task intelligence</p>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setIsSummaryOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {isSummaryLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <Loader2 size={32} className="status-text-loading" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', color: 'var(--primary)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Generating AI Summary...</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Synthesizing active milestones, completed deliverables, and blockers.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="ai-section-box">
                    <div className="ai-section-title">Status Overview</div>
                    <p style={{ fontSize: '0.875rem', lineHeight: '1.5', margin: 0, color: 'var(--text-main)' }}>
                      {summaryData?.statusSummary || 'Project is currently progressing through system design and initial backend architecture.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Completed Work</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.825rem', lineHeight: '1.45' }}>
                        {(summaryData?.completedWork || ['Completed initial problem definition and SRS.']).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="ai-section-box" style={{ margin: 0 }}>
                      <div className="ai-section-title">Pending Work</div>
                      <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.825rem', lineHeight: '1.45' }}>
                        {(summaryData?.pendingWork || ['Build Express REST Endpoints', 'Implement React UI']).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="ai-section-box" style={{ margin: 0 }}>
                    <div className="ai-section-title">Upcoming Focus</div>
                    <p style={{ fontSize: '0.86rem', lineHeight: '1.5', margin: 0, color: 'var(--text-main)' }}>
                      {summaryData?.upcomingFocus || 'Complete API routing and verify requirements coverage across all user roles.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button className="btn-aesthetic btn-glass-secondary btn-sm" onClick={() => setIsSummaryOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      <EditTeamModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        team={project}
        onSave={(updated) => {
          if (onUpdateProject) onUpdateProject(updated);
        }}
      />

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsTaskModalOpen(false)}>
          <div className="aesthetic-modal-card" style={{ maxWidth: '480px', padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsTaskModalOpen(false)}>
              <X size={16} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={18} style={{ color: 'var(--primary)' }} />
              Add Milestone Task
            </h3>
            <form onSubmit={handleCreateTaskSubmit}>
              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Database Schema for Mongoose"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="aesthetic-input"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">Milestone Stage</label>
                  <select
                    value={taskForm.milestoneId}
                    onChange={(e) => setTaskForm({ ...taskForm, milestoneId: e.target.value })}
                    className="aesthetic-input"
                    style={{ paddingLeft: '0.85rem' }}
                  >
                    <option value="m1">1. Problem Definition</option>
                    <option value="m2">2. Literature Survey</option>
                    <option value="m3">3. Requirements Analysis</option>
                    <option value="m4">4. System Design</option>
                    <option value="m5">5. Implementation</option>
                    <option value="m6">6. Testing</option>
                    <option value="m7">7. Documentation</option>
                    <option value="m8">8. Final Presentation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="aesthetic-input"
                    style={{ paddingLeft: '0.85rem' }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Task Description</label>
                <textarea
                  rows="2"
                  placeholder="Task details and expected outcome..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="aesthetic-input"
                  style={{ padding: '0.5rem 0.85rem', resize: 'vertical' }}
                ></textarea>
              </div>

              <button type="submit" className="btn-aesthetic btn-primary-glow" style={{ width: '100%', padding: '0.65rem' }}>
                <CheckCircle2 size={16} />
                <span>Save Milestone Task</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          SUBMIT WEEKLY PROGRESS MODAL WITH AI ANALYSIS (Per Section 18)
          ============================================================ */}
      {isWeeklyModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsWeeklyModalOpen(false)}>
          <div className="aesthetic-modal-card" style={{ maxWidth: '620px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsWeeklyModalOpen(false)}>
              <X size={16} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              Submit Weekly Progress Update
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Draft your weekly report and test with AI to detect potential blockers before submitting.
            </p>

            <form onSubmit={handleWeeklySubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={weeklyForm.weekNumber}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, weekNumber: e.target.value })}
                    className="aesthetic-input"
                    style={{ paddingLeft: '0.85rem' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cumulative Progress % (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={weeklyForm.progressPct}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, progressPct: e.target.value })}
                    className="aesthetic-input"
                    style={{ paddingLeft: '0.85rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Work Completed This Week *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Summary of tasks completed, features coded, or docs written..."
                  value={weeklyForm.workCompleted}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, workCompleted: e.target.value })}
                  className="aesthetic-input"
                  style={{ padding: '0.5rem 0.85rem', resize: 'vertical' }}
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label">Problems / Roadblocks Faced</label>
                <textarea
                  rows="2"
                  placeholder="Any technical, architectural, or library roadblocks encountered..."
                  value={weeklyForm.problemsFaced}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, problemsFaced: e.target.value })}
                  className="aesthetic-input"
                  style={{ padding: '0.5rem 0.85rem', resize: 'vertical' }}
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Next Week's Action Plan *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Planned milestones and targets for next week..."
                  value={weeklyForm.nextWeekPlan}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, nextWeekPlan: e.target.value })}
                  className="aesthetic-input"
                  style={{ padding: '0.5rem 0.85rem', resize: 'vertical' }}
                ></textarea>
              </div>

              {/* AI Report Analysis Section */}
              {weeklyAnalysis && (
                <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#818CF8', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={14} /> AI Report Analysis
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    <strong>Summary:</strong> {weeklyAnalysis.summary}
                  </div>
                  {weeklyAnalysis.detectedBlockers?.length > 0 && (
                    <div style={{ fontSize: '0.82rem', color: '#F87171', marginBottom: '0.35rem' }}>
                      <strong>Potential Blocker:</strong> {weeklyAnalysis.detectedBlockers.join(', ')}
                    </div>
                  )}
                  {weeklyAnalysis.clarityImprovements && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong>Clarity Tip:</strong> {weeklyAnalysis.clarityImprovements}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="btn-aesthetic btn-glass-secondary btn-sm"
                  onClick={handleAnalyzeWeeklyDraft}
                  disabled={isAnalyzingWeekly}
                >
                  {isAnalyzingWeekly ? (
                    <>
                      <Loader2 size={14} className="status-text-loading" />
                      <span>Analyzing Draft...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                      <span>Analyze with AI</span>
                    </>
                  )}
                </button>

                <button type="submit" className="btn-aesthetic btn-primary-glow btn-sm">
                  <Send size={15} />
                  <span>Submit Weekly Report to Guide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        project={project}
        user={user}
        onUploadSuccess={handleDocUploadSuccess}
      />

      {/* Floating or Header-connected AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userRole="STUDENT"
        context={project}
        initialPrompt={assistantPrompt}
      />
    </div>
  );
};

export default StudentDashboard;
