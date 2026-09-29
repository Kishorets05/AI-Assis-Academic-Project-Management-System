const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  facultyId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    default: 'FACULTY',
    enum: ['FACULTY', 'Faculty', 'Guide']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  designation: {
    type: String,
    default: 'Faculty Guide'
  },
  maxProjects: {
    type: Number,
    default: 6
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Faculty', FacultySchema);
