import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  FileText, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Sparkles, 
  Edit3, 
  Eye, 
  FileCheck, 
  Download,
  Filter,
  Layers,
  Loader2,
  ExternalLink
} from 'lucide-react';
import ScheduleReviewModal from './ScheduleReviewModal';
import ReviewEvaluationModal from './ReviewEvaluationModal';
import { evaluateReviewWithAI } from '../services/aiService';

const GuideReviewSection = ({
  reviews = [],
  assignedProjects = [],
  currentGuideId = 'FAC-102',
  currentGuideName = 'Dr. A. Sharma (HOD)',
  onScheduleReview,
  onSaveOfficialEvaluation
}) => {
  const [filterState, setFilterState] = useState('ALL'); // 'ALL' | 'PENDING_EVAL' | 'COMPLETED'
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  
  // AI Evaluation Loading State per Review ID
  const [aiLoadingReviewId, setAiLoadingReviewId] = useState(null);
  
  // Modal states
  const [evaluationModalConfig, setEvaluationModalConfig] = useState({
    isOpen: false,
    mode: 'grade', // 'grade' | 'ai_suggestion' | 'view'
    review: null,
    submission: null,
    evaluation: null,
    aiSuggestion: null
  });

  // Filter reviews
  const filteredReviews = reviews.filter(rev => {
    const isCompleted = rev.status === 'COMPLETED' || rev.submission?.status === 'REVIEWED';
    const hasSubmission = Boolean(rev.submission);
    
    if (filterState === 'PENDING_EVAL') {
      return hasSubmission && !isCompleted;
    }
    if (filterState === 'COMPLETED') {
      return isCompleted;
    }
    return true;
  });

  const pendingGradingCount = reviews.filter(r => r.submission && r.status !== 'COMPLETED' && r.submission.status !== 'REVIEWED').length;

  const handleRunAiEvaluation = async (review) => {
    if (!review.submission) {
      alert('Cannot run AI evaluation: No deliverable has been submitted by the student team yet.');
      return;
    }

    setAiLoadingReviewId(review._id || review.id);

    try {
      const project = assignedProjects.find(p => (p._id || p.id) === (review.project?._id || review.project?.id || review.project)) || {
        title: review.title,
        domain: 'Computer Science & Engineering',
        problemStatement: 'Academic project review deliverables',
        objectives: ['Review technical milestones']
      };

      const res = await evaluateReviewWithAI(review, review.submission, project);
      if (res && res.success) {
        const aiData = res.data || res;
        setEvaluationModalConfig({
          isOpen: true,
          mode: 'ai_suggestion',
          review: review,
          submission: review.submission,
          evaluation: review.officialEvaluation,
          aiSuggestion: aiData
        });
      } else {
        alert(res?.error || 'AI Evaluation service unavailable. Please check server connection.');
      }
    } catch (err) {
      console.error('Error running AI review evaluation:', err);
      alert('Failed to generate AI evaluation.');
    } finally {
      setAiLoadingReviewId(null);
    }
  };

  const handleOpenGradeModal = (review, initialAiData = null) => {
    setEvaluationModalConfig({
      isOpen: true,
      mode: 'grade',
      review: review,
      submission: review.submission,
      evaluation: review.officialEvaluation,
      aiSuggestion: initialAiData || review.aiSuggestedEvaluation
    });
  };

  const handleOpenViewModal = (review) => {
    setEvaluationModalConfig({
      isOpen: true,
      mode: 'view',
      review: review,
      submission: review.submission,
      evaluation: review.officialEvaluation,
      aiSuggestion: review.aiSuggestedEvaluation
    });
  };

  const handleApplyAiToGrading = (aiData) => {
    setEvaluationModalConfig(prev => ({
      ...prev,
      mode: 'grade',
      aiSuggestion: aiData
    }));
  };

  return (
    <div className="guide-review-section">
      {/* Top Header & Actions Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
            Project Milestone Reviews & Defense Evaluations
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted, #94a3b8)' }}>
            Schedule review defense sessions, inspect student deliverables, and evaluate with AI assistance
          </p>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            border: 'none',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}
        >
          <Plus size={18} /> Schedule New Review
        </button>
      </div>

      {/* Filter Tabs & Pending Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '10px',
          padding: '4px',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.08))'
        }}>
          <button
            onClick={() => setFilterState('ALL')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              background: filterState === 'ALL' ? 'var(--card-bg, #1e293b)' : 'transparent',
              color: filterState === 'ALL' ? 'var(--text-primary, #f8fafc)' : 'var(--text-muted, #94a3b8)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilterState('PENDING_EVAL')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              background: filterState === 'PENDING_EVAL' ? 'var(--card-bg, #1e293b)' : 'transparent',
              color: filterState === 'PENDING_EVAL' ? '#60a5fa' : 'var(--text-muted, #94a3b8)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Needs Grading ({pendingGradingCount})
          </button>
          <button
            onClick={() => setFilterState('COMPLETED')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              border: 'none',
              background: filterState === 'COMPLETED' ? 'var(--card-bg, #1e293b)' : 'transparent',
              color: filterState === 'COMPLETED' ? '#34d399' : 'var(--text-muted, #94a3b8)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Completed & Graded ({reviews.filter(r => r.status === 'COMPLETED' || r.submission?.status === 'REVIEWED').length})
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredReviews.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            borderRadius: '16px',
            background: 'var(--card-bg, #131b2e)',
            border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
            textAlign: 'center'
          }}>
            <Calendar size={48} style={{ color: 'var(--text-muted, #94a3b8)', opacity: 0.5, margin: '0 auto 16px' }} />
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>No Reviews Match This Filter</h4>
            <p style={{ margin: 0, color: 'var(--text-muted, #94a3b8)', fontSize: '14px' }}>
              Schedule a review for any of your assigned student project teams.
            </p>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const hasSubmission = Boolean(rev.submission);
            const isCompleted = rev.status === 'COMPLETED' || rev.submission?.status === 'REVIEWED';
            const isAiLoading = aiLoadingReviewId === (rev._id || rev.id);
            const officialEval = rev.officialEvaluation || (rev.evaluations && rev.evaluations.find(e => e.evaluationType === 'FACULTY'));
            
            // Find project title
            const targetProj = assignedProjects.find(p => (p._id || p.id) === (rev.project?._id || rev.project?.id || rev.project));
            const projectTitle = targetProj?.title || rev.project?.title || 'Academic Project';

            return (
              <div 
                key={rev._id || rev.id}
                style={{
                  borderRadius: '16px',
                  background: 'var(--card-bg, #131b2e)',
                  border: isCompleted 
                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : hasSubmission 
                    ? '1px solid rgba(99, 102, 241, 0.3)' 
                    : '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Header Info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                        textTransform: 'uppercase'
                      }}>
                        {rev.reviewType || 'Milestone Review'}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted, #94a3b8)' }}>
                        Project: <strong>{projectTitle}</strong>
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                      {rev.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-secondary, #cbd5e1)'
                    }}>
                      Max: {rev.maxMarks || 50} Marks
                    </span>

                    {isCompleted ? (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399'
                      }}>
                        Completed ({officialEval?.marks || 47} / {rev.maxMarks || 50})
                      </span>
                    ) : hasSubmission ? (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa'
                      }}>
                        Submission Ready for Review
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24'
                      }}>
                        Awaiting Student Submission
                      </span>
                    )}
                  </div>
                </div>

                {/* Meta details grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.06))',
                  marginBottom: '18px',
                  fontSize: '12px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted, #94a3b8)', display: 'block' }}>SCHEDULED DEFENSE:</span>
                    <strong style={{ color: 'var(--text-primary, #f8fafc)' }}>
                      {new Date(rev.scheduledDate).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted, #94a3b8)', display: 'block' }}>SUBMISSION DEADLINE:</span>
                    <strong style={{ color: 'var(--text-primary, #f8fafc)' }}>
                      {new Date(rev.deadline).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted, #94a3b8)', display: 'block' }}>REQUIRED FORMAT:</span>
                    <strong style={{ color: '#a855f7' }}>
                      {rev.requiredDocType || 'PDF / PPTX'}
                    </strong>
                  </div>
                </div>

                {/* Submissions & Actions Section */}
                {hasSubmission ? (
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    {/* Deliverable info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                          {rev.submission.fileName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                          Submitted by {rev.submission.submittedBy?.name || 'Student Lead'} • {rev.submission.fileSize || '4.2 MB'} • {new Date(rev.submission.submissionTime).toLocaleString()}
                        </div>
                        {rev.submission.notes && (
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)', marginTop: '4px', fontStyle: 'italic' }}>
                            "{rev.submission.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Guide Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* AI Evaluate Button */}
                      <button
                        onClick={() => handleRunAiEvaluation(rev)}
                        disabled={isAiLoading}
                        style={{
                          padding: '9px 16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                          border: '1px solid rgba(168, 85, 247, 0.4)',
                          color: '#e9d5ff',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: isAiLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {isAiLoading ? (
                          <>
                            <Loader2 size={15} className="spin-animation" />
                            Evaluating with AI...
                          </>
                        ) : (
                          <>
                            <Sparkles size={15} style={{ color: '#c084fc' }} />
                            AI Evaluate
                          </>
                        )}
                      </button>

                      {/* Official Grade / View Button */}
                      {isCompleted ? (
                        <button
                          onClick={() => handleOpenViewModal(rev)}
                          style={{
                            padding: '9px 16px',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#34d399',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Eye size={15} /> View Final Grade
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenGradeModal(rev)}
                          style={{
                            padding: '9px 18px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          <Edit3 size={15} /> Grade / Evaluate
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px dashed var(--border, rgba(255, 255, 255, 0.12))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: 'var(--text-muted, #94a3b8)'
                  }}>
                    <span>No student deliverables submitted for this review session yet.</span>
                    <span style={{ fontSize: '12px', color: '#fbbf24' }}>
                      Cutoff: {new Date(rev.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Review Modal */}
      {isScheduleModalOpen && (
        <ScheduleReviewModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          assignedProjects={assignedProjects}
          currentGuideId={currentGuideId}
          currentGuideName={currentGuideName}
          onScheduleSuccess={onScheduleReview}
        />
      )}

      {/* Evaluation & AI Modal */}
      {evaluationModalConfig.isOpen && (
        <ReviewEvaluationModal
          isOpen={evaluationModalConfig.isOpen}
          onClose={() => setEvaluationModalConfig({ ...evaluationModalConfig, isOpen: false })}
          mode={evaluationModalConfig.mode}
          review={evaluationModalConfig.review}
          submission={evaluationModalConfig.submission}
          evaluation={evaluationModalConfig.evaluation}
          aiSuggestion={evaluationModalConfig.aiSuggestion}
          onSaveOfficialEvaluation={onSaveOfficialEvaluation}
          onApplyAiToGrading={handleApplyAiToGrading}
        />
      )}
    </div>
  );
};

export default GuideReviewSection;
