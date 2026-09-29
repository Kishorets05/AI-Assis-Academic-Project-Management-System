/**
 * Review & Evaluation Client Service
 * Handles API calls to /api/reviews endpoints with fallback handling.
 */

const API_BASE_URL = 'http://localhost:5000/api/reviews';

export async function fetchProjectReviews(projectId) {
  try {
    const res = await fetch(`${API_BASE_URL}/project/${projectId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[ReviewService] Backend unavailable, using local project review data:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function fetchGuideReviews(guideId) {
  try {
    const res = await fetch(`${API_BASE_URL}/guide/${guideId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[ReviewService] Backend unavailable, using local guide review data:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function scheduleNewReview(reviewPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewPayload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[ReviewService] Schedule review error:`, err);
    return { success: false, error: err.message };
  }
}

export async function submitReviewDeliverable(reviewId, submissionPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/${reviewId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionPayload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[ReviewService] Submit review deliverable error:`, err);
    return { success: false, error: err.message };
  }
}

export async function evaluateReviewWithAIEndpoint(reviewId, projectData, submissionData) {
  try {
    const res = await fetch(`${API_BASE_URL}/${reviewId}/ai-evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectData, submissionData })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[ReviewService] AI review evaluation error:`, err);
    return { success: false, error: err.message };
  }
}

export async function submitOfficialEvaluation(reviewId, evaluationPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/${reviewId}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluationPayload)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[ReviewService] Submit official evaluation error:`, err);
    return { success: false, error: err.message };
  }
}
