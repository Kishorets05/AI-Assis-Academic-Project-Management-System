const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Review = require('../models/Review');
const ReviewSubmission = require('../models/ReviewSubmission');
const ReviewEvaluation = require('../models/ReviewEvaluation');
const Project = require('../models/Project');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const { evaluateReviewWithAI } = require('../services/ai/reviewEvaluator');

// Ensure review uploads directory exists
const reviewUploadDir = path.join(__dirname, '../uploads/reviews');
if (!fs.existsSync(reviewUploadDir)) {
  fs.mkdirSync(reviewUploadDir, { recursive: true });
}

const reviewStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, reviewUploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const uploadReview = multer({
  storage: reviewStorage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Helper to resolve Project ObjectId from string or ObjectId
async function resolveProjectId(projectId) {
  if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
    return projectId;
  }
  const proj = await Project.findOne({
    $or: [
      { title: new RegExp(projectId || '', 'i') }
    ]
  }) || await Project.findOne();
  return proj ? proj._id : null;
}

// Helper to resolve Faculty ObjectId from string or ObjectId
async function resolveFacultyId(guideId) {
  if (guideId && mongoose.Types.ObjectId.isValid(guideId)) {
    return guideId;
  }
  const fac = await Faculty.findOne({
    $or: [
      { facultyId: guideId },
      { email: guideId },
      { name: new RegExp(guideId || '', 'i') }
    ]
  }) || await Faculty.findOne();
  return fac ? fac._id : null;
}

// Helper to resolve Review by ID or title
async function resolveReview(reviewId) {
  if (reviewId && mongoose.Types.ObjectId.isValid(reviewId)) {
    return await Review.findById(reviewId);
  }
  return await Review.findOne({
    $or: [
      { title: new RegExp(reviewId || '', 'i') }
    ]
  }) || await Review.findOne();
}

/**
 * GET /api/reviews/project/:projectId
 * Fetch all reviews for a specific project with submissions and evaluations populated.
 */
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const resolvedPId = await resolveProjectId(projectId);

    const query = resolvedPId ? { project: resolvedPId } : {};
    const reviews = await Review.find(query)
      .populate('guide', 'name email facultyId designation')
      .sort({ scheduledDate: 1 });

    const reviewIds = reviews.map(r => r._id);
    const submissions = await ReviewSubmission.find({ review: { $in: reviewIds } })
      .populate('submittedBy', 'name regNo email');
    const evaluations = await ReviewEvaluation.find({ review: { $in: reviewIds } })
      .populate('evaluator', 'name facultyId');

    // Merge submissions & evaluations into each review payload
    const enrichedReviews = reviews.map(rev => {
      const revObj = rev.toObject();
      revObj.submission = submissions.find(s => s.review.toString() === rev._id.toString()) || null;
      revObj.evaluations = evaluations.filter(e => e.review.toString() === rev._id.toString());
      revObj.officialEvaluation = evaluations.find(e => e.review.toString() === rev._id.toString() && e.evaluationType === 'FACULTY') || null;
      revObj.aiSuggestedEvaluation = evaluations.find(e => e.review.toString() === rev._id.toString() && e.evaluationType === 'AI_SUGGESTED') || null;
      return revObj;
    });

    res.json({ success: true, count: enrichedReviews.length, data: enrichedReviews });
  } catch (err) {
    console.error('Error fetching project reviews:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch project reviews.' });
  }
});

/**
 * GET /api/reviews/guide/:guideId
 * Fetch all reviews assigned to a faculty guide.
 */
router.get('/guide/:guideId', async (req, res) => {
  try {
    const { guideId } = req.params;
    const resolvedGId = await resolveFacultyId(guideId);

    const query = resolvedGId ? { guide: resolvedGId } : {};
    const reviews = await Review.find(query)
      .populate('project', 'title domain status teamMembers')
      .populate('guide', 'name facultyId email')
      .sort({ scheduledDate: 1 });

    const reviewIds = reviews.map(r => r._id);
    const submissions = await ReviewSubmission.find({ review: { $in: reviewIds } })
      .populate('submittedBy', 'name regNo email');
    const evaluations = await ReviewEvaluation.find({ review: { $in: reviewIds } })
      .populate('evaluator', 'name facultyId');

    const enrichedReviews = reviews.map(rev => {
      const revObj = rev.toObject();
      revObj.submission = submissions.find(s => s.review.toString() === rev._id.toString()) || null;
      revObj.evaluations = evaluations.filter(e => e.review.toString() === rev._id.toString());
      revObj.officialEvaluation = evaluations.find(e => e.review.toString() === rev._id.toString() && e.evaluationType === 'FACULTY') || null;
      revObj.aiSuggestedEvaluation = evaluations.find(e => e.review.toString() === rev._id.toString() && e.evaluationType === 'AI_SUGGESTED') || null;
      return revObj;
    });

    res.json({ success: true, count: enrichedReviews.length, data: enrichedReviews });
  } catch (err) {
    console.error('Error fetching guide reviews:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch guide reviews.' });
  }
});

