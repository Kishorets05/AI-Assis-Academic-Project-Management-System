const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  abstract: {
    type: String
  },
  problemStatement: {
    type: String,
    required: true
  },
  objectives: [{
    type: String
  }],
  domain: {
    type: String,
    required: true,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  status: {
    type: String,
    required: true,
    enum: [
      'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'Approved',
      'REVISION_REQUIRED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'Waiting'
    ],
    default: 'DRAFT'
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  revisionNotes: {
    type: String,
    default: null
  },
  submittedDate: {
    type: Date
  },
  approvedDate: {
    type: Date
  },
  comments: [{
    author: String,
    text: String,
    time: { type: Date, default: Date.now },
    isGuide: Boolean
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);

