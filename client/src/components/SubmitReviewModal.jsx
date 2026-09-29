import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Presentation, 
  FileArchive,
  Send,
  Loader2
} from 'lucide-react';
import { uploadReviewDeliverableFile } from '../services/documentService';

const SubmitReviewModal = ({ 
  isOpen, 
  onClose, 
  review, 
  project, 
  studentUser, 
  onSubmitSuccess 
}) => {
  if (!isOpen || !review) return null;

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(
    `${project?.title ? project.title.split(' ')[0] : 'Team'}_${(review.reviewType || 'Review').replace(/\s+/g, '_')}_Deliverable.pdf`
  );
  const [docType, setDocType] = useState('PDF');
  const [fileSize, setFileSize] = useState('3.8 MB');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isPastDeadline = review.deadline && new Date() > new Date(review.deadline);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleSetFile(file);
    }
  };

  const handleSetFile = (file) => {
    setSelectedFile(file);
    setFileName(file.name);
    const ext = file.name.split('.').pop().toUpperCase();
    if (['PPT', 'PPTX'].includes(ext)) setDocType('PPTX');
    else if (['ZIP', 'RAR', 'TAR', 'GZ'].includes(ext)) setDocType('ZIP');
    else setDocType('PDF');

    const formattedSize = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(1)} KB`;
    setFileSize(formattedSize);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName.trim()) {
      setError('Please provide a valid deliverable file.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedFile) {
        // Real file upload to backend
        const res = await uploadReviewDeliverableFile(review._id || review.id, selectedFile, {
          projectId: project?._id || project?.id,
          studentId: studentUser?._id || studentUser?.id,
          documentType: docType,
          notes: notes.trim()
        });

        if (res && res.success) {
          if (onSubmitSuccess) {
            await onSubmitSuccess(review._id || review.id, res.data);
          }
          onClose();
          return;
        }
      }

      // Fallback or metadata submission
      const submissionPayload = {
        projectId: project?._id || project?.id,
        studentId: studentUser?._id || studentUser?.id,
        fileName: fileName.trim(),
        filePath: `/uploads/reviews/${fileName.trim()}`,
        documentType: docType,
        fileSize: fileSize,
        notes: notes.trim(),
        submissionTime: new Date().toISOString(),
        status: isPastDeadline ? 'LATE' : 'SUBMITTED'
      };

      if (onSubmitSuccess) {
        await onSubmitSuccess(review._id || review.id, submissionPayload);
      }
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit deliverable.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocIcon = (type) => {
    if (type === 'PPTX' || type === 'PPT') return <Presentation size={18} color="#F59E0B" />;
    if (type === 'ZIP') return <FileArchive size={18} color="#8B5CF6" />;
    return <FileText size={18} color="#EF4444" />;
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 15, 30, 0.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '20px'
      }}
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card-bg, #131b2e)',
          border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '560px',
          color: 'var(--text-primary, #f8fafc)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          animation: 'fadeInScale 0.25s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Submit Review Deliverable</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)' }}>
                {review.title}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Deadline Notice */}
        <div style={{
          padding: '12px 24px',
          background: isPastDeadline ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.08)',
          borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.05))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isPastDeadline ? <AlertTriangle size={15} color="#EF4444" /> : <Clock size={15} color="#818CF8" />}
            <span style={{ color: isPastDeadline ? '#F87171' : 'var(--text-primary)' }}>
              {isPastDeadline ? 'Past Deadline: Marked as Late Submission' : 'Submission Window Active'}
            </span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Due: {new Date(review.deadline).toLocaleString()}
          </span>
        </div>

        {/* Instructions */}
        {review.instructions && (
          <div style={{
            margin: '16px 24px 0',
            padding: '10px 14px',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
            borderRadius: '10px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
              Guide Instructions:
            </strong>
            {review.instructions}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#F87171',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop File Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? '#6366F1' : selectedFile ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.15)'}`,
              background: isDragging 
                ? 'rgba(99, 102, 241, 0.1)' 
                : selectedFile 
                  ? 'rgba(16, 185, 129, 0.04)' 
                  : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '14px',
              padding: selectedFile ? '16px' : '24px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '16px'
            }}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".pdf,.ppt,.pptx,.zip,.doc,.docx"
            />

            {selectedFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getDocIcon(docType)}
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F8FAFC', wordBreak: 'break-all' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
                      {fileSize} • File selected for defense submission
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    color: '#EF4444',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Change
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818CF8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px'
                }}>
                  <Upload size={20} />
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '4px' }}>
                  Choose file or drag & drop deliverable
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Required: {review.requiredDocType || 'PDF / PPTX'} (Max: 50MB)
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                Deliverable Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="aesthetic-input"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
              >
                <option value="PDF">Technical Report (PDF)</option>
                <option value="PPTX">Presentation Slides (PPT/PPTX)</option>
                <option value="ZIP">Code / Demo Archive (ZIP)</option>
                <option value="DOCX">Word Document (DOCX)</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                File Size
              </label>
              <input
                type="text"
                readOnly
                value={fileSize}
                className="aesthetic-input"
                style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', opacity: 0.8 }}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Submission Notes / Remarks for Guide
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Added Section 4 system design diagrams and implemented Groq inference pipeline..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="aesthetic-input"
              style={{ width: '100%', padding: '10px 12px', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn-aesthetic btn-glass-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-aesthetic btn-primary-glow btn-sm"
              disabled={isSubmitting}
              style={{ minWidth: '140px' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="status-text-loading" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Deliverable</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReviewModal;
