const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');

// Configure public DNS servers to prevent querySrv ECONNREFUSED on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if unsupported in environment
}

// Load environment variables from the root folder
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://college_events_user:Kishore2@cluster0.bedfb3z.mongodb.net/Final_Yr_Project?appName=Cluster0';

// Import Mongoose models
const Department = require('../models/Department');
const Admin = require('../models/Admin');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');
const WeeklyProgress = require('../models/WeeklyProgress');
const Feedback = require('../models/Feedback');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const Review = require('../models/Review');
const ReviewSubmission = require('../models/ReviewSubmission');
const ReviewEvaluation = require('../models/ReviewEvaluation');

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    console.log(`URI: ${MONGO_URI.replace(/:([^@]+)@/, ':****@')}`);
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`Successfully connected to MongoDB: ${mongoose.connection.host} | DB: ${mongoose.connection.name}`);

    // 1. Clear all existing data from separate collections and remove old users collection
    console.log('Clearing existing collections and dropping legacy users...');
    try {
      await mongoose.connection.db.dropCollection('users');
      console.log('Dropped legacy users collection.');
    } catch (e) {
      // Ignore if collection does not exist
    }

    await Department.deleteMany({});
    await Admin.deleteMany({});
    await Faculty.deleteMany({});
    await Student.deleteMany({});
    await Project.deleteMany({});
    await Milestone.deleteMany({});
    await Task.deleteMany({});
    await WeeklyProgress.deleteMany({});
    await Feedback.deleteMany({});
    await Document.deleteMany({});
    await Notification.deleteMany({});
    await Review.deleteMany({});
    await ReviewSubmission.deleteMany({});
    await ReviewEvaluation.deleteMany({});
    console.log('All individual collections cleared successfully.');

    // Hash passwords
    console.log('Hashing passwords...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const standardPassword = await bcrypt.hash('password123', 10);

    // 2. Create Departments
    console.log('Creating departments...');
    const deptsData = [
      { name: 'Computer Science & Engineering', code: 'CSE' },
      { name: 'Electronics & Communication', code: 'ECE' },
      { name: 'Artificial Intelligence & Data Science', code: 'AI&DS' },
      { name: 'Information Technology', code: 'IT' }
    ];
    const departments = await Department.insertMany(deptsData);
    console.log(`Created ${departments.length} departments.`);

    const cseDept = departments.find(d => d.code === 'CSE');
    const eceDept = departments.find(d => d.code === 'ECE');
    const aidsDept = departments.find(d => d.code === 'AI&DS');
    const itDept = departments.find(d => d.code === 'IT');

    // 3. Create Admin in 'admins' collection
    console.log('Creating admin accounts in "admins" collection...');
    const adminUser = await Admin.create({
      name: 'System Admin',
      email: 'admin@vcet.edu.in',
      password: adminPassword,
      role: 'ADMIN',
      department: cseDept._id
    });

    // 4. Create Faculty in 'faculties' collection
    console.log('Creating faculty guide accounts in "faculties" collection...');
    const guideSharma = await Faculty.create({
      name: 'Dr. A. Sharma (HOD)',
      email: 'sharma@vcet.edu.in',
      password: standardPassword,
      role: 'FACULTY',
      facultyId: 'FAC-102',
      designation: 'Professor & HOD',
      maxProjects: 6,
      department: cseDept._id
    });

    const guideDefault = await Faculty.create({
      name: 'Dr. A. Sharma (HOD)',
      email: 'guide@vcet.edu.in',
      password: standardPassword,
      role: 'FACULTY',
      facultyId: 'FAC-101',
      designation: 'Professor & HOD',
      maxProjects: 6,
      department: cseDept._id
    });

    const guideVenkatesh = await Faculty.create({
      name: 'Prof. R. Venkatesh',
      email: 'venkatesh@vcet.edu.in',
      password: standardPassword,
      role: 'FACULTY',
      facultyId: 'FAC-103',
      designation: 'Associate Professor',
      maxProjects: 6,
      department: itDept._id
    });

    const guideLakshmi = await Faculty.create({
      name: 'Dr. M. Lakshmi',
      email: 'lakshmi@vcet.edu.in',
      password: standardPassword,
      role: 'FACULTY',
      facultyId: 'FAC-104',
      designation: 'Professor',
      maxProjects: 6,
      department: aidsDept._id
    });

    const guideAnand = await Faculty.create({
      name: 'Prof. K. Anand',
      email: 'anand.faculty@vcet.edu.in',
      password: standardPassword,
      role: 'FACULTY',
      facultyId: 'FAC-105',
      designation: 'Assistant Professor',
      maxProjects: 6,
      department: eceDept._id
    });

    // 5. Create Students in 'students' collection
    console.log('Creating student accounts in "students" collection...');
    // Team 01 (CSE)
    const kishore = await Student.create({
      name: 'Kishore T S',
      email: 'student@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121104001',
      department: cseDept._id,
      year: 4
    });
    const praveen = await Student.create({
      name: 'Praveen S',
      email: 'praveen@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121104002',
      department: cseDept._id,
      year: 4
    });
    const sanjay = await Student.create({
      name: 'Sanjay V',
      email: 'sanjay@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121104003',
      department: cseDept._id,
      year: 4
    });

    // Team 02 (ECE)
    const anand = await Student.create({
      name: 'Anand M',
      email: 'anand@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121106012',
      department: eceDept._id,
      year: 4
    });
    const bala = await Student.create({
      name: 'Bala K',
      email: 'bala@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121106013',
      department: eceDept._id,
      year: 4
    });
    const chandran = await Student.create({
      name: 'Chandran P',
      email: 'chandran@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121106014',
      department: eceDept._id,
      year: 4
    });

    // Team 03 (AI&DS)
    const rohan = await Student.create({
      name: 'Rohan S',
      email: 'rohan@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121104042',
      department: aidsDept._id,
      year: 4
    });
    const kavya = await Student.create({
      name: 'Kavya M',
      email: 'kavya@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121104043',
      department: aidsDept._id,
      year: 4
    });
    const deepak = await Student.create({
      name: 'Deepak R',
      email: 'deepak@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121104044',
      department: aidsDept._id,
      year: 4
    });

    // Team 04 (IT)
    const meena = await Student.create({
      name: 'Meena K',
      email: 'meena@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121105018',
      department: itDept._id,
      year: 4
    });
    const siddharth = await Student.create({
      name: 'Siddharth P',
      email: 'siddharth@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121105019',
      department: itDept._id,
      year: 4
    });
    const ananya = await Student.create({
      name: 'Ananya G',
      email: 'ananya@vcet.edu.in',
      password: standardPassword,
      role: 'STUDENT',
      regNo: '913121105020',
      department: itDept._id,
      year: 4
    });

    console.log('Successfully created all individual student and faculty accounts.');

    // 6. Create Projects in 'projects' collection
    console.log('Creating projects with student & faculty references...');
    
    // Project 1 (CSE Team - Approved)
    const cseProject = await Project.create({
      title: 'AI-Driven Academic Project Intelligence Platform',
      description: 'A centralized workspace connecting engineering students, faculty guides, and department heads for milestone tracking, code reviews, and evaluation.',
      abstract: 'A centralized workspace connecting engineering students, faculty guides, and department heads for milestone tracking, code reviews, and evaluation.',
      problemStatement: 'Manual tracking of final year academic projects leads to delays, lost documents, and lack of visibility between students and faculty.',
      objectives: [
        'Digitize proposal review and approval workflow.',
        'Provide real-time 8-stage milestone and task management.',
        'Enable weekly progress updates with faculty grading.'
      ],
      domain: 'Artificial Intelligence & Machine Learning',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
      teamMembers: [kishore._id, praveen._id, sanjay._id],
      status: 'APPROVED',
      guide: guideSharma._id,
      department: cseDept._id,
      submittedDate: new Date('2026-08-01'),
      approvedDate: new Date('2026-08-05'),
      revisionNotes: null,
      comments: [
        { author: 'Dr. A. Sharma (HOD)', text: 'Great progress on Phase II architecture diagram! Ensure the API endpoints are documented.', isGuide: true },
        { author: 'Kishore (Team Lead)', text: 'Thank you Sir, we have updated the Vite setup and backend routes.', isGuide: false }
      ]
    });

    // Project 2 (ECE Team - Approved)
    const eceProject = await Project.create({
      title: 'Smart IoT Precision Agriculture Monitoring System',
      description: 'Real-time soil moisture monitoring and automated irrigation control using ESP32, LoRaWAN, and cloud analytics.',
      abstract: 'Real-time soil moisture monitoring and automated irrigation control using ESP32, LoRaWAN, and cloud analytics.',
      problemStatement: 'Uncontrolled agricultural irrigation leads to water wastage and reduced crop yield in arid regions.',
      objectives: [
        'Develop IoT sensor node for moisture and pH.',
        'Implement LoRa long-range wireless telemetry.',
        'Build cloud dashboard for automated solenoid valve control.'
      ],
      domain: 'Internet of Things & Embedded Systems',
      technologies: ['Embedded C', 'ESP32', 'MQTT', 'React', 'ThingsBoard'],
      teamMembers: [anand._id, bala._id, chandran._id],
      status: 'APPROVED',
      guide: guideAnand._id,
      department: eceDept._id,
      submittedDate: new Date('2026-08-03'),
      approvedDate: new Date('2026-08-08'),
      revisionNotes: null,
      comments: []
    });

    // Project 3 (AI&DS Team - Submitted / Under Review)
    const aidsProject = await Project.create({
      title: 'Autonomous Vision-Guided Health Monitoring System',
      description: 'Real-time contactless patient vitals tracking using OpenCV, YOLOv8, and thermal imaging cameras for ICU monitoring.',
      abstract: 'Real-time contactless patient vitals tracking using OpenCV, YOLOv8, and thermal imaging cameras for ICU monitoring.',
      problemStatement: 'Contact-based vital monitoring is intrusive and causes discomfort for neonatal and burn patients.',
      objectives: [
        'Extract remote photoplethysmography (rPPG) from facial video.',
        'Detect body posture anomalies in real time.',
        'Send automated alerts to medical station.'
      ],
      domain: 'Artificial Intelligence & Machine Learning',
      technologies: ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'React'],
      teamMembers: [rohan._id, kavya._id, deepak._id],
      status: 'SUBMITTED',
      guide: null,
      department: aidsDept._id,
      submittedDate: new Date('2026-08-19'),
      approvedDate: null,
      revisionNotes: null,
      comments: []
    });

    // Project 4 (IT Team - Revision Required)
    const itProject = await Project.create({
      title: 'Decentralized Health Records Ledger with Zero-Knowledge Proofs',
      description: 'Patient-controlled Electronic Health Record (EHR) sharing system using Ethereum smart contracts and zk-SNARKs.',
      abstract: 'Patient-controlled Electronic Health Record (EHR) sharing system using Ethereum smart contracts and zk-SNARKs.',
      problemStatement: 'Centralized health record storage is vulnerable to ransomware and data breaches.',
      objectives: [
        'Deploy Solidity smart contracts for access control.',
        'Generate zk-SNARK proofs for zero-knowledge patient verification.',
        'Store encrypted medical records on IPFS.'
      ],
      domain: 'Cybersecurity & Blockchain',
      technologies: ['Solidity', 'Next.js', 'Ethers.js', 'IPFS', 'Circom'],
      teamMembers: [meena._id, siddharth._id, ananya._id],
      status: 'REVISION_REQUIRED',
      guide: guideVenkatesh._id,
      department: itDept._id,
      submittedDate: new Date('2026-08-20'),
      approvedDate: null,
      revisionNotes: 'Please refine the zk-SNARK proving circuit complexity, clarify gas cost optimizations on Ethereum testnet, and specify the encryption algorithm for IPFS storage.',
      comments: []
    });

    // Link Projects back to Student accounts
    console.log('Linking project references back to student accounts...');
    await Student.updateMany({ _id: { $in: [kishore._id, praveen._id, sanjay._id] } }, { project: cseProject._id });
    await Student.updateMany({ _id: { $in: [anand._id, bala._id, chandran._id] } }, { project: eceProject._id });
    await Student.updateMany({ _id: { $in: [rohan._id, kavya._id, deepak._id] } }, { project: aidsProject._id });
    await Student.updateMany({ _id: { $in: [meena._id, siddharth._id, ananya._id] } }, { project: itProject._id });

    // 7. Create 8 Standard Milestones for each project
    console.log('Creating 8 standard milestones for projects...');
    const defaultMilestoneDefs = [
      { num: 1, title: 'Problem Definition', desc: 'Define scope and objectives', due: 'Aug 10, 2026' },
      { num: 2, title: 'Literature Survey', desc: 'Survey papers and tools', due: 'Aug 20, 2026' },
      { num: 3, title: 'Requirements Analysis', desc: 'SRS & specs document', due: 'Aug 30, 2026' },
      { num: 4, title: 'System Design', desc: 'Architecture & schema', due: 'Sep 15, 2026' },
      { num: 5, title: 'Implementation', desc: 'Core system coding', due: 'Oct 15, 2026' },
      { num: 6, title: 'Testing', desc: 'Testing & verification', due: 'Nov 01, 2026' },
      { num: 7, title: 'Documentation', desc: 'Final report manual', due: 'Nov 15, 2026' },
      { num: 8, title: 'Final Presentation', desc: 'Viva demonstration', due: 'Nov 30, 2026' }
    ];

    const createMilestonesForProject = async (projectObj, completedCount, currentProgress) => {
      const milestones = [];
      for (let i = 0; i < defaultMilestoneDefs.length; i++) {
        const item = defaultMilestoneDefs[i];
        let status = 'TODO';
        let completionPercentage = 0;

        if (i < completedCount) {
          status = 'COMPLETED';
          completionPercentage = 100;
        } else if (i === completedCount) {
          status = 'IN_PROGRESS';
          completionPercentage = currentProgress;
        } else {
          status = 'TODO';
          completionPercentage = 0;
        }

        const ms = await Milestone.create({
          project: projectObj._id,
          number: item.num,
          title: item.title,
          description: item.desc,
          dueDate: new Date(item.due),
          status,
          completionPercentage
        });
        milestones.push(ms);
      }
      return milestones;
    };

    const cseMilestones = await createMilestonesForProject(cseProject, 3, 60);
    const eceMilestones = await createMilestonesForProject(eceProject, 3, 50);
    await createMilestonesForProject(aidsProject, 0, 0);
    await createMilestonesForProject(itProject, 0, 0);

    console.log('Successfully created all project milestones.');

    // 8. Create Tasks under Milestones
    console.log('Creating tasks for milestone tracking...');
    
    // CSE Project Tasks
    const cseM4 = cseMilestones[3];
    const cseM5 = cseMilestones[4];

    await Task.create({
      milestone: cseM4._id,
      project: cseProject._id,
      title: 'Design MongoDB Schemas with Mongoose',
      description: 'Separate models: Admin, Faculty, Student, Project, Milestone, WeeklyProgress, Document models',
      priority: 'HIGH',
      dueDate: new Date('2026-09-10'),
      status: 'COMPLETED'
    });

    await Task.create({
      milestone: cseM4._id,
      project: cseProject._id,
      title: 'Build Express REST Endpoints',
      description: 'CRUD routes for auth, projects, and milestones',
      priority: 'MEDIUM',
      dueDate: new Date('2026-09-14'),
      status: 'IN_PROGRESS'
    });

    await Task.create({
      milestone: cseM5._id,
      project: cseProject._id,
      title: 'Implement React Student Workspace UI',
      description: 'Milestones stepper, task list, and weekly progress forms',
      priority: 'HIGH',
      dueDate: new Date('2026-09-25'),
      status: 'TODO'
    });

    // ECE Project Tasks
    const eceM4 = eceMilestones[3];
    await Task.create({
      milestone: eceM4._id,
      project: eceProject._id,
      title: 'Calibrate capacitive soil moisture sensor',
      description: 'Validate sensor readings across multiple soil hydration samples.',
      priority: 'HIGH',
      dueDate: new Date('2026-09-12'),
      status: 'COMPLETED'
    });

    console.log('Successfully created tracking tasks.');

    // 9. Create Weekly Progress Updates
    console.log('Creating weekly progress updates history...');
    
    const cseW1 = await WeeklyProgress.create({
      project: cseProject._id,
      weekNumber: 1,
      workCompleted: 'Finalized problem statement, literature survey, and repository setup.',
      problemsFaced: 'Selecting database schema structure.',
      nextWeekPlan: 'Draft software requirements specification (SRS).',
      progressPercentage: 20,
      submittedBy: kishore._id,
      submissionDate: new Date('2026-08-12')
    });

    const cseW2 = await WeeklyProgress.create({
      project: cseProject._id,
      weekNumber: 2,
      workCompleted: 'Completed SRS and initial UI mockups. Created Express backend routes.',
      problemsFaced: 'None encountered.',
      nextWeekPlan: 'Begin system architecture and schema design for Phase IV.',
      progressPercentage: 35,
      submittedBy: kishore._id,
      submissionDate: new Date('2026-08-19')
    });

    const eceW1 = await WeeklyProgress.create({
      project: eceProject._id,
      weekNumber: 1,
      workCompleted: 'Finished sensor calibration test bench.',
      problemsFaced: 'ADC noise on ESP32 3.3V pin.',
      nextWeekPlan: 'Add RC low-pass filter to sensor output pin.',
      progressPercentage: 25,
      submittedBy: anand._id,
      submissionDate: new Date('2026-08-10')
    });

    console.log('Successfully inserted weekly reports.');

    // 10. Create Faculty Feedbacks
    console.log('Creating faculty feedback logs...');
    
    await Feedback.create({
      project: cseProject._id,
      weeklyProgress: cseW1._id,
      facultyGuide: guideSharma._id,
      feedbackText: 'Good start. Ensure the requirements document covers all 3 user roles.',
      score: 92,
      createdDate: new Date('2026-08-13')
    });

    await Feedback.create({
      project: cseProject._id,
      weeklyProgress: cseW2._id,
      facultyGuide: guideSharma._id,
      feedbackText: 'Consistent weekly cadence. Architecture diagram looks clean.',
      score: 90,
      createdDate: new Date('2026-08-20')
    });

    await Feedback.create({
      project: eceProject._id,
      weeklyProgress: eceW1._id,
      facultyGuide: guideAnand._id,
      feedbackText: 'Good hardware debugging approach. Ensure signal filter is added.',
      score: 90,
      createdDate: new Date('2026-08-11')
    });

    console.log('Successfully inserted feedback logs.');

    // 11. Create Project Documents
    console.log('Creating documents metadata...');
    
    await Document.create({
      project: cseProject._id,
      fileName: 'Project_Synopsis_v1.0.pdf',
      documentType: 'PDF',
      version: '1.0',
      uploadedBy: kishore._id,
      uploaderModel: 'Student',
      uploadDate: new Date('2026-08-05'),
      filePath: '/uploads/TEAM-01/Project_Synopsis_v1.0.pdf'
    });

    await Document.create({
      project: cseProject._id,
      fileName: 'SRS_Document_Final.pdf',
      documentType: 'PDF',
      version: '1.2',
      uploadedBy: kishore._id,
      uploaderModel: 'Student',
      uploadDate: new Date('2026-08-15'),
      filePath: '/uploads/TEAM-01/SRS_Document_Final.pdf'
    });

    await Document.create({
      project: eceProject._id,
      fileName: 'Hardware_Schematic_v1.pdf',
      documentType: 'PDF',
      version: '1.0',
      uploadedBy: anand._id,
      uploaderModel: 'Student',
      uploadDate: new Date('2026-08-08'),
      filePath: '/uploads/TEAM-02/Hardware_Schematic_v1.pdf'
    });

    await Document.create({
      project: aidsProject._id,
      fileName: 'Health_Vision_Synopsis.pdf',
      documentType: 'PDF',
      version: '1.0',
      uploadedBy: rohan._id,
      uploaderModel: 'Student',
      uploadDate: new Date('2026-08-19'),
      filePath: '/uploads/TEAM-03/Health_Vision_Synopsis.pdf'
    });

    await Document.create({
      project: itProject._id,
      fileName: 'EHR_Blockchain_Spec.pdf',
      documentType: 'PDF',
      version: '1.0',
      uploadedBy: meena._id,
      uploaderModel: 'Student',
      uploadDate: new Date('2026-08-20'),
      filePath: '/uploads/TEAM-04/EHR_Blockchain_Spec.pdf'
    });

    console.log('Successfully recorded uploaded document references.');

    // 12. Create Notifications
    console.log('Creating notification logs...');
    
    await Notification.create({
      recipient: kishore._id,
      recipientModel: 'Student',
      sender: adminUser._id,
      senderModel: 'Admin',
      title: 'Project Proposal Approved',
      message: 'Your project proposal "AI-Driven Academic Project Intelligence Platform" was approved by System Admin and assigned to Dr. A. Sharma (HOD).',
      type: 'PROPOSAL_APPROVED',
      read: true
    });

    await Notification.create({
      recipient: kishore._id,
      recipientModel: 'Student',
      sender: guideSharma._id,
      senderModel: 'Faculty',
      title: 'New Feedback on Week 2 Report',
      message: 'Dr. A. Sharma (HOD) commented: "Consistent weekly cadence. Architecture diagram looks clean."',
      type: 'FEEDBACK',
      read: false
    });

    await Notification.create({
      recipient: guideSharma._id,
      recipientModel: 'Faculty',
      sender: rohan._id,
      senderModel: 'Student',
      title: 'New Project Proposal for Review',
      message: 'Team 03 (AI&DS) submitted "Autonomous Vision-Guided Health Monitoring System" for review.',
      type: 'STATUS_CHANGE',
      read: false
    });

    await Notification.create({
      recipient: guideVenkatesh._id,
      recipientModel: 'Faculty',
      sender: meena._id,
      senderModel: 'Student',
      title: 'New Project Proposal for Review',
      message: 'Team 04 (IT) submitted "Decentralized Health Records Ledger with Zero-Knowledge Proofs" for review.',
      type: 'STATUS_CHANGE',
      read: false
    });

    console.log('Successfully populated notifications.');

    // 13. Create Scheduled Reviews & Evaluations
    console.log('Creating reviews, submissions, and evaluation records...');

    // Project 1 (CSE Team) - Review 0: Completed & Graded
    const cseRev0 = await Review.create({
      project: cseProject._id,
      guide: guideSharma._id,
      title: 'Review 0: Synopsis & Idea Defense',
      reviewType: 'Synopsis Defense',
      scheduledDate: new Date('2026-08-06T10:00:00Z'),
      deadline: new Date('2026-08-05T18:00:00Z'),
      instructions: 'Present 10 slides summarizing Problem Statement, Objectives, Tech Stack, and 8-stage timeline.',
      requiredDocType: 'PPTX',
      maxMarks: 50,
      rubricCriteria: [
        { name: 'Problem Statement & Scope', maxScore: 10 },
        { name: 'Literature Survey & Research Gaps', maxScore: 10 },
        { name: 'Methodology & Architecture', maxScore: 15 },
        { name: 'Presentation & Defense', maxScore: 15 }
      ],
      status: 'COMPLETED'
    });

    const cseSub0 = await ReviewSubmission.create({
      review: cseRev0._id,
      project: cseProject._id,
      submittedBy: kishore._id,
      fileName: 'Team01_Review0_Synopsis_Presentation.pptx',
      filePath: '/uploads/reviews/Team01_Review0_Synopsis_Presentation.pptx',
      documentType: 'PPTX',
      fileSize: '3.2 MB',
      notes: 'Initial synopsis presentation slides covering ProjIntel architecture and timeline.',
      submissionTime: new Date('2026-08-04T16:30:00Z'),
      status: 'REVIEWED'
    });

    await ReviewEvaluation.create({
      review: cseRev0._id,
      submission: cseSub0._id,
      evaluator: guideSharma._id,
      evaluationType: 'FACULTY',
      marks: 47,
      maxMarks: 50,
      grade: 'O',
      rubricBreakdown: [
        { criterion: 'Problem Statement & Scope', score: 10, maxScore: 10, remarks: 'Clear and well-formulated problem scope.' },
        { criterion: 'Literature Survey & Research Gaps', score: 9, maxScore: 10, remarks: 'Good survey of 12 recent publications.' },
        { criterion: 'Methodology & Architecture', score: 14, maxScore: 15, remarks: 'Clean full-stack MERN + Groq AI design.' },
        { criterion: 'Presentation & Defense', score: 14, maxScore: 15, remarks: 'Confident presentation and good Q&A responses.' }
      ],
      strengths: [
        'Well-scoped problem statement addressing real academic pain points',
        'Strong full-stack architecture with clean separation of roles'
      ],
      weaknesses: [
        'Ensure real-time sync mechanism is optimized for high concurrent loads'
      ],
      comments: 'Excellent defense. Project proposal accepted with highest honors. Proceed with SRS drafting.',
      feedback: 'Focus on finalizing software requirements specification (SRS) and UML diagram models for Milestone 3.',
      evaluatedTime: new Date('2026-08-06T11:30:00Z')
    });

    // Project 1 (CSE Team) - Review 1: Submitted & Ready for Faculty / AI Evaluation
    const cseRev1 = await Review.create({
      project: cseProject._id,
      guide: guideSharma._id,
      title: 'Review 1: SRS & System Architecture Design',
      reviewType: 'System Architecture',
      scheduledDate: new Date('2026-09-22T14:30:00Z'),
      deadline: new Date('2026-09-20T23:59:00Z'),
      instructions: 'Submit Software Requirements Specification (SRS), Entity-Relationship (ER) diagram, and API routing architecture.',
      requiredDocType: 'PDF',
      maxMarks: 50,
      rubricCriteria: [
        { name: 'Requirements Completeness (SRS)', maxScore: 15 },
        { name: 'Database Design & Schema Integrity', maxScore: 15 },
        { name: 'API Routing & Middleware Architecture', maxScore: 10 },
        { name: 'Viva Readiness & Technical Clarity', maxScore: 10 }
      ],
      status: 'SCHEDULED'
    });

    await ReviewSubmission.create({
      review: cseRev1._id,
      project: cseProject._id,
      submittedBy: kishore._id,
      fileName: 'Team01_Review1_SRS_Architecture.pdf',
      filePath: '/uploads/reviews/Team01_Review1_SRS_Architecture.pdf',
      documentType: 'PDF',
      fileSize: '4.8 MB',
      notes: 'Contains formal SRS document v1.2, detailed Mongoose schema design with separate Student/Faculty/Admin collections, and REST route specifications.',
      submissionTime: new Date('2026-09-19T20:15:00Z'),
      status: 'SUBMITTED'
    });

    // Project 1 (CSE Team) - Review 2: Upcoming Mid-Term
    await Review.create({
      project: cseProject._id,
      guide: guideSharma._id,
      title: 'Review 2: Mid-Term Prototype Implementation & Demo',
      reviewType: 'Mid-Term Progress',
      scheduledDate: new Date('2026-10-25T10:00:00Z'),
      deadline: new Date('2026-10-23T23:59:00Z'),
      instructions: 'Demonstrate live working modules: Student workspace, Guide review portal, and Groq AI inference integration.',
      requiredDocType: 'ZIP',
      maxMarks: 50,
      rubricCriteria: [
        { name: 'Working Prototype & Code Quality', maxScore: 20 },
        { name: 'AI Integration & Accuracy', maxScore: 15 },
        { name: 'UI/UX Aesthetics & Responsiveness', maxScore: 15 }
      ],
      status: 'SCHEDULED'
    });

    // Project 2 (ECE Team) - Review 1: Completed
    const eceRev1 = await Review.create({
      project: eceProject._id,
      guide: guideAnand._id,
      title: 'Review 1: Hardware Schematics & LoRaWAN Spec',
      reviewType: 'System Architecture',
      scheduledDate: new Date('2026-08-25T11:00:00Z'),
      deadline: new Date('2026-08-23T23:59:00Z'),
      instructions: 'Submit EasyEDA circuit diagrams, sensor calibration reports, and LoRa packet structure documentation.',
      requiredDocType: 'PDF',
      maxMarks: 50,
      rubricCriteria: [
        { name: 'Circuit Design & Safety', maxScore: 20 },
        { name: 'Sensor Calibration & Precision', maxScore: 15 },
        { name: 'Presentation & Q&A', maxScore: 15 }
      ],
      status: 'COMPLETED'
    });

    const eceSub1 = await ReviewSubmission.create({
      review: eceRev1._id,
      project: eceProject._id,
      submittedBy: anand._id,
      fileName: 'Team02_Hardware_Circuit_Schematic.pdf',
      filePath: '/uploads/reviews/Team02_Hardware_Circuit_Schematic.pdf',
      documentType: 'PDF',
      fileSize: '2.9 MB',
      notes: 'Sensor calibration data and ESP32 pinout configuration schematic.',
      submissionTime: new Date('2026-08-22T15:00:00Z'),
      status: 'REVIEWED'
    });

    await ReviewEvaluation.create({
      review: eceRev1._id,
      submission: eceSub1._id,
      evaluator: guideAnand._id,
      evaluationType: 'FACULTY',
      marks: 44,
      maxMarks: 50,
      grade: 'A',
      rubricBreakdown: [
        { criterion: 'Circuit Design & Safety', score: 18, maxScore: 20, remarks: 'Good low-pass filter design.' },
        { criterion: 'Sensor Calibration & Precision', score: 13, maxScore: 15, remarks: 'Moisture calibration is precise.' },
        { criterion: 'Presentation & Q&A', score: 13, maxScore: 15, remarks: 'Clear explanation of LoRaWAN frequencies.' }
      ],
      strengths: ['Solid hardware component selection', 'Good calibration experimental methodology'],
      weaknesses: ['Add battery discharge simulation data'],
      comments: 'Good progress. Ensure solar charge controller is integrated safely.',
      feedback: 'Proceed to PCB fabrication for Milestone 5.',
      evaluatedTime: new Date('2026-08-25T12:00:00Z')
    });

    // Project 3 (AI&DS Team) - Review 0: Scheduled
    await Review.create({
      project: aidsProject._id,
      guide: guideLakshmi._id,
      title: 'Review 0: Synopsis & Dataset Feasibility Defense',
      reviewType: 'Synopsis Defense',
      scheduledDate: new Date('2026-09-28T14:00:00Z'),
      deadline: new Date('2026-09-26T23:59:00Z'),
      instructions: 'Submit synopsis presentation covering thermal imaging camera dataset and YOLOv8 pipeline.',
      requiredDocType: 'PPTX',
      maxMarks: 50,
      rubricCriteria: [
        { name: 'Problem Definition & Medical Relevance', maxScore: 15 },
        { name: 'Dataset Pipeline & Annotations', maxScore: 20 },
        { name: 'Presentation & Defense', maxScore: 15 }
      ],
      status: 'SCHEDULED'
    });

    console.log('Successfully seeded reviews, submissions, and evaluations.');
    console.log('\n========================================================================');
    console.log('DATABASE AND REVIEW EVALUATION SYSTEM SEEDED SUCCESSFULLY IN ATLAS!');
    console.log('========================================================================\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run Seeding
seedDatabase();
