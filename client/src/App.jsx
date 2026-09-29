import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import GuideDashboard from './components/GuideDashboard';
import AdminDashboard from './components/AdminDashboard';
import GuidelinesPage from './components/GuidelinesPage';
import LoginModal from './components/LoginModal';
import NewProjectModal from './components/NewProjectModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { 
  scheduleNewReview, 
  submitReviewDeliverable, 
  submitOfficialEvaluation 
} from './services/reviewService';
import './App.css';

// Initial master project dataset adhering to Details.md §4.2, §4.5, §4.6, §4.7, §4.8
const initialProjects = [
  {
    id: 'PROJ-01',
    title: 'AI-Driven Academic Project Intelligence Platform',
    domain: 'Artificial Intelligence & Machine Learning',
    dept: 'Computer Science & Engineering',
    leadName: 'Kishore T S',
    regNo: '913121104001',
    email: 'student@vcet.edu.in',
    teamMembers: ['Kishore T S', 'Praveen S', 'Sanjay V'],
    abstract: 'A centralized workspace connecting engineering students, faculty guides, and department heads for milestone tracking, code reviews, and evaluation.',
    problemStatement: 'Manual tracking of final year academic projects leads to delays, lost documents, and lack of visibility between students and faculty.',
    objectives: '1. Digitize proposal review and approval workflow.\n2. Provide real-time 8-stage milestone and task management.\n3. Enable weekly progress updates with faculty grading.',
    technologies: 'React, Node.js, Express, MongoDB',
    status: 'APPROVED', // 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REVISION_REQUIRED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'
    guideName: 'Dr. A. Sharma (HOD)',
    guideId: 'FAC-102',
    submittedDate: 'Aug 01, 2026',
    approvedDate: 'Aug 05, 2026',
    revisionNotes: null,
    // 8 Standard Milestones (Details.md §4.5)
    milestones: [
      { id: 'm1', number: 1, title: 'Problem Definition', description: 'Define scope and objectives', dueDate: 'Aug 10', status: 'COMPLETED', progress: 100 },
      { id: 'm2', number: 2, title: 'Literature Survey', description: 'Survey papers and tools', dueDate: 'Aug 20', status: 'COMPLETED', progress: 100 },
      { id: 'm3', number: 3, title: 'Requirements Analysis', description: 'SRS & specs document', dueDate: 'Aug 30', status: 'COMPLETED', progress: 100 },
      { id: 'm4', number: 4, title: 'System Design', description: 'Architecture & schema', dueDate: 'Sep 15', status: 'IN_PROGRESS', progress: 60 },
      { id: 'm5', number: 5, title: 'Implementation', description: 'Core system coding', dueDate: 'Oct 15', status: 'TODO', progress: 0 },
      { id: 'm6', number: 6, title: 'Testing', description: 'Testing & verification', dueDate: 'Nov 01', status: 'TODO', progress: 0 },
      { id: 'm7', number: 7, title: 'Documentation', description: 'Final report manual', dueDate: 'Nov 15', status: 'TODO', progress: 0 },
      { id: 'm8', number: 8, title: 'Final Presentation', description: 'Viva demonstration', dueDate: 'Nov 30', status: 'TODO', progress: 0 }
    ],
    // Tasks under milestones (Details.md §4.6)
    tasks: [
      { id: 't1', milestoneId: 'm4', title: 'Design MongoDB Schemas with Mongoose', description: 'User, Project, Milestone, WeeklyProgress, Document models', priority: 'HIGH', dueDate: 'Sep 10', status: 'COMPLETED' },
      { id: 't2', milestoneId: 'm4', title: 'Build Express REST Endpoints', description: 'CRUD routes for auth, projects, and milestones', priority: 'MEDIUM', dueDate: 'Sep 14', status: 'IN_PROGRESS' },
      { id: 't3', milestoneId: 'm5', title: 'Implement React Student Workspace UI', description: 'Milestones stepper, task list, and weekly progress forms', priority: 'HIGH', dueDate: 'Sep 25', status: 'TODO' }
    ],
    // Weekly Progress (Details.md §4.7)
    weeklyUpdates: [
      {
        id: 'w1',
        weekNumber: 1,
        date: 'Aug 12',
        workCompleted: 'Finalized problem statement, literature survey, and repository setup.',
        problemsFaced: 'Selecting database schema structure.',
        nextWeekPlan: 'Draft software requirements specification (SRS).',
        progressPct: 20,
        facultyFeedback: 'Good start. Ensure the requirements document covers all 3 user roles.',
        facultyScore: 92
      },
      {
        id: 'w2',
        weekNumber: 2,
        date: 'Aug 19',
        workCompleted: 'Completed SRS and initial UI mockups. Created Express backend routes.',
        problemsFaced: 'None encountered.',
        nextWeekPlan: 'Begin system architecture and schema design for Phase IV.',
        progressPct: 35,
        facultyFeedback: 'Consistent weekly cadence. Architecture diagram looks clean.',
        facultyScore: 90
      }
    ],
    // Documents (Details.md §4.8)
    documents: [
      { id: 'doc1', fileName: 'Project_Synopsis_v1.0.pdf', docType: 'Synopsis', version: '1.0', uploadDate: 'Aug 05', fileSize: '1.2 MB' },
      { id: 'doc2', fileName: 'SRS_Document_Final.pdf', docType: 'SRS', version: '1.2', uploadDate: 'Aug 15', fileSize: '2.8 MB' }
    ],
    comments: [
      { id: 1, author: 'Dr. A. Sharma (HOD)', text: 'Great progress on Phase II architecture diagram! Ensure the API endpoints are documented.', time: '2 hours ago', isGuide: true },
      { id: 2, author: 'Kishore (Team Lead)', text: 'Thank you Sir, we have updated the Vite setup and backend routes.', time: '1 hour ago', isGuide: false }
    ]
  },
  {
    id: 'PROJ-02',
    title: 'Smart IoT Precision Agriculture Monitoring System',
    domain: 'Internet of Things & Embedded Systems',
    dept: 'Electronics & Communication',
    leadName: 'Anand M',
    regNo: '913121106012',
    email: 'anand@vcet.edu.in',
    teamMembers: ['Anand M', 'Bala K', 'Chandran P'],
    abstract: 'Real-time soil moisture monitoring and automated irrigation control using ESP32, LoRaWAN, and cloud analytics.',
    problemStatement: 'Uncontrolled agricultural irrigation leads to water wastage and reduced crop yield in arid regions.',
    objectives: '1. Develop IoT sensor node for moisture and pH.\n2. Implement LoRa long-range wireless telemetry.\n3. Build cloud dashboard for automated solenoid valve control.',
    technologies: 'Embedded C, ESP32, MQTT, React, ThingsBoard',
    status: 'APPROVED',
    guideName: 'Prof. K. Anand',
    guideId: 'FAC-105',
    submittedDate: 'Aug 03, 2026',
    approvedDate: 'Aug 08, 2026',
    revisionNotes: null,
    milestones: [
      { id: 'm21', number: 1, title: 'Problem Definition', description: 'Define agricultural challenge', dueDate: 'Aug 08', status: 'COMPLETED', progress: 100 },
      { id: 'm22', number: 2, title: 'Literature Survey', description: 'LoRaWAN protocols study', dueDate: 'Aug 18', status: 'COMPLETED', progress: 100 },
      { id: 'm23', number: 3, title: 'Requirements Analysis', description: 'Sensor specifications', dueDate: 'Aug 28', status: 'COMPLETED', progress: 100 },
      { id: 'm24', number: 4, title: 'System Design', description: 'Circuit schematic & PCB', dueDate: 'Sep 15', status: 'IN_PROGRESS', progress: 50 }
    ],
    tasks: [
      { id: 't21', milestoneId: 'm24', title: 'Calibrate capacitive soil moisture sensor', priority: 'HIGH', dueDate: 'Sep 12', status: 'COMPLETED' }
    ],
    weeklyUpdates: [
      {
        id: 'w21',
        weekNumber: 1,
        date: 'Aug 10',
        workCompleted: 'Finished sensor calibration test bench.',
        problemsFaced: 'ADC noise on ESP32 3.3V pin.',
        nextWeekPlan: 'Add RC low-pass filter to sensor output pin.',
        progressPct: 25,
        facultyFeedback: 'Good hardware debugging approach.',
        facultyScore: 90
      }
    ],
    documents: [
      { id: 'doc21', fileName: 'Hardware_Schematic_v1.pdf', docType: 'Design Document', version: '1.0', uploadDate: 'Aug 08', fileSize: '1.5 MB' }
    ],
    comments: []
  },
  {
    id: 'PROJ-03',
    title: 'Autonomous Vision-Guided Health Monitoring System',
    domain: 'Artificial Intelligence & Machine Learning',
    dept: 'Artificial Intelligence & Data Science',
    leadName: 'Rohan S',
    regNo: '913121104042',
    email: 'rohan@vcet.edu.in',
    teamMembers: ['Rohan S', 'Kavya M', 'Deepak R'],
    abstract: 'Real-time contactless patient vitals tracking using OpenCV, YOLOv8, and thermal imaging cameras for ICU monitoring.',
    problemStatement: 'Contact-based vital monitoring is intrusive and causes discomfort for neonatal and burn patients.',
    objectives: '1. Extract remote photoplethysmography (rPPG) from facial video.\n2. Detect body posture anomalies in real time.\n3. Send automated alerts to medical station.',
    technologies: 'Python, PyTorch, OpenCV, FastAPI, React',
    status: 'SUBMITTED', // In review queue
    guideName: null,
    guideId: null,
    submittedDate: 'Aug 19, 2026',
    approvedDate: null,
    revisionNotes: null,
    milestones: [],
    tasks: [],
    weeklyUpdates: [],
    documents: [
      { id: 'doc31', fileName: 'Health_Vision_Synopsis.pdf', docType: 'Synopsis', version: '1.0', uploadDate: 'Aug 19', fileSize: '980 KB' }
    ],
    comments: []
  },
  {
    id: 'PROJ-04',
    title: 'Decentralized Health Records Ledger with Zero-Knowledge Proofs',
    domain: 'Cybersecurity & Blockchain',
    dept: 'Information Technology',
    leadName: 'Meena K',
    regNo: '913121105018',
    email: 'meena@vcet.edu.in',
    teamMembers: ['Meena K', 'Siddharth P', 'Ananya G'],
    abstract: 'Patient-controlled Electronic Health Record (EHR) sharing system using Ethereum smart contracts and zk-SNARKs.',
    problemStatement: 'Centralized health record storage is vulnerable to ransomware and data breaches.',
    objectives: '1. Deploy Solidity smart contracts for access control.\n2. Generate zk-SNARK proofs for zero-knowledge patient verification.\n3. Store encrypted medical records on IPFS.',
    technologies: 'Solidity, Next.js, Ethers.js, IPFS, Circom',
    status: 'REVISION_REQUIRED', // Demonstrating revision request workflow
    guideName: 'Prof. R. Venkatesh',
    guideId: 'FAC-103',
    submittedDate: 'Aug 20, 2026',
    approvedDate: null,
    revisionNotes: 'Please refine the zk-SNARK proving circuit complexity, clarify gas cost optimizations on Ethereum testnet, and specify the encryption algorithm for IPFS storage.',
    milestones: [],
    tasks: [],
    weeklyUpdates: [],
    documents: [
      { id: 'doc41', fileName: 'EHR_Blockchain_Spec.pdf', docType: 'Synopsis', version: '1.0', uploadDate: 'Aug 20', fileSize: '1.4 MB' }
    ],
    comments: []
  }
];

