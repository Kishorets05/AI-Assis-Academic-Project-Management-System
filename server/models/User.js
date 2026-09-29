const Student = require('./Student');
const Faculty = require('./Faculty');
const Admin = require('./Admin');

/**
 * Helper utility to find a user across separate Students, Faculties, and Admins collections.
 */
async function findUserByEmail(email) {
  const cleanEmail = email.toLowerCase().trim();
  
  const student = await Student.findOne({ email: cleanEmail }).populate('department').populate('project');
  if (student) return { user: student, role: 'STUDENT', model: 'Student' };

  const faculty = await Faculty.findOne({ email: cleanEmail }).populate('department');
  if (faculty) return { user: faculty, role: 'FACULTY', model: 'Faculty' };

  const admin = await Admin.findOne({ email: cleanEmail }).populate('department');
  if (admin) return { user: admin, role: 'ADMIN', model: 'Admin' };

  return null;
}

module.exports = {
  Student,
  Faculty,
  Admin,
  findUserByEmail
};
