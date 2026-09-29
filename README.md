# PROJINTEL — AI-Driven Academic Project Intelligence & Management Platform

PROJINTEL is a full-stack, enterprise-grade Academic Project Tracking & Management System engineered for engineering colleges, universities, and capstone project coordination. It connects **Students**, **Faculty Guides**, and **Department Heads / Admins** with end-to-end milestone tracking, AI-assisted proposal analysis, defense reviews with advisory evaluation, weekly progress grading, and a centralized document repository.

---

## 🚀 Key Features & Modules

### 1. 🎓 Student Workspace
- **Proposal Lifecycle**: Create, edit, and submit capstone proposals with problem statements, objectives, and technology stack. Resubmit upon faculty revision requests.
- **8-Stage Milestone Management**: Track stages from *Problem Definition* to *Final Presentation & Viva Demo* with progress percentages.
- **Milestone Task Tracker**: Break down milestone stages into actionable tasks with priority tags (HIGH, MEDIUM, LOW) and status toggles.
- **Weekly Progress Reporting**: Submit weekly updates, problems encountered, and next week's action plans with pre-submission AI blocker detection.
- **Defense Reviews & Deliverables**: View upcoming defense reviews, countdown timers, instructions, and upload technical reports/presentation slides (PDF, PPTX, ZIP).
- **Document Repository**: Drag-and-drop file upload, versioning, category filtering, and direct download links.
- **AI Assistant**: Built-in Groq-powered AI drawer for real-time project guidance, risk explanations, and task prioritization.

### 2. 👨‍🏫 Faculty Guide Portal
- **Proposal Review Queue**: Review submitted project proposals with 1-click **Approve**, **Request Revision** (with specific revision notes), or **Reject**.
- **AI Proposal & Feasibility Analysis**: Automatically evaluate technical scope, feasibility, and architectural rigor.
- **Defense Reviews & Evaluations**:
  - Schedule milestone defense reviews with customized rubrics, deadlines, and maximum marks.
  - Inspect student submissions and uploaded documents.
  - **AI Evaluate**: Trigger advisory AI evaluation that generates suggested marks, letter grade, rubric breakdowns, strengths, weaknesses, and viva defense questions.
  - **Faculty Grading Form**: 1-click sync AI suggestions into official grading with full faculty control over final scores.
- **Weekly Reports & Feedback**: Review weekly progress reports, enter scores (0–100), and generate AI feedback suggestions.
- **Department Document Repository**: Direct download access to all student deliverables across assigned projects.

### 3. 🛡️ Department Admin Portal
- **Project & Guide Allocation**: Allocate faculty guides to approved student teams based on domain and workload balance.
- **Workload Intelligence**: AI-assisted faculty workload analytics and project similarity detection.
- **Department Metrics**: Real-time stats on approved, in-progress, and completed projects.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS Design System with dark/light themes.
- **Backend**: Node.js, Express 5.x, Multer (multipart file uploads).
- **Database**: MongoDB Atlas via Mongoose ODM (collections: `admins`, `faculties`, `students`, `projects`, `reviews`, `reviewsubmissions`, `reviewevaluations`, `documents`, `milestones`, `tasks`, `weeklyprogresses`).
- **AI Engine**: Groq Cloud AI SDK (`llama-3.3-70b-versatile` / `openai/gpt-oss-120b`).

---

## 📂 Project Structure

```
PROJINTEL/
├── client/                     # Vite + React Frontend Application
│   ├── src/
│   │   ├── components/         # Modals, Dashboards, and UI Sections
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── GuideDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentReviewSection.jsx
│   │   │   ├── GuideReviewSection.jsx
│   │   │   ├── SubmitReviewModal.jsx
│   │   │   ├── ReviewEvaluationModal.jsx
│   │   │   ├── ScheduleReviewModal.jsx
│   │   │   ├── DocumentUploadModal.jsx
│   │   │   ├── AIAssistantDrawer.jsx
│   │   │   └── ...
│   │   ├── services/           # REST & AI Service Connectors
│   │   │   ├── aiService.js
│   │   │   ├── reviewService.js
│   │   │   └── documentService.js
│   │   ├── App.jsx             # Main Application Component & State Hub
│   │   └── App.css             # Unified CSS Design Tokens & Utilities
│   └── package.json
│
├── server/                     # Node.js + Express Backend API
│   ├── config/
│   │   └── db.js               # MongoDB Connection & DNS Resolver
│   ├── models/                 # Mongoose Data Models
│   │   ├── Admin.js
│   │   ├── Faculty.js
│   │   ├── Student.js
│   │   ├── Project.js
│   │   ├── Review.js
│   │   ├── ReviewSubmission.js
│   │   ├── ReviewEvaluation.js
│   │   ├── Document.js
│   │   └── ...
│   ├── routes/                 # Express REST Endpoints
│   │   ├── aiRoutes.js         # Centralized AI Inference Routes
│   │   ├── reviewRoutes.js     # Review Scheduling, Submissions & Grading
│   │   └── documentRoutes.js   # Multer Multipart File Uploads & Downloads
│   ├── services/
│   │   └── ai/
│   │       └── reviewEvaluator.js # Groq AI Review Evaluation Engine
│   ├── scripts/
│   │   └── seed.js             # Database Seeding Script
│   ├── uploads/                # File Storage for Documents & Reviews
│   ├── server.js               # Main Express Server Entry Point
│   └── package.json
│
├── .env.example                # Sample Environment Variables
├── .gitignore                  # Git Ignore Rules
├── Sample_Login.txt            # Seeded Credentials Reference
└── README.md                   # Project Documentation
```

---

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Kishorets05/AI-Assis-Academic-Project-Management-System.git
cd AI-Assis-Academic-Project-Management-System
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.bedfb3z.mongodb.net/?appName=Cluster0
DB_NAME=Final_Yr_Project
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. (Optional) Seed the Database
To populate MongoDB Atlas with initial projects, students, faculty, reviews, and document records:
```bash
cd server
node scripts/seed.js
```

### 5. Run the Application
In separate terminal windows:

**Backend Server (Port 5000):**
```bash
cd server
npm start
# or node server.js
```

**Frontend Client (Port 5173):**
```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Credentials

| Role | Email / Login | Password | Notes |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@vcet.edu.in` | `admin123` | Full Department Allocation & Analytics |
| **Faculty Guide (HOD)** | `guide@vcet.edu.in` | `password123` | Proposal approval, AI defense evaluation, grading |
| **Faculty Guide** | `sharma@vcet.edu.in` | `password123` | CSE Faculty Portal |
| **Student Lead** | `student@vcet.edu.in` | `password123` | Associated with PROJ-01 (AI Platform) |
| **Student (IoT)** | `anand@vcet.edu.in` | `password123` | Associated with PROJ-02 (Smart IoT) |
| **Student (Vision)** | `rohan@vcet.edu.in` | `password123` | Associated with PROJ-03 (Vision Health) |
| **Student (Blockchain)** | `meena@vcet.edu.in` | `password123` | Associated with PROJ-04 (Blockchain EHR) |

---

## 📄 License
This project is licensed under the ISC License.
