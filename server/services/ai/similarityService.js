const { callGroqChat } = require('./groqClient');

const SYSTEM_PROMPT = `You are the ProjIntel Academic Project Similarity & Redundancy Advisor.
Compare the subject project proposal with the existing institutional repository projects.
STRICT RULES:
- Do NOT make definitive plagiarism accusations. Wording MUST be advisory (e.g. "Potentially similar project concept", "Conceptually overlapping themes").
- Identify common concepts, technologies, and methodologies.
- Highlight distinctive differentiators or unique innovations.
- Provide a percentage estimate (0-100%) of conceptual similarity.
- Provide clear recommendation for faculty/admin review.`;

/**
 * Compare a project proposal with other projects in the repository.
 */
async function analyzeProjectSimilarity(targetProject, allProjects = []) {
  if (!targetProject || !targetProject.title) {
    return {
      success: false,
      error: 'Target project is required for similarity detection.'
    };
  }

  // Filter out the target project itself from comparisons
  const candidateProjects = allProjects
    .filter(p => p.id !== targetProject.id)
    .map(p => ({
      id: p.id,
      title: p.title,
      domain: p.domain,
      dept: p.dept,
      technologies: p.technologies,
      abstract: p.abstract || '',
      problemStatement: p.problemStatement || ''
    }));

  if (candidateProjects.length === 0) {
    return {
      success: true,
      hasSimilarProjects: false,
      similarityScore: 0,
      commonConcepts: [],
      comparisons: [],
      recommendation: 'No other projects currently in the repository to compare with. Concept appears novel.'
    };
  }

  const prompt = `Evaluate conceptual similarity between the TARGET PROJECT and REPOSITORY PROJECTS:
TARGET PROJECT:
- ID: ${targetProject.id}
- Title: ${targetProject.title}
- Domain: ${targetProject.domain}
- Tech: ${targetProject.technologies}
- Problem: ${targetProject.problemStatement || targetProject.abstract || ''}

REPOSITORY PROJECTS FOR COMPARISON:
${JSON.stringify(candidateProjects, null, 2)}

Provide a JSON object with EXACTLY the following structure:
{
  "maxSimilarityPct": 75,
  "mostSimilarProjectId": "PROJ-01",
  "mostSimilarProjectTitle": "Title of closest match",
  "commonConcepts": [
    "Machine learning for health analytics",
    "Real-time sensor telemetry"
  ],
  "keyDifferences": [
    "Target uses vision-based rPPG while match uses IoT hardware sensors",
    "Target focuses on ICU neonatal monitoring"
  ],
  "comparisons": [
    {
      "projectId": "PROJ-01",
      "title": "...",
      "similarityPct": 45,
      "overlapSummary": "Shares AI and web architecture components."
    }
  ],
  "recommendation": "Review existing project PROJ-01 to ensure clear separation in feature set and unique novelty in literature survey."
}`;

  const result = await callGroqChat([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: prompt }
  ], { jsonMode: true, temperature: 0.1 });

  return result;
}

module.exports = {
  analyzeProjectSimilarity
};