/**
 * POST /api/reviews
 * Guide/Admin schedules a new review.
 */
router.post('/', async (req, res) => {
  try {
    const {
      projectId,
      guideId,
      title,
      reviewType,
      scheduledDate,
      deadline,
      instructions,
      requiredDocType,
      maxMarks,
      rubricCriteria
    } = req.body;

    if (!projectId || !guideId || !title || !scheduledDate || !deadline) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: projectId, guideId, title, scheduledDate, and deadline are mandatory.'
      });
    }

    const resolvedPId = await resolveProjectId(projectId);
    const resolvedGId = await resolveFacultyId(guideId);

    if (!resolvedPId || !resolvedGId) {
      return res.status(400).json({
        success: false,
        error: 'Could not resolve project or guide references.'
      });
    }

    const review = await Review.create({
      project: resolvedPId,
      guide: resolvedGId,
      title,
      reviewType: reviewType || 'REVIEW_1',
      scheduledDate: new Date(scheduledDate),
      deadline: new Date(deadline),
      instructions: instructions || 'Upload presentation slides (PPT/PDF) covering project deliverables.',
      requiredDocType: requiredDocType || 'ALL',
      maxMarks: Number(maxMarks) || 50,
      rubricCriteria: rubricCriteria || [
        { name: 'Problem Statement & Scope', maxScore: 10 },
        { name: 'System Architecture & Design', maxScore: 15 },
        { name: 'Implementation & Demo', maxScore: 15 },
        { name: 'Presentation & Q&A Defense', maxScore: 10 }
      ],
      status: 'SCHEDULED'
    });

    res.status(201).json({ success: true, message: 'Review scheduled successfully.', data: review });
  } catch (err) {
    console.error('Error scheduling review:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to schedule review.' });
  }
});

/**
 * POST /api/reviews/:id/submit
 * Student uploads required review document and submits deliverables.
 */
router.post('/:id/submit', async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const {
      projectId,
      studentId,
      fileName,
      filePath,
      fileUrl,
      documentType,
      fileSize,
      notes
    } = req.body;

    const review = await resolveReview(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review schedule not found.' });
    }

    const isLate = new Date() > new Date(review.deadline);
    const submissionStatus = isLate ? 'LATE' : 'SUBMITTED';

    let resolvedStudentId = studentId;
    if (!resolvedStudentId || !mongoose.Types.ObjectId.isValid(resolvedStudentId)) {
      const student = await Student.findOne() || null;
      resolvedStudentId = student ? student._id : null;
    }

    // Upsert submission (allow student to update their submission before grading)
    const submission = await ReviewSubmission.findOneAndUpdate(
      { review: review._id, project: review.project },
      {
        review: review._id,
        project: review.project,
        submittedBy: resolvedStudentId,
        fileName: fileName || 'Review_Submission.pdf',
        filePath: filePath || `/uploads/reviews/${fileName || 'Review_Submission.pdf'}`,
        fileUrl: fileUrl || '',
        documentType: documentType || 'PDF',
        fileSize: fileSize || '1.5 MB',
        notes: notes || '',
        submissionTime: new Date(),
        status: submissionStatus
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: isLate ? 'Document submitted after deadline (Marked as Late).' : 'Review document submitted successfully.',
      data: submission
    });
  } catch (err) {
    console.error('Error submitting review document:', err);
    res.status(500).json({ success: false, error: 'Failed to submit review document.' });
  }
});

/**
 * POST /api/reviews/:id/upload-deliverable
 * Student uploads an actual file deliverable (PDF, PPT, ZIP) for a review.
 */
router.post('/:id/upload-deliverable', uploadReview.single('file'), async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const {
      projectId,
      studentId,
      documentType,
      notes
    } = req.body;

    const review = await resolveReview(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review schedule not found.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No deliverable file uploaded.' });
    }

    const isLate = new Date() > new Date(review.deadline);
    const submissionStatus = isLate ? 'LATE' : 'SUBMITTED';

    let resolvedStudentId = studentId;
    if (!resolvedStudentId || !mongoose.Types.ObjectId.isValid(resolvedStudentId)) {
      const student = await Student.findOne() || null;
      resolvedStudentId = student ? student._id : null;
    }

    const ext = path.extname(req.file.originalname).replace('.', '').toUpperCase();
    const formattedSize = req.file.size > 1024 * 1024 
      ? (req.file.size / (1024 * 1024)).toFixed(1) + ' MB'
      : (req.file.size / 1024).toFixed(1) + ' KB';
    const relativeFilePath = `/uploads/reviews/${req.file.filename}`;

    const submission = await ReviewSubmission.findOneAndUpdate(
      { review: review._id, project: review.project },
      {
        review: review._id,
        project: review.project,
        submittedBy: resolvedStudentId,
        fileName: req.file.originalname,
        filePath: relativeFilePath,
        fileUrl: relativeFilePath,
        documentType: documentType || ext || 'PDF',
        fileSize: formattedSize,
        notes: notes || '',
        submissionTime: new Date(),
        status: submissionStatus
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: isLate ? 'Deliverable uploaded after deadline (Marked as Late).' : 'Deliverable uploaded and submitted successfully.',
      data: submission
    });
  } catch (err) {
    console.error('Error uploading review deliverable:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to upload review deliverable.' });
  }
});

