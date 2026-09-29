const mongoose = require('mongoose');

const WeeklyProgressSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  workCompleted: {
    type: String,
    required: true
  },
  problemsFaced: {
    type: String
  },
  nextWeekPlan: {
    type: String
  },
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeeklyProgress', WeeklyProgressSchema);
