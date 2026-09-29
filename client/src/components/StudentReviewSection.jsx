import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Upload, 
  FileText, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  FileCode, 
  Presentation, 
  ExternalLink,
  ChevronRight,
  Eye,
  FileCheck
} from 'lucide-react';
import SubmitReviewModal from './SubmitReviewModal';
import ReviewEvaluationModal from './ReviewEvaluationModal';

const StudentReviewSection = ({ 
  reviews = [], 
  project, 
  studentUser, 
  onSubmitReviewDeliverable 
}) => {
  const [selectedReviewForSubmit, setSelectedReviewForSubmit] = useState(null);
  const [selectedReviewForView, setSelectedReviewForView] = useState(null);

  const completedCount = reviews.filter(r => r.status === 'COMPLETED' || r.submission?.status === 'REVIEWED').length;
  const pendingCount = reviews.filter(r => (!r.submission || r.submission.status === 'PENDING') && r.status !== 'COMPLETED').length;

  return (
    <div className="student-review-section">
      {/* Top Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '18px 20px',
          borderRadius: '14px',
          background: 'var(--card-bg, #131b2e)',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
              TOTAL REVIEWS
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
              {reviews.length}
            </div>
          </div>
        </div>

        <div style={{
          padding: '18px 20px',
          borderRadius: '14px',
          background: 'var(--card-bg, #131b2e)',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
              PENDING SUBMISSIONS
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#fbbf24' }}>
              {pendingCount}
            </div>
          </div>
        </div>

        <div style={{
          padding: '18px 20px',
          borderRadius: '14px',
          background: 'var(--card-bg, #131b2e)',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
              EVALUATED & GRADED
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#34d399' }}>
              {completedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {reviews.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            borderRadius: '16px',
            background: 'var(--card-bg, #131b2e)',
            border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
            textAlign: 'center'
          }}>
            <Calendar size={48} style={{ color: 'var(--text-muted, #94a3b8)', opacity: 0.5, margin: '0 auto 16px' }} />
            <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>No Reviews Scheduled Yet</h4>
            <p style={{ margin: 0, color: 'var(--text-muted, #94a3b8)', fontSize: '14px' }}>
              Your faculty guide will schedule milestone reviews and project defenses here.
            </p>
          </div>
        ) : (
          reviews.map((rev) => {
            const hasSubmission = Boolean(rev.submission);
            const isReviewed = rev.status === 'COMPLETED' || rev.submission?.status === 'REVIEWED';
            const isLate = rev.submission?.status === 'LATE';
            const deadlinePassed = rev.deadline && new Date() > new Date(rev.deadline);
            const officialEval = rev.officialEvaluation || (rev.evaluations && rev.evaluations.find(e => e.evaluationType === 'FACULTY'));

            return (
              <div 
                key={rev._id || rev.id}
                style={{
                  borderRadius: '16px',
                  background: 'var(--card-bg, #131b2e)',
                  border: isReviewed 
                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : hasSubmission 
                    ? '1px solid rgba(59, 130, 246, 0.3)' 
                    : '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Status Indicator Stripe */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: isReviewed 
                    ? 'linear-gradient(90deg, #10b981, #059669)' 
                    : hasSubmission 
                    ? 'linear-gradient(90deg, #3b82f6, #2563eb)' 
                    : 'linear-gradient(90deg, #f59e0b, #d97706)'
                }} />

                {/* Header Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-secondary, #cbd5e1)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {rev.reviewType || 'Milestone Review'}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--text-muted, #94a3b8)'
                      }}>
                        Max: {rev.maxMarks || 50} Marks
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                      {rev.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isReviewed ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        fontSize: '13px',
                        fontWeight: 600
                      }}>
                        <CheckCircle2 size={16} />
                        Evaluated ({officialEval?.marks || 47} / {rev.maxMarks || 50})
                      </div>
                    ) : hasSubmission ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: isLate ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        border: `1px solid ${isLate ? 'rgba(245, 158, 11, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                        color: isLate ? '#fbbf24' : '#60a5fa',
                        fontSize: '13px',
                        fontWeight: 600
                      }}>
                        <FileCheck size={16} />
                        {isLate ? 'Submitted (Late)' : 'Deliverables Submitted'}
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: deadlinePassed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        border: `1px solid ${deadlinePassed ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        color: deadlinePassed ? '#f87171' : '#fbbf24',
                        fontSize: '13px',
                        fontWeight: 600
                      }}>
                        <Clock size={16} />
                        {deadlinePassed ? 'Submission Overdue' : 'Pending Submission'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date & Instructions Info Box */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.06))',
                  marginBottom: '18px'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
                      DEFENSE DATE & TIME
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} style={{ color: '#60a5fa' }} />
                      {new Date(rev.scheduledDate).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
                      SUBMISSION CUTOFF DEADLINE
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', color: deadlinePassed && !hasSubmission ? '#f87171' : 'var(--text-primary, #f8fafc)' }}>
                      <Clock size={14} style={{ color: deadlinePassed && !hasSubmission ? '#f87171' : '#fbbf24' }} />
                      {new Date(rev.deadline).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
                      REQUIRED FORMAT
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', color: '#a855f7' }}>
                      {rev.requiredDocType || 'PDF / PPTX'}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div style={{ fontSize: '13px', color: 'var(--text-secondary, #cbd5e1)', marginBottom: '18px', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-primary, #f8fafc)' }}>Instructions: </strong>
                  {rev.instructions}
                </div>

                {/* Submission State Card or Completed Evaluation Banner */}
                {isReviewed ? (
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} /> Final Official Grade Awarded
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                        {officialEval?.marks || 47} / {rev.maxMarks || 50} Marks 
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          padding: '2px 10px',
                          borderRadius: '6px',
                          background: 'rgba(16, 185, 129, 0.25)',
                          color: '#34d399',
                          marginLeft: '10px'
                        }}>
                          Grade: {officialEval?.grade || 'O'}
                        </span>
                      </div>
                      {officialEval?.comments && (
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)', marginTop: '4px', fontStyle: 'italic' }}>
                          "{officialEval.comments.substring(0, 90)}..."
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedReviewForView(rev)}
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
                        gap: '6px'
                      }}
                    >
                      <Eye size={15} /> View Evaluation & Feedback
                    </button>
                  </div>
                ) : hasSubmission ? (
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.08)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                          {rev.submission.fileName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                          Uploaded {new Date(rev.submission.submissionTime).toLocaleDateString()} • {rev.submission.fileSize || '3.5 MB'} • Status: {rev.submission.status}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedReviewForSubmit(rev)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                        color: 'var(--text-secondary, #cbd5e1)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                    >
                      Update / Resubmit
                    </button>
                  </div>
                ) : (
                  /* No submission yet */
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px dashed var(--border, rgba(255, 255, 255, 0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary, #cbd5e1)' }}>
                      No presentation slides or report uploaded yet.
                    </div>
                    <button
                      onClick={() => setSelectedReviewForSubmit(rev)}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        border: 'none',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Upload size={15} /> Upload & Submit Deliverable
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Submit Modal */}
      {selectedReviewForSubmit && (
        <SubmitReviewModal
          isOpen={Boolean(selectedReviewForSubmit)}
          onClose={() => setSelectedReviewForSubmit(null)}
          review={selectedReviewForSubmit}
          project={project}
          studentUser={studentUser}
          onSubmitSuccess={onSubmitReviewDeliverable}
        />
      )}

      {/* View Evaluation Modal */}
      {selectedReviewForView && (
        <ReviewEvaluationModal
          isOpen={Boolean(selectedReviewForView)}
          onClose={() => setSelectedReviewForView(null)}
          mode="view"
          review={selectedReviewForView}
          submission={selectedReviewForView.submission}
          evaluation={selectedReviewForView.officialEvaluation || (selectedReviewForView.evaluations && selectedReviewForView.evaluations.find(e => e.evaluationType === 'FACULTY'))}
        />
      )}
    </div>
  );
};

export default StudentReviewSection;
