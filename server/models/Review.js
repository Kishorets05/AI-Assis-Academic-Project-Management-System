const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  reviewType: {
    type: String,
    enum: [
      'REVIEW_0', 'REVIEW_1', 'REVIEW_2', 'REVIEW_3', 'SPECIAL_REVIEW',
      'Synopsis Defense', 'System Architecture', 'Mid-Term Progress', 'Final Viva & Demo'
    ],
    default: 'REVIEW_1'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  instructions: {
    type: String,
    required: true,
    default: 'Upload presentation slides (PPT/PPTX) and technical report (PDF) covering all milestone deliverables.'
  },
  requiredDocType: {
    type: String,
    enum: ['PDF', 'PPT', 'PPTX', 'DOCX', 'ZIP', 'ALL'],
    default: 'ALL'
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 10,
    max: 100,
    default: 50
  },
  rubricCriteria: [{
    name: { type: String, required: true },
    maxScore: { type: Number, required: true },
    description: { type: String }
  }],
  status: {
    type: String,
    enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', ReviewSchema);