/**
 * POST /api/reviews/:id/ai-evaluate
 * AI evaluation of a review submission.
 */
router.post('/:id/ai-evaluate', async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const { projectData, submissionData } = req.body;

    const review = await resolveReview(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found.' });
    }

    await review.populate('guide', 'name facultyId');

    let submission = submissionData;
    if (!submission) {
      submission = await ReviewSubmission.findOne({ review: review._id });
    }

    if (!submission) {
      return res.status(400).json({
        success: false,
        error: 'No submission found for this review to evaluate. Please ensure the student has uploaded deliverables.'
      });
    }

    let project = projectData;
    if (!project) {
      project = await Project.findById(review.project);
    }

    const aiResult = await evaluateReviewWithAI(review, submission, project);
    if (!aiResult.success) {
      return res.status(500).json(aiResult);
    }

    // Save or update AI_SUGGESTED evaluation in database for audit trail
    const savedAiEval = await ReviewEvaluation.findOneAndUpdate(
      { review: review._id, submission: submission._id || submission.id, evaluationType: 'AI_SUGGESTED' },
      {
        review: review._id,
        submission: submission._id || submission.id,
        evaluator: review.guide?._id || review.guide,
        evaluationType: 'AI_SUGGESTED',
        marks: aiResult.data.suggestedMarks,
        maxMarks: aiResult.data.maxMarks || review.maxMarks,
        grade: aiResult.data.suggestedGrade || 'A',
        rubricBreakdown: aiResult.data.rubricBreakdown || [],
        strengths: aiResult.data.strengths || [],
        weaknesses: aiResult.data.weaknesses || [],
        comments: aiResult.data.feedbackSummary || 'AI suggested preliminary evaluation.',
        feedback: aiResult.data.vivaQuestions ? `Recommended Viva Questions:\n- ${aiResult.data.vivaQuestions.join('\n- ')}` : '',
        evaluatedTime: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      isAiSuggested: true,
      data: {
        ...aiResult.data,
        evaluationId: savedAiEval._id
      }
    });
  } catch (err) {
    console.error('Error in /api/reviews/:id/ai-evaluate:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate AI review evaluation.' });
  }
});

/**
 * POST /api/reviews/:id/evaluate
 * Guide submits official evaluation & marks.
 */
router.post('/:id/evaluate', async (req, res) => {
  try {
    const { id: reviewId } = req.params;
    const {
      submissionId,
      evaluatorId,
      marks,
      maxMarks,
      grade,
      rubricBreakdown,
      strengths,
      weaknesses,
      comments,
      feedback
    } = req.body;

    if (marks === undefined) {
      return res.status(400).json({ success: false, error: 'Marks are required.' });
    }

    const review = await resolveReview(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found.' });
    }

    const resolvedEvaluatorId = await resolveFacultyId(evaluatorId) || review.guide;

    let actualSubmissionId = submissionId;
    if (!actualSubmissionId || !mongoose.Types.ObjectId.isValid(actualSubmissionId)) {
      const sub = await ReviewSubmission.findOne({ review: review._id });
      if (sub) actualSubmissionId = sub._id;
    }

    // Save official faculty evaluation
    const evaluation = await ReviewEvaluation.findOneAndUpdate(
      { review: review._id, submission: actualSubmissionId, evaluationType: 'FACULTY' },
      {
        review: review._id,
        submission: actualSubmissionId,
        evaluator: resolvedEvaluatorId,
        evaluationType: 'FACULTY',
        marks: Number(marks),
        maxMarks: Number(maxMarks) || review.maxMarks,
        grade: grade || 'A',
        rubricBreakdown: rubricBreakdown || [],
        strengths: strengths || [],
        weaknesses: weaknesses || [],
        comments: comments || 'Review completed successfully.',
        feedback: feedback || '',
        evaluatedTime: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Update submission status to REVIEWED and review status to COMPLETED
    if (actualSubmissionId) {
      await ReviewSubmission.findByIdAndUpdate(actualSubmissionId, { status: 'REVIEWED' });
    }
    await Review.findByIdAndUpdate(review._id, { status: 'COMPLETED' });

    res.json({
      success: true,
      message: 'Official evaluation submitted successfully.',
      data: evaluation
    });
  } catch (err) {
    console.error('Error submitting official review evaluation:', err);
    res.status(500).json({ success: false, error: 'Failed to submit official evaluation.' });
  }
});

module.exports = router;
