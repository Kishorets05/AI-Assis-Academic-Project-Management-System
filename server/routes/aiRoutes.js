const express = require('express');
const router = express.Router();

const { isGroqConfigured } = require('../services/ai/groqClient');
const { explainProjectRisk } = require('../services/ai/riskExplainer');
const { analyzeProposal, analyzeFeasibility } = require('../services/ai/proposalAnalyzer');
const { prioritizeTasks } = require('../services/ai/taskPrioritizer');
const { generateProjectSummary } = require('../services/ai/projectSummary');
const { analyzeWeeklyReport } = require('../services/ai/reportAnalyzer');
const { generateFacultyFeedback } = require('../services/ai/feedbackGenerator');
const { analyzeProjectSimilarity } = require('../services/ai/similarityService');
const { analyzeFacultyWorkload, recommendFacultyAssignment } = require('../services/ai/workloadService');
const { generateAcademicInsights } = require('../services/ai/academicInsights');
const { processAssistantChat } = require('../services/ai/assistantService');
const { calculateProjectRisk } = require('../services/ai/riskEngine');

// 1. Health & Config status
router.get('/health', (req, res) => {
  const configured = isGroqConfigured();
  res.json({
    status: 'ok',
    configured,
    message: configured ? 'AI service is online and configured.' : 'AI service is not configured. Please configure the Groq API key.'
  });
});

// 2. Deterministic Risk calculation only
router.post('/risk-calculate', (req, res) => {
  try {
    const { project } = req.body;
    const result = calculateProjectRisk(project);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to calculate deterministic project risk.' });
  }
});

// 3. Project Risk Explanation
router.post('/risk-explanation', async (req, res) => {
  try {
    const { project } = req.body;
    const result = await explainProjectRisk(project);
    res.json(result);
  } catch (err) {
    console.error('Error in /risk-explanation:', err);
    res.status(500).json({ success: false, error: 'An error occurred during risk explanation.' });
  }
});

// 4. Proposal Analysis
router.post('/proposal-analysis', async (req, res) => {
  try {
    const proposal = req.body.proposal || req.body.project;
    const result = await analyzeProposal(proposal);
    res.json(result);
  } catch (err) {
    console.error('Error in /proposal-analysis:', err);
    res.status(500).json({ success: false, error: 'An error occurred during proposal analysis.' });
  }
});

// 5. Feasibility Analysis
router.post('/feasibility-analysis', async (req, res) => {
  try {
    const proposal = req.body.proposal || req.body.project;
    const result = await analyzeFeasibility(proposal);
    res.json(result);
  } catch (err) {
    console.error('Error in /feasibility-analysis:', err);
    res.status(500).json({ success: false, error: 'An error occurred during feasibility analysis.' });
  }
});

// 6. Task Prioritization
router.post('/task-prioritization', async (req, res) => {
  try {
    const { project } = req.body;
    const result = await prioritizeTasks(project);
    res.json(result);
  } catch (err) {
    console.error('Error in /task-prioritization:', err);
    res.status(500).json({ success: false, error: 'An error occurred during task prioritization.' });
  }
});

// 7. Project Summary
router.post('/project-summary', async (req, res) => {
  try {
    const { project } = req.body;
    const result = await generateProjectSummary(project);
    res.json(result);
  } catch (err) {
    console.error('Error in /project-summary:', err);
    res.status(500).json({ success: false, error: 'An error occurred during project summary generation.' });
  }
});

// 8. Weekly Report Analysis
router.post('/report-analysis', async (req, res) => {
  try {
    const { report, project } = req.body;
    const result = await analyzeWeeklyReport(report, project);
    res.json(result);
  } catch (err) {
    console.error('Error in /report-analysis:', err);
    res.status(500).json({ success: false, error: 'An error occurred during weekly report analysis.' });
  }
});

// 9. Generate Faculty Feedback
router.post('/generate-feedback', async (req, res) => {
  try {
    const { notes, context } = req.body;
    const result = await generateFacultyFeedback(notes, context);
    res.json(result);
  } catch (err) {
    console.error('Error in /generate-feedback:', err);
    res.status(500).json({ success: false, error: 'An error occurred during feedback generation.' });
  }
});

// 10. Project Similarity Detection
router.post('/project-similarity', async (req, res) => {
  try {
    const { project, allProjects } = req.body;
    const result = await analyzeProjectSimilarity(project, allProjects);
    res.json(result);
  } catch (err) {
    console.error('Error in /project-similarity:', err);
    res.status(500).json({ success: false, error: 'An error occurred during project similarity analysis.' });
  }
});

// 11. Faculty Workload Analysis
router.post('/workload-analysis', async (req, res) => {
  try {
    const { projectsList, facultyList } = req.body;
    const result = await analyzeFacultyWorkload(projectsList, facultyList);
    res.json(result);
  } catch (err) {
    console.error('Error in /workload-analysis:', err);
    res.status(500).json({ success: false, error: 'An error occurred during workload analysis.' });
  }
});

// 12. Recommend Faculty Assignment
router.post('/recommend-faculty', async (req, res) => {
  try {
    const { project, facultyList, allProjects } = req.body;
    const result = await recommendFacultyAssignment(project, facultyList, allProjects);
    res.json(result);
  } catch (err) {
    console.error('Error in /recommend-faculty:', err);
    res.status(500).json({ success: false, error: 'An error occurred during faculty recommendation.' });
  }
});

// 13. Academic Intelligence Summary
router.post('/academic-insights', async (req, res) => {
  try {
    const { projectsList, facultyList } = req.body;
    const result = await generateAcademicInsights(projectsList, facultyList);
    res.json(result);
  } catch (err) {
    console.error('Error in /academic-insights:', err);
    res.status(500).json({ success: false, error: 'An error occurred during academic insights generation.' });
  }
});

// 14. Conversational Assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, userRole, context, chatHistory } = req.body;
    const result = await processAssistantChat({ message, userRole, context, chatHistory });
    res.json(result);
  } catch (err) {
    console.error('Error in /chat:', err);
    res.status(500).json({ success: false, error: 'An error occurred during assistant chat processing.' });
  }
});

// 15. AI Review Evaluation
const { evaluateReviewWithAI } = require('../services/ai/reviewEvaluator');
router.post('/review-evaluation', async (req, res) => {
  try {
    const { review, submission, project } = req.body;
    const result = await evaluateReviewWithAI(review, submission, project);
    res.json(result);
  } catch (err) {
    console.error('Error in /review-evaluation:', err);
    res.status(500).json({ success: false, error: 'An error occurred during AI review evaluation.' });
  }
});

module.exports = router;