// Initial Master Reviews Dataset adhering to Review & Evaluation System specifications
const initialReviews = [
  {
    id: 'rev-01',
    projectId: 'PROJ-01',
    projectTitle: 'AI-Driven Academic Project Intelligence Platform',
    guideId: 'FAC-102',
    guideName: 'Dr. A. Sharma (HOD)',
    title: 'Review 0: Synopsis & Idea Defense',
    reviewType: 'Synopsis Defense',
    scheduledDate: '2026-08-06T10:00:00Z',
    deadline: '2026-08-05T18:00:00Z',
    instructions: 'Present 10 slides summarizing Problem Statement, Objectives, Tech Stack, and 8-stage timeline.',
    requiredDocType: 'PPTX',
    maxMarks: 50,
    status: 'COMPLETED',
    submission: {
      id: 'sub-01',
      fileName: 'Team01_Review0_Synopsis_Presentation.pptx',
      documentType: 'PPTX',
      fileSize: '3.2 MB',
      notes: 'Initial synopsis presentation slides covering ProjIntel architecture and timeline.',
      submissionTime: '2026-08-04T16:30:00Z',
      status: 'REVIEWED'
    },
    officialEvaluation: {
      marks: 47,
      maxMarks: 50,
      grade: 'O',
      rubricBreakdown: [
        { criterion: 'Problem Statement & Scope', score: 10, maxScore: 10, remarks: 'Clear and well-formulated problem scope.' },
        { criterion: 'Literature Survey & Research Gaps', score: 9, maxScore: 10, remarks: 'Good survey of 12 recent publications.' },
        { criterion: 'Methodology & Architecture', score: 14, maxScore: 15, remarks: 'Clean full-stack MERN + Groq AI design.' },
        { criterion: 'Presentation & Defense', score: 14, maxScore: 15, remarks: 'Confident presentation and good Q&A responses.' }
      ],
      strengths: ['Well-scoped problem statement addressing real academic pain points', 'Strong full-stack architecture with clean separation of roles'],
      weaknesses: ['Ensure real-time sync mechanism is optimized for high concurrent loads'],
      comments: 'Excellent defense. Project proposal accepted with highest honors. Proceed with SRS drafting.',
      feedback: 'Focus on finalizing software requirements specification (SRS) and UML diagram models for Milestone 3.',
      evaluatedTime: '2026-08-06T11:30:00Z'
    }
  },
  {
    id: 'rev-02',
    projectId: 'PROJ-01',
    projectTitle: 'AI-Driven Academic Project Intelligence Platform',
    guideId: 'FAC-102',
    guideName: 'Dr. A. Sharma (HOD)',
    title: 'Review 1: SRS & System Architecture Design',
    reviewType: 'System Architecture',
    scheduledDate: '2026-09-22T14:30:00Z',
    deadline: '2026-09-20T23:59:00Z',
    instructions: 'Submit Software Requirements Specification (SRS), Entity-Relationship (ER) diagram, and API routing architecture.',
    requiredDocType: 'PDF',
    maxMarks: 50,
    status: 'SCHEDULED',
    submission: {
      id: 'sub-02',
      fileName: 'Team01_Review1_SRS_Architecture.pdf',
      documentType: 'PDF',
      fileSize: '4.8 MB',
      notes: 'Contains formal SRS document v1.2, detailed Mongoose schema design with separate Student/Faculty/Admin collections, and REST route specifications.',
      submissionTime: '2026-09-19T20:15:00Z',
      status: 'SUBMITTED'
    },
    officialEvaluation: null
  },
  {
    id: 'rev-03',
    projectId: 'PROJ-01',
    projectTitle: 'AI-Driven Academic Project Intelligence Platform',
    guideId: 'FAC-102',
    guideName: 'Dr. A. Sharma (HOD)',
    title: 'Review 2: Mid-Term Prototype Implementation & Demo',
    reviewType: 'Mid-Term Progress',
    scheduledDate: '2026-10-25T10:00:00Z',
    deadline: '2026-10-23T23:59:00Z',
    instructions: 'Demonstrate live working modules: Student workspace, Guide review portal, and Groq AI inference integration.',
    requiredDocType: 'ZIP',
    maxMarks: 50,
    status: 'SCHEDULED',
    submission: null,
    officialEvaluation: null
  },
  {
    id: 'rev-04',
    projectId: 'PROJ-02',
    projectTitle: 'Smart IoT Precision Agriculture Monitoring System',
    guideId: 'FAC-105',
    guideName: 'Prof. K. Anand',
    title: 'Review 1: Hardware Schematics & LoRaWAN Spec',
    reviewType: 'System Architecture',
    scheduledDate: '2026-08-25T11:00:00Z',
    deadline: '2026-08-23T23:59:00Z',
    instructions: 'Submit EasyEDA circuit diagrams, sensor calibration reports, and LoRa packet structure documentation.',
    requiredDocType: 'PDF',
    maxMarks: 50,
    status: 'COMPLETED',
    submission: {
      id: 'sub-04',
      fileName: 'Team02_Hardware_Circuit_Schematic.pdf',
      documentType: 'PDF',
      fileSize: '2.9 MB',
      notes: 'Sensor calibration data and ESP32 pinout configuration schematic.',
      submissionTime: '2026-08-22T15:00:00Z',
      status: 'REVIEWED'
    },
    officialEvaluation: {
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
      evaluatedTime: '2026-08-25T12:00:00Z'
    }
  },
  {
    id: 'rev-05',
    projectId: 'PROJ-03',
    projectTitle: 'Autonomous Vision-Guided Health Monitoring System',
    guideId: 'FAC-104',
    guideName: 'Dr. M. Lakshmi',
    title: 'Review 0: Synopsis & Dataset Feasibility Defense',
    reviewType: 'Synopsis Defense',
    scheduledDate: '2026-09-28T14:00:00Z',
    deadline: '2026-09-26T23:59:00Z',
    instructions: 'Submit synopsis presentation covering thermal imaging camera dataset and YOLOv8 pipeline.',
    requiredDocType: 'PPTX',
    maxMarks: 50,
    status: 'SCHEDULED',
    submission: {
      id: 'sub-05',
      fileName: 'Team03_Vision_Synopsis_v1.pptx',
      documentType: 'PPTX',
      fileSize: '5.1 MB',
      notes: 'Dataset annotation pipeline & YOLOv8 model architecture.',
      submissionTime: '2026-09-25T14:00:00Z',
      status: 'SUBMITTED'
    },
    officialEvaluation: null
  }
];

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('projintel_theme') || 'dark';
  });

  // Navigation View State: landing | dashboard | guidelines
  const [activeView, setActiveView] = useState('landing');

  // Master Projects List
  const [projectsList, setProjectsList] = useState(initialProjects);

  // Master Reviews List
  const [reviewsList, setReviewsList] = useState(initialReviews);

  // Authenticated User & Modals State
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginInitialMode, setLoginInitialMode] = useState('login'); // 'login' | 'register'
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('projintel_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auth Handlers
  const handleOpenLogin = () => {
    setLoginInitialMode('login');
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    setLoginInitialMode('register');
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveView('dashboard');
    if (userData.isNewUser) {
      showToast(`Welcome ${userData.name}! Account created. You can now create your project proposal.`);
    } else {
      showToast(`Welcome back ${userData.name}! Logged into ${userData.role} Portal.`);
    }
  };

  const handleRegisterUser = (newUser) => {
    // Registered student starts with null project until they create proposal
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('landing');
    showToast('Signed out of session securely.');
  };

  // Project Lifecycle Handlers
  const handleCreateProject = (projectPayload, actionType) => {
    const defaultMilestones = [
      { id: 'm1', number: 1, title: 'Problem Definition', description: 'Define scope and objectives', dueDate: 'Stage 1', status: 'IN_PROGRESS', progress: 30 },
      { id: 'm2', number: 2, title: 'Literature Survey', description: 'Survey papers and tools', dueDate: 'Stage 2', status: 'TODO', progress: 0 },
      { id: 'm3', number: 3, title: 'Requirements Analysis', description: 'SRS & specs document', dueDate: 'Stage 3', status: 'TODO', progress: 0 },
      { id: 'm4', number: 4, title: 'System Design', description: 'Architecture & schema', dueDate: 'Stage 4', status: 'TODO', progress: 0 },
      { id: 'm5', number: 5, title: 'Implementation', description: 'Core system coding', dueDate: 'Stage 5', status: 'TODO', progress: 0 },
      { id: 'm6', number: 6, title: 'Testing', description: 'Testing & verification', dueDate: 'Stage 6', status: 'TODO', progress: 0 },
      { id: 'm7', number: 7, title: 'Documentation', description: 'Final report manual', dueDate: 'Stage 7', status: 'TODO', progress: 0 },
      { id: 'm8', number: 8, title: 'Final Presentation', description: 'Viva demonstration', dueDate: 'Stage 8', status: 'TODO', progress: 0 }
    ];

    const completeProject = {
      ...projectPayload,
      milestones: defaultMilestones,
      tasks: [],
      weeklyUpdates: [],
      documents: [],
      comments: []
    };

    setProjectsList((prev) => [completeProject, ...prev]);

    // Update active user's associated project ID
    if (user && user.role === 'Student') {
      setUser({ ...user, projectId: completeProject.id });
    }

    if (actionType === 'submit') {
      showToast(`Project proposal "${completeProject.title.substring(0, 25)}..." submitted for Faculty Review!`);
    } else {
      showToast(`Project proposal "${completeProject.title.substring(0, 25)}..." saved as Draft.`);
    }
  };

  const handleUpdateProject = (updatedProj) => {
    setProjectsList((prev) =>
      prev.map((p) => (p.id === updatedProj.id ? updatedProj : p))
    );
    showToast(`Project alterations for "${updatedProj.title.substring(0, 25)}..." saved.`);
  };

  const handleSubmitProposal = (projectId) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'UNDER_REVIEW',
            submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }
        return p;
      })
    );
    showToast('Proposal submitted successfully! Placed in Faculty Review Queue.');
  };

  const handleApproveProposal = (projectId, guideName, guideId) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'APPROVED',
            guideName: guideName || 'Dr. A. Sharma (HOD)',
            guideId: guideId || 'FAC-102',
            approvedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }
        return p;
      })
    );
    showToast(`Project ${projectId} approved & assigned to ${guideName}!`);
  };

  const handleRequestRevision = (projectId, revisionNotes) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'REVISION_REQUIRED',
            revisionNotes: revisionNotes
          };
        }
        return p;
      })
    );
    showToast(`Revision request sent to student team for ${projectId}.`);
  };

  const handleRejectProposal = (projectId, reason) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'REJECTED',
            rejectionReason: reason
          };
        }
        return p;
      })
    );
    showToast(`Project proposal ${projectId} declined.`);
  };

  const handleAssignGuide = (projectId, guideName, guideId) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            guideName: guideName,
            guideId: guideId,
            status: p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED' ? 'APPROVED' : p.status
          };
        }
        return p;
      })
    );
    showToast(`Assigned ${guideName} to ${projectId}.`);
  };

  // Task Handlers
  const handleAddTask = (projectId, taskData) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            tasks: [...(p.tasks || []), taskData]
          };
        }
        return p;
      })
    );
    showToast(`New task "${taskData.title}" added to milestone!`);
  };

  const handleUpdateTaskStatus = (projectId, taskId, newStatus) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedTasks = (p.tasks || []).map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          );
          return { ...p, tasks: updatedTasks };
        }
        return p;
      })
    );
    showToast(`Task status updated to ${newStatus}.`);
  };

  // Weekly Progress Handlers
  const handleSubmitWeeklyProgress = (projectId, weeklyData) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            weeklyUpdates: [weeklyData, ...(p.weeklyUpdates || [])]
          };
        }
        return p;
      })
    );
    showToast(`Week #${weeklyData.weekNumber} progress report submitted for review!`);
  };

  const handleGradeWeeklyProgress = (projectId, weekId, score, feedback) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedWeekly = (p.weeklyUpdates || []).map((w) => {
            if (w.id === weekId) {
              return {
                ...w,
                facultyScore: score,
                facultyFeedback: feedback
              };
            }
            return w;
          });
          return { ...p, weeklyUpdates: updatedWeekly };
        }
        return p;
      })
    );
    showToast(`Weekly evaluation saved: ${score}/100 with feedback!`);
  };

  // Document Upload Handler
  const handleUploadDocument = (projectId, docData) => {
    setProjectsList((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            documents: [docData, ...(p.documents || [])]
          };
        }
        return p;
      })
    );
    showToast(`Document "${docData.fileName}" uploaded to project repository.`);
  };

  // Review & Evaluation System Handlers
  const handleScheduleReview = async (reviewPayload) => {
    const newReview = {
      ...reviewPayload,
      id: reviewPayload.id || `rev-${Date.now()}`,
      status: reviewPayload.status || 'SCHEDULED',
      submission: null,
      officialEvaluation: null
    };

    setReviewsList((prev) => [newReview, ...prev]);
    showToast(`Review "${newReview.title}" scheduled for ${newReview.projectTitle || newReview.projectId}!`);

    try {
      const res = await scheduleNewReview(reviewPayload);
      if (res && res.success && res.data) {
        setReviewsList((prev) =>
          prev.map((r) => (r.id === newReview.id ? { ...res.data, id: res.data._id || res.data.id || newReview.id } : r))
        );
      }
    } catch (err) {
      console.warn('Backend sync failed, state retained locally:', err);
    }
  };

  const handleSubmitReviewDeliverable = async (reviewId, submissionPayload) => {
    const newSub = {
      ...submissionPayload,
      id: submissionPayload.id || `sub-${Date.now()}`,
      submissionTime: submissionPayload.submissionTime || new Date().toISOString(),
      status: 'SUBMITTED'
    };

    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId || r._id === reviewId) {
          return {
            ...r,
            status: 'SUBMITTED',
            submission: newSub
          };
        }
        return r;
      })
    );
    showToast(`Review deliverable "${newSub.fileName}" submitted successfully!`);

    try {
      const res = await submitReviewDeliverable(reviewId, submissionPayload);
      if (res && res.success && res.data) {
        setReviewsList((prev) =>
          prev.map((r) => ((r.id === reviewId || r._id === reviewId) ? { ...res.data, id: res.data._id || res.data.id || reviewId } : r))
        );
      }
    } catch (err) {
      console.warn('Backend sync failed, submission retained locally:', err);
    }
  };

  const handleSaveOfficialEvaluation = async (reviewId, evaluationPayload) => {
    const fullEval = {
      ...evaluationPayload,
      evaluatedTime: evaluationPayload.evaluatedTime || new Date().toISOString()
    };

    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId || r._id === reviewId) {
          return {
            ...r,
            status: 'COMPLETED',
            officialEvaluation: fullEval,
            submission: r.submission ? { ...r.submission, status: 'REVIEWED' } : null
          };
        }
        return r;
      })
    );
    showToast(`Official Grade ${fullEval.grade} (${fullEval.marks}/${fullEval.maxMarks}) submitted successfully!`);

    try {
      const res = await submitOfficialEvaluation(reviewId, evaluationPayload);
      if (res && res.success && res.data) {
        setReviewsList((prev) =>
          prev.map((r) => ((r.id === reviewId || r._id === reviewId) ? { ...res.data, id: res.data._id || res.data.id || reviewId } : r))
        );
      }
    } catch (err) {
      console.warn('Backend sync failed, evaluation retained locally:', err);
    }
  };

  // Active student's associated project
  const activeStudentProject = user && user.role === 'Student'
    ? (user.projectId ? projectsList.find((p) => p.id === user.projectId) : projectsList[0])
    : null;

  return (
    <div className="app-main-layout">
      {/* Floating Translucent Pill Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          if (!user && view === 'dashboard') {
            handleOpenLogin();
            return;
          }
          setActiveView(view);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onLogout={handleLogout}
      />

      {/* Main Content View */}
      <main>
        {!user && activeView !== 'guidelines' && (
          <LandingPage 
            onOpenLogin={handleOpenLogin} 
            onOpenRegister={handleOpenRegister} 
          />
        )}

        {!user && activeView === 'guidelines' && (
          <GuidelinesPage />
        )}

        {user && activeView === 'dashboard' && (
          <>
            {user.role === 'Student' && (
              <StudentDashboard
                project={activeStudentProject}
                user={user}
                reviews={reviewsList}
                onUpdateProject={handleUpdateProject}
                onSubmitProposal={handleSubmitProposal}
                onOpenNewProject={() => setIsNewProjectOpen(true)}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onSubmitWeeklyProgress={handleSubmitWeeklyProgress}
                onUploadDocument={handleUploadDocument}
                onSubmitReviewDeliverable={handleSubmitReviewDeliverable}
              />
            )}

            {user.role === 'Faculty' && (
              <GuideDashboard
                projectsList={projectsList}
                reviews={reviewsList}
                currentGuideName={user.name || 'Dr. A. Sharma (HOD)'}
                currentGuideId={user.staffId || 'FAC-102'}
                onApproveProposal={handleApproveProposal}
                onRequestRevision={handleRequestRevision}
                onRejectProposal={handleRejectProposal}
                onGradeWeeklyProgress={handleGradeWeeklyProgress}
                onUpdateProject={handleUpdateProject}
                onScheduleReview={handleScheduleReview}
                onSaveOfficialEvaluation={handleSaveOfficialEvaluation}
              />
            )}

            {user.role === 'Admin' && (
              <AdminDashboard 
                projectsList={projectsList}
                onAssignGuide={handleAssignGuide}
              />
            )}
          </>
        )}

        {user && activeView === 'guidelines' && (
          <GuidelinesPage />
        )}
      </main>

      {/* Institutional Sign In & Register Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
        initialMode={loginInitialMode}
      />

      {/* Create New Project Proposal Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
        user={user}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
