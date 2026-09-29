import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Star, 
  HelpCircle, 
  Edit3, 
  Save, 
  ThumbsUp, 
  AlertTriangle,
  Loader2,
  Check
} from 'lucide-react';

const ReviewEvaluationModal = ({
  isOpen,
  onClose,
  mode = 'view', // 'view' (Student/Guide view) | 'ai_suggestion' (Review AI assessment) | 'grade' (Faculty editing official grade)
  review,
  submission,
  evaluation,
  aiSuggestion,
  onSaveOfficialEvaluation,
  onApplyAiToGrading
}) => {
  if (!isOpen || !review) return null;

  const maxMarks = review.maxMarks || 50;

  // Official Grading form state
  const [marks, setMarks] = useState(evaluation?.marks || aiSuggestion?.suggestedMarks || Math.round(maxMarks * 0.88));
  const [grade, setGrade] = useState(evaluation?.grade || aiSuggestion?.suggestedGrade || 'A+');
  const [comments, setComments] = useState(
    evaluation?.comments || aiSuggestion?.feedbackSummary || 'Solid work demonstrated during review. Proceed with next phase.'
  );
  const [feedback, setFeedback] = useState(
    evaluation?.feedback || (aiSuggestion?.vivaQuestions ? `Viva Questions:\n- ${aiSuggestion.vivaQuestions.join('\n- ')}` : '')
  );
  const [strengthsText, setStrengthsText] = useState(
    (evaluation?.strengths || aiSuggestion?.strengths || ['Clear problem formulation', 'Appropriate technology stack']).join('\n')
  );
  const [weaknessesText, setWeaknessesText] = useState(
    (evaluation?.weaknesses || aiSuggestion?.weaknesses || ['Elaborate on data validation and test coverage']).join('\n')
  );

  const [rubricScores, setRubricScores] = useState(() => {
    if (evaluation?.rubricBreakdown?.length) {
      return evaluation.rubricBreakdown;
    }
    if (aiSuggestion?.rubricBreakdown?.length) {
      return aiSuggestion.rubricBreakdown;
    }
    const defCriteria = review.rubricCriteria?.length ? review.rubricCriteria : [
      { name: 'Problem Statement & Scope', maxScore: 10 },
      { name: 'System Architecture & Design', maxScore: 15 },
      { name: 'Implementation & Prototype Demo', maxScore: 15 },
      { name: 'Presentation & Defense', maxScore: 10 }
    ];
    return defCriteria.map(c => ({
      criterion: c.name,
      score: Math.round(c.maxScore * 0.85),
      maxScore: c.maxScore,
      remarks: 'Satisfactory completion of criteria.'
    }));
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if aiSuggestion is loaded
  useEffect(() => {
    if (aiSuggestion && mode === 'grade' && !evaluation) {
      if (aiSuggestion.suggestedMarks) setMarks(aiSuggestion.suggestedMarks);
      if (aiSuggestion.suggestedGrade) setGrade(aiSuggestion.suggestedGrade);
      if (aiSuggestion.feedbackSummary) setComments(aiSuggestion.feedbackSummary);
      if (aiSuggestion.strengths) setStrengthsText(aiSuggestion.strengths.join('\n'));
      if (aiSuggestion.weaknesses) setWeaknessesText(aiSuggestion.weaknesses.join('\n'));
      if (aiSuggestion.rubricBreakdown) setRubricScores(aiSuggestion.rubricBreakdown);
    }
  }, [aiSuggestion, mode]);

  const handleScoreChange = (index, newScore) => {
    const updated = [...rubricScores];
    const val = Math.max(0, Math.min(updated[index].maxScore, Number(newScore) || 0));
    updated[index].score = val;
    setRubricScores(updated);

    // Auto-sum total marks
    const total = updated.reduce((sum, item) => sum + (Number(item.score) || 0), 0);
    setMarks(total);

    // Auto-calculate grade
    const pct = (total / maxMarks) * 100;
    if (pct >= 90) setGrade('O');
    else if (pct >= 80) setGrade('A+');
    else if (pct >= 70) setGrade('A');
    else if (pct >= 60) setGrade('B+');
    else if (pct >= 50) setGrade('B');
    else setGrade('RA');
  };

  const handleApplyAiSuggestions = () => {
    if (!aiSuggestion) return;
    setMarks(aiSuggestion.suggestedMarks || marks);
    setGrade(aiSuggestion.suggestedGrade || grade);
    if (aiSuggestion.feedbackSummary) setComments(aiSuggestion.feedbackSummary);
    if (aiSuggestion.strengths) setStrengthsText(aiSuggestion.strengths.join('\n'));
    if (aiSuggestion.weaknesses) setWeaknessesText(aiSuggestion.weaknesses.join('\n'));
    if (aiSuggestion.rubricBreakdown) setRubricScores(aiSuggestion.rubricBreakdown);
    if (onApplyAiToGrading) onApplyAiToGrading(aiSuggestion);
  };

  const handleSaveEvaluation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      marks: Number(marks),
      maxMarks: Number(maxMarks),
      grade,
      comments: comments.trim(),
      feedback: feedback.trim(),
      strengths: strengthsText.split('\n').map(s => s.trim()).filter(Boolean),
      weaknesses: weaknessesText.split('\n').map(w => w.trim()).filter(Boolean),
      rubricBreakdown: rubricScores
    };

    try {
      if (onSaveOfficialEvaluation) {
        await onSaveOfficialEvaluation(review._id || review.id, payload);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save evaluation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeEval = mode === 'ai_suggestion' ? aiSuggestion : evaluation;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 15, 30, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1060,
      padding: '20px'
    }}>
      <div className="modal-container" style={{
        background: 'var(--card-bg, #0f172a)',
        border: `1px solid ${mode === 'ai_suggestion' ? 'rgba(168, 85, 247, 0.4)' : 'var(--border, rgba(255, 255, 255, 0.12))'}`,
        borderRadius: '18px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        color: 'var(--text-primary, #f8fafc)',
        boxShadow: mode === 'ai_suggestion' 
          ? '0 25px 60px -12px rgba(168, 85, 247, 0.3)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: mode === 'ai_suggestion' 
            ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)' 
            : 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: mode === 'ai_suggestion'
                ? 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              {mode === 'ai_suggestion' ? <Sparkles size={22} /> : <Award size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                  {mode === 'ai_suggestion' ? 'AI Suggested Evaluation' : mode === 'grade' ? 'Faculty Review Evaluation' : 'Official Evaluation Report'}
                </h3>
                {mode === 'ai_suggestion' && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: '#c084fc',
                    border: '1px solid rgba(168, 85, 247, 0.4)'
                  }}>
                    ADVISORY ONLY
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }}>
                {review.title} • Max Marks: {maxMarks}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* AI Banner Notice */}
          {mode === 'ai_suggestion' && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start'
            }}>
              <Sparkles size={18} style={{ color: '#a855f7', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)', lineHeight: 1.5 }}>
                <strong style={{ color: '#e9d5ff', display: 'block', marginBottom: '2px' }}>
                  AI Suggested Rubric & Defense Insights
                </strong>
                This score and feedback are generated by ProjIntel AI based on project deliverables and rubric criteria. 
                As the assigned faculty guide, you can review, edit, and submit the final official grade.
              </div>
            </div>
          )}

          {/* Mode: GRADE (Faculty input form) */}
          {mode === 'grade' ? (
            <form id="evaluation-form" onSubmit={handleSaveEvaluation}>
              {/* Score & Grade Overview Card */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                padding: '18px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Total Marks Scored (out of {maxMarks}) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={maxMarks}
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Final Letter Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="O">O (Outstanding - 90-100%)</option>
                    <option value="A+">A+ (Excellent - 80-89%)</option>
                    <option value="A">A (Very Good - 70-79%)</option>
                    <option value="B+">B+ (Good - 60-69%)</option>
                    <option value="B">B (Above Average - 50-59%)</option>
                    <option value="C">C (Pass - 40-49%)</option>
                    <option value="RA">RA (Reappear / Inadequate)</option>
                  </select>
                </div>
              </div>

              {/* Rubric Criteria Table */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600 }}>
                    Rubric Criteria Breakdown
                  </label>
                  {aiSuggestion && (
                    <button
                      type="button"
                      onClick={handleApplyAiSuggestions}
                      style={{
                        background: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        color: '#c084fc',
                        fontSize: '11px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={12} />
                      Sync with AI Suggestions
                    </button>
                  )}
                </div>

                <div style={{
                  borderRadius: '10px',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                  overflow: 'hidden'
                }}>
                  {rubricScores.map((rc, idx) => (
                    <div key={idx} style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: idx < rubricScores.length - 1 ? '1px solid var(--border, rgba(255, 255, 255, 0.06))' : 'none',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                    }}>
                      <div style={{ flex: 1, paddingRight: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{rc.criterion}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
                          Max: {rc.maxScore} marks
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          min="0"
                          max={rc.maxScore}
                          value={rc.score}
                          onChange={(e) => handleScoreChange(idx, e.target.value)}
                          style={{
                            width: '65px',
                            padding: '6px 8px',
                            textAlign: 'center',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 600
                          }}
                        />
                        <span style={{ fontSize: '13px', color: 'var(--text-muted, #94a3b8)' }}>
                          / {rc.maxScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                    Identified Strengths (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={strengthsText}
                    onChange={(e) => setStrengthsText(e.target.value)}
                    placeholder="Enter project strengths..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                    Areas for Improvement (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={weaknessesText}
                    onChange={(e) => setWeaknessesText(e.target.value)}
                    placeholder="Enter areas needing work..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                      color: '#fff',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Official Comments */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Official Faculty Comments & Evaluation Remarks <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required
                  placeholder="Official comments regarding defense and presentation..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                    color: '#fff',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Next Action Directives */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
                  Next Phase Directives & Viva Q&A Notes
                </label>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Actionable directives for the next review..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </form>
          ) : (
            /* Mode: VIEW or AI_SUGGESTION */
            <div>
              {/* Score Header Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderRadius: '14px',
                background: mode === 'ai_suggestion' 
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)' 
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                border: `1px solid ${mode === 'ai_suggestion' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
                    {mode === 'ai_suggestion' ? 'AI SUGGESTED SCORE' : 'FINAL OFFICIAL SCORE'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 800, color: mode === 'ai_suggestion' ? '#c084fc' : '#34d399' }}>
                      {activeEval?.suggestedMarks ?? activeEval?.marks ?? 0}
                    </span>
                    <span style={{ fontSize: '16px', color: 'var(--text-muted, #94a3b8)' }}>
                      / {activeEval?.maxMarks ?? maxMarks} marks
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted, #94a3b8)', fontWeight: 500 }}>
                    GRADE
                  </div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#fff',
                    padding: '4px 16px',
                    borderRadius: '10px',
                    background: mode === 'ai_suggestion' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                    marginTop: '4px',
                    display: 'inline-block'
                  }}>
                    {activeEval?.suggestedGrade ?? activeEval?.grade ?? 'A'}
                  </div>
                </div>
              </div>

              {/* Rubric Breakdown */}
              {activeEval?.rubricBreakdown && activeEval.rubricBreakdown.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px 0' }}>
                    Rubric Evaluation Breakdown
                  </h4>
                  <div style={{
                    borderRadius: '10px',
                    border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                    overflow: 'hidden'
                  }}>
                    {activeEval.rubricBreakdown.map((item, i) => (
                      <div key={i} style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: i < activeEval.rubricBreakdown.length - 1 ? '1px solid var(--border, rgba(255, 255, 255, 0.06))' : 'none',
                        background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{item.criterion}</div>
                          {item.remarks && (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                              {item.remarks}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                          {item.score} / {item.maxScore}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <ThumbsUp size={15} /> Identified Strengths
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)', lineHeight: 1.6 }}>
                    {(activeEval?.strengths || ['Good technical formulation']).map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.06)',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={15} /> Areas for Improvement
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)', lineHeight: 1.6 }}>
                    {(activeEval?.weaknesses || ['Continue rigorous milestone implementation']).map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Comments & Feedback */}
              <div style={{
                padding: '16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary, #f8fafc)', marginBottom: '6px' }}>
                  {mode === 'ai_suggestion' ? 'AI Suggested Evaluation Summary' : 'Faculty Feedback & Remarks'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary, #cbd5e1)', lineHeight: 1.6 }}>
                  {activeEval?.feedbackSummary || activeEval?.comments || 'No comments recorded.'}
                </div>
              </div>

              {/* Recommended Viva Questions (AI mode) */}
              {activeEval?.vivaQuestions && activeEval.vivaQuestions.length > 0 && (
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <HelpCircle size={15} /> Recommended Viva Defense Questions (for Guide)
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: 'var(--text-secondary, #cbd5e1)', lineHeight: 1.6 }}>
                    {activeEval.vivaQuestions.map((q, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{q}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
              color: 'var(--text-secondary, #cbd5e1)',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>

          {mode === 'ai_suggestion' && (
            <button
              type="button"
              onClick={handleApplyAiSuggestions}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Edit3 size={16} />
              Open in Official Grading Form
            </button>
          )}

          {mode === 'grade' && (
            <button
              type="submit"
              form="evaluation-form"
              disabled={isSubmitting}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin-animation" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Submit Official Grade
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewEvaluationModal;
